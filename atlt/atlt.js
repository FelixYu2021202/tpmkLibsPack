// ==UserScript==
// @name         Atcoder-Luogu Teleporter
// @namespace    http://atcoder.jp/
// @version      v1.0.0
// @description  Teleport to Luogu problem from Atcoder.
// @author       cosf
// @match        https://atcoder.jp/contests/*/tasks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// ==/UserScript==

setTimeout(function () {
    'use strict';

    let parsed = location.pathname.split('/');
    if (parsed.length == 5) {
        let p = parsed[4];
        $(`<a class="btn btn-default btn-sm" href="https://www.luogu.com.cn/problem/AT_${p}" target="_blank">Luogu</a>`).appendTo($(`.h2`));
    }
}, 1000);
