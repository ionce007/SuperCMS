/*function initChart(containerId, rawData, options = { view: 'fund' }) {
    this.containerId = containerId;
    this.rawData = rawData;
    this.options = options;
    this.chart = null;
    this.currentView = options.view; //'fund';
    this.colorScheme = this.COLOR_SCHEME();
    this.marginLeft = 3;
    this.marginRight = 70;
    this.init();
}*/

let rawData = null;
let chart = null;
let currentView = 'fund';
let containerId = 'heatmapBlock';
let chartTitle = { title: '主力资金流入热力图', subtitle: '', label: { amount: '资金流入：', change: '涨跌幅：'}};
const colorScheme = COLOR_SCHEME();
const marginLeft = 3;
const marginRight = 70;


function COLOR_SCHEME() { 
    return ["#00ff00","#11ff11", "#22ff22", "#33ff33","#44ff44","#55ff55", "#66ff66", "#77ff77","#88ff88","#99ff99","#aaffaa","#bbffbb", "#ccffcc", "#ddffdd","#eeffee",'#ffffff',
         "#ffeeee","#ffdddd","#ffcccc","#ffbbbb", "#ffaaaa","#ff9999","#ff8888", "#ff7777","#ff6666", "#ff5555","#ff4444", "#ff3333","#ff2222", "#ff1111","#ff0000"];
}
// 初始化图表
function initEChart(data, chartContainer, currView, title = { title: '主力资金流入热力图', subtitle: '', label: { amount: '资金流入：', change: '涨跌幅：'}}) {
    containerId = !chartContainer ? 'heatmapBlock' : chartContainer;
    currentView = !currView ? 'fund' : currView;
    chartTitle = title;
    // 初始化ECharts实例
    chart = echarts.init(document.getElementById(containerId), null, {
        renderer: 'canvas',
        useDirtyRect: false,
        useCoarsePointer: true,
        pointerSize: 44
    });
    rawData = data;
    // 初始渲染
    render();
    chart.on('click', function(params) {
        console.log('chart on click');
    });
}

// ========== 数据准备方法 ==========

