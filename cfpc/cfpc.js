// ==UserScript==
// @name         Codeforces & Atcoder Problem Chooser
// @namespace    http://luogu.com.cn/
// @version      1.1.2
// @description  Choose problem from Codeforces and Atcoder
// @author       cosf
// @match        https://www.luogu.com.cn/contest/edit/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

setTimeout(function () {
    'use strict';

    let $ = jQuery;

    if (location.hash != "#problem") {
        return;
    }

    let style = $(`<style>
    .tag-select {
        border: 1px solid black;
        padding: 3px;
        display: flex;
        flex-wrap: wrap;
    }
    .tag-select-span {
        border: 1px solid black;
        background-color: #f0f0f0;
        padding: 1px;
        margin: 1px;
    }
</style>`).appendTo(document.body);

    //#region cf

    $(`<div data-v-581a38cc class="row">
    <span data-v-581a38cc>
        <span data-v-226afee4 data-v-581a38cc>
            爬取 CF
        </span>
    </span>
    <div data-v-581a38cc>
        <p data-v-226afee4 data-v-581a38cc>
            难度：<span id="cf-difficulty-selector"></span>
        </p>
        <p data-v-226afee4 data-v-581a38cc>
            已选：<span id="cf-selected-tag"></span>
        </p>
        <p data-v-226afee4 data-v-581a38cc>
            未选：<span id="cf-unselected-tag"></span>
        </p>
        <p>
            <button data-v-7ade990c data-v-226afee4 type="button" class="lfe-form-sz-small" data-v-581a38cc style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);" id="cf-search">
                爬取
            </button>
        </p>
    </div>
</div>`).insertAfter($(".form-layout").children().first());

    let cfdifselect = $(`<select></select>`).appendTo("#cf-difficulty-selector");

    for (let i = 800; i < 3600; i += 100) {
        cfdifselect.append(`<option value="${i}">${i}</option>`);
    }

    let cftags = [
        "2-sat",
        "binary search",
        "bitmasks",
        "brute force",
        "chinese remainder theorem",
        "combinatorics",
        "constructive algorithms",
        "data structures",
        "dfs and similar",
        "divide and conquer",
        "dp",
        "dsu",
        "expression parsing",
        "fft",
        "flows",
        "games",
        "geometry",
        "graph matchings",
        "graphs",
        "greedy",
        "hashing",
        "implementation",
        "interactive",
        "math",
        "matrices",
        "meet-in-the-middle",
        "number theory",
        "probabilities",
        "schedules",
        "shortest paths",
        "sortings",
        "string suffix structures",
        "strings",
        "ternary search",
        "trees",
        "two pointers"
    ];

    let cfselectspan = $(`<span class="tag-select"></span>`).appendTo("#cf-selected-tag");
    let cfunselectspan = $(`<span class="tag-select"></span>`).appendTo("#cf-unselected-tag");

    let cfselected = {}, cfunselected = {};

    let cftagsspan = {};

    cftags.forEach(tag => {
        cftagsspan[tag] = $(`<span class="tag-select-span">${tag}</span>`).appendTo(cfunselectspan);
        cfunselected[tag] = true;
        cfselected[tag] = false;
        cftagsspan[tag].on("click", () => {
            if (cfselected[tag]) {
                cfselected[tag] = false;
                cfunselected[tag] = true;
                cftagsspan[tag] = cftagsspan[tag].detach().appendTo(cfunselectspan);
            }
            else {
                cfselected[tag] = true;
                cfunselected[tag] = false;
                cftagsspan[tag] = cftagsspan[tag].detach().appendTo(cfselectspan);
            }
        });
    });

    $("#cf-search").on("click", () => {
        let dif = cfdifselect.val();
        let st = cftags.filter(tag => cfselected[tag]).map(st => encodeURIComponent(st)).join(";");
        console.log(dif, st);
        GM_xmlhttpRequest({
            url: `https://codeforces.com/api/problemset.problems?tags=${st}`,
            onload(resp) {
                resp = JSON.parse(resp.response);
                let probs = resp.result.problems.filter(prob => prob.rating == dif);
                if (dif < 2600) {
                    probs = probs.filter(prob => prob.contestId > 1000);
                }
                if (probs.length == 0) {
                    alert("No this type of problem!");
                    return;
                }
                let sp = probs[Math.floor(Math.random() * probs.length)];
                let id = `CF${sp.contestId}${sp.index}`;
                navigator.clipboard.writeText(id);
                alert(`copied: ${id}`);
            },
            method: "GET",
        })
    });

    //#endregion cf

    //#region at

    $(`<div data-v-581a38cc class="row">
    <span data-v-581a38cc>
        <span data-v-226afee4 data-v-581a38cc>
            爬取 AT
        </span>
    </span>
    <div data-v-581a38cc>
        <p data-v-226afee4 data-v-581a38cc>
            难度：<span id="at-difficulty-selector"></span>
        </p>
        <p>
            <button data-v-7ade990c data-v-226afee4 type="button" class="lfe-form-sz-small" data-v-581a38cc style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);" id="at-search">
                爬取
            </button>
        </p>
    </div>
</div>`).insertAfter($(".form-layout").children().first());

    let atdifselect = $(`<select></select>`).appendTo("#at-difficulty-selector");

    let atdifficultiesname = [
        "brown (400 - 800)",
        "green (800 - 1200)",
        "cyan (1200 - 1600)",
        "blue (1600 - 2000)",
        "yellow (2000 - 2400)",
        "orange (2400 - 2800)",
        "red (2800 - 3200)",
        "bronze (3200 - 3600)",
        "silver (3600 - 4000)",
        "gold (4000 - )"
    ];
    let atdifficultiesspan = [
        [400, 800],
        [800, 1200],
        [1200, 1600],
        [1600, 2000],
        [2000, 2400],
        [2400, 2800],
        [2800, 3200],
        [3200, 3600],
        [3600, 4000],
        [4000, 10000]
    ]

    for (let i = 0; i < 10; i++) {
        atdifselect.append(`<option value="${i}">${atdifficultiesname[i]}</option>`);
    }

    $("#at-search").on("click", () => {
        let dif = atdifselect.val();
        console.log(dif);
        GM_xmlhttpRequest({
            url: "https://kenkoooo.com/atcoder/resources/problem-models.json",
            onload(resp) {
                resp = JSON.parse(resp.response);
                let probs = [];
                for (let prob in resp) {
                    let pd = resp[prob];
                    if (pd.difficulty >= atdifficultiesspan[dif][0] && pd.difficulty < atdifficultiesspan[dif][1]) {
                        probs.push(`AT_${prob}`);
                    }
                }
                let id = probs[Math.floor(Math.random() * probs.length)];
                navigator.clipboard.writeText(id);
                alert(`copied: ${id}`);
            },
            method: "GET",
        })
    });

    //#endregion at

}, 1000);
