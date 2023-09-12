import { uniqueId } from '@etfm/shared';
import {
  IPublicTypeDisposable,
  ISkeleton,
  IWidget,
  SkeletonEvents,
  WidgetConfig,
} from '@etfm/types';

export class Widget implements IWidget {
  readonly id = uniqueId('widget');

  readonly name: string;

  readonly area: any;

  readonly align?: string;

  readonly content: any;

  readonly skeleton: ISkeleton;

  private _visible = true;

  get visible(): boolean {
    return this._visible;
  }

  constructor(skeleton: ISkeleton, readonly config: WidgetConfig) {
    const { props = {}, name, visible = true, area } = config;
    this.name = name;
    this.area = area;
    this.align = props.align;
    this.content = props.content;
    this._visible = visible;
    this.skeleton = skeleton;

    if (props.onInit) {
      props.onInit.call(this, this);
    }
  }
  [x: string]: any;

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  onVisible(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.skeleton.eventBus.on(SkeletonEvents.WIDGET_SHOW, ({ name, widget }) => {
      listener(name, widget);
    });
    return () => this.skeleton.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  onHide(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.skeleton.eventBus.on(SkeletonEvents.WIDGET_HIDE, ({ name, widget }) => {
      listener(name, widget);
    });
    return () => this.skeleton.eventBus.off(SkeletonEvents.WIDGET_HIDE, listener);
  }

  setVisible(flag: boolean) {
    if (flag === this._visible) {
      return;
    }
    if (flag) {
      this._visible = true;

      this.skeleton.postEvent(SkeletonEvents.WIDGET_SHOW, { name: this.name, widget: this });
    } else {
      this._visible = false;
      this.skeleton.postEvent(SkeletonEvents.WIDGET_HIDE, { name: this.name, widget: this });
    }
  }

  toggle() {
    this.setVisible(!this._visible);
  }
}
