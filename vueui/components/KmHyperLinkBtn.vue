<script setup>
import { ref } from 'vue';
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdExec } from '../interact.js';
import { kmDropdown, closeAllDropdowns } from './km-dropdown.js';
import KmHyperlinkDialog from './KmHyperlinkDialog.vue';

const vKmDropdown = kmDropdown;

const dialogOpen = ref(false);
const currentLink = ref({ url: '', title: '' });
const dialogRef = ref(null);

function addHyperlink() {
    closeAllDropdowns();
    currentLink.value = km.minder.queryCommandValue('HyperLink') || {};
    dialogRef.value && dialogRef.value.reset();
    dialogOpen.value = true;
}

function apply(result) {
    km.minder.execCommand('HyperLink', result.url, result.title || '');
}
</script>

<template>
    <div class="btn-group-vertical hyperlink-btn-group" v-km-dropdown>
        <button type="button"
                class="btn btn-default hyperlink"
                :title="t('ui', 'link')"
                :disabled="cmdDisabled(km.minder, 'HyperLink')"
                @click="addHyperlink()"></button>
        <button type="button"
                class="btn btn-default hyperlink-caption dropdown-toggle"
                :title="t('ui', 'link')"
                :disabled="cmdDisabled(km.minder, 'HyperLink')">
            <span class="caption">{{ t('ui', 'link') }}</span>
            <span class="caret"></span>
            <span class="sr-only">{{ t('ui', 'link') }}</span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li><a href @click.prevent="addHyperlink()">{{ t('ui', 'insertlink') }}</a></li>
            <li><a href @click.prevent="cmdExec(km.minder, 'HyperLink', null)">{{ t('ui', 'removelink') }}</a></li>
        </ul>
    </div>

    <KmHyperlinkDialog ref="dialogRef" v-model="dialogOpen" :link="currentLink" @ok="apply" />
</template>
