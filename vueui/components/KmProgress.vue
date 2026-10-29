<script setup>
import { km } from '../store.js';
import { cmdState, cmdValue } from '../interact.js';

const progresses = Array.from({ length: 10 }, (_, i) => i);

function title(p) {
    if (p === 0) return '移除进度';
    if (p === 1) return '未开始';
    if (p === 9) return '全部完成';
    return '完成' + (p - 1) + '/8';
}
</script>

<template>
    <ul class="km-progress tool-group" :disabled="cmdState(km.minder, 'progress') === -1">
        <li v-for="p in progresses" :key="p"
            class="km-progress-item tool-group-item"
            :class="{ active: cmdValue(km.minder, 'progress') === p }"
            :title="title(p)"
            @click="km.minder.execCommand('progress', p)">
            <div class="km-progress-icon tool-group-icon" :class="'progress-' + p"></div>
        </li>
    </ul>
</template>
