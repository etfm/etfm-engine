import {
  IGlobalI18n,
  IPublicApiI18n,
  IPublicLocaleAssets,
  IPublicTypeDisposable,
} from '@etfm/types';
import { i18nSymbol } from './symbols';
import { I18n as VueI18n } from 'vue-i18n';

export class I18n implements IPublicApiI18n {
  private readonly [i18nSymbol]: IGlobalI18n;

  constructor(i18n: IGlobalI18n) {
    this[i18nSymbol] = i18n;
  }

  get i18n(): VueI18n<{}, {}, {}, string, boolean> {
    return this[i18nSymbol].i18n;
  }

  changeLocale(locale: string): string {
    return this[i18nSymbol].changeLocale(locale);
  }

  setAssets(args: IPublicLocaleAssets) {
    this[i18nSymbol].setAssets(args);
  }

  onAssets(listener: (args: IPublicLocaleAssets) => void): IPublicTypeDisposable {
    return this.onAssets(listener);
  }
}
