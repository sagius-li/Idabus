import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChildren,
  QueryList,
  ComponentFactoryResolver
} from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatTabChangeEvent } from '@angular/material/tabs';
import { GridsterConfig, GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { environment } from '../../environments/environment';

import { GridsterComponentItem, DynamicComponent } from '../core/models/dynamicComponent.interface';

import { DynamicContainerDirective } from '../core/directives/dynamic-container.directive';

import { TransService, Language } from '../core/models/translation.model';

import { Resource, AttributeResource } from '../core/models/dataContract.model';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';
import { AuthService } from '../core/services/auth.service';

import { StateCardComponent } from '../core/components/state-card/state-card.component';
import { ResourceTableComponent } from '../core/components/resource-table/resource-table.component';
import { ResourceChartComponent } from '../core/components/resource-chart/resource-chart.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TestComponent implements OnInit, AfterViewInit {
  // #region general members
  env = environment.env;
  startPath = this.config ? this.config.getConfig('startPath') : '';
  // #endregion

  // #region members for translation service
  currentLanguage = this.translate.currentLang;
  languages: Language[] = this.translate.supportedLanguages;
  // #endregion

  // #region members for resource service
  dataServiceInfo = this.resource.showInfo();
  fetchText = '';
  fetchedResources: Resource[] = [];
  testResource: Resource;
  // #endregion

  // #region spinner
  spinnerType = SPINNER;
  // #endregion

  // #region angular gridster
  @ViewChildren(DynamicContainerDirective)
  dynamicContainers: QueryList<DynamicContainerDirective>;

  gdOptions: GridsterConfig = {
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

  gdItems: Array<GridsterComponentItem> = [
    {
      cols: 2,
      rows: 1,
      y: 0,
      x: 0,
      name: 'scc1',
      componentType: StateCardComponent,
      componentConfig: {
        name: 'scc1',
        title: 'total users',
        query: `/Person[FirstName='eva']`,
        mainText: '{0}',
        iconText: 'person'
      }
    },
    {
      cols: 3,
      rows: 2,
      y: 0,
      x: 2,
      name: 'scc2',
      componentType: ResourceTableComponent,
      componentConfig: { name: 'scc2', query: '/Person' }
    },
    {
      cols: 3,
      rows: 2,
      y: 0,
      x: 5,
      name: 'scc3',
      componentType: ResourceChartComponent,
      componentConfig: {
        name: 'scc3',
        enableLegend: true,
        enableLabel: false,
        enableTooltip: true,
        seriesConfig: [
          {
            name: 'Requests',
            categoryField: 'category',
            valueField: 'value',
            color: undefined,
            data: undefined,
            queryConfig: [
              {
                name: 'completed',
                method: 'counter',
                attribute: '',
                query: `/Request[RequestStatus='completed']`,
                display: true
              },
              {
                name: 'failed',
                method: 'counter',
                attribute: '',
                query: `/Request[RequestStatus!='completed' and RequestStatus!='pending']`,
                display: true
              },
              {
                name: 'trigger',
                method: 'attribute',
                attribute: 'ocgTriggerValue',
                query: `/Person[AccountName='mimadmin']`,
                display: true
              }
            ]
          }
        ]
      }
    }
  ];
  // #endregion

  // #region attribute editors

  editorResource: Resource = {};

  attrFirstName: AttributeResource = {
    dataType: 'String',
    description: 'Users first name',
    displayName: 'First Name',
    multivalued: false,
    permissionHint: 'Add, Create, Modify, Delete, Read, Remove',
    required: false,
    systemName: 'FirstName',
    value: 'Eva',
    values: ['Eva']
  };

  attrRegister: AttributeResource = {
    dataType: 'Boolean',
    description: 'PWD register',
    displayName: 'Register',
    multivalued: false,
    permissionHint: 'Add, Create, Modify, Delete, Read, Remove',
    required: false,
    systemName: 'Register',
    value: null,
    values: [null]
  };

  // #endregion

  constructor(
    private config: ConfigService,
    private translate: TransService,
    private resource: ResourceService,
    private auth: AuthService,
    private cfr: ComponentFactoryResolver,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.spinner.startLoader('loader-01');
    }, 2000);
    setTimeout(() => {
      this.spinner.stopLoader('loader-01');
    }, 5000);

    this.gdOptions.draggable.enabled = false;
    this.gdOptions.resizable.enabled = false;
    this.gdOptions.displayGrid = DisplayGrid.None;
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

  onChangeLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(language);
  }

  onFetchResource() {
    this.fetchedResources.splice(0, this.fetchedResources.length);
    this.resource
      .getResourceByQuery(this.fetchText, ['DisplayName', 'AccountName', 'Manager'], 3, 0, true)
      .subscribe(resources => {
        if (resources && resources.totalCount > 0) {
          this.fetchedResources = resources.results;
        }
      });
  }

  onDataServiceTest() {
    // getResourceByID test
    this.resource
      .getResourceByID(
        '106a2d89-1c16-423d-9104-f1fbdac5fbb7',
        ['DisplayName', 'AccountName', 'Manager', 'Register', 'FirstName'],
        'full',
        'de',
        'true'
      )
      .subscribe(resource => {
        this.editorResource = resource;
        console.log(resource);
      });

    // getResourceByQuery test
    // this.resource
    //   .getResourceByQuery(
    //     `/Person[starts-with(DisplayName,'eva')]`,
    //     ['DisplayName', 'AccountName', 'Manager'],
    //     10,
    //     0,
    //     true
    //   )
    //   .subscribe(resources => {
    //     console.log(resources);
    //   });

    // schema test
    // this.resource.getResourceSchema('Person', 'de').subscribe(schema => {
    //   console.log(schema);
    // });

    // getResourceCount test
    // this.resource.getResourceCount('/Person').subscribe((count: number) => {
    //   console.log(`count of all users: ${count}`);
    // });

    // CRUD
    // createResource test
    // this.resource
    //   .createResource({
    //     DisplayName: 'creation test',
    //     ObjectType: 'Person',
    //     FirstName: 'creation',
    //     LastName: 'test'
    //   })
    //   .pipe(
    //     tap(id => {
    //       console.log(`resource created with ${id}`);
    //     }),
    //     switchMap(id => {
    //       // updateResource test
    //       return this.resource
    //         .updateResource({
    //           ObjectID: id,
    //           ObjectType: 'Person',
    //           FirstName: 'creationtest',
    //           MiddleName: 'CT'
    //         })
    //         .pipe(
    //           tap(() => {
    //             console.log(`resource ${id} updated`);
    //           }),
    //           switchMap(() => {
    //             // deleteResource test
    //             return this.resource.deleteResource(String(id)).pipe(
    //               tap(() => {
    //                 console.log(`resource ${id} deleted`);
    //               })
    //             );
    //           })
    //         );
    //     })
    //   )
    //   .subscribe();

    // add/removeResourceValue test
    // this.resource
    //   .addResourceValue('7fb2b853-24f0-4498-9534-4e10589723c4', 'ProxyAddressCollection', [
    //     'test1@demo.com',
    //     'test2@demo.com'
    //   ])
    //   .pipe(
    //     tap(() => {
    //       console.log('values added');
    //     }),
    //     switchMap(() => {
    //       return this.resource
    //         .removeResourceValue('7fb2b853-24f0-4498-9534-4e10589723c4', 'ProxyAddressCollection', [
    //           'test1@demo.com'
    //         ])
    //         .pipe(
    //           tap(() => {
    //             console.log('values removed');
    //           })
    //         );
    //     })
    //   )
    //   .subscribe();
  }

  onLogout() {
    this.auth.logout();
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.index === 2 && this.gdOptions.api && this.gdOptions.api.optionsChanged) {
      this.gdOptions.api.optionsChanged();
    }
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
    console.log(this.gdItems);
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

  onSubmit(form: NgForm) {
    console.log(form);
  }
}
