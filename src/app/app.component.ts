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

  constructor(
    private config: ConfigService,
    private router: Router,
    private startup: StartupService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.startup.init(window.location.pathname).subscribe();
  }
}
