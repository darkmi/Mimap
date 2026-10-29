<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdDisabled, cmdExec } from '../interact.js';
</script>

<template>
    <div class="style-operator">
        <a @click="cmdExec(km.minder, 'clearstyle')" class="btn-wrap clear-style"
           :disabled="cmdDisabled(km.minder, 'clearstyle')">
            <span class="btn-icon clear-style-icon"></span>
            <span class="btn-label">{{ t('ui', 'clearstyle') }}</span>
        </a>
        <div class="s-btn-group-vertical">
            <a class="s-btn-wrap" href @click.prevent="cmdExec(km.minder, 'copystyle')"
               :disabled="cmdDisabled(km.minder, 'copystyle')">
                <span class="s-btn-icon copy-style-icon"></span>
                <span class="s-btn-label">{{ t('ui', 'copystyle') }}</span>
            </a>
            <a class="s-btn-wrap paste-style-wrap" href @click.prevent="cmdExec(km.minder, 'pastestyle')"
               :disabled="cmdDisabled(km.minder, 'pastestyle')">
                <span class="s-btn-icon paste-style-icon"></span>
                <span class="s-btn-label">{{ t('ui', 'pastestyle') }}</span>
            </a>
        </div>
    </div>
</template>
