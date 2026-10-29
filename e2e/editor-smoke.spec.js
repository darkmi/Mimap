import { test, expect } from '@playwright/test';

test.describe('KityMinder Editor 冒烟测试', () => {

    test('编辑器初始化', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });

        // 核心状态
        const state = await page.evaluate(() => ({
            hasEditor: !!window.editor,
            rootText: window.minder.getRoot().getText(),
            nodeCount: window.minder.getAllNode().length,
            svgCount: document.querySelectorAll('svg').length
        }));

        expect(state.hasEditor).toBe(true);
        expect(state.rootText).toBe('中心主题');
        expect(state.nodeCount).toBe(1);
        expect(state.svgCount).toBeGreaterThanOrEqual(1);

        // 三页签
        const tabs = page.locator('.nav-tabs li');
        await expect(tabs).toHaveCount(3);
    });

    test('命令系统：插入/编辑/删除', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder);

        const result = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('text', '测试子节点');
            m.execCommand('priority', 2);

            const afterInsert = m.getAllNode().length;
            const text = m.getSelectedNode().getText();
            const priority = m.getSelectedNode().getData('priority');

            m.execCommand('AppendSiblingNode');
            const afterSibling = m.getAllNode().length;

            m.execCommand('removenode');
            const afterDelete = m.getAllNode().length;

            return { afterInsert, text, priority, afterSibling, afterDelete };
        });

        expect(result.afterInsert).toBe(2);
        expect(result.text).toBe('测试子节点');
        expect(result.priority).toBe(2);
        expect(result.afterSibling).toBe(3);
        expect(result.afterDelete).toBe(2);
    });

    test('模板和主题切换', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder);

        // 切到外观页签
        await page.click('.nav-tabs a:has-text("外观")');

        // 模板下拉
        const tempToggle = page.locator('.temp-panel .dropdown-toggle');
        await tempToggle.click();
        await expect(page.locator('.temp-panel .dropdown-menu')).toBeVisible();

        // 主题下拉
        const themeToggle = page.locator('.theme-panel .dropdown-toggle');
        await themeToggle.click();
        await expect(page.locator('.theme-panel .dropdown-menu')).toBeVisible();
    });

    test('超链接弹窗', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder);

        // 点击超链接按钮
        await page.click('.hyperlink');

        // 弹窗应出现
        const modal = page.locator('.km-modal-mask .modal-dialog');
        await expect(modal).toBeVisible({ timeout: 3000 });
        await expect(modal).toContainText('链接');

        // 填写 URL 并确定
        const input = modal.locator('input[type="text"]').first();
        await input.fill('https://example.com');
        await modal.locator('button:has-text("确定")').click();

        // 弹窗关闭，链接已设置
        await expect(modal).toBeHidden({ timeout: 3000 });
        const link = await page.evaluate(() =>
            window.minder.getSelectedNode().getData('hyperlink')
        );
        expect(link).toBe('https://example.com');
    });

    test('备注编辑器（CodeMirror）', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder);

        // 点击备注按钮
        await page.click('.note-btn');

        // CodeMirror 编辑器应出现
        const cm = page.locator('.km-note .CodeMirror, .panel-body .CodeMirror');
        await expect(cm).toBeVisible({ timeout: 3000 });
    });

    test('备注预览 XSS 消毒', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder);

        const result = await page.evaluate(() => {
            const m = window.minder;
            const node = m.getRoot();
            node.setData('note', '**加粗** <img src=x onerror=alert(1)>');
            m.fire('contentchange');
            m.fire('shownoterequest', { node });
            return new Promise(resolve => setTimeout(() => {
                const pv = document.querySelector('#previewer-content');
                resolve({
                    shown: pv ? getComputedStyle(pv).display !== 'none' : false,
                    hasBold: pv ? !!pv.querySelector('strong, b') : false,
                    imgOnerrorKept: pv ? !!pv.querySelector('img[onerror]') : 'n/a'
                });
            }, 800));
        });

        expect(result.hasBold).toBe(true);
        expect(result.imgOnerrorKept).toBe(false); // XSS 被消毒
    });

    test('搜索框', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder);

        // 通过事件触发搜索框
        await page.evaluate(() => window.minder.fire('searchNode'));
        await expect(page.locator('.search-box, #search')).toBeVisible({ timeout: 3000 });
    });

    test('导航器（缩略图）', async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder);

        // 导航器应可见
        const nav = page.locator('.nav-bar');
        await expect(nav).toBeVisible();
        await expect(nav.locator('.zoom-in')).toBeVisible();
        await expect(nav.locator('.zoom-out')).toBeVisible();
        // .nav-previewer 是 .nav-bar 的兄弟元素
        await expect(page.locator('.nav-previewer')).toBeVisible();
    });

});
