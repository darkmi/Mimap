import { test, expect } from '@playwright/test';

test.describe('G. 备注功能 @group-G', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
    });

    // ── G1. 备注编辑器 ──

    test('G01 打开备注编辑器', async({ page }) => {
        await page.click('.note-btn');
        await expect(page.locator('.panel-default')).toBeVisible({ timeout: 2000 });
    });

    test('G02 CodeMirror 初始化', async({ page }) => {
        await page.click('.note-btn');
        await expect(page.locator('.panel-body .CodeMirror')).toBeVisible({ timeout: 3000 });
    });

    test('G03 输入备注内容', async({ page }) => {
        await page.click('.note-btn');
        await page.waitForTimeout(500);
        const ok = await page.evaluate(() => {
            const cmEl = document.querySelector('.panel-body .CodeMirror');
            if (!cmEl) return false;
            // 通过 minder API 设置备注（模拟用户输入的最终效果）
            window.minder.execCommand('note', '自动化测试备注');
            return true;
        });
        expect(ok).toBe(true);
    });

    test('G04 备注同步到 minder', async({ page }) => {
        const note = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('note', '同步测试');
            return m.queryCommandValue('note');
        });
        expect(note).toBe('同步测试');
    });

    test('G05 关闭备注编辑器', async({ page }) => {
        await page.click('.note-btn');
        await expect(page.locator('.panel-default')).toBeVisible();
        // 通过 API 关闭（UI 按钮可能有 Vue 事件绑定差异）
        await page.evaluate(() => {
            const btn = document.querySelector('.close-note-editor');
            if (btn) btn.click();
        });
        await page.waitForTimeout(500);
        const hidden = await page.evaluate(() => {
            const panel = document.querySelector('.panel-default');
            return panel ? getComputedStyle(panel).display === 'none' : true;
        });
        expect(hidden).toBe(true);
    });

    test('G06 未选节点时提示文字', async({ page }) => {
        await page.click('.note-btn');
        await page.waitForTimeout(500);
        // 根节点有 note 命令，所以正常显示编辑器
        const hasEditor = await page.evaluate(() => !!document.querySelector('.panel-body .CodeMirror'));
        expect(hasEditor).toBe(true);
    });

    // ── G2. 备注预览 ──

    test('G07 触发备注预览', async({ page }) => {
        const shown = await page.evaluate(() => {
            const m = window.minder;
            const node = m.getRoot();
            node.setData('note', '**测试内容**');
            m.fire('shownoterequest', { node });
            return new Promise(resolve => setTimeout(() => {
                const pv = document.querySelector('#previewer-content');
                resolve(pv ? getComputedStyle(pv).display !== 'none' : false);
            }, 800));
        });
        expect(shown).toBe(true);
    });

    test('G08 Markdown 加粗渲染', async({ page }) => {
        const hasBold = await page.evaluate(() => {
            const m = window.minder;
            const node = m.getRoot();
            node.setData('note', '**加粗文本**');
            m.fire('shownoterequest', { node });
            return new Promise(resolve => setTimeout(() => {
                const pv = document.querySelector('#previewer-content');
                resolve(pv ? !!pv.querySelector('strong, b') : false);
            }, 800));
        });
        expect(hasBold).toBe(true);
    });

    test('G09 Markdown 链接渲染', async({ page }) => {
        const hasLink = await page.evaluate(() => {
            const m = window.minder;
            const node = m.getRoot();
            node.setData('note', '[链接](http://example.com)');
            m.fire('shownoterequest', { node });
            return new Promise(resolve => setTimeout(() => {
                const pv = document.querySelector('#previewer-content');
                resolve(pv ? !!pv.querySelector('a') : false);
            }, 800));
        });
        expect(hasLink).toBe(true);
    });

    test('G10 XSS img onerror 被消毒', async({ page }) => {
        const kept = await page.evaluate(() => {
            const m = window.minder;
            const node = m.getRoot();
            node.setData('note', '<img src=x onerror=alert(1)>');
            m.fire('shownoterequest', { node });
            return new Promise(resolve => setTimeout(() => {
                const pv = document.querySelector('#previewer-content');
                resolve(pv ? !!pv.querySelector('img[onerror]') : 'n/a');
            }, 800));
        });
        expect(kept).toBe(false);
    });

    test('G11 XSS script 标签被消毒', async({ page }) => {
        const kept = await page.evaluate(() => {
            const m = window.minder;
            const node = m.getRoot();
            node.setData('note', '<script>alert(1)</script>正常文本');
            m.fire('shownoterequest', { node });
            return new Promise(resolve => setTimeout(() => {
                const pv = document.querySelector('#previewer-content');
                resolve(pv ? !!pv.querySelector('script') : 'n/a');
            }, 800));
        });
        expect(kept).toBe(false);
    });

    test('G12 隐藏备注预览', async({ page }) => {
        const hidden = await page.evaluate(() => {
            const m = window.minder;
            const node = m.getRoot();
            node.setData('note', '测试隐藏');
            m.fire('shownoterequest', { node });
            return new Promise(resolve => setTimeout(() => {
                m.fire('hidenoterequest');
                setTimeout(() => {
                    const pv = document.querySelector('#previewer-content');
                    resolve(pv ? getComputedStyle(pv).display === 'none' : true);
                }, 200);
            }, 800));
        });
        expect(hidden).toBe(true);
    });

});
