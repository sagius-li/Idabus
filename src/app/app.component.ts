import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StartupService } from './core/services/startup.service';
import { ConfigService } from './core/services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Idabus';

  private init() {
    const startPath = this.config.getConfig('startPath', '/app');
    this.router.navigate([startPath]);
  }

  constructor(
    private config: ConfigService,
    private router: Router,
    private startup: StartupService
  ) {}

  ngOnInit() {
    if (!this.startup.isInitialized) {
      this.startup.init().subscribe(() => {
        this.init();
      });
    } else {
      this.init();
    }
  }
}
