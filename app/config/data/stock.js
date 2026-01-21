const config = {
  stock: {
    hotstock: {
      //单页文章列表
      ths: {
        method: "thsHotStock",
        params: { pageSize: 100},
      },
      dfcf: {
        method: "dfcfHotStock",
        params: { pageSize: 100 }
      },
      cls: {
        method: "clsHotStock",
        params: { pageSize: 100 }
      },
    },
    hotnews: {

    },
    concept: {
      calendar: {
        method: "conceptCalendar"
      }
    },
    theme:{
      todayChance: {
        method: "todayChance"
      },
      expectHot: {
        method: "expectHot"
      },
      tomorrowFry: {
        method: "tomorrowFry"
      }
    },
    limitUpDown: {
      /*calendar: {
        method: "limitCalendar"
      },*/
      allTradeDate: {
        method: "allTradeDate"
      },
      MoneyEffect: {//赚钱效应
        method: "MoneyEffect",
        //params: { pn: 1, ps: 1}
      },
      limitUpLeader: {//涨停龙头
        method: "limitUpLeader",
        //params: { pn: 1, ps: 15 }
      },
      auctionLimitUp: {//竞价涨停
        method: "auctionLimitUp",
        //params: { pn: 1, ps: 15 }
      },
      hightQualityLimitUp: {//优质基因
        method: "hightQualityLimitUp",
        //params: { pn: 1, ps: 15 }
      }
    },
    heatMap:{
      conceptBlock:{
        method: 'getConceptFund'
      }
    },
    Fundamental:{
      fundamentData: {
        method: 'getFundamentalData'
      },
      HYData: {
        method: 'getTdxHYData'
      }
    },
    Valuation:{
      stockTTMData: {
        method: 'getStockTTMData'
      }
    },
    Loadingup:{
      FundFlows: {
        method: 'getFundFlows'
      }
    },
    RiskList:{
      Reports: {
        method: 'getRiskReport'
      }
    }
  }
};
module.exports = config;
