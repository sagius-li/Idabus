import { Component, OnInit, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ModalData, ModalType } from '../../models/componentContract.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  type = ModalType;

  barColor: string;
  iconName: string;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  ngOnInit() {
    switch (this.data.type) {
      case ModalType.confirm:
        this.barColor = 'cornflowerblue';
        this.iconName = 'question_answer';
        break;
      case ModalType.error:
        this.barColor = 'coral';
        this.iconName = 'error';
        break;
      case ModalType.info:
        this.barColor = 'darkseagreen';
        this.iconName = 'info';
        break;
      default:
        break;
    }
  }
}
