import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'examValue'
})
export class ExamValuePipe implements PipeTransform {
  private examProperty(value: any, keys: string[], index: number) {
    // return false by error
    if (!value || !keys || keys.length === 0) {
      return false;
    }
    // return true if finished
    if (index === keys.length) {
      return true;
    }
    // return the last available value if key was found any more
    const key = keys[index].trim();
    // if (!value.hasOwnProperty(key) && !value.hasOwnProperty(key.toLowerCase())) {
    //   return false;
    // } else {
    //   return this.examProperty(value[key], keys, index + 1);
    // }

    if (value.hasOwnProperty(key)) {
      return this.examProperty(value[key], keys, index + 1);
    }
    if (value.hasOwnProperty(key.toLowerCase())) {
      return this.examProperty(value[key.toLowerCase()], keys, index + 1);
    }

    return false;
  }

  transform(value: any, propertyName: string): any {
    const names = propertyName.split(':');
    return this.examProperty(value, names, 0);
  }
}
