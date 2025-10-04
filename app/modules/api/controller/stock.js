const dayjs = require("dayjs");
const cheerio = require("cheerio");
const utils = require("../../../extend/utils");

const {
    modules: {
        api: {
            service: { stock },
        },
    },
    helper: {
        api: { success },
    },
} = Chan;

class StockController {
    async getCIP(req, res, next){
        const data = await utils.getClientIP();
        console.log('StockController -> data = ', data);
        res.json(data);
    }
    //新增加概念
    async concept(req, res, next) {
        try {
            var { pageIndex, pageSize } = req.query;
            if (!pageIndex) pageIndex = 1;
            if (!pageSize) pageSize = 100;
            const data = await stock.concept(pageIndex, pageSize);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async conceptTrends(req, res, next){
        try {
            var { concept, date, pageIndex, pageSize, tab_type } = req.body;
            if (!concept) concept = 'all';
            if (!tab_type) tab_type = 'all';
            if (!pageIndex) pageIndex = 1;
            if (!pageSize) pageSize = 200;
            const data = await stock.conceptTrends(concept, date, pageIndex, pageSize, tab_type);
            console.log('data = ', data);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async conceptQuote(req, res, next) {
        try {
            var { id, code } = req.query;
            const data = await stock.conceptQuote(id, code);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async conceptIndex(req, res, next) {
        try {
            var { url } = req.query;
            const data = await stock.conceptIndex(url);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async conceptCalendar(req, res, next) {
        try {
            const data = await stock.conceptCalendar();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    //热股（同花顺）
    async thsHotStock(req, res, next){
        try{
            const timeType = req.query.type
            const data = await stock.thsHotStock(timeType);
            res.json(data);
        } catch(error) {
            next(error);
        }
    }

    //涨停:up_pool  跌停：down_pool  连板：continuous_up_pool   炸板：up_open_pool
    async uplimit(req, res, next) {
        try{
            var { poolType } = req.query;
            if (!poolType) poolType = "up_pool";
            const data = await stock.uplimit(poolType);
            res.json(data);
        } catch(error){
            next(error);
        }
    }
    async uplimitv2(req, res, next) {
        try {
            var { isUplimit, date } = req.query;
            if (!isUplimit) isUplimit = 1;
            const data = await stock.uplimitv2(isUplimit, date);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async todayChance(req, res, next){
        try{
            const data = await stock.todayChance();
            res.json(data);
        } catch(error){
            next(error);
        }
    }

    async expectHot(req, res, next) {
        try {
            const data = await stock.expectHot();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async tomorrowFry(req, res, next) {
        try {
            const data = await stock.tomorrowFry();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async themeList(req, res, next) {
        try {
            const data = await stock.themeList();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async themeStatistics(req, res, next) {
        try {
            const code = req.query.code || req.params.code;
            const data = await stock.themeStatistics(code);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async themeBaseInfo(req, res, next) {
        try {
            const { code } = req.query;
            const data = await stock.themeBaseInfo(code);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async themeDetail(req, res, next) {
        try {
            const code  = req.query.code || req.params.code;
            const data = await stock.themeDetail(code);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async themeStockQuote(req, res, next) {
        try {
            const code = req.query.code || req.params.code;
            const pageSize = req.query.pageSize || req.params.pageSize;
            const data = await stock.themeStockQuote(code, pageSize);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async clsHotStock(req, res, next) {
        try {
            const data = await stock.clsHotStock();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async thsHotNews(req, res, next){
        try {
            const hexin = req.query.hexin
            const data = await stock.thsHotkNews(hexin);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async clsHotNews(req, res, next) {
        try {
            const data = await stock.clsHotNews();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async dfcfHotNews(req, res, next) {
        try {
            const data = await stock.dfcfHotNews();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    async dfcfHotStock(req, res, next) {
        try {
            const data = await stock.dfcfHotStock();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async dfcfHotStockV2(req, res, next) {
        try {
            const data = await stock.dfcfHotStockV2();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async HotStockGubaTopic(req, res, next) {
        try {
            const stockCode = req.body.stockCode
            const data = await stock.HotStockGubaTopic(stockCode);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async filterStock(req, res, next){
        try {
            const data = await stock.filterStock();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getBlockFund(req, res, next){
        try{
            let bt = req.query.bt || req.body.bt || req.params.bt;
            if (!bt) bt = "industry";
            let period = req.query.pd || req.body.pd || req.params.pd;
            if (!period) period = "detail";
            let po = req.query.po || req.body.po || req.params.po;
            if (!po) po = 1;
            let pn = req.query.pn || req.body.pn || req.params.pn;
            if (!pn) pn = 1;
            let pz = req.query.pz || req.body.pz || req.params.pz;
            if (!pz) pz = 100;
            const fid = req.query.fid || req.body.fid || req.params.fid;
            const data = await stock.getBlockFund(bt, period, po, pn, pz, fid);
            res.json(data);
        }
        catch (error) {
            next(error);
        }
    }
    async getIndustryList(req, res, next) {
        try {
            const data = await stock.getIndustryList();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getAreaList(req, res, next) {
        try {
            const data = await stock.getAreaList();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getStyleConceptList(req, res, next) {
        try {
            const data = await stock.getStyleConceptList();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getWebTradeDate(req, res, next){
        try {
            let pn = req.query.pn || req.params.pn;
            if(!pn) pn = 1;
            const data = await stock.getWebTradeDate(pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getAbnormalStockOneDate(req, res, next){
        try {
            let pn = req.query.pn || req.params.pn;
            if (!pn) pn = 1;
            let date = req.query.date || req.params.date;
            const data = await stock.getAbnormalStockOneDate(date, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getAbnormalStock(req, res, next){
        try {
            let end = req.query.end || req.params.end;
            let beg = req.query.beg || req.params.beg;
            const data = await stock.getAbnormalStock(end, beg);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getHotMoneyOneDayInfo(req, res, next){
        try {
            let date = req.query.date || req.params.date;
            let pn = req.query.pn || req.params.pn;
            const data = await stock.getHotMoneyOneDayInfo(date, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getHotMoneyOneDayStock(req, res, next) {
        try {
            let date = req.query.date || req.params.date;
            let pn = req.query.pn || req.params.pn;
            let name = req.query.name || req.params.name;
            const data = await stock.getHotMoneyOneDayStock(date, name, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getOperatedeptOneDayInfo(req, res, next) {
        try {
            let date = req.query.date || req.params.date;
            let pn = req.query.pn || req.params.pn;
            const data = await stock.getOperatedeptOneDayInfo(date, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async getOrgOneDayInfo(req, res, next) {
        try {
            let date = req.query.date || req.params.date;
            let pn = req.query.pn || req.params.pn;
            const data = await stock.getOrgOneDayInfo(date, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async abnormal_Multi_Limitup_Stock(req, res, next){
        try {
            let date = req.query.date || req.params.date;
            let pn = req.query.pn || req.params.pn;
            const data = await stock.abnormal_Multi_Limitup_Stock(date, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async abnormal_First_Limitup_Stock(req, res, next) {
        try {
            let date = req.query.date || req.params.date;
            let pn = req.query.pn || req.params.pn;
            const data = await stock.abnormal_First_Limitup_Stock(date, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async abnormal_Operatedept_Limitup_Stock(req, res, next) {
        try {
            let date = req.query.date || req.params.date;
            let pn = req.query.pn || req.params.pn;
            const data = await stock.abnormal_Operatedept_Limitup_Stock(date, pn);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async abnormal(req, res, next) {
        try {
            let style = req.params.style;
            if (!style) res.json({ code: -1, message: '参数不正确！', result: null, success: false });
            let date = req.query.date;
            let pn = req.query.pn;
            let ps = req.query.ps;
            const data = await stock.abnormal(style, date, pn, ps);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async limitUpDown_TradeDate(req, res, next){
        try {
            const data = await stock.limitUpDown_TradeDate();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async limitCalendar(req, res, next) {
        try {
            const data = await stock.limitCalendar();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async limitUpDown(req, res, next){
        try {
            const report = req.params.rc;
            const market = req.query.market;
            const date = req.query.date;
            const pn = req.query.pn;
            const ps = req.query.ps;
            const blockcode = req.query.bc;
            const data = await stock.limitUpDown(report, market, date, pn, ps, blockcode);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async limitUpDown_realtime(req, res, next) {
        try {
            const report = req.params.rc;
            const market = req.query.market;
            const date = req.query.date;
            const pn = req.query.pn;
            const ps = req.query.ps;
            const blockcode = req.query.bc;
            const data = await stock.limitUpDown_realtime(report, market, date, pn, ps, blockcode);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async MoneyMarketEffect(req, res, next){
        try {
            const date = req.query.date 
            const pn = req.query.pn || 1;
            const ps = req.query.ps;
            const data = await stock.MoneyMarketEffect(date, pn, ps);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async limitUpLeader(req, res, next) {
        try {
            const date = req.query.date
            const pn = req.query.pn || 1;
            const ps = req.query.ps;
            const data = await stock.limitUpLeader(date, pn, ps);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async auctionLimitUp(req, res, next){
        try {
            const date = req.query.date
            const pn = req.query.pn || 1;
            const ps = req.query.ps;
            const data = await stock.auctionLimitUp(date, pn, ps);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async hightQualityLimitUp(req, res, next) {
        try {
            const date = req.query.date
            const pn = req.query.pn || 1;
            const ps = req.query.ps;
            const data = await stock.hightQualityLimitUp(date, pn, ps);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
    async report(req, res, next) {
        try {
            const reportName = req.params.name;
            if (!reportName) {
                res.json({ code: -1, message: '参数错误，缺少报表名称！', result: {}, success: false });
            }
            else{
                const date = req.query.date || req.params.date;
                const pn = req.query.pn || 1;
                const ps = req.query.ps;
                const data = await stock.report(reportName, date, pn, ps);
                res.json(data);
            }
        } catch (error) {
            next(error);
        }
    }
    async prevLimitUpStockBehave(req, res, next){
        try {
            const date = req.query.date || req.params.date;
            const data = await stock.prevLimitUpStockBehave(date);
            res.json(data);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = StockController;
