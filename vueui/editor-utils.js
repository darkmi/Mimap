/**
 * 进入节点文本编辑态（appendNode / operation 按钮共用流程，
 * 节点文本编辑辅助。
 */
export function startEditText() {
    const editor = window.editor;
    const minder = window.minder;
    if (!editor || !minder) return;

    const receiverElement = editor.receiver.element;
    receiverElement.innerText = minder.queryCommandValue('text');
    editor.fsm.jump('input', 'input-request');
    editor.receiver.selectAll();
}
