import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ResourceSet, Resource } from '../../models/dataContract.model';

import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('resourceList') resourceList;

  resourceData: Resource[] = [];

  selectedObject: Resource;

  constructor(private resource: ResourceService, private router: Router) {}

  ngOnInit() {}

  handleSearchFilter(value: string) {
    if (value.length >= 3) {
      this.resourceList.loading = true;
      const query = `/Person[starts-with(DisplayName,'${value}')]`;
      this.resource.getResourceByQuery(query, ['DisplayName']).subscribe((data: ResourceSet) => {
        this.resourceData = data.results;
        this.resourceList.loading = false;
      });
    } else {
      this.resourceList.toggle(false);
    }
  }

  searchValueChange(value: Resource) {
    this.router.navigate([`/app/user/${value.ObjectID}`]);
  }
}
