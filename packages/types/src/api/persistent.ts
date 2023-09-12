import { Nullable } from '../common';

export interface IPublicApiPersistent {
  getLocal: <T>(key: string) => Nullable<T>;
  setLocal: (key: string, value: any, immediate?: boolean) => void;
  removeLocal: (key: string, immediate?: boolean) => void;
  clearLocal: (immediate?: boolean) => void;
  getSession: <T>(key: string) => Nullable<T>;
  setSession: (key: string, value: any, immediate?: boolean) => void;
  removeSession: (key: string, immediate?: boolean) => void;
  clearSession: (immediate?: boolean) => void;
  clearAll: (immediate?: boolean) => void;
}
