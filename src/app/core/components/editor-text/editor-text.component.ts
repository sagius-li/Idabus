import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-text',
  templateUrl: './editor-text.component.html',
  styleUrls: ['./editor-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorTextComponent),
      multi: true
    }
  ]
})
export class EditorTextComponent implements OnInit, ControlValueAccessor {
  @Input()
  attribute: AttributeResource;

  @Input()
  controlValue: any;

  constructor() {}

  ngOnInit() {}

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  writeValue(value: any) {
    this.controlValue = value;
  }

  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.propagateTouched = fn;
  }

  onChange() {
    this.propagateChange(this.controlValue);
    this.propagateTouched();
  }
}
