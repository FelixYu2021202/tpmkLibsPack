// ==UserScript==
// @name         Contest Standing Teleporter
// @namespace    http://luogu.com.cn/
// @version      0.1
// @description  Teleports to contest/standings
// @author       cosf
// @match        https://codeforces.com/problemset/problem/*
// @match        https://codeforces.com/*/problem/*
// ==/UserScript==

(function () {
    'use strict';
    $(() => {
        let href = location.href;
        let prob = href.match(/\/([0-9A-Za-z]+)$/)[1];
        let cont = href.match(/(\d+)\//)[1];
        console.log(cont, prob);
        let ui = $(".second-level-menu-list");
        $(`
            <li>
                <a href="/contest/${cont}/" target="_blank">
                    Contest
                </a>
            </li>
        `).appendTo(ui);
        $(`
            <li>
                <a href="/contest/${cont}/problem/${prob}">
                    Problem
                </a>
            </li>
        `).appendTo(ui);
        $(`
            <li>
                <a href="/contest/${cont}/standings/" target="_blank">
                    Standings
                </a>
            </li>
        `).appendTo(ui);
        $(`
            <li>
                <a href="/contest/${cont}/standings/friends/true" target="_blank">
                    F.S.
                </a>
            </li>
        `).appendTo(ui);
        $(`
            <li>
                <a href="https://luogu.com.cn/problem/CF${cont}${prob}" target="_blank">
                    Luogu
                </a>
            </li>
        `).appendTo(ui);
    });
})();