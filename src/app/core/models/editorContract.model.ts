import { EditorConfig } from './dynamicEditor.interface';

export class TextEditorConfig implements EditorConfig {
  // tslint:disable-next-line:whitespace
  name? = undefined;
  // tslint:disable-next-line:whitespace
  editMode? = true;
  // tslint:disable-next-line:whitespace
  isHidden? = false;
  // tslint:disable-next-line:whitespace
  showTooltip? = true;
  // tslint:disable-next-line:whitespace
  showDisplayName? = true;
  // tslint:disable-next-line:whitespace
  customDisplayName? = undefined;
  // tslint:disable-next-line:whitespace
  showDescription? = false;
  // tslint:disable-next-line:whitespace
  customDescription? = undefined;
  // tslint:disable-next-line:whitespace
  readOnly? = false;
  // tslint:disable-next-line:whitespace
  required? = false;
  // tslint:disable-next-line:whitespace
  requiredFromSchema? = false;
  // tslint:disable-next-line:whitespace
  hideIfNoAccess? = true;
  // tslint:disable-next-line:whitespace
  expression? = undefined;
  validation?: string = undefined;
  maxLength?: number = undefined;
}
