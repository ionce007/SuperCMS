const init = require("./middleware/init.js");
const adapter = require("./middleware/adapter.js");
const safe = require("express-safe");
module.exports = (opt) => {
  const {
    router,
    modules: {
      web: { controller },
    },
    app,
  } = opt;

  router.use(adapter());
  router.use(safe());
  router.use(init(app));

  // 首页模板
  router.get("/", controller.home.index);

  // 分类
  router.get(
    [
      "/list/:cid", //兼容old
      "/:cate/index.html",
      "/:cate/index:current.html",
      "/:cate1/:cate/index.html",
      "/:cate1/:cate/index:current.html",
      "/:cate2/:cate1/:cate/index.html",
      "/:cate2/:cate1/:cate/index:current.html",
      "/:cate3/:cate2/:cate1/:cate/index.html",
      "/:cate3/:cate2/:cate1/:cate/index:current.html",
    ],
    controller.home.list
  );

  // 文章页
  router.get(
    [
      "/article/:id", //兼容old
      "/article/:id.html", //兼容old
      "/article-:id.html",
      "/:cate/article-:id.html",
      "/:cate1/:cate/article-:id.html",
      "/:cate2/:cate1/:cate/article-:id.html",
      "/:cate2/:cate1/:cate/article-:id.html",
      "/:cate3/:cate2/:cate1/:cate/article-:id.html",
    ],
    controller.home.article
  );

  // 单页栏目
  router.get(
    [
      "/page/:id", //兼容old
      "/page/:id.html", //兼容old
      "/page-:id.html",
      "/:cate/page.html",
      "/:cate1/:cate/page.html",
      "/:cate2/:cate1/:cate/page.html",
      "/:cate3/:cate2/:cate1/:cate/page.html",
      "/:cate/page-:id.html",
      "/:cate1/:cate/page-:id.html",
      "/:cate2/:cate1/:cate/page-:id.html",
      "/:cate2/:cate1/:cate/page-:id.html",
      "/:cate3/:cate2/:cate1/:cate/page-:id.html",
    ],
    controller.home.page
  );

  // 搜索页
  router.get(
    ["/search/:keywords/words.html", "/search/:keywords/words:current.html"],
    controller.home.search
  );

  // tag列表页
  router.get(
    ["/tags/:path/tag.html","/tags/:path/tag:current.html"],
    controller.home.tag
  );

  //数据集锦
  router.get(
    ["/datus/hotstock.html"],
    controller.home.hotstock
  );
  router.get(
    ["/datus/concept.html"],
    controller.home.concept
  );
  router.get(
    ["/datus/theme.html"],
    controller.home.theme
  );
  router.get(
    ["/datus/uplimit.html"],
    controller.home.uplimit
  );
  //使用路由
  app.use(router);
};
