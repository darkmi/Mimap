import { test, expect } from '@playwright/test';

test.describe('D. 视图页签 @group-D', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
        // 先造一个多层级结构
        await page.evaluate(() => {
            const m = window.minder;
            for (let i = 0; i < 3; i++) {
                m.execCommand('AppendChildNode');
                for (let j = 0; j < 2; j++) m.execCommand('AppendChildNode');
                m.select(m.getRoot(), true);
            }
        });
        // 切到视图页签
        await page.click('.nav-tabs a:has-text("视图")');
    });

    // ── D1. 展开层级 ──

    test('D01 展开下拉可展开', async({ page }) => {
        await page.click('.expand-caption');
        await expect(page.locator('.expand-caption').locator('..').locator('.dropdown-menu')).toBeVisible();
    });

    test('D02 展开全部节点', async({ page }) => {
        const ok = await page.evaluate(() => {
            try { window.minder.execCommand('ExpandToLevel', 9999); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    for (const level of [1, 2, 3, 4, 5, 6]) {
        test(`D0${level + 2} 展开到 ${level} 级`, async({ page }) => {
            const ok = await page.evaluate((lv) => {
                try { window.minder.execCommand('ExpandToLevel', lv); return true; } catch { return false; }
            }, level);
            expect(ok).toBe(true);
        });
    }

    // ── D2. 全选 ──

    test('D09 全选下拉可展开', async({ page }) => {
        await page.click('.select-caption');
        await expect(page.locator('.select-caption').locator('..').locator('.dropdown-menu')).toBeVisible();
    });

    test('D10 全选所有节点', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            const all = [];
            m.getRoot().traverse(n => all.push(n));
            m.select(all, true);
            return m.getSelectedNodes().length === all.length;
        });
        expect(r).toBe(true);
    });

    test('D11 反选', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.select(m.getRoot(), true);
            // 反选
            const selected = m.getSelectedNodes();
            const selection = [];
            m.getRoot().traverse(n => { if (selected.indexOf(n) === -1) selection.push(n); });
            m.select(selection, true);
            return m.getSelectedNodes().length;
        });
        expect(r).toBeGreaterThan(0);
    });

    test('D12 选择兄弟节点', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            const children = m.getRoot().children;
            if (children.length > 1) {
                m.select(children[0], true);
                // 选择兄弟
                const selected = m.getSelectedNodes();
                const selection = [];
                selected.forEach(node => {
                    if (!node.parent) return;
                    node.parent.children.forEach(sib => {
                        if (selection.indexOf(sib) === -1) selection.push(sib);
                    });
                });
                m.select(selection, true);
                return m.getSelectedNodes().length;
            }
            return 0;
        });
        expect(r).toBeGreaterThanOrEqual(2);
    });

    test('D13 选择路径', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            const leaf = m.getAllNode().filter(n => n.children.length === 0)[0];
            if (!leaf) return 0;
            m.select(leaf, true);
            // 选择路径
            const selection = [];
            let node = m.getSelectedNode();
            while (node && selection.indexOf(node) === -1) {
                selection.push(node);
                node = node.parent;
            }
            m.select(selection, true);
            return m.getSelectedNodes().length;
        });
        expect(r).toBeGreaterThanOrEqual(2);
    });

    test('D14 选择子树', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.select(m.getRoot(), true);
            // 选择子树
            const selection = [];
            m.getSelectedNodes().forEach(parent => {
                parent.traverse(n => { if (selection.indexOf(n) === -1) selection.push(n); });
            });
            m.select(selection, true);
            return m.getSelectedNodes().length === m.getAllNode().length;
        });
        expect(r).toBe(true);
    });

    // ── D3. 搜索 ──

    test('D15 搜索按钮唤起搜索框', async({ page }) => {
        await page.click('.search-btn-group button');
        await expect(page.locator('#search, .search-box')).toBeVisible({ timeout: 3000 });
    });

    test('D16 Ctrl+F 唤起搜索框', async({ page }) => {
        await page.keyboard.press('Control+f');
        await expect(page.locator('#search, .search-box')).toBeVisible({ timeout: 3000 });
    });

});
