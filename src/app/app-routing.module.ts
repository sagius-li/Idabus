import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, RouterEvent } from '@angular/router';

import { RouteGuardService } from './core/services/route-guard.service';

import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { SplashComponent } from './splash/splash.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ResourcesComponent } from './resources/resources.component';
import { SettingsComponent } from './settings/settings.component';
import { UserComponent } from './user/user.component';
import { WorkflowComponent } from './workflow/workflow.component';

import { DemoTeamEditionComponent } from './demo-team-edition/demo-team-edition.component';
import { DemoNextgenComponent } from './demo-nextgen/demo-nextgen.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    children: []
  },
  {
    path: 'splash',
    component: SplashComponent,
    children: []
  },
  {
    path: 'test',
    component: TestComponent,
    canActivate: [RouteGuardService],
    children: []
  },
  {
    path: 'app',
    component: HomeComponent,
    canActivate: [RouteGuardService],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: DashboardComponent
      },
      {
        path: 'nextgen',
        component: DemoNextgenComponent
      },
      {
        path: 'resources',
        component: ResourcesComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'person/:id',
        component: UserComponent
      },
      {
        path: 'team',
        component: DemoTeamEditionComponent
      },
      {
        path: 'workflow',
        component: WorkflowComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {});
  }
}
