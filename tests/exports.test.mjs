import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

import UnionFind, { UnionFind as NamedUnionFind } from '@rawify/unionfind';

test('publishes stable CommonJS, ESM, and browser entry points', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  );

  assert.equal(packageJson.main, './dist/unionfind.js');
  assert.equal(packageJson.module, './dist/unionfind.mjs');
  assert.equal(packageJson.unpkg, './dist/unionfind.min.js');
  assert.equal(packageJson.jsdelivr, './dist/unionfind.min.js');
  assert.equal(packageJson.exports['.'].require.default, './dist/unionfind.js');
  assert.equal(packageJson.exports['.'].import.default, './dist/unionfind.mjs');
});

test('keeps ESM default and named exports identical', () => {
  assert.equal(NamedUnionFind, UnionFind);
  assert.equal(new UnionFind(3).count(), 3);
});

test('loads the self-contained ESM bundle without package resolution', async () => {
  const source = await readFile(new URL('../dist/unionfind.mjs', import.meta.url), 'utf8');
  const moduleUrl = `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`;
  const browserModule = await import(moduleUrl);
  const unionFind = new browserModule.default(3);

  assert.equal(browserModule.UnionFind, browserModule.default);
  assert.equal(unionFind.union(0, 1), true);
  assert.equal(unionFind.connected(0, 1), true);
});

test('exposes the standalone browser global', async () => {
  const source = await readFile(new URL('../dist/unionfind.min.js', import.meta.url), 'utf8');
  const context = { globalThis: {} };

  vm.runInNewContext(source, context);

  assert.equal(typeof context.globalThis.UnionFind, 'function');
  const unionFind = new context.globalThis.UnionFind(4);
  unionFind.union(1, 2);
  assert.equal(unionFind.connected(1, 2), true);
});