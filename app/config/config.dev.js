const dotEnv = require('dotenv');
const base = require("./config.base.js");
const data = require("./data/index.js");
const config = { ...base, ...data };

//mysql配置
dotEnv.config();
config.db = [
  {
    client: "mysql2",
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    debug: false,
  },
];

//web端口
config.port = "9081";

//模板静态资源
config.static = [
  ...base.static,
];

// jwt 配置
config.token = {
  KEY: "SuperCMS",
  TIME: "1d",
  REFRESH: false, //是否开启刷新token
};

// bcrypt 加盐
config.secretcms = {
  key: 10,
};

//cors
config.cors = {
  origin: "*", //或者['http://localhost:8080', 'http://localhost:8081']
};

//多个views
config.views = []; //path.join(config.appRoot, `modules/web/view`)

// 模板缓存 dev 环境不缓存 prod 环境缓存
config.env = "dev";

config.logger = {
  level: "dev",
};

//测试配置模板数据

config.data.home.test = {
    method: "query",
    params: {
      table:"cms_article",
      current: 1,
      pageSize: 10,
      query:{
        title:'山水'
      },
      needCount: false,
      field: ["id", "title"],
    },
    show: true,
}

module.exports = config;
