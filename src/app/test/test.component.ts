import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';

import { TransService, Language } from '../core/models/translation.model';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  // #region general members
  env = environment.env;
  startPath = this.config.getConfig('startPath');
  // #endregion

  // #region members for translation service
  currentLanguage = this.translate.currentLang;
  languages: Language[] = this.translate.supportedLanguages;
  // #endregion

  // #region members for resource service
  dataServiceInfo = this.resource.showInfo();
  // #endregion

  constructor(
    private config: ConfigService,
    private translate: TransService,
    private resource: ResourceService
  ) {}

  ngOnInit() {}

  onChangeLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(language);
  }
}
