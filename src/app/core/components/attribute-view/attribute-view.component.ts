import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  IterableDiffers,
  DoCheck,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DragulaService } from 'ng2-dragula';

import { Resource, BroadcastEvent } from '../../models/dataContract.model';
import { TransService } from '../../models/translation.model';
import { DynamicEditor, EditorResult } from '../../models/dynamicEditor.interface';

import { createTextEditorValidator } from '../../validators/text.validator';

import { ResourceService } from '../../services/resource.service';
import { SwapService } from '../../services/swap.service';
import { UtilsService } from '../../services/utils.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-attribute-view',
  templateUrl: './attribute-view.component.html',
  styleUrls: ['./attribute-view.component.scss']
})
export class AttributeViewComponent implements OnInit, DoCheck {
  @ViewChildren('editor') editors: QueryList<DynamicEditor>;

  @Input()
  attributeDefs: Array<any>;

  @Input()
  configMode = false;

  @Input()
  columnNumber = 1;

  @Input()
  tabName: string;

  attArray: Array<EditorResult> = [];
  @Input()
  get attributeArray() {
    return this.attArray;
  }
  set attributeArray(value) {
    this.attArray = value;
    this.attributeArrayChange.emit(this.attArray);
  }
  @Output()
  attributeArrayChange = new EventEmitter();

  currentResource: Resource;
  obsCurrentResource: Observable<Resource>;

  resourceForm: FormGroup = new FormGroup({
    controls: new FormArray([])
  });
  get controls() {
    return this.resourceForm.get('controls') as FormArray;
  }

  attributesToLoad = [];

  differ: any;

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  private prepareAttributes() {
    this.clearFormArray(this.controls);
    this.attributeArray.splice(0, this.attributeArray.length);

    this.attributeDefs.forEach(a => {
      const attribute = this.utils.ExtraValue(this.currentResource, a.attributeName);
      const controller = new FormControl(
        attribute.value,
        createTextEditorValidator(attribute, a.editorConfig)
      );
      this.attributeArray.push({
        type: a.editorType,
        config: a.editorConfig,
        attribute,
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
    private dragula: DragulaService,
    private differs: IterableDiffers,
    private config: ConfigService
  ) {
    this.differ = this.differs.find([]).create(null);

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
    this.swap.broadcasted.subscribe((event: BroadcastEvent) => {
      switch (event.name) {
        case 'refresh-attribute':
          if (event.parameter === this.tabName) {
            this.refresh();
          }
          break;
        case 'refresh-language':
          this.refresh();
          break;
        default:
          break;
      }
    });

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

    this.attributeArray.splice(0, this.attributeArray.length);

    const attributes = this.attributeDefs.map(a => a.attributeName);
    this.attributesToLoad.forEach(a => {
      if (attributes.indexOf(a) < 0) {
        attributes.push(a);
      }
    });
    this.attributesToLoad = attributes;

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
          this.config.getCulture(this.translate.currentCulture),
          'true'
        );
      })
    );

    this.obsCurrentResource.subscribe((result: Resource) => {
      this.currentResource = result;
      this.prepareAttributes();

      this.spinner.stopLoader('spinner_home');
    });
  }

  ngDoCheck() {
    const changeAttribute = this.differ.diff(this.attributeDefs);

    if (changeAttribute) {
      this.refresh();
    }
  }

  onConfig(attributeName: string) {
    const editor = this.editors.find(e => e.attribute && e.attribute.systemName === attributeName);
    if (editor) {
      editor.configure().subscribe();
    }
  }

  onDelete(attribute: EditorResult) {
    let pos = this.attributeArray.findIndex(
      a => a.attribute.systemName === attribute.attribute.systemName
    );
    if (pos >= 0) {
      this.attributeArray.splice(pos, 1);
    }

    pos = this.attributeDefs.findIndex(d => d.attributeName === attribute.attribute.systemName);
    if (pos >= 0) {
      this.attributeDefs.splice(pos, 1);
    }
  }

  refresh() {
    try {
      (this.route.params as BehaviorSubject<any>).next({
        id: this.currentResource.ObjectID.value
      });
    } catch {}
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

  getControllerIndex(attributeName: string) {
    return this.attributeArray.findIndex(a => a.attribute.systemName === attributeName);
  }
}
