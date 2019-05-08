import { Component, OnInit, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

import { ComponentConfig, DynamicComponent } from '../../models/dynamicComponent.interface';

import { ResourceService } from '../../services/resource.service';

export class StateCardConfig implements ComponentConfig {
  minimized = false;
  iconText: string;
  iconColor: string;
  backgroundColor: string;
  textColor: string;
  mainTextColor: string;
  title: string;
  mainText: string;
  query: string;

  public constructor(init?: Partial<StateCardConfig>) {
    Object.assign(this, init);
  }
}

@Component({
  selector: 'app-state-card',
  templateUrl: './state-card.component.html',
  styleUrls: ['./state-card.component.scss']
})
export class StateCardComponent implements OnInit, DynamicComponent {
  @Input()
  config: StateCardConfig;

  @Input()
  iconText = 'public';
  @Input()
  iconColor = 'darkseagreen';
  @Input()
  backgroundColor = 'white';
  @Input()
  textColor = 'darkgray';
  @Input()
  mainTextColor = 'black';
  @Input()
  title = 'title';
  @Input()
  mainText = 'main text';
  @Input()
  query: string = undefined;

  localConfig: StateCardConfig;

  constructor(
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private resource: ResourceService
  ) {}

  ngOnInit() {
    this.initComponent();
  }

  resize() {}

  initComponent() {
    this.localConfig = new StateCardConfig({
      iconText: this.iconText,
      iconColor: this.iconColor,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
      mainTextColor: this.mainTextColor,
      title: this.title,
      mainText: this.mainText,
      query: this.query
    });

    if (this.config) {
      if (this.config.iconText) {
        this.localConfig.iconText = this.config.iconText;
      }
      if (this.config.iconColor) {
        this.localConfig.iconColor = this.config.iconColor;
      }
      if (this.config.backgroundColor) {
        this.localConfig.backgroundColor = this.config.backgroundColor;
      }
      if (this.config.textColor) {
        this.localConfig.textColor = this.config.textColor;
      }
      if (this.config.mainTextColor) {
        this.localConfig.mainTextColor = this.config.mainTextColor;
      }
      if (this.config.title) {
        this.localConfig.title = this.config.title;
      }
      if (this.config.mainText) {
        this.localConfig.mainText = this.config.mainText;
      }
      if (this.config.query) {
        this.localConfig.query = this.config.query;
      }
    }

    this.updateDataSource();

    return this.localConfig;
  }

  configure() {
    return null;
  }

  updateDataSource() {
    if (this.localConfig.query) {
      setTimeout(() => {
        this.spinner.show();
      }, 0);

      setTimeout(() => {
        this.resource.getResourceCount(this.resource.lookup(this.localConfig.query)).subscribe(
          result => {
            this.localConfig.mainText = this.localConfig.mainText.replace(
              /\{0\}/g,
              result.toString()
            );
            setTimeout(() => {
              this.spinner.hide();
            }, 0);
          },
          () => {
            setTimeout(() => {
              this.spinner.hide();
            }, 0);
          }
        );
      }, 500);
    }
  }

  onUpdateNow() {
    this.updateDataSource();
  }
}
