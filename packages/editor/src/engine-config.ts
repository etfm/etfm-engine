import { Logger } from '@etfm/shared';
import { Config } from './config';
import { IEngineConfig, IPublicTypeEngineOptions } from '@etfm/types';
import { isPlainObject } from 'lodash-es';

const logger = new Logger({ bizName: 'engineConfig' });

const VALID_ENGINE_OPTIONS = {
  theme: {
    type: 'object',
    description: '主题配置',
  },
  version: {
    type: 'string',
    description: 'Etfm-Engine 版本',
  },
};

export class EngineConfig implements IEngineConfig {
  private config: Config;

  constructor() {
    this.config = new Config();
  }

  /**
   * 判断指定 key 是否有值
   * @param key
   */
  has(key: string): boolean {
    return this.config.has(key);
  }

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   */
  get(key: string, defaultValue?: any): any {
    return this.config.get(key, defaultValue);
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.config.set(key, value);
  }

  /**
   * 批量设值，set 的对象版本
   * @param config
   */
  setConfig(config: { [key: string]: any }) {
    this.config.setConfig(config);
  }

  /**
   * @param {IPublicTypeEngineOptions} engineOptions
   */
  setEngineOptions(engineOptions?: IPublicTypeEngineOptions) {
    if (!engineOptions || !isPlainObject(engineOptions)) {
      return;
    }
    const isValidKey = (key: any) => {
      const result = (VALID_ENGINE_OPTIONS as any)[key];
      return !(result === undefined || result === null);
    };
    Object.keys(engineOptions).forEach((key) => {
      if (isValidKey(key)) {
        this.set(key, (engineOptions as any)[key]);
      } else {
        logger.warn(
          `failed to config ${key} to engineConfig, only predefined options can be set under strict mode, predefined options: `,
          VALID_ENGINE_OPTIONS,
        );
      }
    });
  }

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: string): Promise<any> {
    return this.config.onceGot(key);
  }

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: string, fn: (data: any) => void): () => void {
    return this.config.onGot(key, fn);
  }
}

export const engineConfig = new EngineConfig();
