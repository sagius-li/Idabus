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
  config = new SelectEditorConfig();

  dataSource: Observable<Array<{ value: string; text: string }>> = of([]);

  setDataSource(query: string = null) {
    switch (this.config.dataMode) {
      case 'static':
        this.dataSource = of(this.config.options);
        break;
      case 'config':
        if (this.config.configKey) {
          this.dataSource = of(this.configService.getConfig(this.config.configKey, []));
        }
        break;
      case 'query':
        const theQuery = query ? query : this.config.query;
        if (theQuery && this.config.valueAttribute && this.config.textAttribute) {
          const regEx: RegExp = /\[#\w+\]/g;
          const match = regEx.exec(theQuery);
          if (match && match.length > 0) {
            const attributeName = match[0].substr(2, match[0].length - 3);
            this.swap.propagateEditorConfigChanged(attributeName);
            return;
          }

          const attributeNames = [this.config.valueAttribute];
          if (this.config.valueAttribute !== this.config.textAttribute) {
            attributeNames.push(this.config.textAttribute);
          }
          this.dataSource = this.resource.getResourceByQuery(theQuery, attributeNames).pipe(
            switchMap((resources: ResourceSet) => {
              if (resources.totalCount > 0) {
                const retVal: Array<{ text: string; value: string }> = [];
                resources.results.forEach(data => {
                  retVal.push({
                    text: this.extraValuePipe.transform(data, this.config.textAttribute + ':value'),
                    value: this.extraValuePipe.transform(
                      data,
                      this.config.valueAttribute + ':value'
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
      this.setDataSource();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const ngControl: NgControl = this.injector.get<NgControl>(NgControl as Type<NgControl>);
      if (ngControl) {
        this.control = ngControl.control as FormControl;
      }

      try {
        if (!this.configMode && !this.showEditor(this.resource.rightSets)) {
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

    const initConfig = new SelectEditorConfig();
    this.utils.CopyInto(this.config, initConfig, true, true);
    this.config = initConfig;

    this.setDataSource();

    return this.config;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.config);

    const dialogRef = this.dialog.open(EditorSelectConfigComponent, {
      minWidth: '620px',
      data: {
        component: this,
        config: this.config,
        attribute: this.editorAttribute
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.config = configCopy;
          this.setDataSource();
        } else {
          this.setDataSource();
          this.validationFn = createSelectEditorValidator(this.config);
        }
      }),
      switchMap(() => {
        return of(this.config);
      })
    );
  }

  // #endregion

  // #region Event handler

  onFocuse() {
    this.propagateTouched();
  }

  onChange() {
    if (this.change.observers.length > 0) {
      this.change.emit(this.value);
    } else {
      this.swap.propagateEditorValueChanged(this.config.attributeName);
    }
  }

  // #endregion
}
