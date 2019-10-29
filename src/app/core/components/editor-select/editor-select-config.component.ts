import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';
import { DragulaService } from 'ng2-dragula';

import { DynamicEditor, AttributeEditorConfig } from '../../models/dynamicEditor.interface';

import { SelectEditorConfig } from '../../models/editorContract.model';
import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-select-config',
  templateUrl: './editor-select-config.component.html',
  styleUrls: ['./editor-select-config.component.scss']
})
export class EditorSelectConfigComponent extends AttributeEditorConfig implements OnInit {
  textInput: string;
  valueInput: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicEditor;
      config: SelectEditorConfig;
      attribute: AttributeResource;
    },
    private dragula: DragulaService
  ) {
    super();

    try {
      this.dragula.createGroup('SELECTOPTIONS', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('handle') ||
            (handle.parentNode as Element).classList.contains('handle')
          );
        }
      });
    } catch {}
  }

  ngOnInit() {
    this.textInput = undefined;
    this.valueInput = undefined;
  }

  onAddOption() {
    const douplicates = this.data.config.options.filter(element => {
      return (
        element.text.toLowerCase() === this.textInput.toLowerCase() ||
        element.value.toLowerCase() === this.valueInput.toLowerCase()
      );
    });
    if (douplicates && douplicates.length > 0) {
      return;
    } else {
      this.data.config.options.push({ text: this.textInput, value: this.valueInput });
      this.textInput = undefined;
      this.valueInput = undefined;
    }
  }

  onRemoveOption(item: { text: string; value: string }) {
    const index = this.data.config.options.findIndex(element => {
      return element.value.toLowerCase() === item.value.toLowerCase();
    });
    if (index >= 0) {
      this.data.config.options.splice(index, 1);
    }
  }

  isDisabled() {
    switch (this.data.config.dataMode) {
      case 'static':
        return false;
      case 'config':
        return this.data.config.configKey ? false : true;
      case 'query':
        return this.data.config.query &&
          this.data.config.textAttribute &&
          this.data.config.valueAttribute
          ? false
          : true;
      default:
        break;
    }

    return true;
  }
}
