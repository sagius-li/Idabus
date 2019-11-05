import { Component, OnInit, forwardRef, AfterViewInit, OnChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

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
  implements OnInit, OnChanges, ControlValueAccessor {
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
    private dialog: MatDialog
  ) {
    super();
  }

  setDisplay(usedFor: string = null, optionValue: boolean = null) {
    if (usedFor !== null && optionValue !== null) {
      if (usedFor === 'visibility') {
        this.config.calculatedDisplayable = optionValue;
      } else if (usedFor === 'editability') {
        this.config.calculatedEditable = optionValue;
      }

      return;
    }

    if (!this.configMode && !this.showEditor(this.resource.rightSets)) {
      this.swap.propagateEditorDisplayChanged({
        attributeName: this.config.attributeName,
        usedFor: this.config.accessUsedFor,
        optionValue: false
      });
    } else {
      this.swap.propagateEditorDisplayChanged({
        attributeName: this.config.attributeName,
        usedFor: this.config.accessUsedFor,
        optionValue: true
      });
    }

    if (this.config.accessExpression) {
      const regEx: RegExp = /\[#\w+\]/g;
      const match = regEx.exec(this.config.accessExpression);
      if (match && match.length > 0) {
        const attributeName = match[0].substr(2, match[0].length - 3);
        this.swap.propagateEditorDisplayChanged({
          attributeName,
          usedFor: this.config.accessUsedFor,
          optionValue: undefined
        });
      }
    }
  }

  applyConfig() {
    setTimeout(() => {
      this.setDisplay();
    });
  }

  ngOnInit() {
    this.initComponent();
  }

  ngOnChanges(changes: any) {
    if (changes.config) {
      this.validationFn = createBooleanEditorValidator(this.config);
    }

    if (changes.config && this.config.accessExpression) {
      setTimeout(() => {
        this.setDisplay();
      });
    }
  }

  // #region AttributeEditor implementation

  initComponent() {
    this.validationFn = createBooleanEditorValidator(this.config);

    if (this.editorAttribute && this.editorAttribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    const initConfig = new BooleanEditorConfig();
    this.utils.CopyInto(this.config, initConfig, true, true, [
      'calculatedDisplayable',
      'calculatedEditable'
    ]);
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
          this.applyConfig();
        } else {
          this.validationFn = createBooleanEditorValidator(this.config);
          this.applyConfig();
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
    if (this.change.observers.length > 0) {
      this.change.emit(this.value);
    } else {
      this.swap.propagateEditorValueChanged(this.config.attributeName);
    }
  }

  // #endregion
}
