import {
  IPluginManager,
  IPublicApiPlugins,
  IPublicModelPluginInstance,
  IPublicPlugin,
  IPublicTypeDisposable,
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
  IPublicTypeStates,
} from '@etfm/types';
import { PluginInstance as ShellPluginInstance } from './plugin-instance';
import { pluginsSymbol } from './symbols';

export class Plugins implements IPublicApiPlugins {
  private readonly [pluginsSymbol]: IPluginManager;

  constructor(plugins: IPluginManager) {
    this[pluginsSymbol] = plugins;
  }
  [key: string]: any;

  async register(
    pluginModel: IPublicPlugin,
    options?: any,
    registerOptions?: IPublicTypePluginRegisterOptions,
  ): Promise<void> {
    await this[pluginsSymbol].register(pluginModel, options, registerOptions);
  }

  async init(registerOptions: any) {
    await this[pluginsSymbol].init(registerOptions);
  }

  getPluginPreference(
    pluginName: string,
  ): Record<string, IPublicTypePreferenceValueType> | null | undefined {
    return this[pluginsSymbol].getPluginPreference(pluginName);
  }

  get(pluginName: string): IPublicModelPluginInstance | null {
    const instance = this[pluginsSymbol].get(pluginName);
    if (instance) {
      return new ShellPluginInstance(instance);
    }

    return null;
  }

  getAll() {
    return this[pluginsSymbol].getAll()?.map((d) => new ShellPluginInstance(d));
  }

  has(pluginName: string) {
    return this[pluginsSymbol].has(pluginName);
  }

  async delete(pluginName: string) {
    return await this[pluginsSymbol].delete(pluginName);
  }

  onNotify(listener: (states: IPublicTypeStates) => void): IPublicTypeDisposable {
    return this[pluginsSymbol].onNotify(listener);
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        const _target = target[pluginsSymbol];
        if (_target.pluginsMap.has(prop as string)) {
          // 禁用态的插件，直接返回 undefined
          if (_target.pluginsMap.get(prop as string)!.disabled) {
            return undefined;
          }
          return _target.pluginsMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
