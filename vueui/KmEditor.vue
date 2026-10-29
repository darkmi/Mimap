<script setup>
/**
 * 编辑器主组件（对应 kityminderEditor 指令）：
 * 挂载 src/ 的 KMEditor 运行时（ESM 直接引入，不再经过 seajs/全局）。
 */
import { ref, onMounted } from 'vue';
import KMEditor from '../src/editor.js';
import { km } from './store.js';
import { bindInteract } from './interact.js';
import KmTabBar from './components/KmTabBar.vue';
import KmSearchBox from './components/KmSearchBox.vue';
import KmNoteEditor from './components/KmNoteEditor.vue';
import KmNotePreviewer from './components/KmNotePreviewer.vue';
import KmNavigator from './components/KmNavigator.vue';
import KmImExportDialog from './components/KmImExportDialog.vue';

const emit = defineEmits(['init']);

const editorHostEl = ref(null);

// 节点内容导入/导出弹窗（对应 revokeDialog 服务）
const imExportOpen = ref(false);
const imExportTitle = ref('');
const imExportType = ref('import');
const imExportDefault = ref('');
const imExportRef = ref(null);

let pendingFinish = null;

function jumpNormal() {
    window.editor.fsm.jump('normal', 'import-text-finish');
    window.editor.receiver.selectAll();
}

function openImportDialog() {
    window.editor.fsm.jump('modal', 'import-text-modal');
    imExportTitle.value = '导入节点';
    imExportType.value = 'import';
    imExportDefault.value = '';
    imExportRef.value && imExportRef.value.reset();
    imExportOpen.value = true;
    pendingFinish = jumpNormal;
}

function openExportDialog() {
    window.editor.fsm.jump('modal', 'export-text-modal');
    const node = window.minder.getSelectedNode();
    const Node2Text = window.kityminder.data.getRegisterProtocol('text').Node2Text;
    imExportTitle.value = '导出节点';
    imExportType.value = 'export';
    imExportDefault.value = node ? Node2Text(node) : '';
    imExportRef.value && imExportRef.value.reset();
    imExportOpen.value = true;
    pendingFinish = jumpNormal;
}

function onImExportOk(result) {
    if (imExportType.value === 'import') {
        try {
            window.minder.Text2Children(window.minder.getSelectedNode(), result);
        } catch (e) {
            alert(e);
        }
    }
    pendingFinish && pendingFinish();
}

function onImExportCancel() {
    pendingFinish && pendingFinish();
}

onMounted(() => {
    const editor = new KMEditor(editorHostEl.value);
    const minder = editor.minder;

    km.editor = window.editor = editor;
    km.minder = window.minder = window.km = minder;

    bindInteract(minder);

    // 开发态草稿：编辑内容暂存 localStorage，刷新不丢
    if (window.localStorage.__dev_minder_content) {
        try {
            minder.importJson(JSON.parse(window.localStorage.__dev_minder_content));
        } catch (e) { /* 草稿损坏则忽略 */ }
    }
    minder.on('contentchange', () => {
        window.localStorage.__dev_minder_content = JSON.stringify(minder.exportJson());
    });

    minder.on('importNodeData', openImportDialog);
    minder.on('exportNodeData', openExportDialog);

    emit('init', editor, minder);
});
</script>

<template>
    <div class="minder-editor-container">
        <div class="top-tab" v-if="km.minder">
            <KmTabBar></KmTabBar>
        </div>
        <div v-if="km.minder">
            <KmSearchBox></KmSearchBox>
        </div>
        <div class="minder-editor" ref="editorHostEl"></div>
        <div class="km-note" v-if="km.minder">
            <KmNoteEditor></KmNoteEditor>
        </div>
        <div v-if="km.minder">
            <KmNotePreviewer></KmNotePreviewer>
        </div>
        <div class="navigator" v-if="km.minder">
            <KmNavigator></KmNavigator>
        </div>

        <KmImExportDialog ref="imExportRef"
                          v-model="imExportOpen"
                          :title="imExportTitle"
                          :default-value="imExportDefault"
                          :type="imExportType"
                          @ok="onImExportOk"
                          @update:model-value="v => { if (!v) onImExportCancel(); }" />
    </div>
</template>
