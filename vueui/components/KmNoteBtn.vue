<script setup>
import { t } from '../lang.js';
import { km, ui } from '../store.js';
import { cmdDisabled, cmdExec } from '../interact.js';
import { kmDropdown, closeAllDropdowns } from './km-dropdown.js';

const vKmDropdown = kmDropdown;

function addNote() {
    closeAllDropdowns();
    ui.noteEditorOpen = true;
}
</script>

<template>
    <div class="btn-group-vertical note-btn-group" v-km-dropdown>
        <button type="button"
                class="btn btn-default note-btn"
                :title="t('ui', 'note')"
                :disabled="cmdDisabled(km.minder, 'note')"
                @click="addNote()"></button>
        <button type="button"
                class="btn btn-default note-btn-caption dropdown-toggle"
                :title="t('ui', 'note')"
                :disabled="cmdDisabled(km.minder, 'note')">
            <span class="caption">{{ t('ui', 'note') }}</span>
            <span class="caret"></span>
            <span class="sr-only">{{ t('ui', 'note') }}</span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li><a href @click.prevent="addNote()">{{ t('ui', 'insertnote') }}</a></li>
            <li><a href @click.prevent="cmdExec(km.minder, 'note', null)">{{ t('ui', 'removenote') }}</a></li>
        </ul>
    </div>
</template>
