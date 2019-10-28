import { FormControl } from '@angular/forms';

import { SelectEditorConfig } from '../models/editorContract.model';

export function createSelectEditorValidator(config: SelectEditorConfig) {
  return (c: FormControl) => {
    if (config && config.required && !c.value) {
      return { message: 'key_valueRequired' };
    }

    return null;
  };
}
