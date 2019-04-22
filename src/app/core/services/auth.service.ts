import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { throwError, EMPTY } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { AuthMode, AuthUser, Resource } from '../models/dataContract.model';

import { ConfigService } from './config.service';
import { ResourceService } from './resource.service';
import { UtilsService } from './utils.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  mode: AuthMode;
  get authMode() {
    return this.mode;
  }

  user: AuthUser;
  get authUser() {
    return this.user;
  }

  constructor(
    private router: Router,
    private config: ConfigService,
    private resource: ResourceService,
    private utils: UtilsService,
    private storage: StorageService
  ) {}

  public init() {
    if (this.storage.getItem(this.utils.localStorageLoginMode)) {
      this.mode = AuthMode[localStorage.getItem(this.utils.localStorageLoginMode)];
    }
    if (localStorage.getItem(this.utils.localStorageLoginUser)) {
      this.user = JSON.parse(localStorage.getItem(this.utils.localStorageLoginUser));
    }
  }

  public login(mode: AuthMode, userName?: string, pwd?: string) {
    switch (mode) {
      case AuthMode.windows:
        if (this.user) {
          return EMPTY;
        }
        return this.resource.load().pipe(
          switchMap(() => {
            return this.resource.getCurrentUser().pipe(
              tap((currentUser: Resource) => {
                this.user = {
                  DisplayName: currentUser.DisplayName,
                  ObjectID: currentUser.ObjectID,
                  AccountName: currentUser.AccountName,
                  AccessToken: this.resource.accessToken,
                  AccessConnection: this.resource.accessConnection
                };
                this.mode = AuthMode[mode];
                this.storage.setItem(this.utils.localStorageLoginMode, mode);
                this.storage.setItem(this.utils.localStorageLoginUser, JSON.stringify(this.user));
              })
            );
          })
        );
      case AuthMode.basic:
        break;
      case AuthMode.azure:
      // this._authMode = AuthMode[mode];
      // localStorage.setItem(this.utils.localStorageLoginMode, mode);

      // if (!this.adal.userInfo.authenticated) {
      //   this.adal.login();
      // }
      // return empty();
      default:
        return EMPTY;
    }
  }

  public logout() {
    this.storage.clear();
    this.mode = undefined;
    this.user = undefined;
  }
}
