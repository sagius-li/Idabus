import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

import { Observable, of, Subscription } from 'rxjs';
import { MsalService, BroadcastService } from '@azure/msal-angular';

import { StartupService } from './core/services/startup.service';
import { SwapService } from './core/services/swap.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Idabus';

  msalSubscription: Subscription;

  constructor(
    private startup: StartupService,
    private swap: SwapService,
    private msal: MsalService,
    private msalBroadcast: BroadcastService,
    private auth: AuthService
  ) {
    window.onresize = () => {
      this.swap.verifyWindowSize();
    };
  }

  ngOnInit() {
    this.msalSubscription = this.msalBroadcast.subscribe('msal:loginSuccess', payload => {
      this.auth.initMsal(this.msal.getUser());
    });

    this.startup.init(window.location.pathname).subscribe();
  }

  ngOnDestroy() {
    this.msalBroadcast.getMSALSubject().next(1);
    if (this.msalSubscription) {
      this.msalSubscription.unsubscribe();
    }
  }
}

/*
  Mocked backend service for kendo uploader
  For further details, check https://angular.io/guide/http#writing-an-interceptor.
*/
@Injectable()
export class UploadInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url === 'uploadSaveUrl') {
      return of(new HttpResponse({ status: 200 }));
    }

    return next.handle(req);
  }
}
