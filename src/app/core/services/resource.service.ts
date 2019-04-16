import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { observable, throwError, of, Observable } from 'rxjs';
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
    }<br />Secret: ${this.secret}<br />Access Token: ${this.token}<br />Login User: ${
      this.user.DisplayName
    }`;
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
      // get token
      switchMap(() => {
        if (conn) {
          const urlGetToken = this.utils.buildDataServiceUrl(
            this.baseUrl,
            'basic/resources',
            'init',
            this.serviceType
          );
          const params: HttpParams = new HttpParams({
            fromObject: {
              connection: conn
            }
          });
          return this.http.get(urlGetToken, { params, responseType: 'text' }).pipe(
            tap((token: string) => {
              this.token = token;
            })
          );
        } else {
          const urlGetToken = this.utils.buildDataServiceUrl(
            this.baseUrl,
            'win/resources',
            'init',
            this.serviceType
          );
          return this.http.get(urlGetToken, { withCredentials: true, responseType: 'text' }).pipe(
            tap((token: string) => {
              this.token = token;
            })
          );
        }
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
            tap((user: object) => {
              this.user = user;
              this.loaded = true;
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
            tap((user: object) => {
              this.user = user;
              this.loaded = true;
            })
          );
        }
      })
    );
  }

  public getResourceByID(
    id: string,
    attributes: string[] = [],
    format: string = 'simple',
    culture: string = 'en-US',
    resolveRef: boolean = false,
    adminMode: boolean = false
  ): Observable<any> {
    if (!id) {
      return throwError('id is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: { attributes, culture, resolveRef: String(resolveRef), format }
    });
    let request: Observable<any>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin',
        'resources',
        this.serviceType,
        [id]
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.get<any>(url, { headers, params });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic',
        'resources',
        this.serviceType,
        [id]
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<any>(url, { headers, params });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win',
        'resources',
        this.serviceType,
        [id]
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<any>(url, { headers, params, withCredentials: true });
    }

    return request;
  }
}
