import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Injector,
  Type,
  forwardRef,
  OnChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';

import { MatDialog } from '@angular/material';

import { tap, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { AttributeEditor } from '../../models/dynamicEditor.interface';
import { SelectEditorConfig } from '../../models/editorContract.model';

import { createSelectEditorValidator } from '../../validators/select.validator';

import { UtilsService } from '../../services/utils.service';
import { ResourceService } from '../../services/resource.service';
import { SwapService } from '../../services/swap.service';
import { ConfigService } from '../../services/config.service';

import { EditorSelectConfigComponent } from './editor-select-config.component';
import { ResourceSet } from '../../models/dataContract.model';
import { ExtraValuePipe } from '../../pipes/extra-value.pipe';

@Component({
  selector: 'app-editor-select',
  templateUrl: './editor-select.component.html',
  styleUrls: ['./editor-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditorSelectComponent),
      multi: true
    }
  ]
})
export class EditorSelectComponent extends AttributeEditor
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {
  localConfig = new SelectEditorConfig();

  dataSource: Observable<Array<{ value: string; text: string }>> = of([]);

  getDataSource() {
    switch (this.localConfig.dataMode) {
      case 'static':
        this.dataSource = of(this.localConfig.options);
        break;
      case 'config':
        if (this.localConfig.configKey) {
          this.dataSource = of(this.configService.getConfig(this.localConfig.configKey, []));
        }
        break;
      case 'query':
        if (
          this.localConfig.query &&
          this.localConfig.valueAttribute &&
          this.localConfig.textAttribute
        ) {
          const attributeNames = [this.localConfig.valueAttribute];
          if (this.localConfig.valueAttribute !== this.localConfig.textAttribute) {
            attributeNames.push(this.localConfig.textAttribute);
          }
          this.dataSource = this.resource
            .getResourceByQuery(this.localConfig.query, attributeNames)
            .pipe(
              switchMap((resources: ResourceSet) => {
                if (resources.totalCount > 0) {
                  const retVal: Array<{ text: string; value: string }> = [];
                  resources.results.forEach(data => {
                    retVal.push({
                      text: this.extraValuePipe.transform(
                        data,
                        this.localConfig.textAttribute + ':value'
                      ),
                      value: this.extraValuePipe.transform(
                        data,
                        this.localConfig.valueAttribute + ':value'
                      )
                    });
                  });
                  return of(retVal);
                }
                return of([]);
              })
            );
        }
        break;
      default:
        break;
    }
  }

  constructor(
    public utils: UtilsService,
    public resource: ResourceService,
    private dialog: MatDialog,
    private swap: SwapService,
    private host: ElementRef,
    private injector: Injector,
    private configService: ConfigService,
    private extraValuePipe: ExtraValuePipe
  ) {
    super();
  }

  ngOnInit() {
    this.initComponent();
  }

  ngOnChanges(changes: any) {
    if (changes.config) {
      this.validationFn = createSelectEditorValidator(this.config);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const ngControl: NgControl = this.injector.get<NgControl>(NgControl as Type<NgControl>);
      if (ngControl) {
        this.control = ngControl.control as FormControl;
      }

      try {
        if (!this.showEditor(this.resource.rightSets)) {
          this.host.nativeElement.parentElement.remove();
        }
      } catch {}
    });
  }

  // #region AttributeEditor implementation

  initComponent() {
    if (this.editorAttribute && this.editorAttribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new SelectEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    this.getDataSource();

    return this.localConfig;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(EditorSelectConfigComponent, {
      minWidth: '620px',
      data: {
        component: this,
        config: this.localConfig,
        attribute: this.editorAttribute
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.localConfig = configCopy;
          this.getDataSource();
        } else {
          this.config = this.localConfig;
          this.getDataSource();
          this.validationFn = createSelectEditorValidator(this.localConfig);
        }
      }),
      switchMap(() => {
        return of(this.localConfig);
      })
    );
  }

  // #endregion

  // #region Event handler

  onFocuse() {
    this.propagateTouched();
  }

  onChange() {
    this.swap.propagateEditorValueChanged(this.localConfig.attributeName);
  }

  // #endregion
}
