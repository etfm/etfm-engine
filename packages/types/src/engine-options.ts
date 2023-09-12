import { IPublicThemeOptins } from './theme';

export interface IPublicTypeEngineOptions {
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
