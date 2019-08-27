import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  group,
  animateChild,
  query
} from '@angular/animations';

import { AuthMode, System } from '../../models/dataContract.model';

import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [
    trigger('flyIn', [
      state(
        'init',
        style({
          opacity: 0,
          transform: 'translateY(-200%)'
        })
      ),
      state(
        'in',
        style({
          opacity: 1,
          transform: 'translateY(0)'
        })
      ),
      state(
        'out',
        style({
          opacity: 0,
          transform: 'translateY(200%)'
        })
      ),
      transition('* => *', animate(200))
    ]),
    trigger('classicLogin', [
      state(
        'collapsed',
        style({
          height: '180px'
        })
      ),
      state(
        'expanded',
        style({
          height: '360px'
        })
      ),
      transition('collapsed => expanded', [
        style({ height: '180px' }),
        group([animate(200, style({ height: '360px' })), query('@loginForm', [animateChild()])])
      ]),
      transition('expanded => collapsed', animate(200))
    ]),
    trigger('loginForm', [
      transition(':enter', [style({ opacity: 0 }), animate('500ms 100ms', style({ opacity: 1 }))])
    ])
  ]
})
export class SigninComponent implements OnInit {
  @ViewChild('txtUserName')
  txtUserName: ElementRef;

  iconCloud = 'cloud';
  systems: Array<System> = environment.systems;

  version = environment.version;
  selectedSystem: System;

  animChooseSystem = 'init';
  animSignin = 'init';

  classicLogin = 'collapsed';
  loginForm = 'hide';

  userName: string;
  password: string;

  hidePwd = true;
  invalidUser = false;

  signingWindows = false;
  signingBasic = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.animChooseSystem = 'in';
    }, 500);
  }

  onGotoSystem(system: System) {
    this.selectedSystem = system;
    this.version = `${this.selectedSystem.config} ${environment.version}`;

    if (system.icon === this.iconCloud) {
      this.onAzureLogin();
    } else {
      this.animChooseSystem = 'out';
      setTimeout(() => {
        this.animSignin = 'in';
      }, 300);
    }
  }

  onGoBack() {
    this.animSignin = 'init';
    setTimeout(() => {
      this.animChooseSystem = 'in';
    }, 300);
  }

  onClassicLogin() {
    this.classicLogin = this.classicLogin === 'collapsed' ? 'expanded' : 'collapsed';
    this.loginForm = this.loginForm === 'hide' ? 'show' : 'hide';
    setTimeout(() => {
      if (this.txtUserName) {
        this.txtUserName.nativeElement.focus();
      }
    }, 0);
  }

  onInputChange() {
    this.invalidUser = false;
  }

  onWindowsLogin() {
    this.signingWindows = true;
    this.auth.login(AuthMode.windows).subscribe(
      () => {
        this.signingWindows = false;
        this.router.navigate(['/splash']);
      },
      () => {
        this.signingWindows = false;
        this.invalidUser = true;
      }
    );
  }

  onBasicLogin() {
    this.signingBasic = true;
    this.auth.login(AuthMode.basic, this.userName, this.password).subscribe(
      () => {
        this.signingBasic = false;
        this.router.navigate(['/splash']);
      },
      () => {
        this.signingBasic = false;
        this.invalidUser = true;
      }
    );
  }

  onAzureLogin() {
    this.auth.login(AuthMode.azure);
  }
}
