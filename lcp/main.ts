import { utl, lg } from "./luogu";
import cookie from "./cookie";
import cheerio from "cheerio";

const cid = "122483";

const judgers: utl.Map<lg.lgc.Mode, utl.F<number, boolean>> = {
    icpc(score: number) {
        return score > 0;
    },
    ioi(score: number) {
        return score == 100;
    }
};

const mode: keyof typeof judgers = "ioi";

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function get(url: string) {
    return fetch(url, {
        headers: {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"macOS\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-csrf-token": "1711625463:mFvJb8Zp8HkGB4A9W8lK43eAydLkhzTtCGdN9Up2I4E=",
            "x-requested-with": "XMLHttpRequest",
            "cookie": `__client_id=${cookie.client}; _uid=${cookie.uid}`,
            "Referer": `https://www.luogu.com.cn/`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET",
        body: null
    });
}

async function loadContestPage(cid: string, parsed: lg.lgc.ParsedContestScoreboard, pge: number, mxp: number, judge: utl.F<number, boolean>, cb: (res: lg.lgc.ParsedContestScoreboard) => any): Promise<lg.lgc.ParsedContestScoreboard> {
    console.log(pge, mxp);
    const res = await get(`https://www.luogu.com.cn/fe/api/contest/scoreboard/${cid}?page=${pge}`);
    const raw: lg.lgc.ContestScoreboardPage = JSON.parse(await res.text());
    raw.scoreboard.result.forEach(us => {
        parsed.shortRank.push(us.user.uid);
        for (let pid in us.details) {
            parsed.problemStatus[pid].submitted++;
            if (judge(us.details[pid].score)) {
                parsed.problemStatus[pid].accepted++;
            }
        }
    });
    if (pge == mxp) {
        cb(parsed);
        return parsed;
    }
    else {
        await sleep(200);
        return await loadContestPage(cid, parsed, pge + 1, mxp, judge, cb);
    }
}

async function loadContest(cid: string, judge: utl.F<number, boolean>, cb: (res: lg.lgc.ParsedContestScoreboard) => any): Promise<lg.lgc.ParsedContestScoreboard> {
    console.log(1);
    const res = await get(`https://www.luogu.com.cn/fe/api/contest/scoreboard/${cid}?page=1`);
    const raw: lg.lgc.ContestScoreboardPage = JSON.parse(await res.text());
    let parsed: lg.lgc.ParsedContestScoreboard = raw as lg.lgc.ParsedContestScoreboard;
    parsed.problems = [];
    parsed.problemStatus = {};
    parsed.shortRank = [];
    parsed.participant = raw.scoreboard.count;
    parsed.problemTitle = {};
    for (let pid in raw.firstBloodUID) {
        parsed.problems.push(pid);
        parsed.problemStatus[pid] = {
            submitted: 0,
            accepted: 0,
            firstBlood: raw.firstBloodUID[pid]
        };
    }
    raw.scoreboard.result.forEach(us => {
        parsed.shortRank.push(us.user.uid);
        for (let pid in us.details) {
            if (!parsed.problemStatus[pid]) {
                parsed.problemStatus[pid] = {
                    submitted: 0,
                    accepted: 0,
                    firstBlood: undefined
                };
            }
            parsed.problemStatus[pid].submitted++;
            if (judge(us.details[pid].score)) {
                parsed.problemStatus[pid].accepted++;
            }
        }
    });

    const cres = await get(`https://www.luogu.com.cn/contest/${cid}#scoreboard`);
    const craw = await cres.text();
    let fi: lg.fe.FeInjection<"ContestShow">;
    let $ = cheerio.load(craw);
    $("script").each(function () {
        if (!this.children[0]) {
            return;
        }
        let scr = (this.children[0] as unknown as Text).data;
        let st = scr.indexOf('"');
        let ed = scr.indexOf('"', st + 1);
        fi = JSON.parse(decodeURIComponent(scr.substring(st + 1, ed)));
    });
    fi.currentData.contestProblems.forEach(cp => {
        parsed.problemTitle[cp.problem.pid] = cp.problem.title;
    });

    let mxp = Math.ceil(raw.scoreboard.count / raw.scoreboard.perPage);
    if (mxp == 1) {
        cb(parsed);
        return parsed;
    }
    else {
        return await loadContestPage(cid, parsed, 2, mxp, judge, cb);
    }
}

loadContest(cid, judgers[mode], (parsed: lg.lgc.ParsedContestScoreboard) => {
    let sta = parsed.problemStatus;
    console.log(`Contest ${cid}`);
    for (let pid in sta) {
        if (sta[pid].submitted == 0) {
            continue;
        }
        console.log(`|-${pid} (${parsed.problemTitle[pid]}):
| |- Accepted: ${sta[pid].accepted}
| |- Submitted: ${sta[pid].submitted}
| |- Ac./Su.: ${Math.round(10000 * sta[pid].accepted / sta[pid].submitted) / 100}%
| \\- Ac./Pa.: ${Math.round(10000 * sta[pid].accepted / parsed.participant) / 100}%
|`);
    }
    console.log(`\\- Pa. count: ${parsed.participant}`);
});
