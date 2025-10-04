const config = {
  article: {
    //当前栏目最新
    news: {
      method: "getArticleListByCid",
      params: { len: 10 },
    },
    //当前栏目热门
    hot: {
      method: "getArticlePvList",
      params: { len: 10 },
      field: ["id", "title", "path"],
    },
    //当前栏目图文
    imgs: {
      method: "getNewImgList",
      params: { len: 5 },
    },
    tags: {
      method:"fetchTagsByArticleId",
      params: { len: 5 },
    },
    count: {
      method: "count",
    },
    pre: {
      method: "prev",
    },
    next: {
      method: "next",
    },
  },
};

module.exports = config;
