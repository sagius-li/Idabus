import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faCompress, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { DragulaService } from 'ng2-dragula';

import { DynamicComponent } from '../../models/dynamicComponent.interface';
import {
  ResourceChartConfig,
  ChartSerieConfig,
  ChartQueryConfig
} from '../../models/componentContract.model';

@Component({
  selector: 'app-resource-chart-config',
  templateUrl: './resource-chart-config.component.html',
  styleUrls: ['./resource-chart-config.component.scss']
})
export class ResourceChartConfigComponent implements OnInit {
  faCollapseAll = faCompress;
  faExpendAll = faExpandArrowsAlt;

  isFormValid = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicComponent;
      config: ResourceChartConfig;
    },
    private dragula: DragulaService
  ) {
    try {
      this.dragula.createGroup('QUERIES', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('handle') ||
            (handle.parentNode as Element).classList.contains('handle')
          );
        }
      });
    } catch {}
  }

  ngOnInit() {}

  onRefresh() {
    this.data.component.updateDataSource();
  }

  onAddSeries(seriesName: string) {
    const seriesToCreate = new ChartSerieConfig();
    seriesToCreate.name = seriesName;
    seriesToCreate.queryConfig = [new ChartQueryConfig()];
    this.data.config.seriesConfig.push(seriesToCreate);
  }

  onToggleQueryDisplay(query: ChartQueryConfig) {
    if (query.display) {
      query.display = !query.display;
    } else {
      query.display = true;
    }
  }

  onDeleteSeries(serie: ChartSerieConfig) {
    const index = this.data.config.seriesConfig.findIndex(s => s.name === serie.name);
    if (index > -1) {
      this.data.config.seriesConfig.splice(index, 1);
    }
  }

  onAddQuery(serie: ChartSerieConfig) {
    const queryToCreate = new ChartQueryConfig();
    serie.queryConfig.push(queryToCreate);
  }

  onDeleteQuery(serie: ChartSerieConfig, query: ChartQueryConfig) {
    const index = serie.queryConfig.findIndex(q => q.name === query.name);
    if (index > -1) {
      serie.queryConfig.splice(index, 1);
    }
  }

  onExpendAll(serie: ChartSerieConfig) {
    serie.queryConfig.map(c => (c.display = true));
  }

  onCollapseAll(serie: ChartSerieConfig) {
    serie.queryConfig.map(c => (c.display = false));
  }

  validateConfig() {
    for (const serie of this.data.config.seriesConfig) {
      for (const queryConfig of serie.queryConfig) {
        if (queryConfig.method === 'attribute' && !queryConfig.attribute) {
          this.isFormValid = false;
          return;
        }
      }
    }

    this.isFormValid = true;
  }

  trackByFn(index: any) {
    return index;
  }
}
