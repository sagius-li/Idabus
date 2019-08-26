import { Injectable } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { ModalType } from '../models/componentContract.model';

import { ModalComponent } from '../components/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private dialog: MatDialog, private translate: TranslateService) {}

  public show(
    type: ModalType,
    title: string,
    content: string,
    width = null
  ): MatDialogRef<ModalComponent> {
    let minWidth = '250px';
    let maxWidth: string;
    if (width) {
      minWidth = width;
      maxWidth = width;
    }
    return this.dialog.open(ModalComponent, {
      minWidth: width,
      maxWidth,
      disableClose: true,
      data: {
        type,
        title: title ? this.translate.instant(title) : '',
        content: content ? this.translate.instant(content) : undefined
      }
    });
  }
}
