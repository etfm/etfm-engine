import { isNumber, isString } from 'lodash-es';
import type { TreeItem, TreeArray } from '@etfm/types';

/**
 * 类似于 arr.map 方法，此方法主要针对类似下面示例的树形结构。
 * [
 *     {
 *         children: []
 *     },
 *     // 其他成员
 * ]
 *
 * @param {Tree} tree 树形数据
 * @param {Function} iterator 处理函数，返回的数据会被替换成新的。
 * @return {Tree} 返回处理过的 tree
 */
export function mapTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>, indexes: Array<number>) => T,
  level: number = 1,
  depthFirst: boolean = false,
  paths: Array<T> = [],
  indexes: Array<number> = [],
) {
  return tree.map((item: any, index) => {
    if (depthFirst) {
      let children: TreeArray | undefined = item.children
        ? mapTree(
            item.children,
            iterator,
            level + 1,
            depthFirst,
            paths.concat(item),
            indexes.concat(index),
          )
        : undefined;
      children && (item = { ...item, children: children });
      item = iterator(item, index, level, paths, indexes.concat(index)) || {
        ...(item as object),
      };
      return item;
    }

    item = iterator(item, index, level, paths, indexes.concat(index)) || {
      ...(item as object),
    };

    if (item.children && item.children.splice) {
      item.children = mapTree(
        item.children,
        iterator,
        level + 1,
        depthFirst,
        paths.concat(item),
        indexes.concat(index),
      );
    }

    return item;
  });
}

/**
 * 遍历树
 * @param tree
 * @param iterator
 */
export function eachTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths?: Array<T>) => any,
  level: number = 1,
  paths: Array<T> = [],
) {
  const length = tree.length;
  for (let i = 0; i < length; i++) {
    const item = tree[i];
    const res = iterator(item, i, level, paths);
    if (res === 'break') {
      break;
    }
    if (res === 'continue') {
      continue;
    }

    if (item.children?.splice) {
      eachTree(item.children as T[], iterator, level + 1, paths.concat(item));
    }
  }
}

/**
 * 在树中查找节点。
 * @param tree
 * @param iterator
 * @param withCache {Object} 启用缓存（new Map()），多次重复从一颗树中查找时可大幅度提升性能
 * @param withCache.value {string} 必须，需要从缓存Map中匹配的值，使用Map.get(value) 匹配
 * @param withCache.resolve {function} 构建Map 时，存入key 的处理函数
 * @param withCache.foundEffect 匹配到时，额外做的一些副作用
 */
const findTreeCache: {
  tree: any | null;
  map: Map<any, any> | null;
} = {
  tree: null,
  map: null,
};
export function findTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any,
  withCache?: {
    value: string | number;
    resolve?: (treeItem: T) => any;
    foundEffect?: (item: T, key: number, level: number, paths?: Array<T>) => any;
  },
): T | null {
  const isValidateKey = (value: any) => value !== '' && (isString(value) || isNumber(value));
  // 缓存优化
  if (withCache && isValidateKey(withCache.value)) {
    const { resolve, value, foundEffect } = withCache;
    // 构建缓存
    if (tree !== findTreeCache.tree || !findTreeCache.map) {
      const map = new Map();
      eachTree(tree, (item, key, level, paths) => {
        const mapKey = resolve ? resolve(item) : item;
        isValidateKey(mapKey) && map.set(String(mapKey), [item, key, level, paths]);
      });
      findTreeCache.map = map;
      findTreeCache.tree = tree;
    }

    // 从缓存查找结果
    const res = findTreeCache.map.get(String(value));
    if (res != null) {
      // 副作用
      foundEffect && foundEffect.apply(null, res.slice());
      return res[0];
    }
  }

  let result: T | null = null;
  everyTree(tree, (item, key, level, paths) => {
    if (iterator(item, key, level, paths)) {
      result = item;
      return false;
    }
    return true;
  });

  return result;
}

/**
 * 在树中查找节点。
 * @param tree
 * @param iterator
 */
export function findTreeAll<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any,
): Array<T> {
  let result: Array<T> = [];

  everyTree(tree, (item, key, level, paths) => {
    if (iterator(item, key, level, paths)) {
      result.push(item);
    }
    return true;
  });

  return result;
}

/**
 * 在树中查找节点, 返回下标数组。
 * @param tree
 * @param iterator
 * @param withCache {Object} 启用缓存（new Map()），多次重复从一颗树中查找时可大幅度提升性能
 * @param withCache.value {any} 必须，需要从缓存Map中匹配的值，使用Map.get(value) 匹配
 * @param withCache.resolve {function} 构建Map 时，存入key 的处理函数
 */
