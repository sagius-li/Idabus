import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ResourceSet, Resource } from '../../models/dataContract.model';

import { ResourceService } from '../../services/resource.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('resourceList') resourceList: any;
  @ViewChild('resourceList', { read: ElementRef }) resourceListRef: ElementRef;

  resourceData: Resource[] = [];
  canceled = false;

  private contains(target: any): boolean {
    return this.resourceListRef.nativeElement.contains(target);
  }

  constructor(private resource: ResourceService, private router: Router) {}

  ngOnInit() {}

  @HostListener('document:keydown.escape', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.canceled = true;
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.canceled = true;
    }
  }

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
    setTimeout(() => {
      if (this.canceled) {
        this.resourceList.reset();
        this.canceled = false;
      } else {
        if (value && value.ObjectID) {
          this.resourceList.reset();
          this.router.navigate([`/app/user/${value.ObjectID}`]);
        }
      }
    }, 100);
  }
}
