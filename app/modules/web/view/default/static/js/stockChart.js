class EmotionChart {
    constructor(container, data) {
        const canvas = document.createElement('canvas');
        canvas.id = 'stockEmotionChart';
        document.getElementById(container).innerHTML = '';
        document.getElementById(container).appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.stockChart = null;
        this.allData = data;
        this.updateTimeout = 0;
        if(data && data.length > 0) this.initChart(data, 1);
    }
    // 防抖函数
    debouncedRenderChart(percentage) {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => { this.renderChart(percentage); }, 50);
    }
    // 初始化并渲染图表
    initChart(data, percent = 0.3) {
        if(data) this.allData = data;
        this.renderChart(percent);
    }
    // 渲染或更新图表函数
    renderChart(percentage) {
        const totalPoints = this.allData.length;
        const displayCount = Math.max(10, Math.floor(totalPoints * percentage));
        const startIndex = totalPoints - displayCount;
        const displayData = this.allData.slice(startIndex);
        const labels = displayData.map( d => formatDate(new Date(d.TRADE_DATE), 'yyyy-MM-dd').substring(5) );

        if (this.stockChart) {
            // 只更新数据，不重新创建图表
            this.stockChart.data.labels = labels;
            this.stockChart.data.datasets[0].data = displayData.map(d => d.UPLIMIT_NUM);
            this.stockChart.data.datasets[1].data = displayData.map(d => -d.DOWNLIMIT_NUM);
            this.stockChart.data.datasets[2].data = displayData.map(d => d.COUNTINUS_STOCK_NUM);
            this.stockChart.data.datasets[3].data = displayData.map(d => d.MAX_CONTINUS_UPLIMITS);

            // 使用静默更新，避免动画
            this.stockChart.update('none');
        } else {
            // 首次创建图表
            this.createNewChart(labels, displayData);
        }

    }
    // 创建新图表
    createNewChart(labels, displayData) {
        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: '涨停数量',
                    type: 'bar',
                    data: displayData.map(d => d.UPLIMIT_NUM),
                    backgroundColor: 'rgba(255,0,0,0.6)',//'rgba(83, 198, 87, 0.8)',
                    borderColor:'rgba(255,0,0,0.6)',
                    borderWidth: 1,
                    yAxisID: 'y',
                    stack: 'stack1'
                },
                {
                    label: '跌停数量',
                    type: 'bar',
                    data: displayData.map(d => -d.DOWNLIMIT_NUM),
                    backgroundColor: 'rgba(0, 255, 0, 0.6)',
                    borderColor: 'rgba(0, 255, 0, 0.6)',
                    borderWidth: 1,
                    yAxisID: 'y',
                    stack: 'stack1'
                },
                {
                    label: '连板家数',
                    type: 'line',
                    data: displayData.map(d => d.COUNTINUS_STOCK_NUM),
                    borderColor: 'rgba(33, 150, 243, 1)',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    borderWidth: 1,
                    fill: false,
                    pointBackgroundColor: 'rgba(33, 150, 243, 1)',
                    pointRadius: 1,
                    pointHoverRadius:3,
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: '最高板数',
                    type: 'line',
                    data: displayData.map(d => d.MAX_CONTINUS_UPLIMITS),
                    borderColor: 'rgba(255, 152, 0, 1)',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    borderWidth: 1,
                    fill: false,
                    pointBackgroundColor: 'rgba(255, 152, 0, 1)',
                    pointRadius: 1,
                    pointHoverRadius: 3,
                    tension: 0.3,
                    yAxisID: 'y'
                }
            ]
        };

        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // 完全禁用动画
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    title: {
                        display: false,
                        text: '股票市场数据可视化',
                        color: '#fff',
                        font: {
                            size: 18,
                            weight: 'bold'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#4a9eff',
                        bodyColor: '#fff',
                        borderColor: '#4a9eff',
                        borderWidth: 1,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                const value = context.dataset.label === '跌停数量' ? Math.abs(context.raw) : context.raw;
                                label += value;
                                return label;
                            }
                        }
                    },
                    legend: {
                        display: true
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: {
                            color: 'rgba(0, 0, 0, 0.7)',//'rgba(255, 255, 255, 0.7)',
                            maxRotation: 45,
                            minRotation: 45
                        },
                        title: {
                            display: false,
                            text: '交易日',
                            color: 'rgba(0, 0, 0, 0.7)',//'rgba(255, 255, 255, 0.8)'
                        }
                    },
                    y: {
                        stacked: false,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: {
                            color: 'rgba(0, 0, 0, 0.7)',//'rgba(255, 255, 255, 0.7)',
                            callback: function (value, index, values) {
                                return Math.abs(value);
                            }
                        },
                        title: {
                            display: false,
                            text: '数量/家数',
                            color:'rgba(0, 0, 0, 0.7)',// 'rgba(255, 255, 255, 0.8)'
                        }
                    }
                }
            }
        };

        //if(this.stockChart) this.stockChart.destroy();
        this.stockChart = new Chart(this.ctx, config);
    }

}

