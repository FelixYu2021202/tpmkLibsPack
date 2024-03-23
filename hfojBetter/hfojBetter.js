// ==UserScript==
// @name         Hfoj Better
// @namespace    http://hfoj.net/
// @version      1.1.0
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
        "SGFwcHlib2IgU2F5cyBZb3hp",
        "SGFwcHlib2Igc2F5cyAiQ3VhenlveGkgeW94aSEi",
        "RG9uJ3QgYmUgZGVjYWRlbnQhIQ==",
        "JUU3JThFJUE5TyVFNyU4RSVBOSVFNyU5QSU4NA==",
        "JUU2JThCJTlDJUU4JUIwJUEyJUU2JTlDJTg4JUU0JUJBJUFF",
        "JUU2JUIwJUE3JUU0JUJDJTlBJUU3JTg3JTgzJUVGJUJDJThDJUU2JUIwJUE3JUU2JTk3JUJBJUU3JTg3JTgz"
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

    /**
     * @type {NodeJS.Dict<RegExp>}
     */
    const regices = {
        home: /^\/$/,
        homeIn: /^\/home/,
        problems: /^\/p(\/?)$/,
        homework: /^\/homework(\/?)$/,
        homeworkIn: /^\/homework/,
        discuss: /^\/discuss(\/?)$/,
        discussIn: /^\/discuss/,
        record: /^\/record(\/?)$/,
        recordIn: /^\/record/,
        ranking: /^\/ranking(\/?)$/,
        userIn: /^\/user/,
        blogIn: /^\/blog/,
    };

    /**
     * 
     * @param {string} str
     * @param {string[]} regs
     */
    function match(str, regs) {
        let res = true;
        regs.forEach(reg => res &&= str.match(regices[reg]));
        return res;
    }

    /**
     * 
     * @param {string} str
     * @param {string[]} regs
     */
    function unmatch(str, regs) {
        let res = false;
        regs.forEach(reg => res ||= str.match(regices[reg]));
        return !res;
    }
    //#endregion

    //#region styles
    $(`<style>
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

    .exrand-select {
        /* border: 1px solid black; */
    }

    .exrand-selector {
        display: flex;
    }

    .exrand-submit {
        margin-top: 10px;
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
        --exrand-background: rgb(238 238 238);
    }
</style>`).appendTo($(document.body));
    //#endregion styles

    //#region removal
    if (match(relativePath, ["home"])) {
        $(".section.side:contains(\"推荐\")").remove();
        $(".section.side:contains(\"一言\")").remove();
    }
    if (match(relativePath, ["problems"])) {
        $(".section.side:contains(\"进入编辑模式\")").remove();
    }
    if (match(relativePath, ["discuss"])) {
        $(".section.side:contains(\"讨论节点\")").remove();
    }
    //#endregion removal

    //#region yiyan
    if (match(relativePath, ["home"])) {
        let yiyandiv = $(`<div class="section side visible" style="border-radius: 10px;">
    <div class="section__header">
        <h1 class="section__title">
            一言
        </h1>
        <p>
            ${decodeURIComponent(atob(yiyan[Math.floor(Math.random() * yiyan.length)]))}
        </p>
    </div>
</div>`).prependTo($(".large-3, .medium-3")[0]);
    }
    //#endregion yiyan

    //#region rand
    if (unmatch(relativePath, ["homeworkIn", "discussIn", "recordIn", "ranking", "userIn", "homeIn", "blogIn"])) {
        let randdiv = $(`<div class="section side visible" style="border-radius: 10px;">
    <div class="section__header">
        <h1 class="section__title">
            随机 ex
        </h1>
    </div>
</div>`);
        let randbody = $(`<div class="section__body">
</div>`).appendTo(randdiv);

        if (path.match(/\/p\/\w+/)) {
            let difspan = $(`*:contains(难度).problem__tag-item`);
            difspan.text(difspan.text().replace(/\d+/, d => difficulties[d]));
        }

        let randselects = $(`<div class="exrand-select">
    <div class="expanded button">
        选择难度
    </div>
</div>`);

        class Item {
            /**
             *
             * @param {number} inner
             * @param {JQuery<HTMLElement>} fa
             */
            constructor(inner, fa) {
                this.jqe = $(`<div exrand-difficulty-${inner} class="exrand-selector">
    <span class="exrand-text">${difficulties[inner]}</span>
</div>`).appendTo(fa);
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
            new Item(i, randselects);
        }
        randselects = randselects.appendTo(randbody);
        let selectorOpened = false;
        randselects.on("click", () => {
            if (!selectorOpened) {
                randselects.find(".exrand-selector").show();
            }
            else {
                randselects.find(".exrand-selector").hide();
            }
            selectorOpened = !selectorOpened;
        });
        randselects.find(".exrand-selector").hide();

        let randbut = $(`<div>
    <p class="expanded button exrand-submit">
        随机
    </p>
</div>`).appendTo(randbody);

        randbut.on("click", () => {
            let selected = "";
            selectedDifficulties.forEach((v, i) => {
                if (v) {
                    selected += "," + i;
                }
            })
            selected = selected.substring(1);
            if (domain) {
                $.ajax({
                    method: "GET",
                    url: `/d/${domain}/p?q=difficulty:${selected}`,
                    headers: {
                        accept: "application/json"
                    },
                    success(res) {
                        let cnt = res.pcount;
                        let sp = Math.ceil(Math.random() * cnt);
                        let pg = Math.ceil(sp / 100);
                        let id = (sp - 1) % 100 + 1;
                        $.get(`/d/${domain}/p?q=difficulty:${selected}&page=${pg}`, res => {
                            let pid = $(res).find(".col--pid")[id].innerText;
                            location = `/p/${pid}`;
                        });
                    }
                });
            }
            else {
                $.ajax({
                    method: "GET",
                    url: `/p?q=difficulty:${selected}`,
                    headers: {
                        accept: "application/json"
                    },
                    success(res) {
                        let cnt = res.pcount;
                        let sp = Math.ceil(Math.random() * cnt);
                        let pg = Math.ceil(sp / 100);
                        let id = (sp - 1) % 100;
                        $.ajax({
                            method: "GET",
                            url: `/p?q=difficulty:${selected}&page=${pg}`,
                            headers: {
                                accept: "application/json"
                            },
                            success(res) {
                                console.log(res);
                                let pid = res.pdocs[id].docId;
                                location = `/p/${pid}`;
                            }
                        });
                    }
                });
            }
        });
        randdiv = randdiv.prependTo($(".large-3, .medium-3")[0]);
    }
    //#endregion rand

})();
