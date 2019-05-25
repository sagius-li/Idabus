import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DragulaModule } from 'ng2-dragula';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/modules/core.module';

import 'hammerjs';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { SplashComponent } from './splash/splash.component';

@NgModule({
  declarations: [AppComponent, TestComponent, LoginComponent, SplashComponent],
  imports: [
    BrowserModule,
    FormsModule,
    DragulaModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
