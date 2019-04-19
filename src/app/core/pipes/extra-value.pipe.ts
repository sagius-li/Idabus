import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extraValue'
})
export class ExtraValuePipe implements PipeTransform {
  private extraProperty(value: any, keys: string[], index: number) {
    if (!value || !keys || keys.length === 0) {
      return null;
    }
    if (index === keys.length) {
      return value;
    }
    if (!value.hasOwnProperty(keys[index].trim())) {
      return null;
    } else {
      return this.extraProperty(value[keys[index].trim()], keys, index + 1);
    }
  }

  transform(value: any, propertyName: string): any {
    const names = propertyName.split(':');
    return this.extraProperty(value, names, 0);
  }
}
