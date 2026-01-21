// utils/imageProxy.js
class ImageProxy {
    constructor(config = {}) {
        const url = new URL(location.href);
        this.proxyUrl = config.proxyUrl || `${url.protocol}//${url.host}/img/proxy`;   //'https://a285abe48852.ngrok-free.app/proxy';
        this.allowedDomains = config.allowedDomains || ['img.foryet.com','www.people.com.cn'];
    }
    
    // 生成代理URL
    getProxyUrl(originalUrl) {
        try {
            if(originalUrl.startsWith('//')) originalUrl = 'http:' + originalUrl;
            const url = new URL(originalUrl);
            const host = new URL(location.href).hostname;
            // 检查是否已经在使用HTTPS或已经是代理URL
            if (url.protocol === 'https:' || url.hostname === host) {
                return originalUrl;
            }
            
            // 验证域名
            if (!this.allowedDomains.includes(url.hostname)) {
                console.warn(`不支持的图片域名: ${url.hostname}`);
                return originalUrl;
            }
            
            // 返回代理URL
            return `${this.proxyUrl}?url=${originalUrl}`;
            
        } catch (error) {
            console.error('URL解析错误:', error);
            return originalUrl;
        }
    }
    
    // 批量转换页面中的图片
    convertPageImages() {
        if(location.href.startsWith('http://')) return;
        const imgCount = document.querySelectorAll('img').length;
        const reloadCount = document.querySelectorAll("img[data-label = 'proxy']").length;
        if(reloadCount >= imgCount) return;
        document.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && (src.startsWith('http://') || src.startsWith('//img.foryet.com') )) {
                img.setAttribute('data-original-src', src);
                img.setAttribute('data-label', 'proxy');
                img.src = this.getProxyUrl(src);
                // 添加错误处理
                /*img.onerror = () => {
                    console.error(`图片加载失败: ${src}`);
                    // 可以显示占位符
                    img.src = '/public/cover/placeholder.jpg';
                };*/
            }
        });
    }
    convertContainerImages(container) {
        if(location.href.startsWith('http://')) return;
        const imgCount = container.querySelectorAll('img').length;
        const reloadCount = container.querySelectorAll("img[data-label = 'proxy']").length;
        if(reloadCount >= imgCount) return;
        container.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && (src.startsWith('http://') || src.startsWith('//img.foryet.com') )) {
                img.setAttribute('data-original-src', src);
                img.setAttribute('data-label', 'proxy');
                img.src = this.getProxyUrl(src);
            }
        });
    }
    // 动态加载图片
    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = this.getProxyUrl(url);
            img.onload = () => resolve(img);
            img.onerror = reject;
        });
    }
}

// 使用示例
const imageProxy = new ImageProxy();
imageProxy.convertPageImages();