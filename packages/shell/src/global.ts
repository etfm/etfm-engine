import { IGlobal, IPublicApiGlobal, IPublicTypeGetResult, IPublicTypeValueKey } from '@etfm/types';
import { globalSymbol } from './symbols';

export class Global implements IPublicApiGlobal {
  private readonly [globalSymbol]: IGlobal;

  constructor(global: IGlobal) {
    this[globalSymbol] = global;
  }

  has(keyOrType: KeyType): boolean {
    return this[globalSymbol].has(keyOrType);
  }

  register(data: any, key?: IPublicTypeValueKey): void {
    return this[globalSymbol].register(data, key || data);
  }

  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
  ): IPublicTypeGetResult<T, KeyOrType> | undefined {
    return this[globalSymbol].get(keyOrType);
  }

  set(key: IPublicTypeValueKey, data: any) {
    return this[globalSymbol].set(key, data);
  }
}
