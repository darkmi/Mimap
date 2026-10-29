<script setup>
/**
 * 备注编辑器（移植 noteEditor 指令）：CodeMirror 5 + GFM，
 * 值变化写回 minder 'note' 命令。
 */
import { ref, watch, onMounted, nextTick } from 'vue';
import CodeMirror from 'codemirror';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/markdown/markdown.js';
import { km, ui } from '../store.js';
import { cmdState, interactVersion } from '../interact.js';

const rootEl = ref(null);
let cm = null;
let applying = false;

const noteEnabled = () => {
    interactVersion.value;
    return cmdState(km.minder, 'note') !== -1;
};
const noteContent = () => {
    interactVersion.value;
    return km.minder.queryCommandValue('note') || '';
};

onMounted(() => {
    cm = CodeMirror(rootEl.value, {
        value: noteContent(),
        mode: 'gfm',
        gfm: true,
        breaks: true,
        lineWrapping: true,
        dragDrop: false,
        lineNumbers: true
    });
    cm.setSize('100%', '100%');
    cm.on('change', () => {
        if (applying) return;
        if (cm.getValue() && cmdState(km.minder, 'note') !== -1) {
            km.minder.execCommand('note', cm.getValue());
        }
    });
    // interactchange 后同步所选节点备注（防止回写抖动）
    km.minder.on('interactchange', () => {
        if (cmdState(km.minder, 'note') === -1) return;
        const v = km.minder.queryCommandValue('note') || '';
        if (v !== cm.getValue()) {
            applying = true;
            cm.setValue(v);
            applying = false;
        }
    });
});

watch(() => ui.noteEditorOpen, async(open) => {
    if (open) {
        await nextTick();
        cm.refresh();
        cm.focus();
    }
});

function close() {
    ui.noteEditorOpen = false;
    window.editor && window.editor.receiver.selectAll();
}
</script>

<template>
    <div class="panel panel-default" v-show="ui.noteEditorOpen">
        <div class="panel-heading">
            <h3 class="panel-title">备注</h3>
            <span>（<a class="help" href="https://www.zybuluo.com/techird/note/46064" target="_blank">支持 GFM 语法书写</a>）</span>
            <i class="close-note-editor glyphicon glyphicon-remove" @click="close()"></i>
        </div>
        <div class="panel-body">
            <div v-show="noteEnabled()" ref="rootEl"></div>
            <p v-show="!noteEnabled()" class="km-note-tips">请选择节点编辑备注</p>
        </div>
    </div>
</template>
