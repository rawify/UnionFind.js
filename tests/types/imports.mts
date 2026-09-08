import UnionFind, { UnionFind as NamedUnionFind } from '@rawify/unionfind';

const unionFind: NamedUnionFind = new UnionFind(4);
const merged: boolean = unionFind.union(0, 1);
const representative: number | null = unionFind.find(1);
const componentCount: number = unionFind.count();

void merged;
void representative;
void componentCount;