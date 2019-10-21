import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { DynamicEditor } from '../../models/dynamicEditor.interface';

import { TextEditorConfig } from '../../models/editorContract.model';
import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-text-config',
  templateUrl: './editor-text-config.component.html',
  styleUrls: ['./editor-text-config.component.scss']
})
export class EditorTextConfigComponent implements OnInit {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicEditor;
      config: TextEditorConfig;
      attribute: AttributeResource;
    }
  ) {}

  ngOnInit() {}

  onRefresh() {}

  setDefaultValidation() {
    this.data.config.validation = this.data.attribute.stringRegex;
  }

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
