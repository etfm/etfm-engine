import { IPublicApiSkeleton } from './api/skeleton';
import { IPublicTypeDisposable } from './disposable';
import { IEventBus } from './event-bus';
import { IWidget, WidgetConfig } from './widget';

export enum SkeletonEvents {
  ADD_WIDGET = 'skeleton.add.widget',
  REMOVE_WIDGET = 'skeleton.remove.widget',
  WIDGET_SHOW = 'skeleton.widget.show',
  WIDGET_HIDE = 'skeleton.widget.hide',
  AREA_SHOW = 'skeleton.area.show',
  AREA_HIDE = 'skeleton.area.hide',
}

export interface ISkeleton
  extends Omit<
    IPublicApiSkeleton,
    'showWidget' | 'hideWidget' | 'onShowWidget' | 'onHideWidget' | 'remove' | 'add'
  > {
  readonly eventBus: IEventBus;

  readonly widgets: IWidget[];

  getWidget(name: string): IWidget | undefined;

  add(config: WidgetConfig, extraConfig?: Record<string, any>): IWidget | undefined;

  postEvent(event: SkeletonEvents, args: any): void;

  remove(name: string): void;

  onWidget(listener: (...args: any[]) => void): IPublicTypeDisposable;
}
