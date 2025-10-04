# SuperCMS内容管理系统

SuperCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。

## 🌈系统特色

* 自研。基于自研chanjs轻量级mvc框架实现，轻量、灵活、稳定、高性能、可持续。
* SEO。专注于`seo`,伪静态`html`和拼音导航，灵活设置关键词和描述。
* 安全。基于`knex`,高防`sql`注入，接口权限校验，为安全提供保障。
* 灵活。JSON配置按需生成页面模板数据。碎片功能，支持零碎文案配置，方便各类灵活文案配置。
* 高扩展。支持扩展模型，字段配置，可动态生成表，超强扩展。
* 模块化。一切模块相互独立，互不干扰。
* 插件化。灵活开发，支持完整功能模块。
* 无头cms，为多端（微信，app，小程序，h5）提供接口支持。

## 🚧功能介绍

* 网站信息
* 站点管理
* 栏目管理
* 文章模块
* 标签管理
* 碎片管理 (广告，碎片文案，公司地址、电话、名称，微信等万能模块)
* 扩展模型
* 文章采集
* 用户管理
* 菜单管理
* 登录日志
* 在线留言
* 中英切换
* 语音播报
* pdf预览（按需加载）
* 本地上传&七牛云上传
* 日志功能

## ⛱️软件架构

* nodejs v20.16.0+
* express 4.18+
* mysql v5.7.26
* knex (sql操作)
* art-tempate v4.13.2+
* pm2   v5.2.2
* jwt  
* pm2 (prd)
* nodemon (dev)
  
### 项目架构

```JavaScript
|- data
|- app
    |- config
    |- extend 
    |- middleware 
    |- modules
      |-api 后台api
        |-- controller
        |-- service
        |-- middleware(可选)
        |-- router.js
      |-home 模板渲染
        |-- controller
        |-- middleware(可选)
        |-- service
        |-- view
        |-- router.js
      |-common 通用api，提供给h5 app 小程序等调用
        |-- controller
        |-- middleware(可选)
        |-- service
        |-- view
        |-- router.js
    |- plugins 
        |- plus-pdf 插件——pdf按需加载
          |-- controller
          |-- service(可选)
          |-- middleware(可选)
          |-- router.js
        |- plus-wechat 插件——微信小程序登录
          |-- controller
          |-- service(可选)
          |-- middleware(可选)
          |-- router.js
        ***  
    |- public
    |- utils
    |- router.js
  app.js
  ```

* **注:SuperCMS自带基于vue3+element-plus+js研发的后台管理界面,如果不满足你编码风格，如native等其它UI，或热衷于如react + antd + TS技术，可以自行调用接口进行二次开发**
* **后台管理ChanAdmin源码以及接口参考 [https://gitee.com/yanyutao0402/ChanAdmin](https://gitee.com/yanyutao0402/ChanAdmin)**

### 🍅️案例

* 案例一   [香港日报](http://www.hongkongdaily.net/)
* 案例二   [国际健康健美长寿论坛](http://www.internationjms.cn/)
* 案例三   [世界大健康运动联盟](http://www.worldhealthgames.com/)
* 案例四   [世界气功网](http://www.shijieqigong.com/)
* 案例五   [诺德房产](https://www.nuodefangchan.com/)
* 案例六   [蝌蚪云](https://kd-yun.top/)
* 案例七   [昂翊信息](http://www.angyi-iot.com/)
* 案例八   [萌狮换电](http://www.51mshd.com/)
* 案例九   [七弈国象](https://doc.7yi.link/)
* 案例十   [历史人物网](https://ancestries.cn/)
* 案例十一 [同宇宙官网](http://www.zdmedia.com.cn:81/)
* 案例十二 [HANSA中国](http://www.hansa-asia.com/)
* 案例十三 [北京智慧城市供需对接平台](https://gongxudj.com/#/headerNav/newHome)
* 案例十四 [精通有道IT技术团队官网](http://www.wmjtyd.net/)
* 案例十五 [北京辉达环保科技有限公司](http://www.huidaep.com/)
<!-- * 案例十   [超前端](https://zoye.top/) -->

* 演示站1  [雅俗共赏](http://www.cqsmservices.cn/)

## 👵开发文档

* **官网:<https://cms.foryet.com>**
* **官网文档 <https://cms.foryet.com/docs/index.html>**
* **视频教程：<https://space.bilibili.com/1885628820>**

## ❤️项目关注

* **码云：<https://gitee.com/yanyutao0402/chanyue-cms>**

## 👴项目交流

 如果喜欢我们的项目，请点个 Star。
 微信群交流请联系微信: `yanyutao2014` 🧒 👧 👱  🧔 👴,纯技术交流，广告党勿扰，谢谢合作！！！

## 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

## 警告

* 禁止用于任何非法商业用途或其他任何违法或不道德的行为。
* 不当使用本项目中的代码或资源而导致的任何直接或间接损失，项目维护者及贡献者概不负责。
* 请尊重法律和道德规范，合理合法地使用本项目的资源。
* 任何违反上述规定的行为都将受到法律追究。

## 管理后台部分截图

![登录](https://pic.imgdb.cn/item/6749e83fd0e0a243d4db4f12.jpg)
![board](https://pic.imgdb.cn/item/6749e83fd0e0a243d4db4f11.jpg)
![category](https://pic.imgdb.cn/item/6749e83fd0e0a243d4db4f10.jpg)
![article](https://pic.imgdb.cn/item/6749e83fd0e0a243d4db4f13.jpg)
