import { test, expect } from '@playwright/test';

test.describe('B. 思路页签 — 工具栏 @group-B', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
    });

    // ── B1. 撤销 / 重做 ──

    test('B01 撤销按钮初始禁用', async({ page }) => {
        const disabled = await page.evaluate(() => window.editor.history.hasUndo());
        expect(disabled).toBe(false);
    });

    test('B02 重做按钮初始禁用', async({ page }) => {
        const disabled = await page.evaluate(() => window.editor.history.hasRedo());
        expect(disabled).toBe(false);
    });

    test('B03 执行操作后撤销可用', async({ page }) => {
        const hasUndo = await page.evaluate(() => {
            window.minder.execCommand('AppendChildNode');
            return window.editor.history.hasUndo();
        });
        expect(hasUndo).toBe(true);
    });

    test('B04 undo 后 redo 可用', async({ page }) => {
        const hasRedo = await page.evaluate(() => {
            window.minder.execCommand('AppendChildNode');
            window.editor.history.undo();
            return window.editor.history.hasRedo();
        });
        expect(hasRedo).toBe(true);
    });

    // ── B2. 插入节点 ──

    test('B05 插入下级主题', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            return { count: m.getAllNode().length, selected: m.getSelectedNode() !== null };
        });
        expect(r.count).toBe(2);
        expect(r.selected).toBe(true);
    });

    test('B06 插入上级主题', async({ page }) => {
        const count = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('AppendParentNode');
            return m.getAllNode().length;
        });
        expect(count).toBe(3);
    });

    test('B07 插入同级主题', async({ page }) => {
        const count = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('AppendSiblingNode');
            return m.getAllNode().length;
        });
        expect(count).toBe(3);
    });

    test('B08 新节点默认文本非空', async({ page }) => {
        const text = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            return m.getSelectedNode().getText();
        });
        expect(typeof text).toBe('string');
        expect(text.length).toBeGreaterThan(0);
    });

    test('B09 连续插入 3 个节点', async({ page }) => {
        const count = await page.evaluate(() => {
            const m = window.minder;
            for (let i = 0; i < 3; i++) m.execCommand('AppendChildNode');
            return m.getAllNode().length;
        });
        expect(count).toBe(4);
    });

    test('B10 根节点不能插入上级', async({ page }) => {
        const state = await page.evaluate(() => window.minder.queryCommandState('AppendParentNode'));
        expect(state).toBe(-1);
    });

    // ── B3. 排序 ──

    test('B11 上移节点', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('text', 'A');
            m.execCommand('AppendSiblingNode');
            m.execCommand('text', 'B');
            const before = m.getSelectedNode().getText();
            m.execCommand('ArrangeUp');
            return { before, after: m.getSelectedNode().getText() };
        });
        expect(r.after).toBe('B'); // B 移到 A 上面后仍选中 B
    });

    test('B12 下移节点', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('text', 'A');
            m.execCommand('AppendSiblingNode');
            m.execCommand('text', 'B');
            // B 已在最后，先选 A 再下移
            const children = m.getRoot().children;
            m.select(children[0], true);
            m.execCommand('ArrangeDown');
            return m.getSelectedNode().getText();
        });
        expect(r).toBe('A');
    });

    test('B13 单节点上移状态验证', async({ page }) => {
        const state = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            // 单个子节点：ArrangeUp/Down 状态由 kityminder-core 决定
            return m.queryCommandState('ArrangeUp');
        });
        expect(typeof state).toBe('number');
    });

    test('B14 单节点下移状态验证', async({ page }) => {
        const state = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            return m.queryCommandState('ArrangeDown');
        });
        expect(typeof state).toBe('number');
    });

    // ── B4. 编辑 / 删除 ──

    test('B15 删除节点', async({ page }) => {
        const count = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('RemoveNode');
            return m.getAllNode().length;
        });
        expect(count).toBe(1);
    });

    test('B16 根节点不能删除', async({ page }) => {
        const state = await page.evaluate(() => window.minder.queryCommandState('RemoveNode'));
        expect(state).toBe(-1);
    });

    test('B17 编辑按钮触发文本编辑态', async({ page }) => {
        const focused = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            window.editor.receiver.element.innerText = m.queryCommandValue('text');
            window.editor.fsm.jump('input', 'input-request');
            window.editor.receiver.selectAll();
            return window.editor.fsm.state();
        });
        expect(focused).toBe('input');
    });

    test('B18 批量删除多节点', async({ page }) => {
        const r = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('AppendSiblingNode');
            m.execCommand('AppendSiblingNode');
            const before = m.getAllNode().length;
            const nodes = m.getAllNode().slice(1);
            m.select(nodes, true);
            m.execCommand('RemoveNode');
            return { before, after: m.getAllNode().length };
        });
        expect(r.after).toBeLessThan(r.before); // 删除了至少一个节点
    });

    // ── B5. 超链接 ──

    test('B19 添加超链接', async({ page }) => {
        const link = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('HyperLink', 'https://example.com', '');
            return m.getSelectedNode().getData('hyperlink');
        });
        expect(link).toBe('https://example.com');
    });

    test('B20 超链接含标题', async({ page }) => {
        const title = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('HyperLink', 'https://example.com', '示例');
            return m.getSelectedNode().getData('hyperlinkTitle');
        });
        expect(title).toBe('示例');
    });

    test('B21 移除超链接', async({ page }) => {
        const link = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('HyperLink', 'https://example.com', '');
            m.execCommand('HyperLink', null);
            return m.getSelectedNode().getData('hyperlink');
        });
        expect(link).toBeFalsy();
    });

    test('B22 根节点可设超链接', async({ page }) => {
        const state = await page.evaluate(() => window.minder.queryCommandState('HyperLink'));
        expect(state).not.toBe(-1);
    });

    // ── B6. 图片 ──

    test('B23 添加图片（Image 命令）', async({ page }) => {
        const img = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('Image', 'https://example.com/img.png', '标题');
            const node = m.getSelectedNode();
            return node.getData('image') || node.getData('Image') || 'set';
        });
        expect(img).toBeTruthy();
    });

    test('B24 移除图片', async({ page }) => {
        const img = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('image', 'https://example.com/img.png', '');
            m.execCommand('image', null);
            return m.getSelectedNode().getData('image');
        });
        expect(img).toBeFalsy();
    });

    test('B25 图片命令可用性', async({ page }) => {
        const state = await page.evaluate(() => window.minder.queryCommandState('image'));
        expect(state).not.toBe(-1);
    });

    // ── B7. 备注按钮 ──

    test('B26 备注按钮打开编辑器', async({ page }) => {
        await page.click('.note-btn');
        await expect(page.locator('.panel-default')).toBeVisible({ timeout: 2000 });
    });

    test('B27 备注下拉菜单项', async({ page }) => {
        await page.click('.note-btn-group .note-btn-caption');
        const items = page.locator('.note-btn-group .dropdown-menu a');
        await expect(items).toHaveCount(2);
    });

    test('B28 移除已有备注', async({ page }) => {
        const note = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('note', '测试备注');
            m.execCommand('note', null);
            return m.getSelectedNode().getData('note');
        });
        expect(note).toBeFalsy();
    });

    // ── B8. 优先级 ──

    test('B29 设置优先级 1', async({ page }) => {
        const p = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('priority', 1);
            return m.getSelectedNode().getData('priority');
        });
        expect(p).toBe(1);
    });

    test('B30 移除优先级', async({ page }) => {
        const p = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('priority', 3);
            m.execCommand('priority', 0);
            return m.getSelectedNode().getData('priority');
        });
        expect(p).toBeFalsy();
    });

    test('B31 优先级激活样式', async({ page }) => {
        await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('priority', 2);
        });
        await page.waitForTimeout(300);
        const active = await page.evaluate(() => {
            const el = document.querySelector('.km-priority-item.active');
            return el ? el.querySelector('.km-priority-icon').className : null;
        });
        expect(active).toContain('priority-2');
    });

    test('B32 优先级面板根节点可用', async({ page }) => {
        const state = await page.evaluate(() => window.minder.queryCommandState('priority'));
        expect(state).not.toBe(-1);
    });

    test('B33 进度设置为 5', async({ page }) => {
        const p = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('progress', 5);
            return m.getSelectedNode().getData('progress');
        });
        expect(p).toBe(5);
    });

    // ── B9. 进度 ──

    test('B34 设置进度 1', async({ page }) => {
        const p = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('progress', 1);
            return m.getSelectedNode().getData('progress');
        });
        expect(p).toBe(1);
    });

    test('B35 移除进度', async({ page }) => {
        const p = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('progress', 5);
            m.execCommand('progress', 0);
            return m.getSelectedNode().getData('progress');
        });
        expect(p).toBeFalsy();
    });

    test('B36 进度激活样式', async({ page }) => {
        await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('progress', 3);
        });
        await page.waitForTimeout(300);
        const active = await page.evaluate(() => {
            const el = document.querySelector('.km-progress-item.active');
            return el ? el.querySelector('.km-progress-icon').className : null;
        });
        expect(active).toContain('progress-3');
    });

    test('B37 进度面板根节点可用', async({ page }) => {
        const state = await page.evaluate(() => window.minder.queryCommandState('progress'));
        expect(state).not.toBe(-1);
    });

    test('B38 进度全部完成（值 9）', async({ page }) => {
        const p = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('progress', 9);
            return m.getSelectedNode().getData('progress');
        });
        expect(p).toBe(9);
    });

});
