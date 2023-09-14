import { I18n, I18nOptions } from 'vue-i18n';
import { IPublicTypeDisposable } from './disposable';

export interface IGlobalI18n {
  i18n: I18n;
  changeLocale(locale: string): string;
  setI18nLanguage(locale: string): void;
  setLanguageMessage(locale: string, message: any): void;
  setLoadLocalePool(locale: string): void;
  /**
   * 设置多语言资源
   * @param args
   */
  setAssets(args: IPublicLocaleAssets): void;

  /**
   * 监听多语言资源的变化
   * @param listener
   */
  onAssets(listener: (args: IPublicLocaleAssets) => void): IPublicTypeDisposable;
}

export type IPublic18nOptions = I18nOptions & {
  locale: string;
};

export interface IPublicLocaleAssets {
  locale: string;
  messages: any;
}
