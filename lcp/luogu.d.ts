export namespace utl {
    export type Dict<T> = {
        [id: string]: T;
    };
    export type Map<K extends string, T> = {
        [id in K]: T;
    };
    export type F<U, V> = (p: U) => V;
}

export namespace lg {

    export interface User {
        avatar: string;
        background: string;
        badge?: string;
        ccfLevel: number;
        color: string;
        isAdmin: boolean;
        isBanned: boolean;
        name: string;
        slogan: string;
        uid: number;
    }

    export type ProblemType = "P" | "B" | "CF" | "AT" | "SP" | "UVA";

    export interface CurrentUser extends User {
        eloValue: number;
        followingCount: number;
        followerCount: number;
        ranking: number;
        blogAddress: string;
        unreadMessageCount: number;
        unreadNoticeCount: number;
        verified: boolean;
    }

    export namespace lgc {
        export type Mode = "icpc" | "ioi";

        export interface UserProblemScore {
            score: number;
            runningTime: number;
        }

        export interface UserScore extends UserProblemScore {
            details: utl.Dict<UserProblemScore>;
            user: User;
        }

        export interface ContestScoreboardPage {
            firstBloodUID: utl.Dict<number>;
            scoreboard: {
                count: number;
                perPage: number;
                result: UserScore[];
            },
            userScore: UserScore;
            userRank: number;
        }

        export interface ParsedProblemStatus {
            submitted: number;
            accepted: number;
            firstBlood: number;
        }

        export interface ParsedContestScoreboard extends ContestScoreboardPage {
            problems: string[];
            problemStatus: utl.Dict<ParsedProblemStatus>;
            shortRank: number[];
            participant: number;
            problemTitle: utl.Dict<string>;
        }
    }

    export namespace fe {
        export interface FeTheme {
            id: number;
            header: {
                imagePath: string;
                color: [number, number, number, number][];
                blur: number;
                brightness: number;
                degree: number;
                repeat: number;
                position: [number, number];
                size: [number, number];
                type: number;
                __CLASS_NAME: string;
            };
            sideNav: {
                logoBackgroundColor: [number, number, number, number];
                color: [number, number, number, number];
                invertColor: boolean;
                __CLASS_NAME: string;
            };
            footer: {
                imagePath: string;
                color: [number, number, number, number][];
                blur: number;
                brightness: number;
                degree: number;
                repeat: number;
                position: [number, number];
                size: [number, number];
                type: number;
                __CLASS_NAME: string;
            }
        }
        export namespace FeData {
            export interface Sample extends Array<string> {
                0: string;
                1: string;
                length: 2;
            }
            export interface OriginProblem {
                pid: string;
                title: string;
                difficulty: number;
                fullScore: number;
                type: ProblemType;
            }
            export interface UndetailedProblem extends OriginProblem {
                accepted: boolean;
                submitted: boolean;
            }
            export interface Problem extends UndetailedProblem {
                background: string;
                description: string;
                inputFormat: string;
                outputFormat: string;
                samples: Sample[];
                hint: string;
                provider: User;
                attachments: [];
                canEdit: boolean;
                limits: {
                    time: number[];
                    memory: number[];
                };
                showScore: boolean;
                score: number;
                stdCode: string;
                tags: number[];
                wantsTranslation: boolean;
                totalSubmit: number;
                totalAccepted: number;
                flag: number;
            }
            export interface UndetailedContest {
                id: number;
                name: string;
                startTime: number;
                endTime: number;
            }
            export interface Contest extends UndetailedContest {
                description: string;
                totalParticipants: number;
                eloDone: boolean;
                canEdit: boolean;
                ruleType: number;
                visibilityType: number;
                invitationCodeType: number;
                rated: boolean;
                eloThreshold?: any;
                host: User;
                problemCount: number;
            }
            export interface ContestProblem {
                score: number;
                problem: OriginProblem;
                submitted: boolean;
            }
            export interface Discussion {
                id: number;
                title: string;
                forum: {
                    id: number;
                    name: string;
                    slug: string;
                }
            }
            export interface UndetailedTeam {
                id: number;
                name: string;
                isPremium: boolean;
            }
            export interface TeamGroup {
                id: number;
                name: string;
                no: number;
            }
            export interface Team {
                team: UndetailedTeam;
                group: TeamGroup;
                user: User;
                type: number;
                permission: number;
            }
            export interface UserRating {
                contestRating: number;
                socialRating: number;
                practiceRating: number;
                basicRating: number;
                prizeRating: number;
                calculateTime: number;
                user: User;
                rating: number;
            }
            export interface Prize {
                year: number;
                contestName: string;
                prize: string;
            }
            export interface MaxElo {
                rating: number;
                time: number;
                latest: boolean;
            }
            export interface LatestElo extends MaxElo {
                contest: UndetailedContest;
                latest: true;
            }
            export interface DetailedUser extends CurrentUser {
                rating: UserRating;
                organization?: string;
                email: string;
                phone: string;
                registerTime: number;
                introduction: string;
                prize: Prize[];
                elo: LatestElo;
                userRelationship: number;
                reverseUserRelationship: number;
                passedProblemCount: number;
                submittedProblemCount: number;
            }
        }
        export interface FeData {
            ProblemShow: {
                problem: FeData.Problem;
                contest?: FeData.UndetailedContest;
                discussions: FeData.Discussion[];
                bookmarked: boolean;
                vjudgeUsername?: string;
                recommendations: FeData.UndetailedProblem[];
                lastLanguage: number;
                lastCode: string;
                privilegedTeams: FeData.UndetailedTeam[];
                userTranslation?: string;
            };
            ContestShow: {
                contest: FeData.Contest;
                contestProblems: FeData.ContestProblem[];
                isScoreboardFrozen: boolean;
                accessLevel: number;
                joined: boolean;
                userElo?: number;
            };
            UserShow: {
                user: FeData.DetailedUser;
                eloMax: FeData.MaxElo;
                passedProblems: FeData.OriginProblem[];
                submittedProblems: FeData.OriginProblem[];
                teams: FeData.Team[];
            }
        }
        export interface FeInjection<T extends keyof FeData> {
            code: number;
            currentTemplate: T;
            currentData: FeData[T];
            currentTitle: string;
            currentTheme: FeTheme;
            currentTime: number;
            currentUser: CurrentUser;
        }
    }
}