export function findTreeIndex<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any,
  withCache?: {
    resolve?: (treeItem: T) => any;
    value: any;
  },
): Array<number> | undefined {
  let idx: Array<number> = [];

  const foundEffect = (_: T, index: number, __: number, paths?: Array<T>) => {
    idx = [index];

    paths = paths!.concat();
    paths.unshift({
      children: tree,
    } as any);

    for (let i = paths.length - 1; i > 0; i--) {
      const prev = paths[i - 1];
      const current = paths[i];
      idx.unshift(prev.children!.indexOf(current));
    }
  };

  findTree(
    tree,
    (item, index, level, paths) => {
      if (iterator(item, index, level, paths)) {
        foundEffect(item, index, level, paths);
        return true;
      }
      return false;
    },
    !withCache
      ? undefined
      : {
          ...withCache,
          foundEffect,
        },
  );

  return idx.length ? idx : undefined;
}

export function getTree<T extends TreeItem>(
  tree: Array<T>,
  idx: Array<number> | number,
): T | undefined | null {
  const indexes = Array.isArray(idx) ? idx.concat() : [idx];
  const lastIndex = indexes.pop()!;
  let list: Array<T> | null = tree;
  for (let i = 0, len = indexes.length; i < len; i++) {
    const index = indexes[i];
    if (!list![index]) {
      list = null;
      break;
    }
    list = list![index].children as any;
  }
  return list ? list[lastIndex] : undefined;
}

/**
 * 过滤树节点
 *
 * @param tree
 * @param iterator
 */
export function filterTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => any,
  level: number = 1,
  depthFirst: boolean = false,
  paths: Array<T> = [],
) {
  if (depthFirst) {
    return tree
      .map((item) => {
        let children: TreeArray | undefined = item.children
          ? filterTree(item.children as T[], iterator, level + 1, depthFirst, paths.concat(item))
          : undefined;

        if (Array.isArray(children) && Array.isArray(item.children)) {
          item = { ...item, children: children };
        }

        return item as T;
      })
      .filter((item, index) => iterator(item, index, level, paths));
  }

  return tree
    .filter((item, index) => iterator(item, index, level, paths))
    .map((item) => {
      if (item.children?.splice) {
        let children = filterTree(
          item.children as T[],
          iterator,
          level + 1,
          depthFirst,
          paths.concat(item),
        );

        if (Array.isArray(children) && Array.isArray(item.children)) {
          item = { ...item, children: children };
        }
      }
      return item as T;
    });
}

/**
 * 判断树中每个节点是否满足某个条件。
 * @param tree
 * @param iterator
 */
export function everyTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (
    item: T,
    key: number,
    level: number,
    paths: Array<T>,
    indexes: Array<number>,
  ) => boolean,
  // level: number = 1,
  // paths: Array<T> = [],
  // indexes: Array<number> = [],
): boolean {
  const stack: {
    item: T;
    index: number;
    level: number;
    paths: Array<T>;
    indexes: Array<number>;
  }[] = [];
  stack.push({ item: null as any, index: -1, level: 1, paths: [], indexes: [] });
  while (stack.length > 0) {
    const { item, index, level, paths, indexes } = stack.pop()!;

    if (index >= 0) {
      const value: any = iterator(item, index, level, paths, indexes);

      if (value && item.children?.splice) {
        const children = item.children;
        for (let i = children.length - 1; i >= 0; i--) {
          stack.push({
            item: children[i] as T,
            index: i,
            level: level + 1,
            paths: paths.concat(item),
            indexes: indexes.concat(index),
          });
        }
      } else if (!value) {
        return false;
      }
    } else {
      if (!Array.isArray(tree)) {
        return false;
      }
      for (let i = tree.length - 1; i >= 0; i--) {
        stack.push({
          item: tree[i],
          index: i,
          level: 1,
          paths: [],
          indexes: [],
        });
      }
    }
  }
  return true;
}

/**
 * 判断树中是否有某些节点满足某个条件。
 * @param tree
 * @param iterator
 */
export function someTree<T extends TreeItem>(
  tree: Array<T>,
  iterator: (item: T, key: number, level: number, paths: Array<T>) => boolean,
): boolean {
  let result = false;

  everyTree(tree, (item: T, key: number, level: number, paths: Array<T>) => {
    if (iterator(item, key, level, paths)) {
      result = true;
      return false;
    }
    return true;
  });

  return result;
}

