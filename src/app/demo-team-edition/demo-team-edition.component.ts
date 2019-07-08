import { Component, OnInit, ViewChild } from '@angular/core';

import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-demo-team-edition',
  templateUrl: './demo-team-edition.component.html',
  styleUrls: ['./demo-team-edition.component.scss']
})
export class DemoTeamEditionComponent implements OnInit {
  @ViewChild('idpAddMember') public idpAddMember: MultiSelectComponent;

  teamSeleted = false;

  teams: Array<{ name: string; description: string; selected: boolean }> = [
    { name: 'Azure Cooperation', description: 'Cooperation Project using Teams', selected: false },
    { name: 'OCG DACH', description: 'OCG ID - Serverless architecture', selected: false },
    { name: 'OCGDE Technisch', description: 'OCG technical articles and forums', selected: false },
    { name: 'OCGDE Mitarbeiter', description: 'OCG intern employee materials', selected: false },
    { name: 'OCGDE Development', description: 'OCG development projects', selected: false },
    {
      name: 'DokumentationTemplate',
      description: 'Project document templates',
      selected: false
    }
  ];

  infoBrandData = {
    displayName: 'Azure Cooperation',
    initial: 'AC',
    title: 'Team Project',
    description: 'Cooperation Project using Teams'
  };

  ipdOwner = [{ name: 'Jie Li' }];

  expiryDate = new Date('12/31/2020');

  autoMembers = [
    { name: 'Michael Vollendorf', email: 'mv@ocg.de' },
    { name: 'Carmen Berndt', email: 'cb@ocg.de' },
    { name: 'Moritz Becker', email: 'lw@ocg.de' },
    { name: 'Christoph Demleitner', email: 'cd@ocg.de' }
  ];

  explicitMembers = [
    { name: 'Jens Zaretzke', email: 'jz@ocg.de' },
    { name: 'Lars Wettstein', email: 'lw@ocg.de' }
  ];

  addMemberValue: Array<{ name: string; email: string }> = [];
  addMemberData: Array<{ name: string; email: string }>;
  addMemberSource: Array<{ name: string; email: string }> = [
    { name: 'Jie Li', email: 'jl@ocg.de' },
    { name: 'Andreas Zemla', email: 'az@ocg.de' },
    { name: 'Andrea Murray', email: 'am@ocg.deo' },
    { name: 'Philipp Ringsmeier', email: 'pp@ocg.de' },
    { name: 'Paul Busch', email: 'pb@ocg.de' },
    { name: 'Paul Collins', email: 'pc@ocg.de' },
    { name: 'Paul Ograbisz', email: 'po@ocg.de' },
    { name: 'Paula Pohl', email: 'pp@ocg.de' },
    { name: 'Paula Rams', email: 'pr@ocg.de' }
  ];

  constructor() {}

  ngOnInit() {}

  onTeamClicked(team: { name: string; description: string; selected: boolean }) {
    this.teams.map(t => (t.selected = false));
    team.selected = true;

    this.teamSeleted = true;
  }

  handleSearchFilter(value: string) {
    if (value.length >= 2) {
      this.addMemberData = this.addMemberSource.filter(
        p => p.name.toLowerCase().indexOf(value.toLowerCase()) >= 0
      );
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
