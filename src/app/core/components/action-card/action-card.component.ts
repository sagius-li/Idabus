import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { BroadcastEvent } from '../../models/dataContract.model';
import { DynamicComponent } from '../../models/dynamicComponent.interface';
import { ActionCardConfig } from '../../models/componentContract.model';

import { UtilsService } from '../../services/utils.service';
import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-action-card',
  templateUrl: './action-card.component.html',
  styleUrls: ['./action-card.component.scss']
})
export class ActionCardComponent implements OnInit, DynamicComponent {
  @Input()
  config: ActionCardConfig;

  @Output()
  primaryAction = new EventEmitter<BroadcastEvent>();

  @Output()
  secondaryAction = new EventEmitter<BroadcastEvent>();

  localConfig: ActionCardConfig;

  displayComponent = false;
  displayAction = false;

  constructor(private utils: UtilsService, private resource: ResourceService) {}

  ngOnInit() {
    this.initComponent();
  }

  resize() {}

  initComponent() {
    this.localConfig = new ActionCardConfig({
      name: '',
      permissionSets: undefined,
      actionSets: undefined,
      backgroundColor: 'white',
      description: undefined,
      descriptionColor: 'darkgray',
      primaryAction: 'primary-action',
      primaryIcon: 'public',
      primaryIconColor: 'darkseagreen',
      primaryImage: undefined,
      secondaryAction: 'secondary-action',
      secondaryIcon: 'add_to_queue',
      secondaryIconColor: 'darkgray',
      title: 'Text',
      titleColor: 'black',
      textWidth: 130
    });

    this.utils.CopyInto(this.config, this.localConfig, true, true);

    if (!this.localConfig.permissionSets) {
      this.displayComponent = true;
    } else {
      const found = this.resource.rightSets.some(
        r => this.localConfig.permissionSets.indexOf(r) >= 0
      );
      this.displayComponent = found ? true : false;
    }

    if (!this.localConfig.actionSets) {
      this.displayAction = true;
    } else {
      const found = this.resource.rightSets.some(r => this.localConfig.actionSets.indexOf(r) >= 0);
      this.displayAction = found ? true : false;
    }

    return this.localConfig;
  }

  configure() {
    return null;
  }

  updateDataSource() {}

  onPrimaryAction() {
    this.primaryAction.emit({
      name: 'ActionCardComponent',
      parameter: this.localConfig.primaryAction
    });
  }

  onSecondaryAction() {
    this.secondaryAction.emit({
      name: 'ActionCardComponent',
      parameter: this.localConfig.secondaryAction
    });
  }
}
