import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/modules/core.module';

import 'hammerjs';
import { TestComponent } from './test/test.component';

@NgModule({
  declarations: [AppComponent, TestComponent],
  imports: [BrowserModule, FormsModule, AppRoutingModule, BrowserAnimationsModule, CoreModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
