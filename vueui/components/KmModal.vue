<script setup>
/**
 * 轻量模态弹窗：复用 Bootstrap 3 的 modal 样式类。
 * Esc 关闭；打开后自动聚焦第一个 [data-autofocus] 元素。
 */
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';

const props = defineProps({
    modelValue: Boolean,
    width: { type: String, default: '600px' }
});
const emit = defineEmits(['update:modelValue']);

const rootEl = ref(null);

function close() {
    emit('update:modelValue', false);
}

function onKeydown(e) {
    if (e.key === 'Escape') close();
}

watch(() => props.modelValue, async(open) => {
    if (open) {
        window.editor && window.editor.fsm.jump('modal', 'ui-modal');
        document.addEventListener('keydown', onKeydown);
        await nextTick();
        const target = rootEl.value && rootEl.value.querySelector('[data-autofocus]');
        if (target) {
            target.focus();
            if (target.setSelectionRange && target.type === 'text') {
                target.setSelectionRange(0, target.value.length);
            }
        }
    } else {
        document.removeEventListener('keydown', onKeydown);
        window.editor && window.editor.fsm.jump('normal', 'ui-modal-finish');
        window.editor && window.editor.receiver.selectAll();
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
    <Teleport to="body">
        <div v-if="modelValue" class="km-modal-mask" @mousedown.self="close">
            <div class="modal-dialog" ref="rootEl" :style="{ width: width, margin: '100px auto' }">
                <div class="modal-content">
                    <slot :close="close"></slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style>
.km-modal-mask {
    position: fixed;
    inset: 0;
    z-index: 1050;
    overflow-x: hidden;
    overflow-y: auto;
    background: rgba(0, 0, 0, .5);
}
</style>
