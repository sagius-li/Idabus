import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StartupService } from './core/services/startup.service';
import { ConfigService } from './core/services/config.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Idabus';

  private init() {
    this.auth.init();

    if (this.auth.authMode && this.auth.authUser) {
    } else {
      this.router.navigate(['/login'], { queryParams: this.config.getConfig('startPath', '/app') });
    }

    // const startPath = this.config.getConfig('startPath', '/app');
    // this.router.navigate([startPath]);
  }

  constructor(
    private config: ConfigService,
    private router: Router,
    private startup: StartupService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // if (!this.startup.isInitialized) {
    //   this.startup.init().subscribe(() => {
    //     this.init();
    //   });
    // } else {
    //   this.init();
    // }

    this.startup.init(window.location.pathname).subscribe();
  }
}
