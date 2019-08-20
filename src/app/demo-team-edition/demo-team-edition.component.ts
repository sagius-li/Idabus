import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { forkJoin } from 'rxjs';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

import { ResourceTableComponent } from '../core/components/resource-table/resource-table.component';

import { ResourceService } from '../core/services/resource.service';
import { DynamicComponent } from '../core/models/dynamicComponent.interface';

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
  // addMemberSource: Array<{ name: string; email: string }> = [
  //   { name: 'Jie Li', email: 'jl@ocg.de' },
  //   { name: 'Andreas Zemla', email: 'az@ocg.de' },
  //   { name: 'Andrea Murray', email: 'am@ocg.deo' },
  //   { name: 'Philipp Ringsmeier', email: 'pp@ocg.de' },
  //   { name: 'Paul Busch', email: 'pb@ocg.de' },
  //   { name: 'Paul Collins', email: 'pc@ocg.de' },
  //   { name: 'Paul Ograbisz', email: 'po@ocg.de' },
  //   { name: 'Paula Pohl', email: 'pp@ocg.de' },
  //   { name: 'Paula Rams', email: 'pr@ocg.de' }
  // ];

  constructor(private resource: ResourceService) {}

  ngOnInit() {
    this.resource.getResourceByQuery('/Team', ['DisplayName', 'Description']).subscribe(result => {
      if (result.totalCount > 0) {
        this.teams = result.results;
      }
    });
  }

  onTeamClicked(team: any) {
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
    this.addMemberValue.forEach(m => {
      this.explicitMembers.push(m);
    });
    this.addMemberValue = [];
  }
}
