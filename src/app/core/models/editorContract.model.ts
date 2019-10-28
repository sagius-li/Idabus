import { EditorConfig } from './dynamicEditor.interface';

export class TextEditorConfig extends EditorConfig {
  maxLength?: number;

  constructor() {
    super();

    this.maxLength = undefined;
  }
}

export class BooleanEditorConfig extends EditorConfig {
  textAlign?: string;
  controlType?: string;
  customValue?: boolean;
  trueValue?: string;
  falseValue?: string;

  constructor() {
    super();

    this.textAlign = 'after';
    this.controlType = 'checkbox';
    this.customValue = false;
    this.trueValue = undefined;
    this.falseValue = undefined;
  }
}

export class SelectEditorConfig extends EditorConfig {
  options?: Array<{ value: string; text: string }>;

  constructor() {
    super();

    this.options = [
      { value: 'Contractor', text: 'Extern' },
      { value: 'Intern', text: 'Intern' },
      { value: 'Full Time Employee', text: 'Long Term' }
    ];
  }
}
