// ==UserScript==
// @name         poem cheater
// @namespace    http://poem.rotriw.com/
// @version      1.1.0
// @description  poem cheater
// @author       cosf
// @match        https://poem.rotriw.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rotriw.com
//
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// ==/UserScript==

/**
 * Plugin by cosf
 * 2024-03-23
 * v1.0.1
 */

(function () {
    'use strict';
    if (typeof $ == "undefined") {
        const $ = require("jquery");
    }
    let but = $('<button class="ui primary button" id="submit">查找</button>');
    const wss = new WebSocket("ws://localhost:20242");
    const socket = io();
    but.appendTo($(".ui.form"));

    let onsend = 0;
    function send() {
        let char = $(".now_char").text();
        let prob = $("#problem").text();
        onsend = false;
        if (char) {
            wss.send(JSON.stringify({ char, prob, type: "send" }));
        }
    }
    function obs(mu) {
        if (mu.filter(v => v.type == "childList").length > 0 && !onsend) {
            onsend = true;
            setTimeout(send, 500);
        }
    }
    let observer = new MutationObserver(obs);
    function auto_send() {
        observer.observe($("#problem_segment").get(0), {
            childList: true,
            subtree: true,
            characterData: true
        });
        send();
    }
    function stop_send() {
        observer.disconnect();
    }
    let la = "", lc = "";
    wss.onmessage = (ev) => {
        let poem = ev.data;
        let char = $(".now_char").text();
        lc = char;
        la = poem;
        console.log(char);
        console.log(poem);
        poem = poem.replace(char, "（）");
        socket.emit("answer", { data: poem });
        update_coin();
    };
    socket.on("answer_check", data => {
        if (data.message != "提交成功") {
            wss.send(JSON.stringify({ char: "", prob: la, type: "fail" }));
        }
        else {
            wss.send(JSON.stringify({ char: lc, prob: la, type: "success" }));
        }
    });
    but.on("click", send);

    let aut = $('<button class="ui primary button" id="submit">自动</button>');
    aut.appendTo($(".ui.form"));
    aut.on("click", () => {
        if (aut.text() == "自动") {
            aut.text("停止");
            auto_send();
        }
        else {
            aut.text("自动");
            stop_send();
        }
    });
})();
