import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-team-edition',
  templateUrl: './demo-team-edition.component.html',
  styleUrls: ['./demo-team-edition.component.scss']
})
export class DemoTeamEditionComponent implements OnInit {
  teams: Array<{ name: string; description: string; selected: boolean }> = [
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
  constructor() {}

  ngOnInit() {}

  onTeamClicked(team: { name: string; description: string; selected: boolean }) {
    this.teams.map(t => (t.selected = false));
    team.selected = true;
  }
}
