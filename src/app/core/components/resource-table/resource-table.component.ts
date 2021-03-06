import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { Observable, of } from 'rxjs';
import { skip, take, map, tap, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { State } from '@progress/kendo-data-query';
import {
  GridDataResult,
  DataStateChangeEvent,
  GridComponent,
  RowArgs,
  CellClickEvent
} from '@progress/kendo-angular-grid';

import { DynamicComponent } from '../../models/dynamicComponent.interface';
import { ResourceTableConfig } from '../../models/componentContract.model';
import { ResourceSet, Resource, BroadcastEvent } from '../../models/dataContract.model';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';

import { ResourceTableConfigComponent } from './resource-table-config.component';

@Component({
  selector: 'app-resource-table',
  templateUrl: './resource-table.component.html',
  styleUrls: ['./resource-table.component.scss']
})
export class ResourceTableComponent implements OnInit, DynamicComponent {
  @Input()
  config: ResourceTableConfig;

  @Output()
  primaryAction = new EventEmitter<BroadcastEvent>();

  localConfig: ResourceTableConfig;

  gridState: State;
  gridResources: Observable<GridDataResult>;
  excelData: Observable<GridDataResult>;
  gridLoading = false;
  gridSelect: any;
  selection: string[] = [];
  clickedRowItem: Resource;

  constructor(
    private dialog: MatDialog,
    private resource: ResourceService,
    private utils: UtilsService
  ) {}

  private fetchDataDic() {
    if (this.localConfig.query) {
      this.gridLoading = true;

      let sortString: string[];
      let queryWithFilter: string;
      if (this.gridState) {
        if (this.gridState.sort) {
          sortString = this.gridState.sort
            .filter(element => element.dir !== undefined)
            .map(item => `${item.field}:${item.dir}`);
        }
        if (
          this.gridState.filter &&
          this.gridState.filter.filters &&
          this.gridState.filter.filters.length > 0
        ) {
          queryWithFilter = this.utils.FilterToXPath(this.gridState.filter);
          if (queryWithFilter) {
            if (this.localConfig.query.endsWith(']')) {
              queryWithFilter = `${this.localConfig.query.substr(
                0,
                this.localConfig.query.length - 1
              )} and (${queryWithFilter})]`;
            } else {
              queryWithFilter = `${this.localConfig.query}[${queryWithFilter}]`;
            }
          }
        }
      }

      const attributesToLoad = this.localConfig.columns.map(c => c.field);
      this.resource
        .getResourceByQuery(
          this.resource.lookup(queryWithFilter ? queryWithFilter : this.localConfig.query),
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
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(ResourceTableConfigComponent, {
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

  updateDataSource(applyConfig = false) {
    this.gridState = { take: this.localConfig.pageSize, skip: 0 };

    this.gridSelect = this.localConfig.selectable
      ? {
          checkboxOnly: this.localConfig.checkboxSelectOnly,
          mode: this.localConfig.selectMode
        }
      : false;

    this.selection = [];

    if (applyConfig) {
      this.utils.CopyInto(this.config, this.localConfig, true, true);
    }

    this.fetchDataDic();
  }

  dataStateChange(state: DataStateChangeEvent): void {
    this.gridState = state;
    this.fetchDataDic();
  }

  allData = (): Observable<any> => {
    this.gridLoading = true;
    const attributesToLoad = this.localConfig.columns.map(c => c.field);
    if (attributesToLoad.findIndex(item => item.toLowerCase() === 'objectid') < 0) {
      attributesToLoad.unshift('ObjectID');
    }
    return this.resource
      .getResourceByQuery(this.resource.lookup(this.localConfig.query), attributesToLoad)
      .pipe(
        map(result => {
          return { data: result.results, total: result.totalCount };
        }),
        tap(() => {
          this.gridLoading = false;
        })
      );
    // tslint:disable-next-line:semicolon
  };

  onExcelExport(grid: GridComponent) {
    grid.saveAsExcel();
  }

  getSelectionAttribute(context: RowArgs): string {
    if (context.dataItem) {
      if (Object.keys(context.dataItem).indexOf('ObjectID') >= 0) {
        return context.dataItem.ObjectID;
      } else if (Object.keys(context.dataItem).indexOf('objectid') >= 0) {
        return context.dataItem.objectid;
      }
    }

    return undefined;
  }

  onCellClick(event: CellClickEvent) {
    this.clickedRowItem = event.dataItem;
  }

  onDoubleClick() {
    this.primaryAction.emit({ name: 'ResourceTableComponent', parameter: this.clickedRowItem });
  }
}
