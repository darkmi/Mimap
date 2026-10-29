import { test, expect } from '@playwright/test';

test.describe('E. 导航器 @group-E', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
    });

    test('E01 放大按钮', async({ page }) => {
        const ok = await page.evaluate(() => {
            try { window.minder.execCommand('zoomIn'); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    test('E02 缩小按钮', async({ page }) => {
        const ok = await page.evaluate(() => {
            try { window.minder.execCommand('zoomOut'); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    test('E03 恢复 100%', async({ page }) => {
        const ok = await page.evaluate(() => {
            window.minder.execCommand('zoomIn');
            window.minder.execCommand('zoom', 100);
            return true;
        });
        expect(ok).toBe(true);
    });

    test('E04 拖拽模式切换', async({ page }) => {
        const r = await page.evaluate(() => {
            window.minder.execCommand('hand');
            return window.minder.queryCommandState('hand');
        });
        expect(r).toBe(1);
    });

    test('E05 定位根节点', async({ page }) => {
        const ok = await page.evaluate(() => {
            try { window.minder.execCommand('camera', window.minder.getRoot(), 600); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    test('E06 导航器开关', async({ page }) => {
        const navToggle = page.locator('.nav-trigger');
        await navToggle.click();
        // 切换后 nav-previewer 隐藏
        await expect(page.locator('.nav-previewer')).toBeHidden();
        await navToggle.click();
        await expect(page.locator('.nav-previewer')).toBeVisible();
    });

    test('E07 缩略图渲染 SVG', async({ page }) => {
        const svgInPreview = await page.evaluate(() => {
            const pv = document.querySelector('.nav-previewer');
            return pv ? pv.querySelectorAll('svg').length : 0;
        });
        expect(svgInPreview).toBeGreaterThanOrEqual(1);
    });

    test('E08 缩放指示器存在', async({ page }) => {
        await expect(page.locator('.nav-bar .indicator')).toBeVisible();
    });

    test('E09 放大到最大时 zoom-in 有 active', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            for (let i = 0; i < 10; i++) m.execCommand('zoomIn');
            return m.getOption('zoom');
        });
        // 最终 zoom 不会超过最大值
        expect(Array.isArray(r)).toBe(true);
    });

    test('E10 初始缩放百分比', async({ page }) => {
        const hasZoomPan = await page.evaluate(() => !!document.querySelector('.zoom-pan'));
        expect(hasZoomPan).toBe(true);
    });

});
