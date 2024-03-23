// ==UserScript==
// @name         Hfoj Better
// @namespace    http://hfoj.net/
// @version      1.0.0
// @description  Add functions to hfoj
// @author       cosf
// @match        http://*.hfoj.net/*
// @icon         http://hfoj.net/favicon.ico
//
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// ==/UserScript==

(function () {
    'use strict';
    if (typeof $ == "undefined") {
        $ = require("jquery");
    }

    /**
     *
     * @param {string} que
     * @returns {{[key: string]: string}}
     */
    function parseSearch(que) {
        let res = {};
        que.substring(1).split("&").forEach(q => {
            let c = q.split("=");
            res[c[0]] = c[1];
        });
        return res;
    }

    const path = location.pathname;
    const domain = path.match(/\/d\/(\w+)/)?.[1];
    const relativePath = domain ? path.replace(/\/d\/(\w+)/, "") : path;
    const queries = parseSearch(location.search);

    //#region data
    const yiyan = [
        atob("SGFwcHlib2IgU2F5cyBZb3hp"),
        atob("SGFwcHlib2Igc2F5cyAiQ3VhenlveGkgeW94aSEi"),
        atob("RG9uJ3QgYmUgZGVjYWRlbnQhIQ==")
    ];
    const difficulties = [
        "其他 (0)",
        "入门 (1)",
        "普及- (2)",
        "普及/提高- (3)",
        "普及+/提高 (4)",
        "提高+/省选- (5)",
        "省选/NOI- (6)",
        "NOI/NOI+/CTSC (7)",
        "(8)",
        "(9)",
        "(10)"
    ];

    if (!localStorage.getItem("selectedDifficulties")) {
        localStorage.setItem("selectedDifficulties", "[1,1,1,1,1,1,1,1]");
    }

    const selectedDifficulties = JSON.parse(localStorage.getItem("selectedDifficulties"));

    const selectedTags = ["unselected", "selected"];

    const regices = {
        loadYiyan: /a/,
    };
    //#endregion

    //#region styles
    $(`
        <style>
            .section {
                border-radius: 10px;
            }

            .exrand-block {
                width: 20px;
                height: 20px;
                margin: 10px;
                border: 1px solid black;
                display: block;
                text-align: center;
                line-height: 20px;
            }

            .exrand-selector {
                display: flex;
            }
            .exrand-text {
                margin-top: 10px;
                margin-bottom: 10px;
                line-height: 20px;
            }

            *[unselected] {
                background-color: var(--exrand-unselected);
            }

            *[selected] {
                background-color: var(--exrand-selected);
            }

            * {
                --exrand-selected: rgb(60 65 80);
                --exrand-unselected: rgb(255 255 255);
            }
        </style>
    `).appendTo($(document.body));
    //#endregion styles

    //#region tags
    if (relativePath == "/") {
        $(".section.side.nojs--hide")[1]?.remove();
    }
    let yiyandiv = $(`
        <div class="section side visible" style="border-radius: 10px;">
            <div class="section__header">
                <h1 class="section__title">
                    一言
                </h1>
                <p>
                    ${yiyan[Math.floor(Math.random() * yiyan.length)]}
                </p>
            </div>
        </div>
    `).prependTo($(".large-3, .medium-3")[0]);
    let randdiv = $(`
        <div class="section side visible" style="border-radius: 10px;">
            <div class="section__header">
                <h1 class="section__title">
                    随机 ex
                </h1>
            </div>
        </div>
    `).prependTo($(".large-3, .medium-3")[0]);
    let randbody = $(`
        <div class="section__body">
        </div>
    `).appendTo(randdiv);

    if (path.match(/\/p\/\w+/)) {
        let difspan = $(`*:contains(难度).problem__tag-item`);
        difspan.text(difspan.text().replace(/\d+/, d => difficulties[d]));
    }
    //#endregion tags

    //#region rand
    class Item {
        /**
         *
         * @param {number} inner
         * @param {JQuery<HTMLElement>} fa
         */
        constructor(inner, fa) {
            this.jqe = $(`
                <div exrand-difficulty-${inner} class="exrand-selector">
                    <span class="exrand-text">${difficulties[inner]}</span>
                </div>
            `).appendTo(fa);
            this.box = $(`<span class="exrand-block" ${selectedTags[selectedDifficulties[inner]]}></span>`).prependTo(this.jqe);
            this.jqe.on("click", () => {
                this.box.removeAttr(selectedTags[selectedDifficulties[inner]]);
                selectedDifficulties[inner] = 1 - selectedDifficulties[inner];
                localStorage.setItem("selectedDifficulties", JSON.stringify(selectedDifficulties));
                this.box.attr(selectedTags[selectedDifficulties[inner]], "");
            });
        }
    }
    for (let i = 0; i < 8; i++) {
        new Item(i, randbody);
    }
    let randbut = $(`
        <div>
            <p class="expanded button">
                随机
            </p>
        </div>
    `).appendTo(randbody);

    randbut.on("click", () => {
        let selected = "";
        selectedDifficulties.forEach((v, i) => {
            if (v) {
                selected += "," + i;
            }
        })
        selected = selected.substring(1);
        if (domain) {
            $.get(`/d/${domain}/p?q=difficulty:${selected}`, res => {
                let cnt = Number(res.match(/(\d+) 道题/)[1]);
                let sp = Math.ceil(Math.random() * cnt);
                let pg = Math.ceil(sp / 100);
                let id = (sp - 1) % 100 + 1;
                $.get(`/d/${domain}/p?q=difficulty:${selected}&page=${pg}`, res => {
                    let pid = $(res).find(".col--pid")[id].innerText;
                    location = `/d/${domain}/p/${pid}`;
                });
            });
        }
        else {
            $.get(`/p?q=difficulty:${selected}`, res => {
                let cnt = Number(res.match(/(\d+) 道题/)[1]);
                let sp = Math.ceil(Math.random() * cnt);
                let pg = Math.ceil(sp / 100);
                let id = (sp - 1) % 100 + 1;
                $.get(`/p?q=difficulty:${selected}&page=${pg}`, res => {
                    let pid = $(res).find(".col--pid")[id].innerText;
                    location = `/p/${pid}`;
                });
            });
        }
    });
    //#endregion rand

})();
