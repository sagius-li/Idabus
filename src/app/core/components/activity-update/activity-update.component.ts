import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Activity } from '../../models/dataContract.model';

@Component({
  selector: 'app-activity-update',
  templateUrl: './activity-update.component.html',
  styleUrls: ['./activity-update.component.scss']
})
export class ActivityUpdateComponent implements OnInit {
  attActivity: Activity;
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
