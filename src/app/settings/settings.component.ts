import { Component, OnInit } from '@angular/core';

import { SelectEvent, FileInfo, FileRestrictions } from '@progress/kendo-angular-upload';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { Resource } from '../core/models/dataContract.model';

import { TranslateService } from '@ngx-translate/core';
import { ResourceService } from '../core/services/resource.service';
import { SwapService } from '../core/services/swap.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loginUser: Resource;
  brandLetter = '';
  attrPhoto: string;
  currentLanguage = '';

  spinnerType = SPINNER;
  loaderUserSettings = 'loader_userSettings';

  constructor(
    private resource: ResourceService,
    private translate: TranslateService,
    private swap: SwapService,
    private spinner: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.currentLanguage = this.translate.currentLang;
    this.loginUser = this.resource.loginUser;
    if (this.loginUser) {
      this.brandLetter = this.loginUser.DisplayName ? this.loginUser.DisplayName.substr(0, 1) : '-';
      this.attrPhoto = this.loginUser.Photo;
    }
  }

  onPhotoSelected(ev: SelectEvent) {
    ev.files.forEach((file: FileInfo) => {
      if (file.rawFile) {
        const reader = new FileReader();

        reader.onloadend = () => {
          this.spinner.startLoader(this.loaderUserSettings);

          const strPhoto = reader.result as string;
          this.attrPhoto = strPhoto.substr(strPhoto.indexOf(',') + 1);
          this.loginUser.Photo = this.attrPhoto;
          this.resource.loginUser.Photo = this.attrPhoto;

          this.resource.updateResource(this.loginUser).subscribe(
            () => {
              this.swap.broadcast({ name: 'refresh-avatar', parameter: null });
              this.spinner.stopLoader(this.loaderUserSettings);
            },
            () => {
              this.spinner.stopLoader(this.loaderUserSettings);
            }
          );
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }
}
