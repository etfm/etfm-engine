export interface TreeItem {
  children?: TreeArray;
  [propName: string]: any;
}

export interface TreeArray extends Array<TreeItem> {}
