import { EditorConfig } from './dynamicEditor.interface';

export class TextEditorConfig implements EditorConfig {
  name = undefined;
  editMode = true;
  isHidden = false;
  showDisplayName = true;
  customDisplayName = undefined;
  showDescription = false;
  customDescription = undefined;
  readOnly = false;
  required = false;
  hideIfNoAccess = true;
  validation: string = undefined;
  maxLength: number = undefined;
}
