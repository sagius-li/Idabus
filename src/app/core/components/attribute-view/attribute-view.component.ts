import { Component, OnInit, Input, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { Resource, AttributeResource, BroadcastEvent } from '../../models/dataContract.model';
import { createTextEditorValidator } from '../../models/validator.model';
import { TransService } from '../../models/translation.model';
import { EditorConfig, DynamicEditor } from '../../models/dynamicEditor.interface';

import { ResourceService } from '../../services/resource.service';
import { SwapService } from '../../services/swap.service';
import { UtilsService } from '../../services/utils.service';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-attribute-view',
  templateUrl: './attribute-view.component.html',
  styleUrls: ['./attribute-view.component.scss']
})
export class AttributeViewComponent implements OnInit {
  @Input()
  attributeDefs: Array<any>;

  @Input()
  configMode = false;

  currentResource: Resource;
  obsCurrentResource: Observable<Resource>;

  resourceForm: FormGroup = new FormGroup({
    controls: new FormArray([])
  });
  get controls() {
    return this.resourceForm.get('controls') as FormArray;
  }

  attributeArray: Array<{
    type: string;
    config: EditorConfig;
    attribute: AttributeResource;
    controller: FormControl;
  }> = [];
  attributesToLoad = [];

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private prepareAttributes() {
    this.clearFormArray(this.controls);
    this.attributeArray.splice(0, this.attributeArray.length);

    this.attributeDefs.forEach(a => {
      const controller = new FormControl(
        this.currentResource[a.attributeName].value,
        createTextEditorValidator(this.currentResource[a.attributeName], a.editorConfig)
      );
      this.attributeArray.push({
        type: a.editorType,
        config: a.editorConfig,
        attribute: this.currentResource[a.attributeName],
        controller
      });
      this.controls.push(controller);
    });

    this.registerChangeHandler();
  }

  private registerChangeHandler() {
    // this.getControl('txtDisplayName').valueChanges.subscribe(val => alert(val));
  }

  constructor(
    private route: ActivatedRoute,
    private resource: ResourceService,
    private translate: TransService,
    private spinner: NgxUiLoaderService,
    private swap: SwapService,
    private utils: UtilsService,
    private dragula: DragulaService
  ) {
    try {
      this.dragula.createGroup('ATTRIBUTECOLUMN', {
        moves: (el, container, handle) => {
          return (
            handle.classList.contains('handle') ||
            (handle.parentNode as Element).classList.contains('handle')
          );
        }
      });
    } catch {}
  }

  ngOnInit() {
    const attributes = this.attributeDefs.map(a => a.attributeName);
    this.attributesToLoad.forEach(a => {
      if (attributes.indexOf(a) < 0) {
        attributes.push(a);
      }
    });
    this.attributesToLoad = attributes;

    this.swap.editorValueChanged.subscribe((controlName: string) => {
      const configs = this.attributeArray.map(a => a.config);
      const expressionDic = this.utils.GetEditorExpressions(controlName, configs);
      if (Object.keys(expressionDic).length > 0) {
        const regEx: RegExp = /\[#\w+\]/g;
        Object.keys(expressionDic).forEach(dicKey => {
          expressionDic[dicKey].forEach(expression => {
            let match = regEx.exec(expression);
            let expressionValue = expression;
            while (match) {
              const replaceName = match[0].substr(2, match[0].length - 3);
              expressionValue = expressionValue.replace(match[0], this.getValue(replaceName));
              match = regEx.exec(expression);
            }
            if (expressionValue.startsWith('<') && expressionValue.endsWith('>')) {
              // tslint:disable-next-line:no-eval
              this.setValue(dicKey, eval(expressionValue.substring(1, expressionValue.length - 1)));
            } else {
              this.setValue(dicKey, expressionValue);
            }
          });
        });
      }
    });

    this.swap.broadcasted.subscribe((event: BroadcastEvent) => {
      switch (event.name) {
        case 'refresh-language':
          this.spinner.startLoader('spinner_home');
          this.obsCurrentResource.subscribe((result: Resource) => {
            this.currentResource = result;
            this.prepareAttributes();
            this.spinner.stopLoader('spinner_home');
          });
          break;
        default:
          break;
      }
    });

    this.obsCurrentResource = this.route.params.pipe(
      tap(() => {
        this.spinner.startLoader('spinner_home');
      }),
      switchMap(() => {
        const objectID = this.route.snapshot.paramMap.get('id');
        return this.resource.getResourceByID(
          objectID,
          this.attributesToLoad,
          'full',
          this.translate.currentCulture,
          true
        );
      })
    );

    this.obsCurrentResource.subscribe((result: Resource) => {
      this.currentResource = result;
      this.prepareAttributes();

      this.spinner.stopLoader('spinner_home');
    });
  }

  onConfig(editor: DynamicEditor) {
    editor.configure().subscribe();
  }

  getValue(controlName: string) {
    const attribute = this.attributeArray.find(a => a.config.name === controlName);
    return attribute ? attribute.controller.value : undefined;
  }

  getControl(controlName: string): FormControl {
    const attribute = this.attributeArray.find(a => a.config.name === controlName);
    return attribute ? attribute.controller : undefined;
  }

  setValue(controlName: string, value: any) {
    const attribute = this.attributeArray.find(a => a.config.name === controlName);
    if (!attribute) {
      return;
    }
    attribute.controller.setValue(value);
    attribute.controller.markAsTouched();
    attribute.controller.markAsDirty();
  }

  getControllerIndex(controlName: string) {
    return this.attributeArray.findIndex(a => a.config.name === controlName);
  }

  onSubmit() {
    // const control = this.controls.controls[3] as FormControl;
    // control.setValue('test?');
    // control.markAsTouched();
    // control.markAsDirty();

    // console.log(this.getValue('txtFirstName'));
    // this.setValue('txtAccountName', 'test?');

    console.log(this.attributeArray);
    console.log(this.resourceForm);
  }
}
