export type ClassType = Function | (new (...args: any[]) => any);
export type KeyType = ClassType | Symbol | string;
export type RegKeyType = KeyType | undefined;

export interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

/**
 * 任意类型的异步函数
 */

type AnyPromiseFunction<T extends any[] = any[], R = void> = (...arg: T) => PromiseLike<R>;

/**
 * 任意类型的普通函数
 */
type AnyNormalFunction<T extends any[] = any[], R = void> = (...arg: T) => R;

/**
 * 任意类型的函数
 */
type AnyFunction<T extends any[] = any[], R = void> =
  | AnyNormalFunction<T, R>
  | AnyPromiseFunction<T, R>;

/**
 *  T | null 包装
 */
type Nullable<T> = T | null;

/**
 * T | Not null 包装
 */
type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * 字符串类型对象
 */
type Recordable<T> = Record<string, T>;

/**
 * 字符串类型对象（只读）
 */
interface ReadonlyRecordable<T = any> {
  readonly [key: string]: T;
}

/**
 * setTimeout 返回值类型
 */
type TimeoutHandle = ReturnType<typeof setTimeout>;

/**
 * setInterval 返回值类型
 */
type IntervalHandle = ReturnType<typeof setInterval>;

export {
  type AnyFunction,
  type AnyNormalFunction,
  type AnyPromiseFunction,
  type IntervalHandle,
  type NonNullable,
  type Nullable,
  type ReadonlyRecordable,
  type Recordable,
  type TimeoutHandle,
};
