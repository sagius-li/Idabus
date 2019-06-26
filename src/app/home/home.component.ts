import { Component, OnInit } from '@angular/core';

import { BroadcastEvent } from '../core/models/dataContract.model';

import { SwapService } from '../core/services/swap.service';
import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  editMode = false;
  adminMode = false;

  constructor(private swap: SwapService, private resource: ResourceService) {}

  ngOnInit() {
    this.adminMode = this.resource.isAdminViewSet;

    this.swap.broadcasted.subscribe((event: BroadcastEvent) => {
      switch (event.name) {
        case 'refresh-viewset':
          this.adminMode = this.resource.isAdminViewSet;
          break;
        default:
          break;
      }
    });
  }

  onEnterEditMode() {
    this.editMode = true;
    this.swap.editMode = true;
    this.swap.broadcast({ name: 'start-edit', parameter: null });
  }

  onExitEditMode() {
    this.editMode = false;
    this.swap.editMode = false;
    this.swap.broadcast({ name: 'exit-edit', parameter: null });
  }
}
