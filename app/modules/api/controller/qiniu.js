const fs = require("fs");
const {
  //config: { domain, bucket, secretKey, accessKey },
  modules: {
    api: {
      service: { qiniu, sysApp },
    },
  },
  helper: {
    api: { success, fail },
  },
} = Chan;

class QiniuController {
  // 获取七牛云上传token
  async getUploadToken(req, res, next) {
    try {
      const data = await qiniu.getUploadToken();
      res.json({ ...success, data: data });
    } catch (error) {
      next(error);
    }
  }

  // 服务端直传七牛
  async upload(req, res, next) {
    try {
      const config = await sysApp.find();
      let file = req.file || req.files[0];
      const { originalname, filename, path } = file;
      const uploadResult = await qiniu.upload(file, {
        bucket: config.bucket,
        secretKey: config.secretKey,
        accessKey: config.accessKey,
      });
      const { key = "" } = uploadResult.data;
      
      if (uploadResult.code == 200) {
        fs.unlinkSync(file.path); //删除服务本地文件
        res.json({
          ...success,
          data: {
            path: `//${config.domain}/${key}`,
            domain: config.domain,
            originalname,
            filename,
            link: key,
          },
        });
      } else {
        res.json({ ...fail, data: uploadResult.data });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = QiniuController;
