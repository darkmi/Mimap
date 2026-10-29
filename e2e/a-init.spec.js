import { test, expect } from '@playwright/test';

test.describe('A. 编辑器初始化与基本状态 @group-A', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
    });

    test('A01 页面加载后编辑器初始化', async({ page }) => {
        const state = await page.evaluate(() => ({
            hasEditor: !!window.editor,
            hasMinder: !!window.minder
        }));
        expect(state.hasEditor).toBe(true);
        expect(state.hasMinder).toBe(true);
    });

    test('A02 根节点默认文本为"中心主题"', async({ page }) => {
        const text = await page.evaluate(() => window.minder.getRoot().getText());
        expect(text).toBe('中心主题');
    });

    test('A03 初始节点数量为 1', async({ page }) => {
        const count = await page.evaluate(() => window.minder.getAllNode().length);
        expect(count).toBe(1);
    });

    test('A04 SVG 画布渲染', async({ page }) => {
        const svgCount = await page.evaluate(() => document.querySelectorAll('svg').length);
        expect(svgCount).toBeGreaterThanOrEqual(1);
    });

    test('A05 顶部三页签渲染', async({ page }) => {
        const tabs = page.locator('.nav-tabs li');
        await expect(tabs).toHaveCount(3);
    });

    test('A06 思路页签工具栏按钮渲染', async({ page }) => {
        // 思路页签下的关键按钮
        await expect(page.locator('.undo')).toBeVisible();
        await expect(page.locator('.redo')).toBeVisible();
        await expect(page.locator('.append-child-node')).toBeVisible();
        await expect(page.locator('.append-sibling-node')).toBeVisible();
        await expect(page.locator('.edit-node')).toBeVisible();
        await expect(page.locator('.remove-node')).toBeVisible();
    });

    test('A07 导航器渲染', async({ page }) => {
        await expect(page.locator('.nav-bar')).toBeVisible();
        await expect(page.locator('.nav-bar .zoom-in')).toBeVisible();
        await expect(page.locator('.nav-bar .zoom-out')).toBeVisible();
        await expect(page.locator('.nav-previewer')).toBeVisible();
    });

    test('A08 页面无 JS 报错', async({ page }) => {
        const errors = await page.evaluate(() => window.__bootErrors || []);
        expect(errors).toHaveLength(0);
    });

});
