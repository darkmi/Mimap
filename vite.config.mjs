import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173
    },
    build: {
        outDir: 'dist',
        // vue-main.js 使用顶层 await（按序加载非严格模式的 IIFE 库）
        target: 'es2022'
    }
});
