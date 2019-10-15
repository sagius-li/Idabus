import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl
} from '@angular/forms';

import { DynamicEditor } from '../../models/dynamicEditor.interface';
import { AttributeResource } from '../../models/dataContract.model';
import { BooleanEditorConfig } from '../../models/editorContract.model';

import { UtilsService } from '../../services/utils.service';
import { SwapService } from '../../services/swap.service';
import { createBooleanEditorValidator } from '../../validators/boolean.validator';

@Component({
  selector: 'app-editor-boolean',
  templateUrl: './editor-boolean.component.html',
  styleUrls: ['./editor-boolean.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorBooleanComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditorBooleanComponent),
      multi: true
    }
  ]
})
export class EditorBooleanComponent implements OnInit, DynamicEditor, ControlValueAccessor {
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

  editorConfig: BooleanEditorConfig;
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

  localConfig: BooleanEditorConfig;

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

  constructor(public utils: UtilsService, private swap: SwapService) {}

  ngOnInit() {
    this.initComponent();
  }

  // #region DynamicEditor implementation

  initComponent() {
    this.validationFn = createBooleanEditorValidator(this.attribute, this.localConfig);

    if (this.attribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new BooleanEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    return this.localConfig;
  }

  configure() {
    return null;
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
