import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subscription, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { MsalService, BroadcastService } from '@azure/msal-angular';

import { ConfigService } from '../core/services/config.service';
import { TransService } from '../core/models/translation.model';
import { ResourceService } from '../core/services/resource.service';
import { ComponentIndexService } from '../core/services/component-index.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, OnDestroy {
  sub: Subscription;
  msalSub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigService,
    private translate: TransService,
    private resource: ResourceService,
    private com: ComponentIndexService,
    private msal: MsalService,
    private msalBroadcast: BroadcastService
  ) {}

  ngOnInit() {
    const startPath = this.config.getConfig('startPath', '/app');
    let obs: Observable<Params>;

    this.msalSub = this.msalBroadcast.subscribe('msal:loginSuccess', payload => {
      console.log(this.msal.getUser());
    });

    if (this.resource.isLoaded) {
      obs = this.resource.isConfigured
        ? this.resource.getCurrentUser().pipe(
            switchMap(() => {
              return this.route.queryParams;
            })
          )
        : this.resource.getCurrentUser().pipe(
            tap(() => {
              this.resource.customViewSetting = this.com.parseComponentConfig(
                this.resource.customViewSetting
              );
              this.translate.use(this.resource.customViewSetting.language);
            }),
            switchMap(() => {
              return this.resource.getUserConfig().pipe(
                tap(() => {
                  this.resource.primaryViewSetting = this.com.parseComponentConfig(
                    this.resource.primaryViewSetting
                  );
                })
              );
            }),
            switchMap(() => {
              return this.route.queryParams;
            })
          );
    } else {
      obs = this.resource.load(this.resource.accessConnection).pipe(
        switchMap(() => {
          return this.resource.getCurrentUser().pipe(
            tap(() => {
              this.resource.customViewSetting = this.com.parseComponentConfig(
                this.resource.customViewSetting
              );
              this.translate.use(this.resource.customViewSetting.language);
            })
          );
        }),
        switchMap(() => {
          return this.resource.getUserConfig().pipe(
            tap(() => {
              this.resource.primaryViewSetting = this.com.parseComponentConfig(
                this.resource.primaryViewSetting
              );
            })
          );
        }),
        switchMap(() => {
          return this.route.queryParams;
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

    this.msalBroadcast.getMSALSubject().next(1);
    if (this.msalSub) {
      this.msalSub.unsubscribe();
    }
  }
}
