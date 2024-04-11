// ==UserScript==
// @name         Hfoj Better
// @namespace    http://hfoj.net/
// @version      1.8.0
// @description  Add functions to hfoj
// @author       cosf
// @match        http://hfoj.net/*
// @match        http://hfoj.net
// @match        10.80.74.11/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      localhost:27121/
// @icon         http://hfoj.net/favicon.ico
// ==/UserScript==

(function () {
    'use strict';

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

    /**
     * @param {string} key
     * @returns {string}
     */
    function getSearch(key) {
        if (queries[key]) {
            return `${key}=${queries[key]}`;
        }
        else {
            return "";
        }
    }

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
        "JUU2JUIwJUE3JUU0JUJDJTlBJUU3JTg3JTgzJUVGJUJDJThDJUU2JUIwJUE3JUU2JTk3JUJBJUU3JTg3JTgz",
        "JUU2JTlDJTg4JUU0JUJBJUFFJUU1JUE1JUJEJUU5JTk3JUFBJUVGJUJDJThDJUU2JThCJTlDJUU4JUIwJUEyJUU2JTlDJTg4JUU0JUJBJUFF",
        "JUU4JThCJUE1JUU4JUEyJUFCJUU1JThGJTkxJUU3JThFJUIwJUU4JUJGJTlEJUU4JUE3JTg0JUVGJUJDJThDJUU1JUIwJTg2JUU4JUEyJUFCJTIwQ0NGJTIwJUU3JUE2JTgxJUU4JUI1JTlCJUU0JUI4JTg5JUU1JUI5JUI0JUUzJTgwJTgy",
        "WW91J3JlJTIwd3JvbmcuJTIwSGVyZSUyMGlzJTIwd2h5Lg==",
        "SGFwcHklMjBCb2IlMjBoZWxwcyUyMHlvdSUyMHRvJTIwZmVlbCUyMGxpa2UlMjBhJTIwcGVyc29uJTJDJTIwbm90JTIwYSUyMHBhdGllbnQu"
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
        0: "Waiting",
        1: "Accepted",
        2: "Wrong Answer",
        7: "Compile Error",
        8: "System Error",
        20: "Running",
        21: "Compiling",
        22: "Fetched",
    }

    const verdictIcon = {
        0: "schedule",
        1: "check",
        2: "close",
        7: "close",
        8: "close",
        20: "hourglass",
        21: "hourglass",
        22: "hourglass"
    }

    const verdictColors = {
        0: "#000000",
        1: "#61c25a",
        2: "#fb6666",
        7: "#fb6666",
        8: "#fb6666",
        20: "#f3a83f",
        21: "#f3a83f",
        22: "#f3a83f",
    }

    const verdictTextColors = {
        0: "#000000",
        1: "#25ad40",
        2: "#fb5555",
        7: "#fb5555",
        8: "#fb5555",
        20: "#f3a83f",
        21: "#f3a83f",
        22: "#f3a83f",
    }

    const verdictBackgroundColors = {
        0: "#000000",
        1: "#90ffa0",
        2: "#ffbbbb",
        7: "#ffbbbb",
        8: "#ffbbbb",
        20: "#fff8bf",
        21: "#fff8bf",
        22: "#fff8bf",
    }

    const regices = {
        home: /^\/$/,
        problems: /^\/p(\/?)$/,
        problem: /^\/p\/\w+(\/?)$/,
        pid: /([^\/]+)(\/?)$/,
        homeworkIn: /^\/homework\/(\w+)/,
        discuss: /^\/discuss(\/?)$/,
        discussIn: /^\/discuss\/(\w+)/,
        record: /^\/record(\/?)$/,
        recordIn: /^\/record\/(\w+)/,
        contestIn: /^\/contest\/(\w+)/,
        user: /^\/user\/(\d+)/,
        userIn: /^\/user\/(\w+)/,
        fileUser: /^\/file\/(\d+)/,
    };

    /**
     * 
     * @param {string} str
     * @param {(keyof regices)[]} regs
     */
    function match(str, regs) {
        let res = false;
        regs.forEach(reg => res = res || str.match(regices[reg]));
        return res;
    }

    const domains = ["luogu", "system", "python", "ybtqm", "ybttg", "jjzn", "codeforces"];

    const domainStdlang = {
        luogu: "luogu.cxx/14/gcco2",
        [null]: "cc.cc17o2",
        [undefined]: "cc.cc17o2",
        system: "cc.cc17o2",
        python: "py.py3",
        ybtqm: "cc.cc17o2",
        ybttg: "cc.cc17o2",
        jjzn: "cc.cc17o2",
        codeforces: "codeforces.54"
    };

    const domainStdlangdis = {
        luogu: "NOI 标准语言 C++14 (O2)",
        [null]: "C++17 (O2)",
        [undefined]: "C++17 (O2)",
        system: "C++17 (O2)",
        python: "Python 3",
        ybtqm: "C++17 (O2)",
        ybttg: "C++17 (O2)",
        jjzn: "C++17 (O2)",
        codeforces: "GNU G++17 7.3.0"
    };

    const domainName = {
        luogu: "洛谷",
        [null]: "主站",
        [undefined]: "主站",
        system: "主站",
        python: "Py",
        ybtqm: "启蒙",
        ybttg: "提高",
        jjzn: "进阶",
        codeforces: "CF"
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

    .jmp-right {
        margin-right: 10px !important;
    }

    .sb-margin-left {
        margin-left: 8px;
    }

    .sb-warning {
        background-color: #e78 !important;
    }

    .smc-icon {
        font-family: vj4icon;
    }

    .smc-pass::before {
        content: "\\ea0a";
    }

    .smc-wait::before {
        content: "\\ea2d";
    }

    .smc-incr::before {
        content: "\\ea0e";
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
        --exrand-selected: rgb(20 255 20);
        --exrand-unselected: rgb(128 128 128);
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
        let yiyandiv = $(`<div class="section side" style="border-radius: 10px;">
    <div class="section__header">
        <h1 class="section__title">
            一言
        </h1>
    </div>
    <div class="section__body">
        <p id="yiyan">
            ${decodeURIComponent(atob(yiyan[Math.floor(Math.random() * yiyan.length)]))}
        </p>
    </div>
</div>`).prependTo($(".large-3, .medium-3").first());
    }
    //#endregion yiyan

    //#region user
    if (match(relativePath, ["userIn"])) {
        let user = relativePath.match(regices.user)[1];
        let male = $(`*:contains("♂")`).length;
        let female = $(`*:contains("♀")`).length;
        let blog = $(`<a class="profile-header__contact-item tooltip drop-target drop-abutted drop-abutted-top drop-element-attached-bottom drop-element-attached-center drop-target-attached-top drop-target-attached-center" href="${ppwd()}/blog/${user}" target="_blank" data-tooltip="查看${male ? "他" : female ? "她" : "Ta"}的博客">
    <span class="icon icon-book"></span>
</a>`).prependTo(".profile-header__contact-bar");
    }
    //#endregion user

    //#region badge
    if (true) {
        let badge = JSON.parse(GM_getValue("hb-badge", JSON.stringify({
            34: {
                content: "Happybob",
                color: "#575757",
                textColor: "white"
            },
            35: {
                content: "cosf | 月亮",
                color: "#575757",
                textColor: "white"
            }
        })));
        setTimeout(() => {
            $(".user-profile-link").each(function () { // type 1
                let self = $(this);
                let link = self.children("a").first();
                if (!link.length) {
                    return;
                }
                let user = link.attr("href").match(regices.user)[1];
                if (badge[user]) {
                    let b = $(`<a class="user-profile-badge v-center tooltip drop-target drop-abutted drop-abutted-top drop-element-attached-bottom drop-element-attached-center drop-target-attached-top drop-target-attached-center sb-margin-left" href="${ppwd()}/user/${user}" data-tooltip="Hfoj Better Badge"
    style="color:${badge[user].textColor};background-color:${badge[user].color}">
    ${badge[user].content}
</a>`).insertAfter(self.children()[1]);
                }
            });
            $("*[data-uid]").each(function () { // type 2
                let self = $(this);
                let user = self.attr("data-uid");
                if (badge[user]) {
                    let b = $(`<a class="user-profile-badge v-center tooltip drop-target drop-abutted drop-abutted-top drop-element-attached-bottom drop-element-attached-center drop-target-attached-top drop-target-attached-center sb-margin-left" href="${ppwd()}/user/${user}" data-tooltip="Hfoj Better Badge"
    style="color:${badge[user].textColor};background-color:${badge[user].color}">
    ${badge[user].content}
</a>`).insertAfter(self.children().first().children().first().children()[1]);
                }
            });
            if (match(relativePath, ["userIn"])) { // type 3
                let user = relativePath.match(regices.user)[1];
                if (badge[user]) {
                    let b = $(`<a class="user-profile-badge v-center tooltip drop-target drop-abutted drop-abutted-top drop-element-attached-bottom drop-element-attached-center drop-target-attached-top drop-target-attached-center sb-margin-left" href="${ppwd()}/user/${user}" data-tooltip="Hfoj Better Badge"
    style="color:${badge[user].textColor};background-color:${badge[user].color}">
    ${badge[user].content}
</a>`).appendTo($(".profile-header__main").children().first());
                }
            }
        }, 2000);
        let sbnav = $(`<li class="nav__list-item dropdown nav__dropdown drop-target drop-element-attached-top drop-element-attached-right drop-target-attached-bottom drop-target-attached-right"
data-dropdown-custom-class="nav__dropdown"
data-dropdown-target="#menu-nav-badge"
data-dropdown-disabledconstraintowindow
data-dropdown-trigger-desktop-only>
<span class="nav__item">
    <span class="icon icon-edit"></span>
    设置 Badge
</span>
</li>`).prependTo($(".nav__list--secondary"));
        let observer = new MutationObserver(function (mutations) {
            for (let mutation of mutations) {
                if (mutation.type == "childList") {
                    let dropdown = $(mutation.addedNodes[0]).children(`*:contains("undefined")`);
                    if (!dropdown.length) {
                        return;
                    }
                    dropdown.text("");
                    let sbdiv = $(`<ol id="#menu-nav-badge" class="dropdown-target menu">
    <li class="menu__item">
        <div class="menu__link">
            <span class="icon icon-account--circle"></span>
            用户 uid
        </div>
    </li>
</ol>`).appendTo(dropdown);
                    let sbuser = $(`<input class="expanded"/>`).appendTo(
                        $(`<div class="menu__link"></div>`).appendTo(
                            $(`<li class="menu__item"></li>`).appendTo(sbdiv)
                        )
                    );
                    sbdiv.append(`<li class="menu__seperator"></li>`, `<li class="menu__item">
    <div class="menu__link">
        <span class="icon icon-comment--text"></span>
        Badge
    </div>
</li>`);
                    let sbcontent = $(`<input class="expanded"/>`).appendTo(
                        $(`<div class="menu__link"></div>`).appendTo(
                            $(`<li class="menu__item"></li>`).appendTo(sbdiv)
                        )
                    );
                    sbdiv.append(`<li class="menu__seperator"></li>`, `<li class="menu__item">
    <div class="menu__link">
        <span class="icon icon-erase"></span>
        Background Color
    </div>
</li>`);
                    let sbcolor = $(`<input class="expanded" value="#575757"/>`).appendTo(
                        $(`<div class="menu__link"></div>`).appendTo(
                            $(`<li class="menu__item"></li>`).appendTo(sbdiv)
                        )
                    );
                    sbdiv.append(`<li class="menu__seperator"></li>`, `<li class="menu__item">
    <div class="menu__link">
        <span class="icon icon-erase"></span>
        Text Color
    </div>
</li>`);
                    let sbtextcolor = $(`<input class="expanded" value="white"/>`).appendTo(
                        $(`<div class="menu__link"></div>`).appendTo(
                            $(`<li class="menu__item"></li>`).appendTo(sbdiv)
                        )
                    );
                    sbdiv.append(`<li class="menu__seperator"></li>`);
                    let sbsubmit = $(`<div class="button expanded">设置</div>`).appendTo(
                        $(`<div class="menu__link"></div>`).appendTo(
                            $(`<li class="menu__item"></li>`).appendTo(sbdiv)
                        )
                    );
                    let sbclear = $(`<div class="button expanded sb-warning">清除数据</div>`).appendTo(
                        $(`<div class="menu__link"></div>`).appendTo(
                            $(`<li class="menu__item"></li>`).appendTo(sbdiv)
                        )
                    );
                    sbsubmit.on("click", () => {
                        badge[sbuser.val()] = {
                            content: sbcontent.val(),
                            color: sbcolor.val(),
                            textColor: sbtextcolor.val()
                        }
                        GM_setValue("hb-badge", JSON.stringify(badge));
                    });
                    sbclear.on("click", () => {
                        let choice = prompt(`你确定要清除数据吗？
- 输入 1 清除指定对象的 Badge；
- 输入 2 清除所有人的 Badge（除了默认项）；
- 输入其他任何东西取消。`);
                        if (choice == "1") {
                            badge[sbuser.val()] = undefined;
                            GM_setValue("hb-badge", JSON.stringify(badge));
                        }
                        if (choice == "2") {
                            badge = {
                                34: {
                                    content: "Happybob",
                                    color: "#575757",
                                    textColor: "white"
                                },
                                35: {
                                    content: "cosf | 月亮",
                                    color: "#575757",
                                    textColor: "white"
                                }
                            };
                            GM_setValue("hb-badge", JSON.stringify(badge));
                        }
                    });
                }
            }
        });
        observer.observe(document.body, {
            childList: true
        });
    }
    //#endregion badge

    //#region jump
    if (true) {
        let jumpdiv, jumpbody;
        if (match(relativePath, ["record"])) { // special handling
            $(`.section:contains("由语言")`).append($(`<div class="section__header">
    <h1 class="section__title">
        跳转
    </h1>
</div>`));
            jumpdiv = $(`<div class="section__body"></div>`).appendTo($(`.section:contains("由语言")`));
            jumpbody = $(`<div></div>`).appendTo(jumpdiv);
        }
        else {
            jumpdiv = $(`<div class="section side" type="border-radius: 10px;">
    <div class="section__header">
        <h1 class="section__title">
            跳转
        </h1>
    </div>
</div>`).appendTo($(`*[data-sticky], .large-3, .medium-3`).first());
            jumpbody = $(`<div class="section__body"></div>`).appendTo(jumpdiv);
        }
        domains.forEach(dm => {
            let jumpbut = $(`<div class="button jmp-right">${domainName[dm]}</div>`);
            jumpbut.on("click", () => {
                if (match(relativePath, ["problem", "homeworkIn", "recordIn", "discussIn", "contestIn"])) {
                    location = `/d/${dm}/`;
                }
                else {
                    location = `/d/${dm}${relativePath}${location.search}`;
                }
            });
            jumpbut.appendTo(jumpbody);
        });
    }
    //#endregion jump

    //#region rand
    if (match(relativePath, ["home", "problems", "problem"])) {
        let randdiv = $(`<div class="section side" style="border-radius: 10px;">
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
        randdiv = randdiv.prependTo($(".large-3, .medium-3").first());
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
                    url: `${ppwd()}/record/${self.subid}?${getSearch("tid")}`,
                    method: "GET",
                    headers: {
                        accept: "application/json"
                    },
                    success(res) {
                        let sbr = res.rdoc;
                        console.log(sbr.status);
                        if (sbr.status > 8 || sbr.status == 0) {
                            setTimeout(self.update.bind(self), 500);
                        }
                        if (!sbr.judgeAt) {
                            sbr.judgeAt = "Judging";
                        }
                        self.jqe.html(`<span style="border-left: .1875rem solid ${verdictColors[sbr.status]}; color: ${verdictTextColors[sbr.status]}" class="smc-sbmi smc-sbms">
    <span class="icon icon-${verdictIcon[sbr.status]}"></span>
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
                url: `${ppwd()}/record?uidOrName=${user}&pid=${prob}&${getSearch("tid")}`,
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
            fetch(`${ppwd()}/p/${prob}/submit?${getSearch("tid")}`, {
                headers: {
                    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "cache-control": "max-age=0",
                    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryHappybobSaysYoxi",
                    "upgrade-insecure-requests": "1"
                },
                referrer: `${ppwd()}/p/${prob}/submit`,
                referrerPolicy: "strict-origin-when-cross-origin",
                body: `------WebKitFormBoundaryHappybobSaysYoxi\r\nContent-Disposition: form-data; name="lang"\r\n\r\n${domainStdlang[domain]}\r\n------WebKitFormBoundaryHappybobSaysYoxi\r\nContent-Disposition: form-data; name="code"\r\n\r\n${value}\r\n------WebKitFormBoundaryHappybobSaysYoxi\r\nContent-Disposition: form-data; name="file"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundaryHappybobSaysYoxi--\r\n`,
                method: "POST",
                mode: "cors",
                credentials: "include"
            }).then(addSubmittions);
        });

        let submitbody = $(`<div class="section__body">
    <label>
        代码语言：${domainStdlangdis[domain]}
    </label>
    <div class="medium-12">
        <textarea class="textbox monospace" spellcheck="false"></textarea>
    </div>
</div>`).append(submitbut);
        let submitdiv = $(`<div class="section">
    <div class="section__header">
        提交代码
    </div>
</div>`).append(submitbody);
        let submissiondiv = $(`<div class="section">
    <div class="section__header">
        提交记录
    </div>
</div>`).append(submissionbody);
        $(".medium-9.columns").append(submitdiv, submissiondiv);
    }
    //#endregion submit-code

    //#region hide-buttons
    $(".section").each(function () {
        if ($(this).children().length != 2) {
            return;
        }
        let body = $(this).children(".section__body");
        if (body.length != 1) {
            return;
        }
        let head = $(this).children(".section__header");
        if (head.length != 1) {
            return;
        }
        let hideButton = $(`<div class="button">隐藏</div>`).appendTo(head);
        hideButton.on("click", () => {
            if (hideButton.text() == "隐藏") {
                body.hide();
                hideButton.text("显示");
            }
            else {
                body.show();
                hideButton.text("隐藏");
            }
        });
    });
    //#endregion hide-buttons

    //#region cph
    if (match(relativePath, ["problem"])) {
        let prob = relativePath.match(regices.pid)[1];

        let cphdiv = $(`<div class="section side" style="border-radius: 10px;">
    <div class="section__header">
        <h1 class="section__title">
            传送至 cph
        </h1>
    </div>
</div>`);
        let cphbut = $(`<div class="expanded button">传送</div>`);
        cphbut.on("click", () => {
            let sps = [];
            let i = 1;
            while (true) {
                if ($(`code.language-input${i}`).length != 1) {
                    break;
                }
                sps.push({
                    input: $(`code.language-input${i}`).text(),
                    output: $(`code.language-output${i}`).text()
                });
                i++;
            }
            GM_xmlhttpRequest({
                url: "http://localhost:27121/",
                method: "POST",
                data: JSON.stringify({
                    batch: {
                        id: "hfoj-better",
                        size: 1
                    },
                    name: prob,
                    url: location.toString(),
                    interactive: "false",
                    memoryLimit: 524288,
                    timeLimit: 5000,
                    tests: sps,
                    input: {
                        type: "stdin",
                    },
                    output: {
                        type: "stdout",
                    },
                    testType: "single"
                }),
                onload(res) {
                    if (res.status == 502) {
                        alert("未启动 cph");
                    }
                },
                onerror() {
                    alert("传送失败");
                }
            });
        });
        cphdiv.append($(`<div class="section__body"></div>`).append(cphbut)).prependTo($(".large-3, .medium-3").first());
    }
    //#endregion cph

    //#region aprilfool
    if ((new Date).toDateString().match(/Apr 0[1-3]/)) {
        function fool() {
            $("*").each(function () {
                this.style.color = `rgb(${Math.floor(Math.random() * 256)} ${Math.floor(Math.random() * 256)} ${Math.floor(Math.random() * 256)})`;
            });
            setTimeout(fool, 1000);
        }
        $("#yiyan").text("Happy April Fools' Day!");
        fool();
    }
    //#endregion aprilfool
})();
