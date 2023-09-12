import { get as lodashGet, isPlainObject } from 'lodash-es';

export class Config {
  private config: { [key: string]: any } = {};

  private waits = new Map<
    string,
    Array<{
      once?: boolean;
      resolve: (data: any) => void;
    }>
  >();

  constructor(config?: { [key: string]: any }) {
    this.config = config || {};
  }

  getConfig(): any {
    return this.config;
  }

  /**
   * 判断指定 key 是否有值
   * @param key
   */
  has(key: any): boolean {
    return this.config[key] !== undefined;
  }

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   */
  get(key: any, defaultValue?: any): any {
    return lodashGet(this.config, key, defaultValue);
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: any, ...value: any) {
    this.config[key] = value;
    this.notifyGot(key);
  }

  setConfig(options: any) {
    if (!options || !isPlainObject(options)) {
      return;
    }

    Object.keys(options).forEach((key) => {
      this.set(key, ...options[key]);
    });
  }

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: any): Promise<any> {
    const val = lodashGet(this.config, key);
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise((resolve) => {
      this.setWait(key, resolve, true);
    });
  }

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: any, fn: (...data: any) => void): () => void {
    const val = lodashGet(this.config, key);
    if (val !== undefined) {
      fn(...val);
    }
    this.setWait(key, fn);
    return () => {
      this.delWait(key, fn);
    };
  }

  notifyGot(key: any): void {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }

  setWait(key: string, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  delWait(key: string, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
}
