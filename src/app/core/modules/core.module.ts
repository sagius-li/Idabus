import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TransService } from '../models/translation.model';
import { LocalizationModule } from './localization.module';

import { ConfigService } from '../services/config.service';
import { StartupService } from '../services/startup.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, LocalizationModule],
  providers: [ConfigService, StartupService, TransService],
  exports: [LocalizationModule]
})
export class CoreModule {}
