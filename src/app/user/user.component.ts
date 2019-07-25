import { Component, OnInit } from '@angular/core';

import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  viewSetting: any;

  constructor(private resource: ResourceService) {}

  ngOnInit() {
    this.viewSetting = this.resource.primaryViewSetting.userDetail;
  }
}
