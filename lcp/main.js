"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cookie_1 = __importDefault(require("./cookie"));
var cheerio_1 = __importDefault(require("cheerio"));
var cid = "122483";
var judgers = {
    icpc: function (score) {
        return score > 0;
    },
    ioi: function (score) {
        return score == 100;
    }
};
var mode = "ioi";
function sleep(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function get(url) {
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
            "cookie": "__client_id=".concat(cookie_1.default.client, "; _uid=").concat(cookie_1.default.uid),
            "Referer": "https://www.luogu.com.cn/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        method: "GET",
        body: null
    });
}
function loadContestPage(cid, parsed, pge, mxp, judge, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var res, raw, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log(pge, mxp);
                    return [4 /*yield*/, get("https://www.luogu.com.cn/fe/api/contest/scoreboard/".concat(cid, "?page=").concat(pge))];
                case 1:
                    res = _c.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, res.text()];
                case 2:
                    raw = _b.apply(_a, [_c.sent()]);
                    raw.scoreboard.result.forEach(function (us) {
                        parsed.shortRank.push(us.user.uid);
                        for (var pid in us.details) {
                            parsed.problemStatus[pid].submitted++;
                            if (judge(us.details[pid].score)) {
                                parsed.problemStatus[pid].accepted++;
                            }
                        }
                    });
                    if (!(pge == mxp)) return [3 /*break*/, 3];
                    cb(parsed);
                    return [2 /*return*/, parsed];
                case 3: return [4 /*yield*/, sleep(200)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, loadContestPage(cid, parsed, pge + 1, mxp, judge, cb)];
                case 5: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function loadContest(cid, judge, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var res, raw, _a, _b, parsed, pid, cres, craw, fi, $, mxp;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log(1);
                    return [4 /*yield*/, get("https://www.luogu.com.cn/fe/api/contest/scoreboard/".concat(cid, "?page=1"))];
                case 1:
                    res = _c.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, res.text()];
                case 2:
                    raw = _b.apply(_a, [_c.sent()]);
                    parsed = raw;
                    parsed.problems = [];
                    parsed.problemStatus = {};
                    parsed.shortRank = [];
                    parsed.participant = raw.scoreboard.count;
                    parsed.problemTitle = {};
                    for (pid in raw.firstBloodUID) {
                        parsed.problems.push(pid);
                        parsed.problemStatus[pid] = {
                            submitted: 0,
                            accepted: 0,
                            firstBlood: raw.firstBloodUID[pid]
                        };
                    }
                    raw.scoreboard.result.forEach(function (us) {
                        parsed.shortRank.push(us.user.uid);
                        for (var pid in us.details) {
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
                    return [4 /*yield*/, get("https://www.luogu.com.cn/contest/".concat(cid, "#scoreboard"))];
                case 3:
                    cres = _c.sent();
                    return [4 /*yield*/, cres.text()];
                case 4:
                    craw = _c.sent();
                    $ = cheerio_1.default.load(craw);
                    $("script").each(function () {
                        if (!this.children[0]) {
                            return;
                        }
                        var scr = this.children[0].data;
                        var st = scr.indexOf('"');
                        var ed = scr.indexOf('"', st + 1);
                        fi = JSON.parse(decodeURIComponent(scr.substring(st + 1, ed)));
                    });
                    fi.currentData.contestProblems.forEach(function (cp) {
                        parsed.problemTitle[cp.problem.pid] = cp.problem.title;
                    });
                    mxp = Math.ceil(raw.scoreboard.count / raw.scoreboard.perPage);
                    if (!(mxp == 1)) return [3 /*break*/, 5];
                    cb(parsed);
                    return [2 /*return*/, parsed];
                case 5: return [4 /*yield*/, loadContestPage(cid, parsed, 2, mxp, judge, cb)];
                case 6: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
loadContest(cid, judgers[mode], function (parsed) {
    var sta = parsed.problemStatus;
    console.log("Contest ".concat(cid));
    for (var pid in sta) {
        if (sta[pid].submitted == 0) {
            continue;
        }
        console.log("|-".concat(pid, " (").concat(parsed.problemTitle[pid], "):\n| |- Accepted: ").concat(sta[pid].accepted, "\n| |- Submitted: ").concat(sta[pid].submitted, "\n| |- Ac./Su.: ").concat(Math.round(10000 * sta[pid].accepted / sta[pid].submitted) / 100, "%\n| \\- Ac./Pa.: ").concat(Math.round(10000 * sta[pid].accepted / parsed.participant) / 100, "%\n|"));
    }
    console.log("\\- Pa. count: ".concat(parsed.participant));
});
