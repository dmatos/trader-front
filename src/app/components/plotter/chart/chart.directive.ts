import {Directive, ViewContainerRef} from "@angular/core";

@Directive({
  selector: '[customChart]'
})
export class ChartDirective{
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}
