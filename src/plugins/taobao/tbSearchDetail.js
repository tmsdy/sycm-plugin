var SAVE_CUR_PAGE = {};
var webSite = judgeWebsite()

$(document).on('mouseenter', '.echart-tab', function () {
  $(this).addClass('area-show');
  var index = $(this).index('.echart-tab');
  var chartData = index == 1 ? SAVE_CUR_PAGE.offlineShowInfo : index == 2 ? SAVE_CUR_PAGE.priceShowInfo : SAVE_CUR_PAGE.addrShowInfo;
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
      console.log(e.target.id, ',', e.target.className)
      if (e.target.id == 'mainsrp-itemlist') {
        var list = $('#mainsrp-itemlist .m-itemlist .items .item')
        console.log(list)
      }
    })
    return 'tm'
  }
  if (link.indexOf('https://s.taobao.com/search') != -1) {
    $(document).on('DOMNodeInserted', '#main', function (e) {
      console.log(e.target.id, ',', e.target.className)
      if (e.target.id == 'mainsrp-itemlist') {
        getPageInfo()
      }
    })
    return 'tb'
  }
}
// 获取页面信息
function getPageInfo() {
  var list = $('#mainsrp-itemlist .m-itemlist .items .item')
  console.log(list)
  var itemLen = list.length;
  var redData = {
    prices: [], //价格集
    sales: [], //销量及
    oriData: [] //原始数据
  };
  addrData = [] //地域集
  for (let i = 0; i < itemLen; i++) {
    const el = list[i];
    var price = $(el).find('.price strong').text() * 1;
    var saleText = $(el).find('.deal-cnt').text();
    var addr = $(el).find('.location').text();
    var sale = dealSales(saleText)
    redData.prices.push(price)
    redData.sales.push(sale)
    redData.oriData.push({
      price,
      sale,
      addr
    })
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
  priceStatic = getHeightLow(redData.prices)
  saleStatic = getHeightLow(redData.sales)
  console.log(redData)
  // 顶部展示区域
  var dom = '<ul class="chaqz_search_top"><li><img src="https://img.chaquanzhong.com/cqz.png"alt=""><a href="www.chaquanzhong.com">www.chaquanzhong.com</a></li><li>本页统计</li><li class="echart-tab">区域图<span class="arrow"></span></li><li class="echart-tab">下架图<span class="arrow"></span></li><li class="echart-tab">价格图<span class="arrow"></span></li><li><span class="tab">价格</span></li><li>平均价：<span class="price">' + priceStatic.avg + '</span></li><li>最高价：<span class="price">' + priceStatic.high + '</span></li><li>最低价：<span class="price">' + priceStatic.low + '</span></li><li><span class="tab">销量</span></li><li>平均销：<span class="price">' + saleStatic.avg + '</span></li><li>最高销：<span class="price">' + saleStatic.high + '</span></li><li>最低销：<span class="price">' + saleStatic.low + '</span></li></ul>';
  $('#mainsrp-itemlist').prepend(dom);
  //  获取区域图数据
  getAddressData(addrData)
  // 获取价格数据
  getPriceData(priceStatic.high, redData.oriData)
  // 获取下架数据
  getOfflineData(priceStatic.high, redData.oriData)
}

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
    // tableData: tableRows,
    // type: 1,
    // eData: {
    names: addrInfo.names,
    seller: addrInfo.seller,
    payCot: addrInfo.payCot
    // }
  }
  SAVE_CUR_PAGE.addrShowInfo = addrShowInfo;
  domStructTrend(tableRows, 0)
}
//  获取价格图数据
function getPriceData(highPrice, oriData) {
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
  SAVE_CUR_PAGE.priceShowInfo = priceShowInfo
  domStructTrend(tableRows, 2)
}
// 获取下架
function getOfflineData() {
  var tableRows = [];
  // var priceShowInfo = {
  //   names: priceInfo.names,
  //   seller: priceInfo.sellers,
  //   payCot: priceInfo.payCot
  // }
  SAVE_CUR_PAGE.offlineShowInfo = '';
  domStructTrend(tableRows, 1)
}
// 趋势table
function domStructTrend(tableData, type) {
  var title = type == 2 ? '价格图' : type == 2 ? '下架图' : '区域图';
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
  var trendTabs = $('.chaqz_search_top .echart-tab');
  trendTabs.eq(type).append(wrapper)

}
// 图标展示
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
  // LoadingPop()
}
// function LoadingPop(status) {
//   if (!status) {
//     $('.load-pop').fadeOut(100)
//     return false
//   }
//   var load = $('.load-pop')
//   if (load.length) {
//     load.show();
//     return false;
//   }
//   $('.chaqz-trend-chart').append('<div class="load-pop"><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>')
// }
