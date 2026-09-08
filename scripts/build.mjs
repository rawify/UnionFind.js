import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';

import { build } from 'esbuild';

const entryPoint = 'src/unionfind.ts';

await mkdir('dist', { recursive: true });

const shared = {
  bundle: true,
  entryPoints: [entryPoint],
  legalComments: 'inline',
  sourcemap: true,
  target: 'es2018',
};

await Promise.all([
  build({
    ...shared,
    format: 'esm',
    outfile: 'dist/unionfind.mjs',
  }),
  build({
    ...shared,
    footer: {
      js: [
        'const UnionFindExport = module.exports.default;',
        'Object.defineProperty(UnionFindExport, "__esModule", { value: true });',
        'UnionFindExport.default = UnionFindExport;',
        'UnionFindExport.UnionFind = UnionFindExport;',
        'module.exports = UnionFindExport;',
      ].join('\n'),
    },
    format: 'cjs',
    outfile: 'dist/unionfind.js',
    platform: 'node',
  }),
  build({
    ...shared,
    footer: {
      js: 'globalThis.UnionFind = UnionFindExports.default;',
    },
    format: 'iife',
    globalName: 'UnionFindExports',
    minify: true,
    outfile: 'dist/unionfind.min.js',
    sourcemap: false,
  }),
]);

await copyFile('.types/unionfind.d.ts', 'dist/unionfind.d.mts');
await writeFile('dist/unionfind.d.ts', [
  "import type { UnionFind as UnionFindType } from './unionfind.d.mts';",
  '',
  'interface UnionFindConstructor {',
  '  new (size: number): UnionFindType;',
  '}',
  '',
  'declare const UnionFind: UnionFindConstructor & {',
  '  readonly default: UnionFindConstructor;',
  '  readonly UnionFind: UnionFindConstructor;',
  '};',
  '',
  'declare namespace UnionFind {',
  '  type UnionFind = UnionFindType;',
  '  type UnionFindConstructor = new (size: number) => UnionFindType;',
  '}',
  '',
  'export = UnionFind;',
  '',
].join('\n'));
await rm('.types', { recursive: true });