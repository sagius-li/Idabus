import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/services/auth.service';
import { AuthMode } from '../core/models/dataContract.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {}

  onWinLogin() {
    this.auth.login(AuthMode.windows).subscribe(() => {
      this.router.navigate(['/splash']);
    });
  }

  onBasicLogin() {}
}
