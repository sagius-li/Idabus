import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { Resource, AttributeResource } from '../core/models/dataContract.model';

import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loginUser: Resource;
  brandLetter = '';
  attrPhoto: AttributeResource;
  currentLanguage = '';

  constructor(private resource: ResourceService, private translate: TranslateService) {}

  ngOnInit() {
    this.currentLanguage = this.translate.currentLang;
    this.loginUser = this.resource.loginUser;
    if (this.loginUser) {
      this.brandLetter = this.loginUser.DisplayName ? this.loginUser.DisplayName.substr(0, 1) : '-';
      this.attrPhoto = this.loginUser.Photo;
    }
  }
}
