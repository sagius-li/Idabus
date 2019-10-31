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
  controlType?: string;
  radioButtonLayout?: string;
  radioButtonSpace?: number;
  dataMode?: string;
  options?: Array<{ value: string; text: string }>;
  allowEmpty?: boolean;
  configKey?: string;
  query?: string;
  valueAttribute?: string;
  textAttribute?: string;

  constructor() {
    super();

    this.controlType = 'combo';
    this.radioButtonLayout = 'row';
    this.radioButtonSpace = 20;
    this.dataMode = 'static';
    this.options = [];
    this.allowEmpty = true;
    this.configKey = undefined;
    this.query = undefined;
    this.valueAttribute = undefined;
    this.textAttribute = undefined;
  }
}
