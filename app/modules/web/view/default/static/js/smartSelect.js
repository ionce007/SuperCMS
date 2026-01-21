
// 插件类
// 自定义下拉框插件 - 完全修复版
const SmartSelect = (function() {
    const STYLES = `.custom-select-wrapper {
            position: relative;
            width: 100%;
        }
        
        .custom-select-trigger {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 6px;
            background-color: transparent;
            border: 1px solid #ddd;
            border-radius: 8px;
            cursor: pointer;
            transition: border-color 0.3s, box-shadow 0.3s;
            font-size: 16px;
            color: #333;
            min-height: 40px;
        }
        
        .custom-select-trigger:hover {
            border-color: #3498db;
        }
        
        .custom-select-trigger.active {
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .custom-select-trigger .placeholder {
            color: #999;
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .custom-select-trigger .search-input-container {
            flex-grow: 1;
            display: none;
        }
        
        .custom-select-trigger.active.search-mode .search-input-container {
            display: block;
        }
        
        .custom-select-trigger.active.search-mode .placeholder {
            display: none;
        }
        
        .custom-select-trigger .search-input {
            width: 100%;
            padding: 4px 0;
            border: none;
            background: transparent;
            font-size: 16px;
            color: #333;
        }
        
        .custom-select-trigger .search-input:focus {
            outline: none;
        }
        
        .custom-select-trigger .search-input::placeholder {
            color: #aaa;
        }
        
        .custom-select-trigger .arrow {
            transition: transform 0.3s;
            color: #7f8c8d;
            flex-shrink: 0;
            margin-left: 8px;
        }
        
        .custom-select-trigger.active .arrow {
            transform: rotate(180deg);
        }
        
        .custom-select-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            max-height: 400px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            margin-top: 2px;
        }
        
        .custom-select-dropdown.active {
            display: block;
        }
        
        .custom-select-search {
            padding: 12px 16px;
            border-bottom: 1px solid #eee;
            display: none;
        }
        
        .custom-select-search.active {
            display: block;
        }
        
        .custom-select-search input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .custom-select-search input:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .custom-select-options {
            padding: 0;
            max-height: 350px;
            overflow-y: auto;
        }
        
        .custom-select-option {
            padding: 10px 5px;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
        }
        
        .custom-select-option:hover {
            background-color: #f5f9ff;
        }
        
        .custom-select-option.selected {
            background-color: #e8f4fc;
            color: #3498db;
            font-weight: 500;
        }
        
        .custom-select-option .checkmark {
            margin-right: 10px;
            color: #3498db;
            opacity: 0;
            flex-shrink: 0;
            width: 20px;
            text-align: center;
        }
        
        .custom-select-option.selected .checkmark {
            opacity: 1;
        }
        
        .custom-select-option .option-text {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .no-results {
            padding: 20px;
            text-align: center;
            color: #999;
            font-style: italic;
        }
        
        .loading-indicator {
            padding: 20px;
            text-align: center;
            color: #7f8c8d;
        }
        
        .loading-indicator::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 10px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .selected-item-display {
            font-weight: 500;
            color: #2c3e50;
        }
        
        .clear-button {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 18px;
            padding: 0 4px;
            display: none;
            margin-right: 8px;
        }
        
        .clear-button:hover {
            color: #e74c3c;
        }
        
        .custom-select-trigger.has-selection .clear-button {
            display: block;
        }

        /* 流式表格容器：核心修改-添加横向滚动，保证列不折行 */
        .flow-table {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            /* 关键：横向滚动，窄屏时可滑动查看所有列 */
            overflow-x: auto;
            /* 优化滚动体验 */
            scrollbar-width: thin;
        }

        /* 表格行：核心修改-固定列数，列宽自适应均分（不折行） */
        .table-row {
            display: grid;
            /* 关键：5列（与表头/数据列数一致），每列宽度自适应均分，最小宽度0避免挤压 */
            grid-template-columns: repeat(5, minmax(0, 1fr));
            border-bottom: 1px solid #eee;
            /* 确保行宽与容器一致，不被滚动截断 */
            width: 100%;
            min-width: fit-content;
        }
        .table-row.selected{color:#ff0000;}
        /* 表头行样式 */
        .table-header {
            background-color: #d5dee7;
            color: #161515;
            font-weight: bold;
            /* 表头随滚动固定（可选优化） */
            position: sticky;
            top: 0;
        }

        /* 表格单元格样式：保证内容不折行 */
        .table-cell {
            padding: 16px;
            text-align: center;
            border-right: 1px solid #eee;
            /* 核心：强制单元格内容不折行 */
            white-space: nowrap;
            /* 内容超长时显示省略号（可选，避免内容溢出） */
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .table-row .table-cell:last-child {
            border-right: none;
        }

        .table-body .table-row:hover {
            background-color: #f8f9fa;
        }

        /* 移动端适配：仅调整内边距，列仍保持一行 */
        @media (max-width: 768px) {
            .table-cell {
                padding: 12px 8px;
                font-size: 14px;
            }
        }

        /* 超小屏：仅优化字体，列仍不折行（靠横向滚动查看） */
        @media (max-width: 480px) {
            .table-cell {
                font-size: 13px;
            }
        }
        /* 以下是增加card方式时的css代码  */
        /* 卡片视图容器：流式布局 */
        .custom-select-options.card-view {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            padding: 16px 8px;
            max-height: 300px;
            overflow-y: auto;
        }

        /* 卡片组件样式 */
        .custom-select-card {
            flex: 1 1 calc(33.333% - 12px); /* 每行3张卡片，自适应宽度 */
            min-width: 220px; /* 最小宽度，避免过窄 */
            background: #fff;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
        }

        /* 卡片选中状态 */
        .custom-select-card.selected {
            border-color: #3498db;
            background-color: #e8f4fc;
            box-shadow: 0 2px 8px rgba(52, 152, 219, 0.15);
        }

        /* 卡片hover效果 */
        .custom-select-card:hover {
            border-color: #3498db;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        /* 卡片图标区域 */
        .card-icon {
            font-size: 20px;
            margin-bottom: 8px;
            color: #3498db;
        }

        /* 卡片标题 */
        .card-title {
            font-size:14px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 6px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        /* 卡片描述 */
        .card-desc {
            font-size: 13px;
            color: #7f8c8d;
            line-height: 1.4;
            margin-bottom: 10px;
            flex-grow: 1;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* 最多显示2行 */
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* 分类标签 */
        .card-category {
            display: inline-block;
            padding: 3px 0;
            border-radius: 12px;
            font-size: 14px;
            /*font-weight: 400;*/
            color: rgb(100,100,255);
            align-self: flex-start;
        }

        /* 分类标签颜色（根据分类动态匹配） */
        .card-category.数据库 { background-color: #e1f0fa; color: #3498db; }
        .card-category.框架 { background-color: #f0e6fa; color: #9b59b6; }
        .card-category.服务 { background-color: #eafaf1; color: #27ae60; }
        .card-category.平台 { background-color: #fef9e7; color: #f39c12; }
        .card-category.语言 { background-color: #fdeeee; color: #e74c3c; }
        .card-category.工具 { background-color: #f5f5f5; color: #7f8c8d; }
        .card-category.未分类 { background-color: #f8f8f8; color: #95a5a6; }

        /* 响应式调整：中等屏幕每行2张 */
        @media (max-width: 992px) {
            .custom-select-card {
                flex: 1 1 calc(50% - 12px);
            }
        }

        /* 响应式调整：小屏幕每行1张 */
        @media (max-width: 576px) {
            .custom-select-card {
                flex: 1 1 100%;
                min-width: unset;
            }
        }
        `
    
    // 默认配置
    const defaults = {
        data: null,               // 本地数据
        url: null,                // 远程数据URL
        displayField: 'name',     // 显示字段
        valueField: 'id',         // 值字段
        placeholder: '请选择',
        searchable: true,         // 是否可搜索
        searchFields: ['name', 'description', 'category'], //可搜索的字段
        searchInPlaceholder: true, // 搜索框是否在placeholder位置
        viewMode: 'list',         // 视图模式: 'list' 或 'table' 或 'card'
        cardFields: {             // 卡片视图专用字段配置
            titleField: 'name',    // 卡片标题字段
            descField: 'description', // 卡片描述字段
            categoryField: 'category' // 分类标签字段
        },
        iconMap: {                // 分类图标映射（与图片一致）
            '数据库': '🗄️',
            '框架': '⚡',
            '服务': '🔧',
            '平台': '🌐',
            '语言': '💻',
            '工具': '🛠️',
            '未分类': '○'
        },
        showCardIcon: false,
        columns: null,            // 表格列配置
        groupField: null,         // 分组字段
        width: '100%',            // 宽度
        clearable: true,          // 是否可清空
        remoteSearch: false,      // 是否启用远程搜索
        remoteSearchDelay: 300,   // 远程搜索防抖延迟(毫秒)
        remoteSearchParam: 'q',   // 远程搜索参数名
        dataMapper: null,         // 数据映射函数
        onSelect: null,           // 选择回调函数
        onSearch: null            // 搜索回调函数
    };

    // 插件类 - 完全修复版
    class SmartSelect {
        constructor(container, options) {
            // ========== 关键修复：确保事件系统最先初始化 ==========
            
            // 修复1：在构造函数最顶部初始化事件系统
            this._events = {};
            
            // 修复2：立即定义事件方法，确保它们不会被覆盖
            this.on = this._on.bind(this);
            this.off = this._off.bind(this);
            this.trigger = this._trigger.bind(this);
            
            // ========== 其他属性初始化 ==========
            
            this.container = typeof container === 'string' 
                ? document.querySelector(container) 
                : container;
            
            this.config = { ...defaults, ...options };
            this.data = [];
            this.selectedOption = null;
            this.isOpen = false;
            this.filteredData = [];
            this.remoteSearchTimer = null;
            this.lastSearchTerm = '';
            this.originalUrl = this.config.url;
            
            // 如果没有指定columns，创建一个默认的
            if (!this.config.columns) {
                this.config.columns = [
                    { field: this.config.displayField, title: '名称' }
                ];
            }
            
            this.init();
        }
        
        // ========== 事件系统方法 ==========
        
        // 监听事件
        _on(event, listener) {
            if (!this._events[event]) {
                this._events[event] = [];
            }
            this._events[event].push(listener);
            return this;
        }
        
        // 移除事件监听
        _off(event, listener) {
            if (!this._events[event]) return this;
            
            if (listener) {
                const index = this._events[event].indexOf(listener);
                if (index > -1) {
                    this._events[event].splice(index, 1);
                }
            } else {
                delete this._events[event];
            }
            
            return this;
        }
        
        // 触发事件 - 完全修复，确保方法存在
        _trigger(event, ...args) {
            // 调试信息
            //console.log(`触发事件: ${event}`, this._events);
            
            if (!this._events || !this._events[event]) {
                //console.log(`事件 ${event} 没有监听器`);
                return false;
            }
            //console.log(`监听事件 ${event} `);
            const listeners = this._events[event].slice();
            for (let listener of listeners) {
                try {
                    listener.apply(this, args);
                } catch (error) {
                    console.error(`事件监听器错误 (${event}):`, error);
                }
            }
            
            // 添加事件日志
            this.logEvent(event, args);
            
            return true;
        }
        
        // 记录事件日志
        logEvent(event, args) {
            const eventLog = document.getElementById('event-log');
            if (!eventLog) return;
            
            const now = new Date();
            const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
            
            let message = `${event}`;
            if (args && args.length > 0) {
                message += `: ${JSON.stringify(args[0], null, 2).substring(0, 50)}${args[0] && args[0].length > 50 ? '...' : ''}`;
            }
            
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.innerHTML = `<span class="event-time">[${timeString}]</span> <span class="event-message">${message}</span>`;
            
            // 添加到日志顶部
            const firstChild = eventLog.querySelector('.event-item');
            if (firstChild) {
                eventLog.insertBefore(eventItem, firstChild);
            } else {
                eventLog.appendChild(eventItem);
            }
            
            // 限制日志数量
            const maxItems = 20;
            const items = eventLog.querySelectorAll('.event-item');
            if (items.length > maxItems) {
                for (let i = maxItems; i < items.length; i++) {
                    items[i].remove();
                }
            }
        }
        
        // ========== 插件核心方法 ==========
        
        // 初始化
        init() {
            this.injectStyles();
            // 创建下拉框结构
            this.createSelect();
            
            // 绑定事件
            this.bindEvents();
            
            // 加载数据
            this.loadData();
        }
        injectStyles() {
            if (!document.querySelector('#integrated-select-styles')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'integrated-select-styles';
                styleElement.textContent = STYLES;
                document.head.appendChild(styleElement);
                
            }
        }
        // 创建下拉框DOM结构
        createSelect() {
            this.wrapper = document.createElement('div');
            this.wrapper.className = 'custom-select-wrapper';
            this.wrapper.style.width = this.config.width;
            
            this.triggerElement = document.createElement('div');
            this.triggerElement.className = 'custom-select-trigger';
            
            // 创建placeholder/显示文本区域
            this.displayArea = document.createElement('span');
            this.displayArea.className = 'placeholder';
            this.displayArea.textContent = this.config.placeholder;
            
            // 创建搜索输入框容器（在placeholder位置）
            this.searchContainer = document.createElement('div');
            this.searchContainer.className = 'search-input-container';
            
            this.searchInput = document.createElement('input');
            this.searchInput.type = 'text';
            this.searchInput.className = 'search-input';
            this.searchInput.placeholder = this.config.placeholder;
            
            this.searchContainer.appendChild(this.searchInput);
            
            // 创建清空按钮
            if(this.config.clearable) {
                this.clearButton = document.createElement('button');
                this.clearButton.className = 'clear-button';
                this.clearButton.innerHTML = '×';
                this.clearButton.type = 'button';
                this.clearButton.title = '清空选择';
            }
            // 创建箭头
            this.arrow = document.createElement('span');
            this.arrow.className = 'arrow';
            this.arrow.textContent = '▼';
            
            // 组装触发器
            this.triggerElement.appendChild(this.displayArea);
            this.triggerElement.appendChild(this.searchContainer);
            if(this.config.clearable) this.triggerElement.appendChild(this.clearButton);
            this.triggerElement.appendChild(this.arrow);
            
            // 创建下拉框
            this.dropdown = document.createElement('div');
            this.dropdown.className = 'custom-select-dropdown';
            
            // 创建传统模式下的搜索框（在下拉框内部）
            this.traditionalSearchContainer = document.createElement('div');
            this.traditionalSearchContainer.className = 'custom-select-search';
            this.traditionalSearchContainer.innerHTML = '<input type="text" placeholder="搜索...">';
            this.dropdown.appendChild(this.traditionalSearchContainer);
            this.traditionalSearchInput = this.traditionalSearchContainer.querySelector('input');
            
            // 如果启用搜索框在placeholder位置，隐藏传统搜索框
            if (this.config.searchInPlaceholder) {
                this.traditionalSearchContainer.classList.remove('active');
            } else {
                this.traditionalSearchContainer.classList.add('active');
            }
            
            // 创建选项容器
            this.optionsContainer = document.createElement('div');
            this.optionsContainer.className = `custom-select-options ${this.config.viewMode}-view`;
            this.dropdown.appendChild(this.optionsContainer);
            
            // 隐藏的input
            this.hiddenInput = document.createElement('input');
            this.hiddenInput.type = 'hidden';
            this.hiddenInput.name = `${this.id}-value`;
            this.hiddenInput.value = this.selectedValue;

            // 组装wrapper
            this.wrapper.appendChild(this.triggerElement);
            this.wrapper.appendChild(this.dropdown);
            this.wrapper.appendChild(this.hiddenInput);
            // 插入到容器中
            this.container.innerHTML = '';
            this.container.appendChild(this.wrapper);
        }
        
        // 绑定事件
        bindEvents() {
            // 触发点击事件
            this.triggerElement.addEventListener('click', (e) => {
                // 如果点击的是清空按钮，不触发下拉框切换
                if ((e.target === this.clearButton || e.target.closest('.clear-button')) && this.config.clearable) {
                    e.stopPropagation();
                    this.clear();
                    return;
                }
                
                e.stopPropagation();
                this.toggleDropdown();
            });
            
            // placeholder位置搜索框事件
            if (this.config.searchable && this.searchInput) {
                this.searchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value;
                    this.handleSearch(searchTerm);
                });
                
                this.searchInput.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
                
                // 搜索框键盘事件
                this.searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        if (this.filteredData.length > 0) {
                            this.selectOption(this.filteredData[0]);
                        }
                    } else if (e.key === 'Escape') {
                        this.close();
                    }
                });
            }
            
            // 传统模式搜索框事件
            if (this.config.searchable && this.traditionalSearchInput) {
                this.traditionalSearchInput.addEventListener('input', (e) => {
                    const searchTerm = e.target.value;
                    this.handleSearch(searchTerm);
                });
                
                this.traditionalSearchInput.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }
            
            // 清空按钮事件
            if(this.config.clearable) {
                this.clearButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.clear();
                });
            }
            
            // 文档点击事件（关闭下拉框）
            document.addEventListener('click', () => {
                this.close();
            });
        }
        // 渲染卡片视图（核心新增方法）
        renderCardOptions() {
            this.optionsContainer.innerHTML = '';
            const { cardFields, iconMap } = this.config;
            
            this.filteredData.forEach(item => {
                // 提取卡片数据（兼容字段不存在的情况）
                const cardTitle = item[cardFields.titleField] || '无标题';
                const cardDesc = item[cardFields.descField] || '无描述';
                const cardCategory = item[cardFields.categoryField] || '未分类';
                const cardIcon = iconMap[cardCategory] || iconMap['未分类'];
                const isSelected = this.selectedOption && 
                    this.selectedOption[this.config.valueField] === item[this.config.valueField];
                
                // 创建卡片元素
                const card = document.createElement('div');
                card.className = `custom-select-card ${isSelected ? 'selected' : ''}`;
                card.dataset.value = item[this.config.valueField];
                
                // 卡片内部结构（与图片布局一致）
                if(this.config.showCardIcon && cardIcon){
                    card.innerHTML = `
                        <div class="card-icon">${cardIcon}</div>
                        <div class="card-title">${cardTitle}</div>
                        <div class="card-desc">${cardDesc}</div>
                        <span class="card-category ${cardCategory}">${cardCategory}</span>
                    `;
                }
                else{
                    card.innerHTML = `
                        <div class="card-title">${cardTitle}</div>
                        <div class="card-desc">${cardDesc}</div>
                        <span class="card-category ${cardCategory}">${cardCategory}</span>
                    `;
                }
                // 卡片点击事件（绑定选择逻辑）
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectOption(item);
                });
                
                this.optionsContainer.appendChild(card);
            });
        }
        // 处理搜索
        handleSearch(searchTerm) {
            // 更新最后搜索词
            this.lastSearchTerm = searchTerm;
            
            // 触发搜索事件
            this.trigger('search', searchTerm);
            
            // 如果有配置的onSearch回调，调用它
            if (typeof this.config.onSearch === 'function') {
                this.config.onSearch.call(this, searchTerm);
            }
            
            if (this.config.remoteSearch && this.config.url) {
                this.debouncedRemoteSearch(searchTerm);
            } else {
                this.filterOptions(searchTerm);
            }
        }
        
        // 防抖的远程搜索
        debouncedRemoteSearch(searchTerm) {
            if (this.remoteSearchTimer) {
                clearTimeout(this.remoteSearchTimer);
            }
            
            this.remoteSearchTimer = setTimeout(() => {
                this.performRemoteSearch(searchTerm);
            }, this.config.remoteSearchDelay);
        }
        
        // 执行远程搜索
        performRemoteSearch(searchTerm) {
            let searchUrl = this.originalUrl || this.config.url;
            
            if (searchTerm) {
                if (searchUrl.includes('?')) {
                    searchUrl += `&${this.config.remoteSearchParam}=${encodeURIComponent(searchTerm)}`;
                } else {
                    searchUrl += `?${this.config.remoteSearchParam}=${encodeURIComponent(searchTerm)}`;
                }
            }
            
            const oldUrl = this.config.url;
            this.config.url = searchUrl;
            
            this.loadData().then(() => {
                if (!searchTerm && oldUrl !== this.originalUrl) {
                    this.config.url = this.originalUrl;
                }
            }).catch(error => {
                console.error('远程搜索失败:', error);
            });
        }
        
        // 切换下拉框显示/隐藏
        toggleDropdown() {
            this.isOpen ? this.close() : this.open();
        }
        
        // 打开下拉框
        open() {
            if (this.isOpen) return;
            
            this.isOpen = true;
            this.triggerElement.classList.add('active');
            this.dropdown.classList.add('active');
            
            // 触发打开事件
            this.trigger('open');
            
            if (this.config.searchable && this.config.searchInPlaceholder) {
                this.triggerElement.classList.add('search-mode');
                setTimeout(() => {
                    this.searchInput.focus();
                    if (this.searchInput.value) {
                        this.searchInput.select();
                    }
                }, 100);
            } else if (this.config.searchable) {
                setTimeout(() => {
                    this.traditionalSearchInput.focus();
                    if (this.traditionalSearchInput.value) {
                        this.traditionalSearchInput.select();
                    }
                }, 100);
            }
        }
        
        // 关闭下拉框
        close() {
            if (!this.isOpen) return;
            
            this.isOpen = false;
            this.triggerElement.classList.remove('active');
            this.dropdown.classList.remove('active');
            
            // 触发关闭事件
            this.trigger('close');
            
            if (this.config.searchable && this.config.searchInPlaceholder) {
                this.triggerElement.classList.remove('search-mode');
                // 保留搜索词，而不是清空
                // this.searchInput.value = '';
                // this.handleSearch('');
            } else if (this.config.searchable) {
                // 保留搜索词，而不是清空
                // this.traditionalSearchInput.value = '';
                // this.handleSearch('');
            }
        }
        
        // 加载数据 - 修复：确保trigger方法可用
        async loadData() {
            // 调试信息
            //console.log('开始加载数据，trigger方法存在:', typeof this.trigger === 'function');
            
            // 显示加载中
            this.showLoading();
            try {
                if (this.config.url) {
                    // 远程数据
                    //console.log('正在请求URL:', this.config.url);
                    const response = await fetch(this.config.url);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    let remoteData = await response.json();
                    
                    // 应用数据映射函数
                    if (typeof this.config.dataMapper === 'function') {
                        remoteData = this.config.dataMapper(remoteData);
                    }
                    
                    this.data = remoteData;
                    this.filteredData = [...this.data];
                    
                    // 触发数据加载完成事件
                    this.trigger('dataLoaded', this.data);
                    
                    // 如果有搜索词，应用过滤
                    if (this.lastSearchTerm) {
                        //this.filterOptions(this.lastSearchTerm);
                        this.renderOptions();
                    } else {
                        this.renderOptions();
                    }
                    
                    return this.data;
                } else if (this.config.data) {
                    // 本地数据
                    this.data = this.config.data;
                    this.filteredData = [...this.data];
                    this.trigger('dataLoaded', this.data);
                    this.renderOptions();
                    return this.data;
                }
            } catch (error) {
                console.error('加载数据失败:', error);
                this.trigger('dataError', error);
                this.showNoResults('加载数据失败: ' + error.message);
                throw error;
            } finally {
                // 隐藏加载状态
                this.hideLoading();
            }
        }
        
        // 过滤选项
        _filterOptions(searchTerm) {
            if (!searchTerm || searchTerm.trim() === '') {
                this.filteredData = [...this.data];
                this.renderOptions();
                return;
            }
            
            const term = searchTerm.toLowerCase().trim();
            
            this.filteredData = this.data.filter(item => {
                const displayValue = item[this.config.displayField] ? 
                    item[this.config.displayField].toString().toLowerCase() : '';
                return displayValue.includes(term);
            });
            
            this.renderOptions();
            
            if (this.filteredData.length === 0) {
                this.showNoResults(`没有找到匹配 "${searchTerm}" 的结果`);
            }
        }
        filterOptions(searchTerm) {
            if (!searchTerm || searchTerm.trim() === '') {
                this.filteredData = [...this.data];
                this.renderOptions();
                return;
            }
            
            const term = searchTerm.toLowerCase().trim();
            const { cardFields } = this.config;
            
            this.filteredData = this.data.filter(item => {
                // 支持搜索标题、描述、分类（卡片视图专用）
                const title = item[cardFields.titleField]?.toString().toLowerCase() || '';
                const desc = item[cardFields.descField]?.toString().toLowerCase() || '';
                const category = item[cardFields.categoryField]?.toString().toLowerCase() || '';
                
                // 原有displayField搜索兼容
                const displayValue = item[this.config.displayField]?.toString().toLowerCase() || '';
                
                return title.includes(term) || desc.includes(term) || category.includes(term) || displayValue.includes(term);
            });
            
            this.renderOptions();
            
            if (this.filteredData.length === 0) {
                this.showNoResults(`没有找到匹配 "${searchTerm}" 的结果`);
            }
        }
        // 渲染选项
        _renderOptions() {
            this.optionsContainer.innerHTML = '';
            
            if (this.filteredData.length === 0) {
                this.showNoResults('没有数据');
                return;
            }
            
            /*// 按分组显示或直接显示列表
            if (this.config.groupField) {
                this.renderGroupedOptions();
            } else {
                this.renderListOptions();
            }
            // 根据视图模式选择渲染方法
            if (this.config.viewMode === 'table') {
                this.renderTable();
            } else {
                this.renderList();
            }*/

            // 根据视图模式选择渲染方法
            if (this.config.viewMode === 'table') {
                this.renderTable();
            } else {
                if (this.config.groupField) this.renderGroupedOptions();
                else this.renderListOptions();
                //this.renderList();
            }
        }
        renderOptions() {
            this.optionsContainer.innerHTML = '';
            
            if (this.filteredData.length === 0) {
                this.showNoResults('没有数据');
                return;
            }
            
            // 视图模式分发（新增card分支）
            switch(this.config.viewMode) {
                case 'table':
                    this.renderTable();
                    break;
                case 'card':
                    this.renderCardOptions(); // 渲染卡片视图
                    break;
                default: // list模式
                    if (this.config.groupField) this.renderGroupedOptions();
                    else this.renderListOptions();
                    break;
            }
        }
        // 渲染表格视图 - 修复列重叠问题
        renderTable() {
            const style = document.querySelector('#integrated-select-styles');
            if(this.config.viewMode === 'table' && this.config.columns && this.config.columns.length > 0 ){
                const justTableCols = `.table-row {
                    grid-template-columns: repeat(${this.config.columns.length}, minmax(0, 1fr))!important;
                }`
                style.sheet.insertRule(justTableCols);
            }
            const table = document.createElement('div');
            table.className = 'flow-table';
            const headerRow = document.createElement('div');
            headerRow.className = 'table-header table-row'
            this.config.columns.forEach(column => {
                const th = document.createElement('div');
                th.className = 'table-cell';
                th.textContent = column.title || column.field;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            const tbody = document.createElement('div');
            tbody.className = 'table-body';
            this.filteredData.forEach(item => {
                const row = document.createElement('div');
                row.className = 'table-row';
                row.dataset.value = item[this.config.valueField];
                // 标记选中的行
                if (this.selectedOption && this.selectedOption[this.config.valueField] === item[this.config.valueField]) {
                    row.classList.add('selected');
                }
                // 添加数据单元格
                this.config.columns.forEach(column => {
                    const td = document.createElement('div');
                    td.className = 'table-cell';
                    
                    // 设置数据标签（用于移动端响应式）
                    td.setAttribute('data-label', column.title || column.field);
                    
                    // 获取单元格值
                    let cellValue = item[column.field] || '';
                    
                    // 如果有自定义渲染函数，使用它
                    if (typeof column.render === 'function') {
                        td.innerHTML = column.render(cellValue, item);
                    } else {
                        td.textContent = cellValue;
                    }
                    row.appendChild(td);
                });
                // 行点击事件
                row.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectOption(item);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
                        // 清空容器并添加表格
            this.optionsContainer.innerHTML = '';
            this.optionsContainer.appendChild(table);
        }
        _renderTable() {
            // 创建表格
            const table = document.createElement('table');
            table.className = 'custom-select-table';
            
            // 计算表格总宽度和列宽分配
            const totalColumns = this.config.columns.length + 1; // +1 为选择标记列
            const hasWidthSpecified = this.config.columns.some(col => col.width);
            
            // 创建表头
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            // 添加选择标记列
            const checkmarkHeader = document.createElement('th');
            checkmarkHeader.className = 'table-checkmark';
            checkmarkHeader.style.width = '30px';
            checkmarkHeader.textContent = '';
            headerRow.appendChild(checkmarkHeader);
            
            // 添加数据列
            this.config.columns.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column.title || column.field;
                
                // 设置列宽
                if (column.width) {
                    th.style.width = column.width;
                } else if (hasWidthSpecified) {
                    // 如果有其他列指定了宽度，这个列使用自动宽度
                    th.className = 'auto-width';
                }
                
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // 创建表格主体
            const tbody = document.createElement('tbody');
            
            // 添加数据行
            this.filteredData.forEach(item => {
                const row = document.createElement('tr');
                row.dataset.value = item[this.config.valueField];
                
                // 标记选中的行
                if (this.selectedOption && 
                    this.selectedOption[this.config.valueField] === item[this.config.valueField]) {
                    row.classList.add('selected');
                }
                
                // 添加选择标记单元格
                const checkmarkCell = document.createElement('td');
                checkmarkCell.className = 'table-checkmark';
                checkmarkCell.innerHTML = this.selectedOption && 
                    this.selectedOption[this.config.valueField] === item[this.config.valueField] ? '✓' : '';
                checkmarkCell.setAttribute('data-label', '选中');
                row.appendChild(checkmarkCell);
                
                // 添加数据单元格
                this.config.columns.forEach(column => {
                    const td = document.createElement('td');
                    td.className = 'table-cell';
                    
                    // 设置数据标签（用于移动端响应式）
                    td.setAttribute('data-label', column.title || column.field);
                    
                    // 获取单元格值
                    let cellValue = item[column.field] || '';
                    
                    // 如果有自定义渲染函数，使用它
                    if (typeof column.render === 'function') {
                        td.innerHTML = column.render(cellValue, item);
                    } else {
                        td.textContent = cellValue;
                    }
                    
                    // 设置宽度
                    if (column.width) {
                        td.style.width = column.width;
                    }
                    
                    row.appendChild(td);
                });
                
                // 行点击事件
                row.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectOption(item);
                });
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            
            // 清空容器并添加表格
            this.optionsContainer.innerHTML = '';
            this.optionsContainer.appendChild(table);
            
            // 修复：确保表格在容器中正确显示
            setTimeout(() => {
                this.adjustTableLayout();
            }, 10);
        }
        // 调整表格布局 - 修复列重叠的核心函数
        adjustTableLayout() {
            if (this.config.viewMode !== 'table') return;
            
            const table = this.optionsContainer.querySelector('.custom-select-table');
            if (!table) return;
            
            const containerWidth = this.optionsContainer.clientWidth;
            const tableWidth = table.offsetWidth;
            
            // 如果表格宽度小于容器宽度，调整列宽
            if (tableWidth < containerWidth) {
                const ths = table.querySelectorAll('th:not(.table-checkmark)');
                const totalSpecifiedWidth = Array.from(ths).reduce((total, th) => {
                    const width = th.style.width;
                    if (width && width.includes('px')) {
                        return total + parseInt(width);
                    }
                    return total;
                }, 0);
                
                // 如果指定宽度的总和小于容器宽度，调整未指定宽度的列
                if (totalSpecifiedWidth < containerWidth) {
                    const unspecifiedCols = Array.from(ths).filter(th => !th.style.width || !th.style.width.includes('px'));
                    if (unspecifiedCols.length > 0) {
                        const remainingWidth = containerWidth - totalSpecifiedWidth - 30; // 减去选择标记列
                        const colWidth = Math.max(80, Math.floor(remainingWidth / unspecifiedCols.length));
                        
                        unspecifiedCols.forEach(th => {
                            th.style.width = `${colWidth}px`;
                            // 更新对应的td
                            const colIndex = Array.from(th.parentNode.children).indexOf(th);
                            const tds = table.querySelectorAll(`td:nth-child(${colIndex + 1})`);
                            tds.forEach(td => {
                                td.style.width = `${colWidth}px`;
                            });
                        });
                    }
                }
            }
        }
        
        // 渲染列表视图
        renderList() {
            this.optionsContainer.innerHTML = '';
            
            // 分组数据
            let groupedData = {};
            
            if (this.config.groupField && this.filteredData.length > 0) {
                // 按分组字段分组
                this.filteredData.forEach(item => {
                    const groupValue = item[this.config.groupField] || '未分组';
                    if (!groupedData[groupValue]) {
                        groupedData[groupValue] = [];
                    }
                    groupedData[groupValue].push(item);
                });
                
                // 渲染分组
                Object.keys(groupedData).forEach(groupName => {
                    const groupElement = document.createElement('div');
                    groupElement.className = 'custom-select-group';
                    groupElement.textContent = groupName;
                    this.optionsContainer.appendChild(groupElement);
                    
                    // 渲染分组内的选项
                    groupedData[groupName].forEach(item => {
                        this.optionsContainer.appendChild(this.createOptionElement(item));
                    });
                });
            } else {
                // 不分组，直接渲染
                this.filteredData.forEach(item => {
                    this.optionsContainer.appendChild(this.createOptionElement(item));
                });
            }
        }

        createOptionElement(item) {
            const option = document.createElement('div');
            option.className = 'integrated-select-option';
            option.setAttribute('data-value', item[this.config.valueField]);
            option.setAttribute('role', 'option');
            option.tabIndex = -1;
            
            // 添加自定义数据属性
            Object.keys(item).forEach(key => {
                if (key !== this.config.valueField && key !== this.config.textField) {
                    option.setAttribute(`data-${key}`, item[key]);
                }
            });
            
            // 图标
            const icon = document.createElement('div');
            icon.className = 'integrated-select-option-icon';
            icon.textContent = this.getOptionIcon(item);
            
            // 内容
            const content = document.createElement('div');
            content.className = 'integrated-select-option-content';
            
            const title = document.createElement('div');
            title.className = 'integrated-select-option-title';
            
            // 高亮搜索关键词
            if (this.searchTerm && this.config.highlightSearchResults !== false) {
                const text = item[this.config.textField] || String(item[this.config.valueField]);
                const highlighted = this.highlightText(text, this.searchTerm);
                title.innerHTML = highlighted;
            } else {
                title.textContent = item[this.config.textField] || String(item[this.config.valueField]);
            }
            
            const description = document.createElement('div');
            description.className = 'integrated-select-option-description';
            
            if (item.description) {
                if (this.searchTerm && this.config.highlightSearchResults !== false) {
                    const highlighted = this.highlightText(item.description, this.searchTerm);
                    description.innerHTML = highlighted;
                } else {
                    description.textContent = item.description;
                }
            }
            
            content.appendChild(title);
            content.appendChild(description);
            
            option.appendChild(icon);
            option.appendChild(content);
            
            // 选中状态
            if (this.selectedValue == item[this.config.valueField]) {
                option.classList.add('selected');
                option.setAttribute('aria-selected', 'true');
            } else {
                option.setAttribute('aria-selected', 'false');
            }
            
            // 禁用状态
            if (item.disabled) {
                option.classList.add('disabled');
            }
            
            return option;
        }

        getOptionIcon(item) {
            if (item.category === '框架') return '⚡';
            if (item.category === '语言') return '💻';
            if (item.category === '工具') return '🛠️';
            if (item.category === '数据库') return '🗄️';
            return '○';
        }
                
        highlightText(text, searchTerm) {
            if (!searchTerm || searchTerm.length < 1) {
                return text;
            }
            
            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<span class="search-highlight">$1</span>');
        }
        clearOptions() {
            this.optionsContainer.innerHTML = '';
        }
        // 渲染列表选项
        renderListOptions() {
            this.filteredData.forEach(item => {
                const option = document.createElement('div');
                option.className = `custom-select-option ${this.selectedOption && 
                    this.selectedOption[this.config.valueField] === item[this.config.valueField] ? 'selected' : ''}`;
                
                option.innerHTML = `
                    <span class="checkmark">✓</span>
                    <span class="option-text">${item[this.config.displayField]}</span>
                `;
                
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.selectOption(item);
                });
                
                this.optionsContainer.appendChild(option);
            });
        }
        
        // 渲染分组选项
        renderGroupedOptions() {
            const groups = {};
            
            // 按分组字段分组
            this.filteredData.forEach(item => {
                const groupKey = item[this.config.groupField];
                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                }
                groups[groupKey].push(item);
            });
            
            // 创建分组元素
            Object.keys(groups).forEach(groupKey => {
                const groupLabel = document.createElement('div');
                groupLabel.className = 'custom-select-group';
                groupLabel.textContent = groupKey;
                this.optionsContainer.appendChild(groupLabel);
                
                // 添加分组内的选项
                groups[groupKey].forEach(item => {
                    const option = document.createElement('div');
                    option.className = `custom-select-option ${this.selectedOption && 
                        this.selectedOption[this.config.valueField] === item[this.config.valueField] ? 'selected' : ''}`;
                    
                    option.innerHTML = `
                        <span class="checkmark">✓</span>
                        <span class="option-text">${item[this.config.displayField]}</span>
                    `;
                    
                    option.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.selectOption(item);
                    });
                    
                    this.optionsContainer.appendChild(option);
                });
            });
        }
        
        // 选择选项
        selectOption(item) {
            this.selectedOption = item;
            this.displayArea.textContent = item[this.config.displayField];
            this.displayArea.classList.add('selected-item-display');
            this.triggerElement.classList.add('has-selection');
            
            // 触发选择事件
            this.trigger('select', item);
            
            // 如果有配置的onSelect回调，调用它
            if (typeof this.config.onSelect === 'function') {
                this.config.onSelect.call(this, item);
            }
            
            this.close();
            this.renderOptions();
        }
        
        // 清空选择
        clear() {
            this.selectedOption = null;
            this.displayArea.textContent = this.config.placeholder;
            this.displayArea.classList.remove('selected-item-display');
            this.triggerElement.classList.remove('has-selection');
            this.hiddenInput.value = '';
            // 触发清空事件
            this.trigger('clear');
            
            this.renderOptions();
        }
        
        // 显示加载状态
        showLoading() {
            this.optionsContainer.innerHTML = '<div class="loading-indicator">加载中</div>';
        }
        
        // 隐藏加载状态
        hideLoading() {
            // 仅在当前显示的是加载状态时才清空
            const loadingIndicator = this.optionsContainer.querySelector('.loading-indicator');
            if (loadingIndicator) {
                this.optionsContainer.innerHTML = '';
            }
        }
        
        // 显示无结果状态
        showNoResults(message) {
            this.optionsContainer.innerHTML = `<div class="no-results">${message}</div>`;
        }
        
        // 获取当前选中值
        getValue() {
            return this.selectedOption ? this.selectedOption[this.config.valueField] : null;
        }
        setValue(value) {
            const selectedItem = this.data.find(item => item[this.config.valueField] == value);
            if (selectedItem) {
                this.selectOption(selectedItem)
                /*this.selectedValue = value;
                this.selectedText = selectedItem[this.config.textField] || String(value);
                this.selectedData = selectedItem;
                this.selectedOption = selectedItem;
                this.hiddenInput.value = value;
                
                // 切换到显示模式
                //this.setMode(MODES.DISPLAY);
                
                // 重新渲染选项以更新选中状态
                this.renderOptions(this.filteredData.length > 0 ? this.filteredData : this.data);*/
            }
            return this;
        }
        // 获取当前选中项
        getSelectedItem() {
            return this.selectedOption;
        }
        
        // 设置数据
        setData(data) {
            this.config.data = data;
            this.data = data;
            this.filteredData = [...data];
            this.renderOptions();
            this.trigger('dataLoaded', data);
        }
    }

    // 返回插件初始化函数
    return function(container, options) {
        return new SmartSelect(container, options);
    };
})();


