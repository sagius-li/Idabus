import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

import { SidebarItem } from '../core/models/dataContract.model';

import { ConfigService } from '../core/services/config.service';
import { SwapService } from '../core/services/swap.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input()
  maxSize = 260;

  @Input()
  minSize = 60;

  mode = 'expanded';
  currentSize = this.maxSize;
  icon = 'chevron_left';

  @Output()
  resized = new EventEmitter<string>();

  sidebarItems: Array<any> = [];

  constructor(private config: ConfigService, private router: Router, private swap: SwapService) {
    this.swap.windowResized.subscribe((size: string) => {
      switch (size) {
        case 'xs':
        case 'sm':
          this.mode = 'collapsed';
          this.currentSize = this.minSize;
          break;
        case 'md':
        case 'lg':
        default:
          this.mode = 'expanded';
          this.currentSize = this.maxSize;
          break;
      }
    });
  }

  ngOnInit() {
    this.sidebarItems = this.config
      .getConfig('sidebarItems', [])
      .filter((item: SidebarItem) => item.enabled !== false);
  }

  isFocusedItem(item: SidebarItem) {
    const retVal = this.router.url === '/app/' + item.path;
    return retVal;
  }

  resize() {
    if (this.mode === 'expanded') {
      this.mode = 'collapsed';
      this.icon = 'chevron_right';
      this.currentSize = this.minSize;
      this.resized.emit(this.mode);
    } else if (this.mode === 'collapsed') {
      this.mode = 'expanded';
      this.icon = 'chevron_left';
      this.currentSize = this.maxSize;
      this.resized.emit(this.mode);
    }
  }
}
