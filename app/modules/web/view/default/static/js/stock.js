function renderTHSTemplate(item) {
    return `<div class="data-item">
            <div class="item-content">
                <div class="item-meta mb-5">
                    <span class="hot-order ${item.order == 1 ? 'gold-color' : (item.order == 2 ? 'silver-color' : (item.order == 3 ? 'coppery-color' : 'iron-color'))}">${item.order}</span>
                    <span class="hot-name">${item.name}</span>
                    <span class="hot-code">${item.code}</span>
                    <span class="hot-zf ${!item.rise_and_fall ? '' : (item.rise_and_fall >= 0 ? 'red' : 'green')}">${!item.rise_and_fall ? '--' : (item.rise_and_fall.toFixed(2) + '%')}</span>
                    <span class="hot-redu-label">热度：</span>
                    <span class="hot-redu">${!item.rate ? '--' : ((Number(item.rate) / 10000).toFixed(2) + '万')}</span>
                </div>
                <div class="item-meta mb-5">
                    <span class="hot-rank-chg ${item.hot_rank_chg >= 0 ? 'red' : 'green'}">${item.hot_rank_chg > 0 ? '▲' : (item.hot_rank_chg == 0 ? '●' : '▼')} ${Math.abs(item.hot_rank_chg)}</span>
                    ${showPopularityTag(item.tag)}
                    ${showConceptTag(item.tag)}
                </div>
                ${showAnalyseTitle(item)}
            </div>
        </div>`
}
function showAnalyseTitle(item) {
    if (!item.analyse_title) return "";
    let tagHtml = `<span class="analyse-title">${item.analyse_title}</span>`;
    tagHtml += `<span class="analyse-detail" data-content="${item.analyse}" subtitle="${item.analyse_title}" title="“${item.name}”上榜原因" subtitle="${item.analyse_title}"> > </span>`
    return tagHtml;
}
function showPopularityTag(tag) {
    if (!tag) return "";
    if (!tag.popularity_tag) return "";
    return `<span class="popularity-tag">${tag.popularity_tag}</span>`;
}
function showConceptTag(tag) {
    if (!tag) return "";
    if (!tag.concept_tag) return "";
    if (tag.concept_tag.length === 0) return "";
    let tagHtml = "";
    tag.concept_tag.forEach(item => {
        tagHtml += `<span class="concept-tag ml-3">${item}</span>`
    })
    return tagHtml;
}
function removeNodataNode(tabId) {
    const selector = `#${tabId} > .nodata-error`;
    const nodata = document.querySelectorAll(selector);
    if (nodata && nodata.length > 0) nodata.forEach(item => { item.remove(); })
}
async function showNodataOrError(msg, tabId) {
    const html = `<div class="nodata-error"><div>${msg}</div></div>`
    removeNodataNode(tabId);
    const tab = document.getElementById(tabId);
    const dataList = tab.querySelector('.data-list');
    dataList.innerHTML = html;
    //tab.insertAdjacentHTML('beforeend', html);
}
async function fillTHSData(timeType) {
    if (!timeType) timeType = 'hour';
    let apiUrl = `/api/t/hotstock?type=${timeType}`

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status_code !== 0 || !data.data || !data.data.stock_list || data.data.stock_list.length === 0) return showNodataOrError('未查询互相关数据！', "tab1");
            let dataList = document.getElementById('thsHotStock');
            const list = data.data.stock_list;
            const html = list.map(item => renderTHSTemplate(item)).join('');
            dataList.innerHTML = html;
            showModalDialog();
        })
        .catch(error => {
            console.error('Error:', error);
            showNodataOrError('系统出错，请稍后再试......', "tab1");
        });
    /*
    const res = await fetch(apiUrl)
    const data = await res.json();
    const list = data.data.stock_list;
    const dataList = document.getElementById('thsHotStock');
    const html = list.map( (item) => {return renderTHSTemplate(item) } ).join('');
    dataList.innerHTML = html;
    */
}
async function fillCLSData() {
    let apiUrl = '/api/c/hotstock'
    fetch(apiUrl)
        .then(response => response.json())
        .then(async (data) => {
            if (data.errno !== 0 || !data.data || data.data.length === 0) return await showNodataOrError('未查询互相关数据！', "tab3");
            let dataList = document.getElementById('clsHotStock');
            const list = data.data;
            const html = list.map((item, index) => renderCLSTemplate(item, index)).join('');
            dataList.innerHTML = html;
            showModalDialog();
        })
        .catch(async (error) => {
            console.error('Error:', error);
            await showNodataOrError('系统出错，请稍后再试......', "tab3");
        });
}
function renderCLSTemplate(item, index) {
    index = index + 1;
    return `<div class="data-item">
            <div class="item-content">
                <div class="item-meta mb-5">
                    <span class="hot-order ${index == 1 ? 'gold-color' : (index == 2 ? 'silver-color' : (index == 3 ? 'coppery-color' : 'iron-color'))}">${index}</span>
                    <span class="hot-name">${item.stock.name}</span>
                    <span class="hot-code">${item.stock.StockID.substring(2)}</span>
                    <span class="hot-funs-label ml-5">涨幅</span>
                    <span class="hot-zf ${!item.stock.RiseRange ? '' : (item.stock.RiseRange >= 0 ? 'red' : 'green')}">${!item.stock.RiseRange ? '--' : item.stock.RiseRange.toFixed(2) + '%'}</span>
                    <span class="hot-funs-label">现价</span>
                    <span class="hot-gujia">${item.stock.last}</span>
                </div>
                <div class="item-meta mb-5">
                    <span class="hot-rank-chg ${item.ranking_change >= 0 ? 'red' : 'green'}">${item.ranking_change > 0 ? '▲' : (item.ranking_change == 0 ? '●' : '▼')} ${Math.abs(item.ranking_change)}</span>
                    ${showCLSResean(item)}
                </div>
                ${showCLSAnalyseTitle(item)}
            </div>
        </div>`
}
function showCLSResean(item) {
    if (!item || !item.reason) return "";

    let tagHtml = "";
    if (item.reason.up_num) tagHtml = `<span class="popularity-tag">${item.reason.up_num}</span>`
    item.reason.rel_plate.forEach(block => {
        tagHtml += `<span class="concept-tag ml-3">${block.plate_name}</span>`
    })
    return tagHtml;
}
function showCLSAnalyseTitle(item) {
    if (!item || !item.stock || !item.reason) return "";
    if (!item.reason.up_reason) return "";

    let tagHtml = `<span class="analyse-title">${item.reason.up_reason.substring(0, 20)}...</span>`;
    tagHtml += `<span class="analyse-detail" data-content="${item.reason.up_reason}" data-key="${item.stock.name}"> > </span>`
    return tagHtml;
}
async function fillDFCFData() {
    let apiUrl = '/api/d/hotstock'
    fetch(apiUrl)
        .then(response => response.json())
        .then(async (data) => {
            if (data.code !== 0 || !data.data || data.data.length === 0) return await showNodataOrError('未查询互相关数据！', "tab2");
            apiUrl = '/api/d/HotStockGubaTopic';
            const secCodes = data.data.map(item => item.sc).join(',');
            const body = { stockCode: secCodes }
            const topicRes = await fetch(apiUrl, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const topicData = await topicRes.json();
            let dataList = document.getElementById('dfcfHotStock');
            const list = data.data;
            const html = list.map(item => renderDFCFTemplate(item, topicData.re)).join('');
            dataList.innerHTML = html;
            showModalDialog();
        })
        .catch(async (error) => {
            console.error('Error:', error);
            await showNodataOrError('系统出错，请稍后再试......', "tab2");
        });
}
function renderDFCFTemplate(item, topic) {
    return `<div class="data-item">
            <div class="item-content">
                <div class="item-meta mb-5">
                    <span class="hot-order ${item.rk == 1 ? 'gold-color' : (item.rk == 2 ? 'silver-color' : (item.rk == 3 ? 'coppery-color' : 'iron-color'))}">${item.rk}</span>
                    <span class="hot-name">${item.detail.f14}</span>
                    <span class="hot-code">${item.detail.f12}</span>
                    <span class="hot-funs-label ml-5">涨幅</span>
                    <span class="hot-zf ${!item.detail.f3 ? '' : (item.detail.f3 >= 0 ? 'red' : 'green')}">${!item.detail.f3 ? '--' : item.detail.f3 + '%'}</span>
                    <span class="hot-funs-label">现价</span>
                    <span class="hot-gujia">${item.detail.f2}</span>
                </div>
                <div class="item-meta mb-5">
                    <span class="hot-rank-chg ${item.rc >= 0 ? 'red' : 'green'}">${item.rc > 0 ? '▲' : (item.rc == 0 ? '●' : '▼')} ${Math.abs(item.rc)}</span>
                    <span class="hot-funs-label">新粉</span>
                    <span class="hot-funs">${!item.funs ? "--" : item.funs.newUidRate}<span class="hot-funs-chg">(${!item.funs ? "--" : item.funs.newUidChangeRank})</span></span>
                    <span class="hot-funs-label ml-5">铁粉</span>
                    <span class="hot-funs">${!item.funs ? "--" : item.funs.oldUidRate}<span class="hot-funs-chg">(${!item.funs ? "--" : item.funs.oldUidChangeRank})</span></span>
                    <span class="hot-funs-label ml-5"></span>
                </div>
                <div class="item-meta mb-5">
                    ${showDFCFTag(item.tag)}
                </div>
                <div class="item-meta mb-5">
                    ${showDFCFAnalyseTitle(item, topic)}
                </div>
            </div>
        </div>`
}
//${showAnalyseTitle(item)}   <span class="hot-rank-chg noshow"></span>
function showDFCFAnalyseTitle(item, topic) {
    if (!item || !item.sc || !topic) return "";
    if (!topic[item.sc] || topic[item.sc].length === 0) return "";

    let tagHtml = `<span class="analyse-title">${topic[item.sc][0].name}</span>`;
    tagHtml += `<span class="analyse-detail" data-content="${topic[item.sc][0].summary}" title="“${item.detail.f14}”上榜原因" subtitle="${topic[item.sc][0].name}"> > </span>`
    return tagHtml;
}
function showDFCFTag(tag) {
    if (!tag || tag.length === 0) return "";
    let tagHtml = "";
    tag.forEach(item => {
        if (item.labelType === 1) tagHtml += `<span class="popularity-tag ml-35">${item.labelName}</span>`
        else tagHtml += `<span class="concept-tag ml-3">${item.labelName}</span>`
    })
    return tagHtml;
}
function fillAddNewConcept() {
    let apiUrl = '/api/t/concept';
    fetch(apiUrl)
        .then(response => response.json())
        .then(async (data) => {
            if (data.status_coee !== 0 || !data.data || data.data.length === 0 || !data.data.new_concept || data.data.new_concept.length === 0) return await showNodataOrError('未查询互相关数据！', "tab1");
            let dataList = document.getElementById('addNewConcept');
            const list = data.data.new_concept;
            const html = list.map((item) => renderNewConceptTemplate(item)).join('');
            dataList.innerHTML = html;
            loadContent();
            showModalDialog();
        })
        .catch(async (error) => {
            console.error('Error:', error);
            await showNodataOrError('系统出错，请稍后再试......', "tab1");
        });
}
function renderNewConceptTemplate(item) {
    return `<div class="data-item">
                <div class="item-content">
                    <div class="item-meta">
                        <span class="author">${formatDate(item.created_at, 'yyyy-MM-dd HH:mm')}</span>
                    </div>
                    <div class="item-meta concept-name" data-key="${item.concept.market},${item.concept.code}" data-url="${item.news_url}" title="“${item.concept.name}”概念指数">
                        <h3>${item.concept.name}</h3>
                        <span class="author" id="increase${item.concept.market}_${item.concept.code}">${item.increase}</span>
                    </div>
                    <div class="item-meta">
                        <p>${item.reason}</p>
                        <span class="analyse-detail concept-detail" data-content="${item.reason}" title="“${item.concept.name}”概念说明" subtitle=""> 更多 </span >
                    </div>
                </div>
            </div>`
}
// 触发内容加载完成事件
function loadContent() {
    const divs = document.querySelectorAll('.concept-name');
    // 加载内容...
    divs.forEach(item => {
        item.dispatchEvent(new Event('contentLoaded'));
        const dataKey = item.getAttribute("data-key");
        var spanName = `increase${dataKey.replace(',', '_')}`;
        let span = document.getElementById(spanName);
        const market = dataKey.split(',')[0];
        const code = dataKey.split(',')[1];
        const apiUrl = `/api/t/conceptQuote?id=${market}&code=${code}`;
        fetch(apiUrl).then(response => response.json())
            .then(data => {
                if (!data || data.code === -1 || !data.data || !data.data.increase) span.innerHTML = '--';
                else span.innerHTML = data.data.increase + "%";
            });
    })
}
function addLoadedEvent() {
    const divs = document.querySelectorAll('.concept-name');
    // 加载内容...
    divs.forEach(item => {
        item.addEventListener('contentLoaded', function () {
            console.log('内容已加载 (通过自定义事件)');
            console.log('time 2 = ', Date.now());
        });
    })
}

async function conceptQuote(item) {
    try {
        const apiUrl = `/api/t/conceptQuote?id=${item.concept.market}&code=${item.concept.code}`;
        const response = await fetch(apiUrl);
        const json = await response.json();
        if (!json || json.code === -1 || !json.data) return "--"
        return json.data.increase + "%";
    }
    catch (e) {
        console.log('error：', e.message);
        return '--';
    }
}
function fillConceptChange(date) {
    if (!date) date = getConceptChangeDate();
    //const ticks = new Date(date).getTime();
    const body = { date: date }
    const apiUrl = `/api/t/conceptTrends`
    fetch(apiUrl, { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(response => response.json())
        .then(async (data) => {
            if (!data || data.status_code !== 0 || !data.data || !data.data.concept_trends || !data.data.concept_trends.list || data.data.concept_trends.list.length === 0) return await showNodataOrError('未查询互相关数据！', "tab2");
            let dataList = document.getElementById('componentChange');
            const list = data.data.concept_trends.list;
            const html = list.map((item) => renderConceptChange(item)).join('');
            dataList.innerHTML = html;
            showModalDialog();
        })
        .catch(e => { console.log('error：', e.message) });
    //const topicData = await topicRes.json();
}
function getConceptChangeDate() {
    const sortedDates = [...allowDates].sort((a, b) => new Date(b) - new Date(a));
    return sortedDates[0];
}
function renderConceptChange(item) {
    return `<div class="data-item">
                <div class="item-meta flex-meta">
                    <span class="author">${formatDate(new Date(item.created_at), 'yyyy-MM-dd HH:mm')}</span>
                    <span class="views">${item.action === 'add_stock' ? "新增" : "删除"}</span>
                </div>
                <div class="concept-stock">
                    <div class="item-concept-stock">
                        <h3>${item.stock.name}</h3>
                        <p class="${item.stock.increase && item.stock.increase < 0 ? 'green' : 'red'}">${!item.stock.increase ? '--' : (item.stock.increase + '%')}</p>
                    </div>
                    <div class="item-concept-stock change-arrow">
                        <p>--></p>
                    </div>
                    <div class="item-concept-stock">
                        <h3>${item.concept.name}</h3>
                        <p class="${item.concept.increase < 0 ? 'green' : 'red'}">${item.concept.increase}%</p>
                    </div>
                </div>
                <div class="item-concept-desc">
                    <p>${item.reason}</p>
                    <span class="analyse-detail concept-detail" data-content="${item.reason}" title="“${item.stock.name}”概念变更说明" subtitle=""> 更多 </span >
                </div>
            </div>`;
}
function fillTomorrowFry() {
    const apiUrl = `/api/d/tomorrowFry`
    fetch(apiUrl, { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(async (data) => {
            if (!data || data.code !== 0 || !data.data || data.data.length === 0) return await showNodataOrError('未查询互相关数据！', "fryTomorrow");
            let dataList = document.getElementById('fryTomorrow');
            const list = data.data;
            const title = document.getElementById('tomorrowTitle');
            const tradeDate = new Date(list[0].tradeDate).getTime();
            if (tradeDate > new Date().getTime()) title.textContent = "明天炒什么";
            else title.textContent = "今天炒什么";
            const html = list.map((item) => renderTomorrowFryTemplate(item)).join('');
            dataList.innerHTML = html;
            //canvasDraw();
            showModalDialog();
        })
        .catch(e => { console.log('error：', e.message) });
}
function renderTomorrowFryTemplate(item) {
    if (!item.themeName) 
        return `<div class="data-item">
                <div class="item-content">
                    <div class="item-stock">
                        <div class="theme-title ">
                            <span class="theme-sortnum">${item.sortNum}</span>
                            <span class="theme-name ellipsis">${item.title}</span>
                        </div>
                        ${showHotImage(item)}
                    </div>
                    <p class="margin-12">${item.summary}</p>
                </div>
            </div>`;
    else 
        return `<div class="data-item">
                <div class="item-content">
                    <div class="item-stock">
                        <div class="theme-title ">
                            <span class="theme-sortnum">${item.sortNum}</span>
                            <span class="theme-name">${item.themeName}</span>
                            <span class="theme-ztnum">涨停${item.fex3}</span>
                        </div>
                        ${showHotImage(item)}
                    </div>
                    <p class="margin-12">${item.title}</p>
                    <div class="item-meta inline-flex gap-5">
                        <div class="item-stock-container">
                            <div class="item-stock">
                                <span>最近30日涨幅</span>
                                <span>${!item.cumulateF3 ? '--' : (item.cumulateF3.toFixed(2) + '%')}</span>
                            </div>
                            <div class="chart-container">
                                <canvas class="data-chart" width="150" height="70" data="${item.kLineList}"></canvas>
                            </div>
                        </div>
                        <div class="item-stock-container">
                            ${renderThemeStocks(item.stockList)}
                        </div>
                    </div>
                </div>
            </div>`
}
function showHotImage(item){
    if (item.isHot) return `<span><img src="/web/default/img/hotTheme.png" style="width:80px;height:22px;"/></span>`
    else return "";
}
function renderThemeStocks(stocks) {
    let html = '                            <span>相关个股</span>';
    if (!stocks || stocks.length === 0) return `<div class="item-stock"></div>`;
    stocks.forEach(item => {
        html += `                            <div class="item-stock">
                                <span class="item-stock-label">${item.name}</span>
                                <span class="item-stock-label">${item.f3.toFixed(2)}%</span>
                            </div>`;
    })
    return html;
}

function fillTodayChance() {
    const apiUrl = `/api/d/todayChance`
    fetch(apiUrl, { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(async (data) => {
            if (!data || data.code !== 0 || !data.data || data.data.length === 0) return await showNodataOrError('未查询互相关数据！', "todayChance");
            let dataList = document.getElementById('todayChance');
            const list = data.data;
            const html = list.map((item) => renderTodayChanceTemplate(item)).join('');
            dataList.innerHTML = html;
            showModalDialog();
        })
        .catch(e => { console.log('error：', e.message) });
}
function renderTodayChanceTemplate(item){
    return `                    <div class="data-item">
                        <div class="item-content">
                            <div class="item-meta expect-concept-name">
                                <h3>${item.themeName}</h3>
                                <span class="author"><span>热度：</span><span id="hotRank">${(item.hotValue * 1.0000 / item.hotValueUpLimit).toFixed(2)}</span></span>
                            </div>
                            <p class="concept-desc">${item.newsTitle}</p>
                            <div class="item-meta">
                                <span class="theme-trend"><span>涨跌：</span><span id="up_down">${item.f104}/${item.f106}/${item.f105}</span></span>
                                <span class="theme-trend"><span>涨跌停：</span><span id="updown_limit">${item.fex3}/${item.fex4}</span></span>
                                <span class="theme-trend"><span>净注入：</span><span id="fundIn">${(item.fex5/100000000).toFixed(2)}亿</span></span>
                            </div>
                            ${renderTodayChanceStock(item.stock)}
                        </div>
                    </div>`
}
function renderTodayChanceStock(stocks){
    if (!stocks || stocks.length === 0) return `<div class="item-meta"></div>`;
    var html = `<div class="item-meta">`;
    stocks.forEach(item => {
        html += `<span class="hotstock-today"><span>${item.name}</span><span id="stock" class="ml-5">${item.f3.toFixed(2)}%</span></span>`;
    })
    html += `</div>`
    return html;
}
function fillExpectTheme(){
    const apiUrl = `/api/d/expectHot`
    fetch(apiUrl, { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(async (data) => {
            if (!data || data.code !== 0 || !data.data || data.data.length === 0) return await showNodataOrError('未查询互相关数据！', "todayChance");
            let dataList = document.getElementById('expectTheme');
            const list = data.data;
            const toggle = `<button class="toggle-timeline">展开全部 ▼</button>`
            const html = list.map((item, index) => renderExpectThemeTemplate(item, index)).join('') + toggle;
            dataList.innerHTML = html;
            clickToggleButton();
            showModalDialog();
        })
        .catch(e => { console.log('error：', e.message) });
}
function renderExpectThemeTemplate(item, index){
    return `                    <div class="timeline-item ${index >= 3 ? "timeline-hidden-items" : ""}">
                            <div class="timeline-point"></div>
                            <div class="timeline-content">
                                <div class="timeline-date">${formatDate(new Date(item.date), "yyyy-MM-dd")}</div>
                                <div class="timeline-details">
                                    <div class="timeline-meta">
                                        <h3>${item.theme[0].name}</h3><span id="up_down" class="ml-15 pt-2">${item.theme[0].f3.toFixed(2)}%</span>
                                    </div>
                                    <p>${item.summary}</p>
                                </div>
                            </div>
                        </div>`;
}
function fillThemeList(){
    const apiUrl = `/api/d/themeList`
    fetch(apiUrl, { method: "GET", headers: { 'Content-Type': 'application/json' } })
        .then(response => response.json())
        .then(async (data) => {
            if (!data || data.code !== 0 || !data.data || !data.data.list || data.data.list.length === 0) return await showNodataOrError('未查询互相关数据！', "todayChance");
            let dataList = document.getElementById('themeList');
            const list = data.data.list;
            const html = list.map((item) => renderThemeListTemplate(item)).join('');
            dataList.innerHTML = html;
            showModalDialog();
        })
        .catch(e => { console.log('error：', e.message) });
}
function renderThemeListTemplate(item){
    return `                    <div class="data-item">
                        <div class="item-content p-5">
                            <div class="item-meta">
                                <div class="concept-info space-between">
                                    <span class="m-5">题材</span>
                                    ${item.label ? '<span class="theme-label">' + item.label + '</span>' : ""}
                                </div>
                                <div class="concept-info theme-detail-show">
                                    <h3 data-key="${item.themeCode}" title="${item.themeName}" hotValue="${item.hotValue}" hotValueUpLimit="${item.hotValueUpLimit}" class="show-theme-detail">${item.themeName}</h3>
                                    <span class="author">涨幅：<span class="red ml-0 pl-0">${!item.bf3 ? '--' : (item.bf3.toFixed(2) + '%')}</span></span>
                                    <span class="author">热度：<span class="ml-0 pl-0">${(!(item.hotValue && item.hotValueUpLimit)) ? '--' : (item.hotValue * 1.000 / item.hotValueUpLimit).toFixed(2)}</span></span>
                                </div>
                                <p class="theme-summary" title="“${item.themeName}”简介">${item.baseInfo.introduction}</p>
                                <div class="concept-info">
                                    <!--<span class="concept-upnum">${item.fex3}涨停</span>-->
                                    <span class="theme-statistics">涨跌统计：<span class="red">${!item.statistics.f104 ? (item.statistics.f104 === 0 ? '0' : '--') : item.statistics.f104}</span><span>/${!item.statistics.f106 ? (item.statistics.f106 ===0 ? '0' : '--') : item.statistics.f106}/</span><span class="green">${!item.statistics.f105 ? (item.statistics.f105 === 0 ? '0' : '--') : item.statistics.f105}</span></span>
                                    <span class="theme-statistics">涨跌停：<span class="red">${!item.statistics.fex3 ? (item.statistics.fex3 === 0 ? '0' : '--') : item.statistics.fex3}</span><span>/</span><span class="green">${!item.statistics.fex4 ? (item.statistics.fex4 === 0 ? '0' : '--') : item.statistics.fex4}</span></span>
                                    <span class="theme-statistics">净流入：<span class="${ item.statistics.fex5 && item.statistics.fex5 >= 0 ? 'red' : 'green'}">${!item.statistics.fex5 ? (item.statistics.fex5 === 0 ? '0' : '--') : (item.statistics.fex5 / 100000000).toFixed(2)}</span><span>亿</span></span>
                                </div>
                                <div class="concept-info space-between">
                                    <span class="m-5 up-stock">领涨个股</span>
                                    
                                </div>
                                <div class="concept-info theme-stocks">
                                    <h3 class="fs-14">${item.securityName}</h3>
                                    <span class="author">涨幅：<span class="red ml-0 pl-0">${!item.f3 ? (item.f3 === 0 ? '0' : '--') : (item.f3.toFixed(2) + '%')}</span></span>
                                    <span class="m-5 all-stock" data-key="${item.themeCode}" title="“${item.themeName}”成份股">全部成份股</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
}
function renderThemeDetailTemplate(data, hotValue, hotValueUpLimit){
    let html = "";//`<div class="theme-pane">`
    html += `<div class="data-item flex-row space-between no-border">`
    html += `<span class="">涨幅：${!data.statistic.f3 ? '--' : (data.statistic.f3.toFixed(2) + '%')}</span>`
    html += `<span class="">热度：${!(hotValue && hotValueUpLimit) ? '' : (hotValue * 1.000 / hotValueUpLimit).toFixed(2)}</span>`
    html += `</div>`
    html += `<p>${data.themeInfo.introduction}</p>`
    html += `<h3>相关股票</h3>`
    html += `<div class="data-item flex-row space-between no-border h-35">`
    html += `<span class="theme-statistics">涨跌统计：<span class="red">${data.statistic.f104}</span><span>/${data.statistic.f106}/</span><span class="green">${data.statistic.f105}</span></span>`
    html += `<span class="theme-statistics">涨跌停：<span class="red">${data.statistic.fex3}</span><span>/</span><span class="green">${data.statistic.fex4}</span></span>`
    html += `<span class="theme-statistics">净流入：<span class="${data.statistic.fex5 && data.statistic.fex5 >= 0 ? 'red' : 'green'}">${!data.statistic.fex5 ? '--' : (data.statistic.fex5 / 100000000).toFixed(2)}</span><span>亿</span></span>`
    html += `</div>`
    let stock_list_html = "";
    if (data.stockTable && data.stockTable.length > 0 && data.stockTable[0].keywordList && data.stockTable[0].keywordList.length > 0 && data.stockTable[0].keywordList[0].introduction){
        stock_list_html += `<div class="data-list theme-stock-list mt-15">`;
        data.stockTable.forEach(item => {
            stock_list_html += `<div class="data-item">
                <div class="item-content p-5">
                <div class="item-meta">
                <div class="concept-info concept-name-stock lh-h3-39">
                <h3>${item.securityName}${item.label ? ("<span class='theme-ztnum' style='font-size:10px;/*font-weight:300;padding:3px;*/'>" + item.label + "</span>") : ""}</h3>
                <span class="author">涨幅：<span class="${item.f3 >= 0 ? "red" : "green"} ml-0 pl-0">${!item.f3 ? '--' : (item.f3.toFixed(2) + '%')}</span></span>
                <span class="author">最新价：<span class="ml-0 pl-0">${!item.f2 ? '--' : item.f2.toFixed(2)}</span></span>
                <span class="author">流通市值：<span class="ml-0 pl-0">${!item.f21 ? '--' : ((item.f21 / 100000000).toFixed(2) + '亿')}</span></span>
                
                </div>
                <p class="theme-introduction">${item.keywordList[0].introduction}</p>
                </div></div></div>`
        })
        
    } else {
        stock_list_html += `<div class="data-item no-border grid-header">`;
        stock_list_html += `<span class="theme-statistics">股票名称</span>`
        stock_list_html += `<span class="theme-statistics">最新价</span>`
        stock_list_html += `<span class="theme-statistics">涨幅</span>`
        stock_list_html += `<span class="theme-statistics">流通市值</span>`
        stock_list_html += `</div>`
        stock_list_html += `<div class="data-list theme-stock-list">`;
        data.stockTable.forEach(item => {
            stock_list_html += `<div class="data-item no-border grid-cell">`;
            stock_list_html += `<span class="theme-statistics">${item.securityName}${item.label ? ("<span class='theme-ztnum' style='font-size:10px;font-weight:300;margin-left:1px;padding:2px 3px;'>" + item.label + "</span>") : ""}</span>`
            stock_list_html += `<span class="theme-statistics">${!item.f2 ? '--' : item.f2.toFixed(2)}</span>`
            stock_list_html += `<span class="theme-statistics ${item.f3 && item.f3 >= 0 ? "red" : "green"}">${!item.f3 ? '--' : (item.f3.toFixed(2) + '%')}</span>`
            stock_list_html += `<span class="theme-statistics">${!item.f21 ? '--' : ((item.f21 / 100000000).toFixed(2) + '亿')}</span>`
            stock_list_html += `</div>`
        })
    }
    html += stock_list_html;
    html += `</div>`;//</div>`
    return html;
}
function renderThemeComponentTemplate(item) {
    return `<div class="data-item no-border grid-cell-label">
        <span class="theme-statistics">${item.securityName}</span>
        <span class="theme-statistics">${!item.f2 ? '--' : item.f2.toFixed(2)}</span>
        <span class="theme-statistics ${item.f3 && item.f3 >= 0 ? "red" : "green"}">${!item.f3 ? '--' : (item.f3.toFixed(2) + '%')}</span>
        <span class="theme-statistics">${!item.f21 ? '--' : ((item.f21 / 100000000).toFixed(2) + '亿')}</span>
        <span class="theme-statistics">${item.label ? ("<span class='theme-ztnum' style='font-size:10px;font-weight:300;margin-left:1px;padding:2px 3px;'>" + item.label + "</span>") : ""}</span>
        </div>`
}
const EFFECT_FIELDS = [
    { order: 1, field: 'LIMIT_NUMBERS', name: '涨停家数', perChar: '' },
    { order: 2, field: 'SEALING_RATE', name: '封板率', perChar: '%' },
    { order: 3, field: 'LIMIT_PER_YES', name: '昨涨停表现', perChar: '%' },
    { order: 4, field: 'DAILY_LIMIT', name: '一字涨停', perChar: '' },
    { order: 5, field: 'NATURAL_LIMIT', name: '自然涨停', perChar: '' },
    { order: 6, field: 'TOUCH_LIMIT', name: '触及涨停', perChar: '' },
    { order: 7, field: 'LIMIT_DOWN_NUM', name: '跌停家数', perChar: '' },
    { order: 8, field: 'CJDT_NUM', name: '触及跌停', perChar: '' },
    { order: 9, field: 'DT_FBL', name: '跌停封板率', perChar: '%' },
]
function renderMoneyMakingeffectHtml(data){
    if (!data) return '';
    if (!document.getElementById('moneyEffect')) return;
    document.querySelector('.effect-img').src = getEffectImg(data.currData[0].MONEYMAKING_EFFECT)
    document.querySelector('.position-suggestion').textContent = data.currData[0].POSITION_SUGGESTION + '%';
    drawDashboard(document.getElementById('moneyEffect'), data.currData[0].MONEYMAKING_EFFECT);
    let fields = EFFECT_FIELDS.sort((a,b) => a.order - b.order);
    let html = '';
    fields.forEach(item => {
        html += `                                        <div class="swiper-slide">
                                        <div class="effect-item">
                                            <span class="fs-14">${item.name}</span>
                                            <div class="effect-item-data">
                                                <span class="effect-item-label">${ item.field === 'LIMIT_PER_YES' ? data.currData[0][item.field].toFixed(2) : data.currData[0][item.field] }${item.perChar}</span>
                                                <span class="effect-item-label">/</span>
                                                <span class="effect-item-label">${ item.field === 'LIMIT_PER_YES' ? data.prevData[0][item.field].toFixed(2) : data.prevData[0][item.field] }${item.perChar}</span>
                                            </div>
                                            <div class="effect-item-data effect-data-title">
                                                <span class="effect-item-label effect-title">今日</span>
                                                <span class="effect-item-label"> </span>
                                                <span class="effect-item-label effect-title">昨日</span>
                                            </div>
                                        </div>
                                    </div>`
    })
    return html;
}
function getEffectImg(value){
    return value <= 45 ? "/web/default/img/weak.png" : (value >= 65 ? "/web/default/img/strong.png" : "/web/default/img/medium.png")
}
function renderLimitUpLeaderHtml(data) {
    if(!data || !data.result || !data.result.data || data.result.data.length === 0) return `<div class='nodata-container'>暂无数据</div>`
    let html = '';
    data.result.data.forEach(item => {
        html += `                            <div class="data-item">
                                <div class="item-content pd-5">
                                    <div class="item-meta">
                                        <div class="limit-stock-name">${item.SECURITY_NAME_ABBR}</div>
                                        <div class="limitupdown-leader-label">${item.NDAYS_NLIMITE}</div>
                                    </div>
                                    <div class="item-meta flex-display justify-center">
                                        <span class="new-price pr-5 red">${item.NEWEST_PRICE}</span>
                                        <span class="stock-zf pl-5 red">${item.YIELD.toFixed(2)}%</span>
                                    </div>
                                    <div class="item-meta mb-5">
                                        <div class="concept-label ml-3">${item.BOARD_NAME}</div>
                                    </div>
                                </div>
                            </div>`
    });
    return html;
}
function renderAuctionLimitUpHtml(data){
    if(!data || data.length === 0) return `<div class='no-auction-data'>未查询到相关数据</div>`;
    const fields = [
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称', mapField: "f14"},
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价', mapField: "f2" },
        { order: 3, name: 'YIELD', cnName: '涨幅', mapField: "f3" },
        { order: 4, name: 'MISMATCH_LIMIT_AMOUNT', cnName: '涨停委买额', mapField: "f614" },
        { order: 5, name: 'MATCH_CHANGE_RATE', cnName: '竞价涨幅', mapField: "f615" },
        { order: 6, name: 'MATCH_DEAL_AMOUNT', cnName: '竞价金额', mapField: "f616" },
        { order: 7, name: 'MATCH_DEAL_VOLUME', cnName: '竞价量', mapField: "f617" },
        { order: 8, name: 'MISMATCH_VOLUME', cnName: '未匹配量', mapField: "f619" },
        { order: 9, name: 'MISMATCH_AMOUNT', cnName: '未匹配额', mapField: "f618" },
        { order: 10, name: 'MISMATCH_TURNOVERRATE', cnName: '竞价换手', mapField: "f620" },
        { order: 11, name: 'BOARD_NAME', cnName: '所属行业', mapField: "f100" }
    ].sort((a,b)=>a.order - b.order);

    let headerHtml = renderHeaders(fields);
    let dataHtml = renderAuctionDataRow(data, fields);;
    return `<table class="auction-table">${headerHtml}${dataHtml}</table>`;
}
function renderHeaders(headers) {
    let html = "";
    headers.forEach((item, index) => {
        html += `<th>${item.cnName}</th>`;
    })
    return `<thead><tr>${html}</tr></thead>`;
}
function renderAuctionDataRow(data, fields) {
    let html = "";
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.mapField] || item[field.name]
            const zf = item[fields[2].name] || item[fields[2].mapField]
            const isRZ = parseInt(item["IS_MARGININFO"]) || parseInt(item["f13"]);
            if (index === 0) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item["f12"]}${ isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (index === 1) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (index === 2 || index === 4) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2)}%</td>`;
            else if (index === 9) html += `<td>${formatNumberAdvanced(itemData, 2) }%</td>`;
            else if(index === 3 || (index >=5 && index <= 8)) {
                let numStr = formatNumberAdvanced(itemData, 2);
                html += `<td>${numStr}</td>`;
            }
            else html += `<td>${itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderHighQualityHtml(data){
    if (!data || data.length === 0) return `<div class='no-auction-data'>未查询到相关数据</div>`;
    const fields = [
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'ZTJY', cnName: '涨停基因' },
        { order: 5, name: 'NDAYS_NLIMITE', cnName: '几天几板' },
        { order: 6, name: 'SEALING_RATE_YEAR', cnName: '近一年封板率' },
        { order: 7, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 8, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 9, name: 'DEAL_AMOUNT', cnName: '成交金额' },
        { order: 10, name: 'FREE_MARKET_VALUE', cnName: '流通市值' }
    ].sort((a, b) => a.order - b.order);

    let headerHtml = renderHeaders(fields);
    let dataHtml = renderHighQualityDataRow(data, fields);;
    return `<table class="auction-table">${headerHtml}${dataHtml}</table>`;
}
function renderHighQualityDataRow(data, fields) {
    let html = "";
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            const order = field.order;
            let itemData =  order === 5 ? item.UNUSUAL_SITUATION || item[field.name] : (item[field.name] ? item[field.name] : '--');
            const zf = item[fields[2].name];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item["f12"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 ) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2)}%</td>`;
            else if (order === 4) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else if (order === 6 || order === 7) html += `<td>${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '' )}</td>`;
            else if (order === 9 || order === 10 ) {
                let numStr = formatNumberAdvanced(itemData, 2);
                html += `<td>${numStr}</td>`;
            }
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
const TABLE_HEADERS = {
    auction:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称', mapField: "f14" },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价', mapField: "f2" },
        { order: 3, name: 'YIELD', cnName: '涨幅', mapField: "f3" },
        { order: 4, name: 'MISMATCH_LIMIT_AMOUNT', cnName: '涨停委买额', mapField: "f614" },
        { order: 5, name: 'MATCH_CHANGE_RATE', cnName: '竞价涨幅', mapField: "f615" },
        { order: 6, name: 'MATCH_DEAL_AMOUNT', cnName: '竞价金额', mapField: "f616" },
        { order: 7, name: 'MATCH_DEAL_VOLUME', cnName: '竞价量', mapField: "f617" },
        { order: 8, name: 'MISMATCH_VOLUME', cnName: '未匹配量', mapField: "f619" },
        { order: 9, name: 'MISMATCH_AMOUNT', cnName: '未匹配额', mapField: "f618" },
        { order: 10, name: 'MISMATCH_TURNOVERRATE', cnName: '竞价换手', mapField: "f620" },
        { order: 11, name: 'BOARD_NAME', cnName: '所属行业', mapField: "f100" }
    ],
    limitnatural:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'LIMITUP_AMOUNT', cnName: '封单金额' },
        { order: 5, name: 'CLOSE_LIMITUP_TIME', cnName: '封板时间' },
        { order: 6, name: 'LIMITUP_NUM', cnName: '封单量' },
        { order: 7, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 8, name: 'LIMIT_REASON', cnName: '涨停原因' },
        { order: 9, name: 'NDAYS_NLIMITE', cnName: '几天几板' },
        { order: 10, name: 'LIMIT_WAY', cnName: '涨停方式' },
        { order: 11, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 12, name: 'NET_INFLOW', cnName: '主力净流入' },
        { order: 13, name: 'ZTJY', cnName: '涨停基因' },
    ],
    limitsoon:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称', mapField: 'f14' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价', mapField: 'f2' },
        { order: 3, name: 'YIELD', cnName: '涨幅', mapField: 'f3' },
        { order: 4, name: 'SPEED_UP', cnName: '涨速', mapField: 'f22' },
        { order: 5, name: 'BOARD_NAME', cnName: '所属行业', mapField: 'f100' },
        { order: 6, name: 'SPRINT_LIMIT_DATE', cnName: '冲板时间', mapField: 'aboutzdttime' },
        { order: 7, name: 'TURNOVERRATE', cnName: '换手率', mapField: 'f8' },
        { order: 9, name: 'NET_INFLOW', cnName: '主力净注入', mapField: 'f62' },
        { order: 10, name: 'DEAL_AMOUNT', cnName: '成交金额', mapField: 'f6' },
        { order: 11, name: 'FREE_MARKET_VALUE', cnName: '流通市值', mapField: 'f21' }
    ],
    limitdays:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'HLIMITEDAYS', cnName: '连板次数' },
        { order: 5, name: 'CLOSE_LIMITUP_TIME', cnName: '封板时间' },
        { order: 6, name: 'LIMITUP_NUM', cnName: '封单量' },
        { order: 7, name: 'LIMITUP_AMOUNT', cnName: '封单金额' },
        { order: 8, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 9, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 10, name: 'NET_INFLOW', cnName: '主力净注入' },
        { order: 11, name: 'ZTJY', cnName: '涨停基因' },
    ],
    touchlimit:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 5, name: 'OPEN_LIMITUP_TIME', cnName: '开板时间' },
        { order: 6, name: 'OPEN_LIMITUP_NUM', cnName: '开板次数' },
        { order: 7, name: 'NET_INFLOW', cnName: '主力净注入' },
        { order: 8, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 9, name: 'ZTJY', cnName: '涨停基因' },
    ],
    prelimit:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称', mapField: 'f14' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价', mapField: 'f2' },
        { order: 3, name: 'YIELD', cnName: '涨幅', mapField: 'f3' },
        { order: 4, name: 'SPEED_UP', cnName: '涨速', mapField: 'f22' },
        { order: 5, name: 'CLOSE_LIMITUP_TIME', cnName: '昨日封板时间', mapField: 'CLOSE_LIMITUP_TIME' },
        { order: 6, name: 'LIMIT_VOLUME', cnName: '昨封成比', mapField: 'LIMIT_VOLUME' },
        { order: 7, name: 'TURNOVERRATE', cnName: '换手率', mapField: 'f8' },
        { order: 8, name: 'NET_INFLOW', cnName: '主力净注入', mapField: 'f62' },
        { order: 9, name: 'DEAL_AMOUNT', cnName: '成交金额', mapField: 'f6' },
        { order: 10, name: 'FREE_MARKET_VALUE', cnName: '流通市值', mapField: 'f21' }
    ],
    declinelimited:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 5, name: 'HLIMITDOWN_TIME', cnName: '跌停时间' },
        { order: 6, name: 'OPEN_TIMES', cnName: '开板次数' },
        { order: 7, name: 'SEALING_RATE_YEAR', cnName: '近一年封板率' },
        { order: 8, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 9, name: 'NET_INFLOW', cnName: '主力净注入' },
        { order: 10, name: 'DEAL_AMOUNT', cnName: '成交金额' },
        { order: 11, name: 'FREE_MARKET_VALUE', cnName: '流通市值' },
        { order: 12, name: 'ZTJY', cnName: '涨停基因' },
    ],
    touchlimitdown:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称', mapField: 'f14' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价', mapField: 'f2' },
        { order: 3, name: 'YIELD', cnName: '涨幅', mapField: 'f3' },
        { order: 5, name: 'LIMITDOWN_OPEN_TIME', cnName: '开板时间', mapField: 'lastdttime' },
        { order: 6, name: 'LIMITDOWN_OPEN_TIMES', cnName: '开板次数', mapField: 'f634' },
        { order: 7, name: 'TURNOVERRATE', cnName: '换手率', mapField: 'f8' },
        { order: 8, name: 'BOARD_NAME', cnName: '所属行业', mapField: 'f100' },
        { order: 8, name: 'NET_INFLOW', cnName: '主力净流入', mapField: 'f62' },
        { order: 9, name: 'DEAL_AMOUNT', cnName: '成交金额', mapField: 'f6' },
        { order: 10, name: 'FREE_MARKET_VALUE', cnName: '流通市值', mapField: 'f21' }
    ],
    quality:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'ZTJY', cnName: '涨停基因' },
        { order: 5, name: 'NDAYS_NLIMITE', cnName: '几天几板' },
        { order: 6, name: 'SEALING_RATE_YEAR', cnName: '近一年封板率' },
        { order: 7, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 8, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 9, name: 'DEAL_AMOUNT', cnName: '成交金额' },
        { order: 10, name: 'FREE_MARKET_VALUE', cnName: '流通市值' }
    ],
    limitsprint:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'SPEED_UP', cnName: '涨速' },
        { order: 5, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 6, name: 'UNUSUAL_SITUATION', cnName: '异动类型' },
        { order: 7, name: 'SEALING_RATE_YEAR', cnName: '近一年封板率' },
        { order: 8, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 9, name: 'ZTJY', cnName: '涨停基因' },
        { order: 10, name: 'DEAL_AMOUNT', cnName: '成交金额' },
        { order: 11, name: 'FREE_MARKET_VALUE', cnName: '流通市值' }
    ],
    limitregulars:[
        { order: 1, name: 'SECURITY_NAME_ABBR', cnName: '个股名称' },
        { order: 2, name: 'NEWEST_PRICE', cnName: '最新价' },
        { order: 3, name: 'YIELD', cnName: '涨幅' },
        { order: 4, name: 'SPEED_UP', cnName: '涨速' },
        { order: 5, name: 'TURNOVERRATE', cnName: '换手率' },
        { order: 6, name: 'NDAYS_NLIMITE', cnName: '几天几板' },
        { order: 7, name: 'HIGHDAYSN_5DAYS', cnName: '五日内涨停' },
        { order: 8, name: 'HIGHDAYSN_5DAYS', cnName: '三日内涨幅' },
        { order: 9, name: 'SEALING_RATE_YEAR', cnName: '近一年封板率' },
        { order: 10, name: 'BOARD_NAME', cnName: '所属行业' },
        { order: 11, name: 'ZTJY', cnName: '涨停基因' },
        { order: 12, name: 'DEAL_AMOUNT', cnName: '成交金额' },
        { order: 13, name: 'FREE_MARKET_VALUE', cnName: '流通市值' }
    ]
}
function renderLimitReport(report, sourceData){
    let html = emptyDataHtml(sourceData);
    const dataContainer = document.getElementById(`${report}List`);
    if(html) { dataContainer.innerHTML = html; return; }

    let data;
    if (report === 'limitsoon' || report === 'auction'){
        if (sourceData.hasOwnProperty("extData")) {
            sourceData.extData.forEach(item => {
                const parentData = sourceData.data.filter(a => a.code === item.f12);
                item.aboutzdttime = !parentData || parentData.length === 0 ? "--" : toTimeString(parentData[0].aboutzdttime + '');
            })
            if (report === 'auction') data = sourceData.extData.sort((a, b) => b.f614 - a.f614);
            else if (report === 'limitsoon') data = sourceData.extData.sort((a, b) => b.f3 - a.f3);
        }
        else data = sourceData.result.data;
    }
    else if (report === 'touchlimitdown'){
        if (sourceData.hasOwnProperty("extData")) {
            sourceData.extData.forEach((item, index) => {
                const extItems = sourceData.data.filter(x => x.code === item.f12);
                sourceData.extData[index] = { ...item, ...extItems[0] }
            })
            data = sourceData.extData.sort((a, b) => new Date(formatDate(new Date(),'yyyy-MM-dd ') + b.lastdttime) - new Date(formatDate(new Date(), 'yyyy-MM-dd ') + a.lastdttime));
        }
        else data = sourceData.result.data;
    }
    else data = sourceData.result.data;

    const headers = TABLE_HEADERS[report].sort((a, b) => a.order - b.order)
    const headerHtml = renderHeaders(headers);
    let dataHtml = ''
    switch(report){
        case 'auction':
            dataHtml = renderAuctionDataRow(data, headers);
            break;
        case 'limitnatural':
            dataHtml = renderLimitNaturalDataRow(data, headers);
            break;
        case 'limitsoon':
            dataHtml = renderLimitSoonDataRow(data, headers);
            break;
        case 'limitdays':
            dataHtml = renderLimitDaysDataRow(data, headers);
            break;
        case 'touchlimit':
            dataHtml = renderTouchLimitDataRow(data, headers);
            break;
        case 'prelimit':
            dataHtml = renderPreLimitDataRow(data, headers);
            break;
        case 'declinelimited':
            dataHtml = renderDeclineLimitedDataRow(data, headers);
            break;
        case 'touchlimitdown':
            dataHtml = renderTouchLimitDownDataRow(data, headers);
            break;
        case 'quality':
            dataHtml = renderHighQualityDataRow(data, headers);
            break;
        case 'limitsprint':
            dataHtml = renderLimitSprintDataRow(data, headers);
            break;
        case 'limitregulars':
            dataHtml = renderLimitRegularsDataRow(data, headers);
            break;
    }
    html = `<table class="report-table">${headerHtml}${dataHtml}</table>`;
    dataContainer.innerHTML = html;
    showModalDialog();
}
function renderLimitRegularsDataRow(data, fields){
    let html = "";
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name];
            const order = field.order;
            const zf = item[fields[2].name];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if ((order >= 3 && order <= 5) || order === 8 || order === 9) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order >= 12 && order <= 13) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderLimitSprintDataRow(data, fields){
    let html = "";
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name];
            const order = field.order;
            const zf = item[fields[2].name];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if ((order >= 3 && order <= 5) || order === 7) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order >= 10 && order <= 11) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderTouchLimitDownDataRow(data, fields){
    let html = "";
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name] || item[field.mapField];
            const order = field.order;
            const zf = item[fields[2].name] || item[fields[2].mapField];
            const isRZ = parseInt(item["IS_MARGININFO"]) || parseInt(item["f13"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item['f12']}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 || order === 4 || order === 7) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order === 6) html += `<td>${!itemData ? (itemData === 0 ? 0 : '--') : itemData}</td>`;
            else if (order >= 9 && order <= 11) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderDeclineLimitedDataRow(sourceData, fields){
    let html = "";
    const data = sourceData.sort((a, b) => b.ZTJY - a.ZTJY);
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name];// || item[field.mapField];
            const order = field.order;
            const zf = item[fields[2].name];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] }${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 || order === 4 || order === 7) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order === 6) html += `<td>${!itemData ? (itemData === 0 ? 0 : '--') : itemData}</td>`;
            else if (order >= 9 && order <= 11 ) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderPreLimitDataRow(sourceData, fields){
    let html = "";
    const data = sourceData.sort((a,b) => b.f3 - a.f3);
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name] || item[field.mapField];
            const order = field.order;
            const zf = item[fields[2].name] || item[fields[2].mapField];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item["f12"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 || order === 7) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order === 4) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order === 6 || order > 7) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderTouchLimitDataRow(data, fields){
    let html = "";
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name]
            const order = field.order;
            const zf = item[fields[2].name];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item["f12"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 || order === 4) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order === 7) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderLimitDaysDataRow(sourcedata, fields){
    let html = "";
    const data = sourcedata.sort((a, b) => b.HLIMITEDAYS - a.HLIMITEDAYS);
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name]
            const order = field.order;
            const zf = item[fields[2].name];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item["f12"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 || order === 8) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order === 6 || order === 7 || order === 10) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function toTimeString(timeStr){
    timeStr = timeStr.padStart(6,'0');
    return timeStr.substring(0, 2).padStart(2, '0') + ':' + timeStr.substring(3, 2).padStart(2, '0') + ':' + timeStr.substring(5).padStart(2, '0');
}
function emptyDataHtml(data){
    let html = '';
    if (!data) {
        html = `<div class='no-auction-data'>暂无数据</div>`;
    }
    else {
        if (data.hasOwnProperty("extData")) {
            if (!data.extData || data.extData.length === 0) html = `<div class='no-auction-data'>暂无数据</div>`;
        }
        else {
            if (!data || !data.result || !data.result.data || data.result.data.length === 0) {
                html = `<div class='no-auction-data'>暂无数据</div>`;
            }
        }
    }
    return html;
}
function renderLimitNaturalDataRow(data, fields){
    let html = "";
    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name]
            const order = field.order;
            const zf = item[fields[2].name];
            const isRZ = parseInt(item["IS_MARGININFO"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item["f12"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 || order === 11) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '') }</td>`;
            else if (order === 4 || order === 6 || order === 12) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else if (order === 8) {
                if (itemData.LIMIT_REASON){
                    const iTag = `<i class='icon-limit-resean' title="“${item[fields[0].name]}”涨停原因" subtitle="${itemData.LIMIT_REASON}" data-content="${itemData.LIMIT_CONTENT}"></i>`
                    html += `<td class="td-limit-resean">${!itemData ? '' : (iTag + itemData.LIMIT_REASON)}</td>`;//+ "<span class='calendar-icon'></span>"
                }
                else html += `<td class="td-limit-resean" style='text-align:center;'>--</td>`;
            }
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function renderLimitSoonDataRow(data, fields){
    let html = "";

    data.forEach((item, dataIndex) => {
        html += `<tr>`;
        fields.forEach((field, index) => {
            let itemData = item[field.name] || item[field.mapField]
            const order = field.order;
            const zf = item[fields[2].name] || item[fields[2].mapField];
            const isRZ = parseInt(item["IS_MARGININFO"] || item["f13"]);
            if (order === 1) html += `<td>${itemData}<p class="stock-code">${item["SECURITY_CODE"] || item["f12"]}${isRZ ? "<span class='margin-info'>融</span>" : ""}</p></td>`;
            else if (order === 2) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${itemData}</td>`;
            else if (order === 3 || order === 4 || order === 7 ) html += `<td class="${zf >= 0 ? 'red' : 'green'}">${formatNumberAdvanced(itemData, 2) + (!isNaN(formatNumberAdvanced(itemData, 2)) ? '%' : '')}</td>`;
            else if (order === 9 || order === 10 || order === 11) html += `<td>${formatNumberAdvanced(itemData, 2)}</td>`;
            else html += `<td>${!itemData ? '--' : itemData}</td>`;
        })
        html += `</tr>`
    })
    return `<tbody>${html}</tbody>`;
}
function formatNumberAdvanced(num, decimalPlaces = 2) {
    if (!num) return num !== 0 ? '--' : (0/100).toFixed(decimalPlaces);
    if(isNaN(num)) return num;
    if (Math.abs(num) >= 100000000) {
        return (num / 100000000).toFixed(decimalPlaces) + '亿';
    } else if (Math.abs(num) >= 10000) {
        return (num / 10000).toFixed(decimalPlaces) + '万';
    } else {
        return num.toFixed(decimalPlaces);
    }
}
function _renderHeaders(headers){
    let html = "";
    headers.forEach((item, index) => {
        html += `<div class="div-cell div-header ${index === 0 ? 'div-row-header' : ''}">${item}</div>`;
    })
    return `<div class="div-row">${html}</div>`;
}
function _renderDataRow(data, fields){
    let html = "";
    data.forEach((item) => {
        html += `<div class="div-row">`;
        fields.forEach((field, index) => {
            html += `<div class="div-cell ${index === 0 ? 'div-header' : ''}">${item[field]}</div>`;
        })
        html += `</div>`
    })
    return html;
}
function renameJsonArrayFieldName(data, fieldsMap){
    return data.map(item => {
        const newItem = {};

        Object.keys(item).forEach(key => {
            const newKey = fieldsMap[key] || key;
            newItem[newKey] = item[key];
        });
        return newItem;
    });
}
function showModalDialog() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalDialog = document.getElementById('modalDialog');
    const modalClose = document.querySelector('.modal-close');
    const btnClose = document.querySelector('.close');
    const dataItems = document.querySelectorAll('.analyse-detail');
    const concepts = document.querySelectorAll('.concept-name');
    const themeSummay = document.querySelectorAll('.theme-summary');
    const themesDetail = document.querySelectorAll('.show-theme-detail');
    const allStock = document.querySelectorAll('.all-stock');

    document.querySelectorAll('.icon-limit-resean').forEach(item => {
        item.addEventListener('click', function (event) {
            const title = this.getAttribute('title')
            const desc = this.getAttribute("data-content").replaceAll('\\n', '<br>');
            const subtitle = this.getAttribute("subtitle");
            document.querySelector('.modal-title').textContent = title;//`“${name}”上榜原因`;
            document.getElementById('modalItemTitle').textContent = subtitle;// title;
            document.getElementById('modalItemDesc').innerHTML = desc;
            openModal();
         })
    })

    dataItems.forEach(item => {
        item.addEventListener('click', function () {
            const title = this.getAttribute('title')
            const desc = this.getAttribute("data-content");
            const subtitle = this.getAttribute("subtitle");
            document.querySelector('.modal-title').textContent = title;//`“${name}”上榜原因`;
            document.getElementById('modalItemTitle').textContent = subtitle;// title;
            document.getElementById('modalItemDesc').textContent = desc;
            openModal();
        });
    });
    themeSummay.forEach(item => {
        item.addEventListener('click', function () {
            const title = this.getAttribute('title')
            const desc = this.innerText;
            document.querySelector('.modal-title').textContent = title;//`“${name}”上榜原因`;
            document.getElementById('modalItemTitle').textContent = '';// subtitle;
            document.getElementById('modalItemDesc').textContent = desc;
            openModal();
        });
    });
    concepts.forEach(item => {
        item.addEventListener('click', async function () {
            const url = this.getAttribute('data-url');
            const title = this.getAttribute("title");
            document.querySelector('.modal-title').textContent = title;
            document.getElementById('modalItemTitle').textContent = document.getElementById('modalItemDesc').textContent = "";

            document.querySelectorAll('iframe').forEach(item => { item.remove(); })

            const iframe = document.createElement('iframe');
            // 设置 iframe 属性
            iframe.src = url;
            iframe.width = '700';
            iframe.height = '100%';
            iframe.style.frameBorder = '0'; // 现代浏览器推荐使用 style 代替
            iframe.style.border = 'none'; // 无边框
            const targetDiv = document.getElementById('modalItemDesc');
            targetDiv.appendChild(iframe);
            openModal();
        });
    })
    themesDetail.forEach(item => {
        item.addEventListener('click', async function () {
            const code = this.getAttribute('data-key');
            const title = this.getAttribute('title');
            const url = `/api/d/themeDetail/${code}`
            const res = await fetch(url);
            const json = await res.json();
            const hotValueUpLimit = parseInt(this.getAttribute("hotValueUpLimit"));
            const hotValue = parseInt(this.getAttribute("hotValue"));
            document.querySelector('.modal-title').textContent = title;//`“${name}”上榜原因`;
            document.getElementById('modalItemTitle').textContent = '';// subtitle;
            document.getElementById('modalItemDesc').innerHTML = renderThemeDetailTemplate(json.data, hotValue, hotValueUpLimit);
            openModal();
        });
    })

    allStock.forEach(item => {
        item.addEventListener('click',async function(){
            const code = this.getAttribute('data-key');
            const title = this.getAttribute('title');
            const url = `/api/d/themeStatistics/${code}`
            const res = await fetch(url);
            const json = await res.json();
            document.querySelector('.modal-title').textContent = title;//`“${name}”上榜原因`;
            document.getElementById('modalItemTitle').textContent = '';// subtitle;
            var listHtml = json.data.stockList.map((item) => renderThemeComponentTemplate(item)).join('');
            const html = `<div class="data-item no-border grid-header-label"><span class="theme-statistics">股票名称</span><span class="theme-statistics">最新价</span><span class="theme-statistics">涨幅</span><span class="theme-statistics">流通市值</span><span class="theme-statistics">连板情况</span></div><data-list theme-stock-list">${listHtml}</div>`
            document.getElementById('modalItemDesc').innerHTML = html;
            openModal();
        })
    })

    function openModal() {
        modalOverlay.classList.add('show');
        modalDialog.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }
    function closeModal() {
        modalOverlay.classList.remove('show');
        modalDialog.classList.remove('show');
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    if(btnClose) btnClose.addEventListener('click', closeModal);

    // 阻止对话框内容点击事件冒泡
    modalDialog.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // ESC键关闭对话框
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeModal();
        }
    });

    // 改善移动端手势操作
    let startY = 0;
    let isScrolling;

    modalDialog.addEventListener('touchstart', function (e) {
        startY = e.touches[0].clientY;
        isScrolling = undefined;
    }, { passive: true });

    modalDialog.addEventListener('touchmove', function (e) {
        const y = e.touches[0].clientY;
        const scrollTop = modalDialog.scrollTop;
        const scrollHeight = modalDialog.scrollHeight;
        const clientHeight = modalDialog.clientHeight;

        // 检查是否在滚动内容
        if (isScrolling === undefined) {
            isScrolling = Math.abs(y - startY) > 5 &&
                (scrollTop > 0 || scrollTop + clientHeight < scrollHeight);
        }

        // 如果不在滚动内容，且是下拉手势
        /*if (!isScrolling && y > startY + 20) {
            e.preventDefault();
            closeModal();
        }*/
    }, { passive: false });
}
/**
 * 动态格式化日期
 * @param {Date|string} date - 日期对象或可解析的日期字符串
 * @param {string} [format='yyyy-MM-dd HH:mm:ss'] - 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date = new Date(), format = 'yyyy-MM-dd HH:mm:ss') {
    // 处理输入日期
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) throw new Error('Invalid date');

    // 定义替换规则
    const replacements = {
        'yyyy': d.getFullYear(),
        'yy': String(d.getFullYear()).slice(-2),
        'MM': String(d.getMonth() + 1).padStart(2, '0'),
        'M': d.getMonth() + 1,
        'dd': String(d.getDate()).padStart(2, '0'),
        'd': d.getDate(),
        'HH': String(d.getHours()).padStart(2, '0'),
        'H': d.getHours(),
        'hh': String(d.getHours() % 12 || 12).padStart(2, '0'),
        'h': d.getHours() % 12 || 12,
        'mm': String(d.getMinutes()).padStart(2, '0'),
        'm': d.getMinutes(),
        'ss': String(d.getSeconds()).padStart(2, '0'),
        's': d.getSeconds(),
        'a': d.getHours() < 12 ? 'am' : 'pm',
        'A': d.getHours() < 12 ? 'AM' : 'PM'
    };

    // 执行替换
    return format.replace(/(yyyy|yy|MM|M|dd|d|HH|H|hh|h|mm|m|ss|s|a|A)/g,
        match => replacements[match]);
}

document.addEventListener('DOMContentLoaded', function () {

    window.addEventListener('scroll', function () {
        const tabNav = document.querySelector('.tab-nav');
        if (tabNav) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > tabNav.offsetTop) {
                tabNav.classList.add('sticky');
            } else {
                tabNav.classList.remove('sticky');
            }
        }
        const tabPane = document.querySelector('.use-for-sticky');
        if (tabPane) {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > tabPane.offsetTop) {
                tabPane.classList.add('sticky');
            } else {
                tabPane.classList.remove('sticky');
            }
        }
    });
    // 原有页签代码...
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
/*
    const monitorTabBtns = document.querySelectorAll('.tab-monitor');
    const monitorTabPanes = document.querySelectorAll('.tab-pane-monitor');

    monitorTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            monitorTabBtns.forEach(b => b.classList.remove('active'));
            monitorTabPanes.forEach(pane => pane.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const qualityTabBtns = document.querySelectorAll('.tab-btn-quality');
    const qualityTabPanes = document.querySelectorAll('.tab-pane-quality');

    qualityTabBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            qualityTabBtns.forEach(b => b.classList.remove('active'));
            qualityTabPanes.forEach(pane => pane.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
*/
    const timeType = document.querySelectorAll('.hotstock-time');
    timeType.forEach(item => {
        item.addEventListener('click', function () {
            timeType.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const type = this.getAttribute('data-key');
            fillTHSData(type);
        });
    });

    const dataSelector = document.querySelectorAll('.stock-data');
    dataSelector.forEach(item => {
        item.addEventListener('click', function () {
            const page = this.getAttribute("data-key");
            const url = `/datus/${page}.html`;
            location.href = url;
        });
    });
});
function clickToggleButton(){
    document.querySelector('.toggle-timeline').addEventListener('click', function () {
        const timeline = document.querySelector('.timeline');
        timeline.classList.toggle('show-all-timeline-item');

        // 更新按钮文本（CSS已经处理，这里可选）
        const button = this;
        if (timeline.classList.contains('show-all-timeline-item')) {
            button.textContent = '收起 ▲';
        } else {
            button.textContent = '展开全部 ▼';
        }
    });
}
/*
function canvasDraw(){
    const canvasEls = document.querySelectorAll('.data-chart');
    canvasEls.forEach((item, index) => {
        const data = item.getAttribute("data").split(',');
        if (data && data.length > 0) drawThemeKLine(item, data);
    })
}
*/
function drawThemeKLine(canvas, data){
    // 获取Canvas元素和容器
    const container = canvas.parentElement;   //document.querySelector('.chart-container');
    let ctx = canvas.getContext('2d');

    // 初始化图表
    initChart();

    function initChart() {
        // 设置初始尺寸
        resizeCanvas();

        // 添加窗口大小变化监听
        window.addEventListener('resize', debounce(resizeCanvas, 100));

        // 初始绘制
        drawChart();
    }

    // 防抖函数，优化resize性能
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => { func.apply(context, args); }, wait);
        };
    }

    // 调整Canvas尺寸
    function resizeCanvas() {
        // 获取设备像素比
        const dpr = window.devicePixelRatio || 1;

        // 获取容器实际尺寸
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // 设置Canvas实际像素尺寸
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        // 设置Canvas显示尺寸
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // 缩放上下文以适配高分屏
        ctx.scale(dpr, dpr);

        // 重新绘制图表
        drawChart();
    }

    // 绘制图表
    function drawChart() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 设置边距
        const margin = { top: 5, right: 5, bottom: 10, left: 10 };
        const chartWidth = canvas.width / (window.devicePixelRatio || 1) - margin.left - margin.right;
        const chartHeight = canvas.height / (window.devicePixelRatio || 1) - margin.top - margin.bottom;

        // 计算数据范围
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const valueRange = maxValue - minValue;

        // 计算比例
        const scaleY = chartHeight / valueRange;
        const step = chartWidth / (data.length - 1);

        // 绘制背景网格
        //drawGrid(margin, chartWidth, chartHeight, minValue, maxValue);

        // 绘制曲线
        drawCurve(margin, step, scaleY, minValue, chartHeight);

        // 绘制坐标轴
        //drawAxes(margin, chartWidth, chartHeight);

        // 绘制数据点
        //drawDataPoints(margin, step, scaleY, minValue, chartHeight);
    }

    // 绘制网格
    function drawGrid(margin, chartWidth, chartHeight, minValue, maxValue) {
        ctx.save();
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        // 水平网格线
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
            const y = margin.top + (i * chartHeight / gridLines);
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(margin.left + chartWidth, y);
            ctx.stroke();

            // Y轴标签
            const value = maxValue - (i * (maxValue - minValue) / gridLines);
            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.textAlign = 'right';
            ctx.fillText( (value ? value.toFixed(1) : 0), margin.left - 10, y + 4);
        }

        // 垂直网格线
        const verticalLines = Math.min(10, data.length);
        const interval = Math.ceil(data.length / verticalLines);
        for (let i = 0; i < data.length; i += interval) {
            const x = margin.left + (i * (chartWidth / (data.length - 1)));
            ctx.beginPath();
            ctx.moveTo(x, margin.top);
            ctx.lineTo(x, margin.top + chartHeight);
            ctx.stroke();
        }

        ctx.restore();
    }

    // 绘制曲线
    function drawCurve(margin, step, scaleY, minValue, chartHeight) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#ef0c0c';
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';

        data.forEach((value, index) => {
            const x = margin.left + (index * step);
            const y = margin.top + chartHeight - ((value - minValue) * scaleY);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
        ctx.restore();
    }

    // 绘制坐标轴
    function drawAxes(margin, chartWidth, chartHeight) {
        ctx.save();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;

        // Y轴
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, margin.top + chartHeight);
        ctx.stroke();

        // X轴
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top + chartHeight);
        ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
        ctx.stroke();

        // X轴标签
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';

        const labelInterval = Math.ceil(data.length / 10);
        for (let i = 0; i < data.length; i += labelInterval) {
            const x = margin.left + (i * (chartWidth / (data.length - 1)));
            ctx.fillText(`第${i + 1}天`, x, margin.top + chartHeight + 20);
        }

        // 添加标题
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('数据变化曲线', margin.left + chartWidth / 2, margin.top - 10);

        ctx.restore();
    }

    // 绘制数据点
    function drawDataPoints(margin, step, scaleY, minValue, chartHeight) {
        ctx.save();

        // 绘制关键数据点
        const pointInterval = Math.ceil(data.length / 8);
        data.forEach((value, index) => {
            if (index % pointInterval === 0 || index === data.length - 1) {
                const x = margin.left + (index * step);
                const y = margin.top + chartHeight - ((value - minValue) * scaleY);

                // 绘制点
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#e74c3c';
                ctx.fill();

                // 显示数值
                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText((value ? value.toFixed(1) : 0), x, y - 10);
            }
        });

        ctx.restore();
    }


}

