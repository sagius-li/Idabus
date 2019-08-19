import { Component, OnInit } from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { Activity } from '../core/models/dataContract.model';

import { ModalService } from '../core/services/modal.service';
import { ModalType } from '../core/models/componentContract.model';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {
  workflowDef = {
    objecttype: 'workflow',
    objectid: 'ccccc555-1a63-4a56-ab4c-fe3002c93406',
    displayname: 'Handle new creation of team',
    workflowdescription: {
      type: 'Sequential',
      id: '7a842b1a-917d-4195-873b-eb4464d67ff3',
      isenabled: true,
      displayname: 'Create team and add information to the person',
      activities: [
        {
          type: 'UpdateResources',
          id: 'c66a07d1-15e9-468d-a0ab-7b84992253b8',
          isenabled: true,
          displayname: 'set team description ',
          description:
            'updates the name of the team to contain the number of member and the latest update time',
          updateresourcesentries: [
            {
              // tslint:disable-next-line:max-line-length
              valueexpression:
                'Concatenate("The team now has ", CONVERTTOSTRING(count([//target/members])), " members since " + DateTimeNow())',
              target: '[//target/description]',
              allownull: true
            }
          ],
          actortype: 'ServiceAccount',
          xpathqueries: [],
          runonpreviousstatuscondition: ['Success']
        },
        {
          type: 'UpdateResources',
          id: 'c3545b1c-5ff0-4e5b-ad18-925fbc625629',
          isenabled: true,
          displayname: 'set workflowdata',
          description: 'adds the member info to workflowdata',
          updateresourcesentries: [
            {
              valueexpression: '[//target/members]',
              target: '[//WorkflowData/allAddedMembers]',
              allownull: true
            }
          ],
          actortype: 'ServiceAccount',
          actor: null,
          executioncondition: null,
          xpathqueries: [],
          expressions: null,
          runonpreviousstatuscondition: [
            'Success',
            'UnmetExecutionCondition',
            'Skipped',
            'Disabled'
          ]
        },
        {
          type: 'RestApiCall',
          id: '1163f4bb-abf1-44a5-a9b7-482abf4d5219',
          isenabled: true,
          displayname: 'create team in Azure',
          description: 'api call workflow for creating group and team object in Azure',
          method: 'POST',
          headerexpressions: {},
          urlexpression:
            // tslint:disable-next-line:max-line-length
            'https://prod-38.westeurope.logic.azure.com:443/workflows/41910c32942d4237a7b2ecb80eed0a65/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=PaaJ2J2rcM0Up1gTMmVbc2JuD754c_N0GBUKoRYpcVc',
          queryexpressions: {},
          bodyexpression: {
            displayname: '{teamName}',
            owners: '{owners}'
          },
          xpathqueries: [],
          expressions: {
            owners: '[//target/owners]',
            teamname: '[//target/displayname]'
          },
          runonpreviousstatuscondition: ['Success']
        },
        {
          type: 'ForEach',
          id: 'c1b1fc1e-9cc4-4c83-b30f-6bece0ed0246',
          isenabled: true,
          displayname: 'foreach member add team name to description',
          description: null,
          currentitemkey: 'currentUser',
          listkey: 'allAddedMembers',
          updatewhileiterating: false,
          continueonerror: true,
          executioncondition: null,
          runonpreviousstatuscondition: ['Success'],
          activities: [
            {
              type: 'UpdateResources',
              id: 'ccc07af7-c8ee-4c29-a52f-b169ad35ea65',
              isenabled: true,
              displayname: 'add team to user prop',
              description: 'add this team to teams prop of the person',
              updateresourcesentries: [
                {
                  valueexpression: 'InsertValues([//target/objectid])',
                  target: '[//WorkflowData/currentUser/teams]',
                  allownull: true
                }
              ],
              actortype: 'ServiceAccount',
              actor: null,
              executioncondition: null,
              xpathqueries: [],
              expressions: null,
              runonpreviousstatuscondition: ['Success']
            },
            {
              type: 'RestApiCall',
              id: '1187febb-abf1-44a5-a9b7-482abf4d5219',
              isenabled: true,
              displayname: 'set user teams',
              description: 'api call workflow for updating teams of a user',
              method: 'POST',
              headerexpressions: {},
              urlexpression:
                // tslint:disable-next-line:max-line-length
                'https://prod-24.westeurope.logic.azure.com:443/workflows/4c079d2ea45c453f949b372e9ab09762/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=somc5f5lyX0ShNlCuR-SYAvelab_YtwZiLWlvJGZ8z8',
              queryexpressions: {},
              bodyexpression: {
                allteams: '{allTeamNames}',
                userreference: '{userReference}',
                teamname: '{teamName}',
                isadd: true
              },
              xpathqueries: [],
              expressions: {
                // tslint:disable-next-line:max-line-length
                allteamnames:
                  'ConcatenateMultivaluedString(FormatMultivaluedList("{0}", [//WorkflowData/currentUser/teams/displayname]), ";")',
                userreference: '[//WorkflowData/currentUser/azureid]',
                teamname: '[//target/displayname]'
              },
              runonpreviousstatuscondition: ['Success']
            }
          ]
        }
      ]
    },
    createdtime: '2019-08-14T09:56:36.9112915Z',
    lastupdatetime: '2019-08-15T09:35:36.7602121Z'
  };

  activities = this.workflowDef.workflowdescription.activities;

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

  constructor(private dragula: DragulaService, private modal: ModalService) {
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
    this.activityToDelete = undefined;
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
    console.log(this.activities);
    console.log(this.workflowDef);
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
}
