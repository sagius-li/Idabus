import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DynamicComponent } from '../../models/dynamicComponent.interface';
import { StateCardConfig } from '../../models/componentContract.model';

@Component({
  selector: 'app-state-card-config',
  templateUrl: './state-card-config.component.html',
  styleUrls: ['./state-card-config.component.scss']
})
export class StateCardConfigComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicComponent;
      config: StateCardConfig;
    }
  ) {}

  ngOnInit() {}

  onRefresh() {
    this.data.component.updateDataSource();
  }
}
