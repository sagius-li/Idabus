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

  types = [{ text: 'Text box', value: 'text' }, { text: 'Check box', value: 'boolean' }];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit() {}
}
