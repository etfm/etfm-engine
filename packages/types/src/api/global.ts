import { IPublicTypeGetResult, IPublicTypeValueKey } from '../core';

export interface IPublicApiGlobal {
  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeGetResult<T, KeyOrType> | undefined;

  set(key: KeyType, data: any): void;

  has(keyOrType: KeyType, deep?: boolean): boolean;

  register(data: any, key?: IPublicTypeValueKey): void;
}
