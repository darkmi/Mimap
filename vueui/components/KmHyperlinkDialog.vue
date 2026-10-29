<script setup>
import { ref, computed } from 'vue';
import KmModal from './KmModal.vue';

const props = defineProps({
    modelValue: Boolean,
    link: Object
});
const emit = defineEmits(['update:modelValue', 'ok']);

const url = ref('');
const title = ref('');
const urlPassed = ref(true);
const titlePassed = ref(false);

const R_URL = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?((/|\\?|#)[^\\s]*)?$', 'i');

const formGroupClass = computed(() => urlPassed.value ? 'has-success' : 'has-error');

function reset() {
    url.value = (props.link && props.link.url) || '';
    title.value = (props.link && props.link.title) || '';
    urlPassed.value = true;
    titlePassed.value = false;
}
defineExpose({ reset });

function checkUrl() {
    urlPassed.value = R_URL.test(url.value);
}

function shortCut(e) {
    e.stopPropagation();
    if (e.key === 'Enter') ok();
}

function ok() {
    if (R_URL.test(url.value)) {
        emit('ok', { url: url.value, title: title.value });
        emit('update:modelValue', false);
    } else {
        urlPassed.value = false;
    }
}
</script>

<template>
    <KmModal :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" width="600px">
        <div class="modal-header">
            <h3 class="modal-title">链接</h3>
        </div>
        <div class="modal-body">
            <form>
                <div class="form-group" id="link-url-wrap" :class="formGroupClass">
                    <label for="link-url">链接地址：</label>
                    <input type="text" class="form-control"
                           v-model="url"
                           data-autofocus
                           @blur="checkUrl"
                           @keydown="shortCut"
                           id="link-url"
                           placeholder="必填：以 http(s):// 或 ftp:// 开头" />
                </div>
                <div class="form-group" :class="{ 'has-success': titlePassed }">
                    <label for="link-title">提示文本：</label>
                    <input type="text" class="form-control"
                           v-model="title"
                           @blur="titlePassed = true"
                           id="link-title"
                           placeholder="选填：鼠标在链接上悬停时提示的文本" />
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="ok()">确定</button>
            <button class="btn btn-warning" @click="$emit('update:modelValue', false)">取消</button>
        </div>
    </KmModal>
</template>

