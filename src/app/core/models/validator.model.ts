import { FormControl } from '@angular/forms';

export function validateEditorText(c: FormControl) {
  const err = {
    rangeError: {
      given: c.value,
      max: 10,
      min: 0
    }
  };

  if (!c.value) {
    return null;
  }

  return c.value.length > 10 || c.value < 2 ? err : null;
}
