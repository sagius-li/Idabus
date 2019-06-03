import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

import { ResourceService } from './resource.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  constructor(private router: Router, private resource: ResourceService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.resource.isLoaded) {
      return true;
    }

    return false;
  }
}
