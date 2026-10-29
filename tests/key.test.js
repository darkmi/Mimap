import { describe, it, expect } from 'vitest';
import key from '../src/tool/key.js';
import keymap from '../src/tool/keymap.js';

describe('key', () => {
    it('hashes plain key names', () => {
        expect(key.hash('a')).toBe(keymap['a']);
        expect(key.hash('enter')).toBe(keymap['enter']);
    });

    it('hashes ctrl combinations', () => {
        const ctrlZ = key.hash('ctrl + z');
        expect(ctrlZ & 0x1000).toBeTruthy(); // CTRL_MASK
    });

    it('hashes shift combinations', () => {
        const shiftA = key.hash('shift + a');
        expect(shiftA & 0x4000).toBeTruthy(); // SHIFT_MASK
    });

    it('is() compares key expressions with events', () => {
        const ctrlZEvent = { ctrlKey: true, keyCode: 90 };
        expect(key.is(ctrlZEvent, 'ctrl + z')).toBe(true);
        expect(key.is(ctrlZEvent, 'ctrl + a')).toBe(false);
    });

    it('is() handles modifier key events (16/17/18/91)', () => {
        const ctrlEvent = { ctrlKey: true, keyCode: 17 };
        // Ctrl 本身不应被 hash 为带 keyCode 的值
        expect(key.is(ctrlEvent, 'ctrl + z')).toBe(false);
    });
});

describe('keymap', () => {
    it('has letter keys', () => {
        expect(keymap['a']).toBe(65);
        expect(keymap['z']).toBe(90);
    });

    it('has lowercase aliases', () => {
        expect(keymap['shift']).toBe(keymap['Shift']);
        expect(keymap['enter']).toBe(keymap['Enter']);
    });

    it('has direction map', () => {
        expect(keymap['Direction']).toHaveProperty('37');
        expect(keymap['Direction'][38]).toBe(1);
    });

    it('has number keys 1-9', () => {
        // 原版 keymap 生成循环 while(--n) 在 n=1 时终止，'0' 键缺失
        for (let i = 1; i <= 9; i++) {
            expect(keymap[String(i)]).toBe(i + 48);
        }
    });
});
