const {
  modules: {
    web: {
      service: { common, home },
    }
  },
  helper: {
    utils: { getChildrenId, treeById },
  },
} = Chan;

const axios = require("axios");
const fs = require('fs');
const webUtils = require("../utils/index.js");
const ImageProxy = require('../utils/image-proxy');
// 创建图片代理实例
const imageProxy = new ImageProxy({
  timeout: 15000,
  maxContentLength: 20 * 1024 * 1024, // 20MB
  allowedDomains: process.env.ALLOWED_DOMAINS ? process.env.ALLOWED_DOMAINS.split(',') : null,
  deniedDomains: process.env.DENIED_DOMAINS ? process.env.DENIED_DOMAINS.split(',') : []
});

class HomeController {

  //图片代理，解决https网站下不能访问http网站的图片
  async imgProxy(req, res, next){
    try {
      const { url, format } = req.query;
      // 获取图片流
      const { stream, headers, status } = await imageProxy.getImageStream(url);
      
      // 设置响应头
      res.set({
        'Content-Type': headers['content-type'],
        'Content-Length': headers['content-length'],
        'Cache-Control': headers['cache-control'],
        'ETag': headers['etag'],
        'Last-Modified': headers['last-modified'],
        'X-Image-Source': url,
        'X-Proxy-Server': 'Image-Proxy-API/1.0'
      });
      
      // 如果请求了特定格式，可以在这里转换（需要sharp等库）
      if (format) {
        // 可以使用sharp库进行格式转换
        // const sharp = require('sharp');
        // stream.pipe(sharp().toFormat(format)).pipe(res);
        res.status(501).json({ error: 'Format conversion not implemented' });
        return;
      }
      
      // 将图片流传输到响应
      stream.pipe(res);
      
      // 错误处理
      stream.on('error', (error) => {
        console.error('Stream error:', error.message);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to stream image' });
        }
      });
      
      // 响应结束处理
      res.on('finish', () => {
        console.log(`Successfully proxied image from: ${url}`);
      });
      
    } catch (error) {
      console.error('Proxy error:', error.message);
      
      const statusCode = error.message.includes('not allowed') ? 403 :
                        error.message.includes('Invalid URL') ? 400 :
                        error.message.includes('timeout') ? 504 :
                        error.message.includes('not found') ? 404 :
                        error.message.includes('responded with') ? parseInt(error.message.match(/\d+/)?.[0]) || 502 : 500;
      
      res.status(statusCode).json({
        error: error.message,
        url: req.query.url,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 首页
  async index(req, res, next) {
    try {
      const { nav, template } = req.app.locals;
      const defaultView = webUtils.homeView(nav);
      const data = await home.home();
      res.render(`${template}/${defaultView}`, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // 列表页
  async list(req, res, next) {
    try {
      const { template, category, cate, id, current } =
        webUtils.listGetParams(req);
      if (!id) {
        return await res.render(`${template}/404.html`);
      }
      const data = await home.list(id, current);
      const { pageHtml, view, position } = webUtils.listDataParse({
        id,
        category,
        cate,
        current,
        data,
      });
      await res.render(`${template}/${view}`, {
        position,
        cate,
        pageHtml,
        ...data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // 详情页
  async article(req, res, next) {
    try {
      let { id, template, category } = webUtils.articleGetParams(req);
      if (!id) {
        await res.render(`${template}/404.html`);
        return;
      }
      // 文章列表
      const article = await common.article(id);
      if (!article) {
        await res.render(`${template}/404.html`);
        return;
      }
      // 栏目id
      const cid = article.cid || "";
      let { cate, position, view } = webUtils.articleDataParse({
        article,
        cid,
        category,
      });
      //热门 推荐 图文 上一页 下一页 count
      const data = await home.article({ id, cid });
      await res.render(`${template}/${view}`, {
        ...data,
        cate,
        article,
        position,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // 单页 ，分两种情况，一种单个单页，一个
  async page(req, res, next) {
    try {
      const { cate, id } = req.params;
      const { category, template } = req.app.locals;

      //非法访问
      if (!id && !cate) {
        return res.render(`${template}/404.html`);
      }
      const navSub = cate && getChildrenId(cate, category);
      const initialArticle = id && (await common.article(id));

      //非法访问
      const cid = initialArticle?.cid || navSub?.cate?.id;
      if (!cid) {
        return res.render(`${template}/404.html`);
      }

      const pageData = await home.page(cid);
      let list = pageData?.page?.list || [];

      //404
      if (list.length == 0) {
        return res.render(`${template}/404.html`);
      }
      const article = initialArticle || (await common.article(list[0].id));
      if (!article) {
        return res.render(`${template}/404.html`);
      }

      // 获取非异步的position数据
      const position = treeById(article.cid, category);

      // 更新计数
      common.count({ id: article.id });
      const viewTemplate =
        article.articleView || navSub?.cate?.articleView || "page.html";

      return res.render(`${template}/${viewTemplate}`, {
        ...pageData,
        cate: navSub?.cate,
        position,
        article,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // 搜索页
  async search(req, res, next) {
    try {
      let { current, template, keywords } = webUtils.searchParams(req);
      const data = await home.search({ keywords, current });
      let { pageHtml } = webUtils.searchDataParse({ data, keywords, current });
      await res.render(`${template}/search.html`, {
        keywords,
        ...data,
        pageHtml,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  // tag
  async tag(req, res, next) {
    try {
      let { current, template, path, tag } = webUtils.tagParams(req);
      let data = await home.tag({ path, current });
      let { pageHtml } = webUtils.tagDataParse({ data, current, tag, path })
      await res.render(`${template}/tag.html`, { ...data, path, tag, pageHtml });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  async hotstock(req, res, next) {
    try {
      let { current, template, count } = webUtils.hotStockParams(req);
      let data = {};
      let pageHtml = {};
      await res.render(`${template}/hotstock.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async concept(req, res, next) {
    try {
      let { template } = webUtils.conceptParams(req);
      const path = '';
      const current = 1;
      let data = await home.conceptCalendar({ path, current });
      let pageHtml = {};
      await res.render(`${template}/concept.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async theme(req, res, next) {
    try {
      let { template } = webUtils.themeParams(req);
      let data = await home.theme();
      let pageHtml = {};
      await res.render(`${template}/theme.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async uplimit(req, res, next) {
    try {
      let { template } = webUtils.limitParams(req);
      const data = await home.initTradeDateData();
      let pageHtml = {};
      //const data = { ...calendar, pageHtml };
      await res.render(`${template}/uplimit.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async heatmap(req, res, next) {
    try {
      let { template } = webUtils.heatmapParams(req);
      const data = await home.getConceptFund();
      let pageHtml = {};
      await res.render(`${template}/heatmap.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async fundamental(req, res, next){
    try{
      let { template } = webUtils.fundamentalParams(req);
      const data = await home.getFundamental();
      let pageHtml = {};
      await res.render(`${template}/fundamental.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async valuation(req, res, next){
    try{
      let { template } = webUtils.valuationParams(req);
      const data = await home.getValuation();
      let pageHtml = {};
      await res.render(`${template}/valuation.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async loadingup(req, res, next){
    try{
      let { template } = webUtils.loadingupParams(req);
      const data = await home.getFundFlows();
      let pageHtml = {};
      await res.render(`${template}/loadingup.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
  async risklist(req, res, next){
    try{
      let { template } = webUtils.risklistParams(req);
      const data = await home.getRiskReport();
      let pageHtml = {};
      await res.render(`${template}/risklist.html`, { ...data, pageHtml });
    }
    catch (error) {
      console.error(error);
      next(error);
    }
  }
}

module.exports = HomeController;