class LimitTrendChart {
    constructor(container, data) {
        const canvas = document.createElement('canvas');
        canvas.id = 'stockLimitTrendChart';
        document.getElementById(container).innerHTML = '';
        document.getElementById(container).appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.stockChart = null;
        this.allData = data;
        this.updateTimeout = 0;
        if(data && data.length > 0) this.initChart(data);
    }
    // 初始化并渲染图表
    initChart(data) {
        if(data) this.allData = data;
        this.renderChart();
    }
    // 渲染或更新图表函数
    renderChart() {
        const labels = this.allData.map((item)=> {return item.TRADE_TIME});

        if (this.stockChart) {
            // 只更新数据，不重新创建图表
            this.stockChart.data.labels = labels;
            this.stockChart.data.datasets[0].data = this.allData.map(d => d.LIMIT_UP_NUM);
            this.stockChart.data.datasets[1].data = this.allData.map(d => d.LIMIT_DOWN_NUM);
            this.stockChart.data.datasets[2].data = this.allData.map(d => d.TOUCH_LIMITUP_NUM);
            this.stockChart.data.datasets[3].data = this.allData.map(d => d.TOUCH_LIMITDOWN_NUM);

            // 使用静默更新，避免动画
            this.stockChart.update('none');
        } else {
            // 首次创建图表
            this.createNewChart(labels, this.allData);
        }

    }

    // 创建新图表
    createNewChart(labels, displayData) {
        const lineBorder = {
            borderWidth: 1,
            tension: 0.4,
            pointBorderWidth: 0,
            pointRadius: 0,
            pointHoverRadius: 5
        }
        // 创建图表实例
        this.stockChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '涨停家数',
                        data: this.allData.map(d => d.LIMIT_UP_NUM),
                        borderColor: 'rgba(255,0,0,0.8)',
                        backgroundColor: 'rgba(255,0,0,0.8)',
                        pointBackgroundColor: 'rgba(255,0,0,0.8)',
                        pointBorderColor: '#fff',
                        ...lineBorder
                    },
                    {
                        label: '跌停家数',
                        data: this.allData.map(d => d.LIMIT_DOWN_NUM),
                        borderColor: 'rgba(0, 255, 0, 0.8)',
                        backgroundColor: 'rgba(0, 255, 0, 0.8)',
                        pointBackgroundColor: 'rgba(0, 255, 0, 0.8)',
                        pointBorderColor: '#fff',
                        ...lineBorder
                    },
                    {
                        label: '触及涨停家数',
                        data: this.allData.map(d => d.TOUCH_LIMITUP_NUM),
                        borderColor: 'rgba(255,0,0,0.4)',
                        backgroundColor: 'rgba(255,0,0,0.4)',
                        pointBackgroundColor: 'rgba(255,0,0,0.4)',
                        pointBorderColor: '#fff',
                        ...lineBorder
                    },
                    {
                        label: '触及跌停家数',
                        data: this.allData.map(d => d.TOUCH_LIMITDOWN_NUM),
                        borderColor: 'rgba(0, 255, 0, 0.4)',
                        backgroundColor: 'rgba(0, 255, 0, 0.4)',
                        pointBackgroundColor: 'rgba(0, 255, 0, 0.4)',
                        pointBorderColor: '#fff',
                        ...lineBorder
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // 完全禁用动画
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'rgba(0,0,0,0.5)',
                            font: { size: 14 },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                label += context.parsed.y;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(0, 0, 0, 0.8)' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(0, 0, 0, 0.8)' },
                        beginAtZero: true
                    }
                },
                /*animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }*/
            }
        });
    }
}

class preLimitBlockActionChart {
    constructor(container, data) {
        const canvas = document.createElement('canvas');
        canvas.id = 'stockPreLimitBlockActionChart';
        document.getElementById(container).innerHTML = '';
        document.getElementById(container).appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.stockChart = null;
        this.allData = data;
        this.updateTimeout = 0;
        if(data && data.length > 0) this.initChart(data);
    }
    // 初始化并渲染图表
    initChart(data) {
        if(data) this.allData = data;
        this.renderChart();
    }
    // 渲染或更新图表函数
    renderChart() {
        const labels = this.allData.map((item)=> {return item.time});

        if (this.stockChart) {
            // 只更新数据，不重新创建图表
            this.stockChart.data.labels = labels;
            this.stockChart.data.datasets[0].data = this.allData.map(d => d.szzs);
            this.stockChart.data.datasets[1].data = this.allData.map(d => d.prelimit);

            // 使用静默更新，避免动画
            this.stockChart.update('none');
        } else {
            // 首次创建图表
            this.createNewChart(labels, this.allData);
        }

    }

