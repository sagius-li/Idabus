import { EditorConfig } from './dynamicEditor.interface';

export class TextEditorConfig implements EditorConfig {
  name = undefined;
  editMode = true;
  isHidden = false;
  showTooltip = true;
  showDisplayName = true;
  customDisplayName = undefined;
  showDescription = false;
  customDescription = undefined;
  readOnly = false;
  required = false;
  requiredFromSchema = false;
  hideIfNoAccess = true;
  expression = undefined;

  validation?: string = undefined;
  maxLength?: number = undefined;
}

export class BooleanEditorConfig implements EditorConfig {
  name = undefined;
  editMode = true;
  isHidden = false;
  showTooltip = true;
  showDisplayName = true;
  customDisplayName = undefined;
  showDescription = false;
  customDescription = undefined;
  readOnly = false;
  required = false;
  requiredFromSchema = false;
  hideIfNoAccess = true;
  expression = undefined;

  textAlign = 'after';
}
