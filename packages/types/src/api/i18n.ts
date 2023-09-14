import { I18n } from 'vue-i18n';
import { IPublicLocaleAssets } from '../i18n';
import { IPublicTypeDisposable } from '../disposable';

export interface IPublicApiI18n {
  get i18n(): I18n;

  /**
   * 切换语言
   * @param locale
   */
  changeLocale(locale: string): string;

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
