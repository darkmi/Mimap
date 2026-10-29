<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { km } from '../store.js';
import { cmdDisabled, cmdExec, interactVersion } from '../interact.js';
import KmColorPicker from './KmColorPicker.vue';

const bgColor = ref('#fff');
const pickerOpen = ref(false);

function defaultBg() {
    interactVersion.value;
    const node = km.minder.getSelectedNode();
    if (!node) return '#fff';
    const c = km.minder.getNodeStyle(node, 'background');
    return typeof c === 'object' && c ? c.toHEX() : (c || '#fff');
}

function onPick(color) {
    bgColor.value = color;
    km.minder.execCommand('background', color);
}

function onDocClick() {
    pickerOpen.value = false;
}
onMounted(() => document.addEventListener('mousedown', onDocClick));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));
</script>

<template>
    <div class="bg-color-wrap" style="position: relative">
        <span class="quick-bg-color"
              :disabled="cmdDisabled(km.minder, 'background')"
              @click="cmdExec(km.minder, 'background', bgColor)"></span>
        <span class="bg-color"
              :disabled="cmdDisabled(km.minder, 'background')"
              @mousedown.stop="pickerOpen = !pickerOpen">
            <span class="caret"></span>
        </span>
        <span class="bg-color-preview"
              :style="{ 'background-color': defaultBg() }"
              :disabled="cmdDisabled(km.minder, 'background')"
              @click="cmdExec(km.minder, 'background', bgColor)"></span>
        <KmColorPicker :open="pickerOpen" @pick="onPick" @close="pickerOpen = false" />
    </div>
</template>
