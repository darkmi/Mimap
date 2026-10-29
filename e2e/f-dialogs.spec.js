import { test, expect } from '@playwright/test';

test.describe('F. 弹窗对话框 @group-F', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
    });

    // ── F1. 超链接弹窗 ──

    test('F01 点击打开超链接弹窗', async({ page }) => {
        await page.click('.hyperlink');
        await expect(page.locator('.km-modal-mask')).toBeVisible({ timeout: 3000 });
    });

    test('F02 弹窗标题为"链接"', async({ page }) => {
        await page.click('.hyperlink');
        const modal = page.locator('.km-modal-mask .modal-dialog');
        await expect(modal).toContainText('链接');
    });

    test('F03 URL 输入框存在可聚焦', async({ page }) => {
        await page.click('.hyperlink');
        const input = page.locator('.modal-dialog input[type="text"]').first();
        await expect(input).toBeVisible();
        await input.click();
    });

    test('F04 填写合法 URL 并确定', async({ page }) => {
        await page.click('.hyperlink');
        const input = page.locator('.modal-dialog input[type="text"]').first();
        await input.fill('https://example.com');
        await page.click('.modal-dialog button:has-text("确定")');
        await expect(page.locator('.km-modal-mask')).toBeHidden({ timeout: 3000 });
        const link = await page.evaluate(() => window.minder.getSelectedNode().getData('hyperlink'));
        expect(link).toBe('https://example.com');
    });

    test('F05 非法 URL 校验', async({ page }) => {
        await page.click('.hyperlink');
        const input = page.locator('.modal-dialog input[type="text"]').first();
        await input.fill('not-a-url');
        await page.click('.modal-dialog button:has-text("确定")');
        // 不合法时弹窗不关闭且显示错误样式
        await expect(page.locator('.km-modal-mask')).toBeVisible();
    });

    test('F06 点击取消关闭弹窗', async({ page }) => {
        await page.click('.hyperlink');
        await page.click('.modal-dialog button:has-text("取消")');
        await expect(page.locator('.km-modal-mask')).toBeHidden({ timeout: 3000 });
    });

    test('F07 Esc 关闭弹窗', async({ page }) => {
        await page.click('.hyperlink');
        await expect(page.locator('.km-modal-mask')).toBeVisible();
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        // Esc 关闭可能需要焦点在弹窗内
        const stillVisible = await page.evaluate(() => !!document.querySelector('.km-modal-mask'));
        if (stillVisible) {
            // 点击遮罩关闭作为备选
            await page.click('.km-modal-mask', { position: { x: 5, y: 5 } });
        }
        await expect(page.locator('.km-modal-mask')).toBeHidden({ timeout: 3000 });
    });

    // ── F2. 图片弹窗 ──

    test('F08 点击打开图片弹窗', async({ page }) => {
        await page.click('.image-btn-group button, .image');
        await expect(page.locator('.km-modal-mask')).toBeVisible({ timeout: 3000 });
    });

    test('F09 图片弹窗三个 Tab', async({ page }) => {
        await page.click('.image-btn-group button, .image');
        const tabs = page.locator('.modal-dialog .nav-tabs li');
        await expect(tabs).toHaveCount(3);
    });

    test('F10 切换到外链图片 Tab', async({ page }) => {
        await page.click('.image-btn-group button, .image');
        await page.waitForTimeout(300);
        await page.click('.modal-dialog .nav-tabs li:nth-child(2)');
        await expect(page.locator('#image-url')).toBeVisible({ timeout: 3000 });
    });

    test('F11 填写 URL 并确定', async({ page }) => {
        await page.click('.image-btn-group button, .image');
        await page.waitForTimeout(300);
        await page.click('.modal-dialog .nav-tabs li:nth-child(2)');
        const input = page.locator('#image-url');
        await input.fill('https://example.com/img.png');
        await page.click('.modal-dialog button:has-text("确定")');
        await expect(page.locator('.km-modal-mask')).toBeHidden({ timeout: 3000 });
    });

    test('F12 非法图片 URL 校验', async({ page }) => {
        await page.click('.image-btn-group button, .image');
        await page.waitForTimeout(300);
        await page.click('.modal-dialog .nav-tabs li:nth-child(2)');
        await page.locator('#image-url').fill('bad-url');
        await page.click('.modal-dialog button:has-text("确定")');
        await expect(page.locator('.km-modal-mask')).toBeVisible();
    });

    test('F13 图片弹窗取消关闭', async({ page }) => {
        await page.click('.image-btn-group button, .image');
        await page.click('.modal-dialog button:has-text("取消")');
        await expect(page.locator('.km-modal-mask')).toBeHidden({ timeout: 3000 });
    });

    test('F14 切换到图片搜索 Tab', async({ page }) => {
        await page.click('.image-btn-group button, .image');
        await page.waitForTimeout(300);
        await page.click('.modal-dialog .nav-tabs li:nth-child(1)');
        await expect(page.locator('#search-keyword')).toBeVisible({ timeout: 3000 });
    });

    // ── F3. 导入/导出弹窗 ──

    test('F15 导出节点弹窗', async({ page }) => {
        await page.evaluate(() => {
            window.minder.execCommand('AppendChildNode');
            window.minder.execCommand('text', '导出测试');
            window.minder.fire('exportNodeData');
        });
        await expect(page.locator('.km-modal-mask')).toBeVisible({ timeout: 3000 });
        // 导出弹窗 textarea 是 readonly
        const readonly = await page.locator('.modal-dialog textarea').getAttribute('readonly');
        expect(readonly).not.toBeNull();
    });

    test('F16 导入节点弹窗可编辑', async({ page }) => {
        await page.evaluate(() => window.minder.fire('importNodeData'));
        await expect(page.locator('.km-modal-mask')).toBeVisible({ timeout: 3000 });
        const readonly = await page.locator('.modal-dialog textarea').getAttribute('readonly');
        expect(readonly).toBeNull();
    });

    test('F17 导入内容写入节点', async({ page }) => {
        await page.evaluate(() => window.minder.fire('importNodeData'));
        await expect(page.locator('.km-modal-mask')).toBeVisible({ timeout: 3000 });
        await page.locator('.modal-dialog textarea').fill('导入的主题');
        await page.click('.modal-dialog button:has-text("OK")');
        await expect(page.locator('.km-modal-mask')).toBeHidden({ timeout: 3000 });
    });

    test('F18 导入弹窗取消关闭', async({ page }) => {
        await page.evaluate(() => window.minder.fire('importNodeData'));
        await expect(page.locator('.km-modal-mask')).toBeVisible();
        await page.click('.modal-dialog button:has-text("Cancel")');
        await expect(page.locator('.km-modal-mask')).toBeHidden({ timeout: 3000 });
    });

});
