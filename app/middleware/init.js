const Chan = require("chanjs");
const {
  modules: {
    api: {
      service: { sysApp },
    },
  },
  config:{ template, env}
} = Chan;

module.exports = (app) => {
  return async (req, res, next) => {
    try {
      if ("domain" in req.app.locals && env == "prd") {
        await next();
        return;
      }
      let sysConfig = await sysApp.find();
      let _template = sysConfig.template || template;
      const static_url = `/web/${_template}`;
      Chan.config.template = _template;
      
      //配置模板静态资源和模板文件夹同级
      app?.plus?.setStatic({
        prefix:`/web/${_template}`, // /模块名称/模板名称
        dir: `app/modules/web/view/${_template}/static`,
        maxAge: 0,
      });

      req.app.locals = {
        template: _template,
        domain:sysConfig.domain,
        static_url,
      };
      await next();
    } catch (error) {
      next(error);
    }
  };
};
