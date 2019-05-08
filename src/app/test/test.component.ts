import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { environment } from '../../environments/environment';

import { TransService, Language } from '../core/models/translation.model';

import { Resource } from '../core/models/dataContract.model';

import { ConfigService } from '../core/services/config.service';
import { ResourceService } from '../core/services/resource.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  // #region general members
  env = environment.env;
  startPath = this.config ? this.config.getConfig('startPath') : '';
  // #endregion

  // #region members for translation service
  currentLanguage = this.translate.currentLang;
  languages: Language[] = this.translate.supportedLanguages;
  // #endregion

  // #region members for resource service
  dataServiceInfo = this.resource.showInfo();
  fetchText = '';
  fetchedResources: Resource[] = [];
  testResource: Resource;
  // #endregion

  constructor(
    private router: Router,
    private config: ConfigService,
    private translate: TransService,
    private resource: ResourceService,
    private auth: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.spinner.show('spnWelcome');
    }, 2000);
    setTimeout(() => {
      this.spinner.hide('spnWelcome');
    }, 5000);
  }

  onChangeLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(language);
  }

  onFetchResource() {
    this.fetchedResources.splice(0, this.fetchedResources.length);
    this.resource
      .getResourceByQuery(this.fetchText, ['DisplayName', 'AccountName', 'Manager'], 3, 0, true)
      .subscribe(resources => {
        if (resources && resources.totalCount > 0) {
          this.fetchedResources = resources.results;
        }
      });
  }

  onDataServiceTest() {
    // getResourceByID test
    this.resource
      .getResourceByID(
        '106a2d89-1c16-423d-9104-f1fbdac5fbb7',
        ['DisplayName', 'AccountName', 'Manager'],
        'full',
        'de',
        true
      )
      .subscribe(resource => {
        console.log(resource);
      });

    // getResourceByQuery test
    // this.resource
    //   .getResourceByQuery(
    //     `/Person[starts-with(DisplayName,'eva')]`,
    //     ['DisplayName', 'AccountName', 'Manager'],
    //     10,
    //     0,
    //     true
    //   )
    //   .subscribe(resources => {
    //     console.log(resources);
    //   });

    // schema test
    // this.resource.getResourceSchema('Person', 'de').subscribe(schema => {
    //   console.log(schema);
    // });

    // getResourceCount test
    // this.resource.getResourceCount('/Person').subscribe((count: number) => {
    //   console.log(`count of all users: ${count}`);
    // });

    // CRUD
    // createResource test
    // this.resource
    //   .createResource({
    //     DisplayName: 'creation test',
    //     ObjectType: 'Person',
    //     FirstName: 'creation',
    //     LastName: 'test'
    //   })
    //   .pipe(
    //     tap(id => {
    //       console.log(`resource created with ${id}`);
    //     }),
    //     switchMap(id => {
    //       // updateResource test
    //       return this.resource
    //         .updateResource({
    //           ObjectID: id,
    //           ObjectType: 'Person',
    //           FirstName: 'creationtest',
    //           MiddleName: 'CT'
    //         })
    //         .pipe(
    //           tap(() => {
    //             console.log(`resource ${id} updated`);
    //           }),
    //           switchMap(() => {
    //             // deleteResource test
    //             return this.resource.deleteResource(String(id)).pipe(
    //               tap(() => {
    //                 console.log(`resource ${id} deleted`);
    //               })
    //             );
    //           })
    //         );
    //     })
    //   )
    //   .subscribe();

    // add/removeResourceValue test
    // this.resource
    //   .addResourceValue('7fb2b853-24f0-4498-9534-4e10589723c4', 'ProxyAddressCollection', [
    //     'test1@demo.com',
    //     'test2@demo.com'
    //   ])
    //   .pipe(
    //     tap(() => {
    //       console.log('values added');
    //     }),
    //     switchMap(() => {
    //       return this.resource
    //         .removeResourceValue('7fb2b853-24f0-4498-9534-4e10589723c4', 'ProxyAddressCollection', [
    //           'test1@demo.com'
    //         ])
    //         .pipe(
    //           tap(() => {
    //             console.log('values removed');
    //           })
    //         );
    //     })
    //   )
    //   .subscribe();
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
