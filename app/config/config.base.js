const path = require("path");

const ROOT_PATH = process.cwd();
const APP_PATH = path.join(ROOT_PATH, "app");
const config = {};
config.appRoot = APP_PATH;
config.appName = "SuperCMS";
config.port = "81";
config.version = "v3.0.14";
config.versionTime = "2025-02-11";
config.authorEmail = "ionce@163.com";
config.authorWechat = "ioncehuang";
config.JSON_LIMIT = "1024kb";

config.static = [
  {
    prefix: "/public/",
    dir: "app/public",
    maxAge: 0,
  },
  {
    prefix: "/web/default/", // /模块名称/模板名称
    dir: "app/modules/web/view/default/static",
    maxAge: 0,
  },
];

config.modules = ["api", "common", "web"];
config.plugins = ["plus-wechat"];

module.exports = config;
