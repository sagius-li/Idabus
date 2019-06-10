import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import * as moment from 'moment';

import {
  ConnectedUser,
  ResourceSet,
  Resource,
  AuthUser,
  AuthMode,
  BasicResource
} from '../models/dataContract.model';

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
  private encryptionKey = '';
  private secret = '';
  private loginUserAttributes: string[] = [];

  private authNMode: AuthMode = undefined;
  get authenticationMode() {
    return this.authNMode;
  }
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
  private user: Resource = undefined;
  get loginUser() {
    return this.user;
  }
  private loaded = false;
  get isLoaded() {
    return this.loaded;
  }
  private connection = '';
  get accessConnection() {
    return this.connection;
  }
  private token = '';
  get accessToken() {
    return this.token;
  }
  private rights: string[] = [];
  get rightSets() {
    return this.rights;
  }
  private uiSets: BasicResource[] = [];
  get viewSets() {
    return this.uiSets;
  }
  private adminUiSets: BasicResource[] = [];
  get adminViewSets() {
    return this.adminUiSets;
  }
  private primaryUiSet: BasicResource = null;
  get primaryViewSet() {
    return this.primaryUiSet;
  }
  private standardUiSetting: string;
  get standardViewSetting() {
    return this.standardUiSetting;
  }
  private primaryUiSetting: string;
  get primaryViewSetting() {
    return this.primaryUiSetting;
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

  private acquireToken() {
    const headers: HttpHeaders = this.token
      ? new HttpHeaders().append('token', this.token)
      : undefined;

    if (this.connection) {
      const urlGetToken = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic/resources',
        'init',
        this.serviceType
      );
      const params: HttpParams = new HttpParams({
        fromObject: {
          connection: this.connection
        }
      });
      return this.http.get(urlGetToken, headers ? { params, headers } : { params }).pipe(
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
      return this.http
        .get(urlGetToken, headers ? { headers, withCredentials: true } : { withCredentials: true })
        .pipe(
          tap((token: string) => {
            this.token = token;
          })
        );
    }
  }

  public showInfo() {
    return `Dataservice Version: ${this.dataServiceVersion}<br />Authentication Mode: ${
      this.authNMode
    }<br />Browser Language: ${this.browserLanguage}<br />Secret: ${
      this.secret
    }<br />Access Token: ${this.token}<br />Login User: ${this.user ? this.user.DisplayName : ''}`;
  }

  public clear() {
    this.authNMode = undefined;
    this.encryptionKey = '';
    this.secret = '';
    this.loginUserAttributes = [];
    this.version = '';
    this.baseUrl = '';
    this.language = '';
    this.connUser = undefined;
    this.user = undefined;
    this.loaded = false;
    this.connection = '';
    this.token = '';
  }

  public buildConnectionString(
    userName: string,
    password: string,
    domain?: string,
    baseAddress?: string
  ) {
    if (!domain) {
      domain = this.config.getConfig('domain');
    }
    if (!baseAddress) {
      baseAddress = '//localhost:5725';
    }
    const encryptedpwd = this.utils.Encrypt(password, this.config.getConfig('encryptionKey'));
    return `baseaddress:${baseAddress};domain:${domain};username:${userName};password:${encryptedpwd}`;
  }

  public setService(info: AuthUser) {
    this.authNMode = info.AuthenticationMode;
    this.token = info.AccessToken;
    this.connection = info.AccessConnection;
  }

  public load(conn?: string) {
    this.baseUrl = this.config.getConfig('dataServiceUrl', '//localhost:6867/api/');
    this.loginUserAttributes = this.config.getConfig('loginUserAttributes', ['DisplayName']);

    if (conn) {
      this.connection = conn;
      this.authNMode = AuthMode.basic;
      this.connUser = this.getConnectedUser();
    } else {
      this.connection = undefined;
      this.authNMode = AuthMode.windows;
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
        return this.http.get(urlGetEncryptionKey).pipe(
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
        return this.http.get(urlGetLanguage).pipe(
          tap((lang: string) => {
            if (!lang) {
              return throwError(new Error('could not get browser language'));
            }
            this.language = lang;
          })
        );
      }),
      // acquire token
      switchMap(() => {
        return this.acquireToken().pipe(
          tap(() => {
            this.loaded = true;
          })
        );
      })
    );
  }

  public getUserConfig(): Observable<ResourceSet> {
    const urlSearchResource = this.utils.buildDataServiceUrl(
      this.baseUrl,
      'admin/resources',
      'search',
      this.serviceType
    );

    // get right sets
    const queryGetRightSets = `/Set[ComputedMember='${this.loginUser.ObjectID}']`;
    const paramsGetRightSets: HttpParams = new HttpParams({
      fromObject: {
        query: queryGetRightSets,
        attributes: 'DisplayName'
      }
    });
    const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
    return this.http
      .get<ResourceSet>(urlSearchResource, { headers, params: paramsGetRightSets })
      .pipe(
        tap((data: ResourceSet) => {
          this.rights = data.results.map(item => item.DisplayName);
        }),
        // get view sets
        switchMap(() => {
          const queryGetViewSets = `/Set[ocgObjectType='ui' and ComputedMember='${
            this.loginUser.ObjectID
          }']`;
          const paramsGetViewSets: HttpParams = new HttpParams({
            fromObject: {
              query: queryGetViewSets,
              attributes: 'DisplayName'
            }
          });
          return this.http
            .get<ResourceSet>(urlSearchResource, { headers, params: paramsGetViewSets })
            .pipe(
              tap((data: ResourceSet) => {
                this.uiSets = data.results.map(item => new BasicResource(item));
              })
            );
        }),
        // get admin view sets
        switchMap(() => {
          const queryGetAdminViewSets = `/Set[ocgObjectType='ui' and ObjectID=/Person[ObjectID='${
            this.loginUser.ObjectID
          }']/ocgAdminViewSetRefs]`;
          const paramsGetAdminViewSets: HttpParams = new HttpParams({
            fromObject: {
              query: queryGetAdminViewSets,
              attributes: 'DisplayName'
            }
          });
          return this.http
            .get<ResourceSet>(urlSearchResource, { headers, params: paramsGetAdminViewSets })
            .pipe(
              tap((data: ResourceSet) => {
                this.uiSets = data.results.map(item => new BasicResource(item));
              })
            );
        }),
        // get primary view set
        switchMap(() => {
          const queryGetStandardViewSet = `/Set[ocgObjectType='uibase']`;
          const paramsGetStandardViewSet: HttpParams = new HttpParams({
            fromObject: {
              query: queryGetStandardViewSet,
              attributes: 'DisplayName, ocgConfigurationXML'
            }
          });
          return this.http
            .get<ResourceSet>(urlSearchResource, { headers, params: paramsGetStandardViewSet })
            .pipe(
              tap((data: ResourceSet) => {
                if (data.totalCount > 0) {
                  this.standardUiSetting = data.results[0].ocgConfigurationXML;
                }
              })
            );
        }),
        // get primary view set
        switchMap(() => {
          const queryGetPrimaryViewSet = `/Set[ocgObjectType='ui' and ObjectID=/Person[ObjectID='${
            this.loginUser.ObjectID
          }']/ocgPrimaryViewSetRef]`;
          const paramsGetPrimaryViewSet: HttpParams = new HttpParams({
            fromObject: {
              query: queryGetPrimaryViewSet,
              attributes: 'DisplayName, ocgConfigurationXML'
            }
          });
          return this.http
            .get<ResourceSet>(urlSearchResource, { headers, params: paramsGetPrimaryViewSet })
            .pipe(
              tap((data: ResourceSet) => {
                if (data.totalCount > 0) {
                  this.primaryUiSet = new BasicResource(data.results[0]);
                  this.primaryUiSetting = data.results[0].ocgConfigurationXML;
                } else {
                  this.primaryUiSetting = this.standardUiSetting;
                }
              })
            );
        })
      );
  }

  public getCurrentUser(isAuth = false): Observable<Resource> {
    if (this.connection) {
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
          attributes: isAuth ? 'DisplayName' : this.loginUserAttributes.join(',')
        }
      });
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      return this.http.get(urlGetPortalUser, { headers, params }).pipe(
        tap((user: Resource) => {
          this.user = user;
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
          attributes: isAuth ? 'DisplayName' : this.loginUserAttributes.join(',')
        }
      });
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      return this.http.get(urlGetPortalUser, { headers, params, withCredentials: true }).pipe(
        tap((user: Resource) => {
          this.user = user;
        })
      );
    }
  }

  public getResourceByID(
    id: string,
    attributes: string[] = [],
    format = 'simple',
    culture = 'en-US',
    resolveRef = false,
    adminMode = false
  ): Observable<Resource> {
    if (!id) {
      return throwError('id is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: {
        attributes: attributes.join(','),
        culture,
        resolveRef: String(resolveRef),
        format
      }
    });
    let request: Observable<Resource>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin',
        'resources',
        this.serviceType,
        [id]
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.get<Resource>(url, { headers, params });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic',
        'resources',
        this.serviceType,
        [id]
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<Resource>(url, { headers, params });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win',
        'resources',
        this.serviceType,
        [id]
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<Resource>(url, { headers, params, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.getResourceByID(id, attributes, format, culture, resolveRef, adminMode);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public getResourceSchema(typeName: string, culture = 'en-US'): Observable<Resource> {
    if (!typeName) {
      return throwError('type name is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: {
        culture
      }
    });
    let request: Observable<Resource>;

    const url = this.utils.buildDataServiceUrl(this.baseUrl, 'schema', typeName, this.serviceType);
    const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
    request = this.http.get<Resource>(url, { headers, params });

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.getResourceSchema(typeName, culture);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public getResourceByQuery(
    query: string,
    attributes: string[] = [],
    pageSize = 0,
    index = 0,
    resolveRef = false,
    orderBy: string[] = [],
    adminMode = false
  ): Observable<ResourceSet> {
    if (!query) {
      return throwError('query is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: {
        query,
        attributes: attributes.join(','),
        pageSize: String(pageSize),
        index: String(index),
        resolveRef: String(resolveRef),
        orderBy: orderBy.join(',')
      }
    });
    let request: Observable<ResourceSet>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin/resources',
        'search',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.get<ResourceSet>(url, { headers, params });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic/resources',
        'search',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<ResourceSet>(url, { headers, params });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win/resources',
        'search',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<ResourceSet>(url, { headers, params, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.getResourceByQuery(
                query,
                attributes,
                pageSize,
                index,
                resolveRef,
                orderBy,
                adminMode
              );
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public deleteResource(id: string, adminMode = false) {
    if (!id) {
      return throwError('id is missing');
    }
    let request: Observable<void>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin/resources',
        id,
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.delete<void>(url, { headers });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic/resources',
        id,
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.delete<void>(url, { headers });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win/resources',
        id,
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.delete<void>(url, { headers, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.deleteResource(id, adminMode);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public createResource(resource: Resource, adminMode = false) {
    if (!resource) {
      return throwError('resource is missing');
    }
    let request: Observable<string>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin',
        'resources',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.post<string>(url, resource, { headers });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic',
        'resources',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<string>(url, resource, { headers });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win',
        'resources',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<string>(url, resource, { headers, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.createResource(resource, adminMode);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public updateResource(resource: Resource, adminMode = false) {
    if (!resource) {
      return throwError('resource is missing');
    }
    let request: Observable<string>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin',
        'resources',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.patch<string>(url, resource, { headers });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic',
        'resources',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.patch<string>(url, resource, { headers });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win',
        'resources',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.patch<string>(url, resource, { headers, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.updateResource(resource, adminMode);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public getResourceCount(query: string, adminMode = false): Observable<number> {
    if (!query) {
      return throwError('query is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: {
        query
      }
    });
    let request: Observable<number>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin/resources',
        'count',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.get<number>(url, { headers, params });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic/resources',
        'count',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<number>(url, { headers, params });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win/resources',
        'count',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.get<number>(url, { headers, params, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.getResourceCount(query);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public addResourceValue(
    id: string,
    attributeName: string,
    valuesToAdd: string[] = [],
    adminMode = false
  ): Observable<void> {
    if (!id) {
      return throwError('id is missing');
    }
    if (!attributeName) {
      return throwError('attribute name is missing');
    }
    if (!valuesToAdd || valuesToAdd.length === 0) {
      return throwError('values to add is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: {
        id,
        attributeName,
        valuesToAdd: valuesToAdd.join(',')
      }
    });
    let request: Observable<void>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin/resources',
        'values/add',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.post<void>(url, null, { headers, params });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic/resources',
        'values/add',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<void>(url, null, { headers, params });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win/resources',
        'values/add',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<void>(url, null, { headers, params, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.addResourceValue(id, attributeName, valuesToAdd, adminMode);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public removeResourceValue(
    id: string,
    attributeName: string,
    valuesToRemove: string[] = [],
    adminMode = false
  ): Observable<void> {
    if (!id) {
      return throwError('id is missing');
    }
    if (!attributeName) {
      return throwError('attribute name is missing');
    }
    if (!valuesToRemove || valuesToRemove.length === 0) {
      return throwError('values to remove is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: {
        id,
        attributeName,
        valuesToRemove: valuesToRemove.join(',')
      }
    });
    let request: Observable<void>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin/resources',
        'values/remove',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.post<void>(url, null, { headers, params });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic/resources',
        'values/remove',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<void>(url, null, { headers, params });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win/resources',
        'values/remove',
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<void>(url, null, { headers, params, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.removeResourceValue(id, attributeName, valuesToRemove, adminMode);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public approve(
    id: string,
    approve: boolean,
    reason: string,
    adminMode = false
  ): Observable<void> {
    if (!id) {
      return throwError('id is missing');
    }

    const params: HttpParams = new HttpParams({
      fromObject: {
        reason
      }
    });
    let request: Observable<void>;

    if (adminMode === true) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'admin/resources',
        `approve/${id}/${approve}`,
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('secret', this.secret);
      request = this.http.post<void>(url, { headers, params });
    } else if (this.connection) {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'basic/resources',
        `approve/${id}/${approve}`,
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<void>(url, { headers, params });
    } else {
      const url = this.utils.buildDataServiceUrl(
        this.baseUrl,
        'win/resources',
        `approve/${id}/${approve}`,
        this.serviceType
      );
      const headers: HttpHeaders = new HttpHeaders().append('token', this.token);
      request = this.http.post<void>(url, { headers, params, withCredentials: true });
    }

    return request.pipe(
      catchError(err => {
        if (err.status === 409) {
          return this.acquireToken().pipe(
            switchMap(() => {
              return this.approve(id, approve, reason, adminMode);
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  public lookup(text: string) {
    let result = text;

    // resolve [//loginUser]
    result = result.replace(
      new RegExp(`\\[\\/\\/loginUser\\]`, 'g'),
      this.loginUser ? this.loginUser.ObjectID : ''
    );

    // resolve <today()>
    const re = new RegExp(`\\<today\\(\\)[+-]?\\d*\\>`, 'g');
    let m: any;
    do {
      m = re.exec(result);
      if (m && m.length > 0) {
        const param = m[0].substring(8, m[0].length - 1);
        const dt = param ? moment().add(+param, 'd') : moment();
        result = result.replace(m[0], dt.format('YYYY-MM-DDT00:00:00'));
      }
    } while (m);

    return result;
  }
}
