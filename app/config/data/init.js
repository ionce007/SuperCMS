const config = {
  init: {
    //站点信息
    site: { method: "site" },
    // 导航
    category: {
      method: "category",
    },
    //友情链接
    friendlink: {
      method: "friendLink",
      params: {
        pageSize: 10,
      },
    },
    //标签
    frag: {
      method: "frag",
      params: {
        pageSize: 10,
      },
    },
    //tag
    tag: {
      method: "tag",
      params: {
        pageSize: 10,
      },
    },
  },
};

module.exports = config;
