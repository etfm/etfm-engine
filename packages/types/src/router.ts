import { Component, DefineComponent } from 'vue';
import { RouteMeta, RouteRecordRaw, Router, RouterHistory, RouterOptions } from 'vue-router';
import { Recordable } from './common';

export interface IGlobalRouter {
  router: Router;
  init(): void;
  getRouters(
    routes: IPublicAppRouteRecordRaw[] | IPublicAppRouteRecordRaw,
  ): IPublicAppRouteRecordRaw[];
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
