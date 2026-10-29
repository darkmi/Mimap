<script setup>
import { ref, computed } from 'vue';
import KmModal from './KmModal.vue';
import config from '../config.js';

const props = defineProps({
    modelValue: Boolean,
    image: Object
});
const emit = defineEmits(['update:modelValue', 'ok']);

const R_URL = /^https?\:\/\/\w+/;

const activeTab = ref('url');
const url = ref('');
const title = ref('');
const urlPassed = ref(true);
const titlePassed = ref(false);
const searchKeyword = ref('');
const searchList = ref([]);
const uploading = ref(false);
const fileInput = ref(null);

const urlGroupClass = computed(() => urlPassed.value ? 'has-success' : 'has-error');

function reset() {
    url.value = (props.image && props.image.url) || '';
    title.value = (props.image && props.image.title) || '';
    urlPassed.value = true;
    titlePassed.value = false;
    activeTab.value = 'url';
    searchList.value = [];
}
defineExpose({ reset });

function checkUrl() {
    urlPassed.value = R_URL.test(url.value);
}

function shortCut(e) {
    e.stopPropagation();
    if (e.key === 'Enter') ok();
    if (e.key === 'Escape') emit('update:modelValue', false);
}

function selectImage(item) {
    url.value = item.url;
    title.value = item.title;
}

async function searchImage() {
    searchList.value = [];
    // 百度图片搜索接口（历史遗留，接口不可用时静默失败）
    const time = Date.now();
    const cb = 'JSON_CALLBACK';
    const urlStr = 'http://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&fp=result&queryWord='
        + encodeURIComponent(searchKeyword.value)
        + '&cl=2&lm=-1&ie=utf-8&oe=utf-8&st=-1&ic=0&word=' + encodeURIComponent(searchKeyword.value)
        + '&face=0&istype=2&nc=1&pn=60&rn=60&gsm=3c&' + time + '=&callback=' + cb;
    await new Promise((resolve) => {
        const script = document.createElement('script');
        const timer = setTimeout(() => { delete window[cb]; resolve(); }, 8000);
        window[cb] = function(json) {
            clearTimeout(timer);
            delete window[cb];
            if (json && json.data) {
                searchList.value = json.data.filter(d => d.objURL).map(d => ({
                    title: d.fromPageTitleEnc,
                    src: d.middleURL,
                    url: d.middleURL
                }));
            }
            resolve();
        };
        script.src = urlStr;
        script.onerror = () => { clearTimeout(timer); delete window[cb]; resolve(); };
        document.head.appendChild(script);
    });
}

async function uploadImage() {
    const input = fileInput.value;
    if (!input || !input.value) return;
    if (!/^.*\.(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG)$/.test(input.value)) {
        alert('后缀只能是 jpg、gif 及 png');
        return;
    }
    uploading.value = true;
    try {
        const fd = new FormData();
        fd.append('upload_file', input.files[0]);
        const resp = await fetch(config.get('imageUpload'), {
            method: 'POST',
            body: fd
        });
        const json = await resp.json();
        if (json.errno === 0 && json.data && json.data.url) {
            url.value = json.data.url;
        }
    } finally {
        uploading.value = false;
    }
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
            <h3 class="modal-title">图片</h3>
        </div>
        <div class="modal-body">
            <ul class="nav nav-tabs">
                <li :class="{ active: activeTab === 'search' }" @click="activeTab = 'search'">
                    <a href @click.prevent>图片搜索</a>
                </li>
                <li :class="{ active: activeTab === 'url' }" @click="activeTab = 'url'">
                    <a href @click.prevent>外链图片</a>
                </li>
                <li :class="{ active: activeTab === 'upload' }" @click="activeTab = 'upload'">
                    <a href @click.prevent>上传图片</a>
                </li>
            </ul>
            <div class="tab-content" style="padding-top: 12px">
                <div v-show="activeTab === 'search'" class="tab-pane">
                    <form class="form-inline" @submit.prevent="searchImage()">
                        <div class="form-group">
                            <label for="search-keyword">关键词：</label>
                            <input type="text" class="form-control" v-model="searchKeyword" id="search-keyword" placeholder="请输入搜索的关键词" />
                        </div>
                        <button type="submit" class="btn btn-primary">百度一下</button>
                    </form>
                    <div class="search-result" id="search-result">
                        <ul>
                            <li v-for="(img, i) in searchList" :key="i"
                                :id="'img-item' + i"
                                @click="selectImage(img)">
                                <img :id="'img-' + i" :src="img.src || ''" :alt="img.title" />
                                <span>{{ img.title }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div v-show="activeTab === 'url'" class="tab-pane">
                    <form>
                        <div class="form-group" :class="urlGroupClass">
                            <label for="image-url">链接地址：</label>
                            <input type="text" class="form-control" v-model="url" data-autofocus
                                   @blur="checkUrl" @keydown="shortCut" id="image-url"
                                   placeholder="必填：以 http(s):// 开头" />
                        </div>
                        <div class="form-group" :class="{ 'has-success': titlePassed }">
                            <label for="image-title">提示文本：</label>
                            <input type="text" class="form-control" v-model="title" @blur="titlePassed = true" id="image-title" placeholder="选填：鼠标在图片上悬停时提示的文本" />
                        </div>
                        <div class="form-group">
                            <label for="image-preview">图片预览：</label>
                            <img class="image-preview" id="image-preview" :src="url" :alt="title" />
                        </div>
                    </form>
                </div>
                <div v-show="activeTab === 'upload'" class="tab-pane">
                    <form>
                        <div class="form-group">
                            <input type="file" name="upload-image" id="upload-image" class="upload-image"
                                   accept=".jpg,.JPG,jpeg,JPEG,.png,.PNG,.gif,.GIF"
                                   ref="fileInput" @change="uploadImage()" />
                            <label for="upload-image" class="btn btn-primary"><span>选择文件&hellip;</span></label>
                            <span v-if="uploading" style="margin-left: 8px">上传中...</span>
                        </div>
                        <div class="form-group" :class="{ 'has-success': titlePassed }">
                            <label for="image-title">提示文本：</label>
                            <input type="text" class="form-control" v-model="title" @blur="titlePassed = true" id="image-title" placeholder="选填：鼠标在图片上悬停时提示的文本" />
                        </div>
                        <div class="form-group">
                            <label for="image-preview">图片预览：</label>
                            <img class="image-preview" id="image-preview" :src="url" :title="title" :alt="title" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-primary" @click="ok()">确定</button>
            <button class="btn btn-warning" @click="$emit('update:modelValue', false)">取消</button>
        </div>
    </KmModal>
</template>
