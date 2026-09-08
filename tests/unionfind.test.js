const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const UnionFind = require('@rawify/unionfind');

describe('UnionFind', () => {
  describe('basic behavior', () => {
    it('constructs with singleton sets', () => {
      const unionFind = new UnionFind(10);

      assert.equal(unionFind.length, 10);
      assert.equal(unionFind.count(), 10);

      for (let index = 0; index < unionFind.length; index++) {
        assert.equal(unionFind.find(index), index);
        assert.equal(unionFind.sizeOf(index), 1);
      }
    });

    it('supports an empty domain', () => {
      const unionFind = new UnionFind(0);

      assert.equal(unionFind.length, 0);
      assert.equal(unionFind.count(), 0);
      assert.equal(unionFind.find(0), null);
    });

    it('unions components by size and tracks connectivity', () => {
      const unionFind = new UnionFind(6);

      assert.equal(unionFind.union(0, 1), true);
      assert.equal(unionFind.union(2, 3), true);
      assert.equal(unionFind.union(4, 5), true);
      assert.equal(unionFind.connected(0, 1), true);
      assert.equal(unionFind.connected(1, 2), false);
      assert.equal(unionFind.sizeOf(0), 2);
      assert.equal(unionFind.count(), 3);

      assert.equal(unionFind.union(1, 2), true);
      assert.equal(unionFind.connected(0, 3), true);
      assert.equal(unionFind.sizeOf(3), 4);
      assert.equal(unionFind.count(), 2);
    });

    it('does not merge an already connected component', () => {
      const unionFind = new UnionFind(4);

      assert.equal(unionFind.union(0, 1), true);
      assert.equal(unionFind.union(1, 0), false);
      assert.equal(unionFind.count(), 3);
    });

    it('resets to singleton sets without changing capacity', () => {
      const unionFind = new UnionFind(5);

      unionFind.union(0, 1);
      unionFind.union(1, 2);
      unionFind.reset();

      assert.equal(unionFind.length, 5);
      assert.equal(unionFind.count(), 5);

      for (let index = 0; index < unionFind.length; index++) {
        assert.equal(unionFind.find(index), index);
        assert.equal(unionFind.sizeOf(index), 1);
      }
    });
  });

  describe('input validation', () => {
    it('rejects invalid domain sizes', () => {
      for (const size of [-1, 3.14, NaN, Infinity]) {
        assert.throws(() => new UnionFind(size), RangeError);
      }
    });

    it('returns null from find for invalid indices', () => {
      const unionFind = new UnionFind(3);

      for (const index of [-1, 3, 1.5, NaN, Infinity]) {
        assert.equal(unionFind.find(index), null);
      }
    });

    it('rejects invalid indices in operations requiring elements', () => {
      const unionFind = new UnionFind(3);

      assert.throws(() => unionFind.union(0, 3), RangeError);
      assert.throws(() => unionFind.connected(-1, 0), RangeError);
      assert.throws(() => unionFind.sizeOf(1.5), RangeError);
      assert.equal(unionFind.count(), 3);
    });
  });

  describe('randomized connectivity', () => {
    function createRandom(seed = 123456789) {
      let state = seed >>> 0;
      return () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0);
    }

    function randomIndex(random, size) {
      return random() % size;
    }

    function buildComponents(size, edges) {
      const adjacency = Array.from({ length: size }, () => []);

      for (const [first, second] of edges) {
        adjacency[first].push(second);
        adjacency[second].push(first);
      }

      const components = new Int32Array(size).fill(-1);
      const queue = [];
      let component = 0;

      for (let start = 0; start < size; start++) {
        if (components[start] !== -1) {
          continue;
        }

        components[start] = component;
        queue.length = 0;
        queue.push(start);

        for (let offset = 0; offset < queue.length; offset++) {
          const current = queue[offset];

          for (const neighbor of adjacency[current]) {
            if (components[neighbor] === -1) {
              components[neighbor] = component;
              queue.push(neighbor);
            }
          }
        }

        component++;
      }

      return components;
    }

    it('matches naive connectivity over deterministic random unions', () => {
      const size = 200;
      const random = createRandom(0xC0FFEE);
      const unionFind = new UnionFind(size);
      const edges = [];

      for (let operation = 0; operation < 1000; operation++) {
        const first = randomIndex(random, size);
        const second = randomIndex(random, size);
        unionFind.union(first, second);
        edges.push([first, second]);
      }

      const components = buildComponents(size, edges);

      for (let sample = 0; sample < 500; sample++) {
        const first = randomIndex(random, size);
        const second = randomIndex(random, size);
        const connected = components[first] === components[second];

        assert.equal(unionFind.connected(first, second), connected);

        if (connected) {
          let componentSize = 0;

          for (const component of components) {
            if (component === components[first]) {
              componentSize++;
            }
          }

          assert.equal(unionFind.sizeOf(first), componentSize);
        }
      }
    });
  });

  describe('module exports', () => {
    it('keeps CommonJS default and named exports identical', () => {
      assert.equal(UnionFind.default, UnionFind);
      assert.equal(UnionFind.UnionFind, UnionFind);
    });
  });
});