    // 创建新图表
    createNewChart(labels, displayData) {
        const lineBorder = {
            borderWidth: 1,
            tension: 0.4,
            pointBorderWidth: 0,
            pointRadius: 0,
            pointHoverRadius: 5
        }
        // 创建图表实例
        this.stockChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '上证指数',
                        data: this.allData.map(d => d.szzs),
                        borderColor: 'rgba(255,0,0,0.8)',
                        backgroundColor: 'rgba(255,0,0,0.8)',
                        pointBackgroundColor: 'rgba(255,0,0,0.8)',
                        pointBorderColor: '#fff',
                        ...lineBorder
                    },
                    {
                        label: '昨涨停板块',
                        data: this.allData.map(d => d.prelimit),
                        borderColor: 'rgba(0, 255, 0, 0.8)',
                        backgroundColor: 'rgba(0, 255, 0, 0.8)',
                        pointBackgroundColor: 'rgba(0, 255, 0, 0.8)',
                        pointBorderColor: '#fff',
                        ...lineBorder
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false, // 完全禁用动画
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'rgba(0,0,0,0.5)',
                            font: { size: 14 },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y + '%';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: 'rgba(0, 0, 0, 0.8)' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { 
                            color: 'rgba(0, 0, 0, 0.8)' ,
                            callback: function (value, index, values) {
                                return value.toFixed(2) + '%';
                            }
                        },
                        beginAtZero: true
                    }
                },
                /*animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }*/
            }
        });
    }
}

class marginBalanceChart{
    constructor(container, data) {
        const canvas = document.createElement('canvas');
        canvas.id = 'marginBalanceChart';
        //canvas.style.marginTop = '-20px'
        document.getElementById(container).innerHTML = '';
        document.getElementById(container).appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.stockChart = null;
        this.data = data;
        this.isMobile = window.innerWidth <= 768;
        if(data && data.length > 0) this.initChart(data);
    }
    initChart(data) {
        if(data) this.data = data;
        this.renderChart();
        // 窗口大小改变时重新渲染图表
        window.addEventListener('resize', function() {
            if(this.stockChart) this.stockChart.resize();
        });
    }
    renderChart() {
        // 处理数据
        const dates = this.data.map(item => {
            return item.PUBLISH_DATE.split(' ')[0];
        });
        const labels = this.data.map((item)=> {return item.time});
        const marginBalance = this.data.map(item => item.MARGIN_BALANCE / 1000000000000); // 转换为万亿
        const finNetBuyAmt = this.data.map(item => item.FIN_NETBUY_AMT / 100000000); // 转换为亿
        const szzsClose = this.data.map(item => item.SZZS_CLOSE);

        if (this.stockChart) {
            // 只更新数据，不重新创建图表
            this.stockChart.data.labels = labels;
            this.stockChart.data.datasets[0].data = this.data.map(d => d.szzs);
            this.stockChart.data.datasets[1].data = this.data.map(d => d.prelimit);

            // 使用静默更新，避免动画
            this.stockChart.update('none');
        } else {
            // 首次创建图表
            this.createNewChart(labels, this.data, dates, marginBalance, finNetBuyAmt, szzsClose);
        }
    }
    createNewChart(labels, data, dates, marginBalance, finNetBuyAmt, szzsClose) {
        this.stockChart = new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: dates,
                datasets: [
                    // 融资净买入 - 柱状图 (左Y轴)
                    {
                        type: 'bar',
                        label: '融资净买入(亿)',
                        data: finNetBuyAmt,
                        backgroundColor: function(context) {
                            const value = context.parsed.y;
                            return value >= 0 ? 'rgba(46, 204, 113, 0.8)' : 'rgba(231, 76, 60, 0.8)';
                        },
                        borderColor: function(context) {
                            const value = context.parsed.y;
                            return value >= 0 ? 'rgba(46, 204, 113, 1)' : 'rgba(231, 76, 60, 1)';
                        },
                        borderWidth: 1,
                        yAxisID: 'y1', // 使用第三个Y轴
                        barPercentage: this.isMobile ? 0.5 : 0.8,
                        categoryPercentage: 0.7,
                        borderRadius: 2,
                        order: 3
                    },
                    // 两融余额 - 折线图 (左Y轴)
                    {
                        type: 'line',
                        label: '两融余额(万亿)',
                        data: marginBalance,
                        borderColor: '#e74c3c',
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        tension: 0.4,
                        yAxisID: 'y',
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#e74c3c',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        fill: false,
                        order: 1
                    },
                    // 上证指数 - 折线图 (右Y轴)
                    /*{
                        type: 'line',
                        label: '上证指数',
                        data: szzsClose,
                        borderColor: '#3498db',
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        tension: 0.4,
                        yAxisID: 'y1',
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointBackgroundColor: '#3498db',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2,
                        fill: false,
                        order: 2
                    }*/
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                layout: {
                    padding: {
                        left: 10,
                        right: 10,
                        top: 10,
                        bottom: 10
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: this.isMobile ? 10 : 11
                            },
                            color: '#666',
                            callback: function(value, index) {
                                // 显示更少的标签
                                if (this.isMobile && index % 5 !== 0) return '';
                                return this.getLabelForValue(value);
                            }
                        }
                    },
                    // 左侧Y轴 - 用于两融余额
                    y: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: '两融余额 (万亿)',
                            color: '#e74c3c'
                        },
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            font: {
                                size: this.isMobile ? 10 : 12
                            },
                            color: '#e74c3c',
                            callback: function(value) {
                                return value.toFixed(1) + '万亿';
                            }
                        },
                        // 设置合适的范围来显示融资余额的变化
                        min: Math.min(...marginBalance) * 0.999,
                        max: Math.max(...marginBalance) * 1.001
                    },
                    // 右侧Y轴 - 用于上证指数
                    /*y1: {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: '上证指数',
                            color: '#3498db'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            font: {
                                size: this.isMobile ? 10 : 12
                            },
                            color: '#3498db'
                        },
                        // 设置合适的范围来显示上证指数的变化
                        min: Math.min(...szzsClose) * 0.99,
                        max: Math.max(...szzsClose) * 1.01
                    },*/
                    // 第三个Y轴 - 用于融资净买入（在左侧，但位置下移）
                    y1: {
                        type: 'linear',
                        position: 'right',
                        offset: true, // 允许偏移
                        grid: {
                            drawOnChartArea: false, // 不绘制网格线
                        },
                        ticks: {
                            font: {
                                size: this.isMobile ? 10 : 12
                            },
                            color: '#2ecc71',
                            callback: function(value) {
                                return value.toFixed(0) + '亿';
                            }
                        },
                        // 设置柱状图的合适范围，让零线在中间
                        min: Math.min(...finNetBuyAmt) * 1.2, // 给负值留更多空间
                        max: Math.max(...finNetBuyAmt) * 1.2, // 给正值留更多空间
                        // 调整位置，让柱状图往下移
                        afterDataLimits: function(scale) {
                            // 确保零线在可见范围内
                            scale.min = Math.min(scale.min, -50); // 确保显示负值区域
                            scale.max = Math.max(scale.max, 50);  // 确保显示正值区域
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#4a9eff',
                        bodyColor: '#fff',
                        borderColor: '#4a9eff',
                        borderWidth: 1,
                        titleFont: {
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        padding: 10,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                const value = context.parsed.y;
                                
                                if (context.dataset.label === '两融余额(万亿)') {
                                    return `两融余额: ${value.toFixed(4)}万亿`;
                                } else if (context.dataset.label === '融资净买入(亿)') {
                                    const sign = value >= 0 ? '+' : '';
                                    return `融资净买入: ${sign}${value.toFixed(2)}亿`;
                                } else if (context.dataset.label === '上证指数') {
                                    return `上证指数: ${value.toFixed(2)}`;
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        display: true
                    }
                }
            }
        });
    }
}

