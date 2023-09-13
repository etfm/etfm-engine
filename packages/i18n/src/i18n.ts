import { I18n, createI18n } from 'vue-i18n';
import { setHtmlPageLang } from './helper';
import { unref } from 'vue';
import { IGlobalI18n, IPublic18nOptions, IPublicLocaleAssets } from '@etfm/types';
import { EventBus, createModuleEventBus, engineConfig } from '@etfm/editor';
import { merge } from 'lodash-es';

const loadLocalePool: string[] = [];

export const LOCALE = {
  ZH_CN: 'zh_CN',
  EN_US: 'en',
};

export const I18N_EVENTS = {
  LOCALE_ASSETS: 'i18n:assets',
};

export const INTL_OPTIONS = {
  locale: LOCALE.ZH_CN,
  fallbackLocale: LOCALE.ZH_CN,
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US],
  legacy: false,
  sync: true,
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true,
};

export class GlobalI18n implements IGlobalI18n {
  private _opts: IPublic18nOptions;
  private _i18n: I18n;
  private eventBus: EventBus;

  get locale() {
    return this._i18n.global.locale;
  }

  get i18n() {
    return this._i18n;
  }

  constructor() {
    this.eventBus = createModuleEventBus('i18n');
    this._opts = INTL_OPTIONS;

    this.onAssets((args: IPublicLocaleAssets) => {
      const locale = this._opts.locale;

      this.setLanguageMessage(locale, args.messages);
    });
  }

  init() {
    const args = engineConfig.get('i18n');
    this._opts = merge(this._opts, args);

    this.setLoadLocalePool(this._opts.locale);

    this._i18n = createI18n({
      ...this._opts,
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

    this.setI18nLanguage(locale);

    // 同步全部配置
    const args = engineConfig.get('i18n');
    engineConfig.set('i18n', merge(args, { locale }));

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
