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

const webUtils = require("../utils/index.js");


class HomeController {
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
      //let data = await home.hotstock({ current, count });
      //let { pageHtml } = webUtils.hotstockDataParse({ data, current })
      //console.log('hotstock->data = ', data);
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
}

module.exports = HomeController;
