<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { kmDropdown } from './km-dropdown.js';

const vKmDropdown = kmDropdown;
const items = ['revert', 'siblings', 'level', 'path', 'tree'];

function select(mode) {
    const m = km.minder;
    const selected = m.getSelectedNodes();
    let selection = [];
    if (mode === 'all') {
        m.getRoot().traverse(node => selection.push(node));
    } else if (mode === 'revert') {
        m.getRoot().traverse(node => { if (selected.indexOf(node) === -1) selection.push(node); });
    } else if (mode === 'siblings') {
        selected.forEach(node => {
            if (!node.parent) return;
            node.parent.children.forEach(sibling => {
                if (selection.indexOf(sibling) === -1) selection.push(sibling);
            });
        });
    } else if (mode === 'level') {
        const levels = selected.map(node => node.getLevel());
        m.getRoot().traverse(node => {
            if (levels.indexOf(node.getLevel()) !== -1) selection.push(node);
        });
    } else if (mode === 'path') {
        selected.forEach(node => {
            while (node && selection.indexOf(node) === -1) {
                selection.push(node);
                node = node.parent;
            }
        });
    } else if (mode === 'tree') {
        selected.forEach(parent => {
            parent.traverse(node => {
                if (selection.indexOf(node) === -1) selection.push(node);
            });
        });
    }
    m.select(selection, true);
    m.fire('receiverfocus');
}
</script>

<template>
    <div class="btn-group-vertical" v-km-dropdown>
        <button type="button"
                class="btn btn-default select"
                :title="t('ui', 'selectall')"
                @click="select('all')"></button>
        <button type="button"
                class="btn btn-default select-caption dropdown-toggle"
                :title="t('ui', 'selectall')">
            <span class="caption">{{ t('ui', 'selectall') }}</span>
            <span class="caret"></span>
            <span class="sr-only">{{ t('ui', 'selectall') }}</span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li v-for="item in items" :key="item">
                <a href @click.prevent="select(item)">{{ t('ui', 'select' + item) }}</a>
            </li>
        </ul>
    </div>
</template>
