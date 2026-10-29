<script setup>
/**
 * 备注悬浮预览（移植 notePreviewer 指令）：
 * minder 'shownoterequest' 事件触发，marked 渲染 + DOMPurify 消毒。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({ gfm: true, breaks: true });

const containerEl = ref(null); // .note-previewer 容器
const previewerEl = ref(null); // #previewer-content
const show = ref(false);
const html = ref('');
const style = ref({});

let previewTimer = null;
let previewLive = false;
let minder = null;
let onDocMousedown = null;

function preview(node, keyword) {
    if (!node) return;
    let b;
    try {
        const icon = node.getRenderer('NoteIconRenderer').getRenderShape();
        b = icon.getRenderBox('screen');
    } catch (e) {
        b = { cx: 200, bottom: 200, left: 100, top: 100 };
    }
    const note = node.getData('note');

    previewerEl.value.scrollTop = 0;

    let h = DOMPurify.sanitize(marked.parse(note || ''));
    if (keyword) {
        h = h.replace(new RegExp('(' + keyword + ')', 'ig'), '<span class="highlight">$1</span>');
    }
    html.value = h;
    show.value = true;

    // 渲染后计算位置
    requestAnimationFrame(() => {
        const container = containerEl.value ? containerEl.value.parentElement : null;
        const previewer = previewerEl.value;
        if (!container || !previewer) return;
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const pw = previewer.offsetWidth;
        const ph = previewer.offsetHeight;

        let x = b.cx - pw / 2 - container.offsetLeft;
        let y = b.bottom + 10 - container.offsetTop;

        if (x < 0) x = 10;
        if (x + pw > cw) x = b.left - pw - 10 - container.offsetLeft;
        if (y + ph > ch) y = b.top - ph - 10 - container.offsetTop;

        style.value = { left: Math.round(x) + 'px', top: Math.round(y) + 'px' };

        const view = previewer.querySelector('.highlight');
        if (view) view.scrollIntoView();
        previewLive = true;
    });
}

onMounted(() => {
    minder = window.minder;
    minder.on('shownoterequest', e => {
        previewTimer = setTimeout(() => preview(e.node, e.keyword), 300);
    });
    minder.on('hidenoterequest', () => {
        clearTimeout(previewTimer);
        show.value = false;
    });

    onDocMousedown = () => {
        if (!previewLive) return;
        show.value = false;
    };
    document.addEventListener('mousedown', onDocMousedown);
    document.addEventListener('mousewheel', onDocMousedown);
});

onBeforeUnmount(() => {
    clearTimeout(previewTimer);
    document.removeEventListener('mousedown', onDocMousedown);
    document.removeEventListener('mousewheel', onDocMousedown);
});
</script>

<template>
    <div class="note-previewer" ref="containerEl" @mousedown.stop @mousewheel.stop>
        <div id="previewer-content" ref="previewerEl" v-show="show" :style="style" v-html="html"></div>
    </div>
</template>
