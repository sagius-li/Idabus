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
  localConfig = new BooleanEditorConfig();

  get value() {
    if (this.localConfig.customValue) {
      if (String(this.editorAttribute.value) === this.localConfig.trueValue) {
        return true;
      } else if (String(this.editorAttribute.value) === this.localConfig.falseValue) {
        return false;
      } else {
        return undefined;
      }
    }

    return this.editorAttribute.value;
  }
  set value(value) {
    this.editorAttribute.value = value;

    if (this.localConfig.customValue) {
      this.editorAttribute.value = value ? this.localConfig.trueValue : this.localConfig.falseValue;
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
    this.validationFn = createBooleanEditorValidator(this.localConfig);

    if (this.editorAttribute && this.editorAttribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new BooleanEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);
    this.config = this.localConfig;

    return this.localConfig;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(EditorBooleanConfigComponent, {
      minWidth: '620px',
      data: {
        component: this,
        config: this.localConfig,
        attribute: this.editorAttribute
      }
    });

    return dialogRef.afterClosed().pipe(
      tap(result => {
        if (!result || (result && result === 'cancel')) {
          this.localConfig = configCopy;
        } else {
          this.config = this.localConfig;
          this.validationFn = createBooleanEditorValidator(this.localConfig);
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
    this.swap.propagateEditorValueChanged(this.localConfig.attributeName);
  }

  // #endregion
}
