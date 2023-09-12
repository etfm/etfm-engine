import { IPublicTypeWidgetBaseConfig } from './widget-base-config';

export interface IPublicWidget {
  name: string;
  area: any;
  content: any;
  align?: string;
  visible: boolean;
  config: IPublicTypeWidgetBaseConfig;
  show(): void;
  hide(): void;
  toggle(): void;

  [x: string]: any;
}

export interface IWidget {
  readonly name: string;
  readonly area: any;
  readonly content: any;
  readonly align?: string;
  readonly visible: boolean;
  readonly config: WidgetConfig;
  getName(): string;
  getContent(): any;
  show(): void;
  hide(): void;
  toggle(): void;

  [x: string]: any;
}

export interface WidgetConfig {
  name: string;
  area?: any;
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
    [x: string]: any;
  };
  visible?: boolean;
  content?: any;
  contentProps?: Record<string, any>;
  index?: number;
  [extra: string]: any;
}
