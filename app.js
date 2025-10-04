
const Chanjs = require("chanjs");
const chan = new Chanjs();
chan.start();
chan.run((port) => {
  console.log(`SuperCMS 运行于 ${port} 端口，可访问： http://localhost:${port}`);
});
