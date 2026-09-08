/**
 * @license UnionFind.js v0.1.0
 * https://github.com/rawify/UnionFind.js
 *
 * Copyright (c) 2025, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 */

/**
 * Disjoint-set union for the fixed integer domain from 0 through `length - 1`.
 * Uses union by size and path halving.
 */
export class UnionFind {
  readonly #parentsOrSize: Int32Array;
  #componentCount: number;

  /**
   * Creates a structure containing `size` singleton sets.
   *
   * @throws {RangeError} If `size` is not a non-negative 32-bit integer.
   */
  constructor(size: number) {
    if (!Number.isInteger(size) || size < 0 || size > 0xffffffff) {
      throw new RangeError('size must be a non-negative 32-bit integer');
    }

    this.#parentsOrSize = new Int32Array(size);
    this.#parentsOrSize.fill(-1);
    this.#componentCount = size;
  }

  /** Number of elements tracked by this structure. */
  get length(): number {
    return this.#parentsOrSize.length;
  }

  /**
   * Finds the representative of an element using path halving.
   *
   * @returns The representative, or `null` if `element` is outside the domain.
   */
  find(element: number): number | null {
    if (!this.#isValidIndex(element)) {
      return null;
    }

    const parentsOrSize = this.#parentsOrSize;
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
  union(first: number, second: number): boolean {
    let firstRoot = this.#requireRoot(first);
    let secondRoot = this.#requireRoot(second);

    if (firstRoot === secondRoot) {
      return false;
    }

    const parentsOrSize = this.#parentsOrSize;

    if (parentsOrSize[firstRoot] > parentsOrSize[secondRoot]) {
      [firstRoot, secondRoot] = [secondRoot, firstRoot];
    }

    parentsOrSize[firstRoot] += parentsOrSize[secondRoot];
    parentsOrSize[secondRoot] = firstRoot;
    this.#componentCount--;

    return true;
  }

  /**
   * Tests whether two elements belong to the same set.
   *
   * @throws {RangeError} If either element is outside the domain.
   */
  connected(first: number, second: number): boolean {
    return this.#requireRoot(first) === this.#requireRoot(second);
  }

  /**
   * Returns the size of the set containing an element.
   *
   * @throws {RangeError} If `element` is outside the domain.
   */
  sizeOf(element: number): number {
    return -this.#parentsOrSize[this.#requireRoot(element)];
  }

  /** Returns the current number of disjoint sets. */
  count(): number {
    return this.#componentCount;
  }

  /** Restores all elements to singleton sets without reallocating storage. */
  reset(): void {
    this.#parentsOrSize.fill(-1);
    this.#componentCount = this.length;
  }

  #isValidIndex(element: number): boolean {
    return Number.isInteger(element) && element >= 0 && element < this.length;
  }

  #requireRoot(element: number): number {
    const root = this.find(element);

    if (root === null) {
      throw new RangeError(`element must be an integer between 0 and ${this.length - 1}`);
    }

    return root;
  }
}

export default UnionFind;