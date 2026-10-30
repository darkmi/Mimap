import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    retries: 1,
    // 串行执行：避免多浏览器实例并发加载 Vite dev 时的资源竞争干扰
    workers: 1,
    fullyParallel: false,
    use: {
        baseURL: 'http://localhost:5173',
        headless: true
    },
    webServer: {
        command: 'npx vite --port 5173',
        url: 'http://localhost:5173',
        reuseExistingServer: true,
        timeout: 15000
    }
});
