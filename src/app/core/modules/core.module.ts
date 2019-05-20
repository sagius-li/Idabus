import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocalizationModule } from './localization.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GridsterModule } from 'angular-gridster2';

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

import { TransService } from '../models/translation.model';
import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { AuthService } from '../services/auth.service';
import { StartupService } from '../services/startup.service';

import { ExtraValuePipe } from '../pipes/extra-value.pipe';

import { DynamicContainerDirective } from '../directives/dynamic-container.directive';

import { SigninComponent } from '../components/signin/signin.component';
import { EditMenuComponent } from '../components/edit-menu/edit-menu.component';
import { StateCardComponent } from '../components/state-card/state-card.component';
import { StateCardConfigComponent } from '../components/state-card/state-card-config.component';

@NgModule({
  declarations: [
    ExtraValuePipe,
    DynamicContainerDirective,
    SigninComponent,
    EditMenuComponent,
    StateCardComponent,
    StateCardConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

    FlexLayoutModule,
    LocalizationModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    GridsterModule,

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
    MatGridListModule
  ],
  entryComponents: [StateCardComponent, StateCardConfigComponent],
  providers: [ConfigService, ResourceService, AuthService, StartupService, TransService],
  exports: [
    FlexLayoutModule,
    LocalizationModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    GridsterModule,

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

    ExtraValuePipe,

    DynamicContainerDirective,

    SigninComponent,
    EditMenuComponent,
    StateCardComponent,
    StateCardConfigComponent
  ]
})
export class CoreModule {}
