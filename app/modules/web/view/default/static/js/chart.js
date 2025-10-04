class StockChart {
    constructor(canvasId, data) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.data = data;
        this.displayData = [];
        this.tooltip = document.getElementById('dataTooltip');
        this.hoveredIndex = null;

        // 初始化Canvas尺寸
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 添加鼠标事件监听
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.hideTooltip());
    }

    resizeCanvas() {
        /*const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;*/
        this.draw();
    }

    setData(data) {
        this.data = data;
        this.updateDisplayData(0.3); // 默认显示30%的数据
    }

    updateDisplayData(percentage) {
        const totalPoints = this.data.length;
        const displayCount = Math.max(10, Math.floor(totalPoints * percentage));

        // 最新日期固定在右侧，增加的是历史数据
        const startIndex = Math.max(0, totalPoints - displayCount);
        this.displayData = this.data.slice(startIndex, totalPoints);

        this.draw();

        // 更新统计信息
        this.updateStats(displayCount, startIndex);
    }

    updateStats(displayCount, startIndex) {
        //document.getElementById('displayData').textContent = displayCount;
        //document.getElementById('dataRangeValue').textContent = `${startIndex + 1}-${startIndex + displayCount}`;
        //document.getElementById('latestDate').textContent = this.data[this.data.length - 1].date;
    }

    draw() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.displayData.length === 0) return;

        // 设置边距
        this.padding = {
            top: 50,
            right: 40,
            bottom: 80,
            left: 70
        };

        this.chartWidth = this.canvas.width - this.padding.left - this.padding.right;
        this.chartHeight = this.canvas.height - this.padding.top - this.padding.bottom;

        // 绘制坐标轴和网格
        this.drawGrid();

        // 绘制柱状图（涨停和跌停数量）
        this.drawBarChart();

        // 绘制曲线图（连板家数和最高板数）
        this.drawLineChart();

        // 绘制标题
        this.drawTitle();

        // 如果有点被悬停，绘制高亮点
        if (this.hoveredIndex !== null) {
            this.drawHoveredPoint();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // 水平网格线
        const ySteps = 5;
        for (let i = 0; i <= ySteps; i++) {
            const y = this.padding.top + (this.chartHeight / ySteps) * i;

            this.ctx.beginPath();
            this.ctx.moveTo(this.padding.left, y);
            this.ctx.lineTo(this.padding.left + this.chartWidth, y);
            this.ctx.stroke();

            // Y轴刻度值
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText((80 - i * 16).toString(), this.padding.left - 10, y);
        }

        // 垂直网格线（稀疏一些）
        const xSteps = 10;
        const step = Math.floor(this.displayData.length / xSteps);
        for (let i = 0; i <= xSteps; i++) {
            const x = this.padding.left + (this.chartWidth / xSteps) * i;

            this.ctx.beginPath();
            this.ctx.moveTo(x, this.padding.top);
            this.ctx.lineTo(x, this.padding.top + this.chartHeight);
            this.ctx.stroke();

            // X轴刻度值（日期）
            if (i < xSteps) {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'top';
                const index = Math.min(i * step, this.displayData.length - 1);
                const dateStr = this.displayData[index].date.substring(5); // 显示月-日
                this.ctx.fillText(dateStr, x, this.padding.top + this.chartHeight + 10);
            }
        }

        // 绘制Y轴标签
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.save();
        this.ctx.translate(20, this.padding.top + this.chartHeight / 2);
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.fillText('数量/家数', 0, 0);
        this.ctx.restore();

        // 绘制X轴标签
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('交易日', this.padding.left + this.chartWidth / 2, this.canvas.height - 20);
    }

    drawBarChart() {
        if (this.displayData.length === 0) return;

        const barWidth = this.chartWidth / this.displayData.length * 0.7;
        const gap = (this.chartWidth / this.displayData.length) * 0.3;
        const yScale = this.chartHeight / 80; // 假设最大值为80

        // 存储每个柱子的坐标，用于鼠标交互
        this.barCoordinates = [];

        this.displayData.forEach((dayData, index) => {
            const x = this.padding.left + index * (barWidth + gap);

            // 绘制涨停数量柱状图（绿色）
            const upLimitHeight = dayData.upLimit * yScale;
            const upLimitY = this.padding.top + this.chartHeight - upLimitHeight;

            this.ctx.fillStyle = '#4CAF50';
            this.ctx.fillRect(x, upLimitY, barWidth, upLimitHeight);

            // 绘制跌停数量柱状图（红色，在涨停下方）
            const downLimitHeight = dayData.downLimit * yScale;
            const downLimitY = upLimitY + upLimitHeight; // 从涨停柱状图底部开始

            this.ctx.fillStyle = '#F44336';
            this.ctx.fillRect(x, downLimitY, barWidth, downLimitHeight);

            // 存储柱子坐标
            this.barCoordinates.push({
                x,
                y: upLimitY,
                width: barWidth,
                height: upLimitHeight + downLimitHeight,
                index,
                dayData
            });
        });
    }

    drawLineChart() {
        if (this.displayData.length < 2) return;

        const yScale = this.chartHeight / 80; // 假设最大值为80
        const xScale = this.chartWidth / (this.displayData.length - 1);

        // 存储每个点的坐标，用于鼠标交互
        this.pointCoordinates = [];

        // 绘制连板家数曲线（蓝色）
        this.ctx.strokeStyle = '#2196F3';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        this.displayData.forEach((dayData, index) => {
            const x = this.padding.left + index * xScale;
            const y = this.padding.top + this.chartHeight - dayData.continuation * yScale;

            // 存储点坐标
            this.pointCoordinates.push({
                x,
                y,
                index,
                type: 'continuation',
                value: dayData.continuation
            });

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // 绘制最高板数曲线（橙色）
        this.ctx.strokeStyle = '#FF9800';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        this.displayData.forEach((dayData, index) => {
            const x = this.padding.left + index * xScale;
            const y = this.padding.top + this.chartHeight - dayData.highest * yScale * 4; // 缩放最高板数，使其更明显

            // 存储点坐标
            this.pointCoordinates.push({
                x,
                y,
                index,
                type: 'highest',
                value: dayData.highest
            });

            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });

        this.ctx.stroke();

        // 绘制数据点
        this.pointCoordinates.forEach(point => {
            this.ctx.fillStyle = point.type === 'continuation' ? '#2196F3' : '#FF9800';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawTitle() {
        /*this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('股票市场数据可视化', this.canvas.width / 2, 10);

        // 绘制副标题
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('涨停/跌停数量(柱状图) | 连板家数/最高板数(曲线图)', this.canvas.width / 2, 35);*/
    }

    drawHoveredPoint() {
        if (this.hoveredIndex === null) return;

        const dayData = this.displayData[this.hoveredIndex];
        const x = this.padding.left + this.hoveredIndex * (this.chartWidth / (this.displayData.length - 1));

        // 绘制垂直参考线
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.setLineDash([5, 5]);
        this.ctx.lineWidth = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(x, this.padding.top);
        this.ctx.lineTo(x, this.padding.top + this.chartHeight);
        this.ctx.stroke();

        this.ctx.setLineDash([]);

        // 绘制数据点高亮
        const yScale = this.chartHeight / 80;

        // 连板家数点
        const continuationY = this.padding.top + this.chartHeight - dayData.continuation * yScale;
        this.ctx.fillStyle = '#2196F3';
        this.ctx.beginPath();
        this.ctx.arc(x, continuationY, 5, 0, Math.PI * 2);
        this.ctx.fill();

        // 最高板数点（缩放后）
        const highestY = this.padding.top + this.chartHeight - dayData.highest * yScale * 4;
        this.ctx.fillStyle = '#FF9800';
        this.ctx.beginPath();
        this.ctx.arc(x, highestY, 5, 0, Math.PI * 2);
        this.ctx.fill();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // 检查是否在图表区域内
        if (mouseX < this.padding.left || mouseX > this.padding.left + this.chartWidth ||
            mouseY < this.padding.top || mouseY > this.padding.top + this.chartHeight) {
            this.hideTooltip();
            return;
        }

        // 计算最接近的数据点索引
        const index = Math.round((mouseX - this.padding.left) / (this.chartWidth / (this.displayData.length - 1)));
        const clampedIndex = Math.max(0, Math.min(this.displayData.length - 1, index));

        if (clampedIndex !== this.hoveredIndex) {
            this.hoveredIndex = clampedIndex;
            this.showTooltip(clampedIndex, mouseX, mouseY);
            this.draw(); // 重绘以显示高亮点
        }
    }

    showTooltip(index, mouseX, mouseY) {
        const dayData = this.displayData[index];

        // 更新tooltip内容
        document.getElementById('tooltipDate').textContent = dayData.date;
        document.getElementById('tooltipUpLimit').textContent = dayData.upLimit;
        document.getElementById('tooltipDownLimit').textContent = dayData.downLimit;
        document.getElementById('tooltipContinuation').textContent = dayData.continuation;
        document.getElementById('tooltipHighest').textContent = dayData.highest;

        // 定位tooltip
        this.tooltip.style.left = `${mouseX + 15}px`;
        this.tooltip.style.top = `${mouseY - 40}px`;

        // 确保tooltip不超出画布
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const canvasRect = this.canvas.getBoundingClientRect();

        if (tooltipRect.right > canvasRect.right) {
            this.tooltip.style.left = `${mouseX - tooltipRect.width - 15}px`;
        }

        if (tooltipRect.bottom > canvasRect.bottom) {
            this.tooltip.style.top = `${mouseY - tooltipRect.height - 10}px`;
        }

        this.tooltip.classList.add('active');
    }

    hideTooltip() {
        this.tooltip.classList.remove('active');
        this.hoveredIndex = null;
        this.draw(); // 重绘以移除高亮点
    }
}
