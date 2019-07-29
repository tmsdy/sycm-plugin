var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://www.chaquanzhong.com' : 'http://118.25.153.205:8090';
// var BASE_URL = 'http://118.25.153.205:8090';
var SAVE_CUR_PAGE = {};
var LOCAL_VERSION = '1.0.13';
var isLogin = false;
var SAVE_MEMBER = {};
var weekStr = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var webSite = judgeWebsite()
var INIT_TIME = new Date().getTime();
// 区域，下架，价格趋势图事件
$(document).on('mouseenter', '.echart-tab', function () {
  $(this).find('.chaqz-trend-chart').addClass('chaqz-global-loading');
  $(this).addClass('area-show');
  var classType = $(this).attr('class');
  var index = $(this).index('.echart-tab');
  var chartData = classType.indexOf('offline') != -1 ? SAVE_CUR_PAGE.offlineShowInfo : classType.indexOf('price') != -1 ? SAVE_CUR_PAGE.priceShowInfo : SAVE_CUR_PAGE.addrShowInfo;
  domChartStruct(chartData, index)
})
$(document).on('mouseleave', '.echart-tab', function () {
  $(this).removeClass('area-show');
  echarts.dispose($(this).html())
})

function judgeWebsite() {
  // 判断天猫或者淘宝
  var link = window.location.href;
  if (link.indexOf('https://list.tmall.com/search_product.htm') != -1) {
    $(document).on('DOMNodeInserted', '#content', function (e) {
      if (e.target.id == 'J_FilterPlaceholder') {
        getPageInfo('tm')
      }
    })
    return 'tm'
  }
  if (link.indexOf('https://s.taobao.com/search') != -1) {
    $(document).on('DOMNodeInserted', '#main', function (e) {
      if (e.target.id == 'mainsrp-itemlist') {
        getPageInfo();
      }
    })
  }
  //详情页获取用户信息
  detailPagePop()
  if (link.indexOf('https://detail.tmall.com/item.htm') != -1) {
    $(function () {
      getDetailPage('tm');
    })
    return false
  }
  if (link.indexOf('https://item.taobao.com/item.htm') != -1) {
    $(function () {
      getDetailPage();
    })
  }
}
/**--------  search page operator  --------------- */
// 获取页面信息
function getPageInfo(type) {
  var topAdver = '<div class="chaqz-adver-top"><img src="https://file.cdn.chaquanzhong.com/adver-top.png" alt=""></div>';
   type == 'tm' ? $('#content').prepend(topAdver) : $('#main').prepend(topAdver);
  var list = type == 'tm' ? $('#content #J_ItemList .product') : $('#mainsrp-itemlist .m-itemlist .items .item'); //天猫or淘宝商品列表
  var itemLen = list.length;
  var itemIdList = [];
  var redData = {
    prices: [], //价格集
    sales: [], //销量及
    oriData: [] //原始数据
  };
  var addrData = [] //地域集
  var itemPrice = {}; //id下标价格集
  for (let i = 0; i < itemLen; i++) {
    const el = list[i];
    // 每项添加信息
    var wraps = type == 'tm' ? $(el).find('.product-iWrap') : el;
    if (type == 'tm') {
      var price = $(el).find('.productPrice em').attr('title') * 1;
      var saleText = $(el).find('.productStatus em').text();
      var itemId = $(el).data('id');
      var sale = dealSales(saleText)

    } else {
      var price = $(el).find('.price strong').text() * 1;
      var saleText = $(el).find('.deal-cnt').text();
      var addr = $(el).find('.location').text();
      var itemId = $(el).find('.J_ClickStat').data('nid')
      var sale = dealSales(saleText)
      if (!addrData[addr]) {
        addrData[addr] = {
          sellers: 1,
          payCot: sale
        }
      } else {
        addrData[addr].sellers += 1
        addrData[addr].payCot += sale
      }
    }
    itemPrice[itemId] = sale
    itemIdList.push(itemId)
    redData.prices.push(price)
    redData.sales.push(sale)
    redData.oriData.push({
      itemId,
      price,
      sale,
      addr
    })
    $(wraps).append('<ul class="chaqz-item-info item-id-' + itemId + '"><li><i class="logo-smll-icon chaqz-icon"></i><a href="https://www.chaquanzhong.com/"><a href="https://www.chaquanzhong.com/jdGrade">查排名</a><a href="https://www.chaquanzhong.com/chaheihao">查黑号</a><a href="https://sycm.taobao.com/mc/ci/item/analysis">查权重</a><a href="https://sycm.taobao.com/mc/ci/item/analysis">一键加权</a></li><li><p class="price-wrap"><i class="history-icon chaqz-icon"></i><span class="historyPrice" data-id="' + itemId + '">历史价格</span></p></li><li><i class="offline-icon chaqz-icon"></i>下架：<span class="offtime"></span></li></ul><div></div>');
    //<i class="type-icon chaqz-icon">类</i><span>保温杯</span>===  <li><i class="natural-icon chaqz-icon"></i>自然搜索：<span></span></li><li><i class="ztc-icon chaqz-icon"></i>直通车：<span></span></li>
  }
  var priceStatic = getHeightLow(redData.prices)
  var saleStatic = getHeightLow(redData.sales)
  // 顶部展示区域
  var hasAddr = type == 'tm' ? '' : '<li class="echart-tab addr">区域图<span class="arrow"></span></li>';
  var dom = '<ul class="chaqz_search_top"><li><i class="logo-icon chaqz-icon"></i><a href="www.chaquanzhong.com">www.chaquanzhong.com</a></li><li class="page-static">本页统计</li>' + hasAddr + '<li class="echart-tab offline">下架图<span class="arrow"></span></li><li class="echart-tab price">价格图<span class="arrow"></span></li><li><span class="tab">价格</span></li><li>平均价:<span class="price">' + priceStatic.avg + '</span></li><li>最高价:<span class="price">' + priceStatic.high + '</span></li><li>最低价:<span class="price">' + priceStatic.low + '</span></li><li><span class="tab">销量</span></li><li>平均销:<span class="price">' + saleStatic.avg + '</span></li><li>最高销:<span class="price">' + saleStatic.high + '</span></li><li>最低销:<span class="price">' + saleStatic.low + '</span></li></ul>';
  type == 'tm' ? $('#J_RelSearch').append(dom) : $('#mainsrp-itemlist').prepend(dom);
  //  获取区域图数据
  type == 'tm' ? '' : getAddressData(addrData);
  // 获取价格数据
  getPriceData(priceStatic.high, redData.oriData, type)
  // 获取下架数据
  getOfflineData(itemIdList, itemPrice)
}
//  获取区域图数据
function getAddressData(addrData) {
  //  获取区域图数据
  var addrInfo = {
    names: [],
    seller: [],
    payCot: []
  }
  for (let key in addrData) {
    addrInfo.names.push(key);
    addrInfo.seller.push(addrData[key].sellers);
    addrInfo.payCot.push(addrData[key].payCot);
  }
  var tableRows = [];
  tableRows.push(['地域分布'].concat(addrInfo.names));
  tableRows.push(['卖家数量（个）'].concat(addrInfo.seller));
  tableRows.push(['付款人数（人）'].concat(addrInfo.payCot));
  var addrShowInfo = {
    names: addrInfo.names,
    seller: addrInfo.seller,
    payCot: addrInfo.payCot
  }
  SAVE_CUR_PAGE.addrShowInfo = addrShowInfo;
  domStructTrend(tableRows, 'addr')
}
//  获取价格图数据
function getPriceData(highPrice, oriData, ) {
  var priceInfo = {
    names: [],
    sellers: [],
    payCot: []
  }
  var cutRange = Math.ceil(highPrice / 10); //区间大小
  var len = oriData.length;
  var mergeData = {};

  // 合并区间卖家数以及人数
  for (let i = 0; i < len; i++) {
    const el = oriData[i];
    let key = Math.ceil(el.price / cutRange);
    if (mergeData[key]) {
      mergeData[key].sellers += 1;
      mergeData[key].payCot += el.sale;
    } else {
      mergeData[key] = {};
      mergeData[key].sellers = 1;
      mergeData[key].payCot = el.sale;
    }
  }
  //  获得区间值
  var cutList = [];
  for (let j = 0; j < 10; j++) {
    var Startcut = j == 0 ? j * cutRange : j * cutRange + 1;
    var endcut = (j + 1) * cutRange;
    cutList.push(Startcut + '~' + endcut);
    priceInfo.sellers[j] = mergeData[j + 1] ? mergeData[j + 1].sellers : 0;
    priceInfo.payCot[j] = mergeData[j + 1] ? mergeData[j + 1].payCot : 0;
  }
  var tableRows = [];
  tableRows.push(['价格区间'].concat(cutList));
  tableRows.push(['卖家数量（个）'].concat(priceInfo.sellers));
  tableRows.push(['付款人数（人）'].concat(priceInfo.payCot));
  var priceShowInfo = {
    names: cutList,
    seller: priceInfo.sellers,
    payCot: priceInfo.payCot
  }
  SAVE_CUR_PAGE.priceShowInfo = priceShowInfo;
  domStructTrend(tableRows, 'price')
}
// 获取下架
function getOfflineData(itemIdList, itemPrice) {
  var tableRows = [];
  var offlineShowInfo = {
    names: [],
    seller: [],
    payCot: []
  }
  var tailWrap = {
    count: 0,
    res: {}
  };
  offlineRequest(itemIdList, tailWrap, function () {
    console.log(tailWrap)
    var timeData = tailWrap.res;
    var accordDate = {}
    for (let k in timeData) {
      if (accordDate[timeData[k]]) {
        accordDate[timeData[k]].sell++;
        accordDate[timeData[k]].payCot += itemPrice[k];
      } else {
        accordDate[timeData[k]] = {
          date: timeData[k],
          sell: 1,
          payCot: itemPrice[k]
        }
      }
    }
    var finalArr = [];
    for (let v in accordDate) {
      finalArr.push(accordDate[v])
    }
    var sortData = babelSort(finalArr, 'date');
    var len = sortData.length;
    for (let j = 0; j < len; j++) {
      const ele = sortData[j];
      offlineShowInfo.names.push(ele.date.replace(/^20\d{2}-?/, ''))
      offlineShowInfo.seller.push(ele.sell)
      offlineShowInfo.payCot.push(ele.payCot)
    }
    console.log(sortData, offlineShowInfo)
    tableRows.push(['下架时间'].concat(offlineShowInfo.names));
    tableRows.push(['卖家数量（个）'].concat(offlineShowInfo.seller));
    tableRows.push(['付款人数（人）'].concat(offlineShowInfo.payCot));
    SAVE_CUR_PAGE.offlineShowInfo = offlineShowInfo;
    domStructTrend(tableRows, 'offline')
  })

}

