import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { EditorResult } from '../core/models/dynamicEditor.interface';
import { BroadcastEvent } from '../core/models/dataContract.model';
import { ModalType } from '../core/models/componentContract.model';

import { ResourceService } from '../core/services/resource.service';
import { SwapService } from '../core/services/swap.service';
import { UtilsService } from '../core/services/utils.service';
import { ModalService } from '../core/services/modal.service';
import { ComponentIndexService } from '../core/services/component-index.service';

import { ViewConfiguratorComponent } from '../view-configurator/view-configurator.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  viewSetting: any;
  viewSettingCopy: any;

  showEditMenu = false;
  configMode = false;

  viewResults: { [key: string]: Array<EditorResult> } = {};

  constructor(
    private resource: ResourceService,
    private swap: SwapService,
    private dialog: MatDialog,
    private utils: UtilsService,
    private modal: ModalService,
    private com: ComponentIndexService
  ) {}

  ngOnInit() {
    this.showEditMenu = this.swap.isEditMode;

    this.viewSetting = this.resource.primaryViewSetting.userDetail;
    this.viewSetting.sections.forEach((s: any) => {
      this.viewResults[s.name] = [];
    });

    this.swap.broadcasted.subscribe((event: BroadcastEvent) => {
      switch (event.name) {
        case 'start-edit':
          this.showEditMenu = true;
          break;
        case 'exit-edit':
          this.showEditMenu = false;
          break;
        default:
          break;
      }
    });
  }

  onEdit() {
    this.viewSettingCopy = this.utils.DeepCopy(this.viewSetting);

    this.configMode = true;
  }

  onSetting() {
    const dialogRef = this.dialog.open(ViewConfiguratorComponent, {
      minWidth: '620px',
      data: this.viewSetting
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        this.viewSetting.sections.forEach((s: any) => {
          if (!this.viewResults[s.name]) {
            this.viewResults[s.name] = [];
          }
        });
      }
    });
  }

  onSave() {
    const process = this.modal.show(ModalType.progress, 'key_savingChanges', '', '300px');

    this.viewSetting.sections.forEach((s: any) => {
      const result = this.viewResults[s.name];
      if (result && result.length > 0) {
        s.attributes.splice(0, s.attributes.length);
        result.forEach((r: any) => {
          s.attributes.push({
            attributeName: r.attribute.systemName,
            editorType: r.type,
            editorConfig: r.config
          });
        });
      }
    });

    this.resource.primaryViewSetting.userDetail = this.viewSetting;
    this.resource.primaryViewSet[this.utils.attConfiguration] = this.com.stringifyComponentConfig(
      this.resource.primaryViewSetting
    );

    this.resource.updateResource(this.resource.primaryViewSet, true).subscribe(
      () => {
        process.close();
        this.configMode = false;
      },
      (err: string) => {
        process.close();
        this.modal.show(ModalType.error, 'key_error', err, '360px');
      }
    );
  }

  onCancel() {
    this.viewSetting = this.viewSettingCopy;
    this.viewSetting.sections.forEach((s: any) => {
      this.viewResults[s.name] = [];
    });

    this.configMode = false;
  }
}
