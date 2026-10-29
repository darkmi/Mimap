import { describe, it, expect, vi } from 'vitest';
import config from '../vueui/config.js';

describe('config', () => {
    it('returns full config with no args', () => {
        const all = config.get();
        expect(all).toHaveProperty('zoom');
        expect(all).toHaveProperty('defaultLang');
    });

    it('returns single value by key', () => {
        expect(config.get('defaultLang')).toBe('zh-cn');
        expect(Array.isArray(config.get('zoom'))).toBe(true);
    });

    it('returns empty string for missing key', () => {
        expect(config.get('nonexistent')).toBe('');
    });

    it('sets single key', () => {
        const orig = config.get('defaultLang');
        config.set('defaultLang', 'en');
        expect(config.get('defaultLang')).toBe('en');
        config.set('defaultLang', orig); // restore
    });

    it('rejects unsupported keys', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(config.set('badKey', 'value')).toBe(false);
        spy.mockRestore();
    });

    it('sets multiple keys from object', () => {
        const orig = config.get('imageUpload');
        config.set({ imageUpload: '/api/upload' });
        expect(config.get('imageUpload')).toBe('/api/upload');
        config.set({ imageUpload: orig }); // restore
    });
});
