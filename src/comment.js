// ==UserScript==
// @name         Userscript with Rollup
// @namespace    https://example.com
// @version      0.1
// @description  Descriptions 101.
// @author       You
// @match        https://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==
// @ts-ignore
// This line is needed b/c rollup will not import the file if nothing "usefull" is in it.
((w) =>{ if (w) { w.name = 'my-userscript';}})();
