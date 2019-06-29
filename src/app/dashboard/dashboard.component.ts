import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ComponentFactoryResolver
} from '@angular/core';
import { GridsterConfig, GridType, CompactType, DisplayGrid } from 'angular-gridster2';

import { GridsterComponentItem, DynamicComponent } from '../core/models/dynamicComponent.interface';
import { BroadcastEvent } from '../core/models/dataContract.model';

import { DynamicContainerDirective } from '../core/directives/dynamic-container.directive';

import { ResourceService } from '../core/services/resource.service';
import { SwapService } from '../core/services/swap.service';
import { ComponentIndexService } from '../core/services/component-index.service';
import { UtilsService } from '../core/services/utils.service';
import { ModalService } from '../core/services/modal.service';

import { StateCardComponent } from '../core/components/state-card/state-card.component';
import { ModalType } from '../core/models/componentContract.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren(DynamicContainerDirective)
  dynamicContainers: QueryList<DynamicContainerDirective>;

  editMode = false;
  buttonColor = 'slategray';

  gdOptions: GridsterConfig;

  gdItems: Array<GridsterComponentItem>;

  constructor(
    private cfr: ComponentFactoryResolver,
    private resource: ResourceService,
    private swap: SwapService,
    private com: ComponentIndexService,
    private utils: UtilsService,
    private modal: ModalService
  ) {}

  ngOnInit() {
    this.editMode = this.swap.isEditMode;

    this.gdOptions = {
      gridType: GridType.Fixed,
      compactType: CompactType.CompactLeftAndUp,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 180,
      fixedRowHeight: 180,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };

    this.gdItems = this.resource.primaryViewSetting.dashboard.components as Array<
      GridsterComponentItem
    >;

    this.gdOptions.draggable.enabled = false;
    this.gdOptions.resizable.enabled = false;
    this.gdOptions.displayGrid = DisplayGrid.None;

    this.swap.broadcasted.subscribe((event: BroadcastEvent) => {
      switch (event.name) {
        case 'start-edit':
          this.editMode = true;
          break;
        case 'exit-edit':
          this.editMode = false;
          break;
        default:
          break;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.gdItems.forEach((item: GridsterComponentItem) => {
        const componentFactory = this.cfr.resolveComponentFactory(item.componentType);
        const container = this.dynamicContainers.find(h => h.containerName === item.name);
        if (container) {
          const viewContainerRef = container.viewContainerRef;
          viewContainerRef.clear();
          const componentRef = viewContainerRef.createComponent(componentFactory);
          item.componentInstance = componentRef.instance as DynamicComponent;
          item.componentInstance.config = item.componentConfig;
        }
      });
    }, 0);
  }

  onGridsterEdit() {
    this.gdOptions.draggable.enabled = true;
    this.gdOptions.resizable.enabled = true;
    this.gdOptions.displayGrid = DisplayGrid.Always;
    this.gdOptions.api.optionsChanged();
  }

  onGridsterAdd() {
    this.gdItems.push({
      x: 0,
      y: 0,
      cols: 2,
      rows: 2,
      name: 'scc-test',
      componentType: StateCardComponent,
      componentConfig: undefined
    });
  }

  onGridsterCancel() {
    this.gdOptions.draggable.enabled = false;
    this.gdOptions.resizable.enabled = false;
    this.gdOptions.displayGrid = DisplayGrid.None;
    this.gdOptions.api.optionsChanged();
  }

  onGridsterSave() {
    this.resource.primaryViewSetting.dashboard.components = this.gdItems;
    this.resource.primaryViewSet[this.utils.attConfiguration] = this.com.stringifyComponentConfig(
      this.resource.primaryViewSetting
    );
    const process = this.modal.show(ModalType.progress, 'key_savingChanges', '', '300px');
    this.resource.updateResource(this.resource.primaryViewSet, true).subscribe(
      () => {
        process.close();
      },
      (err: string) => {
        process.close();
        this.modal.show(ModalType.error, 'key_error', err, '360px');
      }
    );
  }

  onGridsterSetting() {
    console.log('gridster setting');
  }

  onGridsterDelete(event: Event, item: GridsterComponentItem) {
    event.preventDefault();
    event.stopPropagation();
    this.gdItems.splice(this.gdItems.indexOf(item), 1);
  }

  onGridsterConfig(event: Event, item: GridsterComponentItem) {
    event.preventDefault();
    event.stopPropagation();
    item.componentInstance.configure().subscribe(config => {
      item.componentConfig = config;
    });
  }
}
