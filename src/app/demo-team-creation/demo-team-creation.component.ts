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
  @ViewChild('idpSet') public idpSet: MultiSelectComponent;
  @ViewChild('idpMember') public idpMember: MultiSelectComponent;

  fgGeneral: FormGroup;
  fgAdvanced: FormGroup;

  teamName: string;
  teamDescription: string;

  idpValue: Array<{ name: string; email: string }> = [{ name: 'Jie Li', email: 'jl@ocg.de' }];
  idpData: Array<{ name: string; email: string }>;
  idpSource: Array<{ name: string; email: string }> = [
    { name: 'Jenny Weber', email: 'jw@ocg.de' },
    { name: 'Jens Zaretzke', email: 'jz@ocg.de' },
    { name: 'Lara Becker', email: 'lb@ocg.de' },
    { name: 'Lara Roth', email: 'lr@ocg.de' },
    { name: 'Lara Winkler', email: 'lw@ocg.de' },
    { name: 'Lars Wettstein', email: 'lw@ocg.de' }
  ];

  idpSetData: Array<{ name: string; description: string }>;
  idpSetSource: Array<{ name: string; description: string }> = [
    { name: 'Consulting', description: 'Department for consulting customer specific solutions' },
    { name: 'Development', description: 'Department for developing IT solutions' },
    { name: 'Design', description: 'Department for UX design' }
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
      this.idpSetData = this.idpSetSource.filter(
        p => p.name.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
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
