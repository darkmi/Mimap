/**
 * 语言查询助手。
 * t('ui/command', 'appendchildnode') → '插入下级主题'
 */
import zhCnLang from './lang.zh-cn.js';

export function t(block, text) {
    let dict = zhCnLang;
    block.split('/').forEach(seg => {
        if (dict != null) dict = dict[seg];
    });
    if (dict == null) return text;
    return dict[text] || text;
}

export { zhCnLang };
