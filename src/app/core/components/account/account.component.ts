import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import { Resource, BroadcastEvent } from '../../models/dataContract.model';

import { ResourceService } from '../../services/resource.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { SwapService } from '../../services/swap.service';

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
  attrPhoto: string;
  currentLanguage = '';

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  constructor(
    public resource: ResourceService,
    private translate: TranslateService,
    private auth: AuthService,
    private swap: SwapService
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
    this.swap.broadcasted.subscribe((event: BroadcastEvent) => {
      if (event.name === 'refresh-avatar') {
        this.loginUser = this.resource.loginUser;
        this.brandLetter = this.loginUser.DisplayName
          ? this.loginUser.DisplayName.substr(0, 1)
          : '-';
        this.attrPhoto = this.loginUser.Photo;
      }
    });

    this.currentLanguage = this.translate.currentLang;
    this.loginUser = this.resource.loginUser;
    if (this.loginUser) {
      this.brandLetter = this.loginUser.DisplayName ? this.loginUser.DisplayName.substr(0, 1) : '-';
      this.attrPhoto = this.loginUser.Photo;
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
