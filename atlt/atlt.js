// ==UserScript==
// @name         Atcoder-Luogu Teleporter
// @namespace    http://atcoder.jp/
// @version      v1.0.1
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
        $(`<a class="btn btn-default btn-sm">Hide</a>`).on("click", () => {
            $("#menu-wrap").hide();
            $("nav").hide();
            $("#contest-nav-tabs").hide();
            $(".topcoder-like-circle").hide();
            $(".h2").hide();
            $("#task-lang-btn").hide();
            $("form").hide();
            $(".a2a_kit").hide();
            $(".container").last().hide();
            $("#fixed-server-timer").hide();
            $("#scroll-page-top").hide();
            $("hr").first().hide();
            $("hr").last().hide();
            $("hr").eq(-2).hide();
        }).appendTo($(`.h2`));
    }
}, 1000);