function offlineRequest(itemIdList, tailWrap, cb) {
  var newTime = new Date().getTime()
  var len = itemIdList.length;
  for (let i = 0; i < len; i++) {
    const ele = itemIdList[i];
    chrome.runtime.sendMessage({
      key: 'getData',
      options: {
        url: 'https://detail.tmall.com/item.htm?id=' + ele,
        type: 'GET',
      }
    }, function (val) {
      var offTime = getSxjTime(val, newTime);
      var curDate = new Date(offTime);
      var showTime = formate("MM-dd hh:mm", curDate) + " (" + weekStr[curDate.getDay()] + ")";
      var retime = curDate - newTime;
      var remainTime = getRemainTime(retime, !0)
      $('.item-id-' + ele).find('.offtime').text(showTime + '[' + remainTime + ']').attr('title', '下架时间:' + showTime + ' 剩余天数:' + remainTime);
      console.log(tailWrap.count)
      if (tailWrap.count > len - 2) {
        cb()
      }
      tailWrap.res[ele] = formate("yyyy-MM-dd", curDate);
      tailWrap.count++
    })
  }
}

function getSxjTime(t, e) {
  for (var a = ["detailskip.taobao.com/json/show_buyer_list.htm.*?\\&starts=([0-9]*)", "detailskip.taobao.com/json/show_bid_count.htm.*\\&date=([0-9]*)", "tbskip.taobao.com/json/show_bid_count.htm.*\\&date=([0-9]*)", "detailskip.taobao.com/[^']*?showBuyerList.htm.*\\&starts=([0-9]*)", "dbst\\s*:\\s*([0-9]*),", "ext.mdskip.taobao.com/extension/dealRecords.htm.*?\\&starts=([0-9]*)", "tbskip.taobao.com/json/show_bid_count.htm.*?\\&date=([0-9]*)", "tbskip.taobao.com/json/show_bid_count.htm.*?\\&date=([0-9]*)"], n = 0, r = a.length; n < r; n++) {
    var i = new RegExp(a[n], "g").exec(t);
    if (i && i[1] && i[1].match(/\d+/)) {
      var o = parseInt(i[1]);
      return o < e && (o = 6048e5 * Math.ceil((e - o) / 6048e5) + o), o
    }
  }
}

