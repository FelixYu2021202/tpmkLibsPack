// ==UserScript==
// @name         Hfoj Better
// @namespace    http://hfoj.net/
// @version      1.2.0
// @description  Add functions to hfoj
// @author       cosf
// @match        http://*.hfoj.net/*
// @icon         http://hfoj.net/favicon.ico
// ==/UserScript==

// JQuery-v3.7.1 already satisfied by hfoj.

(function () {
    'use strict';
    if (typeof $ == "undefined") {
        $ = require("jquery");
    }

    //#region prework
    /**
     * @param {string} que
     * @returns {NodeJS.Dict<string>}
     */
    function parseSearch(que) {
        let res = {};
        que.substring(1).split("&").forEach(q => {
            let c = q.split("=");
            res[c[0]] = c[1];
        });
        return res;
    }

    /**
     * @param {string} coo
     * @returns {NodeJS.Dict<string>}
     */
    function parseCookie(coo) {
        let res = {};
        coo.split("; ").forEach(q => {
            let c = q.split("=");
            res[c[0]] = c[1];
        });
        return res;
    }

    const path = location.pathname;
    const domain = path.match(/\/d\/(\w+)/)?.[1];
    const relativePath = domain ? path.replace(/\/d\/(\w+)/, "") : path;
    const queries = parseSearch(location.search);
    const cookies = parseCookie(document.cookie);

    const user = $("a.nav__item").last()[0].href.match(/\d+$/)[0];

    /**
     * @returns {string}
     */
    function ppwd() {
        return domain ? `/d/${domain}` : "";
    }
    //#endregion prework

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

    const verdicts = {
        1: "Accepted",
        2: "Wrong Answer",
        7: "Compile Error",
        8: "System Error",
        20: "Running",
    }

    const verdictColors = {
        1: "#61c25a",
        2: "#fb6666",
        7: "#fb6666",
        8: "#fb6666",
        20: "#f3a83f",
    }

    const verdictTextColors = {
        1: "#25ad40",
        2: "#fb5555",
        7: "#fb5555",
        8: "#fb5555",
        20: "#f3a83f",
    }

    const verdictBackgroundColors = {
        1: "#90ffa0",
        2: "#ffbbbb",
        7: "#ffbbbb",
        8: "#ffbbbb",
        20: "#fff8bf"
    }

    const regices = {
        home: /^\/$/,
        homeIn: /^\/home/,
        problems: /^\/p(\/?)$/,
        problem: /^\/p\/\w+(\/?)$/,
        pid: /([^\/]+)(\/?)$/,
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
     * @param {(keyof regices)[]} regs
     */
    function match(str, regs) {
        let res = true;
        regs.forEach(reg => res &&= str.match(regices[reg]));
        return res;
    }

    /**
     * 
     * @param {string} str
     * @param {(keyof regices)[]} regs
     */
    function unmatch(str, regs) {
        let res = false;
        regs.forEach(reg => res ||= str.match(regices[reg]));
        return !res;
    }

    const stdlang = {
        luogu: "luogu.cxx/14/gcco2",
        [null]: "cc.cc17o2",
        [undefined]: "cc.cc17o2",
        python: "py.py3",
        ybtqm: "cc.cc17o2",
        ybttg: "cc.cc17o2",
        jjzn: "cc.cc17o2",
        codeforces: "yoxi"
    };

    const stdlangdis = {
        luogu: "NOI 标准语言 C++14 (O2)",
        [null]: "C++17 (O2)",
        [undefined]: "C++17 (O2)",
        python: "Python 3",
        ybtqm: "C++17 (O2)",
        ybttg: "C++17 (O2)",
        jjzn: "C++17 (O2)",
        codeforces: "**无法提交**"
    };
    //#endregion data

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

    .smc-sbm {
        display: flex;
        flex-direction: row;
        height: 40.15px;
    }

    .smc-sbmi {
        height: 40.15px;
        line-height: 40.15px;
    }

    .smc-sbms {
        padding-left: 10px;
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

    //#region 404-check
    if ($(".error__container").length > 0) {
        let tit = $("h1").first();
        tit.text("错误！3秒后返回上一页");
        let timeout = setTimeout(() => {
            history.go(-1);
        }, 3000);
        tit.on("dblclick", () => {
            tit.text("错误！");
            clearTimeout(timeout);
        });
        return;
    }
    //#endregion 404-check

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
        randselects.children().first().on("click", () => {
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
            $.ajax({
                method: "GET",
                url: `${ppwd()}/p?q=difficulty:${selected}`,
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
                        url: `${ppwd()}/p?q=difficulty:${selected}&page=${pg}`,
                        headers: {
                            accept: "application/json"
                        },
                        success(res) {
                            console.log(res);
                            let pid = res.pdocs[id].docId;
                            location = `${ppwd()}/p/${pid}`;
                        }
                    });
                }
            });
        });
        randdiv = randdiv.prependTo($(".large-3, .medium-3")[0]);
    }
    //#endregion rand

    //#region submit-code
    if (match(relativePath, ["problem"])) {
        let prob = relativePath.match(regices.pid)[1];

        let submissionbody = $(`<div class="section__body"></div>`);

        class Submission {
            /**
             * @param {string} subid
             * @param {"appendTo" | "prependTo"} mode
             */
            constructor(subid, mode) {
                this.subid = subid;
                console.log(this.subid);
                this.jqe = $(`<a class="smc-sbm" href="${ppwd()}/record/${this.subid}" target="_blank"></a>`)[mode](submissionbody);
                this.update();
            }

            update() {
                let self = this;
                $.ajax({
                    url: `${ppwd()}/record/${self.subid}`,
                    method: "GET",
                    headers: {
                        accept: "application/json"
                    },
                    success(res) {
                        let sbr = res.rdoc;
                        if (sbr.status > 8) {
                            setTimeout(self.update, 500);
                        }
                        if (!sbr.judgeAt) {
                            sbr.judgeAt = "Judging";
                        }
                        self.jqe.html(`<span style="border-left: .1875rem solid ${verdictColors[sbr.status]}; color: ${verdictTextColors[sbr.status]}" class="smc-sbmi smc-sbms">
    ${sbr.score} ${verdicts[sbr.status]}
</span>
<span style="margin-left: auto">
    ${sbr.judgeAt}
</span>
`);
                        if (!sbr.progress) {
                            sbr.progress = 0;
                        }
                        self.jqe.css(`background", "rgb(0, 0) linear-gradient(to right, ${verdictBackgroundColors[sbr.status]} ${sbr.progress}%, rgba(0, 0, 0, 0) ${sbr.progress}%) repeat scroll 0% 0% / auto border-box border-box`);
                    }
                });
            }
        }

        function fetchSubmittions() {
            $.ajax({
                url: `${ppwd()}/record?uidOrName=${user}&pid=${prob}`,
                method: "GET",
                headers: {
                    accept: "application/json"
                },
                success(res) {
                    let sbm = res.rdocs;
                    sbm.forEach(v => {
                        new Submission(v._id, "appendTo");
                    });
                }
            });
        }

        /**
         * @param {Response} res
         */
        function addSubmittions(res) {
            let subid = res.url.match(regices.pid)[0];
            new Submission(subid, "prependTo");
        }

        fetchSubmittions();

        let submitbut = $(`<input type="submit" class="rounded primary button" value="递交"></input>`);
        submitbut.on("click", () => {
            let value = $("textarea").val();
            fetch(`${ppwd()}/p/${prob}/submit`, {
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "max-age=0",
                    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryHappybobSaysYoxi",
                    "upgrade-insecure-requests": "1"
                },
                referrer: `${ppwd()}/p/${prob}/submit`,
                referrerPolicy: "strict-origin-when-cross-origin",
                body: `------WebKitFormBoundaryHappybobSaysYoxi\r\nContent-Disposition: form-data; name="lang"\r\n\r\n${stdlang[domain]}\r\n------WebKitFormBoundaryHappybobSaysYoxi\r\nContent-Disposition: form-data; name="code"\r\n\r\n${value}\r\n------WebKitFormBoundaryHappybobSaysYoxi\r\nContent-Disposition: form-data; name="file"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryHappybobSaysYoxi--\r\n`,
                method: "POST",
                mode: "cors",
                credentials: "include"
            }).then(addSubmittions);
        });

        let submitbody = $(`<div class="section__body">
    <label>
        代码语言：${stdlangdis[domain]}
    </label>
    <div class="medium-12">
        <textarea class="textbox monospace" spellcheck="false"></textarea>
    </div>
</div>`).append(submitbut);
        let submitdiv = $(`<div class="section visible">
    <div class="section__header">
        提交代码
    </div>
</div>`).append(submitbody);
        let submissiondiv = $(`<div class="section visible">
    <div class="section__header">
        提交记录
    </div>
</div>`).append(submissionbody);
        $(".medium-9.columns").append(submitdiv, submissiondiv);
    }
    //#endregion submit-code
})();
