import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material';

import { ModalService } from '../core/services/modal.service';

import { ActionCardConfig, ModalType } from '../core/models/componentContract.model';
import { DemoTeamCreationComponent } from '../demo-team-creation/demo-team-creation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit {
  managedResources: ActionCardConfig[] = [
    {
      name: 'acUser',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_user',
      description: 'l10n_userDes',
      primaryIcon: 'person',
      primaryAction: 'person-view',
      secondaryAction: 'person-creation'
    },
    {
      name: 'acGroup',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_group',
      description: 'l10n_groupDes',
      primaryIcon: 'group',
      primaryAction: 'group-view',
      secondaryAction: 'group-creation'
    },
    {
      name: 'acOU',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_ou',
      description: '',
      primaryIcon: 'device_hub',
      primaryAction: 'ou-view',
      secondaryAction: 'ou-creation'
    },
    {
      name: 'acRole',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_role',
      description: 'l10n_roleDes',
      primaryIcon: 'camera_front',
      primaryAction: 'role-view',
      secondaryAction: 'role-creation'
    },
    {
      name: 'acPermission',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_permission',
      description: 'l10n_permissionDes',
      primaryIcon: 'vpn_key',
      primaryAction: 'permission-view',
      secondaryAction: 'permission-creation'
    },
    {
      name: 'acTeams',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_teams',
      description: 'l10n_teamsDes',
      primaryImage: 'teams.png',
      primaryAction: 'teams-view',
      secondaryAction: 'teams-creation'
    }
  ];

  configurationResources: ActionCardConfig[] = [
    {
      name: 'acMPR',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_mpr',
      description: 'l10n_mprDes',
      primaryIcon: 'receipt',
      primaryAction: 'mpr-view',
      secondaryAction: 'mpr-creation'
    },
    {
      name: 'acSet',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_set',
      description: 'l10n_setDes',
      primaryIcon: 'list',
      primaryAction: 'set-view',
      secondaryAction: 'set-creation'
    },
    {
      name: 'acWorkflow',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_wf',
      description: 'l10n_wfDes',
      primaryIcon: 'call_split',
      primaryAction: 'wf-view',
      secondaryAction: 'wf-creation'
    },
    {
      name: 'acEmailTemplate',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_emailTemp',
      description: '',
      primaryIcon: 'email',
      primaryAction: 'emailTemp-view',
      secondaryAction: 'emailTemp-creation'
    },
    {
      name: 'acRequest',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_request',
      primaryIcon: 'rate_review',
      primaryAction: 'request-view',
      secondaryAction: 'request-creation'
    },
    {
      name: 'acApproval',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_approval',
      primaryIcon: 'playlist_add_check',
      primaryAction: 'approval-view',
      secondaryAction: 'approval-creation'
    },
    {
      name: 'acConfig',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_config',
      description: 'l10n_configDes',
      primaryIcon: 'settings_applications',
      primaryAction: 'config-view',
      secondaryAction: 'config-creation'
    }
  ];

  schemaResources: ActionCardConfig[] = [
    {
      name: 'acType',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_type',
      primaryIcon: 'line_style',
      primaryAction: 'type-view',
      secondaryAction: 'type-creation'
    },
    {
      name: 'acAttribute',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_attribute',
      primaryIcon: 'view_module',
      primaryAction: 'attribute-view',
      secondaryAction: 'attribute-creation'
    },
    {
      name: 'acBinding',
      permissionSets: undefined,
      actionSets: undefined,
      title: 'l10n_binding',
      primaryIcon: 'linear_scale',
      primaryAction: 'binding-view',
      secondaryAction: 'binding-creation'
    }
  ];

  constructor(private dialog: MatDialog, private modal: ModalService, private router: Router) {}

  ngOnInit() {}

  onPrimaryAction(actionName: string) {
    if (actionName === 'teams-view') {
      this.router.navigate(['app/team']);
    }
  }

  onSecondaryAction(actionName: string) {
    if (actionName === 'teams-creation') {
      this.dialog
        .open(DemoTeamCreationComponent, {
          minWidth: '580px',
          maxWidth: '580px',
          data: {}
        })
        .afterClosed()
        .subscribe(result => {
          if (result === 'ok') {
            const progress = this.modal.show(ModalType.progress, 'Saving changes', '', '300px');
            setTimeout(() => {
              progress.close();
            }, 2000);
          }
        });
    }
  }
}
