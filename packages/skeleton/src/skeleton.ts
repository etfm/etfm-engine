import { Widget } from './widget';

import {
  IEventBus,
  IPublicTypeDisposable,
  ISkeleton,
  IWidget,
  SkeletonEvents,
  WidgetConfig,
} from '@etfm/types';

import { createModuleEventBus } from '@etfm/editor';
import { get, isPlainObject, set } from 'lodash-es';

export class Skeleton implements ISkeleton {
  readonly widgets: IWidget[] = [];

  readonly eventBus: IEventBus;

  constructor() {
    this.eventBus = createModuleEventBus('skeleton');
  }

  private parseConfig(config: WidgetConfig) {
    if (config.parsed) {
      return config;
    }
    const { content, ...restConfig } = config;
    if (content) {
      if (isPlainObject(content)) {
        Object.keys(content).forEach((key) => {
          if (/props$/i.test(key) && restConfig[key]) {
            restConfig[key] = {
              ...restConfig[key],
              ...content[key],
            };
          } else {
            restConfig[key] = content[key];
          }
        });
      } else {
        restConfig.content = content;
      }
    }
    restConfig.pluginKey = restConfig.name;
    restConfig.parsed = true;

    if (!get(restConfig, 'props.align')) {
      set(restConfig, 'props.align', 'center');
    }

    return restConfig;
  }

  postEvent(event: SkeletonEvents, args: any) {
    this.eventBus.emit(event, args);
  }

  createWidget(config: WidgetConfig | IWidget) {
    config = this.parseConfig(config);
    const widget: Widget = new Widget(this, config as WidgetConfig);
    this.widgets.push(widget);
    return widget;
  }

  getWidget(name: string): IWidget | undefined {
    return this.widgets.find((widget) => widget.name === name);
  }

  setWidget(config: IWidget, widgets) {
    widgets.push(config);
    this.postEvent(SkeletonEvents.ADD_WIDGET, { config, widgets, skeleton: this });
    return widgets;
  }

  onWidget(listener: (...args: any[]) => void): IPublicTypeDisposable {
    this.eventBus.on(
      SkeletonEvents.ADD_WIDGET,
      ({ config, widgets, skeleton }: { config: any; widgets: IWidget[]; skeleton: any }) => {
        listener(config, widgets, skeleton);
      },
    );
    return () => this.eventBus.off(SkeletonEvents.WIDGET_SHOW, listener);
  }

  add(config: WidgetConfig, extraConfig?: Record<string, any>) {
    const parsedConfig = {
      ...this.parseConfig(config),
      ...extraConfig,
    };

    return this.createWidget(parsedConfig);
  }

  remove(name: string) {
    const i = this.widgets.findIndex((item) => item.name === name);
    if (i > -1) {
      this.widgets.splice(i, 1);
    }

    this.postEvent(SkeletonEvents.REMOVE_WIDGET, {
      config: this.widgets[i],
      widgets: this.widgets,
      skeleton: this,
    });
  }
}
