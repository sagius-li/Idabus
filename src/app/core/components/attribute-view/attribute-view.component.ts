import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  IterableDiffers,
  DoCheck,
  ViewChildren,
  QueryList,
  OnChanges
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormControl, ValidatorFn } from '@angular/forms';

import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DragulaService } from 'ng2-dragula';

import { Resource, BroadcastEvent } from '../../models/dataContract.model';
import { TransService } from '../../models/translation.model';
import { EditorResult, AttributeEditor } from '../../models/dynamicEditor.interface';

import { createTextEditorValidator } from '../../validators/text.validator';
import { createBooleanEditorValidator } from '../../validators/boolean.validator';
import { createSelectEditorValidator } from '../../validators/select.validator';

import { ResourceService } from '../../services/resource.service';
import { SwapService } from '../../services/swap.service';
import { UtilsService } from '../../services/utils.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-attribute-view',
  templateUrl: './attribute-view.component.html',
  styleUrls: ['./attribute-view.component.scss']
})
export class AttributeViewComponent implements OnInit, OnChanges, DoCheck {
  @ViewChildren('editor') editors: QueryList<AttributeEditor>;

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

  hiddenAttributes: Array<string> = [];

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
      let validatorFn: ValidatorFn;
      switch (a.editorType) {
        case 'text':
          validatorFn = createTextEditorValidator(a.editorConfig);
          break;
        case 'boolean':
          validatorFn = createBooleanEditorValidator(a.editorConfig);
          break;
        case 'select':
          validatorFn = createSelectEditorValidator(a.editorConfig);
          break;
        default:
          break;
      }
      const controller = new FormControl(attribute, validatorFn);
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

  private maintainHiddenAttributes(option: { attributeName: string; optionValue: boolean }) {
    if (option) {
      const index = this.hiddenAttributes.indexOf(option.attributeName);
      if (option.optionValue) {
        if (index >= 0) {
          this.hiddenAttributes.splice(index, 1);
        }
      } else {
        if (index < 0) {
          this.hiddenAttributes.push(option.attributeName);
        }
      }
    }
  }

