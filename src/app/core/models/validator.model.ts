import { FormControl } from '@angular/forms';
import { TextEditorConfig } from './editorContract.model';
import { AttributeResource } from './dataContract.model';

export function createTextEditorValidator(attribute: AttributeResource, config: TextEditorConfig) {
  return (c: FormControl) => {
    if (attribute && attribute.required) {
      return { message: 'key_valueRequired' };
    }

    if (config && config.required && !c.value) {
      return { message: 'key_valueRequired' };
    }

    const value = c.value ? c.value : '';

    if (attribute && attribute.stringRegex) {
      const regEx = new RegExp(attribute.stringRegex);
      if (!regEx.test(value)) {
        return { message: 'key_restrictionViolation' };
      }
    }

    if (config && config.validation) {
      const regEx = new RegExp(config.validation);
      if (!regEx.test(value)) {
        return { message: 'key_restrictionViolation' };
      }
    }

    return null;
  };
}
