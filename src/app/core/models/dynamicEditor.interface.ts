import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { AttributeResource } from './dataContract.model';

/**
 * Interface for editor configuration
 */
export interface EditorConfig {
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
