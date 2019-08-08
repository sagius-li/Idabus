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
    // return the last available value if key was not found any more
    const key = keys[index].trim();
    // if (!value.hasOwnProperty(key) && !value.hasOwnProperty(key.toLowerCase())) {
    //   return value;
    // } else {
    //   return this.extraProperty(value[key], keys, index + 1);
    // }

    if (value.hasOwnProperty(key)) {
      return this.extraProperty(value[key], keys, index + 1);
    }
    if (value.hasOwnProperty(key.toLowerCase())) {
      return this.extraProperty(value[key.toLowerCase()], keys, index + 1);
    }

    return value;
  }

  transform(value: any, propertyName: string): any {
    const names = propertyName.split(':');
    return this.extraProperty(value, names, 0);
  }
}
