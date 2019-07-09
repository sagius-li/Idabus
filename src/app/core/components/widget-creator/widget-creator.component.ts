import { Component, OnInit } from '@angular/core';

import { ComponentDef } from '../../models/componentContract.model';

import { ComponentIndexService } from '../../services/component-index.service';

@Component({
  selector: 'app-widget-creator',
  templateUrl: './widget-creator.component.html',
  styleUrls: ['./widget-creator.component.scss']
})
export class WidgetCreatorComponent implements OnInit {
  widgets: Array<ComponentDef> = [];

  constructor(private com: ComponentIndexService) {}

  ngOnInit() {
    Object.keys(this.com.componentIndex).forEach(key => {
      this.widgets.push(this.com.componentIndex[key]);
    });
    console.log(this.widgets);
  }
}
