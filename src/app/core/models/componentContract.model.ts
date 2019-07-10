import { ComponentConfig, DynamicComponent } from './dynamicComponent.interface';

// #region component definition

export class ComponentDef {
  id: string;
  name: string;
  type: string;
  icon?: string;
  width?: number;
  height?: number;
  description?: string;
  instance: any;
}

// #endregion

// #region resource-chart

export class ChartQueryConfig {
  name = '';
  method = 'counter';
  attribute = '';
  query = '';
  display?: boolean = undefined;
}

export class ChartSerieConfig {
  name = 'test';
  categoryField = 'category';
  valueField = 'value';
  color: string = undefined;
  data?: any;
  queryConfig?: ChartQueryConfig[];
  chartData?: any;
}

export class ResourceChartConfig implements ComponentConfig {
  name = 'resource-chart';
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

// #endregion

// #region resource-table

export class ResourceColumnConfig {
  field: string = undefined;
  title: string = undefined;
  width?: number = undefined;
  sortable?: boolean = undefined;
  filterable?: boolean = undefined;
  filter?: string = undefined;
  locked?: boolean = undefined;
  display?: boolean = undefined;
}

export class ResourceTableConfig implements ComponentConfig {
  name = undefined;
  permissionSets = undefined;
  title?: string = undefined;
  fontSize?: number = undefined;
  cellPadding?: number = undefined;
  pageSize?: number = undefined;
  pageCountNumber?: number = undefined;
  pageInfo?: boolean = undefined;
  pageType?: string = undefined;
  pageButton?: boolean = undefined;
  sortable?: boolean = undefined;
  sortMode?: string = undefined;
  allowUnsort?: boolean = undefined;
  filterable?: boolean = undefined;
  filterMode?: string = undefined;
  selectable?: boolean = undefined;
  selectBoxWidth?: number = undefined;
  selectMode?: string = undefined;
  checkboxSelectOnly?: boolean = undefined;
  resizable?: boolean = undefined;
  exportToPDF?: boolean = undefined;
  exportToExcel?: boolean = undefined;
  exportAllPages?: boolean = undefined;
  resources?: any[] = undefined;
  query?: string = undefined;
  columns?: ResourceColumnConfig[] = undefined;

  public constructor(init?: Partial<ResourceTableConfig>) {
    Object.assign(this, init);
  }
}

// #endregion

// #region state-card

export class StateCardConfig implements ComponentConfig {
  name = 'state-card';
  permissionSets = undefined;
  iconText: string = undefined;
  iconColor: string = undefined;
  backgroundColor: string = undefined;
  textColor: string = undefined;
  mainTextColor: string = undefined;
  title: string = undefined;
  mainText: string = undefined;
  queryMode: string = undefined;
  queryAttribute: string = undefined;
  query: string = undefined;

  public constructor(init?: Partial<StateCardConfig>) {
    Object.assign(this, init);
  }
}

// #endregion

// #region action-card

export class ActionCardConfig implements ComponentConfig {
  name = 'action-card';
  permissionSets = undefined;
  actionSets: string[] = undefined;
  primaryIcon?: string = undefined;
  primaryIconColor?: string = undefined;
  primaryImage?: string = undefined;
  secondaryIcon?: string = undefined;
  secondaryIconColor?: string = undefined;
  backgroundColor?: string = undefined;
  title?: string = undefined;
  titleColor?: string = undefined;
  description?: string = undefined;
  descriptionColor?: string = undefined;
  primaryAction?: string = undefined;
  secondaryAction?: string = undefined;
  textWidth?: number = undefined;

  public constructor(init?: Partial<ActionCardConfig>) {
    Object.assign(this, init);
  }
}

// #endregion

// #region modal

export enum ModalType {
  info = 'info',
  confirm = 'confirm',
  error = 'error',
  progress = 'progress'
}

export interface ModalData {
  type: ModalType;
  title: string;
  content: string;
}

// #endregion
