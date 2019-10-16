import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { DynamicEditor } from '../../models/dynamicEditor.interface';

import { BooleanEditorConfig } from '../../models/editorContract.model';
import { AttributeResource } from '../../models/dataContract.model';

@Component({
  selector: 'app-editor-boolean-config',
  templateUrl: './editor-boolean-config.component.html',
  styleUrls: ['./editor-boolean-config.component.scss']
})
export class EditorBooleanConfigComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicEditor;
      config: BooleanEditorConfig;
      attribute: AttributeResource;
    }
  ) {}

  ngOnInit() {}
}
