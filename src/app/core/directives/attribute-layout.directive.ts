import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appAttributeLayout]'
})
export class AttributeLayoutDirective {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {}

  show() {
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  hide() {
    this.viewContainer.clear();
  }
}
