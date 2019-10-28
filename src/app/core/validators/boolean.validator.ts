import { FormControl } from '@angular/forms';

import { BooleanEditorConfig } from '../models/editorContract.model';

export function createBooleanEditorValidator(config: BooleanEditorConfig) {
  return (c: FormControl) => {
    if (config && config.required && (c.value === undefined || c.value === null)) {
      return { message: 'key_valueRequired' };
    }

    return null;
  };
}