function drawDashboard(canvas, currentValue){
    // 获取DOM元素
    //const canvas = document.getElementById('gaugeCanvas');
    const container = canvas.parentElement.parentElement;
    const ctx = canvas.getContext('2d');

    // 仪表盘配置
    let value = currentValue;//50; // 当前值
    const minValue = 0;
    const maxValue = 100;
    // 颜色区间分界点
    const greenEnd = 45;    // 绿色结束点
    const yellowStart = 46; // 黄色开始点
    const yellowEnd = 65;   // 黄色结束点
    const redStart = 66;    // 红色开始点

    // 调整角度使缺口在正上方（12点钟方向）
    const startAngle = 230;  // 开始角度（度）- 左侧
    const endAngle = 130;    // 结束角度（度）- 右侧
    const defaultSize = 120;//480; // 使用4倍尺寸绘制，然后缩小显示，提高清晰度

    initDashboard();

    function initDashboard() {
        // 设置初始尺寸
        resizeCanvas();

        // 添加窗口大小变化监听
        window.addEventListener('resize', debounce(resizeCanvas, 100));

        // 初始绘制
        drawGauge();
    }

    // 防抖函数，优化resize性能
    function debounce(func, wait) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => { func.apply(context, args); }, wait);
        };
    }

    // 调整Canvas尺寸
    function resizeCanvas() {
        // 获取设备像素比
        const dpr = 1;//window.devicePixelRatio || 1;

        // 获取容器实际尺寸
        const rect = container.getBoundingClientRect();
        const width = Math.min(rect.width, rect.height);
        const height = Math.min(rect.width, rect.height);

        // 设置Canvas实际像素尺寸
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        // 设置Canvas显示尺寸
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // 缩放上下文以适配高分屏
        ctx.scale(dpr, dpr);

        // 重新绘制图表
        drawGauge();
    }    

    // 绘制仪表盘
    function drawGauge() {
        const size = canvas.width;
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = (size * 0.8) / 2; // 半径为画布的80%的一半

        // 清除画布
        ctx.clearRect(0, 0, size, size);

        // 提高绘制质量
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 转换角度为弧度
        const startRad = (startAngle - 90) * Math.PI / 180;
        const endRad = (endAngle - 90) * Math.PI / 180;
        const totalAngle = endRad > startRad ? endRad - startRad : (endRad + Math.PI * 2) - startRad;

        // 绘制背景圆环
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startRad, endRad);
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = radius * 0.2; // 线宽为半径的20%
        ctx.stroke();

        // 计算总角度（考虑360度循环）
        const fullCircle = Math.PI * 2;
        const normalizedEndRad = endRad < startRad ? endRad + fullCircle : endRad;

        // 计算各颜色区间的角度
        const greenRatio = greenEnd / maxValue;
        const yellowRatio = (yellowEnd - yellowStart + 1) / maxValue;
        const redRatio = (maxValue - redStart + 1) / maxValue;

        const greenEndAngle = startRad + (greenRatio * totalAngle);
        const yellowEndAngle = greenEndAngle + (yellowRatio * totalAngle);

        // 确保不超过结束角度
        const actualGreenEndAngle = greenEndAngle > normalizedEndRad ? normalizedEndRad : greenEndAngle;
        const actualYellowEndAngle = yellowEndAngle > normalizedEndRad ? normalizedEndRad : yellowEndAngle;

        // 创建颜色渐变 - 绿色到黄色
        const greenToYellow = ctx.createLinearGradient(
            centerX + Math.cos(startRad) * radius,
            centerY + Math.sin(startRad) * radius,
            centerX + Math.cos(greenEndAngle) * radius,
            centerY + Math.sin(greenEndAngle) * radius
        );
        greenToYellow.addColorStop(0, '#10B981'); // 绿色
        greenToYellow.addColorStop(1, '#A3E635'); // 黄绿色（接近黄色）

        // 绘制绿色区间（带渐变）
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startRad, actualGreenEndAngle);
        ctx.strokeStyle = greenToYellow;
        ctx.stroke();

        // 创建颜色渐变 - 黄色到橙色
        const yellowToOrange = ctx.createLinearGradient(
            centerX + Math.cos(greenEndAngle) * radius,
            centerY + Math.sin(greenEndAngle) * radius,
            centerX + Math.cos(yellowEndAngle) * radius,
            centerY + Math.sin(yellowEndAngle) * radius
        );
        yellowToOrange.addColorStop(0, '#A3E635'); // 黄绿色
        yellowToOrange.addColorStop(0.5, '#F59E0B'); // 黄色
        yellowToOrange.addColorStop(1, '#F97316'); // 橙色（接近红色）

        // 绘制黄色区间（带渐变）
        if (actualGreenEndAngle < actualYellowEndAngle) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, actualGreenEndAngle, actualYellowEndAngle);
            ctx.strokeStyle = yellowToOrange;
            ctx.stroke();
        }

        // 创建颜色渐变 - 橙色到红色
        const orangeToRed = ctx.createLinearGradient(
            centerX + Math.cos(yellowEndAngle) * radius,
            centerY + Math.sin(yellowEndAngle) * radius,
            centerX + Math.cos(normalizedEndRad) * radius,
            centerY + Math.sin(normalizedEndRad) * radius
        );
        orangeToRed.addColorStop(0, '#F97316'); // 橙色
        orangeToRed.addColorStop(1, '#EF4444'); // 红色

        // 绘制红色区间（带渐变）
        if (actualYellowEndAngle < normalizedEndRad) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, actualYellowEndAngle, normalizedEndRad);
            ctx.strokeStyle = orangeToRed;
            ctx.stroke();
        }

        // 绘制刻度
        drawTicks(centerX, centerY, radius, startRad, endRad, totalAngle);

        // 绘制指针（针形）
        drawNeedle(centerX, centerY, radius);
    }

    // 绘制刻度 - 优化数值清晰度
    function drawTicks(centerX, centerY, radius, startRad, endRad, totalAngle) {
        const tickCount = 16; // 主刻度数量
        const subTickCount = 3; // 每个主刻度之间的子刻度数量

        // 处理角度循环
        const fullCircle = Math.PI * 2;
        const normalizedEndRad = endRad < startRad ? endRad + fullCircle : endRad;

        // 绘制主刻度
        for (let i = 0; i <= tickCount; i++) {
            const angleRatio = i / tickCount;
            let angle = startRad + (angleRatio * totalAngle);

            // 如果角度超过360度，进行调整
            if (angle > fullCircle) angle -= fullCircle;

            const tickLength = radius * 0.1;
            const tickWidth = 2;

            // 计算刻度的内外点
            const outerX = centerX + Math.cos(angle) * radius;
            const outerY = centerY + Math.sin(angle) * radius;
            const innerX = centerX + Math.cos(angle) * (radius - tickLength);
            const innerY = centerY + Math.sin(angle) * (radius - tickLength);

            // 绘制刻度线
            ctx.beginPath();
            ctx.moveTo(outerX, outerY);
            ctx.lineTo(innerX, innerY);
            ctx.strokeStyle = '#64748B';
            ctx.lineWidth = tickWidth;
            ctx.stroke();

            // 绘制刻度值 - 优化版本
            /*if (i % 4 === 0) {
                const value = Math.round((i / tickCount) * maxValue);
                // 调整文本位置，使其离刻度更远一些
                const textX = centerX + Math.cos(angle) * (radius - tickLength * 3);
                const textY = centerY + Math.sin(angle) * (radius - tickLength * 3);

                // 增加字体大小并使用粗体
                //ctx.font = `bold ${radius * 0.11}px Arial, sans-serif`;
                ctx.font = `bold 36px Arial, sans-serif`;
                // 提高对比度
                //ctx.fillStyle = '#1E293B'; // 更深的颜色
                ctx.fillStyle = '#0000ff'; // 更深的颜色

                // 添加文字描边增强可读性
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.lineWidth = 1.5;
                ctx.strokeText(value, textX, textY);

                // 填充文字
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(value, textX, textY);
            }*/
        }

        // 绘制子刻度
        for (let i = 0; i < tickCount; i++) {
            for (let j = 1; j < subTickCount; j++) {
                const angleRatio = (i + j / subTickCount) / tickCount;
                let angle = startRad + (angleRatio * totalAngle);

                // 如果角度超过360度，进行调整
                if (angle > fullCircle) angle -= fullCircle;

                const tickLength = radius * 0.05;
                const tickWidth = 1;

                // 计算刻度的内外点
                const outerX = centerX + Math.cos(angle) * radius;
                const outerY = centerY + Math.sin(angle) * radius;
                const innerX = centerX + Math.cos(angle) * (radius - tickLength);
                const innerY = centerY + Math.sin(angle) * (radius - tickLength);

                // 绘制刻度线
                ctx.beginPath();
                ctx.moveTo(outerX, outerY);
                ctx.lineTo(innerX, innerY);
                ctx.strokeStyle = '#94A3B8';
                ctx.lineWidth = tickWidth;
                ctx.stroke();
            }
        }
    }

    // 绘制针形指针（从中心向外逐渐变细）
    function drawNeedle(centerX, centerY, radius) {
        const totalAngle = (endAngle - startAngle + 360) % 360 * Math.PI / 180;
        const startRad = (startAngle - 90) * Math.PI / 180;

        // 计算指针角度
        const valueRatio = (value - minValue) / (maxValue - minValue);
        let needleAngle = startRad + (valueRatio * totalAngle);

        // 处理角度循环
        const fullCircle = Math.PI * 2;
        if (needleAngle > fullCircle) needleAngle -= fullCircle;

        // 指针长度（为半径的80%）
        const needleLength = radius * 0.8;

        // 计算指针末端点
        const needleTipX = centerX + Math.cos(needleAngle) * needleLength;
        const needleTipY = centerY + Math.sin(needleAngle) * needleLength;

        // 计算与指针垂直的角度（用于创建指针的宽度）
        const perpendicularAngle = needleAngle + Math.PI / 2; // 90度

        // 指针根部宽度和尖端宽度
        const rootWidth = radius * 0.05;
        const tipWidth = radius * 0.01;

        // 计算指针两侧的点（根部）
        const rootLeftX = centerX + Math.cos(perpendicularAngle) * rootWidth;
        const rootLeftY = centerY + Math.sin(perpendicularAngle) * rootWidth;
        const rootRightX = centerX - Math.cos(perpendicularAngle) * rootWidth;
        const rootRightY = centerY - Math.sin(perpendicularAngle) * rootWidth;

        // 计算指针两侧的点（尖端附近）
        const tipLeftX = needleTipX + Math.cos(perpendicularAngle) * tipWidth;
        const tipLeftY = needleTipY + Math.sin(perpendicularAngle) * tipWidth;
        const tipRightX = needleTipX - Math.cos(perpendicularAngle) * tipWidth;
        const tipRightY = needleTipY - Math.sin(perpendicularAngle) * tipWidth;

        // 创建针形指针的路径
        ctx.beginPath();
        ctx.moveTo(rootLeftX, rootLeftY);
        ctx.quadraticCurveTo(
            centerX + Math.cos(needleAngle) * (needleLength * 0.5),
            centerY + Math.sin(needleAngle) * (needleLength * 0.5),
            tipLeftX, tipLeftY
        );
        ctx.lineTo(tipRightX, tipRightY);
        ctx.quadraticCurveTo(
            centerX + Math.cos(needleAngle) * (needleLength * 0.5),
            centerY + Math.sin(needleAngle) * (needleLength * 0.5),
            rootRightX, rootRightY
        );
        ctx.closePath();

        // 填充指针
        const gradient = ctx.createLinearGradient(centerX, centerY, needleTipX, needleTipY);
        gradient.addColorStop(0, '#2563EB'); // 深蓝色（根部）
        gradient.addColorStop(1, '#60A5FA'); // 浅蓝色（尖端）
        ctx.fillStyle = gradient;
        ctx.fill();

        // 添加指针阴影增强立体感
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // 重置阴影设置
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 绘制中心圆点
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.06, 0, Math.PI * 2);
        ctx.fillStyle = '#1D4ED8';
        ctx.fill();

        // 中心圆点高光
        ctx.beginPath();
        ctx.arc(
            centerX - radius * 0.02,
            centerY - radius * 0.02,
            radius * 0.025,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
    }

    drawGauge();
}
//sk-368c2e1e1e734f28926f67d834251e90  DeepSeek API Key