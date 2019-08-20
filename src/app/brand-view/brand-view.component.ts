import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { Resource } from '../core/models/dataContract.model';
import { TransService } from '../core/models/translation.model';

import { ResourceService } from '../core/services/resource.service';

import { ExtraValuePipe } from '../core/pipes/extra-value.pipe';

@Component({
  selector: 'app-brand-view',
  templateUrl: './brand-view.component.html',
  styleUrls: ['./brand-view.component.scss']
})
export class BrandViewComponent implements OnInit {
  attributesToLoad = [
    'DisplayName',
    'JobTitle',
    'FirstName',
    'LastName',
    'EmployeeType',
    'Photo',
    'Email',
    'OfficePhone',
    'Address'
  ];

  currentResource: Resource;
  obsCurrentResource: Observable<Resource>;

  initial: string;

  private buildInitialName(resource: Resource) {
    let retVal: string;

    const firstName = this.extraValuePipe.transform(resource, 'FirstName:value');
    const lastName = this.extraValuePipe.transform(resource, 'LastName:value');
    const displayName = this.extraValuePipe.transform(resource, 'DisplayName:value');

    if (firstName) {
      if (lastName) {
        retVal = firstName.substr(0, 1) + lastName.substr(0, 1);
      } else {
        retVal = firstName.substr(0, 2);
      }
    } else {
      if (lastName) {
        retVal = lastName.substr(0, 2);
      } else {
        if (displayName) {
          retVal = displayName.substr(0, 2);
        }
      }
    }

    return retVal;
  }

  constructor(
    private resource: ResourceService,
    private route: ActivatedRoute,
    private translate: TransService,
    private extraValuePipe: ExtraValuePipe
  ) {}

  ngOnInit() {
    this.obsCurrentResource = this.route.params.pipe(
      tap(() => {
        // this.spinner.startLoader('spinner_home');
      }),
      switchMap(() => {
        const objectID = this.route.snapshot.paramMap.get('id');
        return this.resource.getResourceByID(
          objectID,
          this.attributesToLoad,
          'full',
          this.translate.currentCulture,
          'true'
        );
      })
    );

    this.obsCurrentResource.subscribe((result: Resource) => {
      this.currentResource = result;
      this.initial = this.buildInitialName(this.currentResource);
      // this.spinner.stopLoader('spinner_home');
    });
  }
}