function getRemainTime(t, e) {
  if (0 < t) {
    var a = parseInt(t / 24 / 3600 / 1e3),
      n = parseInt((t - 24 * a * 3600 * 1e3) / 1e3 / 3600),
      r = a + "天" + n + "时" + parseInt((t - 24 * a * 3600 * 1e3 - 3600 * n * 1e3) / 1e3 / 60) + "分";
    return e && r
  }
  return ""
}
// 趋势table
function domStructTrend(tableData, type) {
  var title = type == 'price' ? '价格图' : type == 'offline' ? '下架图' : '区域图';
  var tableLen = tableData.length;
  var html = ''
  for (let i = 0; i < tableLen; i++) {
    const element = tableData[i];
    var trs = '<tr>'
    for (let j = 0; j < element.length; j++) {
      trs += '<td>' + element[j] + '</td>';
    }
    trs + '</tr>'
    html += trs;
  }

  var wrapper = '<div class="chaqz-trend-chart"><div class="title">' + title + '</div><div class="chaqz-echarts-box"></div><div class="table-box"><table>' + html + '</table></div></div>';
  var trendTabs = $('.chaqz_search_top .echart-tab.' + type);
  trendTabs.append(wrapper)

}
// 图表展示
function domChartStruct(edata, type) {
  if (!edata) {
    return false;
  }
  var myChart = echarts.init(document.getElementsByClassName('chaqz-echarts-box')[type]);
  var option = {
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true
    },
    legend: {
      data: ['付款人数', '卖家数量']
    },
    grid: {
      right: '5%',
      left: '5%'
    },
    xAxis: {
      type: 'category',
      data: edata.names
    },
    yAxis: [{
        type: 'value',
      },
      {
        type: 'value',
        position: 'right'
      }
    ],
    series: [{
        name: '卖家数量',
        type: 'bar',
        smooth: true,
        yAxisIndex: 1,
        barWidth: 40,
        data: edata.seller
      },
      {
        name: '付款人数',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: edata.payCot
      }
    ]
  }

  myChart.setOption(option);
  $('.chaqz-global-loading').removeClass('chaqz-global-loading');
  // LoadingPop()
}
// 价格趋势
$(document).on('mouseenter', '.historyPrice', function () {
  var id = $(this).data('id');
  var dom = '<div class="chaqz-trend-chart history-wrap chaqz-global-loading"></div>';
  $(this).append(dom)
  var saveToke = localStorage.getItem('chaqz_token');
  chrome.runtime.sendMessage({
    key: 'getData',
    options: {
      url: BASE_URL + '/api/v1/tools/toolbox/getSearchhistory?param=' + id,
      type: 'GET',
      headers: {
        Authorization: "Bearer " + saveToke
      }
    }
  }, function (val) {
    if (val.code == 200) {
      var res = val.data.RetObject;
      var dateOriList = res.date_list.split(',');
      var dateFullList = dateOriList.map(function (item) {
        return '2019.' + item
      });
      var priceOriList = res.pirce_list[0].split(',');
      var lowHigh = getHeightLow(priceOriList);
      var contentDom = '<div class="title">历史最低：￥<span class="hot">' + lowHigh.low + '</span> |最高：￥<span class="hot">' + lowHigh.low + '</span></div><div id="chaqz-echarts-box"></div>';
      $('.chaqz-trend-chart').append(contentDom);
      var myChart = echarts.init(document.getElementById('chaqz-echarts-box'));
      var option = {
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          top: 30,
          bottom: 30,
          left: '15%'
        },
        xAxis: {
          type: 'category',
          data: dateFullList
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: "{value} 元"
          }
        },
        series: [{
          name: '价格',
          type: 'line',
          smooth: true,
          data: priceOriList
        }]
      }
      myChart.setOption(option)
    } else {
      var contentDom = '<div class="no-data">未查询到价格数据</div>';
      $('.chaqz-trend-chart').append(contentDom);
    }
    $('.chaqz-global-loading').removeClass('chaqz-global-loading');
  })
  $(document).on('mouseleave', '.historyPrice', function () {
    $('.chaqz-trend-chart').remove();
  })

})
/**--------- detail page operator===========*/
function getDetailPage(type) {
  var itemIdUrl = window.location.href;
  var itemId = getSearchPara(itemIdUrl, 'id');
  var dom = '<div class="chaqz-detail-wrap"><div class="content"><div class="left"><i class="logo-icon chaqz-icon"></i></div><div class="right"><div class="item"><a href="https://www.chaquanzhong.com/"  target="_blank">www.chaquanzhong.com</a><span class="title">下架：</span><span class="offline hot">7-12 11:15(周三)[4天22时48分]</span><span class="title"><i class="chaqz-icon history-icon"></i><span class="historyPrice" data-id=' + itemId + '>历史价格</span></span></div><div class="item links"><span class="title-btn">提升权重</span><a href="https://www.chaquanzhong.com/jdGrade" target="_blank">查排名</a><a href="https://www.chaquanzhong.com/chaheihao"  target="_blank">查黑号</a><a href="https://sycm.taobao.com/mc/ci/item/analysis"  target="_blank">查权重</a><a href="https://sycm.taobao.com/mc/ci/item/analysis"  target="_blank">一键加权</a><a href="https://www.chaquanzhong.com/sevenPlan"  target="_blank">7天上首页</a><a href="https://www.chaquanzhong.com/directTrain"  target="_blank">直通车托管</a><a href="https://www.chaquanzhong.com/moldbaby"  target="_blank">打造爆款</a></div></div></div><div class="advert"><a href="" target="_blank"><img src="https://file.cdn.chaquanzhong.com/adver-side.png"alt=""></a></div></div>';
  //<span class="title">类目：</span><span class="categroy hot">保温杯</span>  ==== <div class="item"><span class="title-btn">搜索展现</span><span class="search-tb">淘宝搜索</span><span class="offline hot">（23）</span><span class="title">淘宝直通车</span><span class="search-ztc hot">（23）</span><span class="title">无线搜索</span><span class="search-wx hot">（23）</span><span class="title">无线直通车</span><span class="search-wxztc hot">（23）</span></div>
  $('#detail').prepend(dom);
  skuPopup(itemId, type)
}
// sku popup
function skuPopup(itemId, type) {
  var dom = '<div class="chaqz-compete-wrap"><div class="head popover-header"><div class="left"><img class=""src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png"alt=""></div><img id="userBtn"src="https://file.cdn.chaquanzhong.com/chaqz-plugins-avator.png"alt=""class="avator"></div><div class="content-wrap"><button id="skuAnaly">sku评价分析</button><div class="bottom"><a href="' + BASE_URL + '/home?from=plugin"target="_blank">www.chaquanzhong.com</a><br/><span>v1.0.13</span></div></div></div></div>'
  $('#page').append(dom);
  $('#skuAnaly').click(function () {
    $('body').addClass('chaqz-global-loading loading-fixed');
    var shopId = '';
    // var shopIdDom = type == 'tm' ? $('#shop-info #dsr-userid').val() : $('#header-content .search-bottom .shop-collect').attr('href');
    if (type == 'tm') {
      shopId = $('#shop-info #dsr-userid').val()
    } else {
      var userId = $('meta[name="microscope-data"]').attr('content');
      var splits = userId.split(';')
      for (let i = 0; i < splits.length; i++) {
        const ele = splits[i].split('=');
        if (ele[0] == 'userid') {
          shopId = ele[1]
          break;
        }
      }
    }
    // var shopId = type == 'tm' ? shopIdDom : getSearchPara(shopIdDom, 'sellerid')
    var ua = getCookie('pnm_cku822');
    var resData = {
      requestInfo: {
        shopId,
        ua,
        itemId,
        page: 1,
        type
      },
      saveBox: []
    }
    ajaxEvaluation(resData)
  })
}

