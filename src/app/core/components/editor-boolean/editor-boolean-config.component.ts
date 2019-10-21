import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { DynamicEditor } from '../../models/dynamicEditor.interface';

import { BooleanEditorConfig } from '../../models/editorContract.model';
import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-boolean-config',
  templateUrl: './editor-boolean-config.component.html',
  styleUrls: ['./editor-boolean-config.component.scss']
})
export class EditorBooleanConfigComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicEditor;
      config: BooleanEditorConfig;
      attribute: AttributeResource;
    }
  ) {}

  ngOnInit() {}

  onAddDeniedSet(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const index = this.data.config.accessDenied.indexOf(value.trim());
      if (index < 0) {
        this.data.config.accessDenied.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onRemoveDeniedSet(setName: string) {
    const index = this.data.config.accessDenied.indexOf(setName);
    if (index >= 0) {
      this.data.config.accessDenied.splice(index, 1);
    }
  }

  onAddAllowedSet(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const index = this.data.config.accessAllowed.indexOf(value.trim());
      if (index < 0) {
        this.data.config.accessAllowed.push(value.trim());
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onRemoveAllowedSet(setName: string) {
    const index = this.data.config.accessAllowed.indexOf(setName);
    if (index >= 0) {
      this.data.config.accessAllowed.splice(index, 1);
    }
  }
}
