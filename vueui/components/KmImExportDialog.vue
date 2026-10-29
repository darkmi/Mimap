<script setup>
import { ref } from 'vue';
import KmModal from './KmModal.vue';

const props = defineProps({
    modelValue: Boolean,
    title: String,
    defaultValue: String,
    type: String // 'import' | 'export'
});
const emit = defineEmits(['update:modelValue', 'ok']);

const value = ref('');

function reset() {
    value.value = props.defaultValue || '';
}
defineExpose({ reset });

function shortCut(e) {
    e.stopPropagation();
    if (e.key === 'Enter' && props.type !== 'export') ok();
    if (e.key === 'Escape') emit('update:modelValue', false);
}

function ok() {
    if (value.value === '') return;
    emit('ok', value.value);
    emit('update:modelValue', false);
}
</script>

<template>
    <KmModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" width="600px">
        <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
        </div>
        <div class="modal-body">
            <textarea type="text"
                      class="form-control single-input"
                      rows="8"
                      data-autofocus
                      v-model="value"
                      :readonly="type === 'export'"
                      @keydown="shortCut($event)"></textarea>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="ok()" :disabled="type === 'import' && value === ''">OK</button>
            <button class="btn btn-warning" @click="$emit('update:modelValue', false)">Cancel</button>
        </div>
    </KmModal>
</template>
