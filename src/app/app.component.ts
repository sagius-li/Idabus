import { Component, OnInit } from '@angular/core';

import { StartupService } from './core/services/startup.service';
import { SwapService } from './core/services/swap.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Idabus';

  constructor(private startup: StartupService, private swap: SwapService) {
    window.onresize = () => {
      this.swap.verifyWindowSize();
    };
  }

  ngOnInit() {
    this.startup.init(window.location.pathname).subscribe();
  }
}
