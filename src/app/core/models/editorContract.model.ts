import { EditorConfig } from './dynamicEditor.interface';

export class TextEditorConfig extends EditorConfig {
  validation?: string;
  maxLength?: number;

  constructor() {
    super();

    this.validation = undefined;
    this.maxLength = undefined;
  }
}

export class BooleanEditorConfig extends EditorConfig {
  textAlign?: string;
  controlType?: string;

  constructor() {
    super();

    this.textAlign = 'after';
    this.controlType = 'checkbox';
  }
}
