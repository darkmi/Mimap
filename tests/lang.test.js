import { describe, it, expect } from 'vitest';
import { t, zhCnLang } from '../vueui/lang.js';

describe('lang', () => {
    it('resolves top-level keys from dictionary', () => {
        expect(zhCnLang.maintopic).toBe('中心主题');
        expect(zhCnLang.topic).toBe('分支主题');
    });

    it('resolves nested key with slash path', () => {
        expect(t('ui/command', 'appendchildnode')).toBe('插入下级主题');
        expect(t('ui/command', 'removenode')).toBe('删除');
    });

    it('resolves template names', () => {
        expect(t('template', 'default')).toBe('思维导图');
        expect(t('template', 'fish-bone')).toBe('鱼骨头图');
    });

    it('resolves theme names', () => {
        expect(t('theme', 'classic')).toBe('脑图经典');
        expect(t('theme', 'fresh-blue')).toBe('天空蓝');
    });

    it('returns key itself when not found', () => {
        expect(t('lang', 'nonexistent')).toBe('nonexistent');
        expect(t('ui/command', 'nonexistent')).toBe('nonexistent');
    });

    it('returns key itself for invalid block', () => {
        expect(t('invalid/block', 'somekey')).toBe('somekey');
    });

    it('zhCnLang is a complete dictionary', () => {
        expect(zhCnLang).toHaveProperty('ui');
        expect(zhCnLang).toHaveProperty('template');
        expect(zhCnLang).toHaveProperty('theme');
        expect(zhCnLang.ui).toHaveProperty('command');
        expect(zhCnLang.ui.command).toHaveProperty('appendchildnode');
    });
});
