import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LocalizationModule } from './localization.module';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TransService } from '../models/translation.model';
import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { AuthService } from '../services/auth.service';
import { StartupService } from '../services/startup.service';

import { ExtraValuePipe } from '../pipes/extra-value.pipe';

import { SigninComponent } from '../components/signin/signin.component';

@NgModule({
  declarations: [ExtraValuePipe, SigninComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,

    FlexLayoutModule,
    LocalizationModule,
    FontAwesomeModule,

    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [ConfigService, ResourceService, AuthService, StartupService, TransService],
  exports: [
    FlexLayoutModule,
    LocalizationModule,
    FontAwesomeModule,

    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,

    ExtraValuePipe,

    SigninComponent
  ]
})
export class CoreModule {}
