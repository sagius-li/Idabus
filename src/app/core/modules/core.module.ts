import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocalizationModule } from './localization.module';
import { GridsterModule } from 'angular-gridster2';
import { ColorPickerModule } from 'ngx-color-picker';
import { DragulaModule } from 'ng2-dragula';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';

import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PopupModule } from '@progress/kendo-angular-popup';
import { UploadModule } from '@progress/kendo-angular-upload';

import { TransService } from '../models/translation.model';
import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { AuthService } from '../services/auth.service';
import { StartupService } from '../services/startup.service';
import { RouteGuardService } from '../services/route-guard.service';
import { SwapService } from '../services/swap.service';
import { ComponentIndexService } from '../services/component-index.service';

import { ExtraValuePipe } from '../pipes/extra-value.pipe';
import { ExamValuePipe } from '../pipes/exam-value.pipe';

import { DynamicContainerDirective } from '../directives/dynamic-container.directive';

import { SigninComponent } from '../components/signin/signin.component';
import { EditMenuComponent } from '../components/edit-menu/edit-menu.component';
import { SearchComponent } from '../components/search/search.component';
import { AccountComponent } from '../components/account/account.component';

import { StateCardComponent } from '../components/state-card/state-card.component';
import { StateCardConfigComponent } from '../components/state-card/state-card-config.component';
import { ActionCardComponent } from '../components/action-card/action-card.component';
import { ResourceTableComponent } from '../components/resource-table/resource-table.component';
import { ResourceTableConfigComponent } from '../components/resource-table/resource-table-config.component';
import { ResourceChartComponent } from '../components/resource-chart/resource-chart.component';
import { ResourceChartConfigComponent } from '../components/resource-chart/resource-chart-config.component';

@NgModule({
  declarations: [
    ExtraValuePipe,
    ExamValuePipe,

    DynamicContainerDirective,

    SigninComponent,
    EditMenuComponent,
    SearchComponent,
    AccountComponent,

    StateCardComponent,
    StateCardConfigComponent,
    ActionCardComponent,
    ResourceTableComponent,
    ResourceTableConfigComponent,
    ResourceChartComponent,
    ResourceChartConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    FlexLayoutModule,
    LocalizationModule,
    FontAwesomeModule,
    GridsterModule,
    ColorPickerModule,
    DragulaModule,
    NgxUiLoaderModule,

    DragDropModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSelectModule,

    GridModule,
    PDFModule,
    ExcelModule,
    ChartsModule,
    DropDownsModule,
    PopupModule,
    UploadModule
  ],
  entryComponents: [
    StateCardComponent,
    StateCardConfigComponent,
    ResourceTableComponent,
    ResourceTableConfigComponent,
    ResourceChartComponent,
    ResourceChartConfigComponent
  ],
  providers: [
    ExtraValuePipe,
    ExamValuePipe,

    ConfigService,
    ResourceService,
    AuthService,
    StartupService,
    TransService,
    RouteGuardService,
    SwapService,
    ComponentIndexService
  ],
  exports: [
    FlexLayoutModule,
    LocalizationModule,
    FontAwesomeModule,
    GridsterModule,
    ColorPickerModule,
    NgxUiLoaderModule,

    DragDropModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatDividerModule,
    MatGridListModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSelectModule,

    GridModule,
    PDFModule,
    ExcelModule,
    ChartsModule,
    DropDownsModule,
    PopupModule,
    UploadModule,

    ExtraValuePipe,
    ExamValuePipe,

    DynamicContainerDirective,

    SigninComponent,
    EditMenuComponent,
    SearchComponent,
    AccountComponent,

    StateCardComponent,
    StateCardConfigComponent,
    ActionCardComponent,
    ResourceTableComponent,
    ResourceTableConfigComponent,
    ResourceChartComponent,
    ResourceChartConfigComponent
  ]
})
export class CoreModule {}
