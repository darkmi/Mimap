/**
 * 修补 cjs-to-esm 的残留问题（一次性）：
 * 1. 把绝对路径 import 改回相对路径
 * 2. editor.js 的 assemble(require(...)) 形态转成 import + 引用
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { relative, dirname } from 'node:path';

function fixImports(file) {
    let src = readFileSync(file, 'utf8');
    const dir = dirname(file).replace(/\\/g, '/');
    src = src.replace(/from '([^']*\/src\/[^']*)'/g, (m, target) => {
        let rel = relative(dir, target).replace(/\\/g, '/');
        if (!rel.startsWith('.')) rel = './' + rel;
        return `from '${rel}'`;
    });
    src = src.replace(/import '([^']*\/src\/[^']*)'/g, (m, target) => {
        let rel = relative(dir, target).replace(/\\/g, '/');
        if (!rel.startsWith('.')) rel = './' + rel;
        return `import '${rel}'`;
    });
    writeFileSync(file, src);
}

for (const f of ['src/editor.js', 'src/expose-editor.js', 'src/lang.js', 'src/hotbox.js', 'src/minder.js',
    'src/runtime/clipboard-mimetype.js', 'src/runtime/clipboard.js', 'src/runtime/container.js',
    'src/runtime/drag.js', 'src/runtime/fsm.js', 'src/runtime/history.js', 'src/runtime/hotbox.js',
    'src/runtime/input.js', 'src/runtime/jumping.js', 'src/runtime/minder.js', 'src/runtime/node.js',
    'src/runtime/priority.js', 'src/runtime/progress.js', 'src/runtime/receiver.js',
    'src/tool/debug.js', 'src/tool/format.js', 'src/tool/innertext.js', 'src/tool/jsondiff.js',
    'src/tool/key.js', 'src/tool/keymap.js']) {
    fixImports(f);
}

// editor.js: assemble(require('./runtime/x')) → 顶部 import + assemble(x)
let editor = readFileSync('src/editor.js', 'utf8');
const imports = [];
editor = editor.replace(/assemble\(require\('\.\/runtime\/([\w-]+)'\)\);/g, (m, name) => {
    imports.push(`import ${name} from './runtime/${name}.js';`);
    return `assemble(${name});`;
});
editor = imports.join('\n') + '\n' + editor.replace(/^\s+/, '');
writeFileSync('src/editor.js', editor);
console.log('done');
