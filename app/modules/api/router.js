const auth = require("../../middleware/auth.js");
const init = require("../../middleware/init.js");
const { upload } = Chan.helper.upload;

module.exports = (opt) => {
  const {
    router,
    modules: {
      api: { controller },
    },
    app,
  } = opt;

  router.use(init());

  // 登录
  router.post("/sysUser/login", controller.sysUser.login);
  router.get("/sysUser/list", controller.sysUser.list);
  router.get("/sysUser/search", controller.sysUser.search);
  router.get("/sysUser/detail", auth(), controller.sysUser.detail);
  router.post("/sysUser/create", auth(), controller.sysUser.create);
  router.get("/sysUser/delete", auth(), controller.sysUser.delete);
  router.post("/sysUser/update", auth(), controller.sysUser.update);

  // 站点信息
  router.get("/site/find", auth(), controller.site.find);
  router.post("/site/update", auth(), controller.site.update);
  router.get("/site/runEnv", controller.site.runEnv);
  router.get("/sysApp/find", controller.sysApp.find);
  router.get("/sysApp/views", controller.sysApp.getViews);
  router.get("/sysApp/folder", controller.sysApp.folder);
  router.get("/sysApp/config", controller.sysApp.config);
  router.post("/sysApp/update", auth(), controller.sysApp.update);

  // 网站栏目
  router.get("/category/find", controller.category.find);
  router.get("/category/findId", controller.category.findId);
  router.get("/category/findSubId", controller.category.findSubId);
  router.get("/category/search", controller.category.search);
  router.get("/category/delete", auth(), controller.category.delete);
  router.post("/category/update", auth(), controller.category.update);
  router.post("/category/create", auth(), controller.category.create);

  // 文章栏目
  router.get("/article/list", controller.article.list);
  router.get("/article/tongji", controller.article.tongji);
  router.get("/article/search", controller.article.search);
  router.get("/article/detail", controller.article.detail);
  router.get("/article/findField", auth(), controller.article.findField);
  router.post("/article/create", auth(), controller.article.create);
  router.get("/article/delete", auth(), controller.article.delete);
  router.post("/article/update", auth(), controller.article.update);

  //上传
  router.post("/upload", auth(), upload.any(), controller.article.upload);
  router.get("/article/delfile", auth(), controller.article.delfile);
  // 七牛云相关
  router.get("/qiniu/getUploadToken", controller.qiniu.getUploadToken);
  router.post("/qiniu/upload", auth(), upload.any(), controller.qiniu.upload);

  // 模型管理
  router.get("/model/list", controller.model.list);
  router.get("/model/detail", controller.model.detail);
  router.get("/model/hasUse", auth(), controller.model.hasUse);
  router.post("/model/create", auth(), controller.model.create);
  router.post("/model/delete", auth(), controller.model.delete);
  router.post("/model/update", auth(), controller.model.update);

  // 字段管理
  router.get("/field/list", controller.field.list);
  router.get("/field/detail", controller.field.detail);
  router.post("/field/create", auth(), controller.field.create);
  router.get("/field/delete", auth(), controller.field.delete);
  router.post("/field/update", auth(), controller.field.update);

  // 碎片管理
  router.get("/frag/list", controller.frag.list);
  router.get("/frag/search", controller.frag.search);
  router.get("/frag/detail", controller.frag.detail);
  router.post("/frag/create", auth(), controller.frag.create);
  router.get("/frag/delete", auth(), controller.frag.delete);
  router.post("/frag/update", auth(), controller.frag.update);

  // tag标签管理
  router.get("/tag/list", controller.tag.list);
  router.post("/tag/create", auth(), controller.tag.create);
  router.get("/tag/detail", controller.tag.detail);
  router.get("/tag/has", controller.tag.has);
  router.get("/tag/search", controller.tag.search);
  router.get("/tag/delete", auth(), controller.tag.delete);
  router.post("/tag/update", auth(), controller.tag.update);

  // 友情链接
  router.get("/friendlink/list", controller.friendlink.list);
  router.get("/friendlink/detail", controller.friendlink.detail);
  router.post("/friendlink/create", auth(), controller.friendlink.create);
  router.get("/friendlink/delete", auth(), controller.friendlink.delete);
  router.post("/friendlink/update", auth(), controller.friendlink.update);

  // 留言管理
  router.get("/message/list", controller.message.list);
  router.get("/message/search", controller.message.search);
  router.get("/message/detail", controller.message.detail);
  router.post("/message/create", controller.message.create);
  router.get("/message/delete", auth(), controller.message.delete);
  router.post("/message/update", auth(), controller.message.update);

  // 轮播管理
  router.get("/slide/list", controller.slide.list);
  router.get("/slide/search", controller.slide.search);
  router.get("/slide/detail", controller.slide.detail);
  router.post("/slide/create", auth(), controller.slide.create);
  router.get("/slide/delete", auth(), controller.slide.delete);
  router.post("/slide/update", auth(), controller.slide.update);

  //页面采集
  router.post("/collect/getPages", controller.collect.getPages);
  router.post("/collect/getArticle", controller.collect.getArticle);
  router.get("/collect/list", controller.collect.list);
  router.get("/collect/search", controller.collect.search);
  router.get("/collect/detail", controller.collect.detail);
  router.post("/collect/create", auth(), controller.collect.create);
  router.get("/collect/delete", auth(), controller.collect.delete);
  router.post("/collect/update", auth(), controller.collect.update);

  //接口采集
  router.get("/gather/getArticle", controller.gather.getArticle);
  router.get("/gather/list", controller.gather.list);
  router.get("/gather/search", controller.gather.search);
  router.get("/gather/detail", controller.gather.detail);
  router.post("/gather/create", auth(), controller.gather.create);
  router.get("/gather/delete", auth(), controller.gather.delete);
  router.post("/gather/update", auth(), controller.gather.update);

  //角色管理
  router.get("/sysRole/list", auth(), controller.sysRole.list);
  router.post("/sysRole/create", auth(), controller.sysRole.create);
  router.get("/sysRole/delete", auth(), controller.sysRole.delete);
  router.post("/sysRole/update", auth(), controller.sysRole.update);
  router.get("/sysRole/detail", auth(), controller.sysRole.detail);

  //系统菜单
  router.get("/sysMenu/find", auth(), controller.menu.find);
  router.post("/sysMenu/update", auth(), controller.menu.update);

  //登录日志
  router.post("/loginLog/create", auth(), controller.loginLog.create);
  router.get("/loginLog/delete", auth(), controller.loginLog.delete);
  router.get("/loginLog/list", auth(), controller.loginLog.list);

  router.get("/t/concept", controller.stock.concept);//concept_trends
  router.post("/t/conceptTrends", controller.stock.conceptTrends)
  router.get("/t/conceptQuote", controller.stock.conceptQuote)
  router.get("/t/conceptIndex", controller.stock.conceptIndex)
  router.get("/t/conceptCalendar", controller.stock.conceptCalendar)
  router.get("/c/uplimit", controller.stock.uplimit);
  router.get("/c/v2/uplimit", controller.stock.uplimitv2);
  router.get("/d/todayChance", controller.stock.todayChance);
  router.get("/d/tomorrowFry", controller.stock.tomorrowFry);
  router.get("/d/expectHot", controller.stock.expectHot);
  router.get("/d/themeList", controller.stock.themeList);
  router.get("/d/themeStatistics", controller.stock.themeStatistics);
  router.get("/d/themeStatistics/:code", controller.stock.themeStatistics);
  router.get("/d/themeBaseInfo", controller.stock.themeBaseInfo);
  router.get("/d/themeDetail", controller.stock.themeDetail);
  router.get("/d/themeDetail/:code", controller.stock.themeDetail);
  router.get("/d/themeStockQuote/:code/:pageSize", controller.stock.themeStockQuote);
  router.get("/c/HotStock", controller.stock.clsHotStock);
  router.get("/c/HotNews", controller.stock.clsHotNews);
  router.get("/t/HotStock", controller.stock.thsHotStock);
  router.get("/t/HotNews", controller.stock.thsHotNews);
  router.get("/d/HotNews", controller.stock.dfcfHotNews);
  router.get("/d/HotStock", controller.stock.dfcfHotStock);
  router.get("/d/v2/HotStock", controller.stock.dfcfHotStockV2);
  router.post("/d/HotStockGubaTopic", controller.stock.HotStockGubaTopic);
  router.get("/d/blockfunds", controller.stock.getBlockFund);
  router.get("/d/blockfunds/:bt", controller.stock.getBlockFund);
  router.get("/d/blockfunds/:bt/:po", controller.stock.getBlockFund);
  router.get("/d/recentfunds", controller.stock.getRecentBlockFund);
  router.get("/d/recentfunds/:bc", controller.stock.getRecentBlockFund);

  //router.get("/ip", controller.stock.getCIP);  //HotStockGubaTopic
//涨停揭秘：https://stockextenddata.eastmoney.com/api/stocklist/get?Cd=0.000970%2C0.003020%2C0.002536%2C1.688648%2C1.688141%2C0.300539%2C1.600183%2C0.002158%2C1.600416%2C1.688098%2C0.002203%2C0.300803%2C1.688199%2C1.600255%2C0.002715%2C0.002011%2C1.600580%2C1.600113%2C0.002660%2C1.600737%2C0.000501%2C1.688448%2C1.603373%2C1.600860%2C0.002873%2C1.688519%2C1.603002%2C1.600021%2C1.603158%2C1.603380%2C0.002636%2C1.688775%2C1.605169%2C1.600601%2C1.601519%2C1.601162%2C0.002306%2C1.603601%2C0.003033%2C1.603688%2C0.002879%2C0.003022%2C1.603607%2C1.605196%2C0.002518%2C0.001269%2C1.603222%2C0.002911%2C0.002993%2C0.002364%2C0.002909%2C0.300547%2C1.603153%2C1.601208%2C0.300730%2C0.301526%2C1.600110%2C1.688306%2C0.430476%2C1.600673%2C1.603686%2C0.002951%2C1.600657%2C0.002052%2C1.601609%2C1.600592%2C0.300814%2C0.002939%2C0.000068%2C0.002272%2C1.600076%2C0.002549%2C0.001359%2C1.603757%2C0.002645%2C1.603256%2C1.603025%2C0.002598%2C0.002080%2C0.002298%2C1.603903%2C0.002782%2C0.002551%2C1.603626%2C1.603221%2C1.605588%2C0.301123%2C1.688669%2C0.300870%2C1.603458%2C0.002104%2C0.002225%2C1.688265%2C0.002174%2C1.601696%2C0.002219%2C1.603129%2C0.301291%2C0.002988%2C1.603031%2C0.832225%2C0.002342%2C0.002837%2C1.600711%2C1.603337%2C1.600107%2C0.002173%2C0.002918%2C0.002669%2C0.002418&Fl=0%2C1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C13&v=0774196775690933
//交易日期：https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=RPT_INTSELECTION_DATELIST&columns=TRADE_DATE,IS_NEW&sortTypes=-1&sortColumns=TRADE_DATE&em_timestamp=1755357347128
//竞价涨停：https://quotederivates.eastmoney.com/datacenter/zdtpool?datetype=3&stocktype=2,6,80,23,36&zdt=1&version=100&cver=100
//今天与昨日涨停数据对比：https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=RPT_CUSTOM_INTSELECTION_LIMIT&columns=LIMIT_NUMBERS,NATURAL_LIMIT,DAILY_LIMIT,TOUCH_LIMIT,SEALING_RATE,NATURAL_LIMIT_YES,LIMIT_PER_YES&em_timestamp=1755357900463
//涨停龙头：https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=RPTA_CUSTOM_APP_CONCEPTLIST&em_timestamp=1755357899890
//个股行情：https://push2dycalc.eastmoney.com/api/qt/ulist.np/get?secids=0.002418,0.002669,1.600208,1.600355,1.600421,1.603221,1.605588&fields=f2,f3,f12,f13,f14,f100,f148,f614,f615,f616,f617,f618,f619,f620&fltt=2&invt=3&ut=4c0dff5e0d2c7b149606ca135f8c509f
//涨停伏击：https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=RPT_CUSTOM_INTSELECTION_MONITOR&filter=(IS_QUALITY_GENE%3D%221%22)&pageNumber=1&pageSize=8&sortTypes=-1&sortColumns=ZTJY&em_timestamp=1755357890217
//赚钱效应：https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=RPT_INTSELECTION_LIMITHIS&columns=TRADE_DATE,LIMIT_NUMBERS,NATURAL_LIMIT,DAILY_LIMIT,TOUCH_LIMIT,SEALING_RATE,NATURAL_LIMIT_YES,LIMIT_PER_YES,POSITION_SUGGESTION,MONEYMAKING_EFFECT,SEALING_RATE_YES,LIMIT_DOWN_NUM,CJDT_NUM,DT_FBL&filter=(TRADE_DATE%3C%3D%272025-08-14%27)&pageNumber=1&pageSize=2&sortTypes=-1&sortColumns=TRADE_DATE&em_timestamp=1755357893981
//涨停池：
//连板池：https://datacenter.eastmoney.com/securities/api/data/v1/get?source=SECURITIES&client=APP&reportName=RPT_CUSTOM_INTSELECTION_MONITOR&columns=ALL&filter=(HLIMITEDAYS%3D%221%22)&pageNumber=1&pageSize=8&sortTypes=-1&sortColumns=HLIMITEDAYS&em_timestamp=1755364041793
  router.get('/d/filter', controller.stock.filterStock);
  router.get('/d/industry', controller.stock.getIndustryList);
  router.get('/d/area', controller.stock.getAreaList);
  router.get('/d/styleconcept', controller.stock.getStyleConceptList);

  router.get('/d/tradeDate', controller.stock.getWebTradeDate)
  router.get('/d/tradeDate/:pn', controller.stock.getWebTradeDate)
  router.get('/d/abnormalStock/:date', controller.stock.getAbnormalStockOneDate)
  router.get('/d/abnormalStock', controller.stock.getAbnormalStock)
  router.get('/d/hotmoneyoneday', controller.stock.getHotMoneyOneDayInfo)
  router.get('/d/operatedeptoneday', controller.stock.getOperatedeptOneDayInfo)
  router.get('/d/hotmoneyoneday_stock', controller.stock.getHotMoneyOneDayStock)
  router.get('/d/orgoneday', controller.stock.getOrgOneDayInfo)
  router.get('/d/abnormal_MultiLimitupStock', controller.stock.abnormal_Multi_Limitup_Stock)
  router.get('/d/abnormal_FirstLimitupStock', controller.stock.abnormal_First_Limitup_Stock)
  router.get('/d/abnormal_OperatedeptLimitupStock', controller.stock.abnormal_Operatedept_Limitup_Stock)
  router.get('/d/abnormal/:style', controller.stock.abnormal)
  router.get('/d/udtradedate', controller.stock.limitUpDown_TradeDate)
  router.get('/d/prelimit_behave', controller.stock.prevLimitUpStockBehave);
  router.get('/d/prelimit_behave/:date', controller.stock.prevLimitUpStockBehave);
  router.get('/d/limitCalendar', controller.stock.limitCalendar);
  router.get('/d/limitUpDown/:rc', controller.stock.limitUpDown);
  router.get('/d/limitUpDown_rt/:rc', controller.stock.limitUpDown_realtime);
  router.get('/d/moneyeffect', controller.stock.MoneyMarketEffect);
  router.get('/d/limitUpLeader', controller.stock.limitUpLeader);
  router.get('/d/auctionLimitUp', controller.stock.auctionLimitUp);
  router.get('/d/hightQuality', controller.stock.hightQualityLimitUp);
  router.get('/d/report/:name/', controller.stock.report);
  router.get('/d/report/:name/:bc/', controller.stock.report);
  router.get('/d/report/:name/:bc/:date', controller.stock.report);
  router.get('/d/report/:name/:date', controller.stock.report);

  router.get('/x/xreport', controller.stock.tdxReport);
  router.get('/x/searchstock', controller.stock.tdxSearchStock);
  /**
   * name:报表名称，分别是：ggtzpj（个股投资评级）、hytzpj（行业投资评级）、jztj（价值统计）、cache（行业表）
   * sname:子报表名称，只有在报表名称为 jztj 时才用到，分别是：dpzfj（跌破增发价）、dpjzc（跌破净资产）、ggxgg（高股息个股）、dpfxj（跌破发行价）
   */
  router.get('/x/xreport/:name', controller.stock.tdxReport);
  router.get('/x/xreport/:name/:sname', controller.stock.tdxReport);

  router.get('/d/valuation', controller.stock.dfcfValuation);
  router.get('/d/valuation/:name', controller.stock.dfcfValuation);

  router.get('/d/loadingup', controller.stock.dfcfLoadingup);
  router.get('/d/loadingup/:name', controller.stock.dfcfLoadingup);

  router.get('/d/risk', controller.stock.dfcfRiskList);
  router.get('/d/risk/:name', controller.stock.dfcfRiskList);
  router.get('/d/risklist', controller.stock.dfcfRiskReports);

  //router.post('/voice/fetch', controller.stock.fetchUrl)
  //router.post('/voice/audio', controller.stock.updateVoiceData)
  //配置前缀
  app.use("/api", router);
};
/*
const originalXHR = window.XMLHttpRequest;

// 重写XMLHttpRequest
window.XMLHttpRequest = function () {
  const xhr = new originalXHR();

  const originalOpen = xhr.open;
  xhr.open = function (method, url) {
    this._method = method;
    this._url = url;
    return originalOpen.apply(this, arguments);
  };

  const originalSend = xhr.send;
  xhr.send = function (body) {
    this._requestBody = body;
    return originalSend.apply(this, arguments);
  };

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === 4) {
      console.log('XHR Response:', {
        url: this._url,
        response: JSON.parse(this.response),
        requestBody: this._requestBody
      });
    }
  });

  return xhr;
};*/