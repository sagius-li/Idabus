import { FormControl } from '@angular/forms';
import { TextEditorConfig } from './editorContract.model';
import { AttributeResource } from './dataContract.model';

export function createTextEditorValidator(attribute: AttributeResource, config: TextEditorConfig) {
  return (c: FormControl) => {
    if (config && config.required && !c.value) {
      return { requiredError: { message: 'value required' } };
    }

    const value = c.value ? c.value : '';

    if (attribute && attribute.stringRegex) {
      const regEx = new RegExp(attribute.stringRegex);
      if (!regEx.test(value)) {
        return { schemaError: { message: 'schema mismatch' } };
      }
    }

    if (config && config.validation) {
      const regEx = new RegExp(config.validation);
      if (!regEx.test(value)) {
        return { patternError: { message: 'pattern mismatch' } };
      }
    }

    return null;
  };
}
