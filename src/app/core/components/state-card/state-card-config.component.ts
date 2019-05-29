import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DynamicComponent, ComponentConfig } from '../../models/dynamicComponent.interface';

export class StateCardConfig implements ComponentConfig {
  name = 'state-card';
  permissionSets = undefined;
  iconText: string = undefined;
  iconColor: string = undefined;
  backgroundColor: string = undefined;
  textColor: string = undefined;
  mainTextColor: string = undefined;
  title: string = undefined;
  mainText: string = undefined;
  queryMode: string = undefined;
  queryAttribute: string = undefined;
  query: string = undefined;

  public constructor(init?: Partial<StateCardConfig>) {
    Object.assign(this, init);
  }
}

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
