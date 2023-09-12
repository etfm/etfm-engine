import { IPublicModelSkeletonItem, IWidget } from '@etfm/types';
import { skeletonItemSymbol } from './symbols';

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: IWidget;

  constructor(skeletonItem: IWidget) {
    this[skeletonItemSymbol] = skeletonItem;
  }

  get name() {
    return this[skeletonItemSymbol].name;
  }

  get area() {
    return this[skeletonItemSymbol].area;
  }

  hide() {
    this[skeletonItemSymbol].hide();
  }

  show() {
    this[skeletonItemSymbol].show();
  }

  toggle() {
    this[skeletonItemSymbol].toggle();
  }
}
