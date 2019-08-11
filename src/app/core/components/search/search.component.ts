import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';

import { ResourceSet, Resource, AuthMode } from '../../models/dataContract.model';

import { ResourceService } from '../../services/resource.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('resourceList') resourceList: any;
  @ViewChild('resourceList', { read: ElementRef }) resourceListRef: ElementRef;

  @Output()
  selectResource = new EventEmitter<Resource>();

  resourceData: Resource[] = [];
  canceled = false;

  attDisplayName: string;
  attObjectID: string;

  private contains(target: any): boolean {
    return this.resourceListRef.nativeElement.contains(target);
  }

  constructor(private resource: ResourceService, private utils: UtilsService) {}

  ngOnInit() {
    if (this.resource.authenticationMode === AuthMode.azure) {
      this.attDisplayName = 'displayname';
      this.attObjectID = 'objectid';
    } else {
      this.attDisplayName = 'DisplayName';
      this.attObjectID = 'ObjectID';
    }
  }

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
    if (this.canceled) {
      this.canceled = false;
    }
    if (value.length >= 3) {
      this.resourceList.loading = true;
      this.resourceData = [];
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
    if (this.canceled) {
      this.resourceList.reset();
      this.canceled = false;
    } else {
      if (value && this.utils.ExamValue(value, 'ObjectID')) {
        this.resourceList.reset();
        this.selectResource.emit(value);
      }
    }
  }
}
