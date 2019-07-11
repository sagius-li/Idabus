import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap } from 'rxjs/operators';

import { Resource } from '../core/models/dataContract.model';

import { ResourceService } from '../core/services/resource.service';
import { TransService } from '../core/models/translation.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentUser: Resource;

  constructor(
    private route: ActivatedRoute,
    private resource: ResourceService,
    private translate: TransService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        switchMap(() => {
          const objectID = this.route.snapshot.paramMap.get('id');
          return this.resource.getResourceByID(
            objectID,
            ['DisplayName', 'FirstName', 'LastName'],
            'full',
            'en-US',
            true
          );
        })
      )
      .subscribe((result: Resource) => {
        this.currentUser = result;
        console.log(result);
      });

    // this.route.params.subscribe(() => {
    //   const objectID = this.route.snapshot.paramMap.get('id');
    //   this.resource.getResourceByID(objectID, [], 'full', '', true).subscribe(resource => {

    //   });
    // });
  }
}
