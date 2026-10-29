<script setup>
import { ref } from 'vue';
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdExec } from '../interact.js';
import { kmDropdown, closeAllDropdowns } from './km-dropdown.js';
import KmImageDialog from './KmImageDialog.vue';

const vKmDropdown = kmDropdown;

const dialogOpen = ref(false);
const currentImage = ref({ url: '', title: '' });
const dialogRef = ref(null);

function addImage() {
    closeAllDropdowns();
    currentImage.value = km.minder.queryCommandValue('image') || {};
    dialogRef.value && dialogRef.value.reset();
    dialogOpen.value = true;
}

function apply(result) {
    km.minder.execCommand('image', result.url, result.title || '');
}
</script>

<template>
    <div class="btn-group-vertical image-btn-group" v-km-dropdown>
        <button type="button"
                class="btn btn-default image"
                :title="t('image', 'image')"
                :disabled="cmdDisabled(km.minder, 'image')"
                @click="addImage()"></button>
        <button type="button"
                class="btn btn-default image-btn-caption dropdown-toggle"
                :title="t('image', 'image')"
                :disabled="cmdDisabled(km.minder, 'image')">
            <span class="caption">{{ t('image', 'image').replace('...', '') }}</span>
            <span class="caret"></span>
            <span class="sr-only">{{ t('image', 'image') }}</span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li><a href @click.prevent="addImage()">{{ t('image', 'image') }}</a></li>
            <li><a href @click.prevent="cmdExec(km.minder, 'image', null)">{{ t('image', 'removeimage') }}</a></li>
        </ul>
    </div>

    <KmImageDialog ref="dialogRef" v-model="dialogOpen" :image="currentImage" @ok="apply" />
</template>
