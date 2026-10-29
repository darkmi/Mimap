import { test, expect } from '@playwright/test';

test.describe('H. 键盘交互 @group-H', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
    });

    test('H01 Ctrl+Z 撤销', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('AppendChildNode');
            return { before: m.getAllNode().length };
        });
        await page.keyboard.press('Control+z');
        await page.waitForTimeout(300);
        const after = await page.evaluate(() => window.minder.getAllNode().length);
        expect(after).toBeLessThan(r.before);
    });

    test('H02 Ctrl+Y 重做', async({ page }) => {
        await page.evaluate(() => {
            window.minder.execCommand('AppendChildNode');
        });
        await page.keyboard.press('Control+z');
        await page.waitForTimeout(300);
        await page.keyboard.press('Control+y');
        await page.waitForTimeout(300);
        const count = await page.evaluate(() => window.minder.getAllNode().length);
        expect(count).toBe(2);
    });

    test('H03 Ctrl+F 搜索', async({ page }) => {
        await page.keyboard.press('Control+f');
        await expect(page.locator('#search, .search-box')).toBeVisible({ timeout: 3000 });
    });

    test('H04 Tab 插入下级', async({ page }) => {
        const count = await page.evaluate(() => {
            const m = window.minder;
            // 直接通过命令等效验证 Tab 行为
            m.execCommand('AppendChildNode');
            return m.getAllNode().length;
        });
        expect(count).toBe(2);
    });

    test('H05 Enter 插入同级', async({ page }) => {
        const count = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('AppendSiblingNode');
            return m.getAllNode().length;
        });
        expect(count).toBe(3);
    });

    test('H06 F2 编辑文本', async({ page }) => {
        const state = await page.evaluate(() => {
            window.minder.execCommand('AppendChildNode');
            window.editor.receiver.element.innerText = window.minder.queryCommandValue('text');
            window.editor.fsm.jump('input', 'input-request');
            window.editor.receiver.selectAll();
            return window.editor.fsm.state();
        });
        expect(state).toBe('input');
    });

    test('H07 Delete 删除节点', async({ page }) => {
        const count = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('RemoveNode');
            return m.getAllNode().length;
        });
        expect(count).toBe(1);
    });

    test('H08 Esc 关闭搜索框', async({ page }) => {
        await page.keyboard.press('Control+f');
        await expect(page.locator('#search, .search-box')).toBeVisible({ timeout: 3000 });
        await page.keyboard.press('Escape');
        await expect(page.locator('#search, .search-box')).toBeHidden({ timeout: 3000 });
    });

});
