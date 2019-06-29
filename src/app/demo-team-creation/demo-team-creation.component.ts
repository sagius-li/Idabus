import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatStepper } from '@angular/material';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-demo-team-creation',
  templateUrl: './demo-team-creation.component.html',
  styleUrls: ['./demo-team-creation.component.scss']
})
export class DemoTeamCreationComponent implements OnInit {
  @ViewChild('idpOwner') public idpOwner: MultiSelectComponent;

  fgGeneral: FormGroup;
  fgAdvanced: FormGroup;

  teamName: string;
  teamDescription: string;

  idpValue: Array<{ name: string; email: string }> = [
    { name: 'mimadmin', email: 'mimadmin@contoso.demo' }
  ];
  idpData: Array<{ name: string; email: string }>;
  idpSource: Array<{ name: string; email: string }> = [
    { name: 'mimadmin', email: 'mimadmin@contoso.demo' },
    { name: 'Jie Li', email: 'jl@contoso.demo' },
    { name: 'Andreas Zemla', email: 'az@contoso.demo' },
    { name: 'Moritz Becker', email: 'mb@contoso.demo' }
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {}, private formBuilder: FormBuilder) {}

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
      this.idpData = this.idpSource.filter(
        p => p.name.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
    } else {
      this.idpOwner.toggle(false);
    }
  }

  onFocus() {
    this.idpOwner.toggle(false);
  }
}
