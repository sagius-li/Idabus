import { Injectable } from '@angular/core';

import { StateCardComponent } from '../components/state-card/state-card.component';
import { ResourceTableComponent } from '../components/resource-table/resource-table.component';
import { ResourceChartComponent } from '../components/resource-chart/resource-chart.component';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

/**
 * Service for dynamic component creation
 */
@Injectable({
  providedIn: 'root'
})
export class ComponentIndexService {
  /**
   * A dictionary of available components, which can be created dynamically
   */
  componentIndex = {
    StateCardComponent,
    ResourceTableComponent,
    ResourceChartComponent
  };

  /** @ignore */
  constructor() {}

  /**
   * Convert widget configuration information into an object
   * @param config Widget configuration in string format
   */
  public parseComponentConfig(config: string) {
    if (!config) {
      return null;
    }

    return JSON.parse(config, (key, value) => {
      if (key === 'componentType') {
        return this.componentIndex[value];
      } else {
        return value;
      }
    });
  }

  public stringifyComponentConfig(config: any) {
    if (!config) {
      throw new Error('cannot stringify');
    }

    return JSON.stringify(config, (key, value) => {
      switch (key) {
        case 'componentInstance':
        case 'chartData':
          return undefined;
        case 'componentType':
          return value.name;
        default:
          return value;
      }
    });
  }
}
