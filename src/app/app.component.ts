import { Component, OnInit, Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';

import { Observable, of, Subscription } from 'rxjs';

import { StartupService } from './core/services/startup.service';
import { SwapService } from './core/services/swap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Idabus';

  msalSubscription: Subscription;

  constructor(private startup: StartupService, private swap: SwapService) {
    window.onresize = () => {
      this.swap.verifyWindowSize();
    };
  }

  ngOnInit() {
    this.startup.init(window.location.pathname).subscribe();
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
