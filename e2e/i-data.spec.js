import { test, expect } from '@playwright/test';

test.describe('I. 数据与持久化 @group-I', () => {

    test.beforeEach(async({ page }) => {
        await page.goto('/');
        await page.waitForFunction(() => !!window.minder, { timeout: 10000 });
    });

    test('I01 exportJson 导出数据', async({ page }) => {
        const json = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('text', '数据节点');
            m.execCommand('priority', 3);
            return m.exportJson();
        });
        expect(json).toHaveProperty('root');
        expect(json.root).toHaveProperty('data');
        expect(json.root).toHaveProperty('children');
    });

    test('I02 importJson 导入数据', async({ page }) => {
        const result = await page.evaluate(() => {
            const m = window.minder;
            const jsonData = {
                root: {
                    data: { text: '导入根' },
                    children: [
                        { data: { text: '子1' }, children: [] },
                        { data: { text: '子2' }, children: [] }
                    ]
                }
            };
            m.importJson(jsonData);
            return {
                rootText: m.getRoot().getText(),
                count: m.getAllNode().length
            };
        });
        expect(result.rootText).toBe('导入根');
        expect(result.count).toBe(3);
    });

    test('I03 contentchange 事件触发', async({ page }) => {
        const fired = await page.evaluate(() => {
            return new Promise(resolve => {
                let fired = false;
                window.minder.on('contentchange', () => { fired = true; });
                window.minder.execCommand('AppendChildNode');
                setTimeout(() => resolve(fired), 200);
            });
        });
        expect(fired).toBe(true);
    });

    test('I04 草稿暂存 localStorage', async({ page }) => {
        const hasDraft = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.fire('contentchange');
            // 等 contentchange handler 执行
            return new Promise(resolve => setTimeout(() => {
                resolve(!!window.localStorage.__dev_minder_content);
            }, 300));
        });
        expect(hasDraft).toBe(true);
    });

    test('I05 多种数据综合设置并读取', async({ page }) => {
        const data = await page.evaluate(() => {
            const m = window.minder;
            m.execCommand('AppendChildNode');
            m.execCommand('text', '综合测试');
            m.execCommand('priority', 5);
            m.execCommand('progress', 7);
            m.execCommand('note', '备注内容');
            m.execCommand('HyperLink', 'https://test.com', '测试链接');
            const node = m.getSelectedNode();
            return {
                text: node.getText(),
                priority: node.getData('priority'),
                progress: node.getData('progress'),
                note: node.getData('note'),
                hyperlink: node.getData('hyperlink')
            };
        });
        expect(data.text).toBe('综合测试');
        expect(data.priority).toBe(5);
        expect(data.progress).toBe(7);
        expect(data.note).toBe('备注内容');
        expect(data.hyperlink).toBe('https://test.com');
    });

});
