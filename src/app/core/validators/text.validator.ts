import { FormControl } from '@angular/forms';

import { TextEditorConfig } from '../models/editorContract.model';
import { AttributeResource } from '../models/dataContract.model';

export function createTextEditorValidator(config: TextEditorConfig) {
  return (c: FormControl) => {
    if (config && config.required && (!c.value || !c.value.value)) {
      return { message: 'key_valueRequired' };
    }

    const value = c.value && c.value.value ? c.value.value : '';

    if (config && config.validation) {
      const regEx = new RegExp(config.validation);
      if (!regEx.test(value)) {
        return { message: 'key_restrictionViolation' };
      }
    }

    return null;
  };
}
