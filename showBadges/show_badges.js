// ==UserScript==
// @name           Show Badges
// @namespace      http://luogu.com.cn/
// @version        1.2
// @description    Show badges
// @author         cosf
// @match          https://www.luogu.com.cn/user/*
// @grant          none
// ==/UserScript==

(function () {
    'use strict';
    function getBadge() {
        console.log("[Get Badge] Started loading...");
        let cookie = [
        ][0];
        let bgcolors = [
            "#BFBFBF",
            "#FE4C61",
            "#F39C11",
            "#FFC116",
            "#52C41A",
            "#3498DB",
            "#9D3DCF",
            "#0E1D69"
        ]
        let colors = [
            "#000000",
            "#000000",
            "#000000",
            "#000000",
            "#000000",
            "#FFFFFF",
            "#FFFFFF",
            "#FFFFFF",
        ]
        function load_training(href, div) {
            fetch(href + "#problems", {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "max-age=0",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "document",
                    "sec-fetch-mode": "navigate",
                    "sec-fetch-site": "same-origin",
                    "sec-fetch-user": "?1",
                    "upgrade-insecure-requests": "1",
                    "cookie": "SpilopeliaState=" + cookie.SpilopeliaState + "; __client_id=" + cookie.__client_id + "; _uid=" + cookie._uid,
                    "Referer": "https://www.luogu.com.cn/user/" + cookie._uid,
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": null,
                "method": "GET"
            }).then(res => res.text()).then(text => {
                let l = text.indexOf("decodeURIComponent(\"") + 20;
                let r = text.indexOf("\"));window._feConfigVersion");
                return text.substring(l, r);
            }).then(text => JSON.parse(decodeURIComponent(text)).currentData.training).then(p => {
                let mp = [0, 0, 0, 0, 0, 0, 0, 0];
                let len = p.problems.length;
                for (let i = 0; i < len; i++) {
                    if (!p.userScore || !p.userScore.status[p.problems[i].problem.pid]) {
                        mp[p.problems[i].problem.difficulty]++;
                    }
                }
                for (let i = 0; i < 8; i++) {
                    let span = document.createElement("span");
                    span.setAttribute("data-v-71731098", "");
                    span.setAttribute("data-v-57ac2e84", "");
                    span.setAttribute("data-v-29a65e17", "");
                    span.setAttribute("class", "lfe-caption tag");
                    span.setAttribute("style", "background: " + bgcolors[i] + "; color: " + colors[i] + ";");
                    span.innerText = mp[i].toString();
                    div.appendChild(span);
                    console.log(mp[i]);
                }
            });
        }
        function load_wrapper(list, id) {
            let div = list[id].children[0].children[0];
            load_training(div.children[0].href, div);
            if (id < list.length - 1) {
                setTimeout(load_wrapper, 500, list, id + 1);
            }
        }
        function load(list) {
            load_wrapper(list, 0);
        }
        let ref = document.location.href;
        if (ref.endsWith("problem.training") || ref.endsWith("favorite")) {
            load(document.getElementsByClassName("row-wrap")[0].children);
        }
    }
    setTimeout(getBadge, 2000);
})();
