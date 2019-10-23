import { Component, OnInit, Input, forwardRef, ElementRef, OnChanges } from '@angular/core';
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
  implements OnInit, OnChanges, ControlValueAccessor {
  @Input()
  control: FormControl;

  localConfig = new TextEditorConfig();

  constructor(
    public utils: UtilsService,
    public resource: ResourceService,
    private dialog: MatDialog,
    private swap: SwapService,
    private host: ElementRef
  ) {
    super();
  }

  ngOnInit() {
    this.initComponent();
  }

  ngOnChanges(changes: any) {
    if (changes.config) {
      this.validationFn = createTextEditorValidator(this.attribute, this.config);
    }
  }

  // #region AttributeEditor implementation

  initComponent() {
    if (this.attribute.required) {
      this.config.required = true;
      this.config.requiredFromSchema = true;
    }

    this.localConfig = new TextEditorConfig();
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

    const dialogRef = this.dialog.open(EditorTextConfigComponent, {
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
          this.validationFn = createTextEditorValidator(this.attribute, this.localConfig);
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
