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
  implements OnInit, ControlValueAccessor {
  @Input()
  control: FormControl;

  localConfig = new BooleanEditorConfig();

  get value() {
    const returnValue = this.isFormControl ? this.controlValue : this.attribute.value;

    if (this.localConfig.customValue) {
      if (String(returnValue) === this.localConfig.trueValue) {
        return true;
      } else if (String(returnValue) === this.localConfig.falseValue) {
        return false;
      } else {
        return undefined;
      }
    }

    return returnValue;
  }
  set value(value) {
    this.controlValue = value;

    if (this.localConfig.customValue) {
      this.controlValue = value ? this.localConfig.trueValue : this.localConfig.falseValue;
    }

    this.propagateChange(this.controlValue);
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

  // #region AttributeEditor implementation

  initComponent() {
    this.validationFn = createBooleanEditorValidator(this.attribute, this.localConfig);

    if (this.attribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new BooleanEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    try {
      if (!this.showEditor(this.resource.rightSets)) {
        this.host.nativeElement.parentElement.remove();
      }
    } catch {}

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
      this.swap.propagateEditorValueChanged(this.localConfig.name);
    }
  }

  // #endregion
}
