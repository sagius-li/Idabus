import { Component, OnInit } from '@angular/core';

import { ResourceService } from '../core/services/resource.service';

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
    this.resource.nextGenTest().subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log(error);
      }
    );
  }
}
