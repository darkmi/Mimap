<script setup>
/**
 * 左下角导航器（移植 navigator 指令）：kity.Paper 缩略图 + 视窗矩形 + 缩放控制。
 */
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { t } from '../lang.js';
import { km } from '../store.js';
import { cmdState, interactVersion } from '../interact.js';
import config from '../config.js';
import { memory } from '../memory.js';

const isNavOpen = ref(!memory.get('navigator-hidden'));
const zoom = ref(100);
const zoomPanEl = ref(null);
const previewerEl = ref(null);

let paper = null, nodeThumb = null, connectionThumb = null, visibleRect = null;
let contentView = null, visibleView = null;
let pathHandler = null;
let minder = null;

function zoomRadio(value) {
    if (!minder) return 0;
    const zoomStack = minder.getOption('zoom');
    const minValue = zoomStack[0];
    const maxValue = zoomStack[zoomStack.length - 1];
    return 1 - (value - minValue) / (maxValue - minValue);
}

function height(value) {
    const totalHeight = zoomPanEl.value ? zoomPanEl.value.clientHeight : 0;
    return zoomRadio(value) * totalHeight;
}

function getPathHandler(theme) {
    if (theme === 'tianpan' || theme === 'tianpan-compact') {
        return function(nodePathData, x, y, width, height) {
            const r = width >> 1;
            nodePathData.push('M', x, y + r, 'a', r, r, 0, 1, 1, 0, 0.01, 'z');
        };
    }
    return function(nodePathData, x, y, width, height) {
        nodePathData.push('M', x, y, 'h', width, 'v', height, 'h', -width, 'z');
    };
}

function updateContentView() {
    const view = minder.getRenderContainer().getBoundaryBox();
    contentView = view;

    const padding = 30;
    paper.setViewBox(
        view.x - padding - 0.5,
        view.y - padding - 0.5,
        view.width + padding * 2 + 1,
        view.height + padding * 2 + 1);

    const nodePathData = [];
    const connectionThumbData = [];

    minder.getRoot().traverse(node => {
        const box = node.getLayoutBox();
        pathHandler(nodePathData, box.x, box.y, box.width, box.height);
        if (node.getConnection() && node.parent && node.parent.isExpanded()) {
            connectionThumbData.push(node.getConnection().getPathData());
        }
    });

    paper.setStyle('background', minder.getStyle('background'));

    if (nodePathData.length) {
        nodeThumb.fill(minder.getStyle('root-background')).setPathData(nodePathData);
    } else {
        nodeThumb.setPathData(null);
    }

    if (connectionThumbData.length) {
        connectionThumb.stroke(minder.getStyle('connect-color'), '0.5%').setPathData(connectionThumbData);
    } else {
        connectionThumb.setPathData(null);
    }

    updateVisibleView();
}

function updateVisibleView() {
    visibleView = minder.getViewDragger().getView();
    visibleRect.setBox(visibleView.intersect(contentView));
}

function bind() {
    minder.on('layout layoutallfinish', updateContentView);
    minder.on('viewchange', updateVisibleView);
}

function unbind() {
    minder.off('layout layoutallfinish', updateContentView);
    minder.off('viewchange', updateVisibleView);
}

function toggleNavOpen() {
    isNavOpen.value = !isNavOpen.value;
    memory.set('navigator-hidden', !isNavOpen.value);
    if (isNavOpen.value) {
        bind();
        updateContentView();
        updateVisibleView();
    } else {
        unbind();
    }
}

function handActive() {
    interactVersion.value;
    return minder ? cmdState(minder, 'hand') === 1 : false;
}

function moveView(center, duration) {
    let box = visibleView;
    center.x = -center.x;
    center.y = -center.y;

    const viewMatrix = minder.getPaper().getViewPortMatrix();
    box = viewMatrix.transformBox(box);

    const targetPosition = center.offset(box.width / 2, box.height / 2);
    minder.getViewDragger().moveTo(targetPosition, duration);
}

function onWindowMouseup() {
    dragging = false;
    previewerEl.value.classList.remove('grab');
}
let dragging = false;

onMounted(async() => {
    minder = km.minder;
    if (!minder) return;
    minder.setDefaultOptions({ zoom: config.get('zoom') });
    await nextTick();

    const kity = window.kity;
    paper = new kity.Paper(previewerEl.value);
    nodeThumb = paper.put(new kity.Path());
    connectionThumb = paper.put(new kity.Path());
    visibleRect = paper.put(new kity.Rect(100, 100).stroke('red', '1%'));

    pathHandler = getPathHandler(minder.getTheme());
    minder.on('themechange', e => { pathHandler = getPathHandler(e.theme); });
    minder.on('zoom', e => { zoom.value = e.zoom; });

    paper.on('mousedown', e => {
        dragging = true;
        moveView(e.getPosition('top'), 200);
        previewerEl.value.classList.add('grab');
    });
    paper.on('mousemove', e => {
        if (dragging) moveView(e.getPosition('top'));
    });
    window.addEventListener('mouseup', onWindowMouseup);

    if (isNavOpen.value) {
        bind();
        updateContentView();
        updateVisibleView();
    }
});

onBeforeUnmount(() => {
    unbind();
    window.removeEventListener('mouseup', onWindowMouseup);
});
</script>

<template>
    <div class="nav-bar">
        <div class="nav-btn zoom-in"
             :title="t('ui', 'zoom-in')"
             :class="{ active: zoomRadio(zoom) === 0 }"
             @click="km.minder.execCommand('zoomIn')">
            <div class="icon"></div>
        </div>
        <div class="zoom-pan" ref="zoomPanEl">
            <div class="origin"
                 :style="{ transform: 'translate(0, ' + height(100) + 'px)' }"
                 @click="km.minder.execCommand('zoom', 100)"></div>
            <div class="indicator"
                 :style="{ transform: 'translate(0, ' + height(zoom) + 'px)', transition: 'transform 200ms' }"></div>
        </div>
        <div class="nav-btn zoom-out"
             :title="t('ui', 'zoom-out')"
             :class="{ active: zoomRadio(zoom) === 1 }"
             @click="km.minder.execCommand('zoomOut')">
            <div class="icon"></div>
        </div>
        <div class="nav-btn hand"
             :title="t('ui', 'hand')"
             :class="{ active: handActive() }"
             @click="km.minder.execCommand('hand')">
            <div class="icon"></div>
        </div>
        <div class="nav-btn camera"
             :title="t('ui', 'camera')"
             @click="km.minder.execCommand('camera', km.minder.getRoot(), 600)">
            <div class="icon"></div>
        </div>
        <div class="nav-btn nav-trigger"
             :class="{ active: isNavOpen }"
             @click="toggleNavOpen()"
             :title="t('ui', 'navigator')">
            <div class="icon"></div>
        </div>
    </div>
    <div class="nav-previewer" v-show="isNavOpen" ref="previewerEl"></div>
</template>
