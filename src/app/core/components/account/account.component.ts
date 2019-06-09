import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { Resource, AttributeResource } from '../../models/dataContract.model';

import { ResourceService } from '../../services/resource.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('anchor')
  public anchor: ElementRef;

  @ViewChild('popup', { read: ElementRef })
  public popup: ElementRef;

  showMenu = false;
  loginUser: Resource;
  brandLetter = '';
  attrPhoto: AttributeResource;
  attrJobTitle: AttributeResource;
  currentLanguage = '';

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  constructor(
    private router: Router,
    private resource: ResourceService,
    private translate: TranslateService,
    private auth: AuthService
  ) {}

  @HostListener('document:keydown.escape', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.showMenu = false;
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.showMenu = false;
    }
  }

  ngOnInit() {
    this.currentLanguage = this.translate.currentLang;
    this.loginUser = this.resource.loginUser;
    if (this.loginUser) {
      this.brandLetter = this.loginUser.DisplayName ? this.loginUser.DisplayName.substr(0, 1) : '-';
      this.attrPhoto = this.loginUser.Photo;
      this.attrJobTitle = this.loginUser.JobTitle;
    }
  }

  onToggle() {
    this.showMenu = !this.showMenu;
  }

  onChangeLanguage(language: string) {
    this.currentLanguage = language;
    this.translate.use(language);
  }

  onLogout() {
    this.auth.logout();
  }
}
