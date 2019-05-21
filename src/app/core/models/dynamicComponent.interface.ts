import { ComponentRef } from '@angular/core';

import { Observable } from 'rxjs';

import { GridsterItem } from 'angular-gridster2';

/**
 * Interface for component configuration
 */
export interface ComponentConfig {
  name: string;
  permissionSets: string[];
}

/**
 * Interface for component, which can be created dynamically
 */
export interface DynamicComponent {
  /** Component configuration */
  config: ComponentConfig;
  /** Initialize component */
  initComponent: () => ComponentConfig;
  /** Update data source */
  updateDataSource: () => void;
  /** resize component */
  resize: (size: number[]) => void;
  /** configure component */
  configure: () => Observable<ComponentConfig>;
}

/**
 * Interface for component specification, which can be put in gridster
 */
export interface GridsterComponentItem extends GridsterItem {
  name: string;
  componentType: any;
  componentConfig: any;
  componentInstance?: DynamicComponent;
}
