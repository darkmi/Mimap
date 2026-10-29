/**
 * 将 src/ 下的 SeaJS CMD 模块（define(function(require, exports, module) {...})）
 * 原地转换为 ESM。仅在 Phase 0 迁移时运行一次：node scripts/cjs-to-esm.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';

function walk(dir) {
    const out = [];
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (name.endsWith('.js')) out.push(full.replace(/\\/g, '/'));
        else walk(full).forEach(f => out.push(f));
    }
    return out;
}
const files = walk('src');
let changed = 0;

for (const file of files) {
    let src = readFileSync(file, 'utf8');
    const original = src;

    // 1. 剥掉 define 包装（兼容 define('expose-editor', function...) 与空格差异）
    src = src.replace(
        /^define(?:\('[^']+',\s*)?\(?function\s*\(\s*require\s*,\s*exports\s*,\s*module\s*\)?\s*\{/,
        ''
    );
    // 2. 剥掉文件末尾的 });
    src = src.replace(/\}\)\s*;\s*$/, '');

    // 3. require → import
    src = src.replace(
        /^[ \t]*var\s+(\w+)\s*=\s*require\(\s*'([^']+)'\s*\);/gm,
        (m, name, id) => {
            const target = resolveId(id, dirname(file));
            return `import ${name} from '${target}';`;
        }
    );
    // 副作用 require
    src = src.replace(
        /^[ \t]*require\(\s*'([^']+)'\s*\);/gm,
        (m, id) => `import '${resolveId(id, dirname(file))}';`
    );

    // 4. 导出
    src = src.replace(/^[ \t]*return module\.exports\s*=\s*[^;]+;/gm, (m) => {
        const expr = m.replace(/^[ \t]*return module\.exports\s*=\s*/, '').replace(/;$/, '');
        return `export default ${expr};`;
    });
    src = src.replace(/^[ \t]*module\.exports\s*=\s*([^;]+);/gm, (m, expr) => `export default ${expr};`);

    if (src !== original) {
        writeFileSync(file, src);
        changed++;
        console.log('converted:', file);
    } else {
        console.log('SKIPPED (no change):', file);
    }
}
console.log(`\n${changed}/${files.length} files converted`);

function resolveId(id, fromDir) {
    // 裸模块名 'hotbox' 在 SeaJS 下以 base './src' 解析到 src/hotbox.js
    let resolved = id.startsWith('.') ? resolve(fromDir, id) : resolve('src', id);
    resolved = resolved.replace(/\\/g, '/');
    if (!resolved.endsWith('.js')) resolved += '.js';
    return resolved.startsWith('src/') ? '/' + resolved : resolved;
}