  private applyDisplay(valueExpressionDic: { [key: string]: string[] }) {
    if (Object.keys(valueExpressionDic).length > 0) {
      const regEx: RegExp = /\[#\w+\]/g;
      Object.keys(valueExpressionDic).forEach(dicKey => {
        valueExpressionDic[dicKey].forEach(expression => {
          let match = regEx.exec(expression);
          let expressionValue = expression;
          while (match) {
            const replaceName = match[0].substr(2, match[0].length - 3);
            expressionValue = expressionValue.replace(match[0], this.getValue(replaceName));
            match = regEx.exec(expression);
          }
          if (expressionValue.startsWith('<') && expressionValue.endsWith('>')) {
            try {
              // tslint:disable-next-line:no-eval
              const optionValue: boolean = eval(
                expressionValue.substring(1, expressionValue.length - 1)
              );

              const editor = this.getEditor(dicKey);
              if (editor) {
                editor.setDisplay(editor.config.accessUsedFor, optionValue);
                if (editor.config.accessUsedFor === 'visibility') {
                  this.maintainHiddenAttributes({ attributeName: dicKey, optionValue });
                }
              } else {
                this.maintainHiddenAttributes({ attributeName: dicKey, optionValue });
              }
            } catch {}
          } else {
            // only expression within '<' and '>' is allowed
          }
        });
      });
    }
  }

  private applyValue(valueExpressionDic: { [key: string]: string[] }) {
    if (Object.keys(valueExpressionDic).length > 0) {
      const regEx: RegExp = /\[#\w+\]/g;
      Object.keys(valueExpressionDic).forEach(dicKey => {
        valueExpressionDic[dicKey].forEach(expression => {
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
  }

  private applyConfig(configExpressionDic: { [key: string]: string[] }) {
    if (Object.keys(configExpressionDic).length > 0) {
      const regEx: RegExp = /\[#\w+\]/g;
      Object.keys(configExpressionDic).forEach(dicKey => {
        configExpressionDic[dicKey].forEach(expression => {
          let match = regEx.exec(expression);
          let expressionValue = expression;
          while (match) {
            const replaceName = match[0].substr(2, match[0].length - 3);
            expressionValue = expressionValue.replace(match[0], this.getValue(replaceName));
            match = regEx.exec(expression);
          }
          const editor = this.getEditor(dicKey);
          if (editor) {
            if (expressionValue.startsWith('<') && expressionValue.endsWith('>')) {
              // tslint:disable-next-line:no-eval
              editor.setDataSource(eval(expressionValue.substring(1, expressionValue.length - 1)));
            } else {
              editor.setDataSource(expressionValue);
            }
          }
        });
      });
    }
  }

  private registerChangeHandler() {
    // const control = this.getControl('DisplayName');
    // if (control) {
    //   control.valueChanges.subscribe(val => {
    //     const editor = this.getEditor('MiddleName');
    //     if (editor) {
    //       editor.value = 'TEST';
    //     }
    //   });
    // }
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

    this.swap.editorDisplayChanged.subscribe(
      (option: { attributeName: string; usedFor: string; optionValue: boolean }) => {
        if (option && option.attributeName) {
          if (option.optionValue === undefined) {
            const configs = this.attributeArray.map(a => a.config);
            const displayExpressionDic = this.utils.GetEditorExpressions(
              option.attributeName,
              configs,
              'accessExpression'
            );
            this.applyDisplay(displayExpressionDic);
          } else {
            if (option.usedFor === 'visibility') {
              this.maintainHiddenAttributes(option);
            }
            const editor = this.getEditor(option.attributeName);
            if (editor) {
              editor.setDisplay(editor.config.accessUsedFor, option.optionValue);
            }
          }
        }
      }
    );

    this.swap.editorValueChanged.subscribe((attributeName: string) => {
      const configs = this.attributeArray.map(a => a.config);

      const valueExpressionDic = this.utils.GetEditorExpressions(
        attributeName,
        configs,
        'expression'
      );
      this.applyValue(valueExpressionDic);

      const configExpressionDic = this.utils.GetEditorExpressions(attributeName, configs, 'query');
      this.applyConfig(configExpressionDic);

      const displayExpressionDic = this.utils.GetEditorExpressions(
        attributeName,
        configs,
        'accessExpression'
      );
      this.applyDisplay(displayExpressionDic);
    });

    this.swap.editorConfigChanged.subscribe((attributeName: string) => {
      const configs = this.attributeArray.map(a => a.config);

      const configExpressionDic = this.utils.GetEditorExpressions(attributeName, configs, 'query');
      this.applyConfig(configExpressionDic);
    });

    this.obsCurrentResource = this.route.params.pipe(
      tap(() => {
        this.spinner.startLoader('spinner_home');
      }),
      switchMap(() => {
        this.attributeArray.splice(0, this.attributeArray.length);

        const attributes = this.attributeDefs.map(a => a.attributeName);
        this.attributesToLoad.forEach(a => {
          if (attributes.indexOf(a) < 0) {
            attributes.push(a);
          }
        });
        this.attributesToLoad = attributes;

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

  ngOnChanges(changes: any) {
    if (changes.configMode && this.configMode === true) {
      this.refresh();
    }
  }

  ngDoCheck() {
    const changeAttribute = this.differ.diff(this.attributeDefs);

    if (changeAttribute) {
      this.refresh();
    }
  }

  onConfig(attributeName: string) {
    const editor = this.getEditor(attributeName);

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

  getEditor(attributeName: string): AttributeEditor {
    if (this.editors) {
      return this.editors.find(e => e.attribute && e.attribute.systemName === attributeName);
    }
    return null;
  }

  getControl(attributeName: string): FormControl {
    const attribute = this.attributeArray.find(a => a.config.attributeName === attributeName);
    return attribute ? attribute.controller : undefined;
  }

  getControllerIndex(attributeName: string) {
    return this.attributeArray.findIndex(a => a.attribute.systemName === attributeName);
  }

  getValue(attributeName: string) {
    // const attribute = this.attributeArray.find(a => a.config.attributeName === attributeName);
    // return attribute && attribute.controller.value ? attribute.controller.value.value : undefined;

    const editor = this.getEditor(attributeName);
    return editor ? editor.value : undefined;
  }

  setValue(attributeName: string, value: any) {
    // const attribute = this.attributeArray.find(a => a.config.attributeName === attributeName);
    // if (attribute && attribute.controller.value) {
    //   const attributeValue = attribute.controller.value;
    //   attributeValue.value = value;

    //   attribute.controller.setValue(attributeValue);
    //   attribute.controller.markAsTouched();
    //   attribute.controller.markAsDirty();
    // }

    const editor = this.getEditor(attributeName);
    if (editor) {
      editor.value = value;
    }
  }

  showAttributeEditor(attributeName: string) {
    if (this.configMode) {
      return true;
    }
    return this.hiddenAttributes.indexOf(attributeName) >= 0 ? false : true;
  }
}
