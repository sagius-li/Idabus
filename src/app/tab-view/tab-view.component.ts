import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatTabGroup } from '@angular/material';

import { switchMap } from 'rxjs/operators';

import { EditorResult } from '../core/models/dynamicEditor.interface';
import { ModalType } from '../core/models/componentContract.model';
import { Resource } from '../core/models/dataContract.model';

import { ResourceService } from '../core/services/resource.service';
import { ModalService } from '../core/services/modal.service';
import { SwapService } from '../core/services/swap.service';

import { EditorCreatorComponent } from '../core/components/editor-creator/editor-creator.component';

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

  refreshTrigger = Math.floor(Math.random() * 10000 + 1);

  constructor(
    private dialog: MatDialog,
    private modal: ModalService,
    private route: ActivatedRoute,
    private resource: ResourceService,
    private swap: SwapService
  ) {}

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

  isTabDirty() {
    const tabName = this.tabDefs[this.currentTabIndex].name;
    if (this.editorResults[tabName] && this.editorResults[tabName].length > 0) {
      return this.editorResults[tabName].findIndex(t => t.controller.dirty === true) >= 0;
    }
    return false;
  }

  hasError() {
    const tabName = this.tabDefs[this.currentTabIndex].name;
    if (this.editorResults[tabName] && this.editorResults[tabName].length > 0) {
      return this.editorResults[tabName].findIndex(t => t.controller.valid === false) >= 0;
    }
    return false;
  }

  ngOnInit() {
    this.tabGroup._handleClick = this.interceptTabChange.bind(this);
  }

  onTabIndexChange(event: number) {
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
    const attributeResult: { [key: string]: any } = {};
    const tabName = this.tabDefs[this.currentTabIndex].name;

    if (this.editorResults[tabName] && this.editorResults[tabName].length > 0) {
      const progress = this.modal.show(ModalType.progress, 'key_savingChanges', '');

      this.editorResults[tabName].forEach(result => {
        if (result.controller.dirty) {
          attributeResult[result.attribute.systemName] = result.controller.value;
        }
      });

      this.route.params
        .pipe(
          switchMap(param => {
            return this.resource.getResourceByID(param.id, Object.keys(attributeResult));
          }),
          switchMap((res: Resource) => {
            Object.keys(attributeResult).forEach(k => {
              res[k] = attributeResult[k];
            });
            return this.resource.updateResource(res);
          })
        )
        .subscribe(
          () => {
            progress.close();
            this.onRefresh();
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  onRefresh() {
    this.swap.broadcast({
      name: 'refresh-attribute',
      parameter: this.tabDefs[this.currentTabIndex].name
    });
  }
}
