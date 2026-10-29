import { describe, it, expect } from 'vitest';
import jsonDiff from '../src/tool/jsondiff.js';

describe('jsonDiff', () => {
    it('returns empty array for identical objects', () => {
        const obj = { a: 1, b: { c: 2 } };
        expect(jsonDiff(obj, { ...obj })).toEqual([]);
    });

    it('detects added property', () => {
        const patches = jsonDiff({ a: 1 }, { a: 1, b: 2 });
        expect(patches).toEqual([{ op: 'add', path: '/b', value: 2 }]);
    });

    it('detects removed property', () => {
        const patches = jsonDiff({ a: 1, b: 2 }, { a: 1 });
        expect(patches).toEqual([{ op: 'remove', path: '/b' }]);
    });

    it('detects replaced value', () => {
        const patches = jsonDiff({ a: 1 }, { a: 2 });
        expect(patches).toEqual([{ op: 'replace', path: '/a', value: 2 }]);
    });

    it('detects nested changes', () => {
        const patches = jsonDiff({ a: { b: 1 } }, { a: { b: 2 } });
        expect(patches).toEqual([{ op: 'replace', path: '/a/b', value: 2 }]);
    });

    it('handles array index changes', () => {
        const patches = jsonDiff({ list: [1, 2, 3] }, { list: [1, 5, 3] });
        expect(patches).toEqual([{ op: 'replace', path: '/list/1', value: 5 }]);
    });

    it('detects multiple changes', () => {
        const patches = jsonDiff({ a: 1, b: 2 }, { a: 3, c: 4 });
        expect(patches).toHaveLength(3);
    });
});
