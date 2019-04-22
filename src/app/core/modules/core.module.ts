import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LocalizationModule } from './localization.module';

import { TransService } from '../models/translation.model';
import { ConfigService } from '../services/config.service';
import { ResourceService } from '../services/resource.service';
import { AuthService } from '../services/auth.service';
import { StartupService } from '../services/startup.service';

import { ExtraValuePipe } from '../pipes/extra-value.pipe';

@NgModule({
  declarations: [ExtraValuePipe],
  imports: [CommonModule, FormsModule, HttpClientModule, LocalizationModule],
  providers: [ConfigService, ResourceService, AuthService, StartupService, TransService],
  exports: [ExtraValuePipe, LocalizationModule]
})
export class CoreModule {}
