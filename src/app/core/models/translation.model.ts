import { TranslateService } from '@ngx-translate/core';

export class Language {
  public label: string;
  public code: string[];
  public route: string;
}

export class TransService extends TranslateService {
  get currentCulture() {
    let retVal = 'en-US';

    switch (this.currentLang.toLowerCase()) {
      case 'en':
        retVal = 'en-US';
        break;
      case 'de':
        retVal = 'de';
        break;
      case 'cn':
        retVal = 'zh-Hans';
        break;
      default:
        break;
    }

    return retVal;
  }
  public supportedLanguages: Language[];
}
