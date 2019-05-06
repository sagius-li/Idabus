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

import { faWindows } from '@fortawesome/free-brands-svg-icons';
import { faCloud, faUserAlt, faUserCircle, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';

import { AuthMode } from '../../models/dataContract.model';

import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  animations: [
    trigger('flyIn', [
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
          transform: 'translateY(-100%)'
        })
      ),
      transition('out => in', animate(200))
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

  version = environment.version;

  flyIn = 'out';
  classicLogin = 'collapsed';
  loginForm = 'hide';

  faWindows = faWindows;
  faCloud = faCloud;
  faUserAlt = faUserAlt;
  faUserCircle = faUserCircle;
  faLock = faUnlockAlt;

  userName: string;
  password: string;

  hidePwd = true;
  invalidUser = false;

  signingWindows = false;
  signingBasic = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.flyIn = 'in';
    }, 500);
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
