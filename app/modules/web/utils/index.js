const {
  helper: {
    utils: { pages, getChildrenId, treeById, filterFields, htmlDecode },
  },
  config,
} = Chan;

/**
 * @description 根据导航栏目获取首页视图文件
 * @param {*} nav 导航栏目
 */
exports.homeView = (nav) => {
  let view = "index.html";
  if (
    Array.isArray(nav) &&
    nav.length > 0 &&
    nav[0].pinyin == "home" &&
    nav[0].listView
  ) {
    view = nav[0].listView;
  }
  return view;
};

/**
 * @description 获取列表页参数
 * @param {*} req
 * @returns {object}
 */
exports.listGetParams = (req) => {
  const { template, category } = req.app.locals;

  const { cate = "", cid } = req.params;
  const current = parseInt(req.params.current, 10) || 1;
  // 当前栏目和当前栏目下所有子导航
  const navSub = getChildrenId(cate || cid, category);
  const _cate = navSub?.cate || {};
  const id = cid || _cate.id;
  return { template, category, cate: _cate, id, current };
};

/**
 * @description 列表页数据解析
 * @param {*} param0
 * @returns {object}
 */
exports.listDataParse = ({ id, category, cate, current, data }) => {
  let position = treeById(id, category).filter((item) => item); // 确保过滤掉可能的空值
  const positionField = ["id", "name", "path"];
  position = filterFields(position, positionField);

  const count = data.articleList.count;

  let pageHtml = "";
  if (position.length > 0) {
    const lastPath = position[position.length - 1].path; // 提前存储最后一个元素的路径
    const href = `${lastPath}/index`;
    pageHtml = pages(
      current,
      count,
      config?.data?.list?.articleList?.params?.pageSize || 10,
      href
    );
  }
  // 获取模板
  const view = cate?.listView || "list.html";
  return { pageHtml, view, position };
};

exports.articleGetParams = (req) => {
  const { template, category } = req.app.locals;
  let { id } = req.params;
  if (id.includes(".html")) {
    id = id.replace(".html", "");
  }
  return { id, template, category };
};

exports.articleDataParse = ({ article, cid, category }) => {
  article.content = htmlDecode(article.content);
  // 扩展字段
  Object.getOwnPropertyNames(article.field).forEach(function (key) {
    if (
      typeof article.field[key] == "string" &&
      article.field[key].includes("{")
    ) {
      article.field[key] = JSON.parse(article.field[key]);
    }
  });
  // 当前栏目和当前栏目下所有子导航
  const navSub = getChildrenId(cid, category);
  let cate = navSub?.cate || {};
  // 当前位置
  const position = treeById(cid, category);
  //获取模板
  let view = article.articleView || cate.articleView;
  return { article, cate, position, view };
};

exports.searchParams = (req) => {
  const { template } = req.app.locals;
  const { keywords, current = 1 } = req.params;
  let key = keywords.slice(0, 10);
  return { current: +current, template, keywords: key };
};

exports.searchDataParse = ({ data, keywords, current }) => {
  // 分页
  let { count = 0, list = [] } = data.search;
  let href = `/search/${keywords}/words`;

  let pageHtml = pages(
    current,
    count,
    config?.data?.search?.search?.params?.pageSize || 10,
    href
  );

  list.forEach((ele) => {
    ele.titles = ele.title.replace(
      new RegExp(keywords, "gi"),
      `<span class='c-red'>${keywords}</span>`
    );
  });

  return { list, pageHtml };
};

exports.tagParams = (req) => {
  const { template } = req.app.locals;
  const { path, current = 1 } = req.params;
  const { tag } = req.query;
  return { current: +current, template, path, tag };
};

exports.tagDataParse = ({ data, current, tag, path }) => {
  //分页
  let { count } = data.tags;
  let href = `/tags/${path}/tag`;
  let query = `?tag=${tag}`;
  let pageHtml = pages(
    current,
    count,
    config?.data?.tag?.tags?.params?.pageSize || 10,
    href,
    query
  );
  return { pageHtml };
};

exports.hotStockParams = (req) => {
  const { template } = req.app.locals;
  const { current = 1 } = req.params;
  return { current: +current, template };
};
exports.conceptParams = (req) => {
  const { template } = req.app.locals;
  return { template };
};
exports.themeParams = (req) => {
  const { template } = req.app.locals;
  return { template };
};
exports.limitParams = (req) => {
  const { template } = req.app.locals;
  return { template };
};
exports.hotstockDataParse = ({ data, current }) => {
  //分页
  //let { count = 1 } = data.hotstock;
  let count = 1;
  let href = `/datus/hotstock`;
  let query = ``;
  let pageHtml = pages(
    current,
    count,
    config?.data?.hotstock?.hotstocks?.params?.pageSize || 100,
    href,
    query
  );
  return { pageHtml };
};