import { IPublic18nOptions } from './i18n';
import { IPublicRouterOptions } from './router';
import { IPublicThemeOptins } from './theme';

export interface IPublicTypeEngineOptions {
  /**
   * 国际化配置
   * @default
   */
  i18n: IPublic18nOptions;
  /**
   * 路由配置
   * @default
   */
  router: IPublicRouterOptions;
  /**
   * 主题配置
   * @default
   */
  theme?: IPublicThemeOptins;
  /**
   * 引擎版本
   * @default
   */
  version?: string;
}

export type IPluginTypeConfig = keyof IPublicTypeEngineOptions;
