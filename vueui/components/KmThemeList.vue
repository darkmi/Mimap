<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdValue } from '../interact.js';
import { kmDropdown } from './km-dropdown.js';

const vKmDropdown = kmDropdown;

// 维护 theme key 列表以保证列表美观（不按字母顺序排序）
const themeKeyList = [
    'classic', 'classic-compact',
    'fresh-blue', 'fresh-blue-compat',
    'fresh-green', 'fresh-green-compat',
    'fresh-pink', 'fresh-pink-compat',
    'fresh-purple', 'fresh-purple-compat',
    'fresh-red', 'fresh-red-compat',
    'fresh-soil', 'fresh-soil-compat',
    'snow', 'snow-compact',
    'tianpan', 'tianpan-compact',
    'fish', 'wire'
];

function themeList() {
    return window.kityminder.Minder.getThemeList();
}

function thumbStyle(theme) {
    const themeObj = themeList()[theme];
    if (!themeObj) return {};
    const style = {
        color: themeObj['root-color'],
        borderRadius: (themeObj['root-radius'] / 2) + 'px'
    };
    if (themeObj['root-background']) {
        style.background = themeObj['root-background'].toString();
    }
    return style;
}
</script>

<template>
    <div class="dropdown theme-panel" v-km-dropdown>
        <div class="dropdown-toggle theme-item-selected"
             :disabled="cmdDisabled(km.minder, 'theme')">
            <a href class="theme-item"
               :style="thumbStyle(cmdValue(km.minder, 'theme'))"
               :title="t('theme', cmdValue(km.minder, 'theme'))">
                {{ t('theme', cmdValue(km.minder, 'theme')) }}
            </a>
            <span class="caret"></span>
        </div>
        <ul class="dropdown-menu theme-list">
            <li v-for="key in themeKeyList" :key="key" class="theme-item-wrap">
                <a @click="km.minder.execCommand('theme', key);"
                   class="theme-item" :style="thumbStyle(key)"
                   :title="t('theme', key)">{{ t('theme', key) }}</a>
            </li>
        </ul>
    </div>
</template>
