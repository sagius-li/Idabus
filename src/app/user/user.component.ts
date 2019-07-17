import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import { Resource, BroadcastEvent, AttributeResource } from '../core/models/dataContract.model';

import { ResourceService } from '../core/services/resource.service';
import { TransService } from '../core/models/translation.model';
import { SwapService } from '../core/services/swap.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentResource: Resource;

  obsCurrentResource: Observable<Resource>;

  spinnerName = 'spinnerUserDetail';
  spinnerType = SPINNER;

  resourceForm: FormGroup = new FormGroup({
    controls: new FormArray([])
  });
  get controls() {
    return this.resourceForm.get('controls') as FormArray;
  }

  attributeArray: Array<AttributeResource> = [];
  attributesToLoad = ['DisplayName', 'FirstName', 'LastName'];

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private prepareAttributes() {
    this.clearFormArray(this.controls);
    this.attributeArray.splice(0, this.attributeArray.length);

    this.attributesToLoad.forEach(a => {
      this.attributeArray.push(this.currentResource[a]);
      this.controls.push(new FormControl(this.currentResource[a].value));
    });
  }

  constructor(
    private route: ActivatedRoute,
    private resource: ResourceService,
    private translate: TransService,
    private spinner: NgxUiLoaderService,
    private swap: SwapService
  ) {}

  ngOnInit() {
    this.swap.broadcasted.subscribe((event: BroadcastEvent) => {
      switch (event.name) {
        case 'refresh-language':
          this.spinner.startLoader(this.spinnerName);
          this.obsCurrentResource.subscribe((result: Resource) => {
            this.currentResource = result;
            this.prepareAttributes();
            this.spinner.stopLoader(this.spinnerName);
          });
          break;
        default:
          break;
      }
    });

    this.obsCurrentResource = this.route.params.pipe(
      tap(() => {
        this.spinner.startLoader(this.spinnerName);
      }),
      switchMap(() => {
        const objectID = this.route.snapshot.paramMap.get('id');
        return this.resource.getResourceByID(
          objectID,
          ['DisplayName', 'FirstName', 'LastName'],
          'full',
          this.translate.currentCulture,
          true
        );
      })
    );

    this.obsCurrentResource.subscribe((result: Resource) => {
      this.currentResource = result;
      this.prepareAttributes();

      this.spinner.stopLoader(this.spinnerName);
    });
  }

  onSubmit() {
    console.log(this.resourceForm);
  }
}
