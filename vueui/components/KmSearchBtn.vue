<script setup>
import { t } from '../lang.js';
import { km } from '../store.js';

function enterSearch() {
    km.minder.fire('searchNode');
}
</script>

<template>
    <div class="btn-group-vertical search-btn-group">
        <button type="button"
                class="btn btn-default search"
                :title="t('ui', 'search')"
                @click="enterSearch()"></button>
        <button type="button"
                class="btn btn-default search-caption"
                :title="t('ui', 'search')"
                @click="enterSearch()">
            <span class="caption">{{ t('ui', 'search') }}</span>
            <span class="sr-only">{{ t('ui', 'search') }}</span>
        </button>
    </div>
</template>
