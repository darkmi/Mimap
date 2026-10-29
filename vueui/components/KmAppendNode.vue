<script setup>
import { zhCnLang, t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled } from '../interact.js';
import { startEditText } from '../editor-utils.js';

function append(command) {
    km.minder.execCommand(command, zhCnLang.topic);
    startEditText();
}
</script>

<template>
    <div class="km-btn-group append-group">
        <div class="km-btn-item append-child-node"
             :title="t('ui/command', 'appendchildnode')"
             :disabled="cmdDisabled(km.minder, 'AppendChildNode')"
             @click="append('AppendChildNode')">
            <i class="km-btn-icon"></i>
            <span class="km-btn-caption">{{ t('ui/command', 'appendchildnode') }}</span>
        </div>
        <div class="km-btn-item append-parent-node"
             :title="t('ui/command', 'appendparentnode')"
             :disabled="cmdDisabled(km.minder, 'AppendParentNode')"
             @click="append('AppendParentNode')">
            <i class="km-btn-icon"></i>
            <span class="km-btn-caption">{{ t('ui/command', 'appendparentnode') }}</span>
        </div>
        <div class="km-btn-item append-sibling-node"
             :title="t('ui/command', 'appendsiblingnode')"
             :disabled="cmdDisabled(km.minder, 'AppendSiblingNode')"
             @click="append('AppendSiblingNode')">
            <i class="km-btn-icon"></i>
            <span class="km-btn-caption">{{ t('ui/command', 'appendsiblingnode') }}</span>
        </div>
    </div>
</template>
