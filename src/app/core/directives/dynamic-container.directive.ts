import { Directive, ViewContainerRef, Input } from '@angular/core';

@Directive({
  selector: '[appDynamicContainer]'
})
export class DynamicContainerDirective {
  @Input('appDynamicContainer')
  containerName: string;

  constructor(public viewContainerRef: ViewContainerRef) {}
}
