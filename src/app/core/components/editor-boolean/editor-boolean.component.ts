import { Component, OnInit, Input, forwardRef, ElementRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { AttributeEditor } from '../../models/dynamicEditor.interface';
import { BooleanEditorConfig } from '../../models/editorContract.model';

import { createBooleanEditorValidator } from '../../validators/boolean.validator';

import { UtilsService } from '../../services/utils.service';
import { SwapService } from '../../services/swap.service';

import { EditorBooleanConfigComponent } from './editor-boolean-config.component';

@Component({
  selector: 'app-editor-boolean',
  templateUrl: './editor-boolean.component.html',
  styleUrls: ['./editor-boolean.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorBooleanComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditorBooleanComponent),
      multi: true
    }
  ]
})
export class EditorBooleanComponent extends AttributeEditor
  implements OnInit, ControlValueAccessor {
  @Input()
  control: FormControl;

  localConfig = new BooleanEditorConfig();

  constructor(
    public utils: UtilsService,
    private swap: SwapService,
    private dialog: MatDialog,
    private host: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.initComponent();
  }

  // #region AttributeEditor implementation

  initComponent() {
    try {
      // check 2 times, because the first time the default value (hideIfNoAccess = true) will be returned
      if (!this.showEditor()) {
        setTimeout(() => {
          if (!this.showEditor()) {
            this.host.nativeElement.parentElement.remove();
          }
        });
      }
    } catch {}

    this.validationFn = createBooleanEditorValidator(this.attribute, this.localConfig);

    if (this.attribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new BooleanEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    return this.localConfig;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(EditorBooleanConfigComponent, {
      minWidth: '620px',
      data: {
        component: this,
        config: this.localConfig,
        attribute: this.attribute
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.localConfig = configCopy;
        } else {
          this.config = this.localConfig;
          this.validationFn = createBooleanEditorValidator(this.attribute, this.localConfig);
        }
      }),
      switchMap(() => {
        return of(this.localConfig);
      })
    );
  }

  // #endregion

  // #region Event handler

  onFocuse() {
    this.propagateTouched();
  }

  onChange() {
    if (this.localConfig.name) {
      this.swap.changeEditorValue(this.localConfig.name);
    }
  }

  // #endregion
}
