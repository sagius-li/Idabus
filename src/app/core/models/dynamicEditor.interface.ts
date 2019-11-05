import { FormControl } from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';

import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material';

import { Observable } from 'rxjs';

import { AttributeResource } from './dataContract.model';

/**
 * Interface for editor configuration
 */
export class EditorConfig {
  name?: string;
  attributeName?: string;
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
  validation?: string;
  accessAllowed?: Array<string>;
  accessDenied?: Array<string>;
  accessExpression?: string;
  accessUsedFor?: string;
  calculatedDisplayable?: boolean;
  calculatedEditable?: boolean;

  constructor() {
    this.name = undefined;
    this.attributeName = undefined;
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
    this.validation = undefined;
    this.accessAllowed = [];
    this.accessDenied = [];
    this.accessExpression = undefined;
    this.accessUsedFor = 'visibility';
    this.calculatedDisplayable = true;
    this.calculatedEditable = true;
  }
}

/**
 * Interface for editor, which can be created dynamically
 */
export interface DynamicEditor {
  /** Attribute of the editor */
  attribute: AttributeResource;
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
  editorAttribute: AttributeResource;

  get attribute() {
    return this.editorAttribute;
  }
  set attribute(value) {
    this.editorAttribute = value;
    this.propagateChange(this.editorAttribute);
  }

  get value() {
    return this.editorAttribute ? this.editorAttribute.value : null;
  }
  set value(value) {
    this.editorAttribute.value = value;
    this.propagateChange(this.editorAttribute);
  }

  @Input()
  configMode = false;

  @Output()
  change = new EventEmitter<any>();

  validationFn: (c: FormControl) => any;

  control: FormControl;

  dataSource: Observable<Array<{ value: string; text: string }>>;

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
      if (this.config.accessDenied && this.config.accessDenied.length > 0) {
        // if (rightSets.indexOf('Administrators') >= 0) {
        //   return false;
        // }
        for (const deniedSet of this.config.accessDenied) {
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
      if (this.config.accessAllowed && this.config.accessAllowed.length > 0) {
        // if (rightSets.indexOf('Administrators') >= 0) {
        //   return true;
        // }
        for (const deniedSet of this.config.accessAllowed) {
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
    if (!this.editorAttribute) {
      return false;
    }

    return this.permissionCanRead(this.editorAttribute.permissionHint);
  }

  get writeAccess() {
    if (!this.editorAttribute) {
      return false;
    }

    return this.permissionCanModify(this.editorAttribute.permissionHint);
  }

  get displayName() {
    if (this.config.showDisplayName && this.editorAttribute) {
      if (this.config.customDisplayName) {
        return this.config.customDisplayName;
      } else {
        return this.editorAttribute.displayName;
      }
    } else {
      return undefined;
    }
  }

  get description() {
    if (this.config.showDescription && this.editorAttribute) {
      if (this.config.customDescription) {
        return this.config.customDescription;
      } else {
        return this.editorAttribute.description;
      }
    } else {
      return undefined;
    }
  }

  get tooltip() {
    if (this.config.showTooltip && this.editorAttribute) {
      return this.editorAttribute.systemName;
    } else {
      return null;
    }
  }

  disabled(rightSets: string[] = []) {
    if (!this.config.calculatedEditable) {
      return true;
    }

    if (this.config.readOnly || !this.writeAccess) {
      return true;
    }

    if (this.config.accessUsedFor === 'editability') {
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
    if (!this.config.calculatedDisplayable) {
      return false;
    }

    if (this.config.isHidden) {
      return false;
    }

    if (this.config.hideIfNoAccess && !this.readAccess) {
      return false;
    }

    if (this.config.accessUsedFor === 'visibility') {
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

  setDataSource(query: string = null) {}

  setDisplay(usedFor: string = null, optionValue: boolean = null) {}

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
    this.editorAttribute = value;
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
    if (this.validationFn) {
      return this.validationFn(c);
    }
  }

  // #endregion
}

export class AttributeEditorConfig {
  data: {
    component: DynamicEditor;
    config: EditorConfig;
    attribute: AttributeResource;
  };

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  onRefresh() {}

  setDefaultValidation() {
    if (this.data.attribute && this.data.attribute.stringRegex) {
      this.data.config.validation = this.data.attribute.stringRegex;
    }
  }

  onAddDeniedSet(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const index = this.data.config.accessDenied.indexOf(value.trim());
      if (index < 0) {
        this.data.config.accessDenied.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onRemoveDeniedSet(setName: string) {
    const index = this.data.config.accessDenied.indexOf(setName);
    if (index >= 0) {
      this.data.config.accessDenied.splice(index, 1);
    }
  }

  onAddAllowedSet(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const index = this.data.config.accessAllowed.indexOf(value.trim());
      if (index < 0) {
        this.data.config.accessAllowed.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onRemoveAllowedSet(setName: string) {
    const index = this.data.config.accessAllowed.indexOf(setName);
    if (index >= 0) {
      this.data.config.accessAllowed.splice(index, 1);
    }
  }
}
