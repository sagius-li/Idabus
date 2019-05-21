import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { ComponentConfig, DynamicComponent } from '../../models/dynamicComponent.interface';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';

import { StateCardConfigComponent } from './state-card-config.component';

export class StateCardConfig implements ComponentConfig {
  name = undefined;
  permissionSets = undefined;
  iconText: string;
  iconColor: string;
  backgroundColor: string;
  textColor: string;
  mainTextColor: string;
  title: string;
  mainText: string;
  queryMode: string;
  queryAttribute: string;
  query: string;

  public constructor(init?: Partial<StateCardConfig>) {
    Object.assign(this, init);
  }
}

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

  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private resource: ResourceService,
    private utils: UtilsService
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  resize() {}

  initComponent() {
    this.localConfig = new StateCardConfig({
      name: this.name,
      permissionSets: this.permissionSets,
      iconText: this.iconText,
      iconColor: this.iconColor,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
      mainTextColor: this.mainTextColor,
      title: this.title,
      mainText: this.mainText,
      queryMode: this.queryMode,
      queryAttribute: this.queryAttribute,
      query: this.query
    });

    if (this.config) {
      if (this.config.name) {
        this.localConfig.name = this.config.name;
      }
      if (this.config.permissionSets) {
        this.localConfig.permissionSets = this.config.permissionSets;
      }
      if (this.config.iconText) {
        this.localConfig.iconText = this.config.iconText;
      }
      if (this.config.iconColor) {
        this.localConfig.iconColor = this.config.iconColor;
      }
      if (this.config.backgroundColor) {
        this.localConfig.backgroundColor = this.config.backgroundColor;
      }
      if (this.config.textColor) {
        this.localConfig.textColor = this.config.textColor;
      }
      if (this.config.mainTextColor) {
        this.localConfig.mainTextColor = this.config.mainTextColor;
      }
      if (this.config.title) {
        this.localConfig.title = this.config.title;
      }
      if (this.config.mainText) {
        this.localConfig.mainText = this.config.mainText;
      }
      if (this.config.queryMode) {
        this.localConfig.queryMode = this.config.queryMode;
      }
      if (this.config.queryAttribute) {
        this.localConfig.queryAttribute = this.config.queryAttribute;
      }
      if (this.config.query) {
        this.localConfig.query = this.config.query;
      }
    }

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

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === 'cancel') {
        this.localConfig = configCopy;
      }
      this.updateDataSource();
    });

    return null;
  }

  updateDataSource() {
    if (this.localConfig.query) {
      setTimeout(() => {
        this.localConfig.name ? this.spinner.show(this.localConfig.name) : this.spinner.show();
      }, 0);

      setTimeout(() => {
        this.resource.getResourceCount(this.resource.lookup(this.localConfig.query)).subscribe(
          result => {
            this.mainTextValue = this.localConfig.mainText.replace(/\{0\}/g, result.toString());
            setTimeout(() => {
              this.localConfig.name
                ? this.spinner.hide(this.localConfig.name)
                : this.spinner.hide();
            }, 0);
          },
          () => {
            setTimeout(() => {
              this.localConfig.name
                ? this.spinner.hide(this.localConfig.name)
                : this.spinner.hide();
            }, 0);
          }
        );
      }, 500);
    } else {
      this.mainTextValue = this.localConfig.mainText;
    }
  }

  onUpdateNow() {
    this.updateDataSource();
  }
}
