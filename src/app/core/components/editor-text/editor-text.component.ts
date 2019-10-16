import { Component, OnInit, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { DynamicEditor } from '../../models/dynamicEditor.interface';
import { AttributeResource } from '../../models/dataContract.model';
import { TextEditorConfig } from '../../models/editorContract.model';

import { createTextEditorValidator } from '../../validators/text.validator';

import { UtilsService } from '../../services/utils.service';
import { SwapService } from '../../services/swap.service';

import { EditorTextConfigComponent } from './editor-text-config.component';

@Component({
  selector: 'app-editor-text',
  templateUrl: './editor-text.component.html',
  styleUrls: ['./editor-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorTextComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditorTextComponent),
      multi: true
    }
  ]
})
export class EditorTextComponent implements OnInit, DynamicEditor, ControlValueAccessor {
  @Input()
  attribute: AttributeResource;

  @Input()
  controlValue: any;
  get value() {
    return this.controlValue ? this.controlValue : this.attribute.value;
  }
  set value(value) {
    this.controlValue = value;
    this.propagateChange(this.controlValue);
  }

  editorConfig: TextEditorConfig;
  @Input()
  get config() {
    return this.editorConfig;
  }
  set config(value) {
    this.editorConfig = value;
    this.configChange.emit(this.editorConfig);
  }
  @Output()
  configChange = new EventEmitter();

  @Input()
  control: FormControl;

  @Input()
  configMode = false;

  validationFn: (c: FormControl) => any;

  localConfig: TextEditorConfig;

  get showEditor() {
    if (this.localConfig.isHidden) {
      return true;
    }

    if (
      this.localConfig.hideIfNoAccess &&
      !this.utils.PermissionCanRead(this.attribute.permissionHint)
    ) {
      return false;
    }

    return true;
  }

  get disabled() {
    if (
      this.localConfig.readOnly ||
      !this.utils.PermissionCanModify(this.attribute.permissionHint)
    ) {
      return true;
    }

    return false;
  }

  get displayName() {
    if (this.localConfig.showDisplayName) {
      if (this.localConfig.customDisplayName) {
        return this.localConfig.customDisplayName;
      } else {
        return this.attribute.displayName;
      }
    } else {
      return undefined;
    }
  }

  get description() {
    if (this.localConfig.showDescription) {
      if (this.localConfig.customDescription) {
        return this.localConfig.customDescription;
      } else {
        return this.attribute.description;
      }
    } else {
      return undefined;
    }
  }

  get tooltip() {
    if (this.localConfig.showTooltip && this.attribute) {
      return this.attribute.systemName;
    } else {
      return null;
    }
  }

  constructor(public utils: UtilsService, private dialog: MatDialog, private swap: SwapService) {}

  ngOnInit() {
    this.initComponent();
  }

  // #region DynamicEditor implementation

  initComponent() {
    this.validationFn = createTextEditorValidator(this.attribute, this.localConfig);

    if (this.attribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new TextEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    return this.localConfig;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(EditorTextConfigComponent, {
      minWidth: '620px',
      data: {
        component: this,
        config: this.localConfig,
        attribute: this.attribute
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.localConfig = configCopy;
        } else {
          this.config = this.localConfig;
          this.validationFn = createTextEditorValidator(this.attribute, this.localConfig);
        }
      }),
      switchMap(() => {
        return of(this.localConfig);
      })
    );
  }

  // #endregion

  // #region ControlValueAccessor implementation

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  writeValue(value: any) {
    this.controlValue = value;
  }

  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.propagateTouched = fn;
  }

  onFocuse() {
    this.propagateTouched();
  }

  onChange() {
    this.swap.changeEditorValue(this.localConfig.name);
  }

  // #endregion

  // #region Validator implementation

  validate(c: FormControl) {
    return this.validationFn(c);
  }

  // #endregion
}
