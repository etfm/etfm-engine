import { IPublicWidget } from './widget';

export interface IPublicTypeWidgetBaseConfig {
  name: string;
  area?: any;
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IPublicWidget) => void;
    [x: string]: any;
  };
  visible?: boolean;
  content?: any;
  contentProps?: Record<string, any>;
  index?: number;
  [extra: string]: any;
}
