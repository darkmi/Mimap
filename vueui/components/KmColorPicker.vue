<script setup>
/**
 * 取色弹层（替代 fex color-picker 的 popover 部分）：
 * 标准色板 + 最近使用（localStorage），点击色块向外 emit('pick', color)。
 */
import { ref } from 'vue';
import { memory } from '../memory.js';

defineProps({ open: Boolean });
const emit = defineEmits(['pick', 'close']);

const standardColors = [
    '#000000', '#444444', '#666666', '#999999', '#b3b3b3', '#cccccc', '#d9d9d9', '#efefef', '#f7f7f7', '#ffffff',
    '#9d0000', '#b30000', '#cc0000', '#e60000', '#ff0000', '#ff4d4d', '#ff8080', '#ffb3b3', '#ffd9d9', '#ffe6e6',
    '#8b4513', '#a0522d', '#d2691e', '#cd853f', '#deb887', '#e6c3a3', '#f2dcb3', '#fae6c8', '#fdf0d5', '#fdf5e6',
    '#556b2f', '#6b8e23', '#808000', '#9acd32', '#adff2f', '#c5e17d', '#d4e6a5', '#e2f0bd', '#edf7d4', '#f5fbe6',
    '#006400', '#008000', '#228b22', '#32cd32', '#7cfc00', '#98fb98', '#bdfcc9', '#d4f7dd', '#e6fbee', '#f2fff8',
    '#008b8b', '#20b2aa', '#40e0d0', '#7fffd4', '#98fb98', '#afeeee', '#c1f0f6', '#d4f0f7', '#e6f9fb', '#f2fdfd',
    '#00008b', '#0000cd', '#0000ff', '#4169e1', '#6495ed', '#87cefa', '#a3c8f0', '#bedaf5', '#d4ebfa', '#e6f4fd',
    '#4b0082', '#6a5acd', '#7b68ee', '#8470ff', '#9370db', '#b39ddb', '#c9b6f0', '#dad3f5', '#e8e4fa', '#f2f0fd',
    '#ff00ff', '#ee82ee', '#da70d6', '#ba55d3', '#9932cc', '#8a2be2', '#ffb6c1', '#ff69b4', '#ff1493', '#ffc0cb'
];

const recent = ref(memory.get('km-recent-colors') || []);

function pick(color) {
    recent.value = [color].concat(recent.value.filter(c => c !== color)).slice(0, 8);
    memory.set('km-recent-colors', recent.value);
    emit('pick', color);
    emit('close');
}
</script>

<template>
    <div v-if="open" class="km-color-picker" @mousedown.stop>
        <div class="km-color-group" v-if="recent.length">
            <div class="km-color-group-title">最近使用</div>
            <div class="km-color-grid">
                <span v-for="c in recent" :key="'r-' + c" class="km-color-cell" :style="{ background: c }" @click="pick(c)"></span>
            </div>
        </div>
        <div class="km-color-group">
            <div class="km-color-group-title">标准颜色</div>
            <div class="km-color-grid">
                <span v-for="c in standardColors" :key="c" class="km-color-cell" :style="{ background: c }" @click="pick(c)"></span>
            </div>
        </div>
    </div>
</template>

<style>
.km-color-picker {
    position: absolute;
    z-index: 1060;
    top: 100%;
    left: 0;
    margin-top: 4px;
    padding: 8px;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .18);
    width: 244px;
}
.km-color-group-title {
    font-size: 12px;
    color: #999;
    margin: 2px 0 4px;
}
.km-color-grid {
    display: flex;
    flex-wrap: wrap;
}
.km-color-cell {
    width: 16px;
    height: 16px;
    margin: 1px;
    border: 1px solid rgba(0, 0, 0, .12);
    cursor: pointer;
}
.km-color-cell:hover {
    outline: 1px solid #333;
}
</style>
