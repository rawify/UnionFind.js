/**
 * Fast Union–Find / Disjoint Set Union for indices 0..n-1.
 *
 * Internal representation (not exposed):
 * - Int32Array where a[i] < 0 ⇒ i is a root and size = -a[i]
 * - a[i] >= 0 ⇒ parent index of i
 */
declare class UnionFind {
    /**
     * Create a UnionFind for elements 0..n-1.
     * @throws RangeError if n is not a non-negative integer.
     */
    constructor(n: number);

    /**
     * Find the representative of x with path-halving.
     * Amortized inverse-Ackermann time.
     *
     * NOTE: The current JS implementation returns `null` if `x` is out of bounds.
     * Consumers should guard inputs accordingly.
     *
     * @param x Element index.
     * @returns Root representative index, or `null` if x is out of bounds.
     */
    find(x: number): number | null;

    /**
     * Union the sets containing x and y.
     * Uses union-by-size; returns false if already connected.
     *
     * @param x Element index.
     * @param y Element index.
     * @returns `true` if a merge occurred, `false` if already same set.
     */
    union(x: number, y: number): boolean;

    /**
     * Whether x and y are in the same set.
     */
    connected(x: number, y: number): boolean;

    /**
     * Size of the set containing x.
     * @param x Element index.
     */
    sizeOf(x: number): number;

    /**
     * Number of current disjoint sets.
     */
    count(): number;

    /**
     * Reset to all singletons without reallocating.
     */
    reset(): void;

    /**
     * Number of elements tracked (capacity).
     */
    readonly length: number;
}

export default UnionFind;
export { UnionFind };