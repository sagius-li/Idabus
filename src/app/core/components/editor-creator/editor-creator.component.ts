import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-editor-creator',
  templateUrl: './editor-creator.component.html',
  styleUrls: ['./editor-creator.component.scss']
})
export class EditorCreatorComponent implements OnInit {
  config = {
    name: '',
    attributeName: '',
    type: 'text'
  };

  types = [
    { text: 'Textbox', value: 'text' },
    { text: 'Checkbox', value: 'boolean' },
    { text: 'Select', value: 'select' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {}
}
