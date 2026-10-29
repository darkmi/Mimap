/**
 * ESM 转换最终清理（一次性）：
 * 1. 删除残留的 define 包装行
 * 2. 剥掉仍残留在文件末尾的 });
 * 3. editor.js 非法标识符 clipboard-mimetype → clipboardMimetype
 * 4. key.js 补默认导出
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

function walk(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (name.endsWith('.js')) out.push(full.replace(/\\/g, '/'));
        else out.push(...walk(full));
    }
    return out;
}

const defineLine = /^[ \t]*define\((?:'[^']+',[ \t]*)?function\s*\(require,\s*exports,\s*module\)[ \t]*\{[ \t]*\r?\n/m;

for (const file of walk('src')) {
    let src = readFileSync(file, 'utf8');
    const before = src;

    src = src.replace(defineLine, '');

    // 文件末尾残留的 });
    src = src.replace(/\}\)\s*;\s*$/, '');

    // editor.js 非法标识符
    src = src.replace(/import clipboard-mimetype from/, 'import clipboardMimetype from');
    src = src.replace(/assemble\(clipboard-mimetype\)/, 'assemble(clipboardMimetype)');

    // key.js 默认导出
    src = src.replace(
        /[ \t]*exports\.hash = hash;\r?\n[ \t]*exports\.is = is;/,
        'const key = { hash, is };\n    export default key;'
    );

    if (src !== before) {
        writeFileSync(file, src);
        console.log('fixed:', file);
    }
}

// expose-editor.js 重写
writeFileSync('src/expose-editor.js', `/**
 * @fileOverview
 *
 * 打包暴露：把 KMEditor 挂到 window.kityminder.Editor
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
import KMEditor from './editor.js';

window.kityminder.Editor = KMEditor;

export default KMEditor;
`);
console.log('rewrote: src/expose-editor.js');