/**
 * 将树打平变成一维数组，可以传入第二个参数实现打平节点中的其他属性。
 *
 * 比如：
 *
 * flattenTree([
 *     {
 *         id: 1,
 *         children: [
 *              { id: 2 },
 *              { id: 3 },
 *         ]
 *     }
 * ], item => item.id); // 输出为 [1, 2, 3]
 *
 * @param tree
 * @param mapper
 */
export function flattenTree<T extends TreeItem>(tree: Array<T>): Array<T>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper: (value: T, index: number, level: number, paths?: Array<T>) => U,
): Array<U>;
export function flattenTree<T extends TreeItem, U>(
  tree: Array<T>,
  mapper?: (value: T, index: number, level: number, paths?: Array<T>) => U,
): Array<U> {
  let flattened: Array<any> = [];
  eachTree(tree, (item, index, level, paths) =>
    flattened.push(mapper ? mapper(item, index, level, paths) : item),
  );
  return flattened;
}

/**
 * 将树打平变成一维数组，用法和flattenTree类似，区别是结果仅保留叶节点
 *
 * 比如：
 *
 * flattenTreeWithLeafNodes([
 *     {
 *         id: 1,
 *         children: [
 *              { id: 2 },
 *              { id: 3 },
 *         ]
 *     }
 * ], item => item.id); // 输出为 [2, 3]
 *
 * @param tree
 * @param mapper
 */
export function flattenTreeWithLeafNodes<T extends TreeItem>(tree: Array<T>): Array<T>;
export function flattenTreeWithLeafNodes<T extends TreeItem, U>(
  tree: Array<T>,
  mapper: (value: T, index: number) => U,
): Array<U>;
export function flattenTreeWithLeafNodes<T extends TreeItem, U>(
  tree: Array<T>,
  mapper?: (value: T, index: number) => U,
): Array<U> {
  let flattened: Array<any> = [];
  eachTree(tree, (item, index) => {
    if (!item.hasOwnProperty('children')) {
      flattened.push(mapper ? mapper(item, index) : item);
    }
  });
  return flattened;
}

/**
 * 操作树，遵循 imutable, 每次返回一个新的树。
 * 类似数组的 splice 不同的地方这个方法不修改原始数据，
 * 同时第二个参数不是下标，而是下标数组，分别代表每一层的下标。
 *
 * 至于如何获取下标数组，请查看 findTreeIndex
 *
 * @param tree
 * @param idx
 * @param deleteCount
 * @param ...items
 */
export function spliceTree<T extends TreeItem>(
  tree: Array<T>,
  idx: Array<number> | number,
  deleteCount: number = 0,
  ...items: Array<T>
): Array<T> {
  const list = tree.concat();
  if (typeof idx === 'number') {
    list.splice(idx, deleteCount, ...items);
  } else if (Array.isArray(idx) && idx.length) {
    idx = idx.concat();
    const lastIdx = idx.pop()!;
    let host = idx.reduce((list: any, idx) => {
      const child = {
        ...list[idx],
        children: list[idx].children ? list[idx].children!.concat() : [],
      };
      list[idx] = child;
      return child.children;
    }, list);
    host.splice(lastIdx, deleteCount, ...items);
  }

  return list;
}

/**
 * 计算树的深度
 * @param tree
 */
export function getTreeDepth<T extends TreeItem>(tree: Array<T>): number {
  if (Array.isArray(tree) && tree.length === 0) {
    return 0;
  }
  return Math.max(
    ...tree.map((item) => {
      if (Array.isArray(item.children)) {
        return 1 + getTreeDepth(item.children);
      }

      return 1;
    }),
  );
}

/**
 * 从树中获取某个值的所有祖先
 * @param tree
 * @param value
 */
export function getTreeAncestors<T extends TreeItem>(
  tree: Array<T>,
  value: T,
  includeSelf = false,
): Array<T> | null {
  let ancestors: Array<T> | null = null;

  findTree(tree, (item, _, __, paths) => {
    if (item === value) {
      ancestors = paths;
      if (includeSelf) {
        ancestors.push(item);
      }
      return true;
    }
    return false;
  });

  return ancestors;
}

/**
 * 从树中获取某个值的上级
 * @param tree
 * @param value
 */
export function getTreeParent<T extends TreeItem>(tree: Array<T>, value: T) {
  const ancestors = getTreeAncestors(tree, value);
  return ancestors?.length ? ancestors[ancestors.length - 1] : null;
}
