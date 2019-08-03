import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatTabGroup, MatTab, MatTabHeader } from '@angular/material';

import { EditorResult } from '../core/models/dynamicEditor.interface';

import { ModalService } from '../core/services/modal.service';

import { EditorCreatorComponent } from '../core/components/editor-creator/editor-creator.component';
import { ModalType } from '../core/models/componentContract.model';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnInit {
  @ViewChild('mtg') tabGroup: MatTabGroup;

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

  constructor(private dialog: MatDialog, private modal: ModalService) {}

  private isTabDirty() {
    const tabName = this.tabDefs[this.currentTabIndex].name;
    if (this.editorResults[tabName] && this.editorResults[tabName].length > 0) {
      return this.editorResults[tabName].findIndex(t => t.controller.dirty === true) >= 0;
    }
    return false;
  }

  private handelTabChange(stopEvent: boolean, argum: any) {
    return stopEvent && MatTabGroup.prototype._handleClick.apply(this.tabGroup, argum);
  }

  private interceptTabChange() {
    if (this.isTabDirty()) {
      const argum = arguments;
      const confirm = this.modal.show(
        ModalType.confirm,
        'key_confirmation',
        'l10n_changesNotSaved'
      );
      confirm.afterClosed().subscribe(result => {
        if (result && result === 'yes') {
          this.handelTabChange(true, argum);
        } else {
          this.handelTabChange(false, argum);
        }
      });
    } else {
      return true && MatTabGroup.prototype._handleClick.apply(this.tabGroup, arguments);
    }
  }

  ngOnInit() {
    this.tabGroup._handleClick = this.interceptTabChange.bind(this);
  }

  onTabIndexChange(event: number) {
    // this.tabGroup.selectedIndex = this.currentTabIndex;
    this.currentTabIndex = event;
  }

  onArrange() {}

  onAddEditor() {
    const dialogRef = this.dialog.open(EditorCreatorComponent, {
      minWidth: '420px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        this.tabDefs[this.currentTabIndex].attributes.push({
          attributeName: result.attributeName,
          editorType: result.type,
          editorConfig: {
            name: result.name
          }
        });
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

  onSave() {
    console.log(this.editorResults);
  }

  onRefresh() {}
}
