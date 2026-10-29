<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdExec } from '../interact.js';
</script>

<template>
    <div class="readjust-layout">
        <a @click="cmdExec(km.minder, 'resetlayout')" class="btn-wrap"
           :disabled="cmdDisabled(km.minder, 'resetlayout')">
            <span class="btn-icon reset-layout-icon"></span>
            <span class="btn-label">{{ t('ui/command', 'resetlayout') }}</span>
        </a>
    </div>
</template>
