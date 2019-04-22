import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, RouterEvent } from '@angular/router';

import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { SplashComponent } from './splash/splash.component';

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
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {});
  }
}
