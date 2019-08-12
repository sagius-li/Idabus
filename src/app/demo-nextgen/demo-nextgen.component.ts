import { Component, OnInit } from '@angular/core';

import { ResourceService } from '../core/services/resource.service';
import { Resource, ResourceSet } from '../core/models/dataContract.model';

@Component({
  selector: 'app-demo-nextgen',
  templateUrl: './demo-nextgen.component.html',
  styleUrls: ['./demo-nextgen.component.scss']
})
export class DemoNextgenComponent implements OnInit {
  constructor(private resource: ResourceService) {}

  ngOnInit() {}

  onNextGenServiceTest() {
    console.log(this.resource.loginUser);

    /** get resource by id */
    // this.resource.getResourceByID('3d111a93-01c3-4829-9eed-635cebce6b32', [], 'full').subscribe(
    //   (result: Resource) => {
    //     console.log(result);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );

    /** get resource by query */
    this.resource.getResourceByQuery('/Person', ['FirstName', 'LastName'], 10, 0).subscribe(
      (result: ResourceSet) => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );

    /** get resource schema */
    // this.resource.getResourceSchema('Set').subscribe(
    //   result => {
    //     console.log(result);
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }
}
