import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ConfigService } from '../core/services/config.service';

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
    private config: ConfigService
  ) {}

  ngOnInit() {
    const startPath = this.config.getConfig('startPath', '/app');

    this.sub = this.route.queryParams.pipe(delay(2000)).subscribe(params => {
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
