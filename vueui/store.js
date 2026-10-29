/**
 * 编辑器实例与跨组件 UI 状态。
 * editor/minder 是 kity 复杂对象：shallowReactive 只追踪顶层属性赋值，
 * 不会深度代理对象内部（避免 kity getter/setter 被破坏与性能损耗）。
 */
import { reactive, shallowReactive } from 'vue';

export const km = shallowReactive({
    editor: null,
    minder: null
});

export const ui = reactive({
    // 备注编辑器开关（对应 valueTransfer.noteEditorOpen）
    noteEditorOpen: false,
    // 当前顶部页签
    activeTab: 'idea'
});
