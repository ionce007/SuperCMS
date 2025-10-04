const { knex } = Chan;
const axios = require("axios");
const iconv = require("iconv-lite");
const dayjs = require("dayjs");
const BaseService = require("./base");
const { randomStr, stringToHex } = require("../../../extend/utils.js");
const { sign } = require("../../../extend/sign.js");
const { randomUUID } = require('crypto');
const utils = require('../../../extend/utils');
const cheerio = require('cheerio');

const dfcfAppId = "appId01";
//const dfcfGlobalId = "786e4c21-70dc-435a-93bb-label";
const dfcfGlobalId = randomUUID();
const PERIOD = {
    detail: { fields: "f1,f12,f13,f14,f3,f62,f2,f3,f605", fid: "f62" },
    add: { fields: "f1,f12,f13,f14,f3,f225,f184,f2,f3", fid: "f225" },
    add3: { fields: "f1,f12,f13,f14,f3,f127,f268,f2", fid: "f127" },
    add10: { fields: "f1,f12,f13,f14,f3,f160,f175,f2", fid: "f160" },
    dde: { fields: "f1,f12,f13,f14,f3,f88,f89,f90,f91,f92,f94,f95,f97,f98,f99,f2,f3", fid: "f88" }
}
const FS = [
    { label: "行业板块", type: "normal", value: "m:90+e:2", name: "industry" }, 
    { label: "概念板块", type: "normal", value: "m:90+e:3", name: "concept"},
    { label: "风格板块", type: "normal", value: "m:90+e:4", name: "style" }, 
    { label: "地区板块", type: "normal", value: "m:90+e:1", name: "area" }, 
    { label: "香港板块", type: "hk", value: "m:201", name: "hk" }
]
const UT = "f057cbcbce2a86e2866ab8877db1d059";
const REPORTNAME = [
    { reportCode: '001', reportType: '涨跌停对比',cnName: '连续二日涨跌停对比', name: 'RPT_INTSELECTION_LIMITHIS', filter: `(TRADE_DATE<='【QUERYDATE】')`, sortColumns: 'TRADE_DATE', sortTypes: -1, columns: `TRADE_DATE,LIMIT_NUMBERS,NATURAL_LIMIT,DAILY_LIMIT,TOUCH_LIMIT,SEALING_RATE,NATURAL_LIMIT_YES,LIMIT_PER_YES,POSITION_SUGGESTION,MONEYMAKING_EFFECT,SEALING_RATE_YES,LIMIT_DOWN_NUM,CJDT_NUM,DT_FBL` },
    { reportCode: '002', reportType: '涨停龙头', cnName: '涨停龙头', name: 'RPT_INTSELECTION_LIMITSTOCKHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_HOT_STOCK=1)`, sortColumns: 'NDAYS_NLIMITE_RANK,ZTJY,BOARD_YILD', sortTypes: '-1,-1,-1', columns: 'SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,BOARD_NAME,NEWEST_PRICE,YIELD,NDAYS_NLIMITE,CLOSE_LIMITUP_TIME,LIMITUP_NUM,LIMITUP_AMOUNT,TURNOVERRATE,NET_INFLOW,TRADE_DATE,ZTJY', distinct: 'SECUCODE' },
    { reportCode: '003', reportType: '涨跌停监测', cnName: '竞价涨停', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_MISMATCH_LIMIT=1)`, sortColumns: `MISMATCH_LIMIT_AMOUNT`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,MISMATCH_LIMIT_AMOUNT,MATCH_CHANGE_RATE,MATCH_DEAL_AMOUNT,MATCH_DEAL_VOLUME,MISMATCH_VOLUME,MISMATCH_AMOUNT,MISMATCH_TURNOVERRATE,BOARD_NAME,IS_MARGININFO` },
    { reportCode: '004', reportType: '涨跌停监测', cnName: '涨停池', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')((IS_NATURAL_LIMIT=1)(|(IS_DAILY_LIMIT=1)))`, sortColumns: `LIMITUP_AMOUNT`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,BOARD_NAME,ZTJY,TURNOVERRATE,NET_INFLOW,CLOSE_LIMITUP_TIME,LIMITUP_NUM,LIMITUP_AMOUNT,NDAYS_NLIMITE,IS_NATURAL_LIMIT,IS_DAILY_LIMIT,IS_MARGININFO` },
    { reportCode: '005', reportType: '涨跌停监测', cnName: '即将涨停', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_SOON_LIMIT=1)`, sortColumns: `YIELD`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,SPEED_UP,NDAYS_NLIMITE,BOARD_NAME,TURNOVERRATE,NET_INFLOW,DEAL_AMOUNT,FREE_MARKET_VALUE,IS_MARGININFO,SPRINT_LIMIT_DATE` },
    { reportCode: '006', reportType: '涨跌停监测', cnName: '连板池', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(HLIMITEDAYS>=2)`, sortColumns: `HLIMITEDAYS`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,HLIMITEDAYS,BOARD_NAME,ZTJY,TURNOVERRATE,NET_INFLOW,CLOSE_LIMITUP_TIME,LIMITUP_NUM,LIMITUP_AMOUNT,IS_MARGININFO` },
    { reportCode: '007', reportType: '涨跌停监测', cnName: '炸板池', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_TOUCH_LIMIT=1)`, sortColumns: `YIELD`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,BOARD_NAME,ZTJY,TURNOVERRATE,NET_INFLOW,CLOSE_LIMITUP_TIME,LIMITUP_NUM,LIMITUP_AMOUNT,OPEN_LIMITUP_TIME,OPEN_LIMITUP_NUM,HLIMITEDAYS,IS_MARGININFO` },
    { reportCode: '008', reportType: '涨跌停监测', cnName: '昨日涨停', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_PRE_LIMIT=1)`, sortColumns: `YIELD`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,PRE_CLOSE_LIMITUP_TIME,SPEED_UP,PRE_LIMIT_VOLUME,TURNOVERRATE,NET_INFLOW,DEAL_AMOUNT,FREE_MARKET_VALUE` },
    { reportCode: '009', reportType: '涨跌停监测', cnName: '跌停池', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_DECLINELIMITED=1)`, sortColumns: `ZTJY`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,BOARD_NAME,LIMITUP_NUM,LIMITUP_AMOUNT,TURNOVERRATE,NET_INFLOW,ZTJY,IS_MARGININFO` },
    { reportCode: '010', reportType: '涨跌停监测', cnName: '曾跌停', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_TOUCH_LIMITDOWN=1)`, sortColumns: `LIMITDOWN_OPEN_TIME`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,LIMITDOWN_OPEN_TIMES,LIMITDOWN_OPEN_TIME,BOARD_NAME,TURNOVERRATE,NET_INFLOW,DEAL_AMOUNT,FREE_MARKET_VALUE,IS_MARGININFO` },
    { reportCode: '011', reportType: '涨停伏击', cnName: '优质基因', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_QUALITY_GENE=1)`, sortColumns: `ZTJY`, sortTypes: -1, columns: `ALL` },
    { reportCode: '012', reportType: '涨停伏击', cnName: '涨停冲刺', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_LIMIT_SPRINT=1)`, sortColumns: `ZTJY`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,BOARD_NAME,NEWEST_PRICE,YIELD,ZTJY,TURNOVERRATE,DEAL_AMOUNT,FREE_MARKET_VALUE,SEALING_RATE_YEAR,UNUSUAL_SITUATION,IS_MARGININFO,SPEED_UP` },
    //{ reportCode: '013', reportType: '涨停伏击', cnName: '涨停常客', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_LIMIT_REGULARS=1)`, sortColumns: `ZTJY`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,BOARD_NAME,NEWEST_PRICE,YIELD,ZTJY,HIGHDAYSN_5DAYS,PCTCHANGE_3DAYS,FREE_MARKET_VALUE,SEALING_RATE_YEAR,IS_MARGININFO` },
    { reportCode: '013', reportType: '涨停伏击', cnName: '涨停常客', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(IS_LIMIT_REGULARS=1)`, sortColumns: `ZTJY`, sortTypes: -1, columns: `ALL` },
    { reportCode: '014', reportType: '市场风向', cnName: '涨停情绪', name: 'RPT_INTSELECTION_EMOTION', filter: `(TRADE_DATE<='【QUERYDATE】')`, sortColumns: `TRADE_DATE`, sortTypes: -1, columns: `TRADE_DATE,MAX_CONTINUS_UPLIMITS,UPLIMIT_NUM,DOWNLIMIT_NUM,COUNTINUS_STOCK_NUM` },
    { reportCode: '015', reportType: '市场风向', cnName: '当日涨跌停走势', name: 'RPT_LIMIT_EMOTION_FSHIS', filter: `(TRADE_DATE='【QUERYDATE】')`, sortColumns: `TRADE_TIME`, sortTypes: 1, columns: `TRADE_DATE,TRADE_TIME,LIMIT_UP_NUM,LIMIT_DOWN_NUM,TOUCH_LIMITUP_NUM,TOUCH_LIMITDOWN_NUM` },
    { reportCode: '016', reportType: '强势板块', cnName: '涨跌分布', name: 'RPT_INTSELECTION_ZDFBHIS', filter: `(TRADE_DATE='【QUERYDATE】')`, sortColumns: ``, sortTypes: -1, columns: `TRADE_DATE,BOARD_UPNUM,BOARD_DOWNNUM,BOARD_FLATNUM` },
    { reportCode: '017', reportType: '强势板块', cnName: '强势板块', name: 'RPT_INTSELECTION_STRONGBOARDHIS', filter: `(TRADE_DATE='【QUERYDATE】'})(HLIMITE_NUM>0)`, sortColumns: `HLIMITE_NUM,BOARD_YILD`, sortTypes: `-1,-1`, columns: `DRIVE_BOARD_CODE,BOARD_NAME,HLIMITE_NUM,LIST_DAYS,TRADE_DATE,BOARD_YILD,CONLIMITE_NUM,STOCK_HIGH` },
    { reportCode: '018', reportType: '强势板块', cnName: '强势板块涨停股', name: 'RPT_INTSELECTION_LIMITSTOCKHIS', filter: `(TRADE_DATE='【QUERYDATE】')(DRIVE_BOARD_CODE="【BLOCKCODE】")`, sortColumns: `CLOSE_LIMITUP_TIME`, sortTypes: -1, columns: `DRIVE_BOARD_CODE,BOARD_NAME,SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,ZTJY,NEWEST_PRICE,YIELD,IS_HOT_STOCK,NDAYS_NLIMITE,CLOSE_LIMITUP_TIME` },
    { reportCode: '019', reportType: '连板天梯', cnName: '连板天梯（沪深主板、创业板/科创板、ST）', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(@N_CLASS<>"NULL")`, sortColumns: ``, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,N_CLASS` },
    { reportCode: '020', reportType: '连板天梯', cnName: '晋级统计', name: 'RPT_INTSELECTION_PRETODAY', filter: `(TRADE_DATE='【QUERYDATE】')`, sortColumns: ``, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,CHANGE_RATE,PRE_CONTINUS_UPLIMITS,PRE_UPLIMITS_NUM,IS_DOWNLIMIT,DOWNLIMIT_RATIO,CONTINUS_UPLIMITS,UPLIMITS_NUM` },
    { reportCode: '021', reportType: '连板天梯', cnName: '晋级统计（当日1板）', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(N_CLASS_HQ=1)`, sortColumns: ``, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,` },
    { reportCode: '022', reportType: '多板个股', cnName: '多板个股', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【QUERYDATE】')(@NDAYS_NLIMITE<>"NULL")`, sortColumns: `NLIMITUP_RANK_N2,NLIMITUP_RANK_N1`, sortTypes: `-1,-1`, columns: `SECUCODE,SECURITY_NAME_ABBR,SECURITY_CODE,BOARD_NAME,NDAYS_NLIMITE,NEWEST_PRICE,YIELD,TURNOVERRATE,NET_INFLOW,ZTJY` },
    { reportCode: '023', reportType: '涨停揭秘', cnName: '板块列表', name: 'RPT_LIMITLIST_SECUCODENUM', filter: `(TRADE_DATE='【QUERYDATE】')`, sortColumns: `SECUCODE_NUM`, sortTypes: -1, columns: `BOARD_CODE,BOARD_NAME,TRADE_DATE,SECUCODE_NUM` },
    { reportCode: '024', reportType: '涨停揭秘', cnName: '个股列表', name: 'RPT_PCHOT_LIMITLIST_HSDETIAL', filter: `(TRADE_DATE='【QUERYDATE】')`, sortColumns: `CZT_LIMITUP_TIME`, sortTypes: -1, quoteColumns: `lastCloseTime~19~SECURITY_CODE~SSLIMITUP_TIME`, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,LAST_LIMITUP_TIME,BOARD_CODE,BOARD_NAME,LIMIT_REASON,LIMIT_CONTENT,NLIMITUP,CLOSE,CHANGE_RATE,IS_ST,CZT_LIMITUP_TIME` },
    { reportCode: '025', reportType: '涨停精选', cnName: '涨停池-涨停原因', name: 'RPT_PCHOT_LIMITLIST_HSDETIAL', filter: `(TRADE_DATE='【QUERYDATE】')`, sortColumns: `RANK_TIME`, sortTypes: -1, quoteColumns: `lastCloseTime~19~SECURITY_CODE~SSLIMITUP_TIME`, columns: `SECURITY_CODE,LIMIT_CONTENT,LIMIT_REASON` },
    { reportCode: '101', reportType: '市场风向', cnName: '昨日涨停今日表现', url: `https://dycalctra.eastmoney.com/history/appdate?code=000001&market=1&date=【TRADEDATE】&invt=3`, exturl: `https://dycalctra.eastmoney.com/history/appdate?code=BK0815&market=90&date=【TRADEDATE】&invt=3` },
]
const REPORTNAME_REALTIME = [
    { reportCode: '001', reportType: '涨停精选', cnName: '赚钱效应', name: 'RPT_CUSTOM_INTSELECTION_LIMIT', filter: ``, sortColumns: '', sortTypes: -1, columns: `LIMIT_NUMBERS,NATURAL_LIMIT,DAILY_LIMIT,TOUCH_LIMIT,SEALING_RATE,NATURAL_LIMIT_YES,LIMIT_PER_YES,,LIMIT_DOWN_NUM,CJDT_NUM,DT_FBL` },
    { reportCode: '002', reportType: '涨停精选', cnName: '涨停龙头', name: 'RPTA_CUSTOM_APP_CONCEPTLIST', filter: ``, sortColumns: '', sortTypes: -1, columns: `` },
    //{ reportCode: '003', reportType: '涨停精选', cnName: '竞价涨停', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='【NEW_TRADE_DATE】')(IS_MISMATCH_LIMIT=1)`, sortColumns: `MISMATCH_LIMIT_AMOUNT`, sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,NEWEST_PRICE,YIELD,MISMATCH_LIMIT_AMOUNT,MATCH_CHANGE_RATE,MATCH_DEAL_AMOUNT,MATCH_DEAL_VOLUME,MISMATCH_VOLUME,MISMATCH_AMOUNT,MISMATCH_TURNOVERRATE,BOARD_NAME,IS_MARGININFO` },
    { reportCode: '101', reportType: '涨停精选', cnName: '竞价涨停', url: `https://quotederivates.eastmoney.com/datacenter/zdtpool?datetype=3&stocktype=2,6,80,23,36&zdt=1&version=100&cver=100`, exturl: `https://push2dycalc.eastmoney.com/api/qt/ulist.np/get?secids=【SECCODES】&fields=f2,f3,f12,f13,f14,f100,f148,f614,f615,f616,f617,f618,f619,f620&fltt=2&invt=3&ut=【UT】` },
    { reportCode: '004', reportType: '涨停精选', cnName: '昨日涨停情况', name: 'RPT_INTSELECTION_LIMITHIS', filter: `(TRADE_DATE<='【QUERYDATE】')`, sortColumns: 'TRADE_DATE', sortTypes: -1, columns: `TRADE_DATE,LIMIT_NUMBERS,NATURAL_LIMIT,DAILY_LIMIT,TOUCH_LIMIT,SEALING_RATE,NATURAL_LIMIT_YES,LIMIT_PER_YES,POSITION_SUGGESTION,MONEYMAKING_EFFECT,SEALING_RATE_YES,LIMIT_DOWN_NUM,CJDT_NUM,DT_FBL` },
    { reportCode: '005', reportType: '涨停精选', cnName: '自然涨停/涨停池', name: 'RPT_CUSTOM_INTSELECTION_MONITOR', filter: `(IS_NATURAL_LIMIT="1")(IS_DAILY_LIMIT="1")`, sortColumns: 'LIMITUP_AMOUNT', sortTypes: -1, columns: `ALL` },
    { reportCode: '006', reportType: '涨停精选', cnName: '连板池', name: 'RPT_CUSTOM_INTSELECTION_MONITOR', filter: `(HLIMITEDAYS="1")`, sortColumns: 'HLIMITEDAYS', sortTypes: -1, columns: `ALL` },
    { reportCode: '106', reportType: '涨停精选', cnName: '即将涨停', url: 'https://quotederivates.eastmoney.com/datacenter/zdtpool?datetype=2&stocktype=2,6,80,23,36&zdt=1&version=100&cver=100', exturl: 'https://push2dycalc.eastmoney.com/api/qt/ulist.np/get?secids=【SECCODES】&fields=f2,f3,f6,f8,f12,f13,f14,f21,f22,f62,f100,f148,f500&fltt=2&invt=3&ut=【UT】' },
    { reportCode: '007', reportType: '涨停精选', cnName: '炸板池', name: 'RPT_CUSTOM_INTSELECTION_MONITOR', filter: `(IS_TOUCH_LIMIT="1")`, sortColumns: 'YIELD', sortTypes: -1, columns: `ALL` },
    { reportCode: '008', reportType: '涨停精选', cnName: '昨日涨停', name: 'RPT_INTSELECTION_MONITORHIS', filter: `(TRADE_DATE='2025-09-24')((IS_NATURAL_LIMIT=1)(|(IS_DAILY_LIMIT=1)))`, sortColumns: 'YIELD', sortTypes: -1, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,CLOSE_LIMITUP_TIME,LIMIT_VOLUME,MARKET_CODE`, exturl: `https://push2dycalc.eastmoney.com/api/qt/ulist.np/get?secids=【SECCODES】&fields=f2,f3,f6,f8,f12,f13,f14,f21,f22,f62,f148&fltt=2&invt=3&ut=【UT】` },
    { reportCode: '009', reportType: '涨停精选', cnName: '跌停池', name: 'RPT_CUSTOM_INTSELECTION_MONITOR', filter: `(IS_DECLINELIMITED="1")`, sortColumns: 'ZTJY', sortTypes: -1, columns: `ALL` },
    { reportCode: '102', reportType: '涨停精选', cnName: '曾跌停', url: `https://quotederivates.eastmoney.com/datacenter/zdtpool?datetype=4&stocktype=2,6,80,23,36&zdt=-1&version=100&cver=100`, exturl: 'https://push2dycalc.eastmoney.com/api/qt/ulist.np/get?secids=【SECCODES】&fields=f2,f3,f6,f8,f12,f13,f14,f21,f62,f100,f148,f634&fltt=2&invt=3&ut=【UT】' }, 
    { reportCode: '011', reportType: '涨停精选', cnName: '优质基因', name: 'RPT_CUSTOM_INTSELECTION_MONITOR', filter: `(IS_QUALITY_GENE="1")`, sortColumns: 'ZTJY', sortTypes: -1, columns: `ALL` },
    { reportCode: '012', reportType: '涨停精选', cnName: '冲刺涨停', name: 'RPT_CUSTOM_INTSELECTION_MONITOR', filter: `(IS_LIMIT_SPRINT="1")`, sortColumns: 'ZTJY', sortTypes: -1, columns: `ALL` },
    { reportCode: '013', reportType: '涨停精选', cnName: '涨停常客', name: 'RPT_CUSTOM_INTSELECTION_MONITOR', filter: `(IS_LIMIT_REGULARS="1")`, sortColumns: 'ZTJY', sortTypes: -1, columns: `ALL` },
    { reportCode: '014', reportType: '市场风向', cnName: '涨停情绪', name: 'RPT_INTSELECTION_EMOTION', filter: ``, sortColumns: `TRADE_DATE`, sortTypes: -1, columns: `TRADE_DATE,MAX_CONTINUS_UPLIMITS,UPLIMIT_NUM,DOWNLIMIT_NUM,COUNTINUS_STOCK_NUM` },
    { reportCode: '103', reportType: '市场风向', cnName: '当日涨跌停趋势', url: `https://push2.eastmoney.com/api/qt/stock/updown/trend/get?time=930&secids=0.399002,1.000002,0.899050&fields=f1,f2,f3,f4,f5&invt=3`},
    { reportCode: '104', reportType: '市场风向', cnName: '昨日涨停今日表现', url: `https://push2.eastmoney.com/api/qt/stock/trends2/get?secid=1.000001&fields1=f1,f6,f8&fields2=f51,f53&iscr=0&iscca=0&ndays=1&invt=3&ut=【UT】`, exturl: `https://push2.eastmoney.com/api/qt/stock/trends2/get?secid=90.BK0815&fields1=f1,f6,f8&fields2=f51,f53&iscr=0&iscca=0&ndays=1&invt=3&ut=【UT】` },
    { reportCode: '016', reportType: '强势板块', cnName: '板块涨跌分布及前三名的强势板块', name: 'RPT_CUSTOM_INTSELECTION_STRONGBOARD', filter: ``, sortColumns: ``, sortTypes: -1, columns: `ALL` },
    { reportCode: '017', reportType: '强势板块', cnName: '强势板块列表', name: 'RPT_CUSTOM_INTSELECTION_RELATEDBOARD', filter: ``, sortColumns: ``, sortTypes: -1, columns: `ALL` },
    { reportCode: '018', reportType: '涨停天梯', cnName: '涨停天梯', name: 'RPT_CUSTOM_INTSELECTION_MONITOR_LADDER', filter: `(IS_ST="0")`, sortColumns: ``, sortTypes: -1, columns: `ALL` },
    { reportCode: '105', reportType: '涨停天梯', cnName: '晋级统计', url: `https://push2dycalc.eastmoney.com/api/qt/updown/continuouslimitup/get?fields=f1,f2,f3,f4,f5&fid=f4&invt=3&ut=【UT】` },
    { reportCode: '019', reportType: '多板个股', cnName: '多板个股', name: 'RPT_CUSTOM_INTSELECTION_MONITOR_MULTIPLE_BOARD', filter: ``, sortColumns: `NDAYS_NLIMITE`, sortTypes: -1, columns: `ALL` },
    { reportCode: '020', reportType: '涨停揭秘', cnName: '板块列表', name: 'RPT_LIMITLIST_SECUCODENUM', filter: `(TRADE_DATE='【NEW_TRADE_DATE】')`, sortColumns: `SECUCODE_NUM`, sortTypes: -1, columns: `BOARD_CODE,BOARD_NAME,TRADE_DATE,SECUCODE_NUM` },
    { reportCode: '021', reportType: '涨停揭秘', cnName: '个股列表', name: 'RPT_PCHOT_LIMITLIST_HSDETIAL', filter: `(TRADE_DATE='【NEW_TRADE_DATE】')`, sortColumns: `CZT_LIMITUP_TIME`, sortTypes: -1, quoteColumns:`lastCloseTime~19~SECURITY_CODE~SSLIMITUP_TIME`, columns: `SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_DATE,LAST_LIMITUP_TIME,BOARD_CODE,BOARD_NAME,LIMIT_REASON,LIMIT_CONTENT,NLIMITUP,CLOSE,CHANGE_RATE,IS_ST,CZT_LIMITUP_TIME` },
    { reportCode: '201', reportType: '涨跌停统计', cnName: '各分市场涨跌停统计', url: `https://push2dycalc.eastmoney.com/api/qt/ulist.np/get?secids=1.000002,0.399002,0.899050&fields=f12,f13,f14,f627,f628,f437,f438&fltt=2&invt=3&ut=【UT】` },
    { reportCode: '022', reportType: '涨停精选', cnName: '涨停池-涨停原因', name: 'RPT_PCHOT_LIMITLIST_HSDETIAL', filter: `(TRADE_DATE='【NEW_TRADE_DATE】')`, sortColumns: `RANK_TIME`, sortTypes: -1, quoteColumns: `lastCloseTime~19~SECURITY_CODE~SSLIMITUP_TIME`, columns: `SECURITY_CODE,LIMIT_CONTENT,LIMIT_REASON` },
]
const REPORT_SUITE = [
    { name: 'effect', history: '001', realtime: '001', cnName: '赚钱效应' },
    { name: 'limitleader', history: '002', realtime: '002', cnName: '涨停龙头' },
    { name: 'auction', history: '003', realtime: '101', cnName: '竞价涨停' },
    { name: 'limitnatural', history: '004', realtime: '005', cnName: '涨停池' },
    { name: 'limitsoon', history: '005', realtime: '106', cnName: '即将涨停' },
    { name: 'limitdays', history: '006', realtime: '006', cnName: '连板池' },
    { name: 'touchlimit', history: '007', realtime: '007', cnName: '炸板池' },
    { name: 'prelimit', history: '008', realtime: '008', cnName: '昨日涨停' },
    { name: 'declinelimited', history: '009', realtime: '009', cnName: '跌停池' },
    { name: 'touchlimitdown', history: '010', realtime: '102', cnName: '曾跌停' },
    { name: 'quality', history: '011', realtime: '011', cnName: '优质基因' },
    { name: 'limitsprint', history: '012', realtime: '012', cnName: '冲刺涨停' },
    { name: 'limitregulars', history: '013', realtime: '013', cnName: '涨停常客' },
    { name: 'marketemotion', history: '014', realtime: '014', cnName: '涨停情绪' },
    { name: 'limittrend', history: '015', realtime: '103', cnName: '当日涨跌停走势' },
    { name: 'prelimitaction', history: '101', realtime: '104', cnName: '昨日涨停今日表现' },
]
const MARKET = [
    { name: 'all', code: '' },
    { name: 'hszb', code: '001' },
    { name: 'cyb', code: '002' },
    { name: 'kcb', code: '003' },
    { name: 'bz', code: '004' }
]
class StockService extends BaseService {

    //所有新增加概念（同共顺）
    async concept(pageIndex, pageSize) {
        try {
            const url = `https://dq.10jqka.com.cn/fuyao/concept_express/new_concept/v1/list?page_num=${pageIndex}&page_size=${pageSize}`;
            let { data } = await axios.get(url);
            return data;
        } catch (err) {
            throw err;
        }
    }
    async conceptTrends(concept, date, pageIndex, pageSize, tab_type) {
        try {
            const url = `https://dq.10jqka.com.cn/fuyao/concept_express/concept_trends/v1/list`;
            const dates = await this.conceptCalendar();
            if (!dates || dates.status_code !== 0 || !dates.data || !dates.data.date_list || !dates.data.date_list.length === 0) return { code: -1, msg: "查询日期不存在在！", data: null };

            if (!date) {
                const sortedDates = dates.data.date_list.sort((a, b) => new Date(b) - new Date(a));
                date = sortedDates[0];
            }
            //const dateStr = utils.formatDate(new Date(date), 'yyyy-MM-dd');
            if (dates.data.date_list.indexOf(date) < 0) return { code: -1, msg: "查询日期不存在在！", data: null };
            
            const postData = {
                "concept": concept,
                "date": new Date(date).getTime(),
                "page_num": pageIndex,
                "page_size": pageSize,
                "tab_type": tab_type
            }
            const { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain,",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Origin": "https://eq.10jqka.com.cn",
                    "Host": 'dq.10jqka.com.cn',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://eq.10jqka.com.cn/",
                    //"cookie": "u_ukey=A10702B8689642C6BE607730E11E6E4A; u_uver=1.0.0; u_dpass=t5FPyvlC1a%2B2Y4YJnfA8NZrmrOumoCVJSfAOdfmXpHPqlfgegMsaMOYDelzFQlJvHi80LrSsTFH9a%2B6rtRvqGg%3D%3D; u_did=D65F3179FF74473FA023AF8ECC141E5A; u_ttype=WEB; _clck=1la4ca1%7C2%7Cfww%7C0%7C0; v=A7kOlEtl9f5ufalqOv2jXgbMyC6Txq14l7rRMNvuNeBfYtZUIxa9SCcK4dto"
                },
            });
            
            return data;
        } catch (err) {
            throw err;
        }
    }
    //概念板块行情
    async conceptQuote(id, code) {
        try {
            const url = `https://d.10jqka.com.cn/v2/realhead/${id}_${code}/last.js?t=${Date.now()}`;
            const { data } = await axios.get(url);
            const replaceStr = `quotebridge_v2_realhead_${id}_${code}_last`;
            let ret = data.replace(replaceStr, '');
            ret = ret.substring(1, ret.length - 1);
            const json = JSON.parse(ret).items;
            const jsonData = { hight: (!json.hasOwnProperty("8") ? "" : json["8"]), lowest: (!json.hasOwnProperty("9") ? "" : json["9"]), 
                lastest: (!json.hasOwnProperty("10") ? "" : json["10"]), last: json["6"],//(!json.hasOwnProperty("6") ? "" : json["6"]),  
                open: (!json.hasOwnProperty("7") ? "" : json["7"]), vol: (!json.hasOwnProperty("13")? "" : json["13"]), 
                amount: (!json.hasOwnProperty("19") ? "" : json["19"]), increase: (!json.hasOwnProperty("199112") ? "" : json["199112"]), 
                up_down: (!json.hasOwnProperty("264648") ? "" : json["264648"]), turnover: (!json.hasOwnProperty("1968584") ? "" : json["1968584"]) };
            const retData = { code: 0, msg: '获取成功', data: jsonData }
            return retData;
        } catch (err) {
            //throw err;
            return { code: -1, msg: err.message, data: null };
        }
    }
    async conceptCalendar() {
        try {
            const url = `https://dq.10jqka.com.cn/fuyao/concept_express/concept_trends/v1/calendar/all`;
            const { data } = await axios.get(url);
            return data;
        } catch (err) {
            //throw err;
            return { code: -1, msg: err.message, data: null };
        }
    }
    async conceptIndex(url){
        try{
            if (!url) return { code: -1, msg: '参数错误！', data: null };
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const content = $('#body').html();
            return { code: 0, msg: 'OK', data: content };
        } catch (err) {
            //throw err;
            return { code: -1, msg: err.message, data: null };
        }
    }
    //热股（同花顺）
    async thsHotStock(timeType) {
        try {
            if (!timeType) timeType = "hour";
            const url = `https://dq.10jqka.com.cn/fuyao/hot_list_data/out/hot_list/v1/stock?stock_type=a&type=${timeType}&list_type=normal`;
            const { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    Host: 'dq.10jqka.com.cn',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json",
                    "Referer": "https://eq.10jqka.com.cn/",
                },
            });
            return data;
        } catch (err) {
            throw err;
        }
    }

    //大涨股票、涨停股票（财联社）
    async uplimit(poolType) {
        try {
            const url = `https://x-quote.cls.cn/quote/index/up_down_analysis?rever=1&type=${poolType}&way=last_px`;
            const { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'x-quote.cls.cn',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": "https://www.cls.cn/",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }

    //大涨股票、涨停股票（财联社）
    async uplimitv2(isUplimit, date) {
        try {
            const url = `https://x-quote.cls.cn/v2/quote/a/plate/up_down_analysis?up_limit=${isUplimit}&date=${date}`;
            const { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'x-quote.cls.cn',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Referer": "https://www.cls.cn/",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    //DFCF：明天炒什么
    async tomorrowFry(){
        try{
            const url = `https://emcfgdata.securities.eastmoney.com/api/themeInvest/getFryTomorrow`;
            const postData = {
                "args": {},
                "client": "web",
                "clientVersion": "8.3",
                "clientType": "cfw",
                "randomCode": randomStr(16),
                "timestamp": Date.now()
            }
            const { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "host": "emcfgdata.securities.eastmoney.com",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;            
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    //题材列表
    async themeList() {
        try {
            const url = `https://emcfgdata.eastmoney.com/api/themeInvest/getThemeList`;
            const postData = {
                "args": { pageSize: 10, pageNum: 1, sort: -1, sortField: 1 },
                "client": "web",
                "clientVersion": "8.3",
                "clientType": "cfw",
                "randomCode": randomStr(16),
                "timestamp": Date.now()
            }
            let { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            if (!data || data.code !== 0 ) return { code: -1, msg: '未能获取数据！', data: null };
            var list = data.data.list;
            const updatedArray = [];
            for (const item of list) {
                const newValue = await this.themeStatistics(item.themeCode);
                let statistics = {};
                let stocklist = [];
                let baseInfo = {};
                let hotEvent = {};
                const themeInfo = await this.themeBaseInfo(item.themeCode);
                if (newValue && newValue.data && newValue.data.statistic) statistics = newValue.data.statistic;
                if (newValue && newValue.data && newValue.data.stockList) stocklist = newValue.data.stockList;
                if (themeInfo && themeInfo.data) { baseInfo = themeInfo.data.baseInfo; hotEvent = themeInfo.data.hotEvent; }
                updatedArray.push({ ...item, baseInfo: baseInfo, hotEvent: hotEvent, statistics: statistics, stockList: stocklist });
            }
            data.data.list = updatedArray;
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async themeStatistics(code) {
        try {
            const url = `https://emcfgdata.eastmoney.com/api/themeInvest/getStockList`;
            const postData = {
                "args": { themeCode: code, pageSize: 500, pageNum: 1, sort: -1, sortField: "f3" },
                "client": "web",
                "clientVersion": "8.3",
                "clientType": "cfw",
                "randomCode": randomStr(16),
                "timestamp": Date.now()
            }
            const { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async themeBaseInfo(themeCode){
        try {
            //const queryData = { "client": "web", "clientVersion": "8.3", "clientType": "cfw", "randomCode": randomStr(16), "timestamp": Date.now() }
            const queryData = `%7B%22client%22:%22web%22,%22clientVersion%22:%228.3%22,%22clientType%22:%22cfw%22,%22randomCode%22:%22${randomStr(16) }%22,%22timestamp%22:${Date.now()}%7D`
            const url = `https://emcfgdata.securities.eastmoney.com/api/themeInvest/getDetail/${themeCode}?data=${queryData}`;
            const { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.securities.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                    "origin": "https://emrnweb.eastmoney.com"
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async themeDetail(themeCode) {
        try {
            //const queryData = { "client": "web", "clientVersion": "8.3", "clientType": "cfw", "randomCode": randomStr(16), "timestamp": Date.now() }
            const queryData = `%7B%22client%22:%22web%22,%22clientVersion%22:%228.3%22,%22clientType%22:%22cfw%22,%22randomCode%22:%22${randomStr(16)}%22,%22timestamp%22:${Date.now()}%7D`
            const url = `https://emcfgdata.securities.eastmoney.com/api/themeInvest/getStockTable/${themeCode}?data=${queryData}`;
            const { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.securities.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                    "origin": "https://emrnweb.eastmoney.com"
                },
            });
            const themeInfo = await this.themeBaseInfo(themeCode);
            let baseInfo = {};
            if (themeInfo && themeInfo.data) baseInfo = themeInfo.data.baseInfo;
            data.data.themeInfo = baseInfo;
            const quote = await this.themeStockQuote(themeCode, data.data.stockTable.length);
            let stockTable = [];
            if (quote && quote.data && quote.data.stockList && quote.data.stockList.length > 0) stockTable = quote.data.stockList;
            data.data.stockTable = stockTable;
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async themeStockQuote(themeCode, pageSize){
        try {
            const url = `https://emcfgdata.eastmoney.com/api/themeInvest/getStockList`;
            const postData = {
                "args": {
                    "themeCode": themeCode,
                    "pageSize": pageSize,
                    "pageNum": 1,
                    "sort": -1,
                    "sortField": "f3"
                },
                "client": "web",
                "clientVersion": "8.3",
                "clientType": "cfw",
                "randomCode": randomStr(16),
                "timestamp": Date.now()
            }
            const { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                    "origin": "https://emrnweb.eastmoney.com"
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    //今日热点(东方财富)
    async todayChance() {
        try {
            const url = `https://emcfgdata.eastmoney.com/api/themeInvest/getTodayChance`;
            const postData = {
                "args": {},
                "client": "web",
                "clientVersion": "8.3",
                "clientType": "cfw",
                "randomCode": randomStr(16),
                "timestamp": Date.now()
            }
            const { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }

    //预期热点(东方财富)
    async expectHot() {
        try {
            const url = `https://emcfgdata.eastmoney.com/api/themeInvest/getExpectHot`;
            const postData = {
                "args": {},
                "client": "web",
                "clientVersion": "8.3",
                "clientType": "cfw",
                "randomCode": randomStr(16),
                "timestamp": Date.now()
            }
            const { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emcfgdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }

    //热股榜（财联社）
    async clsHotStock() {
        try {
            let para = `app=cailianpress&os=android&sv=856`;
            let paraSign = sign(para);
            let url = `https://api3.cls.cn/v1/hot_stock?${para}&sign=${paraSign}`;
            let { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/ json, text/ javascript, */*; q=0.01",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'api3.cls.cn',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
            });
            if (data.errno !== 0) { return data; }
            const sec_code = data.data.map(item => item.stock.StockID).join(',')
            const reasonData = await this.clsUpReason(sec_code);
            data.data.forEach(item => {
                item.reason = reasonData.data[`${item.stock.StockID}`];
            })
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }

    async clsUpReason(secCode) {
        try {
            const para = `app=cailianpress&os=android&sv=856&secu_codes=${secCode}`;
            const paraSign = sign(para);
            const url = `https://x-quote.cls.cn/v2/quote/a/stock/up_reason?${para}&sign=${paraSign}`
            const { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'x-quote.cls.cn',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async thsHotkNews(hexin){
        try{
            const tag = '同花顺热榜_新热文'
            const url = `https://ai.iwencai.com/index/urp/getdata/basic?tag=${tag}&userid=0&appName=thsHotList&hexin-v=${hexin}`
            const { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'ai.iwencai.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
            });
            const ret = {};
            ret.data = data.answer.components[0].data.datas;
            ret.code = 0;
            ret.msg = "";
            return ret;
        }
        catch(err){
            console.log('err = ', err);
            throw err;
        }
    }
    //资讯热榜（财联社）
    async clsHotNews() {
        try {
            let para = `app=cailianpress&os=android&sv=856`;
            let paraSign = sign(para);
            let url = `https://api3.cls.cn/v1/hot_list?${para}&sign=${paraSign}`;
            let { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'api3.cls.cn',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }

    //热点资讯（东方财富）
    async dfcfHotNews() {
        try {
            let url = `https://np-listapi.eastmoney.com/sec/hotNews?biz=sec_hotnews&client=sec_all&needInteractData=0&req_trace=11&size=100`;
            let { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'np-listapi.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "Referer": "https://vipmoney.eastmoney.com/",
                },
            });
            if (data.errno !== 0) { return data; }
            const sec_code = data.data.map(item => item.stock.StockID).join(',')
            const reasonData = await this.clsUpReason(sec_code);
            data.data.forEach(item => {
                item.reason = reasonData.data[`${item.stock.StockID}`];
            })
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }

    //热股（东方财富）
    
    async dfcfHotStock() {
        try {
            const url = `https://emappdata.eastmoney.com/stockrank/getAllCurrentList`;
            const postData = {
                "appId": dfcfAppId,
                "globalId": dfcfGlobalId,
                "marketType": "",
                "pageNo": 1,
                "pageSize": 100
            }
            let { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emappdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://vipmoney.eastmoney.com/",
                },
            });
            if (data.code !== 0 && data.status !== 0) { return data; }

            const sec_code = data.data.map(item => item.sc).join(',');
            
            const detailData = await this.getStockDetail(sec_code);
            data.data.forEach(async (item) => {
                const secCode = item.sc.substring(2);
                const detail = detailData.data.diff.find(item => { return item.f12 === secCode });
                item.detail = detail;
                item.funs = await this.getFunsData(item.sc);
            })

            const tagData = await this.getStockTag(sec_code);
            data.data.forEach(async (item) =>  {
                const tag = tagData.data.find(tagItem => { return tagItem.srcSecurityCode === item.sc });
                item.tag = tag ? tag.labelItemList : null;
            })
            //data.gubaTopic = await this.HotStockGubaTopic(sec_code);

            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async dfcfHotStockV2() {
        try{

        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async HotStockGubaTopic(stockCode) {
        try {
            const url = `https://emstockdiag.eastmoney.com/apistock/Tran/GetData`;
            const deviceid = await this.getDevice();
            
            const parm = `{"deviceid":"${deviceid}","version":"180","product":"EastMoney","plat":"Android","gubaCode":"${stockCode}"}`;
            const postData = {
                "path": "newtopic/api/Topic/GubaCodeHotTopicNewRead",
                "parm": parm,
                "track": `tanzhen_sys_${Date.now()}`,
                "pageUrl": "https://vipmoney.eastmoney.com/collect/app_ranking/ranking/app.html?appfenxiang=1#/stock"
            }
            let { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emstockdiag.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://vipmoney.eastmoney.com/",
                    "origin": "https://vipmoney.eastmoney.com",
                },
            });
            if (data && data.RData) return JSON.parse(data.RData);
            else return null;
        } catch (err) {
            console.log('err = ', err);
            return null
        }
    }
    async getDevice(){
        const ip = await utils.getClientIP();
        const device = sign(ip).toUpperCase();
        return device;
    }
    async getFunsData(stockCode){
        try{
            const url = `https://emappdata.eastmoney.com/stockrank/getProfileStockRank`;
            const postData = {
                "appId": dfcfAppId,
                "globalId": dfcfGlobalId,
                "srcSecurityCode": stockCode
            }
            let { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emappdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://vipmoney.eastmoney.com/",
                },
            });
            if(data && data.code === 0 ) return data.data;
            else return null;
        }
        catch(err){
            console.log('err = ', err);
            return null
        }
    }
    async getStockDetail(secCode) {
        try {
            const ut = stringToHex(Date.now() + '');
            secCode = secCode.replaceAll('SZ', '0.').replaceAll('SH', '1.');
            const url = `https://push2.eastmoney.com/api/qt/ulist.np/get?ut=${ut}&fltt=2&invt=2&fields=f14,f148,f3,f12,f2,f13,f29&secids=${secCode}`;
            let { data } = await axios.get(url, {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'push2.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                    "Referer": "https://vipmoney.eastmoney.com/",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async getStockTag(secCode) {
        try {
            const url = `https://emappdata.eastmoney.com/label/getSecurityCodeLabelList`
            const postData = {
                "appId": dfcfAppId,
                "globalId": dfcfGlobalId,
                "securityCodes": secCode,
            }
            let { data } = await axios.post(url, JSON.stringify(postData), {
                responseType: "json",
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'emappdata.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json;charset=UTF-8",
                    "Referer": "https://vipmoney.eastmoney.com/",
                },
            });
            return data;
        } catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async filterStock(){
        try{
            const url = `https://datacenter.eastmoney.com/stock/selection/api/data/get/`
            const formData = new FormData();
            formData.append('type','RPTA_SECURITY_WHOLE');
            formData.append('sty', 'ALL');
            formData.append('filter', '');
            formData.append('p', 1);
            formData.append('ps', 2000);
            formData.append('source', 'SELECT_SECURITIES');
            formData.append('client', 'APP');
            let { data } = await axios.post(url, formData, {
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "multipart/form-data;",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        }
        catch(err){
            console.log('err = ', err);
            throw err;
        }
    }
    /**
     * 
     * @param {*} blockType 板块类型（行业板块、概念板块、风格板块、地区板块、香港板块）
     * @param {*} pd 今日明细\今日增仓\3日增仓\10日增仓\DDE排名
     * @param {*} po 排序规则
     * @param {*} pn 数据页码
     * @param {*} pz 每页数据大小
     * @param {*} fid 排序列名
     * @returns 
     */
    async getBlockFund(blockType, pd, po, pn, pz, fid){
        try{
            var item = FS.filter(a => a.name === blockType)[0];
            const fs = encodeURIComponent(item.value);
            let fields = "";
            if (PERIOD.hasOwnProperty(pd)) {
                fields = PERIOD[pd].fields;
                if (!fid || fields.indexOf(fid) <= 0) fid = PERIOD[pd].fid
            }
            else {
                fields = PERIOD.detail.fields;
                if (!fid || fields.indexOf(fid) <= 0) fid = PERIOD.detail.fid
            }
            const url = `https://push2.eastmoney.com/api/qt/clist/get?fs=${fs}&fields=${fields}&fid=${fid}&po=${po}&pn=${pn}&pz=${pz}&np=1&fltt=2&invt=2&ut=${UT}`;
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'push2.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/javascript; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch(err){
            console.log('err = ', err);
            throw err;
        }
    }
    async getIndustryList(){
        try {
            const url = `https://datacenter.eastmoney.com/stock/selection/api/data/get/`
            const formData = new FormData();
            formData.append('type', 'RPTA_APP_INDUSTRY');
            formData.append('sty', 'ALL');
            formData.append('filter', '');
            formData.append('sr', '');
            formData.append('st', '');
            formData.append('source', 'SELECT_SECURITIES');
            formData.append('client', 'APP');
            let { data } = await axios.post(url, formData, {
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "multipart/form-data;",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async getAreaList() {
        try {
            const url = `https://datacenter.eastmoney.com/stock/selection/api/data/get/`
            const formData = new FormData();
            formData.append('type', 'RPTA_APP_AREA');
            formData.append('sty', 'ALL');
            formData.append('filter', '');
            formData.append('sr', '');
            formData.append('st', '');
            formData.append('source', 'SELECT_SECURITIES');
            formData.append('client', 'APP');
            let { data } = await axios.post(url, formData, {
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "multipart/form-data;",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async getStyleConceptList() {
        try {
            const url = `https://datacenter.eastmoney.com/stock/selection/api/data/get/`
            const formData = new FormData();
            formData.append('type', 'RPT_STOCK_STYLECONCEPTLIST');
            formData.append('sty', 'ALL');
            formData.append('filter', '');
            formData.append('sr', '');
            formData.append('st', '');
            formData.append('source', 'SELECT_SECURITIES');
            formData.append('client', 'APP');
            let { data } = await axios.post(url, formData, {
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
                    "Host": 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "multipart/form-data;",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**获取交易日期 */
    async getWebTradeDate(pn){
        try{
            let dateStr = utils.formatDate(new Date(), 'yyyy-MM-dd');
            let startDateStr = `1990-01-01`
            const reportName = 'RPTA_WEB_TRADE_DATE';
            if (!pn) pn = 1;
            const columns = encodeURIComponent('MARKETCODE,DATE,DATE_STR');
            const filter = encodeURIComponent(`(MARKETCODE="069001001")(DATE>'${startDateStr}')(DATE<='${dateStr}')`);
            //const v = this.getRandom();
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=500&sortTypes=-1&sortColumns=DATE_STR`;
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;

        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**每天异动情况，返回单只股票     */
    async getAbnormalStockOneDate(date, pn) {
        try {
            const reportName = 'RPT_CUSTOM_BILLBOARD_BRIEF_DATE';
            const columns = encodeURIComponent('TRADE_DATE,ACCUM_AMOUNT,TOTAL_NET,TOTAL_ORG_NETBUY,HOTMONEY_NETBUY,SECUCODE,SECURITY_NAME_ABBR,NLIMITUP,CHANGE_RATE');
            const filter = encodeURIComponent(`(TRADE_DATE='${date}')`);
            const v = this.getRandom();
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=100&sortTypes=&sortColumns=`;

            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**
     * 一段时间内的异动情况，每天一只股票
     */
    async getAbnormalStock(endDate, begDate){
        try {
            if(!endDate) endDate = utils.formatDate(new Date(),'yyyy-MM-dd');
            if (!begDate) begDate = utils.formatDate(new Date(new Date(endDate).setFullYear(new Date(endDate).getFullYear()-1)), 'yyyy-MM-dd');
            const reportName = 'RPT_CUSTOM_BILLBOARD_BRIEF_DATE';
            const columns = encodeURIComponent('TRADE_DATE,ACCUM_AMOUNT,TOTAL_NET,TOTAL_ORG_NETBUY,HOTMONEY_NETBUY,IS_BIGTRADE');
            const filter = encodeURIComponent(`(TRADE_DATE>='${begDate}')(TRADE_DATE<='${endDate}')`);
            const v = this.getRandom();
            const sortColumns = `TRADE_DATE`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=&pageSize=&sortTypes=-1&sortColumns=${sortColumns}`;
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**
     * 
     * @returns 游资单日资金情况
     */
    async getHotMoneyOneDayInfo(date, pn){
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if(!pn) pn = 1;
            const reportName = 'RPT_BILLBOARD_HOTMONEY_DATELIST';
            const columns = encodeURIComponent('TRADE_DATE,HOTMONEY_NAME,HOTMONEY_NET_AMT,TLABEL,SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,CHANGE_RATE,BELONG_CONCEPT,BELONG_CONCEPT_CODE,NET_AMT,NET_AMT_RATIO,BILLBOARD_BUY_AMT,BILLBOARD_SELL_AMT,BILLBOARD_DEAL_AMT,EXPLANATION');
            const filter = encodeURIComponent(`(TRADE_DATE='${date}')`);
            const distinct = `HOTMONEY_NAME`
            const sortColumns = `HOTMONEY_NET_AMT`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&distinct=${distinct}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=50&sortTypes=-1&sortColumns=${sortColumns}`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**游资单日操作的股票 */
    async getHotMoneyOneDayStock(date, operName, pn){
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if (!pn) pn = 1;
            const reportName = 'RPT_BILLBOARD_HOTMONEY_DATELIST';
            const columns = encodeURIComponent('TRADE_DATE,HOTMONEY_NAME,HOTMONEY_NET_AMT,TLABEL,SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,CHANGE_RATE,BELONG_CONCEPT,BELONG_CONCEPT_CODE,NET_AMT,NET_AMT_RATIO,BILLBOARD_BUY_AMT,BILLBOARD_SELL_AMT,BILLBOARD_DEAL_AMT,EXPLANATION');
            const filter = encodeURIComponent(`(TRADE_DATE='2025-08-21')(HOTMONEY_NAME="${operName}")`);
            const sortColumns = `HOTMONEY_NET_AMT,NET_AMT`
            const sortTypes = encodeURIComponent('-1,-1')
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=100&sortTypes=${sortTypes}&sortColumns=${sortColumns}`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**
     * 营业部排行榜
     */
    async getOperatedeptOneDayInfo(date, pn) {
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if (!pn) pn = 1;
            const reportName = 'RPT_BILLBOARD_LISTDAILY';
            const columns = encodeURIComponent('TRADE_DATE,OPERATEDEPT_NAME,OPERATEDEPT_NAME_NEW,ORG_NAME_ABBR,OPERATEDEPT_CODE,BUYER_APPEAR_NUM,SELLER_APPEAR_NUM,TOTAL_BUYAMT,TOTAL_SELLAMT,TOTAL_NETAMT,BUY_STOCK,BUY_STOCK_ABBR');
            const filter = encodeURIComponent(`(TRADE_DATE='${date}')`);
            const sortColumns = `TOTAL_NETAMT`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=50&sortTypes=-1&sortColumns=TOTAL_NETAMT`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**机构排行榜 */
    async getOrgOneDayInfo(date, pn) {
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if (!pn) pn = 1;
            const reportName = 'RPT_BILLBOARD_TRADEDAILY';
            const columns = encodeURIComponent('SECUCODE,SECURITY_CODE,SECURITY_NAME_ABBR,TRADE_MARKET,TRADE_DATE,CHANGE_RATE,BILLBOARD_DEAL_AMT,ORG_BUY_TIMES,ORG_SELL_TIMES,ORG_NET_BUY,ORG_NET_RATIO,ORG_BUY_AMT,ORG_SELL_AMT,EXPLANATION,BELONG_CONCEPT,BELONG_CONCEPT_CODE,TLABEL,COLOR_LABEL');
            const filter = encodeURIComponent(`(TRADE_DATE='${date}')((ORG_BUY_TIMES > 0)(|ORG_SELL_TIMES > 0 ))`);
            const sortColumns = `ORG_NET_BUY`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=100&sortTypes=-1&sortColumns=${sortColumns}`;
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**异动：连板个股 */
    async abnormal_Multi_Limitup_Stock(date, pn){
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if (!pn) pn = 1;
            const reportName = 'RPT_BILLBOARD_NEW_CHANGE';
            const columns = encodeURIComponent('SECURITY_NAME_ABBR,SECURITY_NAME,SECUCODE,SECURITY_CODE,TRADE_DATE,NLIMITUP,CHANGE_RATE,BILLBOARD_NET_AMT,DEAL_NET_RATIO,BILLBOARD_BUY_AMT,BILLBOARD_SELL_AMT,BILLBOARD_DEAL_AMT,EXPLANATION,HOTMONEY_T,BELONG_CONCEPT,BELONG_CONCEPT_CODE,TYPE,RANK1,IS_NEW,COLOR_LABEL');
            const filter = encodeURIComponent(`(TRADE_DATE='${date}')(TYPE="001")`);
            const sortColumns = `RANK1`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=100&sortTypes=1&sortColumns=${sortColumns}`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**异动：首板个股 */
    async abnormal_First_Limitup_Stock(date, pn) {
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if (!pn) pn = 1;
            const reportName = 'RPT_BILLBOARD_NEW_CHANGE';
            const columns = encodeURIComponent('SECURITY_NAME_ABBR,SECURITY_NAME,SECUCODE,SECURITY_CODE,TRADE_DATE,LAST_CLOSE_PRICE,CHANGE_RATE,BILLBOARD_NET_AMT,DEAL_NET_RATIO,BILLBOARD_BUY_AMT,BILLBOARD_SELL_AMT,BILLBOARD_DEAL_AMT,EXPLANATION,HOTMONEY_T,COLOR_LABEL,BELONG_CONCEPT,BELONG_CONCEPT_CODE,TYPE,IS_NEW');
            const filter = encodeURIComponent(`(TRADE_DATE='${date}')(TYPE="002")`);
            const sortColumns = `LAST_CLOSE_PRICE`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=200&sortTypes=-1&sortColumns=${sortColumns}`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**异动：异动营业部 */
    async abnormal_Operatedept_Limitup_Stock(date, pn) {
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if (!pn) pn = 1;
            const reportName = 'RPT_BILLBOARD_NEW_CHANGE';
            const columns = encodeURIComponent('TRADE_DATE,OPERATEDEPT_NAME,OPERATEDEPT_CODE,TOTAL_NETAMT,TOTAL_BUYAMT,TOTAL_SELLAMT,BUY_STOCK,SECURITY_NAME_ABBR,TYPE');
            const filter = encodeURIComponent(`(TRADE_DATE='${date}')(TYPE="003")`);
            const sortColumns = `TOTAL_NETAMT`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=100&sortTypes=-1&sortColumns=${sortColumns}`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**异动： 
     * style = operatedept： 营业部异动
     * style = first：       首板
     * style = multi：       连板
    */
    async abnormal(style, date, pn, ps) {
        try {
            if (!date) date = utils.formatDate(new Date(), 'yyyy-MM-dd');
            if (!pn) pn = 1;
            if (!ps) ps = 500;
            const reportName = 'RPT_BILLBOARD_NEW_CHANGE';
            let  columns = '';
            let filter = '';
            let sortColumns = '';
            let sortTypes = -1;
            if (style.toLowerCase() === 'operatedept') {
                columns = encodeURIComponent('TRADE_DATE,OPERATEDEPT_NAME,OPERATEDEPT_CODE,TOTAL_NETAMT,TOTAL_BUYAMT,TOTAL_SELLAMT,BUY_STOCK,SECURITY_NAME_ABBR,TYPE');
                sortColumns = `TOTAL_NETAMT`;
                filter = encodeURIComponent(`(TRADE_DATE='${date}')(TYPE="003")`);
            }
            else if (style.toLowerCase() === 'first') {
                columns = encodeURIComponent('SECURITY_NAME_ABBR,SECURITY_NAME,SECUCODE,SECURITY_CODE,TRADE_DATE,LAST_CLOSE_PRICE,CHANGE_RATE,BILLBOARD_NET_AMT,DEAL_NET_RATIO,BILLBOARD_BUY_AMT,BILLBOARD_SELL_AMT,BILLBOARD_DEAL_AMT,EXPLANATION,HOTMONEY_T,COLOR_LABEL,BELONG_CONCEPT,BELONG_CONCEPT_CODE,TYPE,IS_NEW');
                filter = encodeURIComponent(`(TRADE_DATE='${date}')(TYPE="002")`);
                sortColumns = `LAST_CLOSE_PRICE`
            }
            else if (style.toLowerCase() === 'multi') {
                columns = encodeURIComponent('SECURITY_NAME_ABBR,SECURITY_NAME,SECUCODE,SECURITY_CODE,TRADE_DATE,NLIMITUP,CHANGE_RATE,BILLBOARD_NET_AMT,DEAL_NET_RATIO,BILLBOARD_BUY_AMT,BILLBOARD_SELL_AMT,BILLBOARD_DEAL_AMT,EXPLANATION,HOTMONEY_T,BELONG_CONCEPT,BELONG_CONCEPT_CODE,TYPE,RANK1,IS_NEW,COLOR_LABEL');
                filter = encodeURIComponent(`(TRADE_DATE='${date}')(TYPE="001")`);
                sortColumns = `RANK1`;
                sortTypes = 1;
            }
            else{
                return { code: -1, message: '参数不正确！', result: null, success: false }
            }
            
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=${reportName}&columns=${columns}&filter=${filter}&source=SECURITIES&client=APP&pageNumber=${pn}&pageSize=${ps}&sortTypes=${sortTypes}&sortColumns=${sortColumns}`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async limitUpDown_TradeDate(){
        try{
            const reportName = 'RPT_INTSELECTION_DATELIST';
            const columns = 'TRADE_DATE,IS_NEW';
            const sortColumns = `TRADE_DATE`
            const url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&sortTypes=-1&sortColumns=${sortColumns}&em_timestamp=${new Date().getTime()}`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                },
            });
            return data;
        }
        catch(err){
            console.log('err = ', err);
            throw err;
        }
    }
    async limitCalendar(){
        try{
            let tradeDates = await this.getWebTradeDate();
            //console.log('tradeDates.result.data = ', tradeDates.result.data)
            const limitDates = await this.limitUpDown_TradeDate();
            let isNewDate = utils.formatDate(new Date(),'yyyy-MM-dd');
            if (!limitDates.result) isNewDate = tradeDates.result.data[0].DATE
            else isNewDate = limitDates.result.data.filter(item => item.IS_NEW === '1')[0].TRADE_DATE;
            const endDate = new Date(new Date(isNewDate).setFullYear(new Date(isNewDate).getFullYear() - 1));
            let data = [];
            let calendar = [];
            for (let i = 0; i < tradeDates.result.data.length; i++) {
                if (new Date(tradeDates.result.data[i].DATE) >= endDate) {
                    let is_new = 0;
                    if (tradeDates.result.data[i].DATE === isNewDate) is_new = 1;
                    let item = { DATE: tradeDates.result.data[i].DATE, IS_NEW: is_new, DATE_STR: tradeDates.result.data[i].DATE_STR }
                    data.push(item);
                }
            }
            tradeDates.result.data = data;
            return tradeDates;
        }
        catch(err){
            console.log('err = ', err);
            throw err;
        }
    }
    /**涨跌停： 
     * report:  报表编号
     * market:  市场类型
     * date:    交易日期
     * pn:      数据页码
     * ps:      每页数据多少
     * bc:      板块编码
    */
    async limitUpDown(report, market, date, pn, ps, bc) {
        try {
            let isTradeDate = 0;
            const dateData = await this.limitUpDown_TradeDate();
            if (!date) {
                date = dateData.result.data[0].TRADE_DATE.substring(0,10);
                isTradeDate = dateData.result.data[0].IS_NEW;
            }
            else {
                var qdate = dateData.result.data.filter(item => { return item.TRADE_DATE.substring(0, 10) === date })
                isTradeDate = !qdate || qdate.length === 0 ? 0 : qdate[0].IS_NEW;
            }
            if (!pn) pn = 1;
            if (!ps) ps = 500;
            let reportCode = report.substring(1);
            let reportItem = REPORTNAME.filter(x => { return x.reportCode === reportCode })
            if(!reportItem || reportItem.length === 0) return { code: -1, message: '参数错误，报表不存在！', result: {}, success: false};
            let reportName = reportItem[0].name;
            let columns = reportItem[0].columns;
            if(!bc) bc = '';
            let url = '';
            if(reportCode === '101'){
                let retData = { code: 0, message: 'ok', result: { szzs: null, prelimit: null} };
                try{
                    url = reportItem[0].url.replaceAll('【TRADEDATE】', utils.formatDate(new Date(date), 'yyyyMMdd')).replaceAll('【UT】', Date.now());
                    let { data } = await axios.get(url);
                    if (data && data.code === 0 && data.result.length > 0) retData.result.szzs = data.result;
                    const extData = await this.getHistoryExtentData(reportItem[0].exturl, date);
                    retData.result.prelimit = extData && extData.result ? extData.result : null;
                }
                catch(err){
                    retData = { code: -1, message: err.message, result: null };
                }
                return retData;
            }
            else{
                let filter = encodeURIComponent(reportItem[0].filter.replaceAll('【QUERYDATE】', date).replaceAll('【BLOCKCODE】', bc.toUpperCase()));
                let sortColumns = reportItem[0].sortColumns;
                let sortTypes = reportItem[0].sortTypes;

                url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&filter=${filter}&pageNumber=${pn}&pageSize=${ps}&sortTypes=${sortTypes}&sortColumns=${sortColumns}&em_timestamp=${new Date().getTime()}`;
                if (reportCode === '002') {
                    const distinct = reportItem[0].distinct;
                    url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&filter=${filter}&distinct=${distinct}&pageNumber=${pn}&pageSize=15&sortTypes=${sortTypes}&sortColumns=${sortColumns}&em_timestamp=${new Date().getTime()}`
                }
                if (!sortColumns) url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&filter=${filter}&em_timestamp=${new Date().getTime()}`;
                console.log('limitUpDown -> url = ', url);
                const { data } = await axios.get(url, {
                    headers: {
                        Host: 'datacenter.eastmoney.com',
                        "Accept-Language": "zh-CN,zh;q=0.9",
                        "Upgrade-Insecure-Requests": 1,
                        "Content-Type": "application/json; charset=UTF-8",
                        "Referer": "https://emdata.eastmoney.com/",
                    },
                });
                return data;
            }
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async getHistoryExtentData(url, date){
        url = url.replaceAll('【TRADEDATE】', utils.formatDate(new Date(date), 'yyyyMMdd')).replaceAll('【UT】', Date.now());
        const { data } = await axios.get(url);
        return data;
    }
    async limitUpDown_realtime(report, market, date, pn, ps, bc) {
        try {
            let isTradeDate = 0;
            const dateData = await this.limitUpDown_TradeDate();
            let trade = dateData.result.data.filter(item => { return item.IS_NEW === "1" });
            let tradeDate = (!trade || trade.length <= 0 ? utils.formatDate(new Date(),'yyyy-MM-dd') : trade[0].TRADE_DATE.substring(0, 10));
            if (!date || new Date(date) >= tradeDate) { date = tradeDate; isTradeDate = 1; }
            else {
                var qdate = dateData.result.data.filter(item => { return item.TRADE_DATE.substring(0, 10) === date })
                isTradeDate = !qdate || qdate.length === 0 ? 0 : parseInt(qdate[0].IS_NEW);
            }
            
            
            if (!pn) pn = 1;
            if (!ps) ps = 500;
            let reportCode = report.substring(1);
            let reportItem = REPORTNAME_REALTIME.filter(x => { return x.reportCode === reportCode })
            if (!reportItem || reportItem.length === 0) return { code: -1, message: '参数错误，报表不存在！', result: {}, success: false };
            
            let headers = {};
            let url = '';
            if(reportCode.substring(0, 1) === '1'){
                url = reportItem[0].url;
                headers = {
                    Host: (reportCode === '103' || reportCode === '104') ? 'push2.eastmoney.com' : 'quotederivates.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                    "Origin": "https://emrnweb.eastmoney.com"
                }
            }
            else if (reportCode.substring(0, 1) === '2') {
                url = reportItem[0].url;
                headers = {
                    Host: 'push2dycalc.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                    "Origin": "https://emrnweb.eastmoney.com"
                }
            }
            else{
                let reportName = reportItem[0].name;
                let columns = reportItem[0].columns;
                if (!bc) bc = '';
                let filter = encodeURIComponent(reportItem[0].filter.replaceAll('【QUERYDATE】', date).replaceAll('【NEW_TRADE_DATE】', tradeDate).replaceAll('【BLOCKCODE】', bc.toUpperCase()));
                let sortColumns = reportItem[0].sortColumns;
                let sortTypes = reportItem[0].sortTypes;

                url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&filter=${filter}&pageNumber=${pn}&pageSize=${ps}&sortTypes=${sortTypes}&sortColumns=${sortColumns}&em_timestamp=${new Date().getTime()}`;
                if (reportCode === '001') url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&em_timestamp=${new Date().getTime()}`;
                if (reportCode === '002') {
                    const distinct = reportItem[0].distinct;
                    url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&filter=${filter}&distinct=${distinct}&pageNumber=${pn}&pageSize=15&sortTypes=${sortTypes}&sortColumns=${sortColumns}&em_timestamp=${new Date().getTime()}`
                }
                if (!sortColumns) url = `https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=${reportName}&columns=${columns}&filter=${filter}&em_timestamp=${new Date().getTime()}`;
                console.log('url = ', url);
                headers = {
                    Host: 'datacenter.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emdata.eastmoney.com/",
                }
            }
            let { data } = await axios.get(url, { headers: headers });
            if (reportItem[0].hasOwnProperty('exturl')) {  
                if(reportCode === '008') {
                    if (!data || !data.result || !data.result.data || data.result.data.length === 0) { return data; }
                    let extData = await this.getPreLimitExtentData(data, reportItem[0].exturl);
                    data.result.data.forEach((item, index) => {
                        let exitItems = extData.data.diff.filter(x => x.f12 === item.SECURITY_CODE)
                        data.result.data[index] = { ...item, ...exitItems[0] };
                    })
                }
                else if(reportCode === '104'){
                    let extData = await this.getExtentData(null, reportItem[0].exturl);
                    data.extData = extData.data;
                }
                else{
                    if (!data.data || data.data.length === 0) { return data; }
                    let extData = await this.getExtentData(data, reportItem[0].exturl);
                    if (!extData.data || extData.data.length === 0) { data.data.extData = []; return data; }
                    data.extData = extData.data.diff;
                }
                return data;
            }
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async getPreLimitExtentData(secData, url) {
        if (!secData || !secData.result || !secData.result.data || secData.result.data.length === 0) return null;
        let secCode = '';
        secData.result.data.forEach((item) => { secCode += `${item.MARKET_CODE}.${item.SECURITY_CODE},` })
        secCode = secCode.substring(0, secCode.length - 1);
        url = url.replaceAll('【SECCODES】', secCode).replaceAll('【UT】', Date.now());
        const { data } = await axios.get(url);//, { headers: headers });
        return data;
    }
    async getExtentData(secData, url) {
        if(!secData){
            url = url.replaceAll('【UT】', Date.now());
            let { data } = await axios.get(url);
            return data;
        }
        else{
            if (!secData || !secData.data || secData.data.length === 0) return null;
            let secCode = '';
            secData.data.forEach((item) => { secCode += `${item.market}.${item.code},` })
            secCode = secCode.substring(0, secCode.length - 1);
            url = url.replaceAll('【SECCODES】', secCode).replaceAll('【UT】', Date.now());
            let { data } = await axios.get(url);
            return data;
        }
    }
    async report(rn, date, pn, ps){
        try{
            if (!rn) return { code: -1, message: '参数错误，不明确的报表！', result: null, data: null, success: false }
            const report = REPORT_SUITE.filter(item => item.name === rn);
            if (!report || report.length === 0) return { code: -1, message: '参数错误，报表不存在！', result: null, data: null, success: false }
            
            if (rn === 'effect') return this.MoneyMarketEffect(date);

            const tradeDates = await this.limitUpDown_TradeDate();
            const newTradeDate = tradeDates.result.data.filter(item => item.IS_NEW === '1')[0];
            let data = {};
            if (!date || new Date(date) >= new Date(newTradeDate.TRADE_DATE.substring(0, 10))) {
                data = await this.limitUpDown_realtime(`R${report[0].realtime}`, '', '', pn, ps);
            }
            else {
                data = await this.limitUpDown(`H${report[0].history}`, '', date, pn, ps, '');
            }
            if (rn === 'limitnatural'){
                const causeData = await this.limitUpDown('H025', '', date, pn, '', '');
                if (causeData && causeData.result && causeData.result.data && causeData.result.data.length > 0){
                    data.result.data.forEach(item => {
                        const causes = causeData.result.data.filter(yy => yy.SECURITY_CODE === item.SECURITY_CODE)
                        item.LIMIT_REASON = causes && causes.length > 0 ? causes[0] : {};
                    })
                }
                else data.result.data.forEach(item => { item.LIMIT_REASON = {} });
            }
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }

    async MoneyMarketEffect(date, pn = 1, ps = 1){
        try{
            const tradeDates = await this.limitUpDown_TradeDate();
            const newTradeDate = tradeDates.result.data.filter(item => item.IS_NEW === '1')[0];
            let preData, curData;
            //console.log('MoneyMarketEffect -> newTradeDate = ', newTradeDate)
            if (!date || new Date(date) >= new Date(newTradeDate.TRADE_DATE.substring(0,10))){
                const index = tradeDates.result.data.indexOf(newTradeDate);
                const prevDate = tradeDates.result.data[index + 1].TRADE_DATE.substring(0, 10);
                const prevData = await this.limitUpDown('r001', '', prevDate, pn, ps, '');//上一个交易日的赚钱效应
                const currData = await this.limitUpDown_realtime('r001', '', '', 1, 1);
                curData = currData && currData.result && currData.result.data && currData.result.data.length > 0 ? currData.result.data : null;
                if(curData){
                    const marketLimitData = await this.limitUpDown_realtime('r201');
                    let LIMIT_DOWN_NUM = 0, CJDT_NUM = 0, DT_FBL = 0;
                    if (marketLimitData && marketLimitData.data && marketLimitData.data.diff && marketLimitData.data.diff.length > 0){
                        marketLimitData.data.diff.forEach(item => {
                            LIMIT_DOWN_NUM += item.f438;
                            CJDT_NUM += item.f628;
                        })
                        curData[0].LIMIT_DOWN_NUM = LIMIT_DOWN_NUM;
                        curData[0].CJDT_NUM = CJDT_NUM;
                        curData[0].DT_FBL = ((LIMIT_DOWN_NUM / (CJDT_NUM + LIMIT_DOWN_NUM)) * 100).toFixed(2);
                    }
                }
                preData = prevData && prevData.result && prevData.result.data && prevData.result.data.length > 0 ? prevData.result.data : null;
            }
            else{
                pn = 1; ps =2;
                const effectData = await this.limitUpDown('r001', '', date, pn, ps, '');//上一个交易日的赚钱效应
                //console.log('effectData.result.data = ', effectData.result.data)
                curData = [effectData.result.data[0]];
                preData = [effectData.result.data[1]];
            }
            const result = { "success": true, "message": "ok", "code": 0, currData: curData, prevData: preData }
            //console.log('result = ', result)
            return result;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async limitUpLeader(date, pn = 1, ps = 20){
        try{
            const tradeDates = await this.limitUpDown_TradeDate();
            const newTradeDate = tradeDates.result.data.filter(item => item.IS_NEW === '1')[0];
            let data = {};
            if (!date || new Date(date) >= new Date(newTradeDate.TRADE_DATE.substring(0, 10))) {
                data = await this.limitUpDown_realtime('r002', '', '', pn, ps);
            }
            else{
                data = await this.limitUpDown('r002', '', date, pn, ps, '');
            }
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async auctionLimitUp(date, pn = 1, ps = 20){
        try {
            const tradeDates = await this.limitUpDown_TradeDate();
            const newTradeDate = tradeDates.result.data.filter(item => item.IS_NEW === '1')[0];
            let data = {};
            if (!date || new Date(date) >= new Date(newTradeDate.TRADE_DATE.substring(0, 10))) {
                data = await this.limitUpDown_realtime('r101', '', '', pn, ps);
            }
            else {
                data = await this.limitUpDown('r003', '', date, pn, ps, '');
            }
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async hightQualityLimitUp(date, pn = 1, ps = 20){
        try{
            const tradeDates = await this.limitUpDown_TradeDate();
            const newTradeDate = tradeDates.result.data.filter(item => item.IS_NEW === '1')[0];
            let data = {};
            if (!date || new Date(date) >= new Date(newTradeDate.TRADE_DATE.substring(0, 10))) {
                data = await this.limitUpDown_realtime('r011', '', '', pn, ps);
            }
            else {
                data = await this.limitUpDown('r011', '', date, pn, ps, '');
            }
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }

    }
    /**昨日涨停股今日表现（与上证指数的对比） */
    async prevLimitUpStockBehave(date){
        try {
            if(!date) date = utils.formatDate(new Date(), 'yyyyMMdd')
            let result = {};
            const szzs = await this.prevLimitUpStockBehave_szzs(date);
            const zrztbk = await this.prevLimitUpStockBehave_zrztbk(date);
            result.indexData = szzs;
            result.blockIndex = zrztbk;
            return result;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**昨日涨停板块今日表现：上证指数 */
    async prevLimitUpStockBehave_szzs(date) {
        try {
            let url = `https://dycalctra.eastmoney.com/history/appdate?code=000001&market=1&date=${date}&invt=3`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'dycalctra.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    /**昨日涨停板块今日表现：昨日涨停板块 */
    async prevLimitUpStockBehave_zrztbk(date) {
        try {
            const url = `https://dycalctra.eastmoney.com/history/appdate?code=BK0815&market=90&date=${date}&invt=3`
            const { data } = await axios.get(url, {
                headers: {
                    Host: 'dycalctra.eastmoney.com',
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Upgrade-Insecure-Requests": 1,
                    "Content-Type": "application/json; charset=UTF-8",
                    "Referer": "https://emrnweb.eastmoney.com/",
                },
            });
            return data;
        }
        catch (err) {
            console.log('err = ', err);
            throw err;
        }
    }
    async getRandom(){
        let rnd = '';
        for (var n = 0; n < 20; n++){
            rnd += Math.floor(16 * Math.random());
        }
        console.log('rnd = ', rnd)
        return rnd;
    }
}

module.exports = StockService;
