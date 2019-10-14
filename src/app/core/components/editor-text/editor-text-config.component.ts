import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DynamicEditor } from '../../models/dynamicEditor.interface';

import { TextEditorConfig } from '../../models/editorContract.model';
import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-text-config',
  templateUrl: './editor-text-config.component.html',
  styleUrls: ['./editor-text-config.component.scss']
})
export class EditorTextConfigComponent implements OnInit {
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
}
