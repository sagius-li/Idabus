import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  public getItem(key: string) {
    return localStorage.getItem(key);
  }

  public setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public clear() {
    localStorage.clear();
  }
}
