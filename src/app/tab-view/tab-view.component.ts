import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EditorResult } from '../core/models/dynamicEditor.interface';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnInit {
  tabsDefinition: Array<any>;
  @Input()
  get tabDefs() {
    return this.tabsDefinition;
  }
  set tabDefs(value) {
    this.tabsDefinition = value;
    this.tabDefsChange.emit(this.tabsDefinition);
  }
  @Output()
  tabDefsChange = new EventEmitter();

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

  currentTabIndex = 0;

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

  onTabIndexChange(event: number) {
    this.currentTabIndex = event;
  }

  onArrange() {}

  onAddEditor() {
    this.tabDefs[this.currentTabIndex].attributes.push({
      attributeName: 'MiddleName',
      editorType: 'text',
      editorConfig: {
        name: 'txtMiddleName'
      }
    });
  }

  onChangeColumnNumber() {
    switch (this.tabDefs[this.currentTabIndex].columnNumber) {
      case 1:
        this.tabDefs[this.currentTabIndex].columnNumber = 2;
        break;
      case 2:
        this.tabDefs[this.currentTabIndex].columnNumber = 3;
        break;
      case 3:
        this.tabDefs[this.currentTabIndex].columnNumber = 4;
        break;
      case 4:
        this.tabDefs[this.currentTabIndex].columnNumber = 1;
        break;
      default:
        break;
    }
  }
}
