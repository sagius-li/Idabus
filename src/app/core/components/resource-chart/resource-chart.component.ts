import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

import { ComponentConfig, DynamicComponent } from '../../models/dynamicComponent.interface';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';

export class ChartQueryConfig {
  name = '';
  method = 'counter';
  query = '';
  display = true;
}

export class ChartSerieConfig {
  name = 'test';
  categoryField = 'category';
  valueField = 'value';
  color: string = undefined;
  data: any = [{ category: 'test', value: 1 }];
  queryConfig: ChartQueryConfig[] = undefined;
}

export class ResourceChartConfig implements ComponentConfig {
  name = undefined;
  permissionSets = undefined;
  chartType = 'pie';
  chartTitle = '';
  seriesColor = ['#3f51b5', '#2196f3', '#43a047', '#ffc107', '#ff5722', '#e91E63'];
  enableLegend = false;
  legendPosition = 'bottom';
  enableTooltip = false;
  tooltipFormat = '{0}: {1}';
  enableLabel = false;
  labelFormat = '{1}';
  labelColor = 'black';
  seriesConfig: ChartSerieConfig[] = [new ChartSerieConfig()];

  public constructor(init?: Partial<ResourceChartConfig>) {
    Object.assign(this, init);
  }
}

@Component({
  selector: 'app-resource-chart',
  templateUrl: './resource-chart.component.html',
  styleUrls: ['./resource-chart.component.scss']
})
export class ResourceChartComponent implements OnInit, DynamicComponent {
  @Input()
  config: ResourceChartConfig;

  localConfig: ResourceChartConfig;

  constructor(
    private dialog: MatDialog,
    private resource: ResourceService,
    private utils: UtilsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  initComponent() {
    this.localConfig = new ResourceChartConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    this.updateDataSource();

    return this.localConfig;
  }

  updateDataSource() {}

  resize() {}

  configure() {
    return null;
  }

  getSeriesName(name: string) {
    return this.utils.EvalScript(name);
  }

  labelContent = (e: any) => {
    if (this.localConfig.enableLabel) {
      return this.localConfig.labelFormat
        .replace(/\{0\}/g, e.category)
        .replace(/\{1\}/g, e.value)
        .replace(/\{2\}/g, e.series.name);
    }
    return undefined;
    // tslint:disable-next-line:semicolon
  };

  tooltipContent(category: string, value: string, config: ChartSerieConfig): string {
    if (this.localConfig.enableTooltip) {
      return this.localConfig.tooltipFormat
        .replace(/\{0\}/g, category)
        .replace(/\{1\}/g, value)
        .replace(/\{2\}/g, config.name);
    }
    return undefined;
  }
}
