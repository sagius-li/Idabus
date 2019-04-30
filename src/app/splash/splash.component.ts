import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, OnDestroy {
  sub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService,
    private resource: ResourceService
  ) {}

  ngOnInit() {
    const startPath = this.config.getConfig('startPath', '/app');
    let obs: Observable<Params>;

    if (this.resource.isLoaded) {
      obs = this.resource.getCurrentUser().pipe(
        switchMap(() => {
          return this.route.queryParams.pipe(delay(2000));
        })
      );
    } else {
      obs = this.resource.load(this.resource.accessConnection).pipe(
        switchMap(() => {
          return this.resource.getCurrentUser();
        }),
        switchMap(() => {
          return this.route.queryParams.pipe(delay(2000));
        })
      );
    }

    this.sub = obs.subscribe(params => {
      if (params.path) {
        this.router.navigate([params.path]);
      } else {
        this.router.navigate([startPath]);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
