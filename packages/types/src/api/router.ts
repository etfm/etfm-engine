import { Router } from 'vue-router';
import { IPublicAppRouteRecordRaw } from '../router';
import { IPublicTypeDisposable } from '../disposable';

export interface IPublicApiRouter {
  get router(): Router;

  /**
   * 设置多语言资源
   * @param args
   */
  setAssets(args: IPublicAppRouteRecordRaw[]): void;

  /**
   * 监听多语言资源的变化
   * @param listener
   */
  onAssets(listener: (args: IPublicAppRouteRecordRaw[]) => void): IPublicTypeDisposable;
}
