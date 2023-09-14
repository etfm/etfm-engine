import type {
  IGlobalRouter,
  IPublicApiRouter,
  IPublicAppRouteRecordRaw,
  IPublicTypeDisposable,
} from '@etfm/types';
import { routerSymbol } from './symbols';
import type { Router } from 'vue-router';

export class Route implements IPublicApiRouter {
  private readonly [routerSymbol]: IGlobalRouter;

  get router(): Router {
    return this[routerSymbol].router;
  }

  constructor(router: IGlobalRouter) {
    this[routerSymbol] = router;
  }

  setAssets(args: IPublicAppRouteRecordRaw[]): void {
    this[routerSymbol].setAssets(args);
  }

  onAssets(listener: (args: IPublicAppRouteRecordRaw[]) => void): IPublicTypeDisposable {
    return this[routerSymbol].onAssets(listener);
  }
}
