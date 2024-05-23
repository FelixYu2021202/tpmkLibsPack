// ==UserScript==
// @name         Codeforces Problem Chooser
// @namespace    http://luogu.com.cn/
// @version      1.0.1
// @description  Choose problem from codeforces
// @author       cosf
// @match        https://www.luogu.com.cn/contest/edit/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_xmlhttpRequest
// @connect      https://codeforces.com/*
// ==/UserScript==

(function () {
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

    let row = $(`<div data-v-581a38cc class="row">
    <span data-v-581a38cc>
        <span data-v-226afee4 data-v-581a38cc>
            爬取 CF
        </span>
    </span>
    <div data-v-581a38cc>
        <p data-v-226afee4 data-v-581a38cc>
            难度：<span id="difficulty-selector"></span>
        </p>
        <p data-v-226afee4 data-v-581a38cc>
            已选：<span id="selected-tag"></span>
        </p>
        <p data-v-226afee4 data-v-581a38cc>
            未选：<span id="unselected-tag"></span>
        </p>
        <p>
            <button data-v-7ade990c data-v-226afee4 type="button" class="lfe-form-sz-small" data-v-581a38cc style="border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);" id="cf-search">
                爬取
            </button>
        </p>
    </div>
</div>`).insertAfter($(".form-layout").children().first());

    let difselect = $(`<select></select>`).appendTo("#difficulty-selector");

    for (let i = 800; i < 3600; i += 100) {
        difselect.append(`<option value="${i}">${i}</option>`);
    }

    let tags = [
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

    let selectspan = $(`<span class="tag-select"></span>`).appendTo("#selected-tag");
    let unselectspan = $(`<span class="tag-select"></span>`).appendTo("#unselected-tag");

    let selected = {}, unselected = {};

    let tagsspan = {};

    tags.forEach(tag => {
        tagsspan[tag] = $(`<span class="tag-select-span">${tag}</span>`).appendTo(unselectspan);
        unselected[tag] = true;
        selected[tag] = false;
        tagsspan[tag].on("click", () => {
            if (selected[tag]) {
                selected[tag] = false;
                unselected[tag] = true;
                tagsspan[tag] = tagsspan[tag].detach().appendTo(unselectspan);
            }
            else {
                selected[tag] = true;
                unselected[tag] = false;
                tagsspan[tag] = tagsspan[tag].detach().appendTo(selectspan);
            }
        });
    });

    $("#cf-search").on("click", () => {
        let dif = difselect.val();
        let st = tags.filter(tag => selected[tag]).map(st => encodeURIComponent(st)).join(";");
        console.log(dif, st);
        GM_xmlhttpRequest({
            url: `https://codeforces.com/api/problemset.problems?tags=${st}`,
            onload(resp) {
                resp = JSON.parse(resp.response);
                let probs = resp.result.problems.filter(prob => prob.rating == dif);
                if (probs.length == 0) {
                    alert("No this type of problem!");
                    return;
                }
                let sp = probs[Math.floor(Math.random() * probs.length)];
                let id = `CF${sp.contestId}${sp.index}`;
                navigator.clipboard.writeText(id);
                alert("copied");
            },
            method: "GET",
        })
    });

})();
