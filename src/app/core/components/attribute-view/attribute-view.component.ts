import { Component, OnInit, Input } from '@angular/core';
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

  // attributeArray: Array<AttributeResource> = [];
  attributeArray: Array<{ type: string; config: EditorConfig; attribute: AttributeResource }> = [];
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
      this.attributeArray.push({
        type: a.editorType,
        config: a.editorConfig,
        attribute: this.currentResource[a.attributeName]
      });
      this.controls.push(
        new FormControl(
          this.currentResource[a.attributeName].value,
          createTextEditorValidator(this.currentResource[a.attributeName], a.editorConfig)
        )
      );
    });
  }

  constructor(
    private route: ActivatedRoute,
    private resource: ResourceService,
    private translate: TransService,
    private spinner: NgxUiLoaderService,
    private swap: SwapService
  ) {}

  ngOnInit() {
    const attributes = this.attributeDefs.map(a => a.attributeName);
    this.attributesToLoad.forEach(a => {
      if (attributes.indexOf(a) < 0) {
        attributes.push(a);
      }
    });
    this.attributesToLoad = attributes;

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
    const pos = this.attributeArray.findIndex(a => a.config.name === controlName);
    return pos < 0 ? undefined : this.controls.controls[pos].value;
  }

  setValue(controlName: string, value: any) {
    const pos = this.attributeArray.findIndex(a => a.config.name === controlName);
    if (pos < 0) {
      return;
    }
    const control = this.controls.controls[pos] as FormControl;
    control.setValue(value);
    control.markAsTouched();
    control.markAsDirty();
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
