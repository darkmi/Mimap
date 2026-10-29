/**
 * Vue 应用装配。
 */
import { createApp } from 'vue';
import KmEditor from './vueui/KmEditor.vue';

export function mountApp(selector) {
    const app = createApp(KmEditor);
    const root = document.querySelector(selector);
    if (!root) throw new Error('mount target not found: ' + selector);
    app.mount(root);
    return app;
}
