# UnionFind.js

[![NPM Package](https://img.shields.io/npm/v/@rawify/unionfind.svg?style=flat)](https://www.npmjs.com/package/@rawify/unionfind "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

UnionFind.js is published as [`@rawify/unionfind`](https://www.npmjs.com/package/@rawify/unionfind). It maintains connected components over the fixed integer domain `0` through `n - 1` using union by size and path halving.

Use it for incremental connectivity, graph components, Kruskal-style cycle checks, image labeling, or grouping integer IDs. Use a `Map`-based implementation when elements are strings or sparse IDs, and use a graph structure when edges must be enumerated or removed.

## Features

- Union–Find / Disjoint Set Union with **union by size** and **path halving**
- **Single Int32Array storage** for maximum memory efficiency
- Amortized O(α(N)) performance (inverse Ackermann function)
- Zero allocations in hot paths
- `reset()` method for instant reuse without GC churn
- Works in Node.js and browsers

## Installation

You can install `UnionFind.js` via npm:

```bash
npm install @rawify/unionfind
```

Or with yarn:

```bash
yarn add @rawify/unionfind
```

Alternatively, download or clone the repository:

```bash
git clone https://github.com/rawify/UnionFind.js
```

## Usage

### CommonJS

```js
const UnionFind = require('@rawify/unionfind');
const components = new UnionFind(10);
```

### ES modules

```js
import UnionFind, { UnionFind as NamedUnionFind } from '@rawify/unionfind';
const components = new UnionFind(10);
```

### Standalone browser script

```html
<script src="https://cdn.jsdelivr.net/npm/@rawify/unionfind@0.1.1/dist/unionfind.min.js"></script>
<script>
	const components = new UnionFind(10);
</script>
```

### Native browser module

```html
<script type="module">
	import UnionFind from 'https://cdn.jsdelivr.net/npm/@rawify/unionfind@0.1.1/dist/unionfind.mjs';
	const components = new UnionFind(10);
</script>
```

Storage is allocated once as an `Int32Array`. The package has no runtime
dependencies and supports Node.js 20 or newer. CommonJS consumers can use the
direct class export as well as its `.default` and `.UnionFind` aliases. These
compatibility paths are covered by the test suite and are part of the supported
API.

### Creating a UnionFind instance

```javascript
// Create a UnionFind for elements 0..9
let uf = new UnionFind(10);
```

### `find(x)`

Finds the representative (root) of the set containing `x`.

```javascript
uf.find(3); // returns root index of set containing 3
```

### `union(a, b)`

Merges the sets containing `a` and `b`. Returns `true` if merged, `false` if already in the same set.

```javascript
uf.union(1, 2); // merges sets containing 1 and 2
```

### `connected(a, b)`

Checks whether `a` and `b` are in the same set.

```javascript
uf.connected(1, 2); // true
```

### `sizeOf(x)`

Returns the size of the set containing `x`.

```javascript
uf.sizeOf(1); // 3
```

### `count()`

Returns the number of disjoint sets.

```javascript
uf.count(); // 7
```

### `reset()`

Resets the structure to all singletons without reallocating.

```javascript
uf.reset();
```

### `length`

Returns the number of elements tracked.

```javascript
uf.length; // 10
```

## Recipes

### Track connected components

Each successful `union()` reduces the component count. Repeating a union inside an existing component returns `false`.

```js
import UnionFind from '@rawify/unionfind';

const components = new UnionFind(6);
components.union(0, 1);
components.union(1, 2);
components.union(3, 4);

console.log(components.connected(0, 2)); // true
console.log(components.connected(0, 4)); // false
console.log(components.sizeOf(0));       // 3
console.log(components.count());         // 3
```

Indices must be integers in `[0, length)`. `find()` returns `null` for an invalid
index. `union()`, `connected()`, and `sizeOf()` throw `RangeError` because they
cannot produce a meaningful result without valid elements.

### Detect a cycle while adding graph edges

An edge closes a cycle when both endpoints already have the same representative.

```js
import UnionFind from '@rawify/unionfind';

const components = new UnionFind(4);
const edges = [[0, 1], [1, 2], [2, 0]];

for (const [from, to] of edges) {
	if (components.connected(from, to)) {
		console.log(`cycle at ${from}-${to}`); // cycle at 2-0
		break;
	}
	components.union(from, to);
}
```

Union-Find supports edge additions, not deletions. Removing edges requires rebuilding the structure or choosing a dynamic-connectivity algorithm.

### Reuse allocated storage

`reset()` restores every element to a singleton without replacing the backing typed array.

```js
import UnionFind from '@rawify/unionfind';

const components = new UnionFind(3);
components.union(0, 1);
components.reset();

console.log(components.count()); // 3
console.log(components.connected(0, 1)); // false
console.log(components.length); // 3
```

`find()` performs path halving and therefore mutates parent links. `union()` and `reset()` also mutate the instance; query results are numeric representatives or scalar values.

## Basic example

```javascript
const uf = new UnionFind(5);

uf.union(0, 1);
uf.union(3, 4);

console.log(uf.connected(0, 1)); // true
console.log(uf.connected(1, 2)); // false

console.log(uf.sizeOf(0)); // 2
console.log(uf.count());   // 3

uf.union(1, 4);
console.log(uf.connected(0, 3)); // true
```

## Performance Notes

* **Typed arrays** keep memory compact and make `find`/`union` JIT-friendly.
* **Path halving** improves cache locality and minimizes pointer chasing.
* Avoids per-call allocations for maximum throughput in tight loops.
* Use `reset()` to reuse the structure without creating garbage.

## Building the library

The implementation is written in strict TypeScript. The build emits CommonJS,
ES modules, a standalone browser bundle, source maps, and format-specific type
declarations without modifying source or documentation files.

After cloning the Git repository, run:

```
npm install
npm run build
```

## Run a test

Testing the source against the shipped test suite is as easy as:

```
npm run test
```

## Copyright and Licensing

Copyright (c) 2026, [Robert Eisele](https://raw.org/)
Licensed under the MIT license.
