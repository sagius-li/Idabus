import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EditorResult } from '../core/models/dynamicEditor.interface';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnInit {
  @Input()
  tabDefs: Array<any>;

  @Input()
  icon: string;

  @Input()
  configMode = false;

  results: { [key: string]: Array<EditorResult> } = {};
  @Input()
  get editorResults() {
    return this.results;
  }
  set editorResults(value) {
    this.results = value;
    this.editorResultsChange.emit(this.results);
  }
  @Output()
  editorResultsChange = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.tabDefs = this.tabDefs.sort((t1, t2) => {
      if (t1.x > t2.x) {
        return 1;
      }
      if (t1.x < t2.x) {
        return -1;
      }
      return 0;
    });

    this.tabDefs.forEach(t => {
      this.editorResults[t.name] = [];
    });
  }

  onArrange() {}

  onAddEditor() {}

  onConfig() {}
}
