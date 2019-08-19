import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CallRestActivity } from '../../models/dataContract.model';

@Component({
  selector: 'app-activity-call-rest',
  templateUrl: './activity-call-rest.component.html',
  styleUrls: ['./activity-call-rest.component.scss']
})
export class ActivityCallRestComponent implements OnInit {
  attActivity: CallRestActivity;
  @Input()
  get activity() {
    return this.attActivity;
  }
  set activity(value) {
    this.attActivity = value;
    this.activityChange.emit(this.attActivity);
  }
  @Output()
  activityChange = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  getHeaderKeys() {
    return Object.keys(this.activity.headerexpressions);
  }

  getQueryKeys() {
    return Object.keys(this.activity.queryexpressions);
  }

  getBodyKeys() {
    return Object.keys(this.activity.bodyexpression);
  }
}
