import { Component, DefineComponent } from 'vue';
import { RouteMeta, RouteRecordRaw, Router, RouterHistory, RouterOptions } from 'vue-router';
import { Recordable } from './common';
import { IPublicTypeDisposable } from './disposable';

export interface IGlobalRouter {
  router: Router;

  getRouters(
    routes: IPublicAppRouteRecordRaw[] | IPublicAppRouteRecordRaw,
  ): IPublicAppRouteRecordRaw[];

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

export interface IPublicRouterOptions extends Omit<RouterOptions, 'routes' | 'history'> {
  routes?: IPublicAppRouteRecordRaw[];
  historyType?: string;
  basename?: string;
  rouls?: string[] | (() => string[]);
  history?: RouterHistory;
}

export interface IPublicAppRouteRecordRaw extends Omit<RouteRecordRaw, 'children' | 'component'> {
  name: string;
  meta: RouteMeta;
  component?: DefineComponent | Component | string;
  children?: IPublicAppRouteRecordRaw[];
  props?: Recordable<any>;
  fullPath?: string;
}
