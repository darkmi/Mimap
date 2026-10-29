<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdExec } from '../interact.js';
import { kmDropdown } from './km-dropdown.js';

const vKmDropdown = kmDropdown;
const levels = [1, 2, 3, 4, 5, 6];
</script>

<template>
    <div class="btn-group-vertical" v-km-dropdown>
        <button type="button"
                class="btn btn-default expand"
                :title="t('ui', 'expandtoleaf')"
                @click="km.minder.execCommand('ExpandToLevel', 9999)"></button>
        <button type="button"
                class="btn btn-default expand-caption dropdown-toggle"
                :title="t('ui', 'expandtoleaf')">
            <span class="caption">{{ t('ui', 'expandtoleaf') }}</span>
            <span class="caret"></span>
            <span class="sr-only">{{ t('ui', 'expandtoleaf') }}</span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li v-for="level in levels" :key="level">
                <a href @click.prevent="km.minder.execCommand('ExpandToLevel', level)">
                    {{ t('ui/command', 'expandtolevel' + level) }}
                </a>
            </li>
        </ul>
    </div>
</template>
