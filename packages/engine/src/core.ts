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
global.set('skeleton', innerSkeleton);

const theme = new Theme(globalTheme);
global.set('theme', theme);

const config = new Config(engineConfig);

const event = new Event(commonEvent, { prefix: 'common' });

const logger = new Logger({ bizName: 'common' });

const persistent = new Persistent();

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
global.set('innerPlugins', innerPlugins);
global.set('plugins', plugins);

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

  initInner();

  await plugins.init(pluginPreference);
}

function initInner() {
  globalTheme.init();
}
