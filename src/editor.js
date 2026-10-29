import container from './runtime/container.js';
import fsm from './runtime/fsm.js';
import minder from './runtime/minder.js';
import receiver from './runtime/receiver.js';
import hotbox from './runtime/hotbox.js';
import input from './runtime/input.js';
import clipboardMimetype from './runtime/clipboard-mimetype.js';
import clipboard from './runtime/clipboard.js';
import drag from './runtime/drag.js';
import node from './runtime/node.js';
import history from './runtime/history.js';
import jumping from './runtime/jumping.js';
import priority from './runtime/priority.js';
import progress from './runtime/progress.js';
/**
     * 运行时
     */
    var runtimes = [];

    function assemble(runtime) {
        runtimes.push(runtime);
    }

    function KMEditor(selector) {
        this.selector = selector;
        for (var i = 0; i < runtimes.length; i++) {
            if (typeof runtimes[i] == 'function') {
                runtimes[i].call(this, this);
            }
        }
    }

    KMEditor.assemble = assemble;

    assemble(container);
    assemble(fsm);
    assemble(minder);
    assemble(receiver);
    assemble(hotbox);
    assemble(input);
    assemble(clipboardMimetype);
    assemble(clipboard);
    assemble(drag);
    assemble(node);
    assemble(history);
    assemble(jumping);
    assemble(priority);
    assemble(progress);


export default KMEditor;
