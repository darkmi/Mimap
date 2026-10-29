/**
 * 以传统 <script>（非严格模式）方式加载脚本，保证求值顺序。
 */
export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve(url);
        script.onerror = () => reject(new Error('Failed to load script: ' + url));
        document.head.appendChild(script);
    });
}
