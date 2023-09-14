import { IPublicApiRouter } from '../api';
import { IPublicApiI18n } from '../api';
import {
  IPublicApiLogger,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicApiEvent,
  IPublicApiGlobal,
  IPublicApiTheme,
  IPublicApiConfig,
  IPublicApiPersistent,
} from '../api';
import { IPluginPreferenceMananger } from './plugin-manager';
import { IPublicTypePluginMeta } from './plugin-meta';

export interface IPublicModelPluginContext {
  /**
   * 可通过该对象读取插件初始化配置
   * by using this, init options can be accessed from inside plugin
   */
  preference: IPluginPreferenceMananger;

  get skeleton(): IPublicApiSkeleton;

  get config(): IPublicApiConfig;

  get event(): IPublicApiEvent;

  get plugins(): IPublicApiPlugins;

  get logger(): IPublicApiLogger;

  get pluginEvent(): IPublicApiEvent;

  get global(): IPublicApiGlobal;

  get theme(): IPublicApiTheme;

  get router(): IPublicApiRouter;

  get i18n(): IPublicApiI18n;

  get persistent(): IPublicApiPersistent;
}

export interface IPluginContextPrivate {
  set skeleton(skeleton: IPublicApiSkeleton);
  set event(event: IPublicApiEvent);
  set config(config: IPublicApiConfig);
  set global(global: IPublicApiGlobal);
  set theme(theme: IPublicApiTheme);
  set router(router: IPublicApiRouter);
  set i18n(i18n: IPublicApiI18n);
  set plugins(plugins: IPublicApiPlugins);
  set logger(logger: IPublicApiLogger);
  set persistent(persistent: IPublicApiPersistent);
}

export interface IPluginContextApiAssembler {
  assembleApis(
    context: IPluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ): void;
}

export type IPublicPluginContext = IPluginContextPrivate & IPublicModelPluginContext;
