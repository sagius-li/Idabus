import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { faCompress, faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import { DragulaService } from 'ng2-dragula';

import { DynamicComponent, ComponentConfig } from '../../models/dynamicComponent.interface';

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
  selector: 'app-resource-table-config',
  templateUrl: './resource-table-config.component.html',
  styleUrls: ['./resource-table-config.component.scss']
})
export class ResourceTableConfigComponent implements OnInit {
  faCollapseAll = faCompress;
  faExpendAll = faExpandArrowsAlt;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      component: DynamicComponent;
      config: ResourceTableConfig;
    },
    private dragula: DragulaService
  ) {
    try {
      this.dragula.createGroup('COLUMNS', {
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

  onToggleColumnDisplay(column: ResourceColumnConfig) {
    if (column.display) {
      column.display = !column.display;
    } else {
      column.display = true;
    }
  }

  onDeleteColumn(column: ResourceColumnConfig) {
    const index = this.data.config.columns.findIndex(c => c.field === column.field);
    // if after remove there is only one column left, which has "lock column" set to true,
    // than "lock column" must be set to false, before column is removed
    if (index > -1) {
      if (this.data.config.columns.length === 2) {
        const lastColumnIndex = index === 0 ? 1 : 0;
        if (this.data.config.columns[lastColumnIndex].locked) {
          this.data.config.columns[lastColumnIndex].locked = false;
        }
      }

      // remove column
      this.data.config.columns.splice(index, 1);
    }
  }

  onAddColumn() {
    this.data.config.columns.push({
      field: 'DisplayName',
      title: 'Display Name',
      width: 100,
      filterable: false,
      filter: 'text',
      sortable: false,
      locked: false
    });
  }

  onExpendAll() {
    this.data.config.columns.map(c => (c.display = true));
  }

  onCollapseAll() {
    this.data.config.columns.map(c => (c.display = false));
  }
}
