import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWindows } from '@fortawesome/free-brands-svg-icons';
import {
  faCloud,
  faUserAlt,
  faUserCircle,
  faUnlockAlt,
  faCompress,
  faExpandArrowsAlt,
  faEdit,
  faSignOutAlt,
  faSpinner,
  faUsers
} from '@fortawesome/free-solid-svg-icons';

import { DragulaModule } from 'ng2-dragula';

import { MsalModule, MsalInterceptor } from '@azure/msal-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, UploadInterceptor } from './app.component';

import { CoreModule } from './core/modules/core.module';

import 'hammerjs';

import { DemoTeamCreationComponent } from './demo-team-creation/demo-team-creation.component';
import { DemoTeamEditionComponent } from './demo-team-edition/demo-team-edition.component';
import { DemoNextgenComponent } from './demo-nextgen/demo-nextgen.component';

import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { SplashComponent } from './splash/splash.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ResourcesComponent } from './resources/resources.component';

import { UserComponent } from './user/user.component';
import { TabViewComponent } from './tab-view/tab-view.component';
import { GridsterViewComponent } from './gridster-view/gridster-view.component';
import { BrandViewComponent } from './brand-view/brand-view.component';
import { ViewConfiguratorComponent } from './view-configurator/view-configurator.component';
import { WorkflowComponent } from './workflow/workflow.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent,
    SplashComponent,
    SidebarComponent,
    HomeComponent,
    DashboardComponent,
    SettingsComponent,
    ResourcesComponent,

    DemoTeamCreationComponent,
    DemoTeamEditionComponent,
    DemoNextgenComponent,

    UserComponent,
    TabViewComponent,
    GridsterViewComponent,
    BrandViewComponent,
    ViewConfiguratorComponent,
    WorkflowComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    DragulaModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    MsalModule.forRoot({
      clientID: '92070295-c71b-4583-9b88-830ce378933e',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200/login'
    })
  ],
  entryComponents: [DemoTeamCreationComponent, ViewConfiguratorComponent],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UploadInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    library.add(
      faWindows,
      faCloud,
      faUnlockAlt,
      faUserAlt,
      faUserCircle,
      faCompress,
      faExpandArrowsAlt,
      faEdit,
      faSignOutAlt,
      faSpinner,
      faUsers
    );
  }
}
