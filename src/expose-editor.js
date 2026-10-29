/**
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
