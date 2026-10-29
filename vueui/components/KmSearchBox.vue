<script setup>
/**
 * 搜索框（移植 searchBox 指令）：Ctrl/F 唤起，Enter/Shift+Enter 前后跳转，
 * 支持节点文本与备注内容检索。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { km } from '../store.js';

const showSearch = ref(false);
const showTip = ref(false);
const keyword = ref('');
const tip = ref('');
const inputEl = ref(null);

let nodeSequence = [];
let searchSequence = [];
let lastKeyword = null;
let lastIndex = 0;

function makeNodeSequence() {
    nodeSequence = [];
    km.minder.getRoot().traverse(node => nodeSequence.push(node));
}

function makeSearchSequence(kw) {
    searchSequence = [];
    const lower = kw.toLowerCase();
    for (const node of nodeSequence) {
        const text = node.getText().toLowerCase();
        if (text.indexOf(lower) !== -1) searchSequence.push({ node });
        const note = node.getData('note');
        if (note && note.toLowerCase().indexOf(lower) !== -1) {
            searchSequence.push({ node, keyword: lower });
        }
    }
}

function setSearchResult(node, previewKeyword) {
    km.minder.execCommand('camera', node, 50);
    setTimeout(() => {
        km.minder.select(node, true);
        if (!node.isExpanded()) km.minder.execCommand('expand', true);
        if (previewKeyword) {
            km.minder.fire('shownoterequest', { node, keyword: previewKeyword });
        }
    }, 60);
}

function doSearch(direction) {
    showTip.value = false;
    km.minder.fire('hidenoterequest');

    if (!keyword.value || !/\S/.exec(keyword.value)) {
        inputEl.value && inputEl.value.focus();
        return;
    }

    const kw = keyword.value.toLowerCase();
    const newSearch = lastKeyword !== kw;
    lastKeyword = kw;
    if (newSearch) makeSearchSequence(kw);

    showTip.value = true;
    if (searchSequence.length) {
        let curIndex = newSearch ? 0 : (direction === 'next' ? lastIndex + 1 : lastIndex - 1) || 0;
        curIndex = (searchSequence.length + curIndex) % searchSequence.length;

        setSearchResult(searchSequence[curIndex].node, searchSequence[curIndex].keyword);
        lastIndex = curIndex;
        tip.value = '第 ' + (curIndex + 1) + ' 条，共 ' + searchSequence.length + ' 条';
    } else {
        tip.value = '第 0 条，共 0 条';
    }
}

function exitSearch() {
    inputEl.value && inputEl.value.blur();
    showSearch.value = false;
    km.minder.fire('hidenoterequest');
    window.editor && window.editor.receiver.selectAll();
}

function enterSearch() {
    showSearch.value = true;
    setTimeout(() => {
        if (inputEl.value) {
            inputEl.value.focus();
            if (keyword.value) {
                inputEl.value.setSelectionRange(0, keyword.value.length);
            }
        }
    }, 10);
}

function handleKeyDown(e) {
    if (e.key === 'Enter') doSearch(e.shiftKey ? 'prev' : 'next');
    if (e.key === 'Escape') exitSearch();
}

function onBodyKeydown(e) {
    if (e.key === 'f' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        enterSearch();
        e.preventDefault();
    }
}

let offContentChange = null;
let offSearchNode = null;

onMounted(() => {
    document.body.addEventListener('keydown', onBodyKeydown);
    km.minder.on('searchNode', enterSearch);
    km.minder.on('contentchange', makeNodeSequence);
    makeNodeSequence();
});

onBeforeUnmount(() => {
    document.body.removeEventListener('keydown', onBodyKeydown);
});
</script>

<template>
    <div id="search" class="search-box clearfix" v-show="showSearch">
        <div class="input-group input-group-sm search-input-wrap">
            <input type="text"
                   ref="inputEl"
                   class="form-control search-input"
                   v-model="keyword"
                   @keydown="handleKeyDown($event)" />
            <span class="input-group-addon search-addon" v-show="showTip" v-text="tip"></span>
        </div>
        <div class="btn-group btn-group-sm prev-and-next-btn" role="group">
            <button type="button" class="btn btn-default" @click="doSearch('prev')">
                <span class="glyphicon glyphicon-chevron-up"></span>
            </button>
            <button type="button" class="btn btn-default" @click="doSearch('next')">
                <span class="glyphicon glyphicon-chevron-down"></span>
            </button>
        </div>
        <div class="close-search" @click="exitSearch()">
            <span class="glyphicon glyphicon-remove"></span>
        </div>
    </div>
</template>
