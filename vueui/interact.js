/**
 * 交互状态订阅（interactchange + rAF 节流）。
 *
 * minder 的 interactchange/selectionchange/contentchange 事件统一汇聚为
 * 一个版本号（rAF 节流）；任何组件在模板/计算属性中读取该版本号后再
 * queryCommandState/Value，即自动建立响应式依赖。
 */
import { ref } from 'vue';

export const interactVersion = ref(0);

let bound = false;

export function bindInteract(minder) {
    if (bound) return;
    bound = true;
    let scheduled = false;
    const bump = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            interactVersion.value++;
        });
    };
    minder.on('interactchange selectionchange contentchange', bump);
}

/** 命令是否可用（-1 为不可用） */
export function cmdState(minder, command) {
    interactVersion.value; // 建立响应式依赖
    return minder.queryCommandState(command);
}

export function cmdValue(minder, command) {
    interactVersion.value;
    return minder.queryCommandValue(command);
}

export function cmdDisabled(minder, command) {
    return cmdState(minder, command) === -1;
}

/** 执行命令（不可用时忽略，等价旧模板的 `state === -1 || exec` 写法） */
export function cmdExec(minder, command, ...args) {
    if (cmdState(minder, command) === -1) return;
    return minder.execCommand(command, ...args);
}
