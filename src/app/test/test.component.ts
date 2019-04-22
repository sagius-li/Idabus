import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

import { TransService, Language } from '../core/models/translation.model';

import { Resource } from '../core/models/dataContract.model';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';
import { AuthService } from '../core/services/auth.service';

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
  fetchText = '';
  fetchedResources: Resource[] = [];
  testResource: Resource;
  // #endregion

  constructor(
    private router: Router,
    private config: ConfigService,
    private translate: TransService,
    private resource: ResourceService,
    private auth: AuthService
  ) {}

  ngOnInit() {}

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

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
