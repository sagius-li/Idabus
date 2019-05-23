import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  ResourceTableComponent,
  ResourceTableConfig,
  ResourceColumnConfig
} from './resource-table.component';

@Component({
  selector: 'app-resource-table-config',
  templateUrl: './resource-table-config.component.html',
  styleUrls: ['./resource-table-config.component.scss']
})
export class ResourceTableConfigComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: ResourceTableComponent;
      config: ResourceTableConfig;
    }
  ) {}

  ngOnInit() {}

  onRefresh() {
    this.data.component.updateDataSource();
  }
}
