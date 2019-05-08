/**
 * Interface for component configuration
 */
export interface ComponentConfig {
  minimized: boolean;
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
  configure: () => ComponentConfig;
}
