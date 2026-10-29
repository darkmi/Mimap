/**
 * Vue UI 版入口。
 *
 * 加载顺序约束：
 * 1. kity / hotbox / kityminder-core 依赖非严格模式，必须以传统 <script> 加载；
 * 2. vueui 的 src/editor.js 在模块求值期读取 window.kityminder，
 *    因此在其之前完成全局库加载。
 */
import { loadScript } from './setup/loader.js';

/* ========== 样式 ========== */
import 'bootstrap/dist/css/bootstrap.css';
import 'codemirror/lib/codemirror.css';
import './vendor/hotbox/hotbox.css';
import 'kityminder-core/dist/kityminder.core.css';
import './less/editor.less';

/* ========== 依赖非严格模式的 IIFE 库 ========== */
import kityUrl from 'kity/dist/kity.js?url';
import hotboxUrl from './vendor/hotbox/hotbox.js?url';
import kityminderCoreUrl from 'kityminder-core/dist/kityminder.core.js?url';

await loadScript(kityUrl);           // window.kity
await loadScript(hotboxUrl);         // window.HotBox
await loadScript(kityminderCoreUrl); // window.kityminder

/* ========== Vue 应用（含 src/ 编辑器运行时） ========== */
const { mountApp } = await import('./vue-app.js');
mountApp('#app');
