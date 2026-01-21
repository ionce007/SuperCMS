// 状态对话框插件
class StatusDialog {
    constructor(options = {}) {
        this.options = {
            type: 'loading', // loading, success, error, warning, info
            title: '处理中',
            message: '请稍候...',
            autoClose: 0, // 0表示不自动关闭
            showCloseButton: true,
            overlay: true,
            ...options
        };
        
        this.dialog = null;
        this.overlay = null;
        this.closeTimer = null;
        
        this.init();
    }
    
    // 初始化对话框
    init() {
        this.createOverlay();
        this.createDialog();
        this.bindEvents();
        this.show();
        
        // 设置自动关闭
        if (this.options.autoClose > 0) {
            this.setAutoClose(this.options.autoClose);
        }
    }
    
    // 创建遮罩层
    createOverlay() {
        if (!this.options.overlay) return;
        
        this.overlay = document.createElement('div');
        this.overlay.className = 'status-dialog-overlay';
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(this.overlay);
        
        // 触发重绘
        this.overlay.offsetHeight;
        
        // 显示遮罩
        this.overlay.style.opacity = '1';
    }
    
    // 创建对话框
    createDialog() {
        this.dialog = document.createElement('div');
        this.dialog.className = 'status-dialog';
        
        // 根据类型设置图标和颜色
        const { icon, color } = this.getTypeConfig(this.options.type);
        
        this.dialog.innerHTML = `
            <div class="status-dialog-content">
                <div class="status-icon" style="color: ${color};">
                    ${icon}
                </div>
                <div class="status-text">
                    <h3 class="status-title">${this.options.title}</h3>
                    <p class="status-message">${this.options.message}</p>
                </div>
                ${this.options.showCloseButton ? 
                    '<button class="status-close-btn"><i class="fas fa-times"></i></button>' : 
                    ''
                }
                ${this.options.type === 'loading' ? 
                    '<div class="status-progress"></div>' : 
                    ''
                }
            </div>
        `;
        
        // 设置对话框样式
        this.dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            padding: 30px;
            min-width: 300px;
            max-width: 500px;
            z-index: 9999;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        // 添加自定义样式
        this.addStyles();
        
        document.body.appendChild(this.dialog);
        
        // 触发重绘
        this.dialog.offsetHeight;
        
        // 显示对话框
        this.dialog.style.opacity = '1';
        this.dialog.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    
    // 根据类型获取配置
    getTypeConfig(type) {
        const configs = {
            loading: {
                icon: '<i class="fas fa-spinner fa-spin"></i>',
                color: '#3498db'
            },
            success: {
                icon: '<i class="fas fa-check-circle"></i>',
                color: '#2ecc71'
            },
            error: {
                icon: '<i class="fas fa-exclamation-circle"></i>',
                color: '#e74c3c'
            },
            warning: {
                icon: '<i class="fas fa-exclamation-triangle"></i>',
                color: '#f39c12'
            },
            info: {
                icon: '<i class="fas fa-info-circle"></i>',
                color: '#3498db'
            }
        };
        
        return configs[type] || configs.loading;
    }
    
    // 添加自定义样式
    addStyles() {
        // 如果样式已存在，则不重复添加
        if (document.getElementById('status-dialog-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'status-dialog-styles';
        style.textContent = `
            .status-dialog-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .status-icon {
                font-size: 32px;
                margin-bottom: 10px;
            }
            
            .status-text {
                margin-bottom: 10px;
            }
            
            .status-title {
                font-size: 14px;
                color: #2c3e50;
                margin-bottom: 10px;
            }
            
            .status-message {
                font-size: 12px;
                color: #7f8c8d;
                line-height: 1.5;
            }
            
            .status-close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 14px;
                color: #bdc3c7;
                cursor: pointer;
                padding: 5px;
                transition: color 0.3s;
            }
            
            .status-close-btn:hover {
                color: #7f8c8d;
            }
            
            .status-progress {
                width: 100%;
                height: 4px;
                background: #ecf0f1;
                border-radius: 2px;
                margin-top: 20px;
                overflow: hidden;
            }
            
            .status-progress::after {
                content: '';
                display: block;
                height: 100%;
                width: 30%;
                background: #3498db;
                border-radius: 2px;
                animation: status-progress 1.5s ease-in-out infinite;
            }
            
            @keyframes status-progress {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(350%);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // 绑定事件
    bindEvents() {
        // 关闭按钮事件
        const closeBtn = this.dialog.querySelector('.status-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
        
        // 点击遮罩关闭（如果启用）
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                if (this.options.type !== 'loading') {
                    this.hide();
                }
            });
        }
        
        // 窗口大小变化时重新居中
        window.addEventListener('resize', () => this.centerDialog());
    }
    
    // 居中对话框
    centerDialog() {
        if (!this.dialog) return;
        
        this.dialog.style.left = '50%';
        this.dialog.style.top = '50%';
        this.dialog.style.transform = 'translate(-50%, -50%)';
    }
    
    // 显示对话框
    show() {
        if (this.dialog) {
            this.dialog.style.display = 'block';
        }
    }
    
    // 隐藏对话框
    hide() {
        if (this.closeTimer) {
            clearTimeout(this.closeTimer);
        }
        
        // 隐藏对话框
        if (this.dialog) {
            this.dialog.style.opacity = '0';
            this.dialog.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                if (this.dialog && this.dialog.parentNode) {
                    this.dialog.parentNode.removeChild(this.dialog);
                    this.dialog = null;
                }
            }, 300);
        }
        
        // 隐藏遮罩
        if (this.overlay) {
            this.overlay.style.opacity = '0';
            
            setTimeout(() => {
                if (this.overlay && this.overlay.parentNode) {
                    this.overlay.parentNode.removeChild(this.overlay);
                    this.overlay = null;
                }
            }, 300);
        }
    }
    
    // 设置自动关闭
    setAutoClose(seconds) {
        this.closeTimer = setTimeout(() => {
            this.hide();
        }, seconds * 1000);
    }
    
    // 更新对话框内容
    update(options) {
        this.options = { ...this.options, ...options };
        
        if (!this.dialog) return;
        
        const { icon, color } = this.getTypeConfig(this.options.type);
        
        // 更新图标
        const iconEl = this.dialog.querySelector('.status-icon');
        if (iconEl) {
            iconEl.innerHTML = icon;
            iconEl.style.color = color;
        }
        
        // 更新标题
        const titleEl = this.dialog.querySelector('.status-title');
        if (titleEl) {
            titleEl.textContent = this.options.title;
        }
        
        // 更新消息
        const messageEl = this.dialog.querySelector('.status-message');
        if (messageEl) {
            messageEl.textContent = this.options.message;
        }
        
        // 更新进度条
        const progressEl = this.dialog.querySelector('.status-progress');
        if (progressEl) {
            if (this.options.type === 'loading' && !progressEl) {
                this.dialog.querySelector('.status-dialog-content').innerHTML += '<div class="status-progress"></div>';
            } else if (this.options.type !== 'loading' && progressEl) {
                progressEl.remove();
            }
        }
    }
    
    // 静态方法：显示对话框
    static show(options) {
        // 如果已有对话框，先关闭
        if (StatusDialog.currentInstance) {
            StatusDialog.currentInstance.hide();
        }
        
        StatusDialog.currentInstance = new StatusDialog(options);
        return StatusDialog.currentInstance;
    }
    
    // 静态方法：隐藏当前对话框
    static hide() {
        if (StatusDialog.currentInstance) {
            StatusDialog.currentInstance.hide();
            StatusDialog.currentInstance = null;
        }
    }
    
    // 静态方法：显示加载对话框
    static showLoading(message = '正在加载...', title = '请稍候') {
        return StatusDialog.show({
            type: 'loading',
            title: title,
            message: message,
            autoClose: 0
        });
    }
    
    // 静态方法：显示成功对话框
    static showSuccess(message = '操作成功！', title = '成功', autoClose = 3) {
        return StatusDialog.show({
            type: 'success',
            title: title,
            message: message,
            autoClose: autoClose
        });
    }
    
    // 静态方法：显示错误对话框
    static showError(message = '操作失败！', title = '错误', autoClose = 5) {
        return StatusDialog.show({
            type: 'error',
            title: title,
            message: message,
            autoClose: autoClose
        });
    }
    
    // 静态方法：模拟数据加载过程
    static simulateDataLoad(loadingMessage = '正在加载数据...', successMessage = '数据加载成功！') {
        StatusDialog.showLoading(loadingMessage);
        
        // 模拟异步加载
        return new Promise(resolve => {
            setTimeout(() => {
                StatusDialog.showSuccess(successMessage);
                resolve();
            }, 2000);
        });
    }
}

// 保存当前实例
StatusDialog.currentInstance = null;