import { IPublicTypeWidgetBaseConfig } from '../widget-base-config';

export interface IPublicApiSkeleton {
  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IPublicTypeWidgetBaseConfig, extraConfig?: Record<string, any>): any;

  /**
   * 移除一个面板实例
   * @param name
   * @returns
   */
  remove(name: any): void;

  /**
   * 显示 widget
   * @param name
   */
  showWidget(name: string): void;

  /**
   * 隐藏 widget
   * @param name
   */
  hideWidget(name: string): void;

  /**
   * 监听 widget 显示事件
   * @param listener
   * @returns
   */
  onShowWidget(listener: (args: any) => void): () => void;

  /**
   * 监听 widget 隐藏事件
   * @param listener
   * @returns
   */
  onHideWidget(listener: (args: any) => void): () => void;
}
