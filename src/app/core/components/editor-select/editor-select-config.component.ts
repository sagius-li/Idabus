import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material';

import { DynamicEditor, AttributeEditorConfig } from '../../models/dynamicEditor.interface';

import { SelectEditorConfig } from '../../models/editorContract.model';
import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-select-config',
  templateUrl: './editor-select-config.component.html',
  styleUrls: ['./editor-select-config.component.scss']
})
export class EditorSelectConfigComponent extends AttributeEditorConfig implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicEditor;
      config: SelectEditorConfig;
      attribute: AttributeResource;
    }
  ) {
    super();
  }

  ngOnInit() {}
}
