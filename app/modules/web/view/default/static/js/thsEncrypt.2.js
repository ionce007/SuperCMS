(function (e) {
    function t(t) {
        for (var o, i, c = t[0], s = t[1], l = t[2], d = 0, u = []; d < c.length; d++)
            i = c[d],
                Object.prototype.hasOwnProperty.call(a, i) && a[i] && u.push(a[i][0]),
                a[i] = 0;
        for (o in s)
            Object.prototype.hasOwnProperty.call(s, o) && (e[o] = s[o]);
        m && m(t);
        while (u.length)
            u.shift()();
        return r.push.apply(r, l || []),
            n()
    }
    function n() {
        for (var e, t = 0; t < r.length; t++) {
            for (var n = r[t], o = !0, i = 1; i < n.length; i++) {
                var c = n[i];
                0 !== a[c] && (o = !1)
            }
            o && (r.splice(t--, 1),
                e = s(s.s = n[0]))
        }
        return e
    }
    var o = {}
        , i = {
            index: 0
        }
        , a = {
            index: 0
        }
        , r = [];
    function c(e) {
        return s.p + "js/" + ({}[e] || e) + "." + {
            "chunk-15f38bb6": "2c3274d2",
            "chunk-2d0b9265": "b23c5785",
            "chunk-f12ce20e": "fba04904"
        }[e] + ".js"
    }
    function s(t) {
        if (o[t])
            return o[t].exports;
        var n = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, s),
            n.l = !0,
            n.exports
    }
    s.e = function (e) {
        var t = []
            , n = {
                "chunk-15f38bb6": 1,
                "chunk-f12ce20e": 1
            };
        i[e] ? t.push(i[e]) : 0 !== i[e] && n[e] && t.push(i[e] = new Promise((function (t, n) {
            for (var o = "css/" + ({}[e] || e) + "." + {
                "chunk-15f38bb6": "c90fe985",
                "chunk-2d0b9265": "31d6cfe0",
                "chunk-f12ce20e": "35f519b1"
            }[e] + ".css", a = s.p + o, r = document.getElementsByTagName("link"), c = 0; c < r.length; c++) {
                var l = r[c]
                    , d = l.getAttribute("data-href") || l.getAttribute("href");
                if ("stylesheet" === l.rel && (d === o || d === a))
                    return t()
            }
            var u = document.getElementsByTagName("style");
            for (c = 0; c < u.length; c++) {
                l = u[c],
                    d = l.getAttribute("data-href");
                if (d === o || d === a)
                    return t()
            }
            var m = document.createElement("link");
            m.rel = "stylesheet",
                m.type = "text/css",
                m.onload = t,
                m.onerror = function (t) {
                    var o = t && t.target && t.target.src || a
                        , r = new Error("Loading CSS chunk " + e + " failed.\n(" + o + ")");
                    r.code = "CSS_CHUNK_LOAD_FAILED",
                        r.request = o,
                        delete i[e],
                        m.parentNode.removeChild(m),
                        n(r)
                }
                ,
                m.href = a;
            var h = document.getElementsByTagName("head")[0];
            h.appendChild(m)
        }
        )).then((function () {
            i[e] = 0
        }
        )));
        var o = a[e];
        if (0 !== o)
            if (o)
                t.push(o[2]);
            else {
                var r = new Promise((function (t, n) {
                    o = a[e] = [t, n]
                }
                ));
                t.push(o[2] = r);
                var l, d = document.createElement("script");
                d.charset = "utf-8",
                    d.timeout = 120,
                    s.nc && d.setAttribute("nonce", s.nc),
                    d.src = c(e);
                var u = new Error;
                l = function (t) {
                    d.onerror = d.onload = null,
                        clearTimeout(m);
                    var n = a[e];
                    if (0 !== n) {
                        if (n) {
                            var o = t && ("load" === t.type ? "missing" : t.type)
                                , i = t && t.target && t.target.src;
                            u.message = "Loading chunk " + e + " failed.\n(" + o + ": " + i + ")",
                                u.name = "ChunkLoadError",
                                u.type = o,
                                u.request = i,
                                n[1](u)
                        }
                        a[e] = void 0
                    }
                }
                    ;
                var m = setTimeout((function () {
                    l({
                        type: "timeout",
                        target: d
                    })
                }
                ), 12e4);
                d.onerror = d.onload = l,
                    document.head.appendChild(d)
            }
        return Promise.all(t)
    }
        ,
        s.m = e,
        s.c = o,
        s.d = function (e, t, n) {
            s.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: n
            })
        }
        ,
        s.r = function (e) {
            "undefined" !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }),
                Object.defineProperty(e, "__esModule", {
                    value: !0
                })
        }
        ,
        s.t = function (e, t) {
            if (1 & t && (e = s(e)),
                8 & t)
                return e;
            if (4 & t && "object" === typeof e && e && e.__esModule)
                return e;
            var n = Object.create(null);
            if (s.r(n),
                Object.defineProperty(n, "default", {
                    enumerable: !0,
                    value: e
                }),
                2 & t && "string" != typeof e)
                for (var o in e)
                    s.d(n, o, function (t) {
                        return e[t]
                    }
                        .bind(null, o));
            return n
        }
        ,
        s.n = function (e) {
            var t = e && e.__esModule ? function () {
                return e["default"]
            }
                : function () {
                    return e
                }
                ;
            return s.d(t, "a", t),
                t
        }
        ,
        s.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }
        ,
        s.p = "//s.thsi.cn/cb?cd/zx-detail-fronted-container/",
        s.oe = function (e) {
            throw console.error(e),
            e
        }
        ;
    var l = window["webpackJsonp"] = window["webpackJsonp"] || []
        , d = l.push.bind(l);
    l.push = t,
        l = l.slice();
    for (var u = 0; u < l.length; u++)
        t(l[u]);
    var m = d;
    r.push([0, "chunk-vendors"]),
        n()
}
)({
    0: function (e, t, n) {
        e.exports = n("9582")
    },
    "4f74": function (e, t) {
        e.exports = window.wxShare
    },
    "6d43": function (e, t) {
        e.exports = window.snsMobile
    },
    "87f7": function (e, t) {
        e.exports = window
    },
    "899c": function (e, t) {
        e.exports = window.snsHttp
    },
    "8bbf": function (e, t) {
        e.exports = Vue
    },
    9582: function (e, t, n) {
        "use strict";
        n.r(t);
        n("e260"),
            n("e6cf"),
            n("cca6"),
            n("a79d"),
            n("cd22");
        var o = n("6d43")
            , i = n.n(o)
            , a = (n("4160"),
                n("a630"),
                n("6eba"),
                n("0d03"),
                n("3ca3"),
                n("159b"),
                n("d4ec"))
            , r = n("bee2")
            , c = n("8bbf")
            , s = n.n(c)
            , l = function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", {
                    attrs: {
                        id: "app"
                    }
                }, [e.active ? n(e.currentComponent, {
                    tag: "component",
                    attrs: {
                        componentsModules: e.componentsModules
                    }
                }) : e._e()], 1)
            }
            , d = []
            , u = (n("caad"),
                n("c975"),
                n("a9e3"),
                n("d3b7"),
                n("ac1f"),
                n("25f0"),
                n("2532"),
                n("466d"),
                n("5319"),
                n("96cf"),
                n("1da1"))
            , m = n("262e")
            , h = n("2caf")
            , p = n("9ab4")
            , f = n("60a3")
            , v = function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", {
                    attrs: {
                        id: "article-wrap"
                    }
                }, [e.componentsModules.navigation ? n("ths-container", {
                    attrs: {
                        modules: [e.componentsModules.navigation],
                        "native-callback": e.nativeCb
                    }
                }) : e._e(), e.componentsModules.title ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.title],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.creative && e.isNeedVoice ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.creative],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.AIDiggingPopup ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.AIDiggingPopup],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.intellect_abstract_info && !e.isNeedVoice ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.intellect_abstract_info],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.showOpenAccountAd && e.componentsModules.open_account_ad ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.open_account_ad],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), n("div", {
                    staticClass: "wrapper news_detail news_list article"
                }, [n("div", {
                    staticClass: "msg_content"
                }, [e.componentsModules.preview ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.preview],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), n("div", {
                    staticClass: "ad tc none",
                    attrs: {
                        id: "ad_position_2"
                    }
                }), e.componentsModules.abstract && !e.isShowSummary ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.abstract],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), n("div", {
                    attrs: {
                        id: "content"
                    }
                }, [e._m(0), e.componentsModules.content ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.content],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e._m(1), e.componentsModules.motan && e.isShowGrayModule("linkQuestions") ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.motan],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e()], 1)], 1), e.componentsModules.image_report ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.image_report],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.forbidden_disclaimer ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.forbidden_disclaimer],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), n("sns-anchor", {
                    attrs: {
                        scroll: e.scrollDistance,
                        offset: e.winH
                    },
                    on: {
                        trigger: e.handleReadNumTrigger
                    }
                }, [e.componentsModules.read_num ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.read_num],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e()], 1), e.componentsModules.relative_theme && e.isNeedVoice ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.relative_theme],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.plague_data ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.plague_data],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e()], 1), e.componentsModules.share && e.isShowShare ? n("ths-container", {
                    ref: "shareContainerRef",
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.share],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.disclaimer ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.disclaimer],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.iji_profit_list && "bottom" === e.componentsModules.iji_profit_list.data.position ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.iji_profit_list],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.tab_swiper ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.tab_swiper],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.adv && e.isNeededAd && e.isNeedVoice && e.advertComponentLoaded ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.adv],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.showCommentComponent && e.commentComponentLoaded ? n("div", {
                    staticClass: "gap-block",
                    staticStyle: {
                        height: "0.12rem"
                    }
                }) : e._e(), e.showCommentComponent && e.commentComponentLoaded ? n("NewComment", {
                    staticClass: "comment",
                    attrs: {
                        baseConfig: e.baseConfig,
                        bottomConfig: e.bottomConfig,
                        articleConfig: e.articleConfig
                    }
                }) : e._e(), e.componentsModules.zx_share_card && e.isShowCard ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.zx_share_card],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.ijijin_red_envelope ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.ijijin_red_envelope],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e(), e.componentsModules.encyclopedias ? n("ths-container", {
                    attrs: {
                        "scroll-top": e.scrollDistance,
                        modules: [e.componentsModules.encyclopedias],
                        "native-callback": e.nativeCb,
                        font: e.componentFz
                    }
                }) : e._e()], 1)
            }
            , w = [function () {
                var e = this
                    , t = e.$createElement
                    , n = e._self._c || t;
                return n("div", [n("p", {
                    staticStyle: {
                        width: "0",
                        height: "0"
                    }
                }, [n("img", {
                    staticStyle: {
                        display: "block",
                        width: "0",
                        height: "0",
                        "margin-left": "-40px"
                    }
                })])])
            }
                , function () {
                    var e = this
                        , t = e.$createElement
                        , n = e._self._c || t;
                    return n("div", [n("p", {
                        staticStyle: {
                            width: "0",
                            height: "0"
                        }
                    }, [n("img", {
                        staticStyle: {
                            display: "block",
                            width: "0",
                            height: "0",
                            "margin-left": "-40px"
                        }
                    })])])
                }
            ]
            , g = (n("c0b6"),
                n("4795"),
                n("5530"))
            , b = (n("b0c0"),
                n("99af"),
                n("277d"),
                n("13d5"),
                n("4d90"),
                n("1276"),
                n("3835"),
                n("53ca"),
                n("15fd"));
        (function (e) {
            i.a.getApp = function () {
                var t = e()
                    , n = t.appName
                    , o = Object(b["a"])(t, ["appName"]);
                return Object(g["a"])(Object(g["a"])({}, o), {}, {
                    appName: "thsSuper" === n ? "ths" : n
                })
            }
        }
        )(i.a.getApp),
            function (e) {
                i.a.isLogin = function () {
                    return !!N || e()
                }
            }(i.a.isLogin),
            i.a.callNativeHandler = window.callNativeHandler,
            i.a.registerWebHandler = window.registerWebHandler,
            i.a.registerWebListener = window.registerWebListener,
            i.a.jumpUrl = function (e) {
                var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ""
                    , n = arguments.length > 2 ? arguments[2] : void 0
                    , o = i.a.httpUrl
                    , a = i.a.getApp
                    , r = i.a.jumpStat;
                t && r(t, n);
                var c = o(e);
                "ths" === a().appName ? c.includes("liveHome") ? window.location.href = "client.html?action=ymtz^webid=2804^fullscreen=1^url=".concat(c, "&snsWebPageType=zhibo^notitlebar=1^showStatusBar=1^mode=new^statusBarColor=252528") : window.location.href = "client.html?action=ymtz^webid=2804^url=".concat(c, "^mode=new") : window.location.href = c
            }
            ,
            i.a.getSeq = function (e) {
                var t = /10jqka.com.cn\/m(\d+)_?.*/
                    , n = e.match(t);
                return n ? n[1] : null
            }
            ;
        var y, k = n("87f7"), C = (n("d82a"),
            n("4f74"),
            window.location.hostname), _ = "https://m.10jqka.com.cn/", S = ["title", "navigation", "creative", "comment", "disclaimer", "bottom_bar", "abstract"];
        (function (e) {
            e["TI"] = "title",
                e["NAV"] = "navigation",
                e["CRE"] = "creative",
                e["COM"] = "comment",
                e["DIS"] = "disclaimer",
                e["BOT"] = "bottom_bar",
                e["ABS"] = "abstract"
        }
        )(y || (y = {}));
        var O = n("8237")
            , x = n.n(O)
            , j = n("32e6")
            , T = n.n(j)
            , N = (n("5a0c"),
                !1)
            , M = Object(o["getApp"])()
            , D = (M.appName,
                M.platform)
            , E = (M.version,
                function (e, t) {
                    return !e.match(/^((http:\/\/)|(https:\/\/)|\/\/)/) && t ? t.replace(/\/+$/, "") + "/" + e.replace(/^\/+/, "") : e
                }
            )
            , L = ("http".concat("iphone" === D ? "s" : "", "://s.thsi.cn/css/m/zixun/images/thslogo.png"),
                "http".concat("iphone" === D ? "s" : "", "://i.thsi.cn/sns/game/game-gsjl-share-logo.png"),
                "//s.thsi.cn/cb?/iwencai/jgy/7.36.2.yuyinzhushou/jgyLib.08a7280e.js")
            , A = "//s.thsi.cn/cb?/iwencai/jgy/7.36.2.yuyinzhushou/jgyLib.8c8e7370.css"
            , q = function (e) {
                return "function" === typeof e
            }
            , R = function (e) {
                return "string" === typeof e
            }
            , P = (Array.isArray,
                function (e) {
                    var t = new Date(1e3 * Number(e))
                        , n = [t.getFullYear(), (t.getMonth() + 1).toString().padStart(2, "0"), t.getDate().toString().padStart(2, "0"), t.getHours().toString().padStart(2, "0"), t.getMinutes().toString().padStart(2, "0")]
                        , o = n[0]
                        , i = n[1]
                        , a = n[2];
                    n[3],
                        n[4];
                    return "".concat(o).concat(i).concat(a)
                }
            )
            , F = function (e) {
                return Number(e) % 2 === 1 ? "a" : "b"
            }
            , z = function (e) {
                var t = B(e)
                    , n = I(e);
                window.modules = t,
                    window.hxm = n
            }
            , H = function (e) {
                var t = e.name
                    , n = void 0 === t ? "" : t
                    , o = e.data
                    , i = void 0 === o ? {} : o
                    , a = e.api
                    , r = void 0 === a ? "" : a
                    , c = e.params
                    , s = void 0 === c ? {} : c
                    , l = {
                        name: n,
                        data: i,
                        api: r,
                        params: s
                    };
                return l
            }
            , B = function (e) {
                var t, n = [], o = e.newsInfo, i = e.hotKey, a = e.token, r = e.disclaimer;
                return S.forEach((function (c) {
                    switch (c) {
                        case y.TI:
                            var s = o.title
                                , l = o.nature;
                            t = H({
                                name: y.TI,
                                data: {
                                    title: s,
                                    nature: l,
                                    shareTitle: s,
                                    isCharge: 0
                                }
                            });
                            break;
                        case y.NAV:
                            t = H({
                                name: y.NAV
                            });
                            break;
                        case y.CRE:
                            var d = o.source
                                , u = o.ctime;
                            t = H({
                                name: y.CRE,
                                data: {
                                    name: d,
                                    mtime: u,
                                    hotKey: i,
                                    token: a
                                }
                            });
                            break;
                        case y.COM:
                            if (o.supportComment) {
                                var m = e.comment.pid;
                                t = H({
                                    name: y.COM,
                                    params: {
                                        pid: m
                                    }
                                });
                                break
                            }
                            t = H({
                                name: "nothing"
                            });
                            break;
                        case y.ABS:
                            var h = o.summ;
                            if (h) {
                                t = H({
                                    name: y.ABS,
                                    data: {
                                        abstract: h
                                    }
                                });
                                break
                            }
                            t = H({
                                name: "nothing"
                            });
                            break;
                        case y.DIS:
                            t = H({
                                name: y.DIS,
                                data: {
                                    disclaimer: r
                                }
                            });
                            break;
                        case y.BOT:
                            var p = o.stockCodes
                                , f = p.stockCodes
                                , v = p.usCodes
                                , w = p.hkCodes
                                , g = p.conceptCodes
                                , b = p.fieldCodes;
                            t = {
                                name: y.BOT,
                                data: [{
                                    type: "input"
                                }, {
                                    type: "comment"
                                }, {
                                    type: "like"
                                }, {
                                    type: "share"
                                }, {
                                    type: "drawer",
                                    stockCode: {
                                        stock: f,
                                        us: v,
                                        hk: w,
                                        field: b,
                                        concept: g
                                    }
                                }],
                                api: "",
                                params: {}
                            };
                            break
                    }
                    "nothing" !== t.name && n.push(t)
                }
                )),
                    n
            }
            , I = function (e) {
                var t = e.newsInfo
                    , n = {
                        wxhy: x()("share_wxhy_seq_".concat(t.seq, "ths10jqka")),
                        wxpyq: x()("share_wxpyq_seq_".concat(t.seq, "ths10jqka")),
                        weibo: x()("share_weibo_seq_".concat(t.seq, "ths10jqka")),
                        qq: x()("share_qq_seq_".concat(t.seq, "ths10jqka")),
                        qqzone: x()("share_qqzone_seq_".concat(t.seq, "ths10jqka"))
                    }
                    , o = {
                        title: t.title,
                        isFastPush: t.isFastPush,
                        isTest: !1,
                        concept: [],
                        conLinkType: t.conLinkType || "all",
                        ctime: t.ctime,
                        webLink: t.webLink,
                        from: t.source,
                        sensitiveTypeList: t.sensitiveTypeList,
                        isPolitics: t.isPolitics,
                        isKuaixun: t.isKuaixun,
                        stockCodes: t.stockCodes,
                        kxSubscribe: e.kxSubscribe,
                        baseShareUrl: "".concat(_).concat(P(t.ctime), "/c").concat(t.seq, ".shtml"),
                        seq: t.seq,
                        content: t.content,
                        supportComment: t.supportComment,
                        authen: x()("seq_".concat(t.seq, "ths10jqka")),
                        shareTokens: n,
                        newsTag: t.taginfo,
                        pageid: "seq_".concat(t.seq),
                        platform: Object(k["getPlatform"])(),
                        version: Object(k["getAppVersion"])(),
                        userid: Object(k["getUserid"])(),
                        isQs: navigator.userAgent.indexOf("Royal Flush; Qs") > 0,
                        isPro: navigator.userAgent.indexOf("iPhoneTargetType/hexinPro") > 0,
                        testFlag: F(Object(k["getUserid"])()),
                        isNeededAd: !1 !== e.isNeededAd,
                        copyright: t.copyright,
                        sourceUrl: t.sourceUrl,
                        classList: t.classList,
                        showStocks: e.showStocks,
                        AISummary: e.aiSummary,
                        grayConfig: e.grayConfig,
                        linkQuestions: e.linkQuestions,
                        event: e.event || [],
                        imageOcrStock: e.imageOcrStock
                    };
                return o
            }
            , W = function () {
                var e = Object(u["a"])(regeneratorRuntime.mark((function e() {
                    var t;
                    return regeneratorRuntime.wrap((function (e) {
                        while (1)
                            switch (e.prev = e.next) {
                                case 0:
                                    return t = "https://news.10jqka.com.cn",
                                        e.abrupt("return", new Promise((function (e) {
                                            window._offlinePkg ? window.dynamicDomain.exchangeHost(t, (function (t) {
                                                e(t.replace(/\/$/, ""))
                                            }
                                            )) : e(window.location.origin)
                                        }
                                        )));
                                case 2:
                                case "end":
                                    return e.stop()
                            }
                    }
                    ), e)
                }
                )));
                return function () {
                    return e.apply(this, arguments)
                }
            }()
            , $ = function (e) {
                return new Promise((function (t) {
                    T()(e, (function (e) {
                        !e && t()
                    }
                    ))
                }
                ))
            }
            , U = function (e) {
                var t = document.createElement("link");
                t.href = e,
                    t.rel = "stylesheet",
                    t.type = "text/css",
                    document.head.appendChild(t)
            }
            , V = function () {
                return navigator.userAgent.indexOf("iPhoneTargetType/hexinPro") > -1
            }
            , K = function (e, t) {
                window.ClientMonitor && window.ClientMonitor.reportFrameErrors({
                    category: "promise",
                    grade: "FrontEndError"
                }, {
                    name: e,
                    message: t,
                    stack: "-"
                })
            }
            , Q = function () {
                return window.navigator.userAgent.includes("scheme/harmonyos")
            }
            , G = function (e) {
                Object(o["callNativeHandler"])("notifyWebHandleEvent", ""),
                    Object(o["registerWebHandler"])("notifyWebHandleEvent", (function (t) {
                        console.log("777", t),
                            e(t)
                    }
                    ))
            }
            , J = function (e) {
                Object(o["callNativeHandler"])("NotifyNativeEventToWeb", ""),
                    Object(o["registerWebHandler"])("NotifyNativeEventToWeb", (function (t) {
                        e(t)
                    }
                    ))
            }
            , X = function (e) {
                Object(o["registerWebHandler"])("zxVoiceBroadcast", (function (t) {
                    e(t)
                }
                ))
            }
            , Y = function (e) {
                Object(o["callNativeHandler"])("notifyWebHandleEvent", {
                    method: "isSendUserBehavior"
                }, (function (t) {
                    e[0](t)
                }
                )),
                    Object(o["registerWebHandler"])("sendUserBehavior", (function (t) {
                        e[1](t)
                    }
                    ))
            }
            , Z = (n("fb6a"),
                function () {
                    function e(t) {
                        Object(a["a"])(this, e),
                            this.arr = [],
                            this.config = Object.assign({}, t),
                            this.config.dom && this.init()
                    }
                    return Object(r["a"])(e, [{
                        key: "init",
                        value: function () {
                            this.insertDom(),
                                this.bindEvent()
                        }
                    }, {
                        key: "getDomTree",
                        value: function (e) {
                            var t = this;
                            if (e)
                                if (0 !== e.children.length)
                                    Array.from(e.children).forEach((function (e) {
                                        t.getDomTree(e)
                                    }
                                    ));
                                else {
                                    var n, o = e.parentNode, i = o.childNodes[0];
                                    3 === i.nodeType || 3 === (null === (n = i.nextSibling) || void 0 === n ? void 0 : n.nodeType) ? Array.from(o.childNodes).forEach((function (e) {
                                        t.arr.push(e)
                                    }
                                    )) : this.arr.push(e)
                                }
                        }
                    }, {
                        key: "insertDom",
                        value: function () {
                            var e = this.config
                                , t = e.dom
                                , n = e.first
                                , o = e.space
                                , i = [t]
                                , a = [];
                            while (i.length > 0)
                                if (t && (t.childNodes.length > 1 || 1 === t.childNodes.length && 3 != t.childNodes[0].nodeType))
                                    t = t.childNodes[0],
                                        i.push(t);
                                else {
                                    var r = i.pop();
                                    if (r.nextSibling || 0 === i.length) {
                                        a.push(t),
                                            t = r.nextSibling;
                                        while (this.judgeDom(t))
                                            t = t.nextSibling;
                                        t && i.push(t)
                                    }
                                }
                            var c = 0
                                , s = this;
                            a.forEach((function (e) {
                                var t;
                                if (e && !(e && e.className && e.className.indexOf("sp-robot") > -1)) {
                                    3 === e.nodeType && (e = s.replaceDom(e));
                                    for (var i = (null === (t = e) || void 0 === t ? void 0 : t.innerText) || "", a = "", r = 0; r < i.length; r++)
                                        "&" === i[r] ? "&nbsp;" === i.slice(r, r + 6) ? (r += 5,
                                            a += "&nbsp;") : "&gt;" === i.slice(r, r + 4) && (r += 3,
                                                a += "&gt;") : (a += i[r],
                                                    c++,
                                                    c >= n && (c - n) % o === 0 && (a += "<span class='statReadTag'></span>"));
                                    e.innerHTML = a
                                }
                            }
                            ))
                        }
                    }, {
                        key: "replaceDom",
                        value: function (e) {
                            var t = document.createElement("span");
                            if (e) {
                                var n = e.parentNode;
                                t.innerHTML = e.nodeValue,
                                    n && n.replaceChild(t, e)
                            }
                            return t
                        }
                    }, {
                        key: "judgeDom",
                        value: function (e) {
                            return e && (8 !== e.nodeType && 3 !== e.nodeType && "none" === window.getComputedStyle(e).display || "STYLE" === e.tagName || "SCRIPT" === e.tagName)
                        }
                    }, {
                        key: "bindEvent",
                        value: function () {
                            var e = 0
                                , t = 0
                                , n = document.getElementsByClassName("statReadTag");
                            window.addEventListener("scroll", (function () {
                                if (t !== n.length) {
                                    var i = document.documentElement.clientHeight || document.body.clientHeight
                                        , a = document.body.scrollTop || document.documentElement.scrollTop
                                        , r = i + a;
                                    r > e && (e = r,
                                        t < n.length && e > n[t].offsetTop && (Object(o["funcStat"])(hxm.pageid + ".read." + (t + 1)),
                                            t++))
                                }
                            }
                            ))
                        }
                    }]),
                        e
                }())
            , ee = function (e) {
                Object(m["a"])(i, e);
                var t = Object(h["a"])(i);
                function i() {
                    var e;
                    return Object(a["a"])(this, i),
                        e = t.apply(this, arguments),
                        e.scrollDistance = 0,
                        e.nativeCb = {},
                        e.componentFz = "m",
                        e.winH = 0,
                        e.showComponents = {
                            shareCard: !1
                        },
                        e.isNeededAd = window.hxm.isNeededAd && !Q(),
                        e.advertComponentLoaded = !1,
                        e.isNeedVoice = 2 !== window.hxm.copyright && !Q(),
                        e.isShowShare = !Q(),
                        e.showCommentComponent = !1,
                        e.commentComponentLoaded = !1,
                        e.showOpenAccountAd = !1,
                        e.isShowCard = "iphone" === Object(k["getPlatform"])(),
                        e.judgeShowComponents = function (t) {
                            var n = t.target;
                            e.showComponents.shareCard = "bottomMenuButton" === n || "weixinBt" === n || "shareBt" === n
                        }
                        ,
                        e
                }
                return Object(r["a"])(i, [{
                    key: "nativeHandler",
                    value: function (e) {
                        this.judgeShowComponents(e)
                    }
                }, {
                    key: "isShowGrayModule",
                    value: function (e) {
                        var t, n, o = (null === (t = window.getUserid()) || void 0 === t ? void 0 : t.toString()) || "", i = Number(o.substr(o.length - 3, 3)) || -1, a = null !== (n = window.hxm.grayConfig[e]) && void 0 !== n ? n : {};
                        if (a) {
                            var r = a.userIdRange
                                , c = void 0 === r ? -1 : r
                                , s = a.userIdWhite
                                , l = void 0 === s ? [] : s;
                            if (-1 === c)
                                return !1;
                            var d = l.includes(o);
                            return window.hxm[e] && (-1 !== i && i <= Number(c) || d)
                        }
                        return !1
                    }
                }, {
                    key: "getScrollDistance",
                    value: function () {
                        this.scrollDistance = document.documentElement.scrollTop || document.body.scrollTop
                    }
                }, {
                    key: "loadAdvertComponent",
                    value: function () {
                        var e = this
                            , t = "https://s.thsi.cn/cd/mobileweb-eq-ths-mobile-components-front-container/mobileweb_AdvertCommon@1.0.6.js";
                        T()(t, (function (t, n) {
                            f["c"] && window["mobileweb_AdvertCommon@1.0.6"]["default"] && (f["c"].use(window["mobileweb_AdvertCommon@1.0.6"]["default"]),
                                e.advertComponentLoaded = !0)
                        }
                        ))
                    }
                }, {
                    key: "doSthLoaded",
                    value: function () {
                        if (window["thsc-share"] && f["c"].use(window["thsc-share"]),
                            1 === window.$themeMode) {
                            var e, t, n = document.getElementsByTagName("iframe");
                            if (n.length > 0)
                                e = null === (t = n[0].contentWindow) || void 0 === t ? void 0 : t.document.getElementsByTagName("body"),
                                    e[0].style.background = "#121212"
                        }
                    }
                }, {
                    key: "getWinH",
                    value: function () {
                        this.winH = -1 * (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)
                    }
                }, {
                    key: "emitScrollToComment",
                    value: function () {
                        this.$broadcast("NativeBottom", "SCROLL_TO_COMMENT")
                    }
                }, {
                    key: "emitScrollToTop",
                    value: function () {
                        this.$broadcast("NativeBottom", "SCROLL_TO_NEWS")
                    }
                }, {
                    key: "handleTrigger",
                    value: function (e) {
                        "toTop" === e ? this.emitScrollToTop() : "toBot" === e && this.emitScrollToComment()
                    }
                }, {
                    key: "handleReadNumTrigger",
                    value: function (e) {
                        "toTop" === e ? this.$broadcast("NativeBottom", "SCROLL_TO_COMMONSHARE") : "toBot" === e && this.$broadcast("NativeBottom", "SCROLL_TO_WEIXINSHARE")
                    }
                }, {
                    key: "scrollToComment",
                    value: function () {
                        var e, t = null === (e = document.getElementById("hotNewsCommentsPro")) || void 0 === e ? void 0 : e.offsetTop;
                        window.scrollTo(0, t),
                            this.emitScrollToComment()
                    }
                }, {
                    key: "scrollToNews",
                    value: function () {
                        window.scroll(0, 0),
                            this.emitScrollToTop()
                    }
                }, {
                    key: "readContStatics",
                    value: function () {
                        var e = document.getElementById("content");
                        if (e) {
                            var t = {
                                dom: e,
                                first: 450,
                                space: 140
                            };
                            new Z(t),
                                e.addEventListener("click", (function (e) {
                                    var t = e.target;
                                    "push-link" === t.getAttribute("id") && Object(o["jumpStat"])(hxm.pageid + ".backflow", "free_zixun_724")
                                }
                                ))
                        }
                    }
                }, {
                    key: "registerEmitterListener",
                    value: function () {
                        var e = this;
                        this.$on("SCROLL_TO_COMMENT", (function () {
                            e.scrollToComment()
                        }
                        )),
                            this.$on("SCROLL_TO_NEWS", (function () {
                                e.scrollToNews()
                            }
                            )),
                            window.vm.$on("CONTENT_LOADED", (function () {
                                window.perfData.contentLoaded = Date.now() - window.perfData.beginRender,
                                    window._offlinePkg && (window.callNativeHandler("perfTimeToElk", Object(g["a"])({
                                        templateRenderEnd: Date.now()
                                    }, window.perfData), (function () { }
                                    )),
                                        "gphone" === Object(k["getPlatform"])() && window.callNativeHandler("notifyNativeDismissCover", {}, (function () { }
                                        ))),
                                    e.readContStatics()
                            }
                            ))
                    }
                }, {
                    key: "setFz",
                    value: function (e) {
                        "small" === e ? this.componentFz = "s" : "normal" === e ? this.componentFz = "m" : "recommend" === e ? this.componentFz = "l" : "bigger" === e || "big" === e ? this.componentFz = "xl" : "biggest" !== e && "large" !== e && "huge" !== e || (this.componentFz = "xxl")
                    }
                }, {
                    key: "setFzByUA",
                    value: function () {
                        var e = navigator.userAgent
                            , t = /hxFont\/(\S*)/.exec(e)
                            , n = /getHXAPPFontSetting\/(\S*)/.exec(e);
                        console.log(n),
                            t = n || t;
                        var o = t ? t[1] : "normal";
                        this.setFz(o)
                    }
                }, {
                    key: "nativeListeners",
                    value: function () {
                        var e = this;
                        console.log("nativeListeners 执行了");
                        var t = function (t) {
                            e.nativeCb = t,
                                "scrollToComments" === t.method && e.scrollToComment(),
                                "scrollBackToNews" === t.method && e.scrollToNews(),
                                "NewsWebView_ChangeFont" === t.method && e.setFz(t.params.fontSize)
                        }
                            , n = function (t) {
                                e.nativeCb = t
                            };
                        G(t),
                            J(n),
                            X((function (t) {
                                t.nativeName = "zxVoiceBroadcast",
                                    e.nativeCb = t
                            }
                            ))
                    }
                }, {
                    key: "showBottomBar",
                    value: function () {
                        this.$broadcast("NativeBottom", "SHOW_BOTTOM")
                    }
                }, {
                    key: "registerUserBehavior",
                    value: function () {
                        var e = function () {
                            window.hxmPageStat && window.hxmPageStat(hxm.pageid),
                                2 === window.hxm.copyright && window.hxmPageStat && window.hxmPageStat("".concat(hxm.pageid, ".forbid"))
                        }
                            , t = [function (t) {
                                !1 !== t && e()
                            }
                                , function (t) {
                                    e()
                                }
                            ];
                        if (/IHexin\//.test(navigator.userAgent))
                            try {
                                Y(t)
                            } catch (n) {
                                console.error(n)
                            }
                        else
                            e()
                    }
                }, {
                    key: "importVideojs",
                    value: function () {
                        return new Promise((function (e, t) {
                            var n = document.createElement("script");
                            n.src = "//s.thsi.cn/cb?sns/js/mobile/components/video/video_v7.7.6.min.js",
                                n.onload = function () {
                                    e(!0)
                                }
                                ,
                                n.onerror = function () {
                                    t()
                                }
                                ,
                                document.head.appendChild(n)
                        }
                        ))
                    }
                }, {
                    key: "setDocumentTitle",
                    value: function () {
                        "gphone" === Object(k["getPlatform"])() && (document.title = "同花顺资讯")
                    }
                }, {
                    key: "setVideoIcon",
                    value: function () {
                        var e = document.createElement("div");
                        e.className = "vjs-icon-play",
                            e.style.height = "0px",
                            document.querySelector("body").appendChild(e)
                    }
                }, {
                    key: "setIframeHeight",
                    value: function (e) {
                        e.origin.includes("10jqka") && this.$nextTick((function () {
                            document.getElementById("dataifm") && (document.getElementById("dataifm").style.height = e.data + "px")
                        }
                        ))
                    }
                }, {
                    key: "initEvent",
                    value: function () {
                        window.addEventListener("scroll", this.getScrollDistance),
                            this.setDocumentTitle(),
                            this.doSthLoaded(),
                            this.getWinH(),
                            this.registerEmitterListener(),
                            this.showBottomBar(),
                            this.registerUserBehavior(),
                            this.nativeListeners(),
                            this.setFzByUA(),
                            this.setVideoIcon(),
                            window.addEventListener("message", this.setIframeHeight)
                    }
                }, {
                    key: "loadeCommentComponents",
                    value: function () {
                        var e = this
                            , t = function () {
                                return n.e("chunk-2d0b9265").then(n.t.bind(null, "325e", 7))
                            };
                        t().then((function (t) {
                            f["c"].component("NewComment", t["default"]),
                                e.showCommentComponent = !0,
                                e.commentComponentLoaded = !0
                        }
                        ))["catch"]((function (e) {
                            console.log(e)
                        }
                        ))
                    }
                }, {
                    key: "created",
                    value: function () {
                        window.vm = this
                    }
                }, {
                    key: "mounted",
                    value: function () {
                        var e = Object(u["a"])(regeneratorRuntime.mark((function e() {
                            var t, n, o = this;
                            return regeneratorRuntime.wrap((function (e) {
                                while (1)
                                    switch (e.prev = e.next) {
                                        case 0:
                                            if (document.documentElement.style.backgroundColor = "white" === document.documentElement.getAttribute("theme-mode") ? "#fff" : "#121212",
                                                window.hxm.supportComment && !Q() && (t = setInterval((function () {
                                                    (o.sadness || void 0 !== o.bottomConfig.likeConfig.handleLikeClick) && (o.showCommentComponent = !0),
                                                        o.loadeCommentComponents(),
                                                        clearInterval(t)
                                                }
                                                ), 100)),
                                                this.isNeededAd && this.isNeedVoice && this.loadAdvertComponent(),
                                                n = window.hxm.content,
                                                ~n.indexOf("video-insert"))
                                                try {
                                                    this.initEvent()
                                                } catch (i) {
                                                    this.initEvent()
                                                }
                                            else
                                                this.initEvent();
                                        case 5:
                                        case "end":
                                            return e.stop()
                                    }
                            }
                            ), e, this)
                        }
                        )));
                        function t() {
                            return e.apply(this, arguments)
                        }
                        return t
                    }()
                }, {
                    key: "onShowCommentComponentChange",
                    value: function (e) {
                        var t = this;
                        e && !window.hxm.isPolitics && setTimeout((function () {
                            t.showOpenAccountAd = !0
                        }
                        ), 50)
                    }
                }, {
                    key: "destroyed",
                    value: function () {
                        window.removeEventListener("scroll", this.getScrollDistance),
                            window.removeEventListener("message", this.setIframeHeight)
                    }
                }, {
                    key: "isShowSummary",
                    get: function () {
                        var e, t = (null === (e = window.getUserid()) || void 0 === e ? void 0 : e.toString()) || "", n = Number(t.substr(t.length - 3, 3)) || -1, o = window.hxm.grayConfig.aiSummary;
                        if (o) {
                            var i = o.userIdRange
                                , a = void 0 === i ? -1 : i
                                , r = o.userIdWhite
                                , c = void 0 === r ? [] : r;
                            if (-1 === a)
                                return !1;
                            var s = c.includes(t);
                            return window.hxm.AISummary && (-1 !== n && n <= Number(a) || s)
                        }
                        return !1
                    }
                }, {
                    key: "baseConfig",
                    get: function () {
                        return {
                            pid: window.hxm.seq,
                            fromid: 8,
                            source: "news",
                            contentType: "news"
                        }
                    }
                }, {
                    key: "sadness",
                    get: function () {
                        if (!window.hxm.classList)
                            return !1;
                        var e = "002053015";
                        return window.hxm.classList.includes(e)
                    }
                }, {
                    key: "bottomConfig",
                    get: function () {
                        var e, t, n, o, i, a, r, c = this, s = null !== (e = window.hxm) && void 0 !== e ? e : {}, l = s.seq, d = s.title, u = null === (t = this.componentsModules) || void 0 === t || null === (n = t.share) || void 0 === n ? void 0 : n.data, m = null !== u && void 0 !== u ? u : {}, h = m.addPraiseData, p = m.shareDataMap, f = m.shareObj, v = m.shareKeys, w = m.token, g = null !== h && void 0 !== h ? h : {}, b = g.count, y = g.status, k = null === (o = this.$refs.shareContainerRef) || void 0 === o || null === (i = o.$children) || void 0 === i || null === (a = i[0]) || void 0 === a || null === (r = a.$children) || void 0 === r ? void 0 : r[0], C = {
                            showLike: !this.sadness,
                            likeNum: b,
                            like: y,
                            handleLikeClick: null === k || void 0 === k ? void 0 : k.handleClickPraise.bind(k)
                        }, _ = "https://news.10jqka.com.cn/m".concat(l, "/"), S = {
                            url: _,
                            showCollect: !0,
                            actionKey: "news_".concat(l)
                        }, O = 0;
                        for (var x in p)
                            Object.prototype.hasOwnProperty.call(p, x) && (O += p[x]);
                        var j = {
                            showShare: !0,
                            shareTitle: d,
                            shareUrl: null === f || void 0 === f ? void 0 : f.url,
                            shareNum: O,
                            updateShareNum: function (e) {
                                var t = c.componentsModules
                                    , n = ["navigation", "share"];
                                n.forEach((function (n) {
                                    t[n] && (t[n].data.shareDataMap[e] += 1)
                                }
                                ))
                            },
                            addShareNumKeysObj: v,
                            addShareNumApp: "news",
                            addShareNumTokensObj: w
                        }
                            , T = {
                                showComment: !0
                            };
                        return "gphone" === window.getPlatform() ? {
                            likeConfig: C,
                            collectConfig: S,
                            shareConfig: j,
                            commentConfig: T
                        } : {
                            likeConfig: C,
                            shareConfig: j,
                            commentConfig: T
                        }
                    }
                }, {
                    key: "articleConfig",
                    get: function () {
                        var e = new DOMParser
                            , t = e.parseFromString(window.hxm.content, "text/html")
                            , n = {
                                pid: window.hxm.seq,
                                bizType: 8,
                                title: window.hxm.title,
                                content: t.body.textContent || ""
                            };
                        return {
                            postData: n
                        }
                    }
                }]),
                    i
            }(f["c"]);
        Object(p["a"])([Object(f["b"])()], ee.prototype, "componentsModules", void 0),
            Object(p["a"])([Object(f["d"])("nativeCb", {
                deep: !0
            })], ee.prototype, "nativeHandler", null),
            Object(p["a"])([Object(f["d"])("showCommentComponent", {
                immediate: !0
            })], ee.prototype, "onShowCommentComponentChange", null),
            ee = Object(p["a"])([Object(f["a"])({
                name: "postVue",
                components: {}
            })], ee);
        var te, ne = ee, oe = ne, ie = n("2877"), ae = Object(ie["a"])(oe, v, w, !1, null, null, null), re = ae.exports, ce = (n("ddb0"),
            n("2b3d"),
            n("899c")), se = n.n(ce), le = {
                baseURL: N ? "" : "//".concat(C),
                dataFormat: function (e) {
                    var t = e.errorCode
                        , n = e.errorMsg
                        , o = e.result;
                    if (0 == t)
                        return o;
                    throw n
                }
            }, de = function (e) {
                var t = Object(g["a"])(Object(g["a"])({}, le), q(e) ? e() : e);
                return function (e) {
                    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
                        , o = Object(g["a"])(Object(g["a"])({}, t), n)
                        , i = o.baseURL
                        , a = o.dataFormat;
                    return R(e) && (e = {
                        url: e
                    }),
                        e.url = E(e.url, i),
                        se()(e)["catch"]((function (e) {
                            throw e
                        }
                        )).then((function (e) {
                            return q(a) ? a(e) : e
                        }
                        ))
                }
            }, ue = Object.assign(de(le), {
                create: de,
                default: le
            }), me = (n("e25e"),
                n("9dcd")), he = n.n(me), pe = new he.a("2147483647"), fe = (new he.a("89549225983"),
                    new he.a("100000000000")), ve = 4, we = 3, ge = 11, be = function (e) {
                        if (e < 0 || new he.a(e).gte(fe))
                            throw new Error("Seq must be between 0 and ".concat(fe.toString()))
                    }, ye = function (e) {
                        return e.times(pe).mod(fe)
                    }, ke = function (e) {
                        return e.toString().padStart(ge, "0")
                    }, Ce = function (e) {
                        return String(e).split("").reduce((function (e, t) {
                            return e + parseInt(t)
                        }
                        ), 0) % 10
                    }, _e = function (e, t) {
                        var n = "".concat(e).concat(t);
                        return x()(n)
                    }, Se = function (e) {
                        be(e);
                        var t = new he.a(e)
                            , n = ye(t)
                            , o = ke(n)
                            , i = Ce(e)
                            , a = _e(e, i);
                        return a.substring(0, ve) + o + i + a.substring(a.length - we)
                    }, Oe = function (e) {
                        var t;
                        try {
                            t = new URL(e).pathname
                        } catch (s) {
                            t = e.split("?")[0]
                        }
                        var n = t.split("/")
                            , o = n.indexOf("encoded");
                        if (-1 !== o && n[o + 1])
                            return {
                                encodedId: n[o + 1]
                            };
                        var i = n.indexOf("detail");
                        if (-1 !== i && n[i + 1]) {
                            var a = n[i + 1];
                            return {
                                uuid: a
                            }
                        }
                        var r = /.*\/m(\d+)_?.*/
                            , c = e.match(r);
                        return c ? {
                            seq: c[1]
                        } : {}
                    };
        function xe(e) {
            return je.apply(this, arguments)
        }
        function je() {
            return je = Object(u["a"])(regeneratorRuntime.mark((function e(t) {
                var n, o, i, a;
                return regeneratorRuntime.wrap((function (e) {
                    while (1)
                        switch (e.prev = e.next) {
                            case 0:
                                return e.next = 2,
                                    W();
                            case 2:
                                if (n = e.sent,
                                    o = Oe(t),
                                    i = function () {
                                        return o.encodedId ? "/mobile_api/news/article/v1/encoded/".concat(o.encodedId) : o.uuid ? "/mobile_api/news/article/v1/uuid/".concat(o.uuid) : o.seq ? "/mobile_api/news/article/v1/encoded/".concat(Se(Number(o.seq))) : void 0
                                    }
                                    ,
                                    a = i(),
                                    !window._offlinePkg || "iphone" !== Object(k["getPlatform"])()) {
                                    e.next = 10;
                                    break
                                }
                                return e.abrupt("return", new Promise((function (e, t) {
                                    callNativeHandler("clientRequestHX", {
                                        method: "GET",
                                        url: "".concat(n).concat(a)
                                    }, (function (n) {
                                        console.log(n, "客户端代发了");
                                        var o = n.result;
                                        o && o.data ? e(o) : t()
                                    }
                                    ))
                                }
                                )));
                            case 10:
                                return e.abrupt("return", ue({
                                    url: "".concat(n).concat(a)
                                }, {
                                    dataFormat: function (e) {
                                        return e
                                    }
                                })["catch"]((function (e) {
                                    throw K("[底层页接口请求失败]:".concat(JSON.stringify(o)), "底层页接口请求失败".concat(e)),
                                    new Error(e)
                                }
                                )));
                            case 11:
                            case "end":
                                return e.stop()
                        }
                }
                ), e)
            }
            ))),
                je.apply(this, arguments)
        }
        f["c"].component("NotFound", (function () {
            return n.e("chunk-15f38bb6").then(n.bind(null, "759e"))
        }
        )),
            f["c"].component("ServerError", (function () {
                return n.e("chunk-f12ce20e").then(n.bind(null, "c87d"))
            }
            )),
            f["c"].component("Home", re),
            function (e) {
                e[e["normal"] = 0] = "normal",
                    e[e["notFound"] = -2] = "notFound",
                    e[e["redirect"] = -3] = "redirect"
            }(te || (te = {}));
        var Te = function (e) {
            Object(m["a"])(n, e);
            var t = Object(h["a"])(n);
            function n() {
                var e;
                return Object(a["a"])(this, n),
                    e = t.apply(this, arguments),
                    e.currentComponent = null,
                    e.componentsModules = null,
                    e.active = !0,
                    e
            }
            return Object(r["a"])(n, [{
                key: "initData",
                value: function () {
                    var e = Object(u["a"])(regeneratorRuntime.mark((function e() {
                        var t, n, o, i, a, r, c, s;
                        return regeneratorRuntime.wrap((function (e) {
                            while (1)
                                switch (e.prev = e.next) {
                                    case 0:
                                        if (e.prev = 0,
                                            t = V() ? "2385235c20" : "ce19ea099b",
                                            window.weblog && window.weblog.setConfig({
                                                appKey: t
                                            }),
                                            n = window._offlinePkg ? window.sourceUrl : location.href,
                                            n) {
                                            e.next = 7;
                                            break
                                        }
                                        return this.currentComponent = "not-found",
                                            e.abrupt("return");
                                    case 7:
                                        return window.perfData.beginRequest = Date.now() - window.perfData.beginRender,
                                            o = Date.now(),
                                            window.customPerformanceindex.pageInfoRequestStartTime = o,
                                            e.next = 12,
                                            xe(n);
                                    case 12:
                                        i = e.sent,
                                            a = i.status_code,
                                            r = i.status_msg,
                                            c = i.data,
                                            window.customPerformanceindex.pageInfoRequestTime = Date.now() - o,
                                            window.perfData.endRequest = Date.now() - window.perfData.beginRender,
                                            e.t0 = a,
                                            e.next = e.t0 === te.normal ? 21 : e.t0 === te.notFound ? 31 : e.t0 === te.redirect ? 33 : 36;
                                        break;
                                    case 21:
                                        return z(c),
                                            e.next = 24,
                                            this.checkRobot(c.newsInfo.content);
                                    case 24:
                                        return this.setSadness(),
                                            window.perfData.beginUse = Date.now() - window.perfData.beginRender,
                                            f["c"].use(newsComponents, {
                                                pageId: hxm.pageid,
                                                block: "news",
                                                id: hxm.seq
                                            }),
                                            window.perfData.endUse = Date.now() - window.perfData.beginRender,
                                            this.currentComponent = "Home",
                                            this.componentsModules = window.componentsModules,
                                            e.abrupt("break", 38);
                                    case 31:
                                        return this.currentComponent = "not-found",
                                            e.abrupt("break", 38);
                                    case 33:
                                        return s = c.redirectUrl,
                                            location.replace(s),
                                            e.abrupt("break", 38);
                                    case 36:
                                        return console.log(a, r),
                                            e.abrupt("break", 38);
                                    case 38:
                                        e.next = 45;
                                        break;
                                    case 40:
                                        e.prev = 40,
                                            e.t1 = e["catch"](0),
                                            console.log("initData error", e.t1.toString()),
                                            K("[底层页进入兜底]", "底层页进入兜底".concat(e.t1.toString())),
                                            e.t1.toString().indexOf("404") > -1 ? this.currentComponent = "not-found" : this.currentComponent = "server-error";
                                    case 45:
                                    case "end":
                                        return e.stop()
                                }
                        }
                        ), e, this, [[0, 40]])
                    }
                    )));
                    function t() {
                        return e.apply(this, arguments)
                    }
                    return t
                }()
            }, {
                key: "checkRobot",
                value: function () {
                    var e = Object(u["a"])(regeneratorRuntime.mark((function e(t) {
                        return regeneratorRuntime.wrap((function (e) {
                            while (1)
                                switch (e.prev = e.next) {
                                    case 0:
                                        if (-1 === t.indexOf("<robot-parse") || window.JGY) {
                                            e.next = 4;
                                            break
                                        }
                                        return U(A),
                                            e.next = 4,
                                            $(L);
                                    case 4:
                                    case "end":
                                        return e.stop()
                                }
                        }
                        ), e)
                    }
                    )));
                    function t(t) {
                        return e.apply(this, arguments)
                    }
                    return t
                }()
            }, {
                key: "contrastTheme",
                value: function () {
                    var e = window.navigator.userAgent
                        , t = /hxtheme\/(\S*)/
                        , n = e.match(t)
                        , o = document.querySelector("html");
                    if (o.setAttribute("theme-mode", n && "1" === n[1] ? "black" : "white"),
                        !(n && Number(n[1]) === window.$themeMode || n && 0 === Number(n[1]) && 2 === window.$themeMode)) {
                        var i = document.querySelector("body")
                            , a = o.classList;
                        n && "1" === n[1] ? (!a.contains("night") && a.add("night"),
                            window.$themeMode = 1) : (a.contains("night") && a.remove("night"),
                                i.classList.contains("night") && i.classList.remove("night"),
                                window.$themeMode = 2)
                    }
                }
            }, {
                key: "setSadness",
                value: function () {
                    var e = "002053015"
                        , t = window.hxm.classList.includes(e);
                    if (document.documentElement.classList.remove("page_sadness"),
                        2 === window.$themeMode && t) {
                        document.documentElement.classList.add("page_sadness");
                        var n = window["thsc-sns-baselib"].utils.getAppInfo().plat.includes("IOS");
                        n || window.callNativeHandler("insuranceWebHandle", {
                            titleBarBackgroundColor: "#595959",
                            statusBarBackgroundColor: "#595959"
                        }, (function () { }
                        ))
                    }
                }
            }, {
                key: "stopBodyScroll",
                value: function () {
                    var e = document.body
                        , t = document.documentElement;
                    e.classList.remove("lock-scroll"),
                        t.classList.remove("lock-scroll")
                }
            }, {
                key: "created",
                value: function () {
                    this.contrastTheme(),
                        this.initData(),
                        this.stopBodyScroll()
                }
            }]),
                n
        }(f["c"]);
        Te = Object(p["a"])([f["a"]], Te);
        var Ne = Te
            , Me = Ne
            , De = Object(ie["a"])(Me, l, d, !1, null, null, null)
            , Ee = De.exports
            , Le = 0
            , Ae = (s.a.options.components,
                function () {
                    function e() {
                        Object(a["a"])(this, e),
                            this.init()
                    }
                    return Object(r["a"])(e, [{
                        key: "doRender",
                        value: function () {
                            window.perfData = {},
                                window.perfData.beginRender = Date.now(),
                                window.vm1 = new s.a({
                                    el: "#app",
                                    render: function (e) {
                                        return e(Ee)
                                    }
                                })
                        }
                    }, {
                        key: "doClear",
                        value: function () {
                            Le > 8 ? (Le = 0,
                                location.reload()) : (window.vm1 && (window.vm1.$destroy(),
                                    window.vm1.$children[0].active = !1,
                                    window.vm1 = null),
                                    window.intervalQueue.clearQueue(),
                                    s.a._installedPlugins = [],
                                    Array.from(document.body.childNodes).forEach((function (e) {
                                        "SCRIPT" !== e.nodeName && "changebox" !== e.id && "app" !== e.id && e.remove()
                                    }
                                    )))
                        }
                    }, {
                        key: "renderAndClear",
                        value: function (e) {
                            if (1 === e.isRender) {
                                Le++;
                                var t = e.url;
                                window.sourceUrl = t,
                                    this.doRender()
                            } else
                                this.doClear()
                        }
                    }, {
                        key: "init",
                        value: function () {
                            var e = this;
                            window._offlinePkg ? "iphone" === Object(k["getPlatform"])() ? window.registerWebHandler("webOfflineTemplateRender", (function (t) {
                                e.renderAndClear(t)
                            }
                            )) : window.registerWebListener("webOfflineTemplateRender", (function (t) {
                                console.log("android webOfflineTemplateRender", t),
                                    e.renderAndClear(t)
                            }
                            )) : this.doRender()
                        }
                    }]),
                        e
                }());
        Object(o["initFontSize"])(),
            new Ae
    },
    cd22: function (e, t, n) { },
    d82a: function (e, t) {
        e.exports = window["thsc-backwash"]
    }
});
