<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { interactVersion } from '../interact.js';

function hasUndo() { interactVersion.value; return km.editor.history.hasUndo(); }
function hasRedo() { interactVersion.value; return km.editor.history.hasRedo(); }
</script>

<template>
    <div class="km-btn-group do-group">
        <div class="km-btn-item undo"
             :title="t('ui', 'undo')"
             :disabled="!hasUndo()"
             @click="hasUndo() && km.editor.history.undo()">
            <i class="km-btn-icon"></i>
        </div>
        <div class="km-btn-item redo"
             :title="t('ui', 'redo')"
             :disabled="!hasRedo()"
             @click="hasRedo() && km.editor.history.redo()">
            <i class="km-btn-icon"></i>
        </div>
    </div>
</template>
