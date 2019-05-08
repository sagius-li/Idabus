import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configLocation = 'assets/config';

  private config: object = null;

  private loaded = false;
  get isLoaded() {
    return this.loaded;
  }

  constructor(private http: HttpClient) {}

  public load() {
    const configFilePath = `${this.configLocation}/config.${environment.env}.json`;
    return this.http.get(configFilePath).pipe(
      tap(config => {
        this.config = config;
        this.loaded = true;
      })
    );
  }

  public getConfig(key: string, fallback?: any): any {
    if (this.loaded && this.config[key]) {
      return this.config[key];
    } else {
      return fallback ? fallback : undefined;
    }
  }
}
