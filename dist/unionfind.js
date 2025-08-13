'use strict';

/**
 * Fast Union-Find for 0..n-1
 * Prototyped version; all members accessed via bracket notation for Closure.
 */
function UnionFind(n) {
    if (n >>> 0 !== n) throw new RangeError("n must be a non-negative integer");

    // parentsOrSize[i] < 0  => i is root, size = -parentsOrSize[i]
    // parentsOrSize[i] >= 0 => parent index
    const a = new Int32Array(n);
    for (let i = 0; i < n; i++) a[i] = -1;

    this['_'] = a;
    this['_count'] = n; // number of disjoint sets
    // if (!(this instanceof UnionFind)) return new UnionFind(n);
}

UnionFind.prototype = {
    'constructor': UnionFind,

    /**
     * Find representative of x with path halving.
     * Amortized ~α(N).
     * @param {number} x
     * @returns {number|null} root of x or null if out of bounds
     */
    'find': function (x) {
        const a = this['_'];
        if (x > a.length) return null;
        // Climb until we hit a root (negative value).
        while (a[x] >= 0) {
            const px = a[x];
            const ppx = a[px];
            // Path halving: point x directly to grandparent when possible.
            if (ppx >= 0) a[x] = ppx;
            x = px;
        }
        return x;
    },

    /**
     * Union sets of x and y. Returns true if merged, false if already same set.
     * @param {number} x
     * @param {number} y
     */
    'union': function (x, y) {
        let rx = this['find'](x);
        let ry = this['find'](y);
        if (rx === ry) return false;

        const a = this['_'];
        // a[root] is negative size; larger size => more negative.
        // Ensure rx is the larger (more negative) root.
        if (a[rx] > a[ry]) { const t = rx; rx = ry; ry = t; }

        // Merge ry under rx
        a[rx] += a[ry];   // sizes add (remember: negative)
        a[ry] = rx;       // parent pointer
        this['_count']--;
        return true;
    },

    /**
     * Whether x and y are in the same set.
     * @param {number} x
     * @param {number} y
     */
    'connected': function (x, y) {
        return this['find'](x) === this['find'](y);
    },

    /**
     * Size of the set containing x.
     * @param {number} x
     * @returns {number}
     */
    'sizeOf': function (x) {
        const r = this['find'](x);
        return -this['_'][r];
    },

    /**
     * Number of current disjoint sets.
     */
    'count': function () {
        return this['_count'];
    },

    /**
     * Reset to all singletons without reallocating.
     */
    'reset': function () {
        const a = this['_'];
        for (let i = 0; i < a.length; i++) a[i] = -1;
        this['_count'] = a.length;
    }
};

// Getter: length (number of elements tracked)
Object.defineProperty(UnionFind.prototype, 'length', {
    'configurable': true,
    'enumerable': false,
    'get': function () {
        return this['_'].length;
    }
});

Object.defineProperty(UnionFind, "__esModule", { 'value': true });
UnionFind['default'] = UnionFind;
UnionFind['UnionFind'] = UnionFind;
module['exports'] = UnionFind;
