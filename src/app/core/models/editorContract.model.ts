import { EditorConfig } from './dynamicEditor.interface';
import { Observable } from 'rxjs';

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
  dataMode?: string;
  dataSource?: Observable<Array<{ value: string; text: string }>>;
  options?: Array<{ value: string; text: string }>;
  allowEmpty?: boolean;
  configKey?: string;
  query?: string;
  valueAttribute?: string;
  textAttribute?: string;

  constructor() {
    super();

    this.dataMode = 'static';
    this.dataSource = undefined;
    this.options = [];
    this.allowEmpty = true;
    this.configKey = undefined;
    this.query = undefined;
    this.valueAttribute = undefined;
    this.textAttribute = undefined;
  }
}
