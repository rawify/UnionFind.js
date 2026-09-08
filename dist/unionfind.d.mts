/**
 * @license UnionFind.js v0.1.1
 * https://github.com/rawify/UnionFind.js
 *
 * Copyright (c) 2026, Robert Eisele (https://raw.org/)
 * Licensed under the MIT license.
 */
/**
 * Disjoint-set union for the fixed integer domain from 0 through `length - 1`.
 * Uses union by size and path halving.
 */
export declare class UnionFind {
    #private;
    /**
     * Creates a structure containing `size` singleton sets.
     *
     * @throws {RangeError} If `size` is not a non-negative 32-bit integer.
     */
    constructor(size: number);
    /** Number of elements tracked by this structure. */
    get length(): number;
    /**
     * Finds the representative of an element using path halving.
     *
     * @returns The representative, or `null` if `element` is outside the domain.
     */
    find(element: number): number | null;
    /**
     * Merges the sets containing two elements using union by size.
     *
     * @returns `true` if two sets were merged, or `false` if already connected.
     * @throws {RangeError} If either element is outside the domain.
     */
    union(first: number, second: number): boolean;
    /**
     * Tests whether two elements belong to the same set.
     *
     * @throws {RangeError} If either element is outside the domain.
     */
    connected(first: number, second: number): boolean;
    /**
     * Returns the size of the set containing an element.
     *
     * @throws {RangeError} If `element` is outside the domain.
     */
    sizeOf(element: number): number;
    /** Returns the current number of disjoint sets. */
    count(): number;
    /** Restores all elements to singleton sets without reallocating storage. */
    reset(): void;
}
export default UnionFind;
