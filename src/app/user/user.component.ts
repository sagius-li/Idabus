import { Component, OnInit } from '@angular/core';

import { BroadcastEvent } from '../core/models/dataContract.model';

import { ResourceService } from '../core/services/resource.service';
import { SwapService } from '../core/services/swap.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  viewSetting: any;
  showEditMenu = false;
  configMode = false;

  constructor(private resource: ResourceService, private swap: SwapService) {}

  ngOnInit() {
    this.viewSetting = this.resource.primaryViewSetting.userDetail;

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
    this.configMode = true;
  }

  onAdd() {}

  onSetting() {}

  onSave() {
    this.configMode = false;
  }

  onCancel() {
    this.configMode = false;
  }
}
