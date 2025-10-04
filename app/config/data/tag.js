const config = {
  tag: {
    //单页文章列表
    tags: {
      method: "tags",
      params: { pageSize: 10},
    },
    alltag: {
      method: "tag",
      params: {
        pageSize: 10,
      },
      show: true,
    },
  },
};
module.exports = config;
