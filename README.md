KityMinder Editor
==========

## 简介

KityMinder Editor 是一款强大、简洁、体验优秀的脑图编辑工具，适合用于编辑树/图/网等结构的数据。

编辑器由百度 [FEX](https://github.com/fex-team) 基于 [kityminder-core](https://github.com/fex-team/kityminder-core) 搭建，并且在[百度脑图](http://naotu.baidu.com)中使用。

他们的区别与联系如下：

![KityMinder 联系](relations.png "KityMinder 联系")

- [kityminder-core](https://github.com/fex-team/kityminder-core) 是 kityminder 的核心部分，基于百度 [FEX](https://github.com/fex-team) 开发的矢量图形库 [kity](https://github.com/fex-team/kity)。包含了脑图数据的可视化展现，简单编辑功能等所有底层支持。
- [kityminder-editor](https://github.com/fex-team/kityminder-editor) 基于 kityminder-core 搭建，UI 层为 Vue 3，包含热盒 [hotbox](https://github.com/fex-team/hotbox) 等方便用户输入的功能，简单来说，就是一款编辑器。
- [百度脑图](http://naotu.baidu.com) 基于 kityminder-editor，加入了第三方格式导入导出 (FreeMind, XMind, MindManager) 、文件储存、用户认证、文件分享、历史版本等业务逻辑。

## 功能

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

## 开发使用
根目录下的 `index.html` 为 Vue 3 开发入口。

1. 安装 [nodejs](http://nodejs.org)（建议 LTS 版本）
2. 初始化：切到项目根目录下运行 `npm install`
3. 运行 `npm run dev` 即可启动项目（Vite，默认 http://localhost:5173）
4. 你可以基于根目录的 `index.html` 开发，Enjoy it！

工程说明：

- 包管理使用 npm；Bower 独有包（hotbox）放在 `vendor/` 目录
- `src/` 为 ESM 编辑器运行时
- UI 层为 Vue 3（`vueui/` 目录）
- kity / kityminder-core / hotbox 依赖非严格模式，在入口中以传统 `<script>` 方式按序加载（通过 `?url` 导入，dev/build 行为一致）
- 样式系统（`less/editor.less`）与组件 DOM class 命名保持兼容

## 构建
运行 `npm run build`，完成后 `dist` 目录即可部署运行；`npm run preview` 可本地预览产物。

## 测试
```bash
# 单元测试
npm test

# E2E（需先 npx playwright install chromium）
npm run test:e2e
```

## 数据导入导出
由于 kityminder-editor 是基于 kityminder-core 搭建的，而 kityminder-core 内置了五种常见
格式的导入或导出，在创建编辑器实例之后，可以使用四个接口进行数据的导入导出。

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

更多格式的支持，可以加载 [kityminder-protocol](https://github.com/fex-team/kityminder-protocol) 来扩展第三方格式支持。

数据格式的具体信息，可参考 [kityminder-core-wiki 的中的说明](https://github.com/fex-team/kityminder-core/wiki)。

## 联系我们
问题和建议反馈：

[Github issues](https://github.com/fex-team/kityminder-editor/issues)

邮件组：kity@baidu.com

QQ 讨论群：475962105
