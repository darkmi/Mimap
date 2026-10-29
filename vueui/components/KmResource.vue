<script setup>
import { ref } from 'vue';
import { km } from '../store.js';
import { cmdState, interactVersion } from '../interact.js';
import { closeAllDropdowns } from './km-dropdown.js';

const newResourceName = ref('');
const resourceListOpen = ref(false);

// interactchange 后从 minder 重建资源勾选列表（替代 $watch 深比较 + isInteracting 防抖方案）
function used() {
    interactVersion.value;
    const m = km.minder;
    if (cmdState(m, 'resource') === -1) return [];
    const selected = m.queryCommandValue('resource');
    return m.getUsedResource().map(name => ({
        name,
        selected: selected.indexOf(name) > -1
    }));
}

function toggleResource() {
    const m = km.minder;
    if (cmdState(m, 'resource') === -1) return;
    const resource = used().filter(r => r.selected).map(r => r.name);
    m.execCommand('resource', resource);
}

function resourceColor(name) {
    return km.minder.getResourceColor(name).toHEX();
}

function addResource() {
    const m = km.minder;
    const name = newResourceName.value;
    if (!name || !/\S/.test(name)) return;
    const origin = m.queryCommandValue('resource');
    if (origin.indexOf(name) === -1) {
        m.execCommand('resource', origin.concat(name));
    }
    newResourceName.value = '';
}

function onKeydown(e) {
    if (e.key === 'Enter') addResource();
}
</script>

<template>
    <div class="resource-editor">
        <div class="input-group">
            <input class="form-control" type="text"
                   v-model="newResourceName"
                   :disabled="cmdState(km.minder, 'resource') === -1"
                   @keydown="onKeydown" />
            <span class="input-group-btn">
                <button class="btn btn-default"
                        :disabled="cmdState(km.minder, 'resource') === -1"
                        @click="addResource()">添加</button>
            </span>
        </div>
        <div class="resource-dropdown clearfix" id="resource-dropdown">
            <ul class="km-resource" :class="{ open: resourceListOpen }"
                :disabled="cmdState(km.minder, 'resource') === -1">
                <li v-for="resource in used()" :key="resource.name">
                    <label :style="{ background: resourceColor(resource.name) }">
                        <input type="checkbox" v-model="resource.selected"
                               :disabled="cmdState(km.minder, 'resource') === -1"
                               @change="toggleResource()" />
                        <span>{{ resource.name }}</span>
                    </label>
                </li>
            </ul>
            <div class="resource-caret" @click.stop="resourceListOpen = !resourceListOpen">
                <span class="caret"></span>
            </div>
        </div>
    </div>
</template>
