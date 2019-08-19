import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatStepper } from '@angular/material';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-demo-team-creation',
  templateUrl: './demo-team-creation.component.html',
  styleUrls: ['./demo-team-creation.component.scss']
})
export class DemoTeamCreationComponent implements OnInit {
  @ViewChild('idpOwner') public idpOwner: MultiSelectComponent;
  @ViewChild('idpSet') public idpSet: MultiSelectComponent;
  @ViewChild('idpMember') public idpMember: MultiSelectComponent;

  fgGeneral: FormGroup;
  fgAdvanced: FormGroup;

  teamName: string;
  teamDescription: string;

  idpValue: Array<{ displayname: string; accountname: string }> = [
    { displayname: 'Jie Li', accountname: 'jl@ocg.de' }
  ];
  idpData: Array<any>;

  idpSetData: Array<{ name: string; description: string }>;
  idpSetSource: Array<{ name: string; description: string }> = [
    { name: 'Consulting', description: 'Department for consulting customer specific solutions' },
    { name: 'Development', description: 'Department for developing IT solutions' },
    { name: 'Design', description: 'Department for UX design' }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {},
    private formBuilder: FormBuilder,
    private resource: ResourceService
  ) {}

  ngOnInit() {
    this.fgGeneral = this.formBuilder.group({
      ctrlTeamName: ['', Validators.required]
    });
    this.fgAdvanced = this.formBuilder.group({});
  }

  onNext(stepper: MatStepper) {
    stepper.next();
  }

  onPrevious(stepper: MatStepper) {
    stepper.previous();
  }

  handleSearchFilter(value: string) {
    if (value.length >= 2) {
      this.idpOwner.loading = true;
      this.idpData = [];
      this.resource
        .getResourceByQuery(`/Person[starts-with(DisplayName,'${value}')]`, [
          'DisplayName',
          'AccountName',
          'ObjectID'
        ])
        .subscribe(result => {
          if (result.totalCount > 0) {
            this.idpData = result.results;
          }
          this.idpOwner.loading = false;
        });
    } else {
      this.idpOwner.toggle(false);
      this.idpSet.toggle(false);
      this.idpMember.toggle(false);
    }
  }

  onFocus() {
    this.idpOwner.toggle(false);
    this.idpSet.toggle(false);
    this.idpMember.toggle(false);
  }
}
