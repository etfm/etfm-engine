import { createModuleEventBus } from '@etfm/editor';
import { Logger } from '@etfm/shared';
import type {
  IPluginContextApiAssembler,
  IPluginContextOptions,
  IPluginPreferenceMananger,
  IPublicApiConfig,
  IPublicApiEvent,
  IPublicApiGlobal,
  IPublicApiPersistent,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicApiTheme,
  IPublicModelPluginContext,
  IPublicTypePreferenceValueType,
} from '@etfm/types';

export default class PluginContext implements IPublicModelPluginContext {
  skeleton: IPublicApiSkeleton;
  event: IPublicApiEvent;
  config: IPublicApiConfig;
  global: IPublicApiGlobal;
  theme: IPublicApiTheme;
  logger: Logger;
  plugins: IPublicApiPlugins;
  preference: IPluginPreferenceMananger;
  pluginEvent: IPublicApiEvent;
  persistent: IPublicApiPersistent;

  constructor(options: IPluginContextOptions, contextApiAssembler: IPluginContextApiAssembler) {
    const { pluginName = 'anonymous', meta = {} } = options;
    contextApiAssembler.assembleApis(this, pluginName, meta);
    this.pluginEvent = createModuleEventBus(pluginName);
  }

  setPreference(pluginName: string): void {
    const getPreferenceValue = (
      key: string,
      defaultValue?: IPublicTypePreferenceValueType,
    ): IPublicTypePreferenceValueType | undefined => {
      const pluginPreference = this.plugins.getPluginPreference(pluginName) || {};
      if (pluginPreference[key] === undefined || pluginPreference[key] === null) {
        return defaultValue;
      }
      return pluginPreference[key];
    };

    const getPreference = (
      defaultValue?: Record<string, IPublicTypePreferenceValueType>,
    ): Record<string, IPublicTypePreferenceValueType> | undefined | null => {
      const pluginPreference = this.plugins.getPluginPreference(pluginName);
      if (pluginPreference === undefined || pluginPreference === null) {
        return defaultValue;
      }
      return pluginPreference;
    };

    this.preference = {
      getPreferenceValue,
      getPreference,
    };
  }
}
