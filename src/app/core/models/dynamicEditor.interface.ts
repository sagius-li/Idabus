import { Observable } from 'rxjs';

/**
 * Interface for editor configuration
 */
export interface EditorConfig {
  name?: string;
  editMode?: boolean;
  isHidden?: boolean;
  readOnly?: boolean;
  required?: boolean;
  showTooltip?: boolean;
  showDisplayName?: boolean;
  customDisplayName?: string;
  showDescription?: boolean;
  customDescription?: string;
  hideIfNoAccess?: boolean;
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
