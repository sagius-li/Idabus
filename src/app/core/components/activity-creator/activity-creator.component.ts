import { Component, OnInit } from '@angular/core';

import { ActivityIndexService } from '../../services/activity-index.service';

@Component({
  selector: 'app-activity-creator',
  templateUrl: './activity-creator.component.html',
  styleUrls: ['./activity-creator.component.scss']
})
export class ActivityCreatorComponent implements OnInit {
  activities: Array<any> = [];

  constructor(private act: ActivityIndexService) {}

  ngOnInit() {
    this.activities = [];

    Object.keys(this.act.activityIndex).forEach(key => {
      this.activities.push(this.act.activityIndex[key]);
    });
  }
}
