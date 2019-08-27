import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';
import { DragulaService } from 'ng2-dragula';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { v4 as uuid } from 'uuid';

import { Activity } from '../core/models/dataContract.model';

import { ModalService } from '../core/services/modal.service';
import { ModalType } from '../core/models/componentContract.model';
import { ResourceService } from '../core/services/resource.service';
import { ActivityCreatorComponent } from '../core/components/activity-creator/activity-creator.component';
import { UtilsService } from '../core/services/utils.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {
  workflows: Array<any> = [];
  selectedWorkflow: any;
  initial = '-';

  activities: any;

  activityToDelete: { pos: number; activities: Array<Activity> };

  private findItem(id: string, activities: Array<Activity>) {
    const pos = activities.findIndex(a => a.id === id);
    if (pos >= 0) {
      this.activityToDelete = { pos, activities };
    } else {
      activities.forEach((a: Activity) => {
        if (a.activities && a.activities.length > 0) {
          this.findItem(id, a.activities);
        }
      });
    }
  }

  constructor(
    private dragula: DragulaService,
    private modal: ModalService,
    private spinner: NgxUiLoaderService,
    private resource: ResourceService,
    private dialog: MatDialog,
    private utils: UtilsService
  ) {
    try {
      this.dragula.createGroup('ACTIVITIES', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('handle') ||
            (handle.parentNode as Element).classList.contains('handle')
          );
        }
      });
    } catch {}
  }

  ngOnInit() {
    this.spinner.startLoader('spinner_home');

    this.selectedWorkflow = undefined;
    this.activityToDelete = undefined;

    this.resource
      .getResourceByQuery('/Workflow', ['DisplayName', 'Description'])
      .subscribe(result => {
        if (result.totalCount > 0) {
          this.workflows = result.results;
        }
        this.spinner.stopLoader('spinner_home');
      });
  }

  hasSubActivities(item: Activity): boolean {
    return item && item.activities && item.activities.length > 0;
  }

  getIcon(item: Activity) {
    switch (item.type.toLowerCase()) {
      case 'updateresources':
        return 'edit';
      case 'foreach':
        return 'loop';
      case 'sequential':
        return 'import_export';
      case 'restapicall':
        return 'settings_applications';
      default:
        return 'no_listed_location';
    }
  }

  onToggleDisplay(item: Activity) {
    if (item.display) {
      item.display = !item.display;
    } else {
      item.display = true;
    }
  }

  onAddActivity() {
    const dialogRef = this.dialog.open(ActivityCreatorComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== 'cancel') {
        const def = this.utils.DeepCopy(result);
        def.def.id = uuid();
        this.activities.push(def.def);
      }
    });
  }

  onDeleteActivity(item: Activity) {
    const confirm = this.modal.show(
      ModalType.confirm,
      'key_confirmation',
      'l10n_deleteWorkflowActivity'
    );
    confirm.afterClosed().subscribe(result => {
      if (result && result === 'yes') {
        this.findItem(item.id, this.activities);
        if (this.activityToDelete) {
          this.activityToDelete.activities.splice(this.activityToDelete.pos, 1);
        }
      }
    });
  }

  onWorkflowClick(workflow: any) {
    this.spinner.startLoader('spinner_home');

    this.workflows.map(t => (t.selected = false));
    workflow.selected = true;

    this.resource.getNextGenWorkflowByID(workflow.objectid).subscribe(result => {
      if (result) {
        this.selectedWorkflow = result;
        if (this.selectedWorkflow.displayname) {
          this.initial = this.selectedWorkflow.displayname.substr(0, 2);
        }
        this.activities = this.selectedWorkflow.workflowdescription.activities;
      }
      this.spinner.stopLoader('spinner_home');
    });
  }

  onSaveWorkflow() {
    const progress = this.modal.show(ModalType.progress, 'key_savingChanges', '', '300px');

    this.selectedWorkflow.workflowdescription.activities = this.activities;

    console.log(this.selectedWorkflow);
    console.log(JSON.stringify(this.selectedWorkflow));

    this.resource.updateNextGenWorkflow(this.selectedWorkflow).subscribe(
      () => {
        progress.close();
      },
      error => {
        progress.close();
        this.modal.show(ModalType.error, 'key_error', error);
      }
    );
  }

  onDeleteWorkflow() {
    const progress = this.modal.show(ModalType.progress, 'key_savingChanges', '', '300px');

    const confirm = this.modal.show(ModalType.confirm, 'key_confirmation', 'key_deleteResource');
    confirm.afterClosed().subscribe(result => {
      if (result && result === 'yes') {
        this.resource.deleteResource(this.selectedWorkflow.objectid).subscribe(
          () => {
            progress.close();
            this.ngOnInit();
          },
          (error: any) => {
            progress.close();
            this.modal.show(ModalType.error, 'key_error', error);
          }
        );
      }
    });
  }
}
