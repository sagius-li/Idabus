import { Component, OnInit, Input } from '@angular/core';

import { of, forkJoin } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';

import { ComponentConfig, DynamicComponent } from '../../models/dynamicComponent.interface';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';
import { ResourceChartConfigComponent } from './resource-chart-config.component';

export class ChartQueryConfig {
  name = '';
  method = 'counter';
  attribute = '';
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

  updateDataSource() {
    this.localConfig.seriesConfig.forEach(serieConfig => {
      if (serieConfig.queryConfig) {
        setTimeout(() => {
          this.localConfig.name ? this.spinner.show(this.localConfig.name) : this.spinner.show();
        }, 0);

        setTimeout(() => {
          const observableBatch = [];
          const names = [];
          serieConfig.queryConfig.forEach(queryConfig => {
            if (queryConfig.name && queryConfig.query) {
              names.push(queryConfig.name);
              queryConfig.method === 'counter'
                ? observableBatch.push(
                    this.resource.getResourceCount(this.resource.lookup(queryConfig.query))
                  )
                : observableBatch.push(
                    this.resource.getResourceByQuery(
                      this.resource.lookup(queryConfig.query),
                      [queryConfig.attribute],
                      1
                    )
                  );
            }
          });
          if (observableBatch.length === serieConfig.queryConfig.length) {
            forkJoin(observableBatch).subscribe(result => {
              const chartData = [];
              result.forEach((item, index) => {
                const data = {};
                data[serieConfig.categoryField] = this.utils.EvalScript(names[index]);
                data[serieConfig.valueField] = item;
                chartData.push(data);
              });
              serieConfig.data = chartData;

              setTimeout(() => {
                this.spinner.hide();
              }, 0);
            });
          }
        }, 500);
      }
    });
  }

  resize() {}

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(ResourceChartConfigComponent, {
      minWidth: '600px',
      data: {
        component: this,
        config: this.localConfig
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.localConfig = configCopy;
        }
        this.updateDataSource();
      }),
      switchMap(() => {
        return of(this.localConfig);
      })
    );
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
