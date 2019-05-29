import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  ResourceChartComponent,
  ChartSerieConfig,
  ChartQueryConfig,
  ResourceChartConfig
} from './resource-chart.component';

@Component({
  selector: 'app-resource-chart-config',
  templateUrl: './resource-chart-config.component.html',
  styleUrls: ['./resource-chart-config.component.scss']
})
export class ResourceChartConfigComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: ResourceChartComponent;
      config: ResourceChartConfig;
    }
  ) {}

  ngOnInit() {}
}
