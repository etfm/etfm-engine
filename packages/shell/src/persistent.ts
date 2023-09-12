import { IPublicApiPersistent } from '@etfm/types';
import { Persistent as InnerPersistent } from '@etfm/persistent';

export class Persistent implements IPublicApiPersistent {
  getLocal<T>(key: string) {
    return InnerPersistent.getLocal<T>(key);
  }

  setLocal(key: string, value: any, immediate: boolean = false) {
    InnerPersistent.setLocal(key, value, immediate);
  }

  removeLocal(key: string, immediate: boolean = false) {
    InnerPersistent.removeLocal(key, immediate);
  }

  clearLocal(immediate?: boolean) {
    InnerPersistent.clearLocal(immediate);
  }

  getSession<T>(key: string) {
    return InnerPersistent.getSession<T>(key);
  }

  setSession(key: string, value: any, immediate: boolean = false) {
    InnerPersistent.setSession(key, value, immediate);
  }

  removeSession(key: string, immediate: boolean = false) {
    InnerPersistent.removeSession(key, immediate);
  }

  clearSession(immediate: boolean = false) {
    InnerPersistent.clearSession(immediate);
  }

  clearAll(immediate: boolean = false) {
    InnerPersistent.clearAll(immediate);
  }
}
