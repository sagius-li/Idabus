import { TranslateService } from '@ngx-translate/core';

export class Language {
  public label: string;
  public code: string[];
  public route: string;
}

export class TransService extends TranslateService {
  public supportedLanguages: Language[];
}
