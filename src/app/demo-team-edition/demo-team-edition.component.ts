import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { forkJoin } from 'rxjs';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

import { DynamicComponent } from '../core/models/dynamicComponent.interface';

import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ResourceService } from '../core/services/resource.service';

@Component({
  selector: 'app-demo-team-edition',
  templateUrl: './demo-team-edition.component.html',
  styleUrls: ['./demo-team-edition.component.scss']
})
export class DemoTeamEditionComponent implements OnInit {
  @ViewChild('idpAddMember') public idpAddMember: MultiSelectComponent;
  @ViewChildren('gridExplicitMember') public gridExplicitMember: QueryList<DynamicComponent>;

  selectedTeam: any;
  explicitMembers: Array<any> = [];
  initial = '-';

  teams: Array<any> = [];

  explicitMemberConfig = {
    resources: this.explicitMembers,
    columns: [
      { field: 'displayname', title: 'Display Name', width: 40 },
      { field: 'accountname', title: 'E-mail', width: 60 }
    ]
  };

  infoBrandData = {
    displayName: 'Azure Cooperation',
    initial: 'AC',
    title: 'Team Project',
    description: 'Cooperation Project using Teams'
  };

  expiryDate = undefined; // new Date('12/31/2020');

  autoMembers = [
    { name: 'Michael Vollendorf', email: 'mv@ocg.de' },
    { name: 'Carmen Berndt', email: 'cb@ocg.de' },
    { name: 'Moritz Becker', email: 'lw@ocg.de' },
    { name: 'Christoph Demleitner', email: 'cd@ocg.de' }
  ];

  addMemberValue: Array<any> = [];
  addMemberData: Array<any>;

  constructor(private resource: ResourceService, private spinner: NgxUiLoaderService) {}

  ngOnInit() {
    this.spinner.startLoader('spinner_home');
    this.resource.getResourceByQuery('/Team', ['DisplayName', 'Description']).subscribe(result => {
      if (result.totalCount > 0) {
        this.teams = result.results;
      }
      this.spinner.stopLoader('spinner_home');
    });
  }

  onTeamClicked(team: any) {
    this.spinner.startLoader('spinner_home');

    this.teams.map(t => (t.selected = false));
    team.selected = true;

    const observableBatch = [];
    observableBatch.push(
      this.resource.getResourceByID(
        team.objectid,
        ['DisplayName', 'Description', 'owners'],
        'simple',
        '',
        'Owners'
      )
    );
    observableBatch.push(
      this.resource.getResourceByQuery(`/Team[ObjectID='${team.objectid}']/Members`, [
        'DisplayName',
        'AccountName'
      ])
    );

    forkJoin(observableBatch).subscribe(result => {
      if (result && result.length === 2) {
        this.selectedTeam = result[0];
        this.explicitMembers = result[1].results;

        this.initial = this.selectedTeam.displayname.substr(0, 2);

        this.explicitMemberConfig.resources = [];
        this.explicitMemberConfig.resources = this.explicitMembers;
        if (this.gridExplicitMember.first) {
          this.gridExplicitMember.first.updateDataSource(true);
        }
      }
      this.spinner.stopLoader('spinner_home');
    });
  }

  handleSearchFilter(value: string) {
    if (value.length >= 2) {
      this.idpAddMember.loading = true;
      this.addMemberData = [];
      this.resource
        .getResourceByQuery(`/Person[starts-with(DisplayName,'${value}')]`, [
          'DisplayName',
          'AccountName',
          'ObjectID'
        ])
        .subscribe(result => {
          if (result.totalCount > 0) {
            this.addMemberData = result.results;
          }
          this.idpAddMember.loading = false;
        });
    } else {
      this.idpAddMember.toggle(false);
    }
  }

  onFocus() {
    this.idpAddMember.toggle(false);
  }

  onAddMember() {
    this.spinner.startLoader('spinner_home');

    this.addMemberValue.forEach(m => {
      this.explicitMembers.push(m);
    });
    this.addMemberValue = [];

    const resourceToUpdate = {
      objectid: this.selectedTeam.objectid,
      members: this.explicitMembers.map(m => m.objectid)
    };

    this.resource.updateResource(resourceToUpdate).subscribe(
      result => {
        this.spinner.stopLoader('spinner_home');
      },
      error => {
        this.spinner.stopLoader('spinner_home');
      }
    );
  }
}
