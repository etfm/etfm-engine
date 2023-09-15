export function promisify<T extends Function>(
  fn: T,
): (...args: Array<any>) => Promise<any> & {
  raw: T;
} {
  // 避免重复处理
  if ((fn as any)._promisified) {
    return fn as any;
  }
  const promisified = function () {
    try {
      const ret = fn.apply(null, arguments);
      if (ret && ret.then) {
        return ret;
      }

      if (typeof ret === 'function') {
        // thunk support
        return new Promise((resolve, reject) =>
          ret((error: boolean, value: any) => (error ? reject(error) : resolve(value))),
        );
      }

      return Promise.resolve(ret);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  (promisified as any).raw = fn;
  (promisified as any)._promisified = true;

  return promisified;
}
