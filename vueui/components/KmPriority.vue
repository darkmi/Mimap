<script setup>
import { km } from '../store.js';
import { cmdState, cmdValue } from '../interact.js';

const priorities = Array.from({ length: 10 }, (_, i) => i);

function title(p) {
    return p === 0 ? '移除优先级' : '优先级' + p;
}
</script>

<template>
    <ul class="km-priority tool-group" :disabled="cmdState(km.minder, 'priority') === -1">
        <li v-for="p in priorities" :key="p"
            class="km-priority-item tool-group-item"
            :class="{ active: cmdValue(km.minder, 'priority') === p }"
            :title="title(p)"
            @click="km.minder.execCommand('priority', p)">
            <div class="km-priority-icon tool-group-icon" :class="'priority-' + p"></div>
        </li>
    </ul>
</template>
