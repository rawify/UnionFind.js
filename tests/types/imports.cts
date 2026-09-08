import UnionFind = require('@rawify/unionfind');

const Constructor: UnionFind.UnionFindConstructor = UnionFind;
const unionFind: UnionFind.UnionFind = new Constructor(4);
const representative: number | null = unionFind.find(0);

void representative;
void UnionFind.default;
void UnionFind.UnionFind;