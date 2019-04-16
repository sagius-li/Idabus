import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { observable, throwError, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import * as moment from 'moment';

import { ConnectedUser } from '../models/dataContract.model';
import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private utils: UtilsService
  ) {}

  private serviceType = 'mim';
  private connection = '';
  private authenticationMode = '';
  private encryptionKey = '';
  private secret = '';
  private token = '';
  private loginUserAttributes: string[] = [];

  private version = '';
  get dataServiceVersion() {
    return this.version;
  }
  private baseUrl = '';
  get dataServiceUrl() {
    return this.baseUrl;
  }
  private language = '';
  get browserLanguage() {
    return this.language;
  }
  private connUser: ConnectedUser;
  get connectedUser() {
    return this.connUser;
  }
  private user: any = undefined;
  get loginUser() {
    return this.user;
  }
  private loaded = false;
  get isLoaded() {
    return this.loaded;
  }

  private getConnectedUser() {
    const result = new ConnectedUser();

    if (this.connection) {
      const entries = this.connection.split(';');
      entries.forEach(entry => {
        const pos = entry.indexOf(':');
        const key = entry.substr(0, pos);
        const value = entry.substr(pos + 1);
        if (key && value) {
          switch (key.trim()) {
            case 'baseaddress':
              result.baseAddress = value.trim();
              break;
            case 'domain':
              result.domain = value.trim();
              break;
            case 'username':
              result.name = value.trim();
              break;
            case 'password':
              result.password = value.trim();
              break;
            default:
              break;
          }
        }
      });
    }

    return result;
  }

  public showInfo() {
    return `Dataservice Version: ${this.dataServiceVersion}<br />Browser Language: ${
      this.browserLanguage
    }<br />Secret: ${this.secret}<br />Login User: ${this.user.DisplayName}`;
  }

  public load(conn?: string) {
    this.baseUrl = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
    this.loginUserAttributes = this.config.getConfig('loginUserAttributes', ['DisplayName']);

    if (conn) {
      this.connection = conn;
      this.authenticationMode = 'basic';
      this.connUser = this.getConnectedUser();
    } else {
      this.connection = undefined;
      this.authenticationMode = 'windows';
    }

    const urlGetVersion = this.utils.buildDataServiceUrl(
      this.baseUrl,
      'general',
      'version',
      this.serviceType
    );
    // get version
    return this.http.get(urlGetVersion).pipe(
      tap((ver: string) => {
        this.version = ver;
        this.loaded = true;
      }),
      // get encryption key
      switchMap(() => {
        const urlGetEncryptionKey = this.utils.buildDataServiceUrl(
          this.baseUrl,
          'general',
          'encryptionKey',
          this.serviceType
        );
        return this.http.get(urlGetEncryptionKey, { responseType: 'text' }).pipe(
          tap((key: string) => {
            if (!key) {
              return throwError(new Error('could not get encryption key'));
            }
            this.encryptionKey = this.utils.Decrypt(key, '');
            this.secret = this.utils.Encrypt(key, this.encryptionKey);
          })
        );
      }),
      // get language
      switchMap(() => {
        const urlGetLanguage = this.utils.buildDataServiceUrl(
          this.baseUrl,
          'general',
          'language',
          this.serviceType
        );
        return this.http.get(urlGetLanguage, { responseType: 'text' }).pipe(
          tap((lang: string) => {
            if (!lang) {
              return throwError(new Error('could not get browser language'));
            }
            this.language = lang;
          })
        );
      }),
      // get current login user
      switchMap(() => {
        if (conn) {
          // using basic authentication
          const urlGetPortalUser = this.utils.buildDataServiceUrl(
            this.baseUrl,
            'admin/resources',
            'basicuser',
            this.serviceType
          );
          if (!this.connectedUser.name) {
            return throwError(new Error('invalid connection'));
          }
          const params: HttpParams = new HttpParams({
            fromObject: {
              accountName: this.connectedUser.name,
              attributes: this.loginUserAttributes.join(',')
            }
          });
          const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
          return this.http.get(urlGetPortalUser, { headers, params }).pipe(
            tap((users: any) => {
              if (users.TotalCount !== 1) {
                throw new Error('Failed to get portal user');
              } else {
                this.user = users[0];
                this.loaded = true;
              }
            })
          );
        } else {
          // using windows authentication
          const urlGetPortalUser = this.utils.buildDataServiceUrl(
            this.baseUrl,
            'admin/resources',
            'winuser',
            this.serviceType
          );
          const params: HttpParams = new HttpParams({
            fromObject: {
              attributes: this.loginUserAttributes.join(',')
            }
          });
          const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
          return this.http.get(urlGetPortalUser, { headers, params, withCredentials: true }).pipe(
            tap((user: any) => {
              this.user = user;
              this.loaded = true;
            }),
            catchError(err => {
              console.log(err);
              return of(err);
            })
          );
        }
      })
    );
  }
}
