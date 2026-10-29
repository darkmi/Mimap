<script setup>
/**
 * 顶部三页签（思路/外观/视图），DOM 结构对齐 uib-tabset 以复用 less。
 */
import { ref } from 'vue';
import { t } from '../lang.js';
import { km, ui } from '../store.js';

import KmUndoRedo from './KmUndoRedo.vue';
import KmAppendNode from './KmAppendNode.vue';
import KmArrange from './KmArrange.vue';
import KmOperation from './KmOperation.vue';
import KmHyperLinkBtn from './KmHyperLinkBtn.vue';
import KmImageBtn from './KmImageBtn.vue';
import KmNoteBtn from './KmNoteBtn.vue';
import KmPriority from './KmPriority.vue';
import KmProgress from './KmProgress.vue';
import KmResource from './KmResource.vue';
import KmTemplateList from './KmTemplateList.vue';
import KmThemeList from './KmThemeList.vue';
import KmLayoutBtn from './KmLayoutBtn.vue';
import KmStyleOperator from './KmStyleOperator.vue';
import KmFontOperator from './KmFontOperator.vue';
import KmExpandLevel from './KmExpandLevel.vue';
import KmSelectAll from './KmSelectAll.vue';
import KmSearchBtn from './KmSearchBtn.vue';

function switchTab(tab) {
    ui.activeTab = tab;
}
</script>

<template>
    <div v-if="km.minder">
        <ul class="nav nav-tabs">
            <li :class="{ active: ui.activeTab === 'idea' }">
                <a href @click.prevent="switchTab('idea')">{{ t('ui/tabs', 'idea') }}</a>
            </li>
            <li :class="{ active: ui.activeTab === 'appearance' }">
                <a href @click.prevent="switchTab('appearance')">{{ t('ui/tabs', 'appearence') }}</a>
            </li>
            <li :class="{ active: ui.activeTab === 'view' }">
                <a href @click.prevent="switchTab('view')">{{ t('ui/tabs', 'view') }}</a>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane" :class="{ active: ui.activeTab === 'idea' }">
                <km-undo-redo></km-undo-redo>
                <km-append-node></km-append-node>
                <km-arrange></km-arrange>
                <km-operation></km-operation>
                <km-hyper-link-btn></km-hyper-link-btn>
                <km-image-btn></km-image-btn>
                <km-note-btn></km-note-btn>
                <km-priority></km-priority>
                <km-progress></km-progress>
                <km-resource></km-resource>
            </div>
            <div class="tab-pane" :class="{ active: ui.activeTab === 'appearance' }">
                <km-template-list class="inline-directive"></km-template-list>
                <km-theme-list></km-theme-list>
                <km-layout-btn class="inline-directive"></km-layout-btn>
                <km-style-operator class="inline-directive"></km-style-operator>
                <km-font-operator class="inline-directive"></km-font-operator>
            </div>
            <div class="tab-pane" :class="{ active: ui.activeTab === 'view' }">
                <km-expand-level></km-expand-level>
                <km-select-all></km-select-all>
                <km-search-btn></km-search-btn>
            </div>
        </div>
    </div>
</template>
