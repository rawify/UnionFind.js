var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var __privateWrapper = (obj, member, setter, getter) => ({
  set _(value) {
    __privateSet(obj, member, value, setter);
  },
  get _() {
    return __privateGet(obj, member, getter);
  }
});

// src/unionfind.ts
/**
 * @license UnionFind.js v0.1.0
 * https://github.com/rawify/UnionFind.js
 *
 * Copyright (c) 2025, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 */
var _parentsOrSize, _componentCount, _UnionFind_instances, isValidIndex_fn, requireRoot_fn;
var UnionFind = class {
  /**
   * Creates a structure containing `size` singleton sets.
   *
   * @throws {RangeError} If `size` is not a non-negative 32-bit integer.
   */
  constructor(size) {
    __privateAdd(this, _UnionFind_instances);
    __privateAdd(this, _parentsOrSize);
    __privateAdd(this, _componentCount);
    if (!Number.isInteger(size) || size < 0 || size > 4294967295) {
      throw new RangeError("size must be a non-negative 32-bit integer");
    }
    __privateSet(this, _parentsOrSize, new Int32Array(size));
    __privateGet(this, _parentsOrSize).fill(-1);
    __privateSet(this, _componentCount, size);
  }
  /** Number of elements tracked by this structure. */
  get length() {
    return __privateGet(this, _parentsOrSize).length;
  }
  /**
   * Finds the representative of an element using path halving.
   *
   * @returns The representative, or `null` if `element` is outside the domain.
   */
  find(element) {
    if (!__privateMethod(this, _UnionFind_instances, isValidIndex_fn).call(this, element)) {
      return null;
    }
    const parentsOrSize = __privateGet(this, _parentsOrSize);
    let root = element;
    while (parentsOrSize[root] >= 0) {
      const parent = parentsOrSize[root];
      const grandparent = parentsOrSize[parent];
      if (grandparent >= 0) {
        parentsOrSize[root] = grandparent;
      }
      root = parent;
    }
    return root;
  }
  /**
   * Merges the sets containing two elements using union by size.
   *
   * @returns `true` if two sets were merged, or `false` if already connected.
   * @throws {RangeError} If either element is outside the domain.
   */
  union(first, second) {
    let firstRoot = __privateMethod(this, _UnionFind_instances, requireRoot_fn).call(this, first);
    let secondRoot = __privateMethod(this, _UnionFind_instances, requireRoot_fn).call(this, second);
    if (firstRoot === secondRoot) {
      return false;
    }
    const parentsOrSize = __privateGet(this, _parentsOrSize);
    if (parentsOrSize[firstRoot] > parentsOrSize[secondRoot]) {
      [firstRoot, secondRoot] = [secondRoot, firstRoot];
    }
    parentsOrSize[firstRoot] += parentsOrSize[secondRoot];
    parentsOrSize[secondRoot] = firstRoot;
    __privateWrapper(this, _componentCount)._--;
    return true;
  }
  /**
   * Tests whether two elements belong to the same set.
   *
   * @throws {RangeError} If either element is outside the domain.
   */
  connected(first, second) {
    return __privateMethod(this, _UnionFind_instances, requireRoot_fn).call(this, first) === __privateMethod(this, _UnionFind_instances, requireRoot_fn).call(this, second);
  }
  /**
   * Returns the size of the set containing an element.
   *
   * @throws {RangeError} If `element` is outside the domain.
   */
  sizeOf(element) {
    return -__privateGet(this, _parentsOrSize)[__privateMethod(this, _UnionFind_instances, requireRoot_fn).call(this, element)];
  }
  /** Returns the current number of disjoint sets. */
  count() {
    return __privateGet(this, _componentCount);
  }
  /** Restores all elements to singleton sets without reallocating storage. */
  reset() {
    __privateGet(this, _parentsOrSize).fill(-1);
    __privateSet(this, _componentCount, this.length);
  }
};
_parentsOrSize = new WeakMap();
_componentCount = new WeakMap();
_UnionFind_instances = new WeakSet();
isValidIndex_fn = function(element) {
  return Number.isInteger(element) && element >= 0 && element < this.length;
};
requireRoot_fn = function(element) {
  const root = this.find(element);
  if (root === null) {
    throw new RangeError(`element must be an integer between 0 and ${this.length - 1}`);
  }
  return root;
};
var unionfind_default = UnionFind;
export {
  UnionFind,
  unionfind_default as default
};
//# sourceMappingURL=unionfind.mjs.map
