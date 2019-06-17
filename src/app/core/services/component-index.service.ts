import { Injectable } from '@angular/core';

import { StateCardComponent } from '../components/state-card/state-card.component';
import { ResourceTableComponent } from '../components/resource-table/resource-table.component';
import { ResourceChartComponent } from '../components/resource-chart/resource-chart.component';

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

    const obj = JSON.parse(config, (key, value) => {
      if (key === 'componentType') {
        return this.componentIndex[value];
      } else {
        return value;
      }
    });

    return obj;
  }
}
