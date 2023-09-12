import { IPublicTypeGetResult, IPublicTypeValueKey } from './core';

export interface IGlobal {
  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeGetResult<T, KeyOrType> | undefined;

  set(key: IPublicTypeValueKey, data: any): void;

  has(keyOrType: IPublicTypeValueKey, deep?: boolean): boolean;

  register(data: any, key?: IPublicTypeValueKey): void;
}
