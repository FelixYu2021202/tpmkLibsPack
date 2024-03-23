/**
 * Worker by cosf
 * 2024-02-25
 * v1.0.3
 */

const WebSocket = require("ws");
const cheerio = require("cheerio");
const fs = require("fs");

const wss = new WebSocket.Server({ port: 20242 });

function depunct(a) {
    a = a.split("，").join("");
    a = a.split("。").join("");
    a = a.split("！").join("");
    a = a.split("？").join("");
    a = a.split("：").join("");
    a = a.split("“").join("");
    a = a.split("”").join("");
    a = a.split("‘").join("");
    a = a.split("’").join("");
    return a;
}

function same(a, b) {
    a = depunct(a);
    b = depunct(b);
    return a.includes(b) || b.includes(a);
}

let dict = JSON.parse(fs.readFileSync("./dict.json"));

let failed = [];

function get_dict(char, prob, ws) {
    if (typeof dict[char] != "undefined") {
        let poems = dict[char];
        for (let i = 0; i < poems.length; i++) {
            let poem = poems[i];
            if (!same(poem, prob)) {
                console.log(prob);
                console.log(poem);
                ws.send(poem);
                return true;
            }
        }
    }
    return false;
}

function check(poem) {
    return failed.findIndex(p => (p == poem)) == -1;
}

function add_dict(prob) {
    poem = depunct(prob);
    for (let i = 0; i < poem.length; i++) {
        let char = poem[i];
        if (typeof dict[char] == "undefined") {
            dict[char] = [prob];
        }
        else if (dict[char].length < 2) {
            if (dict[char].findIndex(p => (p == prob)) == -1) {
                dict[char].push(prob);
            }
        }
    }
    fs.writeFile("./dict.json", JSON.stringify(dict), Object);
}

wss.on("connection", (ws) => {
    console.log("connected");
    ws.on("message", (ms) => {
        let { char, prob, type } = JSON.parse(ms.toString());
        if (type == "send") {
            console.log(char);
            if (get_dict(char, prob, ws)) {
                return;
            }
            fetch("https://so.gushiwen.cn/search.aspx?type=mingju&value=" + char + "&valuej=" + char)
                .then(p => p.text())
                .then(p => {
                    let $ = cheerio.load(p);
                    let data = $(".sons").children(".cont");
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].children.length == 3) {
                            continue;
                        }
                        let a = data[i].children[1];
                        let poem = "";
                        for (let j = 0; j < a.children.length; j++) {
                            let el = a.children[j];
                            if (el.type == "text") {
                                poem = poem + el.data;
                            }
                            else {
                                poem = poem + el.children[0].data;
                            }
                        };
                        if (poem.includes(char) && poem.length > 8 && poem.length < 30 && !same(poem, prob) && check(poem)) {
                            console.log(prob);
                            console.log(poem);
                            ws.send(poem);
                            break;
                        }
                    }
                });
        }
        else if (type == "fail") {
            console.log(prob, "failed");
            failed.push(prob);
        }
        else if (type == "success") {
            add_dict(prob);
        }
    });
});
