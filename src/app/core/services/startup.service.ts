import { Injectable } from '@angular/core';

import { tap, switchMap } from 'rxjs/operators';

import { TransService, Language } from '../models/translation.model';

import { ConfigService } from './config.service';
import { ResourceService } from './resource.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {
  private initialized = false;
  get isInitialized() {
    return this.initialized;
  }

  private loaded = false;
  get isLoaded() {
    return this.initialized && this.loaded;
  }

  private initTransService() {
    const supportedLanguages: Language[] = this.config.getConfig('supportedLanguages', [
      {
        code: ['en-US', 'en'],
        label: 'English',
        route: 'en'
      }
    ]);
    const languages: string[] = [];
    const userLang = navigator.language;
    let currentLanguage = '';
    supportedLanguages.forEach(language => {
      languages.push(language.route);
      if (language.code.indexOf(userLang) >= 0) {
        currentLanguage = language.route;
      }
    });
    this.translate.addLangs(languages);
    this.translate.setDefaultLang('en');
    this.translate.supportedLanguages = supportedLanguages;
    return this.translate.use(currentLanguage).pipe(
      tap(() => {
        this.initialized = true;
      })
    );
  }

  constructor(
    private config: ConfigService,
    private translate: TransService,
    private resource: ResourceService
  ) {}

  public init() {
    return this.config.load().pipe(
      switchMap(() => {
        return this.initTransService();
      }),
      switchMap(() => {
        return this.resource.load().pipe(
          tap(() => {
            this.loaded = true;
          })
        );
      })
    );
  }
}
