import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  Injector,
  Type,
  forwardRef,
  OnChanges
} from '@angular/core';
import {
  ControlValueAccessor,
  NgControl,
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';

import { MatDialog } from '@angular/material';

import { tap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AttributeEditor } from '../../models/dynamicEditor.interface';
import { SelectEditorConfig } from '../../models/editorContract.model';

import { createSelectEditorValidator } from '../../validators/select.validator';

import { UtilsService } from '../../services/utils.service';
import { ResourceService } from '../../services/resource.service';
import { SwapService } from '../../services/swap.service';

import { EditorSelectConfigComponent } from './editor-select-config.component';

@Component({
  selector: 'app-editor-select',
  templateUrl: './editor-select.component.html',
  styleUrls: ['./editor-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditorSelectComponent),
      multi: true
    }
  ]
})
export class EditorSelectComponent extends AttributeEditor
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {
  localConfig = new SelectEditorConfig();

  constructor(
    public utils: UtilsService,
    public resource: ResourceService,
    private dialog: MatDialog,
    private swap: SwapService,
    private host: ElementRef,
    private injector: Injector
  ) {
    super();
  }

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (changes.config) {
      this.validationFn = createSelectEditorValidator(this.config);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const ngControl: NgControl = this.injector.get<NgControl>(NgControl as Type<NgControl>);
      if (ngControl) {
        this.control = ngControl.control as FormControl;
      }

      try {
        if (!this.showEditor(this.resource.rightSets)) {
          this.host.nativeElement.parentElement.remove();
        }
      } catch {}
    });
  }

  // #region AttributeEditor implementation

  initComponent() {
    if (this.editorAttribute && this.editorAttribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new SelectEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    return this.localConfig;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(EditorSelectConfigComponent, {
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
          this.validationFn = createSelectEditorValidator(this.localConfig);
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
