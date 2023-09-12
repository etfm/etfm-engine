import { isString } from 'lodash-es';
import { isClient, isIOS } from '@vueuse/core';

export const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};


export function isPluginEventName(eventName: string): boolean {
  if (!eventName) {
    return false;
  }

  const eventSegments = eventName.split(':');
  return eventSegments.length > 1 && eventSegments[0].length > 0;
}

export function is(value: unknown, type: string) {
  return toString.call(value) === `[object ${type}]`;
}

/**
 * @description 判断所给字符串是否为url类型，这里只判断是否 http/http,其他格式不支持
 * @param pathname
 * @returns
 */
 export function isHttpUrl(url: string) {
  // Regular expression to match HTTP(S) URL
  const httpRegex = /^https?:\/\/.*$/;
  return httpRegex.test(url);
}

export function isMap(value: unknown): value is Map<any, any> {
  return is(value, 'Map') || value instanceof Map;
}

export function isWindow(value: any): value is Window {
  return typeof window !== 'undefined' && value !== null && value === value.window;
}




export const isFirefox = (): boolean => isClient && /firefox/i.test(window.navigator.userAgent);

export { isClient, isIOS };