import { test, expect } from '@playwright/test';

test.describe('C. 外观页签 @group-C', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
        // 切到外观页签
        await page.click('.nav-tabs a:has-text("外观")');
    });

    // ── C1. 模板 ──

    test('C01 模板下拉可展开', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await expect(page.locator('.temp-panel .dropdown-menu')).toBeVisible();
    });

    test('C02 下拉包含 6 种模板', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await expect(page.locator('.temp-panel .dropdown-menu li')).toHaveCount(6);
    });

    test('C03 切换到"思维导图"', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await page.click('.temp-panel .dropdown-menu a[title="思维导图"]');
        const val = await page.evaluate(() => window.minder.queryCommandValue('template'));
        expect(val).toBe('default');
    });

    test('C04 切换到"组织结构图"', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await page.click('.temp-panel .dropdown-menu a[title="组织结构图"]');
        const val = await page.evaluate(() => window.minder.queryCommandValue('template'));
        expect(val).toBe('structure');
    });

    test('C05 切换到"目录组织图"', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await page.click('.temp-panel .dropdown-menu a[title="目录组织图"]');
        const val = await page.evaluate(() => window.minder.queryCommandValue('template'));
        expect(val).toBe('filetree');
    });

    test('C06 切换到"逻辑结构图"', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await page.click('.temp-panel .dropdown-menu a[title="逻辑结构图"]');
        const val = await page.evaluate(() => window.minder.queryCommandValue('template'));
        expect(val).toBe('right');
    });

    test('C07 切换到"鱼骨头图"', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await page.click('.temp-panel .dropdown-menu a[title="鱼骨头图"]');
        const val = await page.evaluate(() => window.minder.queryCommandValue('template'));
        expect(val).toBe('fish-bone');
    });

    test('C08 当前模板高亮选中', async({ page }) => {
        await page.click('.temp-panel .dropdown-toggle');
        await page.click('.temp-panel .dropdown-menu a[title="鱼骨头图"]');
        await page.waitForTimeout(300);
        await page.click('.temp-panel .dropdown-toggle');
        const hasSelected = await page.evaluate(() =>
            !!document.querySelector('.temp-panel .temp-item-selected')
        );
        expect(hasSelected).toBe(true);
    });

    // ── C2. 主题 ──

    test('C09 主题下拉可展开', async({ page }) => {
        await page.click('.theme-panel .dropdown-toggle');
        await expect(page.locator('.theme-panel .dropdown-menu')).toBeVisible();
    });

    test('C10 下拉包含 20 种主题', async({ page }) => {
        await page.click('.theme-panel .dropdown-toggle');
        await expect(page.locator('.theme-panel .dropdown-menu li')).toHaveCount(20);
    });

    // 主题通过 API 直接切换（UI 下拉的 title 是中文名）
    for (const [num, theme, label] of [
        ['C11', 'classic', '脑图经典'], ['C12', 'fresh-blue', '天空蓝'], ['C13', 'fresh-green', '文艺绿'],
        ['C14', 'fresh-red', '清新红'], ['C15', 'tianpan', '经典天盘'], ['C16', 'snow', '温柔冷光']
    ]) {
        test(`${num} 切换到主题"${label}"`, async({ page }) => {
            const val = await page.evaluate((t) => {
                window.minder.execCommand('theme', t);
                return window.minder.queryCommandValue('theme');
            }, theme);
            expect(val).toBe(theme);
        });
    }

    // ── C3. 布局与样式 ──

    test('C17 整理布局按钮可点击', async({ page }) => {
        const ok = await page.evaluate(() => {
            try { window.minder.execCommand('resetlayout'); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    test('C18 清除样式按钮', async({ page }) => {
        const ok = await page.evaluate(() => {
            try { window.minder.execCommand('clearstyle'); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    test('C19 复制样式按钮', async({ page }) => {
        const ok = await page.evaluate(() => {
            try { window.minder.execCommand('copystyle'); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    test('C20 粘贴样式按钮', async({ page }) => {
        const ok = await page.evaluate(() => {
            window.minder.execCommand('copystyle');
            try { window.minder.execCommand('pastestyle'); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    test('C21 样式按钮状态验证', async({ page }) => {
        const state = await page.evaluate(() => window.minder.queryCommandState('clearstyle'));
        expect(typeof state).toBe('number');
    });

    test('C22 整理布局后无异常', async({ page }) => {
        const ok = await page.evaluate(() => {
            window.minder.execCommand('AppendChildNode');
            window.minder.execCommand('AppendChildNode');
            try { window.minder.execCommand('resetlayout'); return true; } catch { return false; }
        });
        expect(ok).toBe(true);
    });

    // ── C4. 字体与颜色 ──

    test('C23 字体族下拉展开', async({ page }) => {
        await page.click('.font-family-list .dropdown-toggle');
        await expect(page.locator('.font-family-list .dropdown-menu')).toBeVisible();
    });

    test('C24 字体族列表 12 项', async({ page }) => {
        await page.click('.font-family-list .dropdown-toggle');
        await expect(page.locator('.font-family-list .dropdown-menu li')).toHaveCount(12);
    });

    test('C25 字号下拉展开', async({ page }) => {
        await page.click('.font-size-list .dropdown-toggle');
        await expect(page.locator('.font-size-list .dropdown-menu')).toBeVisible();
    });

    test('C26 加粗切换', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('bold');
            const afterBold = m.queryCommandState('bold');
            m.execCommand('bold');
            const afterUnbold = m.queryCommandState('bold');
            return { afterBold, afterUnbold };
        });
        expect(r.afterBold).toBe(1);
        expect(r.afterUnbold).not.toBe(1);
    });

    test('C27 前景色取色器', async({ page }) => {
        await page.click('.font-color-wrap .font-color');
        await expect(page.locator('.km-color-picker')).toBeVisible();
    });

    test('C28 背景色取色器', async({ page }) => {
        await page.click('.bg-color-wrap .bg-color');
        await expect(page.locator('.km-color-picker')).toBeVisible();
    });

});
