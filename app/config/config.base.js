const path = require("path");

const ROOT_PATH = process.cwd();
const APP_PATH = path.join(ROOT_PATH, "app");
const config = {};
config.appRoot = APP_PATH;
config.appName = "SuperCMS";
config.port = "9081";
config.version = "v26.01.20";
config.versionTime = "2026-01-20";
config.authorEmail = "ionce@163.com";
config.authorWechat = "-ionce";
config.JSON_LIMIT = "10240kb";

const static = [
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
config.static = static;
console.log('config.static = ', config.static);
config.modules = ["api", "common", "web"];
config.plugins = ["plus-wechat"];

module.exports = config;
