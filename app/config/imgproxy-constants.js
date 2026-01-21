module.exports = {
  // 支持的图片格式
  SUPPORTED_FORMATS: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg', 'bmp'],
  
  // 最大图片大小 (20MB)
  MAX_IMAGE_SIZE: 20 * 1024 * 1024,
  
  // 请求超时时间 (15秒)
  REQUEST_TIMEOUT: 15000,
  
  // 默认缓存时间 (1小时)
  DEFAULT_CACHE_TTL: 3600,
  
  // 用户代理字符串
  USER_AGENT: 'Image-Proxy-API/1.0 (+https://github.com/your-username/image-proxy-api)'
};