function ajaxEvaluation(params) {
  var dateTime = new Date().getTime();
  var numRandom = randomNum();
  var curPage = params.requestInfo.page;
  var url = params.requestInfo.type == 'tm' ? 'https://rate.tmall.com/list_detail_rate.htm' : 'https://rate.taobao.com/list_detail_rate.htm';
  $.ajax({
    type: "GET",
    url: url,
    // dataType: 'json',
    // jsonp: 'callback',
    // jsonpCallback: 'callback',
    data: {
      currentPage: curPage,
      append: 0,
      picture: 0,
      order: 3,
      content: 1,
      tagId: '',
      posi: '',
      groupId: '',
      ua: params.requestInfo.ua,
      needFold: 0,
      all: 1,
      itemId: params.requestInfo.itemId,
      sellerId: params.requestInfo.shopId,
      callback: 'jsonp' + (numRandom + 1),
      _ksTS: dateTime + '_jsonp' + numRandom,
      _: INIT_TIME + curPage
    },
    success: function (val) {
      var finlJsonData = val.split(/jsonp\d*\(/)[1].split(/\)$/)[0];
      var jsonData = JSON.parse(finlJsonData);
      if (!jsonData.rateDetail && jsonData.url) {
        $('.chaqz-global-loading').removeClass('chaqz-global-loading');
        $('body').append('<div class="iframe-pop"><div class="title">请进行验证后关闭<span class="chaqz-close">×</span></div></div>');
        $('.iframe-pop .chaqz-close').click(function () {
          $('.iframe-pop').remove();
        })
        var iframe = document.createElement('iframe');
        iframe.id = "chaqz_frame",
          iframe.name = "polling",
          iframe.src = jsonData.url;
        $('.iframe-pop').append(iframe);
        return false;
      }
      params.saveBox = params.saveBox.concat(jsonData.rateDetail.rateList);
      if (!params.totalPage) {
        params.totalPage = jsonData.rateDetail.paginator.lastPage;
      }
      params.requestInfo.page = curPage + 1;
      curPage < params.totalPage ? ajaxEvaluation(params) : showSkuResult(params.saveBox);
    }
  })
}
// 得到总数据
function showSkuResult(resData) {
  var totalLen = resData.length;
  var resObj = {};
  var totalNum = 0;
  // 获取非默认评价
  for (let i = 0; i < totalLen; i++) {
    const el = resData[i];
    if (el.rateContent != '此用户没有填写评论!') {
      resObj[el.auctionSku] = resObj[el.auctionSku] ? (resObj[el.auctionSku] + 1) : 1;
      totalNum++;
    }
  }
  // 图标以及表格数据
  var skuTitles = [];
  var skuCout = [];
  var tableData = [];
  var perList = [];
  for (let k in resObj) {
    let per = {};
    skuTitles.push(k);
    skuCout.push(resObj[k]);
    per.name = k;
    per.value = resObj[k];
    perList.push(per);
    per.sku = k;
    per.count = resObj[k];
    per.skuRate = (resObj[k] / totalNum * 100).toFixed(2) + '%';
    tableData.push(per)
  }
  domStructSku({
    data: tableData,
    cols: [{
        title: '评价sku信息',
        data: 'sku'
      },
      {
        title: '评价笔数',
        data: 'count'
      },
      {
        title: 'sku评价笔数占比',
        data: 'skuRate'
      }
    ]
  }, 'sku评价分析', {
    titles: skuTitles,
    data: perList
  })
  $('.chaqz-global-loading').removeClass('chaqz-global-loading');
}

