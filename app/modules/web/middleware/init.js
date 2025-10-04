const {
  config,
  modules: {
    web: {
      service: { home },
    }
  },
  helper: { utils },
} = Chan;

module.exports = () => {
  return async (req, res, next) => {
    try {
      let { env, appName, version } = config;
      if ("site" in req.app.locals && env == "prd") {
        await next();
        return;
      }
      // 站点
      const { site, category, friendlink, frag, tag } = await home.init();
      //导航
      const nav = utils.tree(category);
      req.app.locals = {
        ...req.app.locals,
        appName,
        version,
        site,
        nav,
        category,
        friendlink,
        frag,
        tag,
      };
      await next();
    } catch (error) {
      next(error);
    }
  };
};
