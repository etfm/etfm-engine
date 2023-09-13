import { Skeleton as InnerSkeleton } from '@etfm/skeleton';
import { engineConfig, commonEvent, Global as InnerGlobal } from '@etfm/editor';
import { Skeleton, Event, Global, Plugins, Config, Theme, Persistent } from '@etfm/shell';
import { Logger } from '@etfm/shared';

import jsonPkg from '../../../package.json';

import {
  IPluginContextApiAssembler,
  IPluginContextPrivate,
  IPluginPreference,
  IPublicApiPlugins,
  IPublicTypeEngineOptions,
  IPublicTypePluginMeta,
} from '@etfm/types';
import { PluginManager } from '@etfm/plugin';
import { globalTheme } from '@etfm/theme';

export * from './types';
export * from './persistent';
export * from './hooks';

const innerGlobal = new InnerGlobal();
const global = new Global(innerGlobal);

const innerSkeleton = new InnerSkeleton();
const skeleton = new Skeleton(innerSkeleton);
global.register(skeleton, 'skeleton');

const theme = new Theme(globalTheme);
global.register(theme, 'theme');

const config = new Config(engineConfig);
global.register(config, 'config');

const event = new Event(commonEvent, { prefix: 'common' });
global.register(event, 'event');

const logger = new Logger({ bizName: 'common' });
global.register(logger, 'logger');

const persistent = new Persistent();
global.register(persistent, 'persistent');

let plugins: IPublicApiPlugins;

const pluginContextApiAssembler: IPluginContextApiAssembler = {
  assembleApis: (
    context: IPluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta,
  ) => {
    context.skeleton = skeleton;
    const eventPrefix = meta?.eventPrefix || 'common';
    context.event = new Event(commonEvent, { prefix: eventPrefix });
    context.config = config;
    context.global = global;
    context.persistent = persistent;
    context.theme = theme;
    context.plugins = plugins;
    context.logger = new Logger({ bizName: `plugin:${pluginName}` });
  },
};

const innerPlugins = new PluginManager(pluginContextApiAssembler);
plugins = new Plugins(innerPlugins).toProxy();
global.register(innerPlugins, 'innerPlugins');
global.register(plugins, 'plugins');

export { skeleton, plugins, config, event, logger, global, theme, persistent };

// 全局属性
(window as any).EtfmEngine = global;

export const version = jsonPkg.version;
config.set('version', version);

export async function init(
  options?: IPublicTypeEngineOptions,
  pluginPreference?: IPluginPreference,
) {
  engineConfig.setEngineOptions(options);

  await plugins.init(pluginPreference);
}
