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

  idpValue: Array<{ name: string; email: string }> = [
    { name: 'mimadmin', email: 'mimadmin@contoso.demo' }
  ];
  idpData: Array<{ name: string; email: string }>;
  idpSource: Array<{ name: string; email: string }> = [
    { name: 'mimadmin', email: 'mimadmin@contoso.demo' },
    { name: 'Jie Li', email: 'jl@contoso.demo' },
    { name: 'Andreas Zemla', email: 'az@contoso.demo' },
    { name: 'Moritz Becker', email: 'mb@contoso.demo' },
    { name: 'Ruediger Berndt', email: 'rb@contoso.demo' },
    { name: 'Michael Vollendorf', email: 'mv@contoso.demo' },
    { name: 'Philipp Ringsmeier', email: 'pp@contoso.demo' },
    { name: 'Eva Bauer', email: 'eb@contoso.demo' },
    { name: 'Eva Beck', email: 'ebe@contoso.demo' },
    { name: 'Eva Clark', email: 'ec@contoso.demo' },
    { name: 'Eva Davies', email: 'ed@contoso.demo' },
    { name: 'Eva Watson', email: 'ew@contoso.demo' }
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
