import { Component, OnInit, Input, forwardRef, ElementRef, AfterViewInit } from '@angular/core';
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
import { ResourceService } from '../../services/resource.service';

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
  implements OnInit, AfterViewInit, ControlValueAccessor {
  config = new BooleanEditorConfig();

  get value() {
    if (this.config.customValue) {
      if (String(this.editorAttribute.value) === this.config.trueValue) {
        return true;
      } else if (String(this.editorAttribute.value) === this.config.falseValue) {
        return false;
      } else {
        return undefined;
      }
    }

    return this.editorAttribute.value;
  }
  set value(value) {
    this.editorAttribute.value = value;

    if (this.config.customValue) {
      this.editorAttribute.value = value ? this.config.trueValue : this.config.falseValue;
    }

    this.propagateChange(this.editorAttribute);
  }

  constructor(
    public utils: UtilsService,
    public resource: ResourceService,
    private swap: SwapService,
    private dialog: MatDialog,
    private host: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.initComponent();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      try {
        if (!this.showEditor(this.resource.rightSets)) {
          this.host.nativeElement.parentElement.remove();
        }
      } catch {}
    });
  }

  // #region AttributeEditor implementation

  initComponent() {
    this.validationFn = createBooleanEditorValidator(this.config);

    if (this.editorAttribute && this.editorAttribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    const initConfig = new BooleanEditorConfig();
    this.utils.CopyInto(this.config, initConfig, true, true);
    this.config = initConfig;

    return this.config;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.config);

    const dialogRef = this.dialog.open(EditorBooleanConfigComponent, {
      minWidth: '620px',
      data: {
        component: this,
        config: this.config,
        attribute: this.editorAttribute
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.config = configCopy;
        } else {
          this.validationFn = createBooleanEditorValidator(this.config);
        }
      }),
      switchMap(() => {
        return of(this.config);
      })
    );
  }

  // #endregion

  // #region Event handler

  onFocuse() {
    this.propagateTouched();
  }

  onChange() {
    this.swap.propagateEditorValueChanged(this.config.attributeName);
  }

  // #endregion
}
