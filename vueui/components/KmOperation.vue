<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdExec } from '../interact.js';
import { startEditText } from '../editor-utils.js';
</script>

<template>
    <div class="km-btn-group operation-group">
        <div class="km-btn-item edit-node"
             :title="t('ui/command', 'editnode')"
             :disabled="cmdDisabled(km.minder, 'text')"
             @click="startEditText()">
            <i class="km-btn-icon"></i>
            <span class="km-btn-caption">{{ t('ui/command', 'editnode') }}</span>
        </div>
        <div class="km-btn-item remove-node"
             :title="t('ui/command', 'removenode')"
             :disabled="cmdDisabled(km.minder, 'RemoveNode')"
             @click="cmdExec(km.minder, 'RemoveNode')">
            <i class="km-btn-icon"></i>
            <span class="km-btn-caption">{{ t('ui/command', 'removenode') }}</span>
        </div>
    </div>
</template>
