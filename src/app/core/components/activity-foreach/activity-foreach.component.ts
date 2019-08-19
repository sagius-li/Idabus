import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ForeachActivity } from '../../models/dataContract.model';

@Component({
  selector: 'app-activity-foreach',
  templateUrl: './activity-foreach.component.html',
  styleUrls: ['./activity-foreach.component.scss']
})
export class ActivityForeachComponent implements OnInit {
  attActivity: ForeachActivity;
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
}
