import { I18n, I18nOptions } from 'vue-i18n';

export interface IGlobalI18n {
  i18n: I18n;
  init(): void;
  changeLocale(locale: string): string;
  setI18nLanguage(locale: string): void;
  setLanguageMessage(locale: string, message: any): void;
  setLoadLocalePool(locale: string): void;
}

export type IPublic18nOptions = I18nOptions & {
  locale: string;
};

export interface IPublicLocaleAssets {
  locale: string;
  messages: any;
}
