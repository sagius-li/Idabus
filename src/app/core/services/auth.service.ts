import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { EMPTY } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { AuthMode, AuthUser, Resource } from '../models/dataContract.model';

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
    if (this.user) {
      return EMPTY;
    }

    const connectionString =
      mode === AuthMode.basic ? this.resource.buildConnectionString(userName, pwd) : null;

    if (mode === AuthMode.basic || mode === AuthMode.windows) {
      return this.resource.load(connectionString).pipe(
        switchMap(() => {
          return this.resource.getCurrentUser(true).pipe(
            tap((currentUser: Resource) => {
              this.user = {
                DisplayName: currentUser.DisplayName,
                ObjectID: currentUser.ObjectID,
                AccountName: currentUser.AccountName,
                AuthenticationMode: this.resource.authenticationMode,
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
    } else {
      return EMPTY;

      // this._authMode = AuthMode[mode];
      // localStorage.setItem(this.utils.localStorageLoginMode, mode);

      // if (!this.adal.userInfo.authenticated) {
      //   this.adal.login();
      // }
      // return empty();
    }
  }

  public logout() {
    this.storage.clear();
    this.resource.clear();
    this.mode = undefined;
    this.user = undefined;

    this.router.navigate(['/login']);
  }
}
