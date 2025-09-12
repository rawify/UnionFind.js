# UnionFind.js

[![NPM Package](https://img.shields.io/npm/v/@rawify/unionfind.svg?style=flat)](https://www.npmjs.com/package/@rawify/unionfind "View this project on npm")
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

UnionFind.js is a optimized implementation of the [Union–Find (Disjoint Set Union)](https://en.wikipedia.org/wiki/Disjoint-set_data_structure) data structure for JavaScript.  
It supports *union by size* and *path halving* for near-constant-time performance in practical use cases.

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

In Node.js:

```javascript
const UnionFind = require('@rawify/unionfind');
```

Or ES modules:

```javascript
import UnionFind from '@rawify/unionfind';
```

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

## Example

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

## Coding Style

Like all my libraries, UnionFind.js is written to minimize size after compression with Google Closure Compiler in advanced mode. The code style is optimized to maximize compressibility. If you extend the library, please preserve this style.

## Building the library

After cloning the Git repository run:

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

Copyright (c) 2025, [Robert Eisele](https://raw.org/)
Licensed under the MIT license.
