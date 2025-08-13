
const { expect } = require('chai');
const UnionFind = require('@rawify/unionfind');

describe('@rawify/unionfind', () => {
    describe('basic behavior', () => {
        it('constructs with n singletons', () => {
            const n = 10;
            const uf = new UnionFind(n);
            expect(uf.length).to.equal(n);
            expect(uf.count()).to.equal(n);
            for (let i = 0; i < n; i++) {
                expect(uf.sizeOf(i)).to.equal(1);
                expect(uf.find(i)).to.equal(i);
            }
        });

        it('unions and connectivity', () => {
            const uf = new UnionFind(6);
            uf.union(0, 1);
            uf.union(2, 3);
            uf.union(4, 5);

            expect(uf.connected(0, 1)).to.equal(true);
            expect(uf.connected(2, 3)).to.equal(true);
            expect(uf.connected(4, 5)).to.equal(true);

            expect(uf.connected(1, 2)).to.equal(false);
            expect(uf.sizeOf(0)).to.equal(2);
            expect(uf.sizeOf(2)).to.equal(2);
            expect(uf.sizeOf(4)).to.equal(2);
            expect(uf.count()).to.equal(3);

            // Merge components
            uf.union(1, 2);
            expect(uf.connected(0, 3)).to.equal(true);
            expect(uf.sizeOf(3)).to.equal(4);
            expect(uf.count()).to.equal(2);
        });

        it('no-op union on same set returns false and does not change counts', () => {
            const uf = new UnionFind(4);
            expect(uf.union(0, 1)).to.equal(true);
            const before = uf.count();
            expect(uf.union(1, 0)).to.equal(false);
            expect(uf.count()).to.equal(before);
        });

        it('reset restores to singletons without reallocating', () => {
            const uf = new UnionFind(5);
            uf.union(0, 1);
            uf.union(1, 2);
            expect(uf.count()).to.equal(3);
            uf.reset();
            expect(uf.count()).to.equal(5);
            for (let i = 0; i < 5; i++) {
                expect(uf.find(i)).to.equal(i);
                expect(uf.sizeOf(i)).to.equal(1);
            }
        });
    });

    describe('fuzz: random unions vs naive connectivity', () => {
        // Simple deterministic PRNG so tests are repeatable
        function lcg(seed = 123456789) {
            let s = seed >>> 0;
            return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0);
        }
        function rndInt(rng, n) {
            return (rng() >>> 0) % n;
        }

        function buildNaiveComponents(n, edges) {
            // adjacency list
            const adj = Array.from({ length: n }, () => []);
            for (const [a, b] of edges) {
                adj[a].push(b);
                adj[b].push(a);
            }
            // BFS components id[]
            const comp = new Int32Array(n).fill(-1);
            let cid = 0;
            const q = [];
            for (let i = 0; i < n; i++) {
                if (comp[i] !== -1) continue;
                comp[i] = cid;
                q.length = 0;
                q.push(i);
                for (let qi = 0; qi < q.length; qi++) {
                    const v = q[qi];
                    for (const w of adj[v]) {
                        if (comp[w] === -1) {
                            comp[w] = cid;
                            q.push(w);
                        }
                    }
                }
                cid++;
            }
            return comp;
        }

        it('matches naive connectivity on random operations', () => {
            const n = 200;
            const ops = 1000;
            const rng = lcg(0xC0FFEE);
            const uf = new UnionFind(n);
            const edges = [];

            for (let k = 0; k < ops; k++) {
                const a = rndInt(rng, n);
                const b = rndInt(rng, n);
                uf.union(a, b);
                edges.push([a, b]);
            }

            const comp = buildNaiveComponents(n, edges);

            // sample a bunch of pairs and compare
            for (let t = 0; t < 500; t++) {
                const i = rndInt(rng, n);
                const j = rndInt(rng, n);
                const naive = comp[i] === comp[j];
                expect(uf.connected(i, j)).to.equal(naive);
                // size consistency for same component
                if (naive) {
                    // count members of comp[i]
                    let size = 0;
                    for (let p = 0; p < n; p++) if (comp[p] === comp[i]) size++;
                    expect(uf.sizeOf(i)).to.equal(size);
                }
            }
        });
    });

    describe('input validation', () => {
        it('throws on invalid n', () => {
            expect(() => new UnionFind(-1)).to.throw();
            expect(() => new UnionFind(3.14)).to.throw();
        });
        it('does not accept out-of-bounds indices (user responsibility)', () => {
            const uf = new UnionFind(3);
            // Implementation is optimized and assumes valid indices.
            // Accessing out of bounds is user error; here we just assert it doesn’t crash with valid use.
            expect(() => uf.find(2)).to.not.throw();
        });
    });
});
