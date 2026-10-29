<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdState, cmdValue } from '../interact.js';
import { kmDropdown } from './km-dropdown.js';

const vKmDropdown = kmDropdown;

function templateList() {
    return window.kityminder.Minder.getTemplateList();
}
</script>

<template>
    <div class="dropdown temp-panel" v-km-dropdown>
        <div class="dropdown-toggle current-temp-item"
             :disabled="cmdDisabled(km.minder, 'template')">
            <a href class="temp-item" :class="cmdValue(km.minder, 'template')"
               :title="t('template', cmdValue(km.minder, 'template'))"></a>
            <span class="caret"></span>
        </div>
        <ul class="dropdown-menu temp-list">
            <li v-for="(templateObj, key) in templateList()" :key="key" class="temp-item-wrap">
                <a @click="km.minder.execCommand('template', key);"
                   class="temp-item" :class="[key, { 'temp-item-selected': key === cmdValue(km.minder, 'template') }]"
                   :title="t('template', key)"></a>
            </li>
        </ul>
    </div>
</template>
