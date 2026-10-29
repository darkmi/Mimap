/**
 * 编辑器配置。
 */
const config = {
    // 放大缩小比例档位
    zoom: [10, 20, 30, 50, 80, 100, 120, 150, 200],

    // 图片上传接口
    imageUpload: 'server/imageUpload.php',

    // 默认语言
    defaultLang: 'zh-cn'
};

export default {
    get(key) {
        if (arguments.length === 0) return config;
        return Object.prototype.hasOwnProperty.call(config, key) ? config[key] : '';
    },
    set(key, value) {
        const supported = Object.keys(config);
        const entries = typeof key === 'object' ? key : { [key]: value };
        for (const k of Object.keys(entries)) {
            if (!supported.includes(k)) {
                console.error('Unsupported config key: ', k, ', please choose in :', supported.join(', '));
                return false;
            }
            config[k] = entries[k];
        }
        return true;
    }
};
