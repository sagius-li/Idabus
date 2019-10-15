import { FormControl } from '@angular/forms';

import { BooleanEditorConfig } from '../models/editorContract.model';
import { AttributeResource } from '../models/dataContract.model';

export function createBooleanEditorValidator(
  attribute: AttributeResource,
  config: BooleanEditorConfig
) {
  return (c: FormControl) => {
    if (config && config.required && (c.value === undefined || c.value === null)) {
      return { message: 'key_valueRequired' };
    }

    return null;
  };
}
