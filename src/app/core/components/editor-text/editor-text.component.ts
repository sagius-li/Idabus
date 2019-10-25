import {
  Component,
  OnInit,
  forwardRef,
  ElementRef,
  OnChanges,
  Injector,
  AfterViewInit,
  Type
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  NgControl
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { AttributeEditor } from '../../models/dynamicEditor.interface';
import { TextEditorConfig } from '../../models/editorContract.model';

import { createTextEditorValidator } from '../../validators/text.validator';

import { UtilsService } from '../../services/utils.service';
import { SwapService } from '../../services/swap.service';
import { ResourceService } from '../../services/resource.service';

import { EditorTextConfigComponent } from './editor-text-config.component';

@Component({
  selector: 'app-editor-text',
  templateUrl: './editor-text.component.html',
  styleUrls: ['./editor-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorTextComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EditorTextComponent),
      multi: true
    }
  ]
})
export class EditorTextComponent extends AttributeEditor
  implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor {
  localConfig = new TextEditorConfig();

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

  ngOnInit() {
    this.initComponent();
  }

  ngOnChanges(changes: any) {
    if (changes.config) {
      this.validationFn = createTextEditorValidator(this.config);
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

    this.localConfig = new TextEditorConfig();
    this.utils.CopyInto(this.config, this.localConfig, true, true);

    return this.localConfig;
  }

  configure() {
    const configCopy = this.utils.DeepCopy(this.localConfig);

    const dialogRef = this.dialog.open(EditorTextConfigComponent, {
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
          this.validationFn = createTextEditorValidator(this.localConfig);
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
      // this.swap.changeEditorValue(this.localConfig.name);
      this.swap.propagateEditorValueChanged(this.localConfig.name);
    }
  }

  // #endregion
}
