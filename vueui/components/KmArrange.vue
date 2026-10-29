<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdExec } from '../interact.js';
</script>

<template>
    <div class="km-btn-group arrange-group">
        <div class="km-btn-item arrange-up"
             :title="t('ui/command', 'arrangeup')"
             :disabled="cmdDisabled(km.minder, 'ArrangeUp')"
             @click="cmdExec(km.minder, 'ArrangeUp')">
            <i class="km-btn-icon"></i>
            <span class="km-btn-caption">{{ t('ui/command', 'arrangeup') }}</span>
        </div>
        <div class="km-btn-item arrange-down"
             :title="t('ui/command', 'arrangedown')"
             :disabled="cmdDisabled(km.minder, 'ArrangeDown')"
             @click="cmdExec(km.minder, 'ArrangeDown')">
            <i class="km-btn-icon"></i>
            <span class="km-btn-caption">{{ t('ui/command', 'arrangedown') }}</span>
        </div>
    </div>
</template>
