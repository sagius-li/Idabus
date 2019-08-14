import { Component, OnInit } from '@angular/core';

import { switchMap, tap } from 'rxjs/operators';
import { SelectEvent, FileInfo } from '@progress/kendo-angular-upload';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { Resource, BasicResource, AuthMode } from '../core/models/dataContract.model';

import { ResourceService } from '../core/services/resource.service';
import { TransService } from '../core/models/translation.model';
import { SwapService } from '../core/services/swap.service';
import { UtilsService } from '../core/services/utils.service';
import { ComponentIndexService } from '../core/services/component-index.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loginUser: Resource;
  brandLetter = '';
  attrPhoto: string;

  primaryViewSet: BasicResource;
  availableViewSets: BasicResource[];
  selectedViewSetID = '';

  customViewSetting: any;
  primaryViewSetting: any;

  textAdminRightSet: string;
  colorAdminRightSet: string;

  textCurrentRightSet: string;
  colorCurrentRightSet: string;

  currentLanguage: string;
  sideMenuExpanded = true;
  advancedSearchAllowed = true;

  spinnerType = SPINNER;
  loaderUserSettings = 'loader_userSettings';
  loaderUiGroups = 'loader_uiGroups';

  authenticationMode: AuthMode;
  selectAllTypes = false;

  exportResourceTypes: Array<{ name: string; query: string; selected: boolean }> = [
    { name: 'l10n_user', query: `/Person`, selected: false },
    { name: 'l10n_group', query: `/Group`, selected: false },
    { name: 'l10n_ou', query: `/ocgOrgUnit`, selected: false },
    { name: 'l10n_role', query: `/ocgRole`, selected: false },
    { name: 'l10n_permission', query: `/ocgPermission`, selected: false },
    { name: 'l10n_assignment', query: `/ocgAssignment`, selected: false }
  ];
  exportConfigTypes: Array<{ name: string; query: string; selected: boolean }> = [
    { name: 'l10n_mpr', query: `/ManagementPolicyRule`, selected: false },
    { name: 'l10n_set', query: `/Set`, selected: false },
    { name: 'l10n_wf', query: `/WorkflowDefinition`, selected: false },
    { name: 'l10n_config', query: `/ocgConfiguration`, selected: false },
    { name: 'l10n_emailTemp', query: `/EmailTemplate`, selected: false }
  ];
  exportSchemaTypes: Array<{ name: string; query: string; selected: boolean }> = [
    { name: 'l10n_type', query: `/ObjectTypeDescription`, selected: false },
    { name: 'l10n_attribute', query: `/AttributeTypeDescription`, selected: false },
    { name: 'l10n_binding', query: `/BindingDescription`, selected: false }
  ];

  constructor(
    private resource: ResourceService,
    private translate: TransService,
    private swap: SwapService,
    private utils: UtilsService,
    private com: ComponentIndexService,
    private spinner: NgxUiLoaderService
  ) {}

  private initSetting(setting: any, value: any) {
    if (setting !== undefined) {
      value = setting;
    } else {
      setting = value;
    }
  }

  private initUiGroups() {
    this.selectedViewSetID = '';

    this.primaryViewSet = this.resource.primaryViewSet;
    this.availableViewSets = this.resource.viewSets;

    if (
      !this.availableViewSets.find(
        s => s.ObjectID.toLowerCase() === this.resource.standardViewSet.ObjectID.toLowerCase()
      )
    ) {
      this.availableViewSets.unshift(this.resource.standardViewSet);
    }

    if (this.resource.isAdminViewSet) {
      this.textAdminRightSet = 'l10n_hasAdminRight';
      this.colorAdminRightSet = 'seagreen';
    } else {
      this.textAdminRightSet = 'l10n_hasNoAdminRight';
      this.colorAdminRightSet = 'coral';
    }
  }

  ngOnInit() {
    this.authenticationMode = this.resource.authenticationMode;

    this.customViewSetting = this.resource.customViewSetting;
    this.primaryViewSetting = this.resource.primaryViewSetting;

    this.currentLanguage = this.customViewSetting.language;
    this.initSetting(this.customViewSetting.sideMenuExpanded, this.sideMenuExpanded);
    this.initSetting(this.customViewSetting.advancedSearchAllowed, this.advancedSearchAllowed);

    this.loginUser = this.resource.loginUser;
    if (this.loginUser) {
      this.brandLetter = this.utils.ExamValue(this.loginUser, 'DisplayName')
        ? this.utils.ExtraValue(this.loginUser, 'DisplayName').substr(0, 1)
        : '-';
      this.attrPhoto = this.utils.ExtraValue(this.loginUser, 'Photo');
    }

    this.initUiGroups();
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

  onPhotoDeleted() {
    this.spinner.startLoader(this.loaderUserSettings);

    this.attrPhoto = '';
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
  }

  onLanguageChanged(language: string) {
    this.spinner.startLoader(this.loaderUserSettings);

    this.customViewSetting.language = language;

    this.resource.loginUser[this.utils.attConfiguration] = JSON.stringify(this.customViewSetting);
    this.resource.updateResource(this.resource.loginUser, true).subscribe(
      () => {
        this.currentLanguage = language;
        this.translate.use(language).subscribe(() => {
          this.swap.broadcast({ name: 'refresh-language', parameter: language });
        });
        this.spinner.stopLoader(this.loaderUserSettings);
      },
      () => {
        this.spinner.stopLoader(this.loaderUserSettings);
      }
    );
  }

  onUiGroupSelectionChanged() {
    if (this.selectedViewSetID) {
      if (
        this.resource.adminViewSets.find(
          s => s.ObjectID.toLowerCase() === this.selectedViewSetID.toLowerCase()
        )
      ) {
        this.textCurrentRightSet = 'l10n_hasAdminRight';
        this.colorCurrentRightSet = 'seagreen';
      } else {
        this.textCurrentRightSet = 'l10n_hasNoAdminRight';
        this.colorCurrentRightSet = 'coral';
      }
    }
  }

  onApplyUiGroup() {
    this.spinner.startLoader(this.loaderUiGroups);

    const selectedViewSet = this.availableViewSets.find(
      s => s.ObjectID.toLowerCase() === this.selectedViewSetID.toLowerCase()
    );
    if (selectedViewSet) {
      this.resource.loginUser[this.utils.attPrimaryViewSets] = selectedViewSet.ObjectID;
    }
    this.resource
      .updateResource(this.resource.loginUser, true)
      .pipe(
        switchMap(() => {
          return this.resource
            .getResourceByID(
              this.selectedViewSetID,
              [this.utils.attConfiguration],
              'simple',
              '',
              false,
              true
            )
            .pipe(
              tap((uiSet: Resource) => {
                this.resource.primaryViewSetting = this.com.parseComponentConfig(
                  uiSet[this.utils.attConfiguration]
                );
              })
            );
        })
      )
      .subscribe(
        () => {
          this.resource.primaryViewSet = selectedViewSet;
          this.resource.checkCurrentViewSet();
          this.initUiGroups();
          this.swap.broadcast({ name: 'refresh-viewset', parameter: null });
          this.spinner.stopLoader(this.loaderUiGroups);
        },
        () => {
          this.spinner.stopLoader(this.loaderUiGroups);
        }
      );
  }

  onSelectAllTypes() {
    if (this.selectAllTypes) {
      this.exportResourceTypes.map(r => {
        r.selected = true;
        return r;
      });
      this.exportConfigTypes.map(r => {
        r.selected = true;
        return r;
      });
      this.exportSchemaTypes.map(r => {
        r.selected = true;
        return r;
      });
    } else {
      this.exportResourceTypes.map(r => {
        r.selected = false;
        return r;
      });
      this.exportConfigTypes.map(r => {
        r.selected = false;
        return r;
      });
      this.exportSchemaTypes.map(r => {
        r.selected = false;
        return r;
      });
    }
  }
}
