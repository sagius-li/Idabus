import { FormControl } from '@angular/forms';

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
  }
}

/**
 * Interface for editor, which can be created dynamically
 */
export interface DynamicEditor {
  /** Editor attribute */
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
