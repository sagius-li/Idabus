import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab-view',
  templateUrl: './tab-view.component.html',
  styleUrls: ['./tab-view.component.scss']
})
export class TabViewComponent implements OnInit {
  @Input()
  tabDefs: Array<any>;

  constructor() {}

  ngOnInit() {}

  onArrange() {}

  onAddEditor() {}

  onConfig() {}
}
