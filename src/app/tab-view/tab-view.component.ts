import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnInit {
  @Input()
  tabDefs: Array<any>;

  @Input()
  icon: string;

  constructor() {}

  ngOnInit() {
    this.tabDefs = this.tabDefs.sort((t1, t2) => {
      if (t1.x > t2.x) {
        return 1;
      }
      if (t1.x < t2.x) {
        return -1;
      }
      return 0;
    });
  }

  onArrange() {}

  onAddEditor() {}

  onConfig() {}
}
