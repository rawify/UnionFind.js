import type { UnionFind as UnionFindType } from './unionfind.d.mts';

interface UnionFindConstructor {
  new (size: number): UnionFindType;
}

declare const UnionFind: UnionFindConstructor & {
  readonly default: UnionFindConstructor;
  readonly UnionFind: UnionFindConstructor;
};

declare namespace UnionFind {
  type UnionFind = UnionFindType;
  type UnionFindConstructor = new (size: number) => UnionFindType;
}

export = UnionFind;
