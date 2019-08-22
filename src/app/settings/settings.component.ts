import { Component, OnInit } from '@angular/core';

import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SelectEvent, FileInfo, FileRestrictions } from '@progress/kendo-angular-upload';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { ModalType } from '../core/models/componentContract.model';
import { Resource, BasicResource, AuthMode, ResourceSet } from '../core/models/dataContract.model';

import { ResourceService } from '../core/services/resource.service';
import { TransService } from '../core/models/translation.model';
import { SwapService } from '../core/services/swap.service';
import { UtilsService } from '../core/services/utils.service';
import { ComponentIndexService } from '../core/services/component-index.service';
import { ModalService } from '../core/services/modal.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loginUser: Resource;
  brandLetter = '';
  attrPhoto: string;

  photoRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png']
  };
  importRestrictions: FileRestrictions = {
    allowedExtensions: ['.json']
  };

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
    {
      name: 'l10n_wf',
      query: `/WorkflowDefinition[starts-with(DisplayName,'azure')]`,
      selected: false
    },
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
    private spinner: NgxUiLoaderService,
    private modal: ModalService
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
    if (ev.files[0].extension !== '.jpg' && ev.files[0].extension !== '.png') {
      this.modal.show(ModalType.error, 'key_error', 'l10n_fileTypeNotAllowed');
      return;
    }

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
              'false',
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

  onExportResources() {
    const progress = this.modal.show(ModalType.progress, 'l10n_exportingData', '', '300px');

    const observableBatch = [];
    this.exportResourceTypes.forEach(e => {
      if (e.selected) {
        observableBatch.push(this.resource.getResourceByQuery(e.query));
      }
    });
    this.exportConfigTypes.forEach(e => {
      if (e.selected) {
        observableBatch.push(this.resource.getResourceByQuery(e.query));
      }
    });
    this.exportSchemaTypes.forEach(e => {
      if (e.selected) {
        observableBatch.push(this.resource.getResourceByQuery(e.query));
      }
    });

    if (observableBatch.length > 0) {
      forkJoin(observableBatch).subscribe(
        result => {
          let exportData: Array<Resource> = [];
          if (result && result.length > 0) {
            result.forEach((r: ResourceSet) => {
              exportData = exportData.concat(r.results);
            });
          }
          // const blob = new Blob([JSON.stringify(exportData)], {
          //   type: 'application/json;charset=utf-8'
          // });
          const dataUri = 'data:text/plain;base64,' + encodeBase64(JSON.stringify(exportData));
          saveAs(dataUri, 'export.json');
          progress.close();
        },
        error => {
          progress.close();
          this.modal.show(ModalType.error, 'key_error', error);
        }
      );
    }
  }

  onImportResourcesNative(ev) {
    const fileList: FileList = ev.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.resource
        .importResourceFromFile(file, 'WorkflowDefinition', 'Creator', '', true)
        .subscribe(
          data => {
            console.log(data);
          },
          error => {
            console.log(error);
          }
        );
    }
  }

  onImportResources(ev: SelectEvent) {
    if (ev.files[0].extension !== '.json') {
      this.modal.show(ModalType.error, 'key_error', 'l10n_fileTypeNotAllowed');
      return;
    }

    const progress = this.modal.show(ModalType.progress, 'l10n_importingData', '', '300px');

    ev.files.forEach((file: FileInfo) => {
      if (file.rawFile) {
        this.resource
          .importResourceFromFile(file.rawFile, 'WorkflowDefinition', 'Creator', '', false)
          .subscribe(
            data => {
              progress.close();
              if (data) {
                if (data.errors && data.errors.length > 0) {
                  this.modal.show(ModalType.error, 'key_error', data.errors[0]);
                } else if (data.warnings && data.warnings.length > 0) {
                  this.modal.show(ModalType.info, 'key_warning', data.warnings[0]);
                }
              }
            },
            error => {
              progress.close();
              this.modal.show(ModalType.error, 'key_error', error.message);
            }
          );
      }
    });
  }

  hasExports() {
    const counterResourceTypes = this.exportResourceTypes.findIndex(e => e.selected === true);
    const counterConfigTypes = this.exportConfigTypes.findIndex(e => e.selected === true);
    const counterSchemaTypes = this.exportSchemaTypes.findIndex(e => e.selected === true);

    if (counterResourceTypes >= 0 || counterConfigTypes >= 0 || counterSchemaTypes >= 0) {
      return true;
    }

    return false;
  }
}
