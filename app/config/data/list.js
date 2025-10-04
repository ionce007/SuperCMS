const config = {
  list: {
    //当前栏目列表数据
    articleList: {
      method: "list",
      params: { pageSize: 10 },
    },
    //当前栏目推荐数据
    recommend: {
      method: "getArticleListByCid",
      params: { len: 5, attr: ["2"] },
      show: true,
    },
    //当前栏目热门数据
    hot: {
      method: "getArticlePvList",
      params: { len: 10 },
      field: ["id", "title", "path"],
      show: true,
    },
    //当前栏目图文
    imgs: {
      method: "getNewImgList",
      params: { len: 5 },
      show: true,
    },
  },
};

module.exports = config;
