import * as fs from "fs";
import * as opentype from "opentype.js";

async function fg() {
    async function load(path: string) {
        const buffer = fs.promises.readFile(path).then(res => res.buffer);

        font = opentype.parse(await buffer);
        let lens = [];
        for (let i = 0; i < font.glyphs.length; i++) {
            let glyph = font.glyphs.get(i);
            if (glyph.unicode < 128) {
                lens[glyph.unicode] = glyph.path.commands.length;
                paths[glyph.unicode] = glyph.path.commands;
            }
        }
        return lens;
    }

    console.log("What's your favourite font? (Only english fonts are supported)");

    let stage = 0, score = 0;

    let lens: number[] = [];
    let paths: opentype.PathCommand[][] = [];
    let font: opentype.Font;

    let quest: string, ans: number;

    function rand(l: number, r: number) {
        r++;
        return l + Math.floor((r - l) * Math.random());
    }

    function gen1() {
        quest = "";
        ans = 0;
        for (let i = 0; i < 5; i++) {
            let cur = rand(33, 127);
            quest = `${quest}${String.fromCharCode(cur)}`;
            ans += cur;
        }
    }

    function gen2() {
        quest = "";
        ans = 0;
        for (let i = 0; i < 5; i++) {
            let cur = rand(33, 127);
            quest = `${quest}  ${String.fromCharCode(i + 65)}. ${String.fromCharCode(cur)}`;
            ans = Math.max(ans, lens[cur]);
        }
    }

    function gen3() {
        quest = `'-/<>LV\\^_\`|`[rand(0, 11)];
        ans = lens[quest.charCodeAt(0)];
    }

    function gen4() {
        let cur = rand(33, 127);
        quest = String.fromCharCode(cur);
        ans = paths[cur].filter(path => path.type == "Z").length;
    }

    function gen5() {
        quest = "";
        ans = 0;
        let name = font.names.fullName.en;
        for (let i = 0; i < name.length; i++) {
            let cur = name.charCodeAt(i);
            for (let j = 1; j < paths[cur].length; j++) {
                if (paths[cur][j].type == "Q" && paths[cur][j - 1].type != "Q") {
                    ans++;
                }
            }
        }
    }

    function genhash() {
        let base = (score / 5 + 13) % 20 + 16;
        let hash = (BigInt(Date.now()) * BigInt(1145141) + BigInt(2147483647)).toString(base).concat("A").concat((score * 514 + 2197).toString(base));
        return hash;
    }

    process.stdin.on("data", async data => {
        let dat = data.toString().trim();
        switch (stage) {
            case 0:
                lens = await load(dat);
                stage++;
                console.log("Loaded. Now follow the instructions.");
                console.log("What is the sum of the ASCIIs below?");
                gen1();
                console.log(quest);
                break;
            case 1:
                if (dat != ans.toString()) {
                    console.log("You made a silly mistake.");
                }
                else {
                    console.log("Wonderful. 5pts.");
                    score += 5;
                }
                stage++;
                console.log("Which ASCII takes the most time to write? (Answer in ASCII)");
                gen2();
                console.log(quest);
                break;
            case 2:
                if (lens[dat.charCodeAt(0)] != ans) {
                    console.log("You made a dumb mistake.");
                }
                else {
                    console.log("Awesome. 10pts.");
                    score += 10;
                }
                stage++;
                console.log("How many commands are required to draw this ascii?");
                gen3();
                console.log(quest);
                break;
            case 3:
                if (dat != ans.toString()) {
                    console.log("You made a stupid mistake.");
                }
                else {
                    console.log("Excellent. 15pts.");
                    score += 15;
                }
                stage++;
                console.log("How many strokes are required to draw this ascii?");
                gen4();
                console.log(quest);
                break;
            case 4:
                if (dat != ans.toString()) {
                    console.log("You made a careless mistake.");
                }
                else {
                    console.log("Well done. 20pts.");
                    score += 20;
                }
                stage++;
                console.log("Last one. How many curves are required to write this font's full name?");
                gen5();
                break;
            case 5:
                if (dat != ans.toString()) {
                    console.log("You made a bad mistake.");
                }
                else {
                    console.log("Congratulations. 50pts.");
                    score += 50;
                }
                console.log(`Your final score is ${score}. Submit this code to Luogu in 2 minutes:`, genhash());
                process.exit(0);
        }
    });
}

fg();