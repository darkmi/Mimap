Mimap
==========

[English](README.en.md)

## 简介

**Mimap 是一款 AI 原生脑图工具——用一句话生成脑图。** 输入一句需求，AI 即可为你生成结构完整的脑图；生成之后，还可以继续用内置编辑器进行精细化调整与扩展。

编辑器 UI 基于 Vue 3 构建，采用 Vite 构建链路，并配备 Vitest 单元测试与 Playwright E2E 测试。

## 功能

- AI 生成：用一句话描述需求，直接生成结构完整的脑图
- 基本操作：文本编辑，节点折叠、插入、删除、排序、归纳、复制、剪切、粘贴等
- 样式控制：字体、加粗、斜体、颜色、样式拷贝、样式粘贴等
- 图标：优先级、进度等
- 历史：撤销/重做
- 标签：多标签贴入
- 备注：支持 Markdown 格式备注
- 图片：支持本地/网络/搜索图片插入
- 超链接：支持 HTTP/HTTPS/MAIL/FTP 链接插入
- 布局：支持多种布局切换
- 主题：支持多种主题切换
- 数据导入导出：支持多种格式的导入，多种格式（包括图片）的导出
- 缩略图：支持缩略图查看/导航

## 快速开始

根目录下的 `index.html` 为开发入口（Vite）。

1. 安装 [Node.js](http://nodejs.org)（建议 LTS 版本）
2. 初始化：切到项目根目录下运行 `npm install`
3. 运行 `npm run dev` 启动开发服务器（默认 http://localhost:5173）
4. 基于根目录的 `index.html` 与 `vueui/` 目录开发，Enjoy it！

## 工程结构

```
index.html          开发入口页面
vue-main.js         应用入口：加载全局库 + 挂载 Vue 应用
vue-app.js          Vue 应用装配（createApp(KmEditor)）
editor-entry.js     编辑器运行时入口（src/ 模块树）
src/                ESM 编辑器运行时（fsm/receiver/hotbox/input/clipboard/drag/history 等 runtime）
vueui/              Vue 3 UI 层（KmEditor.vue + components/）
less/               Less 样式（与组件 DOM class 命名保持兼容）
vendor/hotbox/      hotbox（历史遗留的 Bower 包，随仓库维护）
public/             静态资源（雪碧图等）
types/              底层图形/内核库的 TypeScript 声明
e2e/                Playwright E2E 用例
tests/              Vitest 单元测试
docs/               升级方案、测试方案文档
server/             图片上传示例服务端（PHP）
```

工程说明：

- 包管理使用 npm；hotbox 等非 npm 包放在 `vendor/` 目录
- 底层图形/内核库依赖非严格模式，在入口中以传统 `<script>` 方式按序加载（通过 `?url` 导入，dev/build 行为一致）
- 构建目标为 `es2022`（入口使用顶层 `await` 按序加载全局库）

## 构建

```bash
npm run build
```

完成后 `dist` 目录即可部署运行；`npm run preview` 可本地预览产物。

## 测试

```bash
# 单元测试（Vitest）
npm test

# E2E 测试（Playwright，首次需安装浏览器）
npx playwright install chromium
npm run test:e2e
```

## 数据导入导出

在创建编辑器实例之后，可以使用四个接口进行数据的导入导出。

* `editor.minder.exportJson()` - 导出脑图数据为 JSON 对象
* `editor.minder.importJson(json)` - 导入 JSON 对象为当前脑图数据
* `editor.minder.exportData(protocol, option)` - 导出脑图数据为指定的数据格式，返回一个 Promise，其值为导出的结果
* `editor.minder.importData(protocol, data, option)` - 导入指定格式的脑图数据，返回一个 Promise，其值为转换之后的脑图 Json 数据

目前支持的数据格式包括：

* `json` - JSON 字符串，支持导入和导出
* `text` - 纯文本格式，支持导入和导出
* `markdown` - Markdown 格式，支持导入和导出
* `svg` - SVG 矢量格式，仅支持导出
* `png` - PNG 位图格式，仅支持导出

## 联系我们

问题和建议反馈请提交 [GitHub Issues](https://github.com/darkmi/Mimap/issues)。

## 许可证

Apache-2.0。
