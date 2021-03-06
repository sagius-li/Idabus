import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';

import { DynamicEditor, AttributeEditorConfig } from '../../models/dynamicEditor.interface';

import { TextEditorConfig } from '../../models/editorContract.model';
import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-text-config',
  templateUrl: './editor-text-config.component.html',
  styleUrls: ['./editor-text-config.component.scss']
})
export class EditorTextConfigComponent extends AttributeEditorConfig implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicEditor;
      config: TextEditorConfig;
      attribute: AttributeResource;
    }
  ) {
    super();
  }

  ngOnInit() {}
}
