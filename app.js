//const Chanjs = require("chanjs");
import Chanjs from 'chanjs';
const chan = new Chanjs();
//global.voiceData = getVoiceData();
console.log('Chan.config.static = ', chan.config.static);
Chan.config.static.forEach(item => {
  console.log('Chan.config.static->item = ', item);
  if(typeof(item.dir) === 'object'){
    item.dir.forEach(x=>{
      console.log('item.dir->x = ', x);
    })
  }
});
chan.start();
chan.run((port) => {
  console.log(`SuperCMS 运行于 ${port} 端口，可访问： http://localhost:${port}`);
});

export default chan;
/*function getVoiceData(){
  const path = require('path');
  const voicePath = path.join(process.cwd(), 'voice');
  const dataFile = `${voicePath}\\pageData.json`
  const fs = require('fs');
  const data = fs.readFileSync(dataFile, 'utf8');
  const jsonData = JSON.parse(data);
  return jsonData;
}*/