class topTraderRankingChart{
    constructor(container, data) {
        const canvas = document.createElement('canvas');
        canvas.id = 'topTraderChart';
        document.getElementById(container).innerHTML = '';
        document.getElementById(container).appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.stockChart = null;
        this.data = data;
        this.isMobile = window.innerWidth <= 768;
        if(data && data.length > 0) this.initChart(data);
    }
    initChart(data) {
        if(data) this.data = data;
        this.data.sort((a, b) => new Date(a.TRADE_DATE) - new Date(b.TRADE_DATE));
        this.renderChart();
        // 窗口大小改变时重新渲染图表
        window.addEventListener('resize', function() {
            if(this.stockChart) this.stockChart.resize();
        });
    }
    renderChart() {
        // 处理数据
        const dates = this.data.map(item => {
            const date = new Date(item.TRADE_DATE);
            return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        });

        const totalOrgNetBuy = this.data.map(item => item.TOTAL_ORG_NETBUY);
        const hotMoneyNetBuy = this.data.map(item => item.HOTMONEY_NETBUY);
        if (this.stockChart) {
            // 只更新数据，不重新创建图表
            this.stockChart.data.labels = dates;
            this.stockChart.data.datasets[0].data = totalOrgNetBuy;
            this.stockChart.data.datasets[1].data = hotMoneyNetBuy;

            // 使用静默更新，避免动画
            this.stockChart.update('none');
        } else {
            // 首次创建图表
            this.createNewChart(dates, totalOrgNetBuy, hotMoneyNetBuy);
        }
    }
    createNewChart(labels, totalOrgNetBuy, hotMoneyNetBuy) {
        const netBuyChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '机构净买入',
                        data: totalOrgNetBuy,
                        borderColor: 'rgba(114, 11, 162, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.3, // 减小平滑度，显示真实波动
                        pointRadius: 0,
                        pointHoverRadius: 2
                    },
                    {
                        label: '游资净买入',
                        data: hotMoneyNetBuy,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.3, // 减小平滑度，显示真实波动
                        pointRadius: 0,
                        pointHoverRadius: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                        text: '机构与热钱净买入趋势'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#4a9eff',
                        bodyColor: '#fff',
                        borderColor: '#4a9eff',
                        borderWidth: 1,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                // 格式化数值显示
                                const value = context.parsed.y;
                                if (Math.abs(value) >= 100000000) {
                                    label += (value / 100000000).toFixed(2) + '亿';
                                } else if (Math.abs(value) >= 10000) {
                                    label += (value / 10000).toFixed(2) + '万';
                                } else {
                                    label += value.toLocaleString('zh-CN');
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '交易日期'
                        },
                        ticks: {
                            maxTicksLimit: 10,
                            callback: function(value, index, values) {
                                // 只显示部分日期标签，避免过于拥挤
                                /*if (index % Math.ceil(values.length / 12) === 0) {
                                    return this.getLabelForValue(value);
                                }*/
                                if(index % 5 === 0 ) return this.getLabelForValue(value);
                                return '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '净买入金额'
                        },
                        ticks: {
                            callback: function(value) {
                                // 格式化大数字，使用亿为单位
                                if (value >= 100000000 || value <= -100000000) {
                                    return (value / 100000000).toFixed(1) + '亿';
                                }
                                if (value >= 10000 || value <= -10000) {
                                    return (value / 10000).toFixed(0) + '万';
                                }
                                return value.toLocaleString('zh-CN');
                            }
                        },
                        // 确保Y轴包含0值，负数显示在0轴下方
                        beginAtZero: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }
}

class liftLockupChart{
    constructor(container, data) {
        const canvas = document.createElement('canvas');
        canvas.id = 'liftLockUpChart';
        document.getElementById(container).innerHTML = '';
        document.getElementById(container).appendChild(canvas);

        this.ctx = canvas.getContext('2d');
        this.stockChart = null;
        this.data = data;
        this.isMobile = window.innerWidth <= 768;
        if(data && data.length > 0) this.initChart(data);
    }
    initChart(data) {
        if(data) this.data = data;
        this.data.sort((a, b) => new Date(a.TRADE_DATE) - new Date(b.TRADE_DATE));
        this.renderChart();
        // 窗口大小改变时重新渲染图表
        window.addEventListener('resize', function() {
            if(this.stockChart) this.stockChart.resize();
        });
    }
    renderChart() {
        // 处理数据
        const dates = this.data.map(item => {
            const date = new Date(item.LIFT_DATE);
            return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        });

        const liftMarketCap = this.data.map(item => item.LIFT_MARKETCAP);
        if (this.stockChart) {
            // 只更新数据，不重新创建图表
            this.stockChart.data.labels = dates;
            this.stockChart.data.datasets[0].data = liftMarketCap;

            // 使用静默更新，避免动画
            this.stockChart.update('none');
        } else {
            // 首次创建图表
            this.createNewChart(dates, liftMarketCap);
        }
    }
    createNewChart(labels, liftMarketCap) {
        const netBuyChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: '解禁总市值',
                        data: liftMarketCap,
                        borderColor: 'rgba(114, 11, 162, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.1)',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.3, // 减小平滑度，显示真实波动
                        pointRadius: 0,
                        pointHoverRadius: 2
                    },
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                        text: '解禁市值趋势'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#4a9eff',
                        bodyColor: '#fff',
                        borderColor: '#4a9eff',
                        borderWidth: 1,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                // 格式化数值显示
                                const value = context.parsed.y;
                                if (Math.abs(value) >= 100000000) {
                                    label += (value / 100000000).toFixed(2) + '亿';
                                } else if (Math.abs(value) >= 10000) {
                                    label += (value / 10000).toFixed(2) + '万';
                                } else {
                                    label += value.toLocaleString('zh-CN');
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: false,
                            text: '交易日期'
                        },
                        grid: {
                            drawOnChartArea: false, // 不绘制网格线
                        },
                        ticks: {
                            maxTicksLimit: 10,
                            callback: function(value, index, values) {
                                return this.getLabelForValue(value);
                                // 只显示部分日期标签，避免过于拥挤
                                if(index % 2 === 0 ) return this.getLabelForValue(value);
                                return '';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: '解禁市值'
                        },
                        grid: {
                            drawOnChartArea: false, // 不绘制网格线
                        },
                        ticks: {
                            callback: function(value) {
                                // 格式化大数字，使用亿为单位
                                if (value >= 100000000 || value <= -100000000) {
                                    return (value / 100000000).toFixed(1) + '亿';
                                }
                                if (value >= 10000 || value <= -10000) {
                                    return (value / 10000).toFixed(0) + '万';
                                }
                                return value.toLocaleString('zh-CN');
                            }
                        },
                        // 确保Y轴包含0值，负数显示在0轴下方
                        beginAtZero: false
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                }
            }
        });
    }
}

