import { createRouter, type Router, type RouteRecordRaw } from 'vue-router';
import { createHistory } from './history';
import {
  IPublicAppRouteRecordRaw,
  IGlobalRouter,
  IPublicRouterOptions,
  IEventBus,
} from '@etfm/types';
import { filterTree } from '@etfm/shared';
import { flatMultiLevelRoutes, routeRemoveFilter } from './utils';
import { createModuleEventBus, engineConfig } from '@etfm/editor';
import { isArray, isEmpty, isFunction, merge } from 'lodash-es';
import { ROUTER_EVENTS, ROUTER_OPTIONS } from './constants';

export class GlobalRouter implements IGlobalRouter {
  private _router: Router;
  private _opts: IPublicRouterOptions;
  private eventBus: IEventBus;

  get router() {
    return this._router;
  }

  constructor() {
    this._opts = ROUTER_OPTIONS;
    this.eventBus = createModuleEventBus('i18n');

    engineConfig.onceGot('router').then((args) => {
      this._opts = merge(this._opts, args);

      const routeList = this.getRouters(this._opts.routes);

      const history = createHistory({
        type: this._opts.historyType,
        basename: this._opts.basename,
      });

      this._router = createRouter({
        ...this._opts,
        history: history,
        routes: routeList as unknown as RouteRecordRaw[],
        strict: true,
      });
    });

    this.onAssets((args: IPublicAppRouteRecordRaw[]) => {
      const routeList = this.getRouters(args);
      routeList.forEach((route) => {
        this._router.addRoute(route as unknown as RouteRecordRaw);
      });
    });
  }

  setAssets(args: IPublicAppRouteRecordRaw[]) {
    this.eventBus.emit(ROUTER_EVENTS.ROUTER_ASSETS, args);
  }

  onAssets(listener: (args: IPublicAppRouteRecordRaw[]) => void) {
    this.eventBus.on(ROUTER_EVENTS.ROUTER_ASSETS, listener);

    return () => this.eventBus.off(ROUTER_EVENTS.ROUTER_ASSETS, listener);
  }

  getRouters(routes?: IPublicAppRouteRecordRaw[] | IPublicAppRouteRecordRaw) {
    const rouls =
      this._opts.rouls && isFunction(this._opts.rouls) ? this._opts.rouls() : this._opts.rouls;

    if (routes && !isEmpty(routes)) {
      routes = isArray(routes) ? routes : [routes];
      // 忽略路由
      const filterRoutes = filterTree(routes, (route) =>
        routeRemoveFilter(route, rouls as string[]),
      );
      // 路由打平到二级路由
      const patchRoutes = flatMultiLevelRoutes(filterRoutes);
      return patchRoutes;
    }

    return [];
  }
}

export const globalRouter = new GlobalRouter();