// 准备矩形树图数据 - 按当前视图数值排序
function prepareTreemapData(viewType) {
    currentView = viewType;
    // 按当前视图的数值排序
    let sortedData;
    if (currentView === 'fund') {
        // 资金流向视图：按资金量绝对值降序排序
        sortedData = [...rawData].sort((a, b) => {
            const valA = Math.abs(a.amount);
            const valB = Math.abs(b.amount);
            return valB - valA; // 资金量越大越靠前
        });
    } else {
        // 涨跌幅视图：按涨跌幅绝对值降序排序
        sortedData = [...rawData].sort((a, b) => {
            const valA = Math.abs(a.change);
            const valB = Math.abs(b.change);
            return valB - valA; // 涨跌幅越大越靠前
        });
    }

    // 计算当前视图的数值范围
    const values = sortedData.map(d => currentView === 'fund' ? d.amount : d.change);
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
    const negaData = currentView === 'fund' ? rawData.filter(x=>x.amount < 0).sort((a,b)=>{return b.amount-a.amount}) : rawData.filter(x=>x.change < 0).sort((a,b)=>{return b.change-a.change});
    const posiData = currentView === 'fund' ? rawData.filter(x=>x.amount >= 0).sort((a,b)=>{return a.amount-b.amount}) : rawData.filter(x=>x.change >= 0).sort((a,b)=>{return b.change-a.change});
    const negaCount = negaData.length;
    const posiCount = posiData.length;
    const negativeColor = colorScheme.slice(0, colorScheme.length / 2 ); //负值颜色取值范围
    const positiveColor = colorScheme.slice(colorScheme.length / 2 ); //正值颜色取值范围

    const treemapData = sortedData.map((item, index) => {
        const value = currentView === 'fund' ? item.amount : item.change;
        const absValue = Math.abs(value);
        let dataPos = -1;
        // 计算颜色索引（基于绝对值在整个范围内的位置）
        let colorIndex = getColorIndex(item, posiData, negaData, positiveColor, negativeColor)

        /*if (maxAbsValue === minAbsValue) {
            colorIndex = parseInt(colorScheme.length / 2); // 7; // 中间位置（白色）
        } else {
            const normalized = (absValue - minAbsValue) / (maxAbsValue - minAbsValue);
            colorIndex = Math.floor(normalized * (colorScheme.length - 1));
        }*/

        return {
            name: item.name,
            value: absValue, // treemap使用value确定矩形大小
            actualValue: value, // 实际值（带正负）
            item: item,
            sortIndex: index + 1,
            // 计算颜色 - 根据绝对值大小从颜色方案中选取
            colorIndex: colorIndex,
            itemStyle: {
                color: colorScheme[colorIndex]
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
function getColorIndex(item, posiData, negaData, positiveColor, negativeColor){
    let result = -1;
    if(currentView === 'fund'){
        if(item.amount >= 0) {
            dataPos = posiData.indexOf(item);
            result = getRelativePosition(posiData, dataPos, positiveColor);
            result = result + negativeColor.length;
        }
        else {
            dataPos = negaData.indexOf(item);
            result = getRelativePosition(negaData, dataPos, negativeColor);
        }
    }
    else{
        if(item.change >= 0) 
        {
            dataPos = posiData.indexOf(item);
            result = getRelativePosition(posiData, dataPos, positiveColor);
            result = (positiveColor.length - result ) + negativeColor.length;
        }
        else {
            dataPos = negaData.indexOf(item);
            result = getRelativePosition(negaData, dataPos, negativeColor);
        }
    }
    return result;
}
function getRelativePosition(arrayA, indexInA, arrayB) {
    // 确保索引有效
    if (indexInA < 0 || indexInA >= arrayA.length) return -1; // 或抛出错误
    // 计算比例位置
    const ratio = indexInA / (arrayA.length - 1 || 1); // 避免除以0
    const positionInB = Math.round(ratio * (arrayB.length - 1));
    return Math.min(positionInB, arrayB.length - 1);
}
// 计算统计信息
function calculateStats(data, viewType) {
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
function switchToFundView() {
    if (currentView !== 'fund') {
        currentView = 'fund';
        render();
        return true;
    }
    return false;
}

// 公共方法：切换到涨跌幅视图
function switchToChangeView() {
    if (currentView !== 'change') {
        currentView = 'change';
        render();
        return true;
    }
    return false;
}

// 获取工具提示格式化器
function getTooltipFormatter(viewType) {
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
function getContrastColor(hexColor) {
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
function render() {
    // 准备数据
    const data = prepareTreemapData(currentView);
    //const stats = calculateStats(data, currentView);

    // 获取工具提示格式化器
    const tooltipFormatter = getTooltipFormatter(currentView);
    const visualMapRight = Math.max(10, marginRight - 20); // 确保颜色标尺在边距内
    //const max = Math.max()
    // 配置选项
    const option = {
        title: {
            text: chartTitle.title, //'资金流入热力图',
            subtext: chartTitle.subtitle, //'点击按钮切换不同数据集',
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
            left: marginLeft,
            right: marginRight,
            top: 60,  // 给标题留出空间
            bottom: 20,
            containLabel: true
        },
        // 显示visualMap
        visualMap: {
            show: true,
            type: 'continuous',
            min: data.minValue,// data.minAbsValue,
            max: data.maxValue,// data.maxAbsValue,
            orient: 'vertical',
            right: 0, //visualMapRight,//'20px',
            top: 60,//'center',
            itemHeight: 300,
            text: [currentView === 'fund' ? '资金量(亿)' : '涨跌幅(%)'],
            textStyle: {
                color: '#333',
                fontSize: 13,
                fontWeight: '500'
            },
            // 使用指定的颜色方案
            inRange: {
                color: colorScheme
            },
            // 格式化显示值
            formatter: (value) => {
                if (currentView === 'fund') {
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
            left: marginLeft,
            right: visualMapRight, //marginRight,
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
            nodeClick: 'zoomToNode', // 点击节点缩放
            breadcrumb: {
                show: true,
                height: 22,
                itemStyle: {
                    color: '#3498db',
                    borderColor: '#2980b9'
                }
            },
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
                    const textColor = getTextColor(bgColor, { preferDark: true });// getContrastColor(bgColor);
                    let label = '';
                    if( params.dataIndex === 1 ) label = `${topMark}{name|${item.name}}\n${chartTitle.label.amount}{fund|${fundValue}亿}\n${chartTitle.label.change}{change|${changeValue}%}`;
                    else label = `${topMark}{name|${item.name}}\n{fund|${fundValue}亿}\n{change|${changeValue}%}`;
                    return label;
                },
                color: (params) => {
                    const bgColor = params.data?.itemStyle?.color || params.color;
                    //console.log('params.data.itemStyle = ', params.data.itemStyle,'     params.color = ', params.color);
                    return getTextColor(bgColor);
                },
                rich: {
                    name: {
                        fontSize: 14,
                        fontWeight: 'bold',
                        lineHeight: 20,
                        padding: [1, 0],
                        color: '#333', /*(params) => {
                            const bgColor = params.data.itemStyle?.color || '#ffffff';
                            const textColor = getTextColor(bgColor, { preferDark: true });
                            console.log('params.data.itemStyle = ', params.data.itemStyle);
                            return textColor; 
                        },*///'#333'
                        textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                    },
                    fund: {
                        fontSize: 14,
                        lineHeight: 20,
                        padding: [1, 0],
                        color: '#333',
                        textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
                    },
                    change: {
                        fontSize: 14,
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
    chart.setOption(option, true);
}
function getTextColor(backgroundColor, options = {}) {
    const isLarge = true;
    const isHighContrast = true;
    
    const config = {
        preferDark: options.preferDark || false,
        preferLight: options.preferLight || false,
        targetLevel: isHighContrast ? 'AAA' : 'AA',
        textSize: isLarge ? 'large' : 'normal'
    };
    
    return AutoTextColor.getAccessibleTextColor(backgroundColor, config);
}
// ========== 工具方法 ==========

// 调整图表大小
function resize() {
    if (chart) { chart.resize(); }
}
function dispose() {
    if (chart) {
        try {
            chart.dispose();
        } catch (e) {
            // 忽略错误
            console.log('dispose echart error：', e);
        }
        chart = null;
    }
}
// 更新数据
function updateData(newData) {
    rawData = newData;
    render();
}
function updateView(data, view) {
    rawData = data;
    currentView = view;
    render();
}
function updateChart(data, view, title){
    if(view) currentView = view;
    chartTitle = title;
    rawData = data;
    render();
}
// 设置颜色方案
function setColorScheme(newColorScheme) {
    colorScheme = newColorScheme;
    render();
}

window.addEventListener('resize', function() {
    resize();
});