class TreemapChart {
    constructor(containerId, rawData, options = { view: 'fund' }) {
        this.containerId = containerId;
        this.rawData = rawData;
        this.options = options;
        this.chart = null;
        this.currentView = options.view; //'fund';
        this.colorScheme = this.COLOR_SCHEME();
        this.marginLeft = 3;
        this.marginRight = 70;
        this.init();
    }
    COLOR_SCHEME() { 
        return ["#00ff00", "#22ff22", "#44ff44", "#66ff66", "#88ff88","#aaffaa", "#ccffcc", "#ffffff", "#ffcccc", "#ffaaaa","#ff8888", "#ff6666", "#ff4444", "#ff2222", "#ff0000"];
    }
    // 初始化图表
    init() {
        // 初始化ECharts实例
        /*this.chart = echarts.init(document.getElementById(this.containerId), null, {
            renderer: 'canvas',
            useDirtyRect: false,
            useCoarsePointer: true,
            pointerSize: 44
        });*/
        this.chart = echarts.init(document.getElementById(this.containerId));
        // 初始渲染
        this.render();
    }

    // ========== 数据准备方法 ==========

    // 准备矩形树图数据 - 按当前视图数值排序
    prepareTreemapData(viewType) {
        // 按当前视图的数值排序
        let sortedData;
        if (viewType === 'fund') {
            // 资金流向视图：按资金量绝对值降序排序
            sortedData = [...this.rawData].sort((a, b) => {
                const valA = Math.abs(a.amount);
                const valB = Math.abs(b.amount);
                return valB - valA; // 资金量越大越靠前
            });
        } else {
            // 涨跌幅视图：按涨跌幅绝对值降序排序
            sortedData = [...this.rawData].sort((a, b) => {
                const valA = Math.abs(a.change);
                const valB = Math.abs(b.change);
                return valB - valA; // 涨跌幅越大越靠前
            });
        }

        // 计算当前视图的数值范围
        const values = sortedData.map(d => viewType === 'fund' ? d.amount : d.change);
        const absValues = values.map(v => Math.abs(v));

        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const maxAbsValue = Math.max(...absValues);

        // 处理minAbsValue避免NaN
        let minAbsValue = Math.min(...absValues.filter(v => v > 0));
        if (minAbsValue === Infinity || isNaN(minAbsValue)) {
            minAbsValue = maxAbsValue > 0 ? maxAbsValue * 0.1 : 1;
        }

        // 为treemap准备数据 - 使用绝对值作为value（决定矩形大小）
        const treemapData = sortedData.map((item, index) => {
            const value = viewType === 'fund' ? item.amount : item.change;
            const absValue = Math.abs(value);

            // 计算颜色索引（基于绝对值在整个范围内的位置）
            let colorIndex;
            if (maxAbsValue === minAbsValue) {
                colorIndex = 7; // 中间位置（白色）
            } else {
                const normalized = (absValue - minAbsValue) / (maxAbsValue - minAbsValue);
                colorIndex = Math.floor(normalized * (this.colorScheme.length - 1));
            }

            return {
                name: item.name,
                value: absValue, // treemap使用value确定矩形大小
                actualValue: value, // 实际值（带正负）
                item: item,
                sortIndex: index + 1,
                // 计算颜色 - 根据绝对值大小从颜色方案中选取
                colorIndex: colorIndex,
                itemStyle: {
                    color: this.colorScheme[colorIndex]
                }
            };
        });

        return {
            treemapData,
            sortedData,
            maxValue,
            minValue,
            maxAbsValue,
            minAbsValue,
            sortType: viewType === 'fund' ? '资金量' : '涨跌幅'
        };
    }

    // 计算统计信息
    calculateStats(data, viewType) {
        const { sortedData, maxAbsValue, minAbsValue } = data;

        if (viewType === 'fund') {
            const inflow = sortedData.filter(d => d.amount > 0);
            const outflow = sortedData.filter(d => d.amount < 0);
            const totalInflow = inflow.reduce((sum, d) => sum + d.amount, 0);
            const totalOutflow = outflow.reduce((sum, d) => sum + Math.abs(d.amount), 0);
            const netInflow = totalInflow - totalOutflow;

            // 格式化显示
            const maxValueLabel = maxAbsValue > 0 ?
                `${(maxAbsValue / 100000000).toFixed(1)}亿` : '0亿';
            const minValueLabel = minAbsValue > 0 ?
                `${(minAbsValue / 100000000).toFixed(1)}亿` : '0亿';
            const netInflowLabel = `${(netInflow / 100000000).toFixed(1)}亿`;

            return {
                maxValueLabel,
                minValueLabel,
                netInflowLabel,
                inflowCount: inflow.length,
                outflowCount: outflow.length,
                netInflowValue: netInflow
            };
        } else {
            const rise = sortedData.filter(d => d.change > 0);
            const fall = sortedData.filter(d => d.change < 0);
            const avgChange = sortedData.reduce((sum, d) => sum + d.change, 0) / sortedData.length;

            // 格式化显示
            const maxValueLabel = `${maxAbsValue.toFixed(2)}%`;
            const minValueLabel = minAbsValue > 0 ?
                `${minAbsValue.toFixed(2)}%` : '0%';
            const avgChangeLabel = `${avgChange.toFixed(2)}%`;

            return {
                maxValueLabel,
                minValueLabel,
                avgChangeLabel,
                riseCount: rise.length,
                fallCount: fall.length,
                avgChangeValue: avgChange
            };
        }
    }

    // ========== 视图控制方法 ==========

    // 公共方法：切换到资金流向视图
    switchToFundView() {
        if (this.currentView !== 'fund') {
            this.currentView = 'fund';
            this.render();
            return true;
        }
        return false;
    }

    // 公共方法：切换到涨跌幅视图
    switchToChangeView() {
        if (this.currentView !== 'change') {
            this.currentView = 'change';
            this.render();
            return true;
        }
        return false;
    }

    // 公共方法：获取当前视图
    getCurrentView() {
        return this.currentView;
    }

    // 设置激活按钮
    setActiveButton(activeBtnId) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        if (activeBtnId) {
            document.getElementById(activeBtnId).classList.add('active');
        }
    }

    // ========== UI更新方法 ==========

    // 更新图例
    updateLegend(viewType, data) {
        const legendArea = document.getElementById('legend-area');
        const { maxAbsValue, minAbsValue } = data;

        if (viewType === 'fund') {
            legendArea.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color" style="background: linear-gradient(to right, ${this.colorScheme[0]}, ${this.colorScheme[this.colorScheme.length - 1]});"></div>
                    <span>颜色表示资金量大小</span>
                </div>
                <div style="margin-top: 8px;">
                    <div class="size-indicator">
                        <span>绿色(小) → 白色(中) → 红色(大)</span>
                    </div>
                    <div class="size-indicator" style="font-size:12px;">
                        <span>最小: ${(minAbsValue / 100000000).toFixed(1)}亿</span>
                        <span style="margin-left:15px;">最大: ${(maxAbsValue / 100000000).toFixed(1)}亿</span>
                    </div>
                </div>
            `;
        } else {
            legendArea.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color" style="background: linear-gradient(to right, ${this.colorScheme[0]}, ${this.colorScheme[this.colorScheme.length - 1]});"></div>
                    <span>颜色表示涨跌幅大小</span>
                </div>
                <div style="margin-top: 8px;">
                    <div class="size-indicator">
                        <span>绿色(小) → 白色(中) → 红色(大)</span>
                    </div>
                    <div class="size-indicator" style="font-size:12px;">
                        <span>最小: ${minAbsValue.toFixed(2)}%</span>
                        <span style="margin-left:15px;">最大: ${maxAbsValue.toFixed(2)}%</span>
                    </div>
                </div>
            `;
        }
    }

    // 更新统计信息
    updateStats(viewType, stats) {
        const statsArea = document.getElementById('stats-area');

        if (viewType === 'fund') {
            statsArea.innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">最大资金量</div>
                    <div class="stat-value" style="color:#ff0000">${stats.maxValueLabel}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">最小资金量</div>
                    <div class="stat-value" style="color:#00ff00">${stats.minValueLabel}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">资金流入板块</div>
                    <div class="stat-value">${stats.inflowCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">净流入资金</div>
                    <div class="stat-value" style="color:${stats.netInflowValue >= 0 ? '#ff0000' : '#313695'}">${stats.netInflowLabel}</div>
                </div>
            `;
        } else {
            statsArea.innerHTML = `
                <div class="stat-item">
                    <div class="stat-label">最大涨跌幅</div>
                    <div class="stat-value" style="color:#ff0000">${stats.maxValueLabel}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">最小涨跌幅</div>
                    <div class="stat-value" style="color:#00ff00">${stats.minValueLabel}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">上涨板块</div>
                    <div class="stat-value" style="color:#006837">${stats.riseCount}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">平均涨跌</div>
                    <div class="stat-value" style="color:${stats.avgChangeValue >= 0 ? '#006837' : '#a50026'}">${stats.avgChangeLabel}</div>
                </div>
            `;
        }
    }

    // ========== 工具方法 ==========

    // 获取工具提示格式化器
    getTooltipFormatter(viewType) {
        return (params, options, event) => {
            if (!params.treeAncestors || params.treeAncestors.length < 2) return ''
            const data = params.data;
            const item = data.item;
            const actualValue = data.actualValue;
            const sortIndex = data.sortIndex;

            // 确保数值有效
            const displayValue = isNaN(actualValue) || !isFinite(actualValue) ? 0 : actualValue;

            if (viewType === 'fund') {
                const valueInYi = (displayValue / 100000000).toFixed(2);
                const absValueInYi = (Math.abs(displayValue) / 100000000).toFixed(2);

                return `
                    <div style="font-weight:bold; margin-bottom:8px; font-size:16px; color:#333">${item.name}</div>
                    <div style="margin-bottom:4px; color:#666">资金量排序：<strong style="color:#1a237e">第${sortIndex}位</strong></div>
                    <div style="margin-bottom:4px; color:#666">资金流向: <strong style="color:${displayValue >= 0 ? '#d73027' : '#313695'}">${valueInYi} 亿元 </strong></div>
                    <div style="margin-bottom:4px; color:#666">涨跌幅: <strong style="color:${item.change >= 0 ? '#006837' : '#a50026'}">${item.change}%</strong></div>
                `;
            } else {
                const absValue = Math.abs(displayValue);

                return `
                    <div style="font-weight:bold; margin-bottom:8px; font-size:16px; color:#333">${item.name}</div>
                    <div style="margin-bottom:4px; color:#666">涨跌幅排序：<strong style="color:#1a237e">第${sortIndex}位</strong></div>
                    <div style="margin-bottom:4px; color:#666">涨跌幅: <strong style="color:${displayValue >= 0 ? '#006837' : '#a50026'}">${displayValue.toFixed(2)}% </strong></div>
                    <div style="margin-bottom:4px; color:#666">资金流向: <strong style="color:${item.amount >= 0 ? '#d73027' : '#313695'}">${(item.amount / 100000000).toFixed(2)} 亿元</strong></div>
                `;
            }
        };
    }

    // 辅助函数：根据背景色获取对比文字颜色
    getContrastColor(hexColor) {
        // 移除#号
        const hex = hexColor.replace('#', '');

        // 转换为RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        // 计算亮度 (YIQ公式)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        // 根据亮度返回黑色或白色
        return brightness > 128 ? '#333333' : '#ffffff';
    }

    // ========== 主渲染方法 ==========

    // 渲染矩形树图
    render() {
        // 准备数据
        const data = this.prepareTreemapData(this.currentView);
        const stats = this.calculateStats(data, this.currentView);

        // 获取工具提示格式化器
        const tooltipFormatter = this.getTooltipFormatter(this.currentView);
        const visualMapRight = Math.max(10, this.marginRight - 20); // 确保颜色标尺在边距内
        const max = Math.max()
        // 配置选项
        const option = {
            title: {
                text: '资金流入热力图',
                subtext: '点击按钮切换不同数据集',
                left: 'center',
                textStyle: {
                    fontSize: 18,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: tooltipFormatter,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: { color: '#333' },
                extraCssText: 'box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; padding: 12px;'
            },
            grid: {
                left: this.marginLeft,
                right: this.marginRight,
                top: 60,  // 给标题留出空间
                bottom: 20,
                containLabel: true
            },
            // 显示visualMap
            visualMap: {
                show: true,
                type: 'continuous',
                min: -data.maxAbsValue,// data.minAbsValue,
                max: data.maxAbsValue,// data.maxAbsValue,
                orient: 'vertical',
                right: 0, //visualMapRight,//'20px',
                top: 60,//'center',
                itemHeight: 300,
                text: [this.currentView === 'fund' ? '资金量(亿)' : '涨跌幅(%)'],
                textStyle: {
                    color: '#333',
                    fontSize: 13,
                    fontWeight: '500'
                },
                // 使用指定的颜色方案
                inRange: {
                    color: this.colorScheme
                },
                // 格式化显示值
                formatter: (value) => {
                    if (this.currentView === 'fund') {
                        return (value / 100000000).toFixed(1) + '亿';
                    } else {
                        return value.toFixed(2) + '%';
                    }
                }
            },
            series: [{
                name: '行业板块',
                type: 'treemap',
                data: data.treemapData,
                left: this.marginLeft,
                right: visualMapRight, //this.marginRight,
                top: 60,
                minSize: '1%',
                maxSize: '5%',
                leafDepth: 1,
                levels: [{
                    itemStyle: {
                        borderColor: '#fff',
                        borderWidth: 1,
                        gapWidth: 2
                    }
                }],
                roam: false,
                nodeClick: false,
                breadcrumb: { show: false },
                label: {
                    show: true,
                    formatter: (params) => {
                        if(params.treeAncestors.length < 2) return '';
                        const item = params.data.item;
                        const fundValue = (item.amount / 100000000).toFixed(1);
                        const changeValue = item.change.toFixed(2);
                        const sortIndex = params.data.sortIndex;

                        // 为前3名添加特殊标记
                        const isTop = sortIndex <= 3;
                        const topMark = isTop ? `TOP ${sortIndex}\n` : '';

                        // 根据背景色亮度调整文字颜色
                        const bgColor = params.data.itemStyle?.color || '#ffffff';
                        const textColor = this.getContrastColor(bgColor);

                        return `${topMark}{name|${item.name}}\n{fund|${fundValue}亿}\n{change|${changeValue}%}`;
                    },
                    rich: {
                        name: {
                            fontSize: 12,
                            fontWeight: 'bold',
                            lineHeight: 20,
                            padding: [1, 0],
                            color: '#333',
                            textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                        },
                        fund: {
                            fontSize: 10,
                            lineHeight: 20,
                            padding: [1, 0],
                            color: '#333',
                            textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                        },
                        change: {
                            fontSize: 10,
                            lineHeight: 20,
                            padding: [1, 0],
                            color: '#333',
                            textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                        }
                    }
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        color: '#fff',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                    },
                    itemStyle: {
                        borderColor: '#333',
                        borderWidth: 2,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                sort: 'descending',
                squareRatio: 0.5 * (1 + Math.sqrt(5)),
                animation: true,
                animationDuration: 1000,
                animationEasing: 'cubicOut'
            }]
        };

        // 设置图表选项
        this.chart.setOption(option, true);

        // 更新UI组件
        //this.updateLegend(this.currentView, data);
        //this.updateStats(this.currentView, stats);
    }

    // ========== 工具方法 ==========

    // 调整图表大小
    resize() {
        if (this.chart) { this.chart.resize(); }
    }
    dispose() {
        if (this.myChart) {
            try {
                this.chart.dispose();
            } catch (e) {
                // 忽略错误
            }
            this.chart = null;
        }
    }
    // 获取图表实例
    getChartInstance() {
        return this.chart;
    }

    // 更新数据
    updateData(newData) {
        this.rawData = newData;
        //this.render();
        this.chart.setOption({
            series: [{
                data: this.rawData,
                animation: true,
                animationDuration: 1000
            }]
        })
    }
    updateView(data, view) {
        this.rawData = data;
        this.currentView = view;
        //this.init();
        this.render();
    }
    // 设置颜色方案
    setColorScheme(newColorScheme) {
        this.colorScheme = newColorScheme;
        this.render();
    }
}
