import { Component, OnInit, Input } from '@angular/core';

import { of, forkJoin } from 'rxjs';
import { tap, switchMap, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { DynamicComponent } from '../../models/dynamicComponent.interface';
import { Resource, ResourceSet } from '../../models/dataContract.model';
import { ResourceChartConfig, ChartSerieConfig } from '../../models/componentContract.model';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';

import { ResourceChartConfigComponent } from './resource-chart-config.component';

@Component({
  selector: 'app-resource-chart',
  templateUrl: './resource-chart.component.html',
  styleUrls: ['./resource-chart.component.scss']
})
export class ResourceChartComponent implements OnInit, DynamicComponent {
  @Input()
  config: ResourceChartConfig;

  spinnerType = SPINNER;
  localConfig: ResourceChartConfig;

  constructor(
    private dialog: MatDialog,
    private resource: ResourceService,
    private utils: UtilsService,
    private spinner: NgxUiLoaderService
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
          this.spinner.startLoader(this.localConfig.name);
        }, 0);

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
                  this.resource
                    .getResourceByQuery(
                      this.resource.lookup(queryConfig.query),
                      [queryConfig.attribute],
                      1
                    )
                    .pipe(
                      map((data: ResourceSet) => {
                        if (data.totalCount > 0) {
                          const resource = data.results[0] as Resource;
                          if (resource && resource[queryConfig.attribute]) {
                            return parseInt(resource[queryConfig.attribute], 10);
                          }
                        }
                        return 0;
                      })
                    )
                );
          }
        });
        if (observableBatch.length === serieConfig.queryConfig.length) {
          forkJoin(observableBatch).subscribe(
            result => {
              const chartData = [];
              result.forEach((item, index) => {
                const data = {};
                data[serieConfig.categoryField] = this.utils.EvalScript(names[index]);
                data[serieConfig.valueField] = item;
                chartData.push(data);
              });
              serieConfig.chartData = chartData;

              setTimeout(() => {
                this.spinner.stopLoader(this.localConfig.name);
              }, 0);
            },
            () => {
              setTimeout(() => {
                this.spinner.stopLoader(this.localConfig.name);
              }, 0);
            }
          );
        }
      } else if (serieConfig.data) {
        serieConfig.chartData = serieConfig.data;
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
