export type IPublicTypeValueKey = (new (...args: any[]) => any) | symbol | string;

export type IPublicTypeGetResult<T, ClsType> = T extends undefined
  ? ClsType extends {
      prototype: infer R;
    }
    ? R
    : any
  : T;
