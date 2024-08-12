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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var opentype = require("opentype.js");
function fg() {
    return __awaiter(this, void 0, void 0, function () {
        function load(path) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer, _a, _b, lens, i, glyph;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            buffer = fs.promises.readFile(path).then(function (res) { return res.buffer; });
                            _b = (_a = opentype).parse;
                            return [4 /*yield*/, buffer];
                        case 1:
                            font = _b.apply(_a, [_c.sent()]);
                            lens = [];
                            for (i = 0; i < font.glyphs.length; i++) {
                                glyph = font.glyphs.get(i);
                                if (glyph.unicode < 128) {
                                    lens[glyph.unicode] = glyph.path.commands.length;
                                    paths[glyph.unicode] = glyph.path.commands;
                                }
                            }
                            return [2 /*return*/, lens];
                    }
                });
            });
        }
        function rand(l, r) {
            r++;
            return l + Math.floor((r - l) * Math.random());
        }
        function gen1() {
            quest = "";
            ans = 0;
            for (var i = 0; i < 5; i++) {
                var cur = rand(33, 127);
                quest = "".concat(quest).concat(String.fromCharCode(cur));
                ans += cur;
            }
        }
        function gen2() {
            quest = "";
            ans = 0;
            for (var i = 0; i < 5; i++) {
                var cur = rand(33, 127);
                quest = "".concat(quest, "  ").concat(String.fromCharCode(i + 65), ". ").concat(String.fromCharCode(cur));
                ans = Math.max(ans, lens[cur]);
            }
        }
        function gen3() {
            quest = "'-/<>LV\\^_`|"[rand(0, 11)];
            ans = lens[quest.charCodeAt(0)];
        }
        function gen4() {
            var cur = rand(33, 127);
            quest = String.fromCharCode(cur);
            ans = paths[cur].filter(function (path) { return path.type == "Z"; }).length;
        }
        function gen5() {
            quest = "";
            ans = 0;
            var name = font.names.fullName.en;
            for (var i = 0; i < name.length; i++) {
                var cur = name.charCodeAt(i);
                for (var j = 1; j < paths[cur].length; j++) {
                    if (paths[cur][j].type == "Q" && paths[cur][j - 1].type != "Q") {
                        ans++;
                    }
                }
            }
        }
        function genhash() {
            var base = (score / 5 + 13) % 20 + 16;
            var hash = (BigInt(Date.now()) * BigInt(1145141) + BigInt(2147483647)).toString(base).concat("A").concat((score * 514 + 2197).toString(base));
            return hash;
        }
        var stage, score, lens, paths, font, quest, ans;
        var _this = this;
        return __generator(this, function (_a) {
            console.log("What's your favourite font? (Only english fonts are supported)");
            stage = 0, score = 0;
            lens = [];
            paths = [];
            process.stdin.on("data", function (data) { return __awaiter(_this, void 0, void 0, function () {
                var dat, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dat = data.toString().trim();
                            _a = stage;
                            switch (_a) {
                                case 0: return [3 /*break*/, 1];
                                case 1: return [3 /*break*/, 3];
                                case 2: return [3 /*break*/, 4];
                                case 3: return [3 /*break*/, 5];
                                case 4: return [3 /*break*/, 6];
                                case 5: return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 8];
                        case 1: return [4 /*yield*/, load(dat)];
                        case 2:
                            lens = _b.sent();
                            stage++;
                            console.log("Loaded. Now follow the instructions.");
                            console.log("What is the sum of the ASCIIs below?");
                            gen1();
                            console.log(quest);
                            return [3 /*break*/, 8];
                        case 3:
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
                            return [3 /*break*/, 8];
                        case 4:
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
                            return [3 /*break*/, 8];
                        case 5:
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
                            return [3 /*break*/, 8];
                        case 6:
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
                            return [3 /*break*/, 8];
                        case 7:
                            if (dat != ans.toString()) {
                                console.log("You made a bad mistake.");
                            }
                            else {
                                console.log("Congratulations. 50pts.");
                                score += 50;
                            }
                            console.log("Your final score is ".concat(score, ". Submit this code to Luogu in 2 minutes:"), genhash());
                            process.exit(0);
                            _b.label = 8;
                        case 8: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
fg();
