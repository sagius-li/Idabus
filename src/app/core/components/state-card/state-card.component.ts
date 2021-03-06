import { Component, OnInit, Input } from '@angular/core';

import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { DynamicComponent } from '../../models/dynamicComponent.interface';
import { StateCardConfig } from '../../models/componentContract.model';

import { ExtraValuePipe } from '../../pipes/extra-value.pipe';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';

import { StateCardConfigComponent } from './state-card-config.component';

@Component({
  selector: 'app-state-card',
  templateUrl: './state-card.component.html',
  styleUrls: ['./state-card.component.scss']
})
export class StateCardComponent implements OnInit, DynamicComponent {
  @Input()
  config: StateCardConfig;

  @Input()
  name = undefined;
  @Input()
  permissionSets = undefined;
  @Input()
  iconText = 'public';
  @Input()
  iconColor = 'darkseagreen';
  @Input()
  backgroundColor = 'white';
  @Input()
  textColor = 'darkgray';
  @Input()
  mainTextColor = 'black';
  @Input()
  title = 'title';
  @Input()
  mainText = 'text';
  @Input()
  queryMode = 'counter';
  @Input()
  queryAttribute = undefined;
  @Input()
  query: string = undefined;

  localConfig: StateCardConfig;
  mainTextValue: string;
  spinnerType = SPINNER;

  constructor(
    private dialog: MatDialog,
    private spinner: NgxUiLoaderService,
    private resource: ResourceService,
    private utils: UtilsService,
    private extraValuePipe: ExtraValuePipe
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  resize() {}

  initComponent() {
    this.localConfig = new StateCardConfig();

    this.utils.CopyInto(this, this.localConfig, true);

    this.utils.CopyInto(this.config, this.localConfig, true, true);

    this.updateDataSource();

    return this.localConfig;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(StateCardConfigComponent, {
      minWidth: '420px',
      data: {
        component: this,
        config: this.localConfig
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.localConfig = configCopy;
        }
        this.updateDataSource();
      }),
      switchMap(() => {
        return of(this.localConfig);
      })
    );
  }

  updateDataSource() {
    if (this.localConfig.query) {
      this.spinner.startLoader(this.localConfig.name);

      setTimeout(() => {
        if (this.localConfig.queryMode === 'counter') {
          this.resource.getResourceCount(this.resource.lookup(this.localConfig.query)).subscribe(
            result => {
              this.mainTextValue = this.localConfig.mainText.replace(/\{0\}/g, result.toString());
              this.spinner.stopLoader(this.localConfig.name);
            },
            () => {
              this.spinner.stopLoader(this.localConfig.name);
            }
          );
        } else {
          this.resource
            .getResourceByQuery(
              this.resource.lookup(this.localConfig.query),
              [this.localConfig.queryAttribute],
              1,
              0,
              true
            )
            .subscribe(
              result => {
                if (result && result.totalCount > 0) {
                  let value = this.extraValuePipe.transform(
                    result.results[0],
                    `${this.localConfig.queryAttribute}:DisplayName`
                  );
                  value = value ? value : 'n.a.';
                  this.mainTextValue = this.localConfig.mainText.replace(/\{0\}/g, value);
                }
                this.spinner.stopLoader(this.localConfig.name);
              },
              () => {
                this.mainTextValue = 'err.';
                this.spinner.stopLoader(this.localConfig.name);
              }
            );
        }
      }, 500);
    } else {
      this.mainTextValue = this.localConfig.mainText;
    }
  }

  onUpdateNow() {
    this.updateDataSource();
  }
}
