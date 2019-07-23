import { Component, OnInit, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl
} from '@angular/forms';

import { of } from 'rxjs';

import { AttributeResource } from '../../models/dataContract.model';
import { TextEditorConfig } from '../../models/editorContract.model';
import { DynamicEditor } from '../../models/dynamicEditor.interface';

import { UtilsService } from '../../services/utils.service';
import { createTextEditorValidator } from '../../models/validator.model';

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

  @Input()
  config: TextEditorConfig;

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

  constructor(public utils: UtilsService) {}

  ngOnInit() {
    this.initComponent();
  }

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

  onChange() {
    this.propagateChange(this.controlValue);
    this.propagateTouched();
  }

  // #endregion

  // #region DynamicEditor implementation

  initComponent() {
    this.validationFn = createTextEditorValidator(this.attribute, this.localConfig);

    this.localConfig = new TextEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    return this.localConfig;
  }

  configure() {
    return of(this.localConfig);
  }

  // #endregion

  // #region Validator implementation

  validate(c: FormControl) {
    return this.validationFn(c);
  }

  // #endregion
}
