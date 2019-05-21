import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extraValue'
})
export class ExtraValuePipe implements PipeTransform {
  private extraProperty(value: any, keys: string[], index: number) {
    // return null by error
    if (!value || !keys || keys.length === 0) {
      return null;
    }
    // return the current value if finished
    if (index === keys.length) {
      return value;
    }
    // return the last available value if key was found any more
    if (!value.hasOwnProperty(keys[index].trim())) {
      return value;
    } else {
      return this.extraProperty(value[keys[index].trim()], keys, index + 1);
    }
  }

  transform(value: any, propertyName: string): any {
    const names = propertyName.split(':');
    return this.extraProperty(value, names, 0);
  }
}
