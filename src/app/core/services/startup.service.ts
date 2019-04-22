import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap, switchMap } from 'rxjs/operators';

import { TransService, Language } from '../models/translation.model';

import { ConfigService } from './config.service';
import { ResourceService } from './resource.service';
import { AuthService } from './auth.service';

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
    private resource: ResourceService,
    private auth: AuthService,
    private router: Router
  ) {}

  public init(currentPath: string) {
    return this.config.load().pipe(
      switchMap(() => {
        const defaultPath = this.config.getConfig('startPath', '/app');
        return this.initTransService().pipe(
          tap(() => {
            this.auth.init();
            if (this.auth.authMode && this.auth.authUser) {
              this.resource.setService(this.auth.authUser);
              if (currentPath !== '/') {
                this.router.navigate(['/splash'], { queryParams: { path: currentPath } });
              } else {
                this.router.navigate(['/splash'], {
                  queryParams: defaultPath
                });
              }
            } else {
              this.router.navigate(['/login'], {
                queryParams: defaultPath
              });
            }
          })
        );
      })
    );
  }
}
