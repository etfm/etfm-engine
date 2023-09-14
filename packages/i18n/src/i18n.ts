import { I18n, createI18n } from 'vue-i18n';
import { setHtmlPageLang } from './helper';
import { unref } from 'vue';
import { IEventBus, IGlobalI18n, IPublic18nOptions, IPublicLocaleAssets } from '@etfm/types';
import { createModuleEventBus, engineConfig } from '@etfm/editor';
import { merge } from 'lodash-es';
import { Logger } from '@etfm/shared';
import { I18N_EVENTS, INTL_OPTIONS } from './constants';

const loadLocalePool: string[] = [];

const logger = new Logger({ bizName: 'i18n' });

export class GlobalI18n implements IGlobalI18n {
  private _opts: IPublic18nOptions;
  private _i18n: I18n;
  private eventBus: IEventBus;

  get locale() {
    return this._i18n.global.locale;
  }

  get i18n() {
    return this._i18n;
  }

  constructor() {
    this.eventBus = createModuleEventBus('i18n');
    this._opts = INTL_OPTIONS;

    engineConfig.onceGot('i18n').then((args) => {
      this._opts = merge(this._opts, args);

      this.setLoadLocalePool(this._opts.locale);

      this._i18n = createI18n({
        ...this._opts,
      });
    });

    this.onAssets((args: IPublicLocaleAssets) => {
      const locale = args.locale;

      this.setLanguageMessage(locale, args.messages);
    });
  }

  setAssets(args: IPublicLocaleAssets) {
    this.eventBus.emit(I18N_EVENTS.LOCALE_ASSETS, args);
  }

  onAssets(listener: (args: IPublicLocaleAssets) => void) {
    this.eventBus.on(I18N_EVENTS.LOCALE_ASSETS, listener);

    return () => this.eventBus.off(I18N_EVENTS.LOCALE_ASSETS, listener);
  }

  changeLocale(locale: string) {
    const globalI18n = this._i18n.global;
    const currentLocale = unref(globalI18n.locale);
    if (currentLocale === locale) {
      return locale;
    }

    if (!loadLocalePool.includes(locale)) {
      logger.error('failed to load message from locale ' + locale);
      return locale;
    }

    this.setI18nLanguage(locale);

    return locale;
  }

  setI18nLanguage(locale: string) {
    if (this._i18n.mode === 'legacy') {
      this._i18n.global.locale = locale;
    } else {
      (this._i18n.global.locale as any).value = locale;
    }

    setHtmlPageLang(locale);
  }

  setLanguageMessage(locale: string, message: any) {
    this._i18n.global.setLocaleMessage(locale, message);
    this.setLoadLocalePool(locale);
  }

  setLoadLocalePool(locale: string) {
    if (!loadLocalePool.includes(locale)) {
      loadLocalePool.push(locale);
    }
  }
}

export const globalI18n = new GlobalI18n();
