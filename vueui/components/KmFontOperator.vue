<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdExec, cmdState, cmdValue, interactVersion } from '../interact.js';
import { kmDropdown, closeAllDropdowns } from './km-dropdown.js';
import KmColorPicker from './KmColorPicker.vue';
import KmColorPanel from './KmColorPanel.vue';

const vKmDropdown = kmDropdown;

const fontSizeList = [10, 12, 16, 18, 24, 32, 48];
const fontFamilyList = [
    { name: '宋体', val: '宋体,SimSun' },
    { name: '微软雅黑', val: '微软雅黑,Microsoft YaHei' },
    { name: '楷体', val: '楷体,楷体_GB2312,SimKai' },
    { name: '黑体', val: '黑体, SimHei' },
    { name: '隶书', val: '隶书, SimLi' },
    { name: 'Andale Mono', val: 'andale mono' },
    { name: 'Arial', val: 'arial,helvetica,sans-serif' },
    { name: 'arialBlack', val: 'arial black,avant garde' },
    { name: 'Comic Sans Ms', val: 'comic sans ms' },
    { name: 'Impact', val: 'impact,chicago' },
    { name: 'Times New Roman', val: 'times new roman' },
    { name: 'Sans-Serif', val: 'sans-serif' }
];

const foreColor = ref('#000');
const pickerOpen = ref(false);

function defaultColor() {
    interactVersion.value;
    const node = km.minder.getSelectedNode();
    if (!node) return '#000';
    const c = km.minder.getNodeStyle(node, 'color');
    return typeof c === 'object' && c ? c.toHEX() : (c || '#000');
}

function fontfamilyName(val) {
    const hit = fontFamilyList.find(f => f.val === val);
    return hit ? hit.name : '';
}

function onPick(color) {
    foreColor.value = color;
    km.minder.execCommand('forecolor', color);
}

function onDocClick() {
    pickerOpen.value = false;
}
onMounted(() => document.addEventListener('mousedown', onDocClick));
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick));
</script>

<template>
    <div class="font-operator">
        <div class="dropdown font-family-list" v-km-dropdown>
            <div class="dropdown-toggle current-font-item">
                <a href class="current-font-family" :title="t('ui', 'fontfamily')">
                    {{ fontfamilyName(cmdValue(km.minder, 'fontfamily')) || '字体' }}
                </a>
                <span class="caret"></span>
            </div>
            <ul class="dropdown-menu font-list">
                <li v-for="f in fontFamilyList" :key="f.val" class="font-item-wrap">
                    <a @click="km.minder.execCommand('fontfamily', f.val)" class="font-item"
                       :class="{ 'font-item-selected': f.val === cmdValue(km.minder, 'fontfamily') }"
                       :style="{ 'font-family': f.val }">{{ f.name }}</a>
                </li>
            </ul>
        </div>
        <div class="dropdown font-size-list" v-km-dropdown>
            <div class="dropdown-toggle current-font-item">
                <a href class="current-font-size" :title="t('ui', 'fontsize')">
                    {{ cmdValue(km.minder, 'fontsize') || '字号' }}
                </a>
                <span class="caret"></span>
            </div>
            <ul class="dropdown-menu font-list">
                <li v-for="f in fontSizeList" :key="f" class="font-item-wrap">
                    <a @click="km.minder.execCommand('fontsize', f)" class="font-item"
                       :class="{ 'font-item-selected': f === cmdValue(km.minder, 'fontsize') }"
                       :style="{ 'font-size': f + 'px' }">{{ f }}</a>
                </li>
            </ul>
        </div>
        <span class="s-btn-icon font-bold"
              :class="{ 'font-bold-selected': cmdState(km.minder, 'bold') === 1 }"
              :disabled="cmdDisabled(km.minder, 'bold')"
              @click="cmdExec(km.minder, 'bold')"></span>
        <span class="s-btn-icon font-italics"
              :class="{ 'font-italics-selected': cmdState(km.minder, 'italic') === 1 }"
              :disabled="cmdDisabled(km.minder, 'italic')"
              @click="cmdExec(km.minder, 'italic')"></span>

        <div class="font-color-wrap" style="position: relative">
            <span class="quick-font-color"
                  :disabled="cmdDisabled(km.minder, 'forecolor')"
                  @click="cmdExec(km.minder, 'forecolor', foreColor)">A</span>
            <span class="font-color"
                  :disabled="cmdDisabled(km.minder, 'forecolor')"
                  @mousedown.stop="pickerOpen = !pickerOpen; closeAllDropdowns()">
                <span class="caret"></span>
            </span>
            <span class="font-color-preview"
                  :style="{ 'background-color': defaultColor() }"
                  :disabled="cmdDisabled(km.minder, 'forecolor')"
                  @click="cmdExec(km.minder, 'forecolor', foreColor)"></span>
            <KmColorPicker :open="pickerOpen" @pick="onPick" @close="pickerOpen = false" />
        </div>

        <KmColorPanel class="inline-directive" />
    </div>
</template>

