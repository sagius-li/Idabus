import { Component, OnInit, Input } from '@angular/core';

import { Observable, of } from 'rxjs';
import { skip, take, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';

import { ComponentConfig, DynamicComponent } from '../../models/dynamicComponent.interface';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';
import { ResourceSet } from '../../models/dataContract.model';

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

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.scss']
})
export class ResourceTableComponent implements OnInit, DynamicComponent {
  @Input()
  config: ResourceTableConfig;

  localConfig: ResourceTableConfig;

  gridState: State;
  gridResources: Observable<GridDataResult>;
  excelData: Observable<GridDataResult>;
  gridLoading = false;
  gridSelect: any;

  constructor(
    private dialog: MatDialog,
    private resource: ResourceService,
    private utils: UtilsService
  ) {}

  private fetchDataDic() {
    if (this.localConfig.query) {
      this.gridLoading = true;
      let sortString: string[];
      if (this.gridState) {
        if (this.gridState.sort) {
          sortString = this.gridState.sort
            .filter(element => element.dir !== undefined)
            .map(item => `${item.field}:${item.dir}`);
        }
      }

      const attributesToLoad = this.localConfig.columns.map(c => c.field);
      this.resource
        .getResourceByQuery(
          this.resource.lookup(this.localConfig.query),
          attributesToLoad,
          this.gridState ? this.gridState.take : undefined,
          this.gridState ? this.gridState.skip : undefined,
          true,
          sortString
        )
        .subscribe((result: ResourceSet) => {
          this.gridResources = of({
            data: result.results,
            total: result.totalCount
          } as GridDataResult);
          this.gridLoading = false;
        });
    } else if (this.localConfig.resources) {
      this.gridResources = of(this.localConfig.resources).pipe(
        skip(this.gridState.skip),
        take(this.gridState.take),
        map(ro => {
          return { data: ro, total: this.localConfig.resources.length } as GridDataResult;
        })
      );
    }
  }

  ngOnInit() {
    this.initComponent();
  }

  resize() {}

  initComponent() {
    this.localConfig = new ResourceTableConfig({
      name: undefined,
      permissionSets: undefined,
      title: '',
      fontSize: 14,
      pageSize: 10,
      cellPadding: 10,
      pageCountNumber: 5,
      pageInfo: true,
      pageType: 'numeric',
      pageButton: true,
      sortMode: 'single',
      allowUnsort: true,
      filterMode: 'menu',
      selectable: false,
      selectBoxWidth: 18,
      selectMode: 'single',
      checkboxSelectOnly: false,
      resizable: false,
      exportToPDF: false,
      exportToExcel: false,
      exportAllPages: false,
      resources: [{ DisplayName: 'text' }],
      columns: [
        {
          field: 'DisplayName',
          title: 'Display Name',
          width: 100,
          filterable: false,
          filter: 'text',
          sortable: false,
          locked: false
        }
      ]
    });

    this.utils.CopyInto(this.config, this.localConfig, true, true);

    this.gridState = {
      take: this.localConfig.pageSize,
      skip: 0
    };

    this.gridSelect = this.localConfig.selectable
      ? {
          checkboxOnly: this.localConfig.checkboxSelectOnly,
          mode: this.localConfig.selectMode
        }
      : false;

    this.fetchDataDic();

    return this.localConfig;
  }

  configure() {
    return null;
  }

  updateDataSource() {
    this.gridState = { take: this.localConfig.pageSize, skip: 0 };
    this.fetchDataDic();
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;

    this.fetchDataDic();
  }

  allData = (): Observable<any> => {
    this.gridLoading = true;
    const attributesToLoad = this.localConfig.columns.map(c => c.field);
    return this.resource.getResourceByQuery(this.localConfig.query, attributesToLoad).pipe(
      map(result => {
        return { data: result.results, total: result.totalCount };
      }),
      tap(() => {
        this.gridLoading = false;
      })
    );
  };

  onExcelExport(grid: GridComponent) {
    grid.saveAsExcel();
  }
}
