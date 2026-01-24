const config = {
  home: {
    // banner
    banner: { method: "bannerSlide", show: true },
    // 轮播图
    slide: {
      method: "getArticleList",
      params: {
        start: 0,
        len: 1,
        attr: ["3"],
      },
      field: ["id", "title", "path", "link", "img"],
      show: true,
    },
    // 头条
    top: {
      method: "getArticleList",
      params: {
        start: 0,
        len: 1,
        attr: ["1"],
        type: 1, //1->一条数据，返回对象。2返回数组
      },
      field: ["id", "title", "path", "description", "img"],
      show: true,
    },
    // 最新
    news: {
      method: "getArticleList",
      params: {
        start: 0,
        len: 7,
        excludeAttr: ["1"], // 排除 attr 为 1 的记录
      },
      field: ["id", "title", "path", "createdAt"],
      show: true,
    },
    //栏目文章
    article: {
      method: "getArticleListByCids",
      params: {
        cid: [],
        lenLen: 5,
        toplen: 1,
        attr: ["1", "2"],
      },
      show: true,
    },
    //图片
    imgs: {
      method: "getNewImgList",
      params: { len: 8 },
      field: ["id", "title", "path", "img"],
      show: true,
    },
    //推荐
    recommend: {
      method: "getArticleList",
      params: {
        start: 0,
        len: 10,
        attr: ["2"],
      },
      show: true,
    },
    //热门
    hot: { method: "getArticlePvList", show: true },
    //推荐图片
    recommendImgs: {
      method: "getNewImgList",
      params: { len: 10, id: "", attr: ["2"] },
      field: ["id", "title", "path", "img", "description"],
      show: true,
    },
    //友情链接
    friendlink: {
      method: "friendLink",
      params: {
        pageSize: 10,
      },
      show: true,
    },
    tag: {
      method: "tag",
      params: {
        pageSize: 10,
      },
      show: true,
    },
    hotstock: {
      method: "hotstock",
      params: {
        pageSize: 100,
      },
      show: false,
    },
    concept: {
      method: "conceptCalendar",
      params: {
        pageSize: 100,
      },
      show: true,
    }
  },
};

module.exports = config;
