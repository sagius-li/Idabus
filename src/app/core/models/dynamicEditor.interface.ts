import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { AttributeResource } from './dataContract.model';

/**
 * Interface for editor configuration
 */
export class EditorConfig {
  name?: string;
  editMode?: boolean;
  isHidden?: boolean;
  readOnly?: boolean;
  required?: boolean;
  requiredFromSchema?: boolean;
  showTooltip?: boolean;
  showDisplayName?: boolean;
  customDisplayName?: string;
  showDescription?: boolean;
  customDescription?: string;
  hideIfNoAccess?: boolean;
  expression?: string;
  accessAllowed?: Array<string>;
  accessDenied?: Array<string>;
  accessUsedFor?: string;

  constructor() {
    this.name = undefined;
    this.editMode = true;
    this.isHidden = false;
    this.showTooltip = true;
    this.showDisplayName = true;
    this.customDisplayName = undefined;
    this.showDescription = true;
    this.customDescription = undefined;
    this.readOnly = false;
    this.required = false;
    this.requiredFromSchema = false;
    this.hideIfNoAccess = true;
    this.expression = undefined;
    this.accessAllowed = [];
    this.accessDenied = [];
    this.accessUsedFor = 'visibility';
  }
}

/**
 * Interface for editor, which can be created dynamically
 */
export interface DynamicEditor {
  /** Editor configuration */
  config: EditorConfig;

  /** Initialize editor */
  initComponent: () => EditorConfig;
  /** configure editor */
  configure: () => Observable<EditorConfig>;
}

/**
 * Interface for editor result, holding all information of editor attribute and form control
 */
export interface EditorResult {
  type: string;
  config: EditorConfig;
  attribute: AttributeResource;
  controller: FormControl;
}

export class AttributeEditor implements DynamicEditor {
  editorConfig: EditorConfig;
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
  controlValue: any;
  get value() {
    return this.controlValue.value;
  }
  set value(value) {
    this.controlValue.value = value;
    this.propagateChange(this.controlValue);
  }

  @Input()
  configMode = false;

  validationFn: (c: FormControl) => any;

  control: FormControl;

  localConfig: EditorConfig;

  private permissionCanRead(permissionHint: string): boolean {
    if (!permissionHint) {
      return true;
    } else {
      if (permissionHint.match(/read/i)) {
        return true;
      } else {
        return false;
      }
    }
  }

  private permissionCanModify(permissionHint: string): boolean {
    if (!permissionHint) {
      return true;
    } else {
      if (permissionHint.match(/modify/i)) {
        return true;
      } else {
        return false;
      }
    }
  }

  private inDeniedList(rightSets: string[]) {
    if (rightSets && rightSets.length > 0) {
      if (this.localConfig.accessDenied && this.localConfig.accessDenied.length > 0) {
        if (rightSets.indexOf('Administrators') >= 0) {
          return false;
        }
        for (const deniedSet of this.localConfig.accessDenied) {
          if (rightSets.indexOf(deniedSet) >= 0) {
            return true;
          }
        }
      }
    } else {
      return true;
    }

    return false;
  }

  private inAllowedList(rightSets: string[]) {
    if (rightSets && rightSets.length > 0) {
      if (this.localConfig.accessAllowed && this.localConfig.accessAllowed.length > 0) {
        if (rightSets.indexOf('Administrators') >= 0) {
          return true;
        }
        for (const deniedSet of this.localConfig.accessAllowed) {
          if (rightSets.indexOf(deniedSet) >= 0) {
            return true;
          }
        }
      } else {
        return true;
      }
    }

    return false;
  }

  get readAccess() {
    if (!this.controlValue) {
      return false;
    }

    return this.permissionCanRead(this.controlValue.permissionHint);
  }

  get writeAccess() {
    if (!this.controlValue) {
      return false;
    }

    return this.permissionCanModify(this.controlValue.permissionHint);
  }

  get displayName() {
    if (this.localConfig.showDisplayName && this.controlValue) {
      if (this.localConfig.customDisplayName) {
        return this.localConfig.customDisplayName;
      } else {
        return this.controlValue.displayName;
      }
    } else {
      return undefined;
    }
  }

  get description() {
    if (this.localConfig.showDescription && this.controlValue) {
      if (this.localConfig.customDescription) {
        return this.localConfig.customDescription;
      } else {
        return this.controlValue.description;
      }
    } else {
      return undefined;
    }
  }

  get tooltip() {
    if (this.localConfig.showTooltip && this.controlValue) {
      return this.controlValue.systemName;
    } else {
      return null;
    }
  }

  disabled(rightSets: string[] = []) {
    if (this.localConfig.readOnly || !this.writeAccess) {
      return true;
    }

    if (this.localConfig.accessUsedFor === 'editability') {
      if (this.inDeniedList(rightSets)) {
        return true;
      }
      if (this.inAllowedList(rightSets)) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  }

  showEditor(rightSets: string[] = []) {
    if (this.localConfig.isHidden) {
      return false;
    }

    if (this.localConfig.hideIfNoAccess && !this.readAccess) {
      return false;
    }

    if (this.localConfig.accessUsedFor === 'visibility') {
      if (this.inDeniedList(rightSets)) {
        return false;
      }
      if (this.inAllowedList(rightSets)) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  // #region DynamicEditor implementation

  initComponent() {
    return null;
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

  // #endregion

  // #region Validator implementation

  validate(c: FormControl) {
    return this.validationFn(c);
  }

  // #endregion
}