// 趋势table
function domStructSku(data, title, edata) {
  // var titleImg = title.picUrl ? ('<img src="' + title.picUrl + '">') : '';
  var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="top-head"><img src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png" alt="">查权重<a href="https://www.chaquanzhong.com" target="_blank">[www.chaquanzhong.com]</a><span class="sku">sku评价分析</span></div></div><div id="chaqzx-echarts-wrap"></div><div class="table-box"><table id="chaqz-table-trend" class="trend-table"></table></div></div><span class="chaqz-close">×</span></div></div>'
  $('#page').append(wrapper)
  $('#chaqz-table-trend').DataTable({
    data: data.data,
    columns: data.cols,
    language: {
      "paginate": {
        "next": "&gt;",
        "previous": "&lt;"
      },
      "sEmptyTable": '获取数据失败，请刷新界面',
      zeroRecords: "没有匹配数据"
    },
    // searching: false,
    ordering: false,
    info: false,
    dom: 'Bfrtip',
    buttons: [{
        extend: 'csv',
        title: title.name + '-趋势分析',
        'bom': true,
      },
      {
        extend: 'copy',
        exportOptions: {
          modifier: {
            page: 'current'
          }
        }
      }
    ]
  });
  var myChart = echarts.init(document.getElementById('chaqzx-echarts-wrap'));
  var option = {
    title: {
      text: '评价sku分析(默认评价不分析)',
      x: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: "sku: {b} <br/>评价笔数 : {c}"
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: 20,
      bottom: 20,
      data: edata.titles,
    },
    grid: {
      right: '5%',
      left: '5%'
    },
    series: [{
      name: '卖家数量',
      type: 'pie',
      radius: '55%',
      center: ['40%', '50%'],
      data: edata.data,
      itemStyle: {
        emphasis: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }

  myChart.setOption(option);
  $('.chaqz-wrapper .chaqz-close').click(function () {
    $('.chaqz-wrapper').remove();
  })
}
//拖拽事件
var dragStatus = {
  disX: 0,
  disY: 0,
  _start: false,
  time: false
}
$(document).on('mousedown', '.popover-header .left', function (ev) {
  // 点击移动事件bug
  dragStatus.time = new Date();
  var ele = $('.chaqz-compete-wrap');
  dragStatus._start = true;
  var oEvent = ev || event;
  dragStatus.disX = oEvent.clientX - ele.offset().left;
  dragStatus.disY = oEvent.clientY - ele.offset().top;
  $(document).on("mousemove", function (ev) {
    if (dragStatus._start != true) {
      return false
    }
    var oEvent1 = ev || event;
    var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollL = document.documentElement.scrollLeft || document.body.scrollLeft;
    var l = oEvent1.clientX - dragStatus.disX - scrollL;
    var t = oEvent1.clientY - dragStatus.disY - scrollT;
    t = t < 0 ? 0 : t;
    $('.chaqz-compete-wrap').css({
      'left': l,
      top: t,
      bottom: 'unset'
    })
  });
  $(document).on("mouseup", function (ev) {
    if (dragStatus._start != true) {
      return false
    }
    $(document).off("mousemove");
    $(document).off("mouseup");
    dragStatus._start = false;
  });
})
$(document).on('click', '.popover-header .left', function (ev) {
  var nowTime = new Date();
  var miunsTime = nowTime - dragStatus.time;
  if (miunsTime < 500) {
    var ele = $('.chaqz-compete-wrap .content-wrap');
    if (ele.hasClass('isshow')) {
      ele.show(300);
      ele.removeClass('isshow');
    } else {
      ele.hide(300);
      ele.addClass('isshow');
    }
  }
})

// 详情页用户信息的弹窗
function detailPagePop() {
  // 用户信息
  chrome.storage.local.get(['chaqz_token', 'chaqzShopInfo'], function (valueArray) {
    var tok = valueArray.chaqz_token;
    SAVE_MEMBER = valueArray.chaqzShopInfo ? valueArray.chaqzShopInfo : {};
    if (tok) {
      localStorage.setItem('chaqz_token', tok.token);
      isLogin = true;
      getUserInfo()
    } else {
      isLogin = false;
    }
  });
  var anyDom = {
    loginDom: '<div class="chaqz-info-wrapper login"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><div class="formList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><div class="phone"><input id="phone" type="text" placeholder="请输入手机号码"><p class="tips">请输入手机号码</p></div><div class="pwd"><input id="pwd" type="password" placeholder="请输入登录密码"><p class="tips">请输入登录密码</p></div><div class="router"><a href="' + BASE_URL + '/reg" class="right" target="_blank">免费注册</a><a href="' + BASE_URL + '/findP" target="_blank">忘记密码</a></div><button class="orange-default-btn login-btn">登录</button></div></div></div>',
    login: function (tbName) {
      var _that = this;
      var onLoading = false;
      var user = $('.chaqz-info-wrapper #phone').val()
      var pwd = $('.chaqz-info-wrapper #pwd').val()
      if (!user || !pwd || onLoading) {
        return false
      }
      chrome.runtime.sendMessage({
        key: "getData",
        options: {
          url: BASE_URL + '/api/v1/platfrom/userAuth/cqzLogin',
          // url: BASE_URL + '/api/v1/user/login',
          url: 'http://192.168.2.168:8080/api/v1/platfrom/userAuth/cqzLogin',
          type: "POST",
          data: 'account=' + user + '&password=' + pwd + '&appId=M177293746593',
          contentType: "application/x-www-form-urlencoded; charset=UTF-8",
          processData: false,
        }
      }, function (val) {
        if (val.code == 200) {
          var token = val.data.token;
          localStorage.setItem('chaqz_token', token);
          var saveToke = {
            expiration: val.data.expire,
            token: token
          }
          chrome.storage.local.set({
            'chaqz_token': saveToke
          }, function () {});
          // SAVE_MEMBER = val.data;
          isLogin = true;
          $('.chaqz-info-wrapper.login').remove();
          getUserInfo()
          // tbName ? _that.searchHei(tbName) : '';
        } else {
          $('.chaqz-info-wrapper.login .pwd .tips').text('账号或密码错误').show();
          logOut()
          onLoading = false
        }
      })
    },
    infoDom: function (memInfo, bindedInfo) {
      var acct = memInfo.username;
      var title = memInfo.member.title;
      var expirTime = memInfo.member.expireAt;
      var whetherOrder = '';
      if (title && expirTime) {
        var formDate = new Date(expirTime)
        var isExpire = formDate - memInfo.time * 1000
        if (isExpire > 0) {
          whetherOrder = '续费';
        } else {
          whetherOrder = '订购';
        }
      } else {
        title = '普通会员';
        expirTime = '--';
        whetherOrder = '订购'
        // binded = '未绑定'
      }
      var wrap = '<div class="chaqz-info-wrapper user"><div class="c-cont"><span class="close2 hided">×</span><div class="help"><img src="https://file.cdn.chaquanzhong.com/wenhao.png" alt="?"><a href="' + BASE_URL + '/pluginIntro" target="_blank">帮助</a></div><div class="infoList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><ul class="user-list"><li><span class="name">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:</span><span>' + acct + '</span><span class="fr" id="logout">退出登录</span></li><li><span class="name">会员信息:</span><span>' + title + '</span></li><li><span class="name">到期时间:</span><span>' + expirTime + '</span><a href="' + BASE_URL + '/vipInfo?from=plugin" target="_blank" class="fr">' + whetherOrder + '</a></li><li><span class="name">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span><span>' + LOCAL_VERSION + '</span></li><li><span class="name">联系客服:</span><span><a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><img class="mr_10" src="https://file.cdn.chaquanzhong.com/qq_icon.png" alt="qq"></a><img src="https://file.cdn.chaquanzhong.com/wx_icon.png" alt="wx" class="wxpop"></span></li></ul></div></div></div>';
      $('#page').append(wrap);

    },
    init: function (tbName) {
      var _that = this
      $('#page').append(this.loginDom);
      $(document).on('blur', '.chaqz-info-wrapper #phone', function () {
        var phoneVal = $(this).val()
        var phoneReg = /^1[345789]\d{9}$/;
        if (!phoneVal) {
          $(this).siblings('.tips').text('请输入手机号码').show()
        } else if (!phoneReg.test(phoneVal)) {
          $(this).siblings('.tips').text('请输入正确号码').show()
        } else {
          $(this).siblings('.tips').hide()
        }
      })
      $(document).on('blur', '.chaqz-info-wrapper #pwd', function () {
        var pwdValue = $(this).val()
        if (!pwdValue) {
          $(this).siblings('.tips').text('请输入密码').show()
        } else {
          $(this).siblings('.tips').hide()
        }
      })
      // 登录处理
      $('.chaqz-info-wrapper .login-btn').click(function () {
        _that.login(tbName)
      })
      //回车搜索
      $('.chaqz-info-wrapper #pwd').bind('keydown', function (event) {
        var evt = window.event || event;
        if (evt.keyCode == 13) {
          _that.login()
        }
      });
    },
    getInfo: function () {
      var userWrap = $('.chaqz-info-wrapper.user')
      if (userWrap.length && isLogin) {
        userWrap.show()
      } else {
        var memInfo = SAVE_MEMBER;
        // var bindInfo = SAVE_BIND;
        if (memInfo.member) {
          // this.infoDom(memInfo, bindInfo)
          anyDom.infoDom(memInfo)
        } else {
          anyDom.init()
        }
        $('.chaqz-info-wrapper #logout').click(function () {
          $('.chaqz-info-wrapper.user').hide();
          logOut()
        })
      }
    }
  }
  // 关闭登录弹窗
  $(document).on('click', '.chaqz-info-wrapper .hided', function () {
    $('.chaqz-info-wrapper').remove()
  })
  //  退出
  function logOut() {
    isLogin = false;
    SAVE_MEMBER = {};
    chrome.storage.local.remove(['chaqzShopInfo'], function () {});
    localStorage.removeItem('chaqz_token');
  }
  // 个人信息
  $(document).on('click', '#userBtn', function () {
    anyDom.getInfo();
    return false
  });

  function getUserInfo() {
    var saveToke = localStorage.getItem('chaqz_token');
    chrome.runtime.sendMessage({
      key: 'getData',
      options: {
        url: BASE_URL + '/api/v1/user/userinfo',
        type: 'GET',
        headers: {
          Authorization: "Bearer " + saveToke
        }
      }
    }, function (val) {
      if (val.code == 200) {
        var res = val.data;
        res.username = res.account;
        res.member.expireAt = res.member.expire_at;
        SAVE_MEMBER = res;
        // window.SAVE_MEMBER2 = res;
        isLogin = true;
        // changeLoginStatus()
      } else {
        isLogin = false;
        LogOut()
      }
    })
  }
}
/**---- funs -------*/
function dealSales(sale) { //销量处理
  if (!sale) {
    return 0;
  }
  var isBig = sale.indexOf('万') != -1 ? true : false;
  var changeNum = parseFloat(sale);
  var res = isBig ? changeNum * 10000 : changeNum * 1;
  return res;
}

function getHeightLow(data) {
  var sortArr = data.sort(function (a, b) {
    return a - b;
  })
  var len = data.length;
  var total = 0;
  for (let j = 0; j < len; j++) {
    total += data[j];
  }
  var avg = (total / len).toFixed(2);
  return {
    high: sortArr[len - 1],
    low: sortArr[0],
    avg
  }
}

function getSearchPara(url, key) {
  if (!url) return '';
  var params = url.split('?')[1];
  var parList = params.split('&');
  var res = '';
  for (let i = 0; i < parList.length; i++) {
    const element = parList[i];
    var keyVale = element.split('=');
    if (keyVale[0] == key) {
      res = keyVale[1]
      break;
    }
  }
  return res;
}
// 获取cookie某项值
function getCookie(key) {
  var cookies = document.cookie;
  var splitList = cookies.split('; ');
  var res = '';
  for (let i = 0; i < splitList.length; i++) {
    const element = splitList[i].split('=');
    if (element[0] == key) {
      res = element[1];
      break;
    }
  }
  return res
}
//随机三位数
function randomNum() {
  var arr = '';
  for (let i = 0; i < 3; i++) {
    var random = Math.floor(Math.random() * 10);
    arr += random;
  }
  return arr * 1;
}
// 日期格式化
function formate(fmt, date) {
  if (!date) {
    return ''
  }
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
// 排序
function babelSort(data, type) {
  if (!data) {
    return []
  }
  var arr = data;
  var len = arr.length;
  for (var i = 0; i < len; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
      if (arr[j][type] > arr[j + 1][type]) {
        var temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr;
}