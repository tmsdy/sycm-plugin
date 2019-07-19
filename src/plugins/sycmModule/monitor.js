import {
    dealIndex
} from '../../common/dealIndex'
import {
    BASE_URL
} from '../../common/constState'
 import {
     formula,
     computedPayByr,
     getSearchParams,
     delePoint,
     operatcPmpareData,
     getFirstCateId,
     getDateRange,
     formulaRate,
     getCurrentTime,
     setDateRange,
     filterLocalData,
     getSelfShopInfo,
     filterSearchRank,
     monthDays,
     Decrypt,
     removeDuplicates,
     weekMonthDate,
     trendKeyJoin,
     trendInfoJoin,
     babelSort
 } from '../../common/commonFuns'
 import {
     LoadingPop,
     popTip,
     popUp,
     isNewVersion,
     LogOut
 } from '../../common/promptClass'
var tableInstance = null; //table实例对象
var echartsInstance = null; //echarts实例对象   
// var PLAN_LIST = [];
// var PLAN_LIST = [];
var COMP_ITEM_INFO = '';
var COUNT=0;
 //竞争模块table
function domStruct(data, title) {
    var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text();
    var switchType = data.tabs ? data.tabs : '';
    var wrapper = '<div class="chaqz-wrapper"><div class="content">' + switchType + '<div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span></div></div>'
    $('#app').append(wrapper)
   tableInstance = $('#chaqz-table').DataTable({
        data: data.data,
        columns: data.cols,
        language: {
            "paginate": {
                "next": "&gt;",
                "previous": "&lt;"
            },
            "sEmptyTable": '数据为空...'
        },
        searching: false,
        ordering: false,
        info: false,
        dom: 'Bfrtip',
        buttons: [{
                extend: 'csv',
                title: title,
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
}
//市场模块table
function domStructMark(data, title, type) {
    var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
    var isSmall = type == 2 ? 'small' : ''
    var wrapper = '<div class="chaqz-wrapper"><div class="content ' + isSmall + '"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span><div class="chaqz-mask"><span class="loader"></span></div></div></div>'
    $('#app').append(wrapper)
    tableInstance = $('#chaqz-table').DataTable({
        data: data.data,
        destroy: true,
        columns: data.cols,
        language: {
            "paginate": {
                "next": "&gt;",
                "previous": "&lt;"
            },
            "sEmptyTable": '获取数据失败，请刷新界面'
        },
        pageLength: data.paging.pageSize,
        searching: false,
        ordering: false,
        info: false,
        dom: 'Bfrtip',
        buttons: [{
                extend: 'csv',
                title: title,
                'bom': true,
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
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
    if (data.paging.page) {
        tableInstance.page(Number(data.paging.page) - 1).draw(false)
    };
    tableInstance.on('page.dt', function (e, x, y) {
        var timer = null;
        var hasCount = 0;
        var info = tableInstance.page.info();
        if (type == 1) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.mc-marketMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            var titleType = title == '监控店铺' ? 'marketShop' : 'monititem'
            var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize)
            var localCacheKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize, 'local');
            var hasSave = localStorage.getItem(localKey);
            var localSave = localStorage.getItem(localCacheKey);
            if (!(hasSave || localSave)) {
                timer = setInterval(function () {
                    hasSave = localStorage.getItem(localKey);
                    localSave = localStorage.getItem(localCacheKey);
                    if (hasSave || localSave) {
                        marketMonitorShop();
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                    } else if (hasCount > 10) {
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                        popTip('获取数据失败！');
                        LoadingPop();
                    } else {
                        hasCount++
                    }
                }, 200);
            } else {
                marketMonitorShop()
            }
        } else if (type == 2) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            var titleType = title == '热门店铺' ? 'marketHotShop' : 'marketHotFood'
            var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize)
            var hasSave = localStorage.getItem(localKey)
            if (!(hasSave || localSave)) {
                timer = setInterval(function () {
                    hasSave = localStorage.getItem(localKey);
                    localSave = localStorage.getItem(localCacheKey);
                    if (hasSave || localSave) {
                        marketMonitorItem();
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                    } else if (hasCount > 10) {
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                        popTip('获取数据失败！');
                        LoadingPop();
                    } else {
                        hasCount++
                    }

                }, 200);
            } else {
                marketMonitorItem()
            }
        } else if (type == 3) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('#mqItemMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            var localKey = getSearchParams('monititem', (info.page + 1), data.paging.pageSize)
            var localCacheKey = getSearchParams('monititem', (info.page + 1), data.paging.pageSize, 'local')
            var hasSave = localStorage.getItem(localKey);
            var localSave = localStorage.getItem(localCacheKey);
            if (!(hasSave || localSave)) {
                timer = setInterval(() => {
                    hasSave = localStorage.getItem(localKey);
                    localSave = localStorage.getItem(localCacheKey);
                    if (hasSave || localSave) {
                        MonitorItem();
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                    } else if (hasCount > 10) {
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                        popTip('获取数据失败！');
                        LoadingPop();
                    } else {
                        hasCount++
                    }
                }, 200);
            } else {
                MonitorItem();
            }
        } else if (type == 4) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            marketRank()
        } else if (type == 5) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.op-mc-shop-recognition .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            var localKey = getSearchParams('topDrainList', (info.page + 1), data.paging.pageSize)
            // var localCacheKey = getSearchParams('topDrainList', (info.page + 1), data.paging.pageSize, 'local')
            var hasSave = localStorage.getItem(localKey);
            // var localSave = localStorage.getItem(localCacheKey);
            if (!hasSave) {
                timer = setInterval(() => {
                    hasSave = localStorage.getItem(localKey);
                    // localSave = localStorage.getItem(localCacheKey);
                    if (hasSave) {
                        recognitDrainShop();
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                    } else if (hasCount > 10) {
                        clearInterval(timer);
                        timer = null;
                        hasCount = 0;
                        popTip('获取数据失败！');
                        LoadingPop();
                    } else {
                        hasCount++
                    }
                }, 200);
            } else {
                recognitDrainShop();
            }
        }
    })
    LoadingPop();
    $('.chaqz-wrapper').fadeIn(100);
}
 // 趋势table
 function domStructTrend(data, title, eDate, edata) {
     var titleImg = title.picUrl ? ('<img src="' + title.picUrl + '">') : '';
     var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">趋势分析</span></div><div>' + titleImg + '<span>' + title.name + '</span></div></div><div id="chaqzx-echarts-wrap"></div><div class="table-box"><table id="chaqz-table-trend" class="trend-table"></table></div></div><span class="chaqz-close">×</span></div></div>'
     $('#app').append(wrapper)
     $('#chaqz-table-trend').DataTable({
         data: data.data,
         columns: data.cols,
         language: {
             "paginate": {
                 "next": "&gt;",
                 "previous": "&lt;"
             },
             "sEmptyTable": '获取数据失败，请刷新界面',
             //  zeroRecords:"没有匹配数据"
         },
         searching: false,
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
         tooltip: {
             trigger: 'axis'
         },
         grid: {
             right: '5%',
             left: '5%'
         },
         xAxis: {
             type: 'category',
             boundaryGap: false,
             data: eDate
         },
         yAxis: [{
             type: 'value',
             axisLine: {
                 show: false
             },
             axisTick: {
                 show: false
             },
             axisLabel: {
                 show: false
             },
             splitLine: {
                 show: true
             }
         }],
     }
     if (title.type == 'dapan') {
         option.series = [{
                     name: edata.typeNames.selfName,
                     type: 'line',
                     smooth: true,
                     showSymbol: false,
                     symbol: 'circle',
                     data: edata.self
                 },
                 {
                     name: edata.typeNames.cateName,
                     type: 'line',
                     smooth: true,
                     showSymbol: false,
                     symbol: 'circle',
                     data: edata.cate
                 },
             ]
     } else if (title.type == 'only') {
         option.series[{
                 name: title.name,
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata
             }]
     } else if (title.type == 'sourceTrend') {
         option.series = [{
                 name: '本店',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.self
             },
            {
                name: '竞店1',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                data: edata.rival1
            }, {
                name: '竞店2',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                data: edata.rival2
            }]
     } else if (title.type == 'itemSourceTrend') {
         option.series = [{
                     name: edata.itemName[0],
                     type: 'line',
                     smooth: true,
                     showSymbol: false,
                     symbol: 'circle',
                     data: edata.data[0]
                 },
                 {
                     name: edata.itemName[1],
                     type: 'line',
                     smooth: true,
                     showSymbol: false,
                     symbol: 'circle',
                     data: edata.data[1]
                 }, {
                     name: edata.itemName[2],
                     type: 'line',
                     smooth: true,
                     showSymbol: false,
                     symbol: 'circle',
                     data: edata.data[2]
                 }
             ]
     } else {
         option = {
             tooltip: {
                 trigger: 'axis'
             },
             toolbox: {
                 show: true
             },
             legend: {
                 data: ['访客人数', '支付转化率', '交易金额', '支付人数'],
                 right: '5%'
             },
             grid: {
                 right: '5%',
                 left: '5%'
             },
             xAxis: {
                 type: 'category',
                 boundaryGap: false,
                 data: eDate
             },
             yAxis: [{
                 type: 'value',
                 axisLine: {
                     show: false
                 },
                 axisTick: {
                     show: false
                 },
                 axisLabel: {
                     show: false
                 },
                 splitLine: {
                     show: true
                 }
             }, {
                 type: 'value',
                 show: false,
             }, {
                 type: 'value',
                 show: false,
             }, {
                 type: 'value',
                 show: false,
             }],
             series: [{
                     name: '访客人数',
                     type: 'line',
                     smooth: true,
                     yAxisIndex: 0,
                     showSymbol: false,
                     symbol: 'circle',
                     lineStyle: {
                         color: '#2062E6'
                     },
                     itemStyle: {
                         color: '#2062E6'
                     },
                     data: edata.uvIndex
                 },
                 {
                     name: '支付转化率',
                     type: 'line',
                     smooth: true,
                     yAxisIndex: 1,
                     showSymbol: false,
                     symbol: 'circle',
                     lineStyle: {
                         color: '#F3D024'
                     },
                     itemStyle: {
                         color: '#F3D024'
                     },
                     data: edata.payRateIndex
                 },
                 {
                     name: '交易金额',
                     type: 'line',
                     smooth: true,
                     yAxisIndex: 2,
                     showSymbol: false,
                     symbol: 'circle',
                     lineStyle: {
                         color: '#FF8533'
                     },
                     itemStyle: {
                         color: '#FF8533'
                     },
                     data: edata.tradeIndex
                 },
                 {
                     name: '支付人数',
                     type: 'line',
                     smooth: true,
                     yAxisIndex: 3,
                     showSymbol: false,
                     symbol: 'circle',
                     lineStyle: {
                         color: '#4CB5FF'
                     },
                     itemStyle: {
                         color: '#4CB5FF'
                     },
                     data: edata.payByrCntIndex
                 }
             ]
         };
     }

     myChart.setOption(option);
     LoadingPop()
 }
 function trendTable(paramsSwitch) {
     var maskWrap = $('.ant-modal-mask:not(.ant-modal-mask-hidden)').siblings('.ant-modal-wrap')
     var maskHead = maskWrap.find('.ant-modal-header')
     switchType = paramsSwitch ;
     if ($(maskHead).find('.serachBtn').length) {
         return false
     }
     $(maskHead).append('<div class="chaqz-btns btnsItem1 trend"><button id="search" class="serachBtn">一键转化</button></div>')
     var useIdDom = $(maskWrap).find('.op-mc-rival-trend-analysis').attr('id')
     var useArr = useIdDom ? useIdDom.split('-') : ''
     var useId = useArr[useArr.length - 1]
     $(maskHead).find('#search').click(function () {
         if (!isNewVersion()) {
             return false
         }
         trendTableShow(switchType, useId)
     })
 }
 function trendSourceTable(pageId,type) {
     var maskWrap = $('.ant-modal-mask:not(.ant-modal-mask-hidden)').siblings('.ant-modal-wrap')
     var maskHead = maskWrap.find('.ant-modal-header')
     if ($(maskHead).find('.serachBtn').length) {
         return false
     }
     $(maskHead).append('<div class="chaqz-btns btnsItem1 trend"><button id="search" class="serachBtn">一键转化</button></div>')
     $(maskHead).find('#search').click(function () {
         if (!isNewVersion()) {
             return false
         }
         var selecItem = $('#sycm-mc-flow-analysis .oui-index-picker-list .ant-radio-wrapper-checked').parent().index();
         var seleName = ['uvIndex', 'payByrCntIndex', 'payRateIndex', 'tradeIndex'][selecItem];
         seleName = !selecItem ? 'uv' : seleName;
         var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
         if(type){
              var selectInfo = getCompareItems();
              var localKey = getSearchParams('getSourceTrend', 1, 10, 'local', {
                  usrId: selectInfo.keys,
                  indexCode: seleName,
                  pageId: pageId,
                  type:'item'
              })
              var localData = localStorage.getItem(localKey);
              if (!localData) {
                  popTip('获取数据失败')
                  return false;
              }
              var reductData = JSON.parse(filterLocalData(localData));
              reductData = dayIndex == '实 时' ? reductData.data : reductData;
              var filterType = !selecItem ? 4 : selecItem;
              var sendData = filterSourceTrend(reductData, seleName, filterType, selectInfo.keyword.enkey);
              if (!selecItem){
                compareItemSourceTrend({
                    value: sendData
                }, selectInfo, selecItem, seleName);
                return false
              }
              dealIndex({
                  type: 'dealTrend',
                  dataType: sendData
              }, function (val) {
                compareItemSourceTrend(val, selectInfo, selecItem, seleName)
              })
              return false;
         }
         var selectInfo = getCompareShops();
         var selfInfo = getSelfShopInfo();
         var endKey = selectInfo.keys + '&selfUserId=' + selfInfo.runAsUserId
         var localKey = getSearchParams('getSourceTrend', 1, 10, 'local', {
             usrId: endKey,
             indexCode: seleName,
             pageId: pageId
         })
         var localData = localStorage.getItem(localKey);
         if (!localData) {
             popTip('获取数据失败')
             return false;
         }
         var reductData = JSON.parse(filterLocalData(localData));
         reductData = dayIndex == '实 时' ? reductData.data : reductData;
         var sendData = filterSourceTrend(reductData, seleName, selecItem);
         dealIndex({
             type: 'dealTrend',
             dataType: sendData
         }, function (val) {
             var transData = val.value[seleName];
             var tableData = [];
             var comItmeArr = selectInfo.resData;
             var month30Days = monthDays();
             for (let i = 0; i < 30; i++) {
                 var itemNums = selectInfo.locat.length + 1;
                 // var saveSelfData = '';
                 for (let j = 0; j < itemNums; j++) {
                     var obj = {
                         shop: {}
                     };
                     var cot = i;
                      if (j > 0) {
                          cot = j * 30 + i;
                      }
                     obj.date = month30Days[i]
                     obj.tradeIndex = selecItem == 2 ? (transData[cot] * 100).toFixed(2) + '%' : transData[cot];
                     if (j == 0) {
                         obj.categroy = '本店';
                         obj.shop.title = selfInfo.runAsUserName;
                         obj.shop.url = selfInfo.runAsUserImg;
                         obj.shopId = selfInfo.runAsUserId;
                         tableData.push(obj);
                     } else {
                         obj.categroy = '竞店' + selectInfo.locat[j - 1];
                         obj.shop.title = comItmeArr[j - 1].name;
                         obj.shop.url = comItmeArr[j - 1].picUrl;
                         obj.shopId = comItmeArr[j - 1].userId;
                         tableData.push(obj);
                     }
                 }

             }
             var names = ['访客人数', '支付人数', '支付转化率', '交易金额']
             var cols = [
                 {
                     data: 'date',
                     title: '日期'
                 },
                 {
                     data: 'categroy',
                     title: '类别'
                 }, {
                     data: 'shop',
                     title: '店铺信息',
                     class: 'info',
                     render: function (data, type, row, meta) {
                         return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                     }
                 }, {
                     data: 'shopId',
                     title: '店铺ID'
                 },
                 {
                     data: 'tradeIndex',
                     title: names[selecItem]
                 }
             ];
             var echartData = {};
             echartData.self = transData.slice(0,30);
             for (let k = 0; k < selectInfo.locat.length; k++) {
                echartData['rival' + (selectInfo.locat[k])] = transData.slice(30 * (k + 1), 30 * (k + 2))
             }
             domStructTrend({
                 data: tableData,
                 cols: cols
             }, {
                 name: '入店来源趋势-' + names[selecItem],type:'sourceTrend'
             }, month30Days, echartData)
         })
     })
 }
//  竞品-入店来源趋势
function compareItemSourceTrend(val, selectInfo, selecItem, seleName) {
     var transData = val.value[seleName];
     var tableData = [];
     var comItmeArr = selectInfo.resData;
      var chainName = selectInfo.keyword.name;
     var month30Days = monthDays();
     for (let i = 0; i < 30; i++) {
         var itemNums = selectInfo.keyword.name.length;
         for (let j = 0; j < itemNums; j++) {
             var obj = {
                 shop: {}
             };
             var cot = i;
             if (j > 0) {
                 cot = j * 30 + i;
             }
             obj.date = month30Days[i]
             obj.tradeIndex = selecItem == 2 ? (transData[cot] * 100).toFixed(2) + '%' : transData[cot];
            obj.categroy = chainName[j];
            obj.shop.title = !j ? comItmeArr[chainName[j]].title : comItmeArr[chainName[j]].name;
            obj.shop.url = !j ? comItmeArr[chainName[j]].pictUrl : comItmeArr[chainName[j]].picUrl;
            obj.shopId = comItmeArr[chainName[j]].itemId;
            tableData.push(obj);
         }

     }
     var names = ['访客人数', '支付人数', '支付转化率', '交易金额']
     var cols = [{
             data: 'date',
             title: '日期'
         },
         {
             data: 'categroy',
             title: '类别'
         }, {
             data: 'shop',
             title: '店铺信息',
             class: 'info',
             render: function (data, type, row, meta) {
                 return '<img src="' + data.url + '"><span>' + data.title + '</span>';
             }
         }, {
             data: 'shopId',
             title: '店铺ID'
         },
         {
             data: 'tradeIndex',
             title: names[selecItem]
         }
     ];
     var echartData = {};
     echartData.itemName = chainName;
     echartData.data = [];
     for (let k = 0; k < selectInfo.keyword.name.length; k++) {
          echartData.data.push(transData.slice(30 * k , 30 * (k + 1)));
     }
     domStructTrend({
         data: tableData,
         cols: cols
     }, {
         name: '入店来源趋势-' + names[selecItem],
         type: 'itemSourceTrend'
     }, month30Days, echartData)
}
 function filterSourceTrend(data,type,item,filterArr){
    var resIndex = {};
    resIndex[type] = []
    var pushOrder = filterArr ? filterArr:['selfShop', 'rivalShop1', 'rivalShop2'];
    var indexList = ['UvIndex', 'PayByrCntIndex', 'PayRateIndex', 'TradeIndex', 'Uv'];
    for (let i = 0; i < 3; i++) {
        var pKey = pushOrder[i];
        var kindData = data[pKey + indexList[item]];
        if (!kindData) {
            continue;
        }
        resIndex[type] = resIndex[type].concat(data[pKey + indexList[item]]);
    }
    return resIndex
 }
 function trendTableShow(switchType, useId) {
      LoadingPop('show')
      var trendFont = getSearchParams("allTrend")
      var trendKey = switchType + '/' + trendFont + '&userId=' + useId
      var firstCateId = getFirstCateId();
      var shopInfoKey = switchType + "/trendShopcateId=" + firstCateId + '&userId=' + useId;
      var localKey = trendKeyJoin(switchType, useId);
      var localInfo = trendInfoJoin(switchType, useId, firstCateId);
      var shopInfo = JSON.parse(localStorage.getItem(shopInfoKey)) || JSON.parse(filterLocalData(localStorage.getItem(localInfo)));
      var localTrendData = JSON.parse(localStorage.getItem(trendKey)) || JSON.parse(filterLocalData(localStorage.getItem(localKey)));
      dealIndex({
          type: 'dealTrend',
          dataType: localTrendData
      }, function (val) {
          var resData = []
          var res = val.value
          var eDateArr = getDateRange(getCurrentTime(), "MM-dd")
          var tableDateArr = getDateRange(getCurrentTime())
          for (var i = 0; i < 30; i++) {
              var obj = {}
              obj.date = tableDateArr[i]
              obj.tradeIndex = res.tradeIndex[i] == '超出范围,请使用插件最高支持7.8亿' ? '-' : res.tradeIndex[i]
              obj.uvIndex = res.uvIndex[i]
              obj.payByr = res.payByrCntIndex[i]
              obj.payRate = res.payRateIndex[i] ? (res.payRateIndex[i] * 100).toFixed(2) + '%' : '-';
              obj.kdPrice = formula(obj.tradeIndex, res.payByrCntIndex[i], 1)
              obj.uvPrice = formula(obj.tradeIndex, res.uvIndex[i], 1)
              resData.push(obj)
          }
          var cols = [{
                  data: 'date',
                  title: '日期',
              },
              {
                  data: 'tradeIndex',
                  title: '交易金额',
              },
              {
                  data: 'uvIndex',
                  title: '访客人数',
              },
              {
                  data: 'payRate',
                  title: '支付转化率',
              }, {
                  data: 'payByr',
                  title: '支付人数',
              }, {
                  data: 'kdPrice',
                  title: '客单价',
              }, {
                  data: 'uvPrice',
                  title: 'UV价值',
              }
          ]

          domStructTrend({
              data: resData,
              cols: cols
          }, shopInfo, eDateArr, res)
      })
 }
/**function type-------------- */

// 获取对比选项
function getCompareShops() {
    var searchItemWrap = $('.op-mc-shop-analysis .sycm-common-select-wrapper .alife-dt-card-sycm-common-select');
    var searchKey2 = searchItemWrap.eq(1).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(1).find('.sycm-common-select-selected-title').text() : '';
    var searchKey3 = searchItemWrap.eq(2).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(2).find('.sycm-common-select-selected-title').text() : '';
    var keyword = [];
    var locat = []
    var compareShops = dataWrapper.getMonitoredList.data.shop;
    if(!compareShops){
        popTip('获取竞店列表为空，请重试！');
        return false
    }
    compareShops = JSON.parse(compareShops);
    if (searchKey2){
        keyword.push(searchKey2);
        locat.push(1)
    } 
     if (searchKey3) {
         keyword.push(searchKey3);
         locat.push(2)
    }
    var len  = keyword.length;
    var resData = [];
    for (let i = 0; i < len; i++) {
        const element = keyword[i];
        var fItem = compareShops.filter(function(item){return item.name==element;})
        resData.push(fItem[0])
    }
    var keys = ''
    resData.filter(function (item, index) {
        keys += '&rivalUser' + locat[index] + 'Id=' + item.userId;
        return ;
    })
    return {
        resData: resData,
        locat: locat,
        keys :keys
    }
}
 function getLocalSelfList() {//获取对比本店商品列表
     var localSelf = localStorage.getItem('/mc/rivalShop/recommend/item.json')
     return JSON.parse(filterLocalData(localSelf))
 }
// 获取竞品对比选项
function getCompareItems(type) {
    var searchItemWrap = $('.op-mc-item-analysis .sycm-common-select-wrapper .alife-dt-card-sycm-common-select');
    var searchKey1 = searchItemWrap.eq(0).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(0).find('.sycm-common-select-selected-title').text() : '';
    var searchKey2 = searchItemWrap.eq(1).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(1).find('.sycm-common-select-selected-title').text() : '';
    var searchKey3 = searchItemWrap.eq(2).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(2).find('.sycm-common-select-selected-title').text() : '';
    var selfFoodList = getLocalSelfList();//自身商品列表
    var mointFoodList = JSON.parse(dataWrapper.getMonitoredList.data.item); //竞品商品列表
    var keyword = [];
    var selectList = {};
    var indexKey = [];
    var selfPara = '';
    var comPara = '';
    var titleList = [];
     if (!selfFoodList || !mointFoodList) {
         popTip('获取竞店列表为空，请重试！');
         return false
     }
    for (let i = 0; i < 3; i++) {
        var compareKey = i == 1 ? searchKey2 : i == 2 ? searchKey3 :searchKey1;
        if (!compareKey) {
            continue;
        }
        if(i==0){
            for (var j = 0; j < selfFoodList.length; j++) {
                if (selfFoodList[j].title == searchKey1) {
                    selfPara = '&selfItemId=' + selfFoodList[j].itemId;
                    keyword.push('本店商品');
                    indexKey.push('selfItem');
                    type == 'title' ? titleList.push(compareKey) : '';
                    selectList['本店商品'] = selfFoodList[j];
                    break;
                }
            }
        }else{
            for (var k = 0; k < mointFoodList.length; k++) {
                if (mointFoodList[k].name == compareKey) {
                    keyword.push('竞品'+i);
                    indexKey.push('rivalItem' + i);
                    selectList['竞品' + i] = mointFoodList[k];
                    type == 'title' ? titleList.push(compareKey) : '';
                    comPara += '&rivalItem' + i + 'Id=' + mointFoodList[k].itemId;
                    break;
                }
            }
        }
    }
    return {
        resData: selectList,
        keyword: {
            name:keyword,
            enkey: indexKey
        },
        keys: comPara+selfPara,
        titleList
    }
}
// 获取品牌对比选项
function getCompareBrands(type) {
    var searchItemWrap = type ? $('.mc-brandCustomer #completeShop .alife-dt-card-sycm-common-select') : $('.op-mc-brand-analysis .sycm-common-select-wrapper .alife-dt-card-sycm-common-select');
    var searchKey1 = searchItemWrap.eq(0).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(0).find('.sycm-common-select-selected-title').text() : '';
    var searchKey2 = searchItemWrap.eq(1).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(1).find('.sycm-common-select-selected-title').text() : '';
    var searchKey3 = searchItemWrap.eq(2).find('.sycm-common-select-selected-title').length ? searchItemWrap.eq(2).find('.sycm-common-select-selected-title').text() : '';
    var mointBrandList = JSON.parse(dataWrapper.getMonitoredList.data.brand); //竞品商品列表
    var keyword = [];
    var selectList = [];
    var indexName = []
    var selecIdList = [];
    var diffIds = '';
    var comPara = '';
     if (!mointBrandList) {
         popTip('获取品牌列表为空，请重试！');
         return false
     }
    for (let i = 0; i < 3; i++) {
        var compareKey = i == 0 ? searchKey1 : i == 1 ? searchKey2 : searchKey3;
        if (!compareKey) {
            diffIds+=',';
            continue;
        }
        for (var k = 0; k < mointBrandList.length; k++) {
            if (mointBrandList[k].name == compareKey) {
                keyword.push('品牌' + (i + 1));
                indexName.push('rivalBrand' + (i+1));
                selecIdList.push(mointBrandList[k].brandId);
                selectList.push(mointBrandList[k]);
                 diffIds += mointBrandList[k].brandId +',';
                comPara += '&rivalBrand' + (i + 1) + 'Id=' + mointBrandList[k].brandId
                break;
            }
        }
    }
    diffIds=diffIds.slice(0,-1);
    return {
        resData: selectList,
        keyword: keyword,
        diffIds: diffIds,
        indexName: indexName,
        keys: comPara,
        selectIds: selecIdList
    }
}

/**event addListen --------------------*/
//竞争-监控店铺
$(document).on('click', '.mc-shopMonitor #search', function () {
    if (!isNewVersion()) {
        return false
    }
    shopTable()

});
//竞争-竞店识别
$(document).on('click', '.op-mc-shop-recognition .op-mc-rival-trend-analysis-chart-container-title #search', function () {
    if (!isNewVersion()) {
        return false
    }
    shopIndentify()
});
$(document).on('click', '.op-mc-shop-recognition #shopRecognitionDrainShopList .oui-card-header-wrapper  #search', function () {
    if (!isNewVersion()) {
        return false
    }
    recognitDrainShop('pageType')
});
$(document).on('click', '.op-mc-shop-recognition #shopRecognitionDrainShopList .alife-dt-card-common-table-right-column', function () {
    setTimeout(function(){
        trendTable()
    },500)
});
// 竞争-竞店分析
$(document).on('click', '.op-mc-shop-analysis .op-mc-shop-analysis-trend .oui-card-header #search', function () {
   shopCompareAnaly()
});
//竞争-监控商品
$(document).on('click', '.mc-ItemMonitor #search', function () {
    if (!isNewVersion()) {
        return false
    }
    MonitorItem('page')
});
//竞争-分析竞品
$(document).on('click', '.op-mc-item-analysis #itemAnalysisTrend .oui-card-header #search', function () {
    if (!isNewVersion()) {
        return false
    }
    compareItem()
});
$(document).on('click', '.op-mc-shop-analysis .alife-one-design-sycm-indexes-trend .oui-pro-chart-component-legend-content #search', function () {// 趋势分析
    compareShopTrend()
});
$(document).on('click', '.op-mc-shop-analysis .sycm-mc-flow-analysis .oui-card-header #search', function () { // resource door
    getShopFlowSource()
});
$(document).on('click', '.op-mc-shop-analysis #shopAnalysisItems .oui-card-header #search', function () { // top10 榜单
    getInitShopTen()
});
$(document).on('click', '.chaqz-wrapper .chaqz-top-tabs .switchTop10', function () { // top10 榜单tab 切换
     if ($(this).hasClass('active')) {
         return false;
     }
     $(this).addClass('active').siblings().removeClass('active');
     var curId = $(this).data('id');
     getShopTopTen(curId)
});
$(document).on('click', '.op-mc-shop-analysis #sycm-mc-flow-analysis .ant-table-row-level-0 td:last-child', function () { // 入口来源趋势
    var pageId = $(this).parent().data('row-key');
     setTimeout(function () {
         trendSourceTable(pageId)
     }, 500)
});
$(document).on('click', '.op-mc-item-analysis #sycm-mc-flow-analysis .ant-table-row-level-0 td:last-child', function () { //竞品分析 入口来源趋势
    var pageId = $(this).parent().data('row-key');
     setTimeout(function () {
         trendSourceTable(pageId,'item')
     }, 500)
});
//竞争-分析竞品-入口来源
$(document).on('click', '.op-mc-item-analysis #sycm-mc-flow-analysis .oui-card-header #search', function () {
    if (!isNewVersion()) {
        return false
    }
    compareResource()
})
$(document).on('click', '.op-mc-item-analysis #itemAnalysisKeyword .oui-card-header-wrapper #search', function () {
    compareItemKeywords()
})
$(document).on('click', '.chaqz-wrapper .chaqz-top-tabs .switchItemKey', function () { //   入店搜索词tab 切换
    if ($(this).hasClass('active')) {
        return false;
    }
    $(this).addClass('active').siblings().removeClass('active');
    var curId = $(this).data('id');
    var name = $(this).text();
    compareItemKeywords(curId,name)
});
$(document).on('click', '.op-mc-item-analysis .alife-one-design-sycm-indexes-trend .oui-pro-chart-component-legend-content #search', function () { // 趋势分析
    compareItemTrend()
});
$(document).on('click', '.chaqz-close', function () {
    $('.chaqz-wrapper .content').removeClass('small')
    $('.chaqz-wrapper').remove()
    tableInstance = null;
    echartsInstance = null;
})
// 监控品牌-品牌列表
$(document).on('click', '.mc-brandMonitor .oui-card-header-wrapper .oui-card-title #search', function () {
    getBrandList('pageType')
})
$(document).on('click', '.op-mc-brand-recognition .op-mc-rival-trend-analysis-chart-container #search', function () { //品牌识别
     if (!isNewVersion()) {
         return false
     }
     shopIndentify('brand')
});
$(document).on('click', '.op-mc-brand-analysis #brandAnalysisTrend .oui-card-header #search', function () { //品牌分析-关键指标对比
     compBrandIndex()
});
$(document).on('click', '.op-mc-brand-analysis .alife-one-design-sycm-indexes-trend .oui-pro-chart-component-legend-content #search', function () { // 品牌-关键指标趋势分析
    compareBrandTrend()
});
$(document).on('click', '.op-mc-brand-analysis #brandAnalysisItems .oui-card-title #search', function () { //品牌分析 top10 榜单
    compBrandTop10()
});
$(document).on('click', '.chaqz-wrapper .chaqz-top-tabs .switchBrandTop', function () { //品牌分析 top10 榜单tab 切换
    if ($(this).hasClass('active')) {
        return false;
    }
    var cateType = $(this).hasClass('shops');
    var idex = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    var curId = $(this).data('id');
    cateType ? compBrandTop10(curId, idex,'shops') : compBrandTop10(curId, idex)
});
$(document).on('click', '.op-mc-brand-analysis #brandAnalysisShops .oui-card-title #search', function () { //品牌分析 商品top10 榜单
    compBrandTop10(0,0,'shops')
});
$(document).on('click', '.mc-brandCustomer #sycmMqBrandCunstomer .oui-card-header-item-pull-left #search', function () { //品牌客群-趋势
    brandCustomer()
});
$(document).on('click', '.mc-brandCustomer #completeShopPortrait .oui-card-title #search', function () { //品牌客群-属性分析
    brandPersonAll()
});
// 品牌客群-属性-
$(document).on('click', '.mc-brandCustomer #completeShopPortrait .portrait-container #search', function () {
    var parent = $(this).parents('.oui-col').index();
    if (parent == 3) {
        brandProvce('prov')
    } else if (parent == 4) {
        brandProvce('city')
    }
})
// 品牌客群-属性- 切换
$(document).on('click', '.chaqz-wrapper  .chaqz-top-tabs .switchBrandCity', function () {
    var index = $(this).index();
    if ($(this).hasClass('active')) {
        return false;
    }
    $(this).addClass('active').siblings().removeClass('active');
    brandProvce(COMP_ITEM_INFO.type, index)
})
/**table Data  --------------------*/
// 监控店铺
 function shopTable(){
      dealIndex({
          type: 'monitShop'
      }, function (resData) {
          var cols = [
              {
                data: 'shop',
                title: '店铺信息',
                class: 'info',
                render: function (data, type, row, meta) {
                    return '<img src=\"' + data.url + '\"><span>' + data.title + '</span>';
                }
              },
              {
                  data: 'cate_cateRankId',
                  title: '行业排名',
              },
              {
                  data: 'tradeIndex',
                  title: '交易金额',
              },
              {
                  data: 'uvIndex',
                  title: '访客人数',
              },
              {
                  data: 'seIpv',
                  title: '搜索人数',
              },
              {
                  data: 'cltHit',
                  title: '收藏人数',
              },
              {
                  data: 'cartHit',
                  title: '加购人数',
              },
              {
                  data: 'payRate',
                  title: '支付转化率',
              },
              {
                  data: 'payByr',
                  title: '支付人数',
              },
              {
                  data: 'kdPrice',
                  title: '客单价',
              },
              {
                  data: 'uvPrice',
                  title: 'UV价值',
              },
              {
                  data: 'searRate',
                  title: '搜索占比',
              },
              {
                  data: 'scRate',
                  title: '收藏率',
              },
              {
                  data: 'jgRate',
                  title: '加购率',
              }
          ];
          domStruct({
              data: resData,
              cols: cols
          }, '监控店铺')
      }, dataWrapper)
}
// 竞店识别
function recognitDrainShop(pageType) {
    var curPage = $('.op-mc-shop-recognition .ant-pagination .ant-pagination-item-active').attr('title');
    var curPageSize = $('.op-mc-shop-recognition .oui-page-size .ant-select-selection-selected-value').text();
    curPageSize = Number(curPageSize);
    var itemKey = getSearchParams('topDrainList', curPage, curPageSize);
     var localData = localStorage.getItem(itemKey);
     if (!localData) {
         popTip('获取数据失败！')
         return false;
     }
     var reductData = JSON.parse(localData);
     var sendData = {};
     sendData.lostIndex = filterSearchRank(reductData.data, 'lostIndex');
     sendData.lostHits = filterSearchRank(reductData.data, 'lostHits');
     sendData.seIpvUvHits = filterSearchRank(reductData.data, 'seIpvUvHits');
     sendData.tradeIndex = filterSearchRank(reductData.data, 'tradeIndex');
     sendData.uvIndex = filterSearchRank(reductData.data, 'uvIndex');
    dealIndex({
        type: 'dealTrend',
        dataType: sendData,
    }, function (val) {
        var res = val.value
        var finaData = reductData.data
        var totalCont = reductData.recordCount
        var resData = []
        var length = finaData.length
        for (var i = 0; i < length; i++) {
            var obj = {
                shop: {}
            }
            obj.shop = {
                title: finaData[i].shop.title,
                url: finaData[i].shop.pictureUrl
            }
            obj.shopRank = i+1;
            obj.shopId = finaData[i].shop.userId;
            obj.lostIndex = res.lostIndex[i];
            obj.lostHits = res.lostHits[i];
            obj.uvIndex = res.uvIndex[i];
            obj.seIpv = res.seIpvUvHits[i];
            obj.tradeIndex = res.tradeIndex[i];
            resData.push(obj)
        }
        if (pageType) {
            if (totalCont > resData.length) {
                var visualData = []
                for (let i = 0; i < totalCont; i++) {
                    visualData.push(resData[0])
                }
                var vStart = visualData.slice(0, (curPage - 1) * curPageSize)
                var vEndIndex = (curPage - 1) * curPageSize + curPageSize
                var vEnd = vEndIndex < totalCont ? visualData.slice(vEndIndex) : []
                resData = vStart.concat(resData, vEnd)
            }
            var choseItem = "TOP流失店铺列表"
            var cols = [
                 {
                     data: 'shopRank',
                     title: '排名',
                 },
                {
                    data: 'shop',
                    title: '店铺信息',
                    class: 'info',
                    render: function (data, type, row, meta) {
                        return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                    }
                },
                {
                    data: 'shopId',
                    title: '店铺ID',
                },
                {
                    data: 'lostIndex',
                    title: '流失金额',
                },
                {
                    data: 'lostHits',
                    title: '流失人数',
                },
                {
                    data: 'uvIndex',
                    title: '访客人数',
                },
                {
                    data: 'seIpv',
                    title: '搜索人数',
                },
                {
                    data: 'tradeIndex',
                    title: '交易金额',
                },
            ]
            domStructMark({
                data: resData,
                cols: cols,
                paging: {
                    page: curPage,
                    pageSize: curPageSize
                }
            }, choseItem, 5)
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    })
}
function shopIndentify(type) {//流失列表
    if (!isNewVersion()) {
        return false
    }
    var switchType = type ? type :'shop';
    var useIdDom = $(' #drainRecognition .op-mc-rival-trend-analysis').attr('id')
    var useArr = useIdDom ? useIdDom.split('-') : ''
    var useId = useArr[useArr.length - 1]
    trendTableShow(switchType, useId)
}
//竞店分析
function shopCompareAnaly(){
     if (!isNewVersion()) {
         return false
     }
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
    var isToday = dayIndex == '实 时' ? 'today' : dayIndex == '日' ? 'day' : false; //判断是否是实时
    var shopType = $('.op-mc-shop-analysis .op-mc-shop-analysis-trend .oui-card-switch-item-container-active').index();
    var selectInfo = getCompareShops();
    var selfInfo = getSelfShopInfo();
    var endKey = selectInfo.keys + '&selfUserId=' + selfInfo.runAsUserId
    var localKey = getSearchParams('compareShopAnaly', 1, 10, 'local', {
        usrId: endKey,
        shopType: shopType
    })
    var localData = localStorage.getItem(localKey);
    if(!localData){
        popTip('获取数据失败！');
        return false;
    }
    var reductData = JSON.parse(filterLocalData(localData));
    reductData = isToday=='today' ? reductData.data: reductData;
    var filteShopType = !shopType?(isToday != 'day' && isToday != 'today') ? 2 : shopType:shopType;
    var filtRealType = (shopType && isToday == 'today') ? 'real' : 0;
    var sendData = filterCompareShopAnaly(reductData, filteShopType, filtRealType);
    dealIndex({
        type:'dealTrend',
        dataType: sendData
    },function(val){
        var transData = val.value;
        var tableData = [];
        var length = selectInfo.locat.length ? selectInfo.locat.length+1:1;
        var comItmeArr = selectInfo.resData;
        for (let i = 0; i < length; i++) {
            var obj={
                shop:{}
            };
            if (i == 0) {
                obj.categroy = '本店';
                obj.shop.title = selfInfo.runAsUserName;
                obj.shop.url = selfInfo.runAsUserImg;
                obj.shopId = selfInfo.runAsUserId;
                if (!shopType && isToday) {
                    obj.prePayItmCnt = reductData.selfShop.prePayItmCnt.value;
                    obj.fstOnsItmCnt = reductData.selfShop.fstOnsItmCnt.value;
                } else if (shopType && isToday == 'today') {
                    obj.uvIndex = reductData.selfShop.uv.value;
                    obj.seIpvUvHits = reductData.selfShop.seIpvUv.value;
                    obj.cltHit = reductData.selfShop.cltByrCnt.value;
                    obj.cartHit = reductData.selfShop.cartByrCnt.value;
                    obj.payByrCntIndex = reductData.selfShop.payByrCnt.value;
                    obj.payRateIndex = (reductData.selfShop.payRate.value * 100).toFixed(2) + '%';
                    obj.kdPrice = formulaRate(transData.tradeIndex[i], obj.payByrCntIndex);
                    obj.uvPrice = formulaRate(transData.tradeIndex[i], obj.uvIndex, 1);
                    obj.searchRate = formulaRate(obj.seIpvUvHits, obj.uvIndex, 1);
                    obj.cltRate = formulaRate(obj.cltHit, obj.uvIndex, 1);
                    obj.carRate = formulaRate(obj.cartHit, obj.uvIndex, 1);
                }
            } else {
                var localItem = 'rivalShop' + selectInfo.locat[i - 1];
                obj.categroy = '竞店' + selectInfo.locat[i - 1];
                obj.shop.title = comItmeArr[i - 1].name;
                obj.shop.url = comItmeArr[i - 1].picUrl;
                obj.shopId = comItmeArr[i - 1].userId;
                if (!shopType && isToday) {
                    obj.prePayItmCnt = reductData[localItem].prePayItmCnt.value;
                    obj.fstOnsItmCnt = reductData[localItem].fstOnsItmCnt.value;
                } else if (shopType && isToday == 'today') {
                     obj.uvIndex = reductData[localItem].uv.value;
                     obj.seIpvUvHits = reductData[localItem].seIpvUv.value;
                     obj.cltHit = reductData[localItem].cltByrCnt.value;
                     obj.cartHit = reductData[localItem].cartByrCnt.value;
                     obj.payByrCntIndex = reductData[localItem].payByrCnt.value;
                     obj.payRateIndex = (reductData[localItem].payRate.value * 100).toFixed(2) + '%';
                     obj.kdPrice = formulaRate(transData.tradeIndex[i], obj.payByrCntIndex);
                     obj.uvPrice = formulaRate(transData.tradeIndex[i], obj.uvIndex, 1);
                     obj.searchRate = formulaRate(obj.seIpvUvHits, obj.uvIndex, 1);
                     obj.cltRate = formulaRate(obj.cltHit, obj.uvIndex, 1);
                     obj.carRate = formulaRate(obj.cartHit, obj.uvIndex, 1);
                }
            }
            obj.tradeIndex = transData.tradeIndex[i];
             if (!shopType) {
                 obj.prePayAmtIndex = isToday ? transData.prePayAmtIndex[i] : '-';
             } else {
                 obj.cartByrCntIndex = transData.cartByrCntIndex[i] ? transData.cartByrCntIndex[i]:'-';
             }
            if (shopType && isToday == 'today'){
                tableData.push(obj);
                continue;
            }
            obj.uvIndex = transData.uvIndex[i];
            obj.seIpvUvHits = transData.seIpvUvHits[i];
            obj.cltHit = transData.cltHits[i];
            obj.cartHit = transData.cartHits[i];
            obj.payByrCntIndex = transData.payByrCntIndex[i];
            obj.payRateIndex = (transData.payRateIndex[i]*100).toFixed(2)+'%';
            obj.kdPrice = (transData.tradeIndex[i] == '超出范围' || !transData.payByrCntIndex[i]) ? '-' : (transData.tradeIndex[i] / transData.payByrCntIndex[i]).toFixed(2);
            obj.uvPrice = (transData.tradeIndex[i] == '超出范围' || !transData.uvIndex[i]) ? '-' : (transData.tradeIndex[i] / transData.uvIndex[i]).toFixed(2);
            obj.searchRate = transData.uvIndex[i] ? (transData.seIpvUvHits[i] / transData.uvIndex[i] * 100).toFixed(2) +'%': '-';
            obj.cltRate = transData.uvIndex[i] ? (transData.cltHits[i] / transData.uvIndex[i] * 100).toFixed(2) + '%' : '-';
            obj.carRate = transData.uvIndex[i] ? (transData.cartHits[i] / transData.uvIndex[i] * 100).toFixed(2) + '%' : '-';
            tableData.push(obj);
        }
        var cols = [
            {
                data: 'categroy',
                title: '类别'
            },
            {
                data: 'shop',
                title: '店铺信息',
                class: 'info',
                 render: function (data, type, row, meta) {
                    return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                 }
            },
            {
                data: 'shopId',
                title: '店铺ID'
            },
            {
                data: 'tradeIndex',
                title: '交易金额'
            },
            {
                data: 'uvIndex',
                title: '访客人数'
            },
            {
                data: 'seIpvUvHits',
                title: '搜索人数'
            },
            {
                data: 'cltHit',
                title: '收藏人数'
            },
            {
                data: 'cartHit',
                title: '加购人数'
            },
            {
                data: 'payByrCntIndex',
                title: '支付人数'
            },
            {
                data: 'payRateIndex',
                title: '支付转化率'
            },
            {
                data: 'kdPrice',
                title: '客单价'
            },
            {
                data: 'uvPrice',
                title: 'uv价值'
            },
            {
                data: 'searchRate',
                title: '搜索占比'
            },
            {
                data: 'cltRate',
                title: '收藏率'
            },
            {
                data: 'carRate',
                title: '加购率'
            },
        ];
        if (!shopType && isToday) {
            cols.push({
                data: 'prePayAmtIndex',
                title: '预售定金交易金额'
            }, {
                data: 'prePayItmCnt',
                title: '预售支付商品件数'
            }, {
                data: 'fstOnsItmCnt',
                title: '上新商品数'
            })
        } else if(shopType) {
            cols.push({
                data: 'cartByrCntIndex',
                title: '加购金额'
            })
        }
         domStruct({
             data: tableData,
             cols: cols
         }, '关键词指标对比')
    })
}
function filterCompareShopAnaly(data, type, dateType,fitlerKey) {
    var resIndex={
        payRateIndex: [],
        tradeIndex: [], 
        payByrCntIndex: [],
        uvIndex: [],
        seIpvUvHits: [],
        cartHits: [],
        cltHits: []
    }
   if(!type){
       resIndex.prePayAmtIndex = [];
   }else if(type == 1){
       resIndex.cartByrCntIndex = [];
   }
     var pushOrder = fitlerKey ? fitlerKey:['selfShop', 'rivalShop1', 'rivalShop2'];
     for (let i = 0; i < 3; i++) {
        var pKey = pushOrder[i];
        var kindData = data[pKey];
        if (!kindData) {
            continue;
        }
        if (dateType == 'real') {
            resIndex.tradeIndex.push(data[pKey].tradeIndex.value);
        }else if(dateType == 'realConcat') {
            resIndex.tradeIndex = resIndex.tradeIndex.concat(data[pKey].tradeIndex);
        }else if (dateType) {
           resIndex.payRateIndex = resIndex.payRateIndex.concat(data[pKey].payRateIndex);
           resIndex.tradeIndex = resIndex.tradeIndex.concat(data[pKey].tradeIndex);
           resIndex.payByrCntIndex = resIndex.payByrCntIndex.concat(data[pKey].payByrCntIndex);
           resIndex.uvIndex = resIndex.uvIndex.concat(type == 1 ? data[pKey].pvIndex: data[pKey].uvIndex );
           resIndex.seIpvUvHits = resIndex.seIpvUvHits.concat(data[pKey].seIpvUvHits ? data[pKey].seIpvUvHits : data[pKey].seIpvUvHitsIndex ? data[pKey].seIpvUvHitsIndex:[]);
           resIndex.cartHits = resIndex.cartHits.concat(data[pKey].cartHits);
           resIndex.cltHits = resIndex.cltHits.concat(type == 1 ? data[pKey].cltByrCntIndex:data[pKey].cltHits);
           if (!type) {
               resIndex.prePayAmtIndex = resIndex.prePayAmtIndex.concat(data[pKey].prePayAmtIndex);
           } else if (type == 1) {
               resIndex.cartByrCntIndex = resIndex.cartByrCntIndex.concat(data[pKey].cartByrCntIndex);
           }
        }else{
            resIndex.payRateIndex.push(data[pKey].payRateIndex.value);
            resIndex.tradeIndex.push(data[pKey].tradeIndex.value);
            resIndex.payByrCntIndex.push(data[pKey].payByrCntIndex.value);
            resIndex.uvIndex.push(type == 1 ? data[pKey].pvIndex.value: data[pKey].uvIndex.value);
            resIndex.seIpvUvHits.push(data[pKey].seIpvUvHits.value);
            resIndex.cartHits.push(data[pKey].cartHits.value);
            resIndex.cltHits.push(type == 1 ? data[pKey].cltByrCntIndex.value: data[pKey].cltHits.value);
            if(!type){
                resIndex.prePayAmtIndex.push(data[pKey].prePayAmtIndex.value);
            } else if (type == 1) {
                resIndex.cartByrCntIndex.push(data[pKey].cartByrCntIndex.value);
            }
        }
     }
     if(dateType=='real'){
         return {
             tradeIndex:resIndex.tradeIndex
         }
     }
    return resIndex
}
function compareShopTrend() { // 趋势
     if (!isNewVersion()) {
         return false
     }
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
    var isToday = dayIndex == '实 时' ? true : false; //判断是否是实时
    var shopType = $('.op-mc-shop-analysis .op-mc-shop-analysis-trend .oui-card-switch-item-container-active').index();
    var selectInfo = getCompareShops();
    var selfInfo = getSelfShopInfo();
    var endKey = selectInfo.keys + '&selfUserId=' + selfInfo.runAsUserId
    var localKey = getSearchParams('compareShopAnaly', 1, 10, 'local', {
        usrId: endKey,
        shopType: shopType,
        type: 1
    })
    var localData = localStorage.getItem(localKey);
    if(!localData){
        popTip('获取数据失败')
        return false;
    }
    var reductData = JSON.parse(filterLocalData(localData));
    reductData = isToday ? reductData.data: reductData;
    var filterCateType = (isToday && shopType) ? 'realConcat' : 1;
    var sendData = filterCompareShopAnaly(reductData, shopType, filterCateType);
    dealIndex({
        type: 'dealTrend',
        dataType: sendData
    }, function (val) {
        var transData = val.value;
        var tableData = [];
        // var length = transData.tradeIndex.length ;
        var comItmeArr = selectInfo.resData;
        var totalLen = reductData.selfShop.tradeIndex.length;
        totalLen = totalLen ? totalLen : 30;
        var month30Days = monthDays();
        var month30Days = [];
        if (dayIndex == '周') {
            month30Days = weekMonthDate('', totalLen)
        } else if (dayIndex == '月') {
            month30Days = weekMonthDate('month', totalLen)
        } else {
            month30Days = monthDays()
        }
        for (let i = 0; i < totalLen; i++) {
            var itemNums = selectInfo.locat.length + 1;
            for (let j = 0; j< itemNums; j++) {
               var obj = {
                   shop: {}
               };
               var cot = i;
               if(j>0){
                   cot = j * totalLen + i;
               }
                if (j == 0) {
                    obj.categroy = '本店';
                    obj.shop.title = selfInfo.runAsUserName;
                    obj.shop.url = selfInfo.runAsUserImg;
                    obj.shopId = selfInfo.runAsUserId;
                    if (!shopType) {
                        obj.prePayItmCnt = reductData.selfShop.prePayItmCnt ? reductData.selfShop.prePayItmCnt[i] : '-';
                        obj.fstOnsItmCnt = reductData.selfShop.fstOnsItmCnt ? reductData.selfShop.fstOnsItmCnt[i] : '-';
                    }
                } else {
                    obj.categroy = '竞店' + selectInfo.locat[j - 1];
                    obj.shop.title = comItmeArr[j - 1].name;
                    obj.shop.url = comItmeArr[j - 1].picUrl;
                    obj.shopId = comItmeArr[j - 1].userId;
                    if (!shopType) {
                        obj.prePayItmCnt = reductData['rivalShop' + selectInfo.locat[j - 1]].prePayItmCnt ? reductData['rivalShop' + selectInfo.locat[j - 1]].prePayItmCnt[i] : '-';
                        obj.fstOnsItmCnt = reductData['rivalShop' + selectInfo.locat[j - 1]].fstOnsItmCnt ? reductData['rivalShop' + selectInfo.locat[j - 1]].fstOnsItmCnt[i] : '-';
                    }
                    
                }
               obj.date = month30Days[i];
               obj.tradeIndex = transData.tradeIndex[cot];
               if(isToday && shopType){
                   tableData.push(obj);
                    continue;
               }
               obj.uvIndex = transData.uvIndex[cot];
               obj.seIpvUvHits = transData.seIpvUvHits[cot];
               obj.cltHit = transData.cltHits[cot];
               obj.cartHit = transData.cartHits[cot];
               obj.payByrCntIndex = transData.payByrCntIndex[cot];
               obj.payRateIndex = (transData.payRateIndex[cot] * 100).toFixed(2) + '%';
               obj.kdPrice = (transData.tradeIndex[cot] == '超出范围' || !transData.payByrCntIndex[cot]) ? '-' : (transData.tradeIndex[cot] / transData.payByrCntIndex[cot]).toFixed(2);
               obj.uvPrice = (transData.tradeIndex[cot] == '超出范围' || !transData.uvIndex[cot]) ? '-' : (transData.tradeIndex[cot] / transData.uvIndex[cot]).toFixed(2);
               obj.searchRate = transData.uvIndex[cot] ? (transData.seIpvUvHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
               obj.cltRate = transData.uvIndex[cot] ? (transData.cltHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
               obj.carRate = transData.uvIndex[cot] ? (transData.cartHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
               if (!shopType) {
                   obj.prePayAmtIndex = transData.prePayAmtIndex[cot]!=undefined ? transData.prePayAmtIndex[cot] : '-';
               } else {
                   obj.cartByrCntIndex = transData.cartByrCntIndex[cot];
               }
             tableData.push(obj);
            }
        }
        var cols = [
            {
                data: 'date',
                title: '日期'
            },
            {
                data: 'categroy',
                title: '类别'
            },
            {
                data: 'shop',
                title: '店铺信息',
                class: 'info',
                render: function (data, type, row, meta) {
                    return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                }
            },
            {
                data: 'shopId',
                title: '店铺ID'
            },
            {
                data: 'tradeIndex',
                title: '交易金额'
            },
        ];
        if (!(isToday && shopType)) {
            cols.push({
                data: 'uvIndex',
                title: '访客人数'
            }, {
                data: 'seIpvUvHits',
                title: '搜索人数'
            }, {
                data: 'cltHit',
                title: '收藏人数'
            }, {
                data: 'cartHit',
                title: '加购人数'
            }, {
                data: 'payByrCntIndex',
                title: '支付人数'
            }, {
                data: 'payRateIndex',
                title: '支付转化率'
            }, {
                data: 'kdPrice',
                title: '客单价'
            }, {
                data: 'uvPrice',
                title: 'uv价值'
            }, {
                data: 'searchRate',
                title: '搜索占比'
            }, {
                data: 'cltRate',
                title: '收藏率'
            }, {
                data: 'carRate',
                title: '加购率'
            })
             if (!shopType) {
                 cols.push({
                     data: 'prePayAmtIndex',
                     title: '预售定金交易金额'
                 }, {
                     data: 'prePayItmCnt',
                     title: '预售支付商品件数'
                 }, {
                     data: 'fstOnsItmCnt',
                     title: '上新商品数'
                 })
             } else {
                 cols.push({
                     data: 'cartByrCntIndex',
                     title: '加购金额'
                 })
             }
        }
        domStruct({
            data: tableData,
            cols: cols
        }, '趋势图')
    })
}
function getShopFlowSource() {
    if (!isNewVersion()) {
        return false
    }
    var selecItem = $('#sycm-mc-flow-analysis .oui-index-picker-list .ant-radio-wrapper-checked').parent().index();
    var seleName = ['uvIndex', 'payByrCntIndex', 'payRateIndex', 'tradeIndex'][selecItem];
     var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
     var isToday = dayIndex == '实 时' ? true : false; //判断是否是实时
     var selectInfo = getCompareShops();
     var selfInfo = getSelfShopInfo();
     var endKey = selectInfo.keys + '&selfUserId=' + selfInfo.runAsUserId
     var localKey = getSearchParams('getShopFlowSource', 1, 10, 'local', {
         usrId: endKey,
         orderIndex: seleName
     })
     var localData = localStorage.getItem(localKey);
     if (!localData) {
         popTip('获取数据失败')
         return false;
     }
     var reductData = JSON.parse(filterLocalData(localData));
     reductData = isToday ? reductData.data : reductData;
     var sendData = isToday ? filterShopFlowSource(reductData, 1) : filterShopFlowSource(reductData);
     dealIndex({
         type:'dealTrend',
         dataType: sendData
        },function(val){
            var transData = val.value;
            var tableData = [];
            var comItmeArr = selectInfo.resData;
            var len = reductData.length;
            for (let i = 0; i < len; i++) {
                 var itemNums = selectInfo.locat.length + 1;
                 for (let j = 0; j < itemNums; j++) {
                     var obj = {
                         shop: {}
                     };
                     var cot = i;
                     obj.tradeIndex = transData.tradeIndex[cot]!=undefined ? transData.tradeIndex[cot]:'-';
                     obj.uvIndex = transData.uvIndex[cot] != undefined ? transData.uvIndex[cot] : '-';
                     obj.payByrCntIndex = transData.payByrCntIndex[cot] != undefined ? transData.payByrCntIndex[cot] : '-';
                     obj.payRateIndex = transData.payRateIndex[cot] != undefined ? (transData.payRateIndex[cot] * 100).toFixed(2) + '%' : "_";
                     obj.souce = reductData[i].pageName.value;
                     if (j == 0) {
                         obj.categroy = '本店';
                         obj.shop.title = selfInfo.runAsUserName;
                         obj.shop.url = selfInfo.runAsUserImg;
                         obj.shopId = selfInfo.runAsUserId;
                         tableData.push(obj);
                     } else {
                         obj.categroy = '竞店' + selectInfo.locat[j - 1];
                         obj.shop.title = comItmeArr[j - 1].name;
                         obj.shop.url = comItmeArr[j - 1].picUrl;
                         obj.shopId = comItmeArr[j - 1].userId;
                         tableData.push(obj);
                     }
                 }
                
            }
            var cols = [
                 {
                     data: 'categroy',
                     title: '类别'
                 }, {
                     data: 'shop',
                     title: '店铺信息',
                     class: 'info',
                     render: function (data, type, row, meta) {
                         return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                     }
                 }, {
                     data: 'shopId',
                     title: '店铺ID'
                 },
                {
                    data: 'souce',
                    title: '流量来源'
                },
                {
                    data: 'uvIndex',
                    title: '访客人数'
                },
                {
                    data: 'payByrCntIndex',
                    title: '支付人数'
                },
                {
                    data: 'tradeIndex',
                    title: '交易金额'
                },
                {
                    data: 'payRateIndex',
                    title: '支付转化率'
                }
            ];
              domStruct({
                  data: tableData,
                  cols: cols
              }, '入店来源')
        })
}
function filterShopFlowSource(data,type){
     var resIndex = {
         payRateIndex: [],
         tradeIndex: [],
         payByrCntIndex: [],
         uvIndex: [],
     }
     var pushOrder = ['selfShop', 'rivalShop1', 'rivalShop2'];
     var length = data.length;
     for (let j = 0; j < length; j++) {
         const element = data[j];
          for (let i = 0; i < 3; i++) {
               var pKey = pushOrder[i];
               var kindData = element[pKey + 'UvIndex'];
               if (!kindData) {
                   continue;
               }
              if(type){
                 resIndex.uvIndex.push(element[pKey + 'UvIndex'].value);
              }else{
                resIndex.payRateIndex.push(element[pKey + 'PayRateIndex'].value);
                resIndex.tradeIndex.push(element[pKey + 'TradeIndex'].value);
                resIndex.payByrCntIndex.push(element[pKey + 'PayByrCntIndex'].value);
                resIndex.uvIndex.push(element[pKey + 'UvIndex'].value);
              }
          }
     }
     return resIndex
}
function getInitShopTen(){
     if (!isNewVersion()) {
         return false
     }
     var selectInfo = getCompareShops();
     var selfInfo = getSelfShopInfo();
     var tabsHtml = '<button class="switchBtn  active switchTop10" data-id=' + selfInfo.runAsUserId+ '>' + selfInfo.runAsUserName + '</button>';
     var seleItems = selectInfo.resData;
     for (let i = 0; i < seleItems.length; i++) {
         tabsHtml += '<button class="switchBtn  switchTop10" data-id=' + seleItems[i].userId + '>' + seleItems[i].name + '</button>';
     }
     tabsHtml = '<div class="chaqz-top-tabs">' + tabsHtml + '</div>';
     getShopTopTen(selfInfo.runAsUserId, tabsHtml)
}
function getShopTopTen(curItem, tabsHtml) { //top10
     var tabsSelect = $('.op-mc-shop-analysis #shopAnalysisItems .oui-tab-switch-item-active').index();//选择热销or流量
     var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
     var topType = tabsSelect?'flow':'trade';
     var localKey = getSearchParams('getTopItems', 1, 20, 'local', {
         usrId: curItem,
         topType: topType
     })
     var localData = localStorage.getItem(localKey);
     if (!localData) {
         popTip('获取数据失败')
         return false;
     }
     var reductData = JSON.parse(filterLocalData(localData));
     reductData = dayIndex == '实 时' ? reductData.data : reductData;
     var sendData = {};
     if (tabsSelect){
        sendData.uvIndex = filterSearchRank(reductData, 'uvIndex', 'value')
     }else{
        sendData.tradeIndex = filterSearchRank(reductData, 'tradeIndex','value')
     }
      dealIndex({
          type: 'dealTrend',
          dataType: sendData
      }, function (val) {
          var transData = tabsSelect ? val.value.uvIndex : val.value.tradeIndex;
          var tableData = [];
          var len = reductData.length;
          for (let i = 0; i < len; i++) {
            var obj = {
                shop: {}
            };
            obj.tradeIndex = transData[i];
            obj.shop.title = reductData[i].item.title;
            obj.shop.url = reductData[i].item.pictUrl;
            obj.shopId = reductData[i].item.detailUrl.split('id=')[1];
            tableData.push(obj);
          }
          var titleName = tabsSelect ? '访客人数' : '交易金额';
          var topName = tabsSelect?'流量':'热销';
          var cols = [{
                  data: 'shop',
                  title: '店铺信息',
                  class: 'info',
                  render: function (data, type, row, meta) {
                      return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                  }
              }, {
                  data: 'shopId',
                  title: '店铺ID'
              },
              {
                  data: 'tradeIndex',
                  title: titleName
              },
          ];
          if(tabsHtml){
             domStruct({
                 data: tableData,
                 cols: cols,
                 tabs:tabsHtml
             }, 'TOP商品榜-' + topName)
          }else{
            tableInstance.clear();
            tableInstance.rows.add(tableData).draw();
          }
         
      })

}
// 监控商品
function MonitorItem(pageType) {
    var curPage = $('.mc-ItemMonitor .ant-pagination .ant-pagination-item-active').attr('title');
    var curPageSize = $('.mc-ItemMonitor .oui-page-size .ant-select-selection-selected-value').text();
    curPageSize = Number(curPageSize);
    var localCache = false;
    var finalKey = '';
    var itemKey = getSearchParams('monititem', curPage, curPageSize);
    var localKey = getSearchParams('monititem', curPage, curPageSize, 'local')

    if (localStorage.getItem(itemKey)) {
        finalKey = itemKey;
    } else {
        finalKey = localKey;
        localCache = true;
    }
    dealIndex({
                type: 'monititem',
                dataType: finalKey,
                localCache: localCache
    }, function (val) {
        var res = val.value
        var finaData = val.final.data
        var totalCont = val.final.recordCount
        var resData = []
        var length = res.payRate.length
        for (var i = 0; i < length; i++) {
            var trandeOver = res.tradeIndex[i] != '超出范围,请使用插件最高支持7.8亿' ? Math.round(res.tradeIndex[i]) : '-'
            var computedNum = computedPayByr(res.uvIndex[i], res.payRate[i], trandeOver)
            var obj = {
                shop: {}
            }
            var cateRnkId = finaData[i].cateRankId
            obj.shop = {
                title: finaData[i].item.title,
                url: finaData[i].item.pictUrl
            }
            obj.cate_cateRankId = cateRnkId ? cateRnkId.value ? cateRnkId.value : '-' : '-'
            obj.tradeIndex = trandeOver
            obj.uvIndex = Math.round(res.uvIndex[i])
            obj.seIpv = Math.round(res.seIpv[i])
            obj.cltHit = Math.round(res.cltHit[i])
            obj.cartHit = Math.round(res.cartHit[i])
            obj.payRate = (res.payRate[i]*100).toFixed(2) + '%'
            obj.payByr = computedNum.res1
            obj.kdPrice = computedNum.res2
            obj.uvPrice = formula(trandeOver, res.uvIndex[i], 1)
            obj.searRate = formula(res.seIpv[i], res.uvIndex[i], 2)
            obj.scRate = formula(res.cltHit[i], res.uvIndex[i], 2)
            obj.jgRate = formula(res.cartHit[i], res.uvIndex[i], 2)
            resData.push(obj)
        }
        if (pageType) {
            if (totalCont > resData.length) {
                var visualData = []
                for (let i = 0; i < totalCont; i++) {
                    visualData.push(resData[0])
                }
                var vStart = visualData.slice(0, (curPage - 1) * curPageSize)
                var vEndIndex = (curPage - 1) * curPageSize + curPageSize
                var vEnd = vEndIndex < totalCont ? visualData.slice(vEndIndex) : []
                resData = vStart.concat(resData, vEnd)
            }
            var choseItem = "监控商品"
            var cols = [{
                    data: 'shop',
                    title: '店铺信息',
                    class: 'info',
                    render: function (data, type, row, meta) {
                        return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                    }
                },
                {
                    data: 'cate_cateRankId',
                    title: '行业排名',
                },
                {
                    data: 'tradeIndex',
                    title: '交易金额',
                },
                {
                    data: 'uvIndex',
                    title: '访客人数',
                },
                {
                    data: 'seIpv',
                    title: '搜索人数',
                },
                {
                    data: 'cltHit',
                    title: '收藏人数',
                }, {
                    data: 'cartHit',
                    title: '加购人数',
                }, {
                    data: 'payRate',
                    title: '支付转化率',
                }, {
                    data: 'payByr',
                    title: '支付人数',
                }, {
                    data: 'kdPrice',
                    title: '客单价',
                }, {
                    data: 'uvPrice',
                    title: 'UV价值',
                }, {
                    data: 'searRate',
                    title: '搜索占比',
                }, {
                    data: 'scRate',
                    title: '收藏率',
                }, {
                    data: 'jgRate',
                    title: '加购率',
                }
            ]
            domStructMark({
                data: resData,
                cols: cols,
                paging: {
                    page: curPage,
                    pageSize: curPageSize
                }
            }, choseItem, 3)
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    })
}
// 竞争-入店来源
 function compareResource() {
    //   var prodctRes = getProductInfo();
    //   if (prodctRes.totalNum < 2) {
    //       popTip('请选择比较商品');
    //       return false;
    //   };
    //   var idParams = getproduceIds(prodctRes, dataWrapper);
      var localCache = false;
      var finalKey = '';
      var selectInfo = getCompareItems();
      var indexKey = selectInfo.keyword.enkey;
      var itemKey = getSearchParams('monitResource').split('&page')[0];
      var localKey = getSearchParams('monitResource', 0, 0, 'local')
      if (localStorage.getItem(itemKey + selectInfo.keys)) {
          finalKey = itemKey + selectInfo.keys;
      } else {
          finalKey = localKey + selectInfo.keys;
          localCache = true;
      }
      dealIndex({
          type: 'monitResource',
          dataType: finalKey,
          datakey: indexKey,
        localCache: localCache
      }, function (val) {
        var findRes = val.value;
        var finaData = val.final;
        var itemsInfo = selectInfo.resData;
        var chinaKey = selectInfo.keyword.name;
        // var productId = dataWrapper['monitResource'].ids
        var topLength = finaData.length
        var resData = [];
          for (var i = 0; i < topLength; i++) {
            //   var itemAcct = prodctRes.totalNum
            //   var wItem = itemAcct == 2 ? findRes['rivalItem1'] ? 'rivalItem1' : 'rivalItem2' : ''
              for (var j = 0; j < chinaKey.length; j++) {
                  var obj = {
                      shop: {}
                  }
                  obj.shop = {
                    url: itemsInfo[chinaKey[j]].picUrl ? itemsInfo[chinaKey[j]].picUrl : itemsInfo[chinaKey[j]].pictUrl,
                    title: itemsInfo[chinaKey[j]].name ? itemsInfo[chinaKey[j]].name : itemsInfo[chinaKey[j]].title
                  }
                  obj.name = chinaKey[j];
                //   obj.name = j == 0 ? {
                //       name: '本店商品',
                //       class: ''
                //   } : itemAcct == 3 ? {
                //       name: ('竞品' + j),
                //       class: 'red'
                //   } : {
                //       name: ('竞品' + wItem.slice(-1)),
                //       class: 'red'
                //   };
                obj.cateRank = itemsInfo[chinaKey[j]].itemId;
                obj.pageName = finaData[i].pageName ? finaData[i].pageName.value : '-';
                obj.tradeIndex = findRes.tradeIndex[i];
                obj.payByr = findRes.payByr[i];
                obj.uvIndex = findRes.uvIndex[i];
                  var payRate = findRes.payRate[i];
                //   obj.tradeIndex = Math.round(tradeIndex)
                //   obj.uvIndex = uv ? Math.round(uv) : '-'
                  obj.payRate = payRate?(payRate * 100).toFixed(2) + '%':'-';
                //   obj.payByr = Math.round(payByr)
                  obj.kdPrice = formula(delePoint(obj.tradeIndex), delePoint(obj.payByr), 1);
                  obj.uvPrice = formula(delePoint(obj.tradeIndex), delePoint(obj.uvIndex), 1);
                  resData.push(obj)
              }
          }
          var cols = [{
                  data: 'name',
                  title: '类别',
                //   render: function (data, type, row, meta) {
                //       return '<p class="btn ' + data.class + '">' + data.name + '</p>';
                //   }
              },
              {
                  data: 'shop',
                  title: '商品信息',
                  class: 'info',
                  render: function (data, type, row, meta) {
                      return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                  }
              },
              {
                  data: 'cateRank',
                  title: '商品ID',
              }, {
                  data: 'pageName',
                  title: '流量来源',
              }, {
                  data: 'tradeIndex',
                  title: '交易金额',
              },
              {
                  data: 'uvIndex',
                  title: '访客人数',
              },
              {
                  data: 'payRate',
                  title: '支付转化率',
              }, {
                  data: 'payByr',
                  title: '支付人数',
              }, {
                  data: 'kdPrice',
                  title: '客单价',
              }, {
                  data: 'uvPrice',
                  title: 'UV价值',
              },
          ]
          domStruct({
              data: resData,
              cols: cols
          }, '入店来源')

      }, dataWrapper)
}
// 竞争-竞品对比
 function compareItem(){
    //   var prodctItem = getProductInfo();
    //   if (prodctItem.totalNum < 2) {
    //       popTip('请选择比较商品');
    //       return false
    //   };
    //   var idParams = getproduceIds(prodctItem, dataWrapper);
       var localCache = false;
       var finalKey = '';
       var selectInfo = getCompareItems();
       var itemKey = getSearchParams('monitCompareFood').split('&page')[0];
       var localKey = getSearchParams('monitCompareFood', 0, 0, 'local')

       if (localStorage.getItem(itemKey +selectInfo.keys)) {
           finalKey = itemKey + selectInfo.keys;
       } else {
           finalKey = localKey + selectInfo.keys;
           localCache = true;
       }
      dealIndex({
            type: 'monitCompareFood',
            dataType: finalKey,
            localCache: localCache
          },
          function (res) {
              var resData = [];
              var itemsInfo = selectInfo.resData;
              var indexKey = selectInfo.keyword.enkey;
              var chinaKey = selectInfo.keyword.name;
              var length = indexKey.length;
              for (var i = 0; i < length; i++) {
                  var obj = {
                      shop: {}
                  }
                  obj.shop = {
                      url: itemsInfo[chinaKey[i]].picUrl ? itemsInfo[chinaKey[i]].picUrl : itemsInfo[chinaKey[i]].pictUrl,
                      title: itemsInfo[chinaKey[i]].name ? itemsInfo[chinaKey[i]].name : itemsInfo[chinaKey[i]].title
                  }
                  obj.name = chinaKey[i];
                //   obj.name = i == 0 ? {
                //           name: '本店商品',
                //           class: ''
                //       } :
                //       prodctItem["rivalItem" + (i)].title ? {
                //           name: ('竞品' + i),
                //           class: 'red'
                //       } : {
                //           name: ('竞品' + (i + 1)),
                //           class: 'red'
                //       };
                //   var rateNum = Number(res.payRate[i]);
                //   var isNumber = isNaN(rateNum);
                  obj.tradeIndex = res.tradeIndex[i];
                  obj.uvIndex = res.uvIndex[i];
                  obj.seIpvUvHits = res.seIpv[i];
                  obj.cltHit = res.cltHit[i];
                  obj.cartHit = res.cartHit[i];
                  obj.payRate = res.payRate[i] ? ((res.payRate[i] * 100).toFixed(2) + '%') : "-";
                  obj.payByr = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num1;
                  obj.kdPrice = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num2;
                  obj.uvPrice = formulaRate(res.tradeIndex[i], res.uvIndex[i]);
                  obj.searchRate = formulaRate(res.seIpv[i], res.uvIndex[i], 1);
                  obj.cltRate = formulaRate(res.cltHit[i], res.uvIndex[i], 1);
                  obj.carRate = formulaRate(res.cartHit[i], res.uvIndex[i], 1);
                  resData.push(obj)
              }
            //   if (resData.length > 2) {
            //       resData.splice(2, 0, resData[0])
            //   }

              var cols = [{
                      data: 'name',
                      title: '类别',
                    //   render: function (data, type, row, meta) {
                    //       return '<p class="btn ' + data.class + '">' + data.name + '</p>';
                    //   }
                  },
                  {
                      data: 'shop',
                      title: '商品信息',
                      class: 'info',
                      render: function (data, type, row, meta) {
                          return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                      }
                  },
                  {
                      data: 'tradeIndex',
                      title: '交易金额',
                  },
                  {
                      data: 'uvIndex',
                      title: '访客人数',
                  },
                   {
                       data: 'payByr',
                       title: '支付人数',
                   },
                  {
                      data: 'payRate',
                      title: '支付转化率',
                  }, 
                   {
                       data: 'seIpvUvHits',
                       title: '搜索人数'
                   },
                {
                    data: 'cltHit',
                    title: '收藏人数'
                }, {
                    data: 'cartHit',
                    title: '加购人数'
                },
                {
                    data: 'searchRate',
                    title: '搜索占比'
                }, {
                    data: 'cltRate',
                    title: '收藏率'
                }, {
                    data: 'carRate',
                    title: '加购率'
                },
                  {
                      data: 'kdPrice',
                      title: '客单价',
                  }, 
                  {
                      data: 'uvPrice',
                      title: 'UV价值',
                  },
              ]
              domStruct({
                  data: resData,
                  cols: cols
              }, '关键词指标对比')
          })
}
function compareItemTrend(){
     if (!isNewVersion()) {
         return false
     }
    var selectInfo = getCompareItems();
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
    var localKey = getSearchParams('compareItemTrend', 1, 10, 'local', {
        useId: selectInfo.keys
    })
    var localData = localStorage.getItem(localKey);
    if (!localData) {
        popTip('获取数据失败')
        return false;
    }
    var reductData = JSON.parse(filterLocalData(localData));
    reductData = dayIndex == '实 时' ? reductData.data : reductData;
    var sendData = filterCompareShopAnaly(reductData, 3, 1, selectInfo.keyword.enkey);
    dealIndex({
        type: 'dealTrend',
        dataType: sendData
    }, function (val) {
        var transData = val.value;
        var tableData = [];
        var comItmeArr = selectInfo.resData;
        var chainName = selectInfo.keyword.name;
        var keyName = selectInfo.keyword.enkey;
        var totalLen = reductData[keyName[0]].tradeIndex.length;
        totalLen = totalLen ? totalLen : 30;
        var month30Days = monthDays();
        for (let i = 0; i < totalLen; i++) {
            var obj = {
                shop: {}
            };
            var itemNums = selectInfo.keyword.name.length;
            for (let j = 0; j < itemNums; j++) {
                var obj = {
                    shop: {}
                };
                var cot = i;
                if (j > 0) {
                    cot = j * totalLen + i;
                }
                obj.date = month30Days[i];
                obj.tradeIndex = transData.tradeIndex[cot];
                obj.uvIndex = transData.uvIndex[cot];
                obj.seIpvUvHits = transData.seIpvUvHits[cot];
                obj.cltHit = transData.cltHits[cot];
                obj.cartHit = transData.cartHits[cot];
                obj.payByrCntIndex = reductData[keyName[j]].payItemCnt[i];
                obj.payRateIndex = (transData.payRateIndex[cot] * 100).toFixed(2) + '%';
                obj.kdPrice = (transData.tradeIndex[cot] == '超出范围' || !obj.payByrCntIndex) ? '-' : (transData.tradeIndex[cot] / obj.payByrCntIndex).toFixed(2);
                obj.uvPrice = (transData.tradeIndex[cot] == '超出范围' || !transData.uvIndex[cot]) ? '-' : (transData.tradeIndex[cot] / transData.uvIndex[cot]).toFixed(2);
                obj.searchRate = transData.uvIndex[cot] ? (transData.seIpvUvHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
                obj.cltRate = transData.uvIndex[cot] ? (transData.cltHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
                obj.carRate = transData.uvIndex[cot] ? (transData.cartHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
                obj.categroy = chainName[j];
                obj.shop.title = comItmeArr[chainName[j]].title ? comItmeArr[chainName[j]].title : comItmeArr[chainName[j]].name;
                obj.shop.url = comItmeArr[chainName[j]].pictUrl ? comItmeArr[chainName[j]].pictUrl : comItmeArr[chainName[j]].picUrl;
                obj.shopId = comItmeArr[chainName[j]].itemId;
                tableData.push(obj);
            }
        }
        var cols = [{
                data: 'date',
                title: '日期'
            },
            {
                data: 'categroy',
                title: '类别'
            },
            {
                data: 'shop',
                title: '店铺信息',
                class: 'info',
                render: function (data, type, row, meta) {
                    return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                }
            },
            {
                data: 'shopId',
                title: '店铺ID'
            },
            {
                data: 'tradeIndex',
                title: '交易金额'
            },
            {
                data: 'uvIndex',
                title: '访客人数'
            },
            {
                data: 'seIpvUvHits',
                title: '搜索人数'
            },
            {
                data: 'cltHit',
                title: '收藏人数'
            },
            {
                data: 'cartHit',
                title: '加购人数'
            },
            {
                data: 'payByrCntIndex',
                title: '支付人数'
            },
            {
                data: 'payRateIndex',
                title: '支付转化率'
            },
            {
                data: 'kdPrice',
                title: '客单价'
            },
            {
                data: 'uvPrice',
                title: 'uv价值'
            },
            {
                data: 'searchRate',
                title: '搜索占比'
            },
            {
                data: 'cltRate',
                title: '收藏率'
            },
            {
                data: 'carRate',
                title: '加购率'
            }
        ];
        domStruct({
            data: tableData,
            cols: cols
        }, '趋势图')
    })
}
function compareItemKeywords(userId,choseIndex){
     if (!isNewVersion()) {
         return false
     }
     var curId = userId;
     if(!userId){
        var selectInfo = getCompareItems();
        var tabsHtml = '';
        var seleItems = selectInfo.resData;
        COMP_ITEM_INFO = seleItems;
        var chinaName = selectInfo.keyword.name;
        choseIndex = chinaName[0];
        for (let i = 0; i < chinaName.length; i++) {
            var isActive = i==0?'active':'';
            curId = i == 0 ? seleItems[chinaName[i]].itemId : curId;
            tabsHtml += '<button class="switchBtn ' + isActive + ' switchItemKey" data-id=' + seleItems[chinaName[i]].itemId + '>' + chinaName[i] + '</button>';
        }
        tabsHtml = '<div class="chaqz-top-tabs">' + tabsHtml + '</div>';
     }
     var tabsSelect = $('.op-mc-item-analysis #itemAnalysisKeyword .oui-tab-switch-item-active').index();
     var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
     var topType = tabsSelect ? 'trade' : 'flow';
     var localKey = getSearchParams('compItemKeyword', 1, 20, 'local', {
         useId: curId,
         hotType: topType
     })
     var localData = localStorage.getItem(localKey);
     if (!localData) {
         popTip('获取数据失败')
         return false;
     }
     var reductData = JSON.parse(filterLocalData(localData));
     reductData = dayIndex == '实 时' ? reductData.data : reductData;
      var sendData = {};
      if (!tabsSelect) {
          sendData.uv = filterSearchRank(reductData, 'uv', 'value')
          compItemShow({
              value: sendData
          }, tabsSelect, reductData, tabsHtml, curId, choseIndex)
      } else {
          sendData.tradeIndex = filterSearchRank(reductData, 'tradeIndex', 'value')
          dealIndex({
              type: 'dealTrend',
              dataType: sendData
          }, function (val) {
             compItemShow(val, tabsSelect, reductData, tabsHtml, curId, choseIndex)
          })
      }
}
function compItemShow(val, tabsSelect, reductData, tabsHtml, userId, choseIndex) {
     var transData = !tabsSelect ? val.value.uv : val.value.tradeIndex;
     var tableData = [];
     var len = reductData.length;
     var selInfo = COMP_ITEM_INFO[choseIndex]
     for (let i = 0; i < len; i++) {
         var obj = {
             shop: {}
         };
         obj.tradeIndex = transData[i];
         obj.keyword = reductData[i].keyword.value;
         obj.shop.title = selInfo.title ? selInfo.title : selInfo.name;
         obj.shop.url = selInfo.pictUrl ? selInfo.pictUrl : selInfo.picUrl;
         obj.shopId = userId;
         tableData.push(obj);
     }
     var titleName = !tabsSelect ? '访客人数' : '交易金额';
     var topName = !tabsSelect ? '引流关键词' : '成交关键词';
     var cols = [
         {
             data: 'shop',
             title: '商品信息',
             class: 'info',
             render: function (data, type, row, meta) {
                 return '<img src="' + data.url + '"><span>' + data.title + '</span>';
             }
         }, 
         {
             data: 'shopId',
             title: '商品ID'
         },
         {
             data: 'keyword',
             title: '关键词'
         },
         {
             data: 'tradeIndex',
             title: titleName
         },
     ];
     if (tabsHtml) {
         domStruct({
             data: tableData,
             cols: cols,
             tabs: tabsHtml
         }, '入店搜索词-' + topName)
     } else {
         tableInstance.clear();
         tableInstance.rows.add(tableData).draw();
     }

}
// 品牌列表
function getBrandList(pageType) {
    if(!isNewVersion()){
        popTip('获取数据失败')
    }
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
    var chooseTop = dayIndex =='实 时' ? 0 : 1;
     var curPage = $('.mc-brandMonitorr .ant-pagination .ant-pagination-item-active').attr('title');
     var curPageSize = $('.mc-brandMonitor .oui-page-size .ant-select-selection-selected-value').text();
     curPage = curPage ? curPage:1;
     curPageSize = curPageSize?Number(curPageSize):10;
     var localCache = false;
     var finalKey = '';
     var itemKey = getSearchParams('monitbrand', curPage, curPageSize);
     var localKey = getSearchParams('monitbrand', curPage, curPageSize, 'local')
     if (localStorage.getItem(itemKey)) {
         finalKey = itemKey;
     } else {
         finalKey = localKey;
         localCache = true;
     }
     dealIndex({
         type: 'monitbrand',
         dataType: finalKey,
         localCache: localCache
     }, function (vals) {
         var res = vals.value
         var finaData = vals.final.data
         var totalCont = vals.final.recordCount
         var resData = []
         var length = res.payRate.length
         for (var j = 0; j < length; j++) {
            var obj = {
                shop: {}
            }
            obj.shop = {
                title: finaData[j].brandModel.brandName,
                url: '//img.alicdn.com/tps/' + finaData[j].brandModel.logo
            }
            var cateRnkId = finaData[j].cateRankId
            obj.cate_cateRankId = cateRnkId ? cateRnkId.value : '-';
            obj.tradeIndex = res.tradeIndex[j];
            if (chooseTop) {
                obj.uvIndex =res.uvIndex[j];
                obj.seIpv = res.seIpv[j];
                obj.cltHit = res.cltHit[j];
                obj.cartHit = res.cartHit[j];
                obj.payRate = res.payRate[j] ? (res.payRate[j] * 100).toFixed(2) + '%' : '-';
                obj.payByr = Math.floor(res.uvIndex[j] * res.payRate[j]);
                obj.kdPrice = formulaRate(res.tradeIndex[j], obj.payByr);
                obj.uvPrice = formulaRate(res.tradeIndex[j], res.uvIndex[j], 1)
                obj.searRate = formulaRate(res.seIpv[j], res.uvIndex[j], 1)
                obj.scRate = formulaRate(res.cltHit[j], res.uvIndex[j], 1)
                obj.jgRate = formulaRate(res.cartHit[j], res.uvIndex[j], 1)
            }
            resData.push(obj)
         }
         if (pageType) {
             if (totalCont > resData.length) {
                 var visualData = []
                 for (let i = 0; i < totalCont; i++) {
                     visualData.push(resData[0])
                 }
                 var vStart = visualData.slice(0, (curPage - 1) * curPageSize)
                 var vEndIndex = (curPage - 1) * curPageSize + curPageSize
                 var vEnd = vEndIndex < totalCont ? visualData.slice(vEndIndex) : []
                 resData = vStart.concat(resData, vEnd)
             }
             var cols = []
             if (!chooseTop) {
                 cols = [{
                         data: 'shop',
                         title: '品牌信息',
                         class: 'info',
                         render: function (data, type, row, meta) {
                             return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                         }
                     },
                     {
                         data: 'cate_cateRankId',
                         title: '行业排名',
                     },
                     {
                         data: 'tradeIndex',
                         title: '交易金额',
                     }
                 ]
             } else {
                 cols = [{
                         data: 'shop',
                         title: '品牌信息',
                         class: 'info',
                         render: function (data, type, row, meta) {
                             return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                         }
                     },
                     {
                         data: 'cate_cateRankId',
                         title: '行业排名',
                     },
                     {
                         data: 'tradeIndex',
                         title: '交易金额',
                     },
                     {
                         data: 'uvIndex',
                         title: '访客人数',
                     },
                     {
                         data: 'seIpv',
                         title: '搜索人数',
                     },
                     {
                         data: 'cltHit',
                         title: '收藏人数',
                     }, 
                     {
                         data: 'cartHit',
                         title: '加购人数',
                     }, 
                     {
                         data: 'payRate',
                         title: '支付转化率',
                     }, 
                     {
                         data: 'payByr',
                         title: '支付人数',
                     }, 
                     {
                         data: 'kdPrice',
                         title: '客单价',
                     },
                      {
                         data: 'uvPrice',
                         title: 'UV价值',
                     }, 
                     {
                         data: 'searRate',
                         title: '搜索占比',
                     }, 
                     {
                         data: 'scRate',
                         title: '收藏率',
                     }, 
                     {
                         data: 'jgRate',
                         title: '加购率',
                     }
                 ]
             }
             domStructMark({
                 data: resData,
                 cols: cols,
                 paging: {
                     page: curPage,
                     pageSize: curPageSize
                 }
             }, '品牌列表', 1)
         } else {
             for (var j = 0; j < curPageSize; j++) {
                 tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
             }
             $('.chaqz-wrapper .chaqz-mask').hide(100)
         }
     }, window.dataWrapper)
}
function compBrandIndex(){//竞品分析-关键指标
     if (!isNewVersion()) {
         return false
     }
     var selectInfo = getCompareBrands();
     var localKey = getSearchParams('compBrandIndex',1,10,'local',{
         userId: selectInfo.keys
     })
     var localData = localStorage.getItem(localKey);
     if (!localData) {
         popTip('获取数据失败')
         return false;
     }
     var reductData = JSON.parse(filterLocalData(localData));
     var sendData = filterCompareShopAnaly(reductData,3,0,selectInfo.indexName)
        dealIndex({
            type: 'dealTrend',
            dataType: sendData
        }, function (val) {
            var transData = val.value;
            var tableData = [];
            var comItmeArr = selectInfo.resData;
            var indexNames = selectInfo.indexName;
            for (let i = 0; i < comItmeArr.length; i++) {
                var obj = {
                    shop: {}
                };
                obj.tradeIndex = transData.tradeIndex[i];
                obj.uvIndex = transData.uvIndex[i];
                obj.seIpvUvHits = transData.seIpvUvHits[i];
                obj.cltHit = transData.cltHits[i];
                obj.cartHit = transData.cartHits[i];
                obj.payByrCntIndex = transData.payByrCntIndex[i];
                obj.payRateIndex = (transData.payRateIndex[i] * 100).toFixed(2) + '%';
                obj.kdPrice = (transData.tradeIndex[i] == '超出范围' || !transData.payByrCntIndex[i]) ? '-' : (transData.tradeIndex[i] / transData.payByrCntIndex[i]).toFixed(2);
                obj.uvPrice = (transData.tradeIndex[i] == '超出范围' || !transData.uvIndex[i]) ? '-' : (transData.tradeIndex[i] / transData.uvIndex[i]).toFixed(2);
                obj.searchRate = transData.uvIndex[i] ? (transData.seIpvUvHits[i] / transData.uvIndex[i] * 100).toFixed(2) + '%' : '-';
                obj.cltRate = transData.uvIndex[i] ? (transData.cltHits[i] / transData.uvIndex[i] * 100).toFixed(2) + '%' : '-';
                obj.carRate = transData.uvIndex[i] ? (transData.cartHits[i] / transData.uvIndex[i] * 100).toFixed(2) + '%' : '-';
                obj.slrCnt = reductData[indexNames[i]].slrCnt.value;
                obj.paySlrCnt = reductData[indexNames[i]].paySlrCnt.value;
                obj.categroy = selectInfo.keyword[i];
                obj.shop.title = comItmeArr[i].name;
                obj.shop.url = '//img.alicdn.com/tps/'+ comItmeArr[i].picUrl;
                obj.shopId = comItmeArr[i].brandId;
                tableData.push(obj);
            }
            var cols = [{
                    data: 'categroy',
                    title: '类别'
                },
                {
                    data: 'shop',
                    title: '品牌信息',
                    class: 'info',
                    render: function (data, type, row, meta) {
                        return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                    }
                },
                {
                    data: 'shopId',
                    title: '品牌ID'
                },
                {
                    data: 'tradeIndex',
                    title: '交易金额'
                },
                {
                    data: 'uvIndex',
                    title: '访客人数'
                },
                {
                    data: 'seIpvUvHits',
                    title: '搜索人数'
                },
                {
                    data: 'cltHit',
                    title: '收藏人数'
                },
                {
                    data: 'cartHit',
                    title: '加购人数'
                },
                {
                    data: 'payByrCntIndex',
                    title: '支付人数'
                },
                {
                    data: 'payRateIndex',
                    title: '支付转化率'
                },
                {
                    data: 'kdPrice',
                    title: '客单价'
                },
                {
                    data: 'uvPrice',
                    title: 'uv价值'
                },
                {
                    data: 'searchRate',
                    title: '搜索占比'
                },
                {
                    data: 'cltRate',
                    title: '收藏率'
                },
                {
                    data: 'carRate',
                    title: '加购率'
                },
                {
                    data: 'paySlrCnt',
                    title: '有支付卖家数'
                },
                {
                    data: 'slrCnt',
                    title: '支付商品数'
                }
            ];
            domStruct({
                data: tableData,
                cols: cols
            }, '品牌关键词指标对比')
        })
}
function compareBrandTrend(){
     if (!isNewVersion()) {
         return false
     }
     var selectInfo = getCompareBrands();
     var tabsSelect = $('.oui-date-picker .ant-btn-primary').text();
     var localKey = getSearchParams('compBrandIndex', 1, 10, 'local', {
         userId: selectInfo.keys,
         type:'trend'
     })
     var localData = localStorage.getItem(localKey);
     if (!localData) {
         popTip('获取数据失败')
         return false;
     }
     var reductData = JSON.parse(filterLocalData(localData));
     var sendData = filterCompareShopAnaly(reductData, 3, 1, selectInfo.indexName)
     dealIndex({
         type: 'dealTrend',
         dataType: sendData
     }, function (val) {
         var transData = val.value;
         var tableData = [];
         var comItmeArr = selectInfo.resData;
         var indexNames = selectInfo.indexName;
         var singleLength = reductData[indexNames[0]].tradeIndex.length;
         var yearMonthDays = [];
         if (tabsSelect == '周') {
             yearMonthDays = weekMonthDate('', singleLength)
         } else if (tabsSelect == '月') {
             yearMonthDays = weekMonthDate('month', singleLength)
         } else {
             yearMonthDays = monthDays()
         }
         for (let i = 0; i < singleLength; i++) {
             for (let j = 0; j < indexNames.length; j++) {
                 var obj = {
                     shop: {}
                 };
                 var cot = i;
                 if (j > 0) {
                     cot = j * singleLength + i;
                 }
                 obj.date = yearMonthDays[i];
                 obj.tradeIndex = transData.tradeIndex[cot];
                 obj.uvIndex = transData.uvIndex[cot];
                 obj.seIpvUvHits = transData.seIpvUvHits[cot]? transData.seIpvUvHits[cot]:'-';
                 obj.cltHit = transData.cltHits[cot];
                 obj.cartHit = transData.cartHits[cot];
                 obj.payByrCntIndex = transData.payByrCntIndex[cot];
                 obj.payRateIndex = (transData.payRateIndex[cot] * 100).toFixed(2) + '%';
                 obj.kdPrice = (transData.tradeIndex[cot] == '超出范围' || !transData.payByrCntIndex[cot]) ? '-' : (transData.tradeIndex[cot] / transData.payByrCntIndex[cot]).toFixed(2);
                 obj.uvPrice = (transData.tradeIndex[cot] == '超出范围' || !transData.uvIndex[cot]) ? '-' : (transData.tradeIndex[cot] / transData.uvIndex[cot]).toFixed(2);
                 obj.searchRate = transData.uvIndex[cot] ? (transData.seIpvUvHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) +'%': '-';
                 obj.cltRate = transData.uvIndex[cot] ? (transData.cltHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
                 obj.carRate = transData.uvIndex[cot] ? (transData.cartHits[cot] / transData.uvIndex[cot] * 100).toFixed(2) + '%' : '-';
                 obj.slrCnt = reductData[indexNames[j]].slrCnt ? reductData[indexNames[j]].slrCnt[i]:'-';
                 obj.paySlrCnt = reductData[indexNames[j]].paySlrCnt ? reductData[indexNames[j]].paySlrCnt[i]:'-';
                 obj.categroy = selectInfo.keyword[j];
                 obj.shop.title = comItmeArr[j].name;
                 obj.shop.url = '//img.alicdn.com/tps/' + comItmeArr[j].picUrl;
                 obj.shopId = comItmeArr[j].brandId;
                tableData.push(obj);
             }
         }
         var cols = [{
                 data: 'date',
                 title: '日期'
             },
             {
                 data: 'categroy',
                 title: '类别'
             },
             {
                 data: 'shop',
                 title: '品牌信息',
                 class: 'info',
                 render: function (data, type, row, meta) {
                     return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                 }
             },
             {
                 data: 'shopId',
                 title: '品牌ID'
             },
             {
                 data: 'tradeIndex',
                 title: '交易金额'
             },
             {
                 data: 'uvIndex',
                 title: '访客人数'
             },
             {
                 data: 'seIpvUvHits',
                 title: '搜索人数'
             },
             {
                 data: 'cltHit',
                 title: '收藏人数'
             },
             {
                 data: 'cartHit',
                 title: '加购人数'
             },
             {
                 data: 'payByrCntIndex',
                 title: '支付人数'
             },
             {
                 data: 'payRateIndex',
                 title: '支付转化率'
             },
             {
                 data: 'kdPrice',
                 title: '客单价'
             },
             {
                 data: 'uvPrice',
                 title: 'uv价值'
             },
             {
                 data: 'searchRate',
                 title: '搜索占比'
             },
             {
                 data: 'cltRate',
                 title: '收藏率'
             },
             {
                 data: 'carRate',
                 title: '加购率'
             },
              {
                  data: 'paySlrCnt',
                  title: '有支付卖家数'
              }, {
                  data: 'slrCnt',
                  title: '支付商品数'
              }
         ];
         domStruct({
             data: tableData,
             cols: cols
         }, '品牌关键指标趋势图')
     })
}
function compBrandTop10(paramId, index, cateType) {
     if (!isNewVersion()) {
         return false
     }
     var curBrandId = '';
     index = index ? index:0;
     var selectInfo = getCompareBrands();
     var seleItems = selectInfo.resData;
     var chinaName = selectInfo.keyword;
     if(!paramId){
        var tabsHtml = '';
        curBrandId = seleItems[0].brandId;
        for (let i = 0; i < seleItems.length; i++) {
            var isActive = i==0? 'active':'';
            var hasShop = cateType?'shops':'';
            tabsHtml += '<button class="switchBtn ' + isActive + ' switchBrandTop ' + hasShop + '" data-id=' + seleItems[i].brandId + '>' + chinaName[i] + '</button>';
        }
        tabsHtml = '<div class="chaqz-top-tabs">' + tabsHtml + '</div>';
     }
     curBrandId = paramId ? paramId : curBrandId;
     var tabsId = cateType ? '#brandAnalysisShops' : '#brandAnalysisItems';
     var tabsSelect = $('.op-mc-brand-analysis ' + tabsId + ' .oui-tab-switch-item-active').index(); //热销流量选择
     var topType = tabsSelect?'flow':'trade';
     var isSinle = chinaName.length>1?0:1;
     var localKey = getSearchParams('compBrandTopItems', 1, 10, 'local', {
         brandId: curBrandId,
         topType: topType,
         categroy: cateType,
         isSingle: isSinle
     })
     var localData = localStorage.getItem(localKey);
     if (!localData) {
         popTip('获取数据失败')
         return false;
     }
     var reductData = JSON.parse(filterLocalData(localData));
     var sendData = {};
     if (tabsSelect) {
         sendData.uvIndex = filterSearchRank(reductData, 'uvIndex', 'value')
     } else {
         sendData.tradeIndex = filterSearchRank(reductData, 'tradeIndex', 'value')
     }
      dealIndex({
          type: 'dealTrend',
          dataType: sendData
      }, function (val) {
          var transData = tabsSelect ? val.value.uvIndex : val.value.tradeIndex;
          var tableData = [];
          var len = reductData.length;
          for (let i = 0; i < len; i++) {
              var obj = {
                  items: {},
                  brand:{}
              };
              obj.tradeIndex = transData[i];
              obj.brand.title = seleItems[index].name;
              obj.brand.url = '//img.alicdn.com/tps/'+ seleItems[index].picUrl;
              obj.brandId = seleItems[index].brandId;
              obj.blogShop = reductData[i].shop.title ? reductData[i].shop.title:'-';
              obj.blogShopId = reductData[i].shop.userId;
              if (cateType){
                 obj.items.title = reductData[i].shop.title;
                 obj.items.url = reductData[i].shop.pictureUrl;
                 obj.itemId = reductData[i].shop.userId;
              }else{
                 obj.items.title = reductData[i].item.title;
                 obj.items.url = reductData[i].item.pictUrl;
                 obj.itemId = reductData[i].item.userId;
              }
             
              tableData.push(obj);
          }
          var titleName = tabsSelect ? '访客人数' : '交易金额';
          var topName = tabsSelect ? '流量' : '热销';
          var shopItmeName = cateType?'店铺': '商品';
          var cols = [
              {
                  data: 'brand',
                  title: '品牌信息',
                  class: 'info',
                  render: function (data, type, row, meta) {
                      return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                  }
              }, 
              {
                  data: 'brandId',
                  title: '品牌ID'
              }, 
              {
                  data: 'items',
                  title: shopItmeName + '信息',
                  class: 'info',
                  render: function (data, type, row, meta) {
                      return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                  }
              }, 
              {
                  data: 'itemId',
                  title: shopItmeName +'ID'
              },
               {
                  data: 'blogShop',
                  title: '所属店铺'
              }, 
              {
                  data: 'blogShopId',
                  title: '所属店铺ID'
              },
              {
                  data: 'tradeIndex',
                  title: titleName
              },
          ];
          if (tabsHtml) {
              domStruct({
                  data: tableData,
                  cols: cols,
                  tabs: tabsHtml
              }, 'TOP商品榜-' + topName)
          } else {
              tableInstance.clear();
              tableInstance.rows.add(tableData).draw();
          }

      })
}
function brandCustomer(){
     if (!isNewVersion()) {
         return false
     }
     var tabSelectDom = $('.mc-brandCustomer #sycmMqBrandCunstomer .ant-radio-checked');//选择项
     var selIndex = tabSelectDom.find('.ant-radio-input').val();
     var selectInfo = getCompareBrands(1);
    //  var diffBrandId = selectInfo.selectIds;
    //  diffBrandId.length = 3;
    //  diffBrandId = diffBrandId.join(',');
     var localKey = getSearchParams('BrandCustonerTrend', 1, 10, 'local', {
         diffId: selectInfo.diffIds,
         indexCode: selIndex
     })
     var localData = localStorage.getItem(localKey);
     if (!localData) {
         popTip('获取数据失败')
         return false;
     }
     var reductData = JSON.parse(filterLocalData(localData));
     var sendData = filterBrandCustomer(reductData, selectInfo.selectIds);
     dealIndex({
         type: 'dealTrend',
         dataType: sendData
     }, function (val) {
         var transData = val.value;
         var tableData = [];
         var comItmeArr = selectInfo.resData;
         var indexNames = selectInfo.indexName;
         var month30Days = monthDays();
         for (let i = 0; i < 30; i++) {
             for (let j = 0; j < indexNames.length; j++) {
                 var obj = {
                     shop: {}
                 };
                 var cot = i;
                 if (j > 0) {
                     cot = j * 30 + i;
                 }
                 obj.date = month30Days[i];
                 obj.tradeIndex = transData.tradeIndex[cot];
                 obj.payByrCntIndex = transData.payByrCntIndex[cot];
                 obj.payRateIndex = (transData.payRateIndex[cot] * 100).toFixed(2) + '%';
                 obj.categroy = selectInfo.keyword[j];
                 obj.shop.title = comItmeArr[j].name;
                 obj.shop.url = '//img.alicdn.com/tps/' + comItmeArr[j].picUrl;
                 obj.shopId = comItmeArr[j].brandId;
                 tableData.push(obj);
             }
         }
         var cols = [{
                 data: 'date',
                 title: '日期'
             },
             {
                 data: 'categroy',
                 title: '类别'
             },
             {
                 data: 'shop',
                 title: '品牌信息',
                 class: 'info',
                 render: function (data, type, row, meta) {
                     return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                 }
             },
             {
                 data: 'shopId',
                 title: '品牌ID'
             },
             {
                 data: 'payByrCntIndex',
                 title: '支付人数'
             },
             {
                 data: 'tradeIndex',
                 title: '交易金额'
             },
             {
                 data: 'payRateIndex',
                 title: '支付转化率'
             },
         ];
         domStruct({
             data: tableData,
             cols: cols
         }, '客群趋势')
     })
}
function filterBrandCustomer(data,  filterArr) {//过滤品牌客群index
    var resIndex = {
        payByrCntIndex:[],
        payRateIndex:[],
        tradeIndex:[]
    };
    for (let i = 0; i < filterArr.length; i++) {
        var pKey = filterArr[i];
        var kindData = data[pKey];
        if (!kindData) {
            continue;
        }
        resIndex.payByrCntIndex = resIndex.payByrCntIndex.concat(data[pKey].payByrCntIndex);
        resIndex.payRateIndex = resIndex.payRateIndex.concat(data[pKey].payRateIndex);
        resIndex.tradeIndex = resIndex.tradeIndex.concat(data[pKey].tradeIndex);
    }
    return resIndex
}
// 品牌客群-all
function brandPersonAll() {
    if (!isNewVersion()) {
        return false
    }
    LoadingPop('show')
    var selectInfo = getCompareBrands(1);
    //  var diffBrandId = selectInfo.selectIds.slice(0);
    //  diffBrandId.length = 3;
    //  diffBrandId = diffBrandId.join(',');
    $('#completeShopPortrait .mc-Portrait .ant-radio-wrapper').eq(0).click();
    cycleFindPerson( {
        step: 0,
        res: {},
        diffBrandId: selectInfo.diffIds,
        selectInfo: selectInfo
    })
}
function cycleFindPerson( extra) {
    var typeItems = ['payByrCntIndex', 'payByrCntRate', 'tradeIndex', 'payRateIndex'];
    var curStep = extra.step;
    var keys = getSearchParams('brandPersonAll', 1, 10, 'local', {
        attrType: 'all',
        diffId: extra.diffBrandId,
        indexCode: typeItems[curStep]
    })
    var localItemData = localStorage.getItem(keys);
    if (localItemData) {
        var reductData = JSON.parse(filterLocalData(localItemData));
        if (curStep > 2) {
            extra.res[typeItems[curStep]] = reductData;
            brandPersonShow(extra.res, extra.selectInfo)
            console.log(extra.res);
        } else {
            var nextStep = curStep + 1;
            setTimeout(function () {
                extra.res[typeItems[curStep]] = reductData;
               $('#completeShopPortrait .mc-Portrait .ant-radio-wrapper').eq(nextStep).click();
                extra.step = nextStep;
                cycleFindPerson( extra)
            }, 300)

        }
    } else {
        setTimeout(function () {
            if (COUNT > 20) {
                popTip('获取数据失败！')
                LoadingPop()
                return false;
            } else {
                COUNT++
                cycleFindPerson( extra)
            }
        }, 350)
    }
}
function brandPersonShow(indexData, selectInfo) {
    var resBox = {
        payByrCntIndex:[],
        payByrCntRate: [],
        payRateIndex: [],
        tradeIndex: []
    }
    var seleItems = selectInfo.resData;
    var selecIds = selectInfo.selectIds;
    for (let i = 0; i < selecIds.length; i++) {
        resBox.payByrCntIndex.push(indexData.payByrCntIndex[selecIds[i]][0].value)
        resBox.payByrCntRate.push(indexData.payByrCntRate[selecIds[i]][0].value)
        resBox.payRateIndex.push(indexData.payRateIndex[selecIds[i]][0].value)
        resBox.tradeIndex.push(indexData.tradeIndex[selecIds[i]][0].value)
    }
    dealIndex({
        type: 'dealTrend',
        dataType: {
            payByrCntIndex: resBox.payByrCntIndex,
            payRateIndex: resBox.payRateIndex,
            tradeIndex: resBox.tradeIndex
        }
    }, function (val) {
        var transData = val.value;
        var tableData = [];
        var len = selecIds.length;
        for (let i = 0; i < len; i++) {
            var obj = {
                brand:{}
            };
            obj.brand.title = seleItems[i].name;
            obj.brand.url = '//img.alicdn.com/tps/' + seleItems[i].picUrl;
            obj.brandId = seleItems[i].brandId;
            obj.payByrCntIndex = transData.payByrCntIndex[i];
            obj.paybarRate = resBox.payByrCntRate[i];
            obj.tradeIndex = transData.tradeIndex[i];
            obj.payrate = transData.payRateIndex[i] ? (transData.payRateIndex[i] * 100).toFixed(2) + '%' : '';
            tableData.push(obj)
        }
        var cols = [{
                data: 'brand',
                title: '品牌信息',
                class: 'info',
                render: function (data, type, row, meta) {
                    return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                }
            },
            {
                data: 'brandId',
                title: '品牌ID',
            },
            {
                data: 'payByrCntIndex',
                title: '支付人数',
            },
            {
                data: 'paybarRate',
                title: '客群占比',
            },
            {
                data: 'tradeIndex',
                title: '交易金额',
            },
            {
                data: 'payrate',
                title: '支付转化率',
            }
        ]
        domStructMark({
            data: tableData,
            cols: cols,
            paging: {}
        }, '品牌客群-属性画像')
    })
}
function brandProvce(type, selectItem) { //属性分析-city-prov
    if (!isNewVersion()) {
        return false
    }
    selectItem = selectItem ? selectItem:0;
    var tabSelect = $('#completeShopPortrait .mc-Portrait .ant-radio-wrapper-checked').index();
    // 品牌选择信息
    var selectInfo = getCompareBrands(1);
    var seleItems = selectInfo.resData;
    var sleList = selectInfo.selectIds;
    var chinaName = selectInfo.keyword;
    var tabsHtml = '';
    for (let i = 0; i < seleItems.length; i++) {
        var isActive = i == 0 ? 'active' : '';
        tabsHtml += '<button class="switchBtn ' + isActive + ' switchBrandCity" data-id=' + seleItems[i].brandId + '>' + chinaName[i] + '</button>';
    }
    tabsHtml = '<div class="chaqz-top-tabs">' + tabsHtml + '</div>';
    COMP_ITEM_INFO = {
        type: type
    }
    var typeItems = ['payByrCntIndex', 'payByrCntRate', 'tradeIndex', 'payRateIndex'];
    var curAttrType = typeItems[tabSelect];
    // var diffBrandId = selectInfo.selectIds.slice(0);
    // diffBrandId.length = 3;
    // diffBrandId = diffBrandId.join(',');
    var localKey = getSearchParams('brandPersonAll', 1, 10, 'local', {
        attrType: type,
        diffId: selectInfo.diffIds,
        indexCode: curAttrType
    })
    var localData = localStorage.getItem(localKey);
    if (!localData) {
        popTip('数据获取失败！')
        return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    var choseBrandId = selectItem ? sleList[selectItem] : sleList[0];
    var filteDa = reduceData[choseBrandId] ? reduceData[choseBrandId] : [];
    if (curAttrType != 'payByrCntRate') {
        var sendArr = filterSearchRank(filteDa, 'value');
        var sendData = {};
        sendData[curAttrType] = sendArr
        dealIndex({
            type: 'dealTrend',
            dataType: sendData
        }, function (val) {
            brandProvceShow({
                type:type,
                word: seleItems[selectItem].name,
                tabs: tabsHtml,
                selType: curAttrType,
                oldData: filteDa,
                data: val.value[curAttrType]
            })
        })
    } else {
        brandProvceShow({
            type: type,
            word: seleItems[selectItem].name,
            tabs: tabsHtml,
            selType: curAttrType,
            oldData: filteDa
        })
    }
}

function brandProvceShow(oriData) {
    var tableData = [];
    var transInfo = oriData.oldData;
    var isTrans = oriData.data?true:false;
    var transData = oriData.data ? oriData.data:[];
    var curType = oriData.selType;
    var len = transInfo.length;
    for (let i = 0; i < len; i++) {
        var obj = {};
        obj.rank = i + 1;
        obj.type = transInfo[i].name;
        if (isTrans){
             obj.count = curType == 'payRateIndex' ? (transData[i]*100).toFixed(2)+'%' : transData[i];
        }else{
            obj.count = transInfo[i].value;
        }
        // obj.count = isTrans ? transData[i] : transData[i].value ? (oriData[i].value * 100).toFixed(2) + '%' : '-';
        tableData.push(obj)
    }
    var whre = oriData.type == 'prov' ? '省份' : "城市";
    var numWord = {
        payByrCntIndex: '支付人数',
        payByrCntRate: '客群占比',
        tradeIndex: '交易金额',
        payRateIndex: '支付转化率',
    }
    var cols = [{
            data: 'rank',
            title: '排名'
        },
        {
            data: 'type',
            title: whre
        },
        {
            data: 'count',
            title: numWord[curType]
        },
    ];
    if ($('.chaqz-wrapper').length) {
        tableInstance.clear();
        tableInstance.rows.add(tableData).draw();
        $('.chaqz-wrapper .chaqz-table-title').text('品牌：' + oriData.word);
    } else {
        domStruct({
            data: tableData,
            cols: cols,
            paging: {

            },
            tabs: oriData.tabs
        }, '品牌:' + oriData.word)
    }
}

// request funs
function getHttpRquest(finalUrl, cb,type) {
    var sessionKey = sessionStorage.getItem('transitId');
    $.ajax({
        url: finalUrl,
        type: 'GET',
        headers: {
            "transit-id": sessionKey
        },
        error: function () {
            popTip('获取数据失败请重试！')
            textLoading();
        },
        success: function (res) {
            if(!res.data){
                type == 3 ? popTip('添加监控失败') : type == 1 ?popUp.init('addMointored'): popTip('获取数据失败请重试！');
                textLoading();
                return false;
            }
            cb && cb(res)
        }
    })
}
// request funs
function getBackgroundRquest(idNum, cb) {
   var saveToke = localStorage.getItem('chaqz_token')
   chrome.runtime.sendMessage({
       key: 'getData',
       options: {
           url: BASE_URL + '/py/api/v1/item?id=' + idNum,
           type: "GET",
           headers: {
               Authorization: "Bearer " + saveToke
           }
       }
   }, function (val) {
       if (val.code == 200) {
            cb && cb(val)
       } else if (val.code == 2030) {
           popTip('登录过期')
           LogOut();
           textLoading();
       } else {
        popTip('检验宝贝信息失败')
        textLoading();
       }
   })
}
// request title match rate
function titleMatchRateRquest(titleInfo, cb) {
   var saveToke = localStorage.getItem('chaqz_token')
   chrome.runtime.sendMessage({
       key: 'getData',
       options: {
           url: BASE_URL + '/py/api/v1/chat',
           type: "POST",
           contentType: "application/json",
        //    headers: {
        //        Authorization: "Bearer " + saveToke
        //    },
            data: JSON.stringify(titleInfo)
       }
   }, function (val) {
       if (val.code == 200) {
            cb && cb(val)
       } else if (val.code == 2030) {
           LogOut();
           textLoading();
       } else {
        popTip('标题匹配失败')
        textLoading();
       }
   })
}
// request 分词接口
function manyWordRquest(titleInfo, cb) {
   var saveToke = localStorage.getItem('chaqz_token')
   chrome.runtime.sendMessage({
       key: 'getData',
       options: {
           url: BASE_URL + '/api/v1/plugin/chat',
           type: "POST",
           contentType: "application/json",
           headers: {
               Authorization: "Bearer " + saveToke
           },
            data: JSON.stringify(titleInfo)
       }
   }, function (val) {
       if (val.code == 200) {
            cb && cb(val)
       } else if (val.code == 2030) {
           LogOut();
           textLoading();
       } else {
        popTip('获取分词失败')
        textLoading();
       }
   })
}
// 累加
function cumulative(arr){
    var len = arr.length;
    var res = 0;
    for (let i = 0; i < len; i++) {
        res += arr[i]
    }
    return res;
}
// 意向商品满足条件过滤排序
function hotPurposSort(data,selfTitle) {
    if (!data) {
        return []
    }
    var arr = data;
    var len = arr.length;
    var selfIndex = null;
    var res = [];
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j].item.title == selfTitle){
                selfIndex = j;
            }
            if (arr[j].tradeIndex.value < arr[j + 1].tradeIndex.value) {
                var temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                if (arr[j+1].item.title == selfTitle){
                     selfIndex = j+1;
                }
            }
        }
    }
    if(selfIndex&&selfIndex>100){
        res = arr.slice(0,100);
    }
    res = selfIndex ? selfIndex > 100 ? arr.slice(0, 100) : arr.slice(selfIndex) : arr.slice(0, 100);
    var titleLen = res.length;
    var nameList = [];
    for (let k = 0; k < titleLen; k++) {
        const element = res[k];
        nameList.push(element.item.title)
    }
    return {
        oriData: res,
        nameList
    };
}
// 计算预估价格
function forecastRage(val){
    var res = 0;
    if (0 < val <= 100){
        res = 10
    } else if (100 < val <= 200) {
        res = 11
    } else if (200 < val <= 300) {
        res = 12
    } else if (300 < val <= 400) {
        res = 13
    } else if (400 < val <= 500) {
        res = 14
    } else if (500 < val <= 600) {
        res = 15
    } else if (600 < val <= 800) {
        res = 17
    } else if (800 < val <= 1000) {
        res = 19
    } else if (1000 < val <= 1200) {
        res = 21
    } else if (1200 < val <= 1500) {
        res = 24
    } else if (1500 < val <= 2000) {
        res = 27
    } else if (2000 < val <= 2500) {
        res = 30
    } else if (2500 < val <= 3000) {
        res = 33
    } else if (3000 < val <= 3500) {
        res = 36
    } else if (3500 < val <= 4000) {
         res = 38
    } else if (4000 < val <= 5000) {
         res = 44
    } else if (5000 < val <= 6000) {
        res = 49
    } else if (6000 < val <= 7000) {
        res = 55
    } else if (7000 < val <= 8000) {
        res = 60
    } else if (8000 < val <= 9000) {
        res = 66
    } else if (9000 < val <= 10000) {
        res = 72
    } else {
        res=undefined;
    }
    return res;
}
// 推荐竞品推荐信息合拼
function mergeRecomItems(oriData,fliterData){
    var len = oriData.length;
    // var secLen = fliterData.length;
    var res = [];
    for (let i = 0; i < len; i++) {
        const element = oriData[i];
        for (let j = 0; j < len; j++) {
           var obj = {};
           if (element.itemId == fliterData[j].itemId.value){
               obj.name = fliterData[j].item.title
               obj.pic = fliterData[j].item.pictUrl
               obj.paybr = oriData[j].paybr
               obj.payRate = oriData[j].payRate
               obj.forecastPrice = oriData[j].forecastPrice
               obj.itemId = element.itemId
               obj.price = element.price
               obj.url = fliterData[j].item.detailUrl
               res.push(obj)
           }
        }
    }
    return res;
}
// loading
function textLoading(text, statu) {
    if (!statu) {
        $('#caseBlanche').remove();
    } else {
        var deText = text ? text : '获取数据中，请稍等…';
        var hasSave = $('#caseBlanche').length;
        if (hasSave) {
            $('#caseBlanche .text').text(text);
        } else {
            $('body').append('<div id="caseBlanche"><div id="load"><p id="rond"></p><p class="text">' + deText + '</p></div></div>');
        }
    }
}
// 获取高相似度前五info
function findHeightRatio(titles,data){
    var len = titles.length;
    var dataLen = data.length;
    var res = []
    for (let i = 0; i < len; i++) {
        const element = titles[i].title;
        for (let j = 0; j < dataLen; j++) {
            if (element == data[j].item.title) {
                res.push(data[j])
            }
        }
    }
    return res
}

//竞争-分析竞品一键加权
$(document).on('click', '#vesting', function () {
    if (!isNewVersion()) {
        return false
    }
    var selectInfo = getCompareItems('title');
    if (selectInfo.keyword.enkey[0] != 'selfItem'){
        popTip('请选择本店商品')
        return false;
    } else if (selectInfo.keyword.enkey.length==3){
        popTip('竞品仅可以选择一项')
        return false;
    }
    COMP_ITEM_INFO = {}
    COUNT = 0;
    COMP_ITEM_INFO.itemInfo = selectInfo
    popUp.init('wantPromptTitle')
})
$(document).on('click', '.chaqz-info-wrapper.pop .jugdeItem',function(){
    $('.chaqz-info-wrapper.pop').hide();
    textLoading('宝贝、竞品分析中，请耐心等待', 1)
    var itemInfo = COMP_ITEM_INFO.itemInfo;
    var itemList = itemInfo.resData;
    var itemKeys = itemInfo.keyword.name;
    var selfItem = itemList[itemKeys[0]];
    var titltInfo = itemInfo.titleList;
    COMP_ITEM_INFO.selfTitle = titltInfo[0];
    getBackgroundRquest(selfItem.itemId,function(selfRes){//获取本身宝贝的信息以及数据
        var selfCateId = selfRes.data.categoryId;
        var selfPrice = selfRes.data.max_price;
        var nowTime = getCurrentTime('moreDay');
        var dateRange = setDateRange(nowTime, 'recent7');
        var dayRange = setDateRange(nowTime, 'day');
        COMP_ITEM_INFO.day = dayRange;
        var localCateId = getFirstCateId();
        COMP_ITEM_INFO.recent7 = dateRange;
        COMP_ITEM_INFO.localCateId = localCateId;
        var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreTrend.json?dateType=recent7&dateRange=" + dateRange + "&device=0&cateId=" + localCateId + "&selfItemId=" + selfItem.itemId;
        getHttpRquest(finalUrl,function(comPRes){
            var selfCoreTrendData = JSON.parse(Decrypt(comPRes.data)).selfItem;
            COMP_ITEM_INFO.selfItemInfo = {
                itemId: selfItem.itemId,
                price: selfPrice,
                indexData: selfCoreTrendData
            }
             var chooseLast7Self = selfCoreTrendData.tradeIndex.slice(-7); //近7天交易指数
             var selfTransData = dealIndex({
                 type: 'driectIndex',
                 sendData: {
                     tradeIndex: chooseLast7Self
                 }
             },function(){})
             var selfTotalTrade = cumulative(selfTransData.tradeIndex);
             console.log('宝贝的信息指数', selfTotalTrade)
            // 是否选择竞品
            if (itemKeys.length < 2) {
                console.log('未选择竞品，去获取推荐')
                // 没有选择
                HighIntention({
                    dateRange,
                    categoryId: selfCateId
                }, {
                    title: titltInfo[0],
                    tradeTotal: selfTotalTrade
                })
                return false
            }
            var compItem = itemList[itemKeys[1]];
            if (!compItem){
                popTip('获取竞品信息失败');
                textLoading();
                return false
            }
            console.log('竞品选择')
            getBackgroundRquest(compItem.itemId, function (selfRes2) { //获取竞品的信息以及数据
                var comPCateId = selfRes2.data.categoryId;
                var comPPrice = selfRes2.data.max_price;
                // 判断宝贝与竞品类目是否一致
                if (selfCateId != comPCateId){
                    console.log('宝贝竞品类目不一致')
                    HighIntention({
                        dateRange,
                        categoryId: selfCateId
                    }, {
                        title: titltInfo[0],
                        tradeTotal: selfTotalTrade
                    })
                    return false;
                }
                var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreTrend.json?dateType=recent7&dateRange=" + dateRange + "&device=0&cateId=" + localCateId + "&rivalItem1Id=" + compItem.itemId;
                getHttpRquest(finalUrl, function (comPRes2) {
                    var comPCoreTrendData = JSON.parse(Decrypt(comPRes2.data)).rivalItem1;
                    // var chooseLast7Self = selfCoreTrendData.tradeIndex.slice(-7);
                    var chooseLast7Comp = comPCoreTrendData.tradeIndex.slice(-7);
                    var compTransData = dealIndex({
                        type: 'driectIndex',
                        sendData: {
                            tradeIndex: chooseLast7Comp
                        }
                    },
                    function () {})
                    var compTotalTrade = cumulative(compTransData.tradeIndex);
                    // 判断交易额竞品宝贝比较
                    console.log('竞品的信息指数', compTotalTrade)
                    if (selfTotalTrade > compTotalTrade) {
                        console.log('指数比较失败')
                         // 进入搜索
                         HighIntention({
                             dateRange,
                             categoryId: selfCateId
                         }, {
                             title: titltInfo[0],
                             tradeTotal: selfTotalTrade
                         })
                        return false;
                    }
                    titleMatchRateRquest({
                                "title1": titltInfo[0],
                                "title2": [titltInfo[1]],
                                "type": 2
                            }, function (rateRes) {
                        if (rateRes.data[0].data.ratio < 0.3) {//判断自身宝贝与竞品标题相似度大于0.4，true则去获取主刷词，false去推荐
                            console.log('宝贝竞品相似度小于0.4')
                            // 进入搜索
                            HighIntention({
                                dateRange,
                                categoryId: selfCateId
                            }, {
                                title: titltInfo[0],
                                tradeTotal: selfTotalTrade
                            })
                        } else {
                            console.log('宝贝竞品相似度大雨0.4')
                             COMP_ITEM_INFO.compItemInfo = {
                                 itemId: compItem.itemId,
                                 price: comPPrice,
                                 indexData: comPCoreTrendData
                             }
                            gotoFindMainWord(compItem.itemId)
                        }
                    })
                })
            })
        })
    })
})
// 市场意向获取意商品
function HighIntention(categroy, selfInfo) {
    var hotPurposUrl = 'https://sycm.taobao.com/mc/mq/mkt/rank/item/hotpurpose.json?dateRange=' + categroy.dateRange + '&dateType=recent7&pageSize=10&page=1&order=desc&orderBy=cartHits&cateId=' + categroy.categoryId + '&device=0&sellerType=-1&indexCode=cltHits%2CcartHits%2CtradeIndex';
     getHttpRquest(hotPurposUrl, function (res) {//获取意向商品
         var hotpurData = JSON.parse(Decrypt(res.data));
         var hotList = hotPurposSort(hotpurData, selfInfo.title);//满足条件商品
         console.log('满足条件去标题匹配的推荐商品',hotList)
         titleMatchRateRquest({//商品与宝贝标题相似度匹配
                     "title1": selfInfo.title,
                     "title2": hotList.nameList,
                     "type": 2
                 }, function (rateRes) {
            var ratioList = rateRes.data;
            var resLength = hotList.nameList.length
            var eachSize = resLength>5?Math.floor(resLength / 5):0;
            var len = resLength > 5 ? 5 : 1;
            var selectItem = [];
            for (let i = 0; i < len; i++) {
                var starSize = i*eachSize;
                var endSize = (i > 3 || len == 1) ? resLength : (starSize + eachSize);
                for (let j = starSize; j < endSize; j++) {
                    if(ratioList[j].data.ratio>0.3){
                        selectItem.push(j);
                        break;
                    }
                }
            }
            console.log('相似度为0.3的高意向商品', selectItem)
            var selectLen = selectItem.length;
            var finalList = [];
            if (selectLen){
                for (let k = 0; k < selectLen; k++) {
                    var ele = hotList.oriData[selectItem[k]];
                    var trans = dealIndex({
                        type: 'driectIndex',
                        sendData: {
                            tradeIndex: [ele.tradeIndex.value]
                        }
                    },function () {})
                    if (trans.tradeIndex[0] > selfInfo.tradeTotal) {
                        finalList.push(ele)
                    }
                }
            }else{
                // 未找到满足条件商品取相似度最高五项
                var ratioSortList = babelSort(ratioList, 'data', 'ratio');
                finalList = findHeightRatio(ratioSortList.slice(0, 5), hotList.oriData) ;
            }
            console.log('交易额大于竞品的高意向商品', finalList)
            getSelectShowData(finalList, categroy)
         })
     })
}
// 展示推荐竞品
function getSelectShowData(finalList, categroy) {
    // 获取选取推荐商品的价格以及交易指数
    var len = finalList.length;
    COUNT = 0;
    var hotpurInfo = [];
     var dayRange = COMP_ITEM_INFO.day;
    for (let i = 0; i < len; i++) {
        let itemId = finalList[i].itemId.value;
        console.log('循环获取推荐商品信息',i,itemId)
       setTimeout(function(){//请求间隔300
            var hotPurTrendUrl = 'https://sycm.taobao.com/mc/ci/item/trend.json?dateType=day&dateRange=' + dayRange + '&cateId=' + categroy.categoryId + '&itemId=' + itemId + '&device=0&sellerType=-1&indexCode=uvIndex%2CpayRateIndex%2CtradeIndex%2CpayByrCntIndex';
            getHttpRquest(hotPurTrendUrl, function (res) {
                var hotPoseData = JSON.parse(Decrypt(res.data));
                var hotTransData = dealIndex({
                        type: 'driectIndex',
                        sendData: {
                            payByrCntIndex: hotPoseData.payByrCntIndex.slice(-7),
                            payRateIndex: hotPoseData.payRateIndex.slice(-7)
                        }
                    },
                    function () {})
                var hotTotalpaybr = cumulative(hotTransData.payByrCntIndex);
                var hotTotalpayRate = cumulative(hotTransData.payRateIndex);
                getBackgroundRquest(itemId, function (selfRes2) {
                    var hotpurPrice = selfRes2.data.min_price;
                    COUNT++;
                    var itemInfo = {};
                    itemInfo.itemId = itemId;
                    itemInfo.paybr = Math.floor(hotTotalpaybr / 7);
                    itemInfo.payRate = hotTotalpayRate ? (hotTotalpayRate / 7 * 100).toFixed(2)+'%' : '-';
                    itemInfo.forecastPrice = Math.floor(hotTotalpaybr / 7 * forecastRage(hotpurPrice));
                    itemInfo.price = hotpurPrice;
                    hotpurInfo.push(itemInfo)
                    if (COUNT > len - 1) {
                        showSelectList(hotpurInfo, finalList)
                        return false;
                    }
                })
            })
       },i*300)
    }

}
// 展示推荐宝贝信息弹窗
function showSelectList(hotpurInfo, finalList) {
    console.log('hebing ', hotpurInfo, finalList)
    var showList = mergeRecomItems(hotpurInfo, finalList);
    console.log('mergeEnding', showList)
     var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">已为你推荐以下优秀同类竞品，请选择</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div><div class="recommed-btns"><button class="canceRecommond">取消</button><button class="sureRecommond">确定</button></div></div><span class="chaqz-close">×</span></div></div>'
     $('#app').append(wrapper);
     var tableData = [];
     for (let i = 0; i < showList.length; i++) {
         const element = showList[i];
         var obj = {};
         obj.boby = {
             url: element.pic,
             title: element.name,
             href: element.url
         }
         obj.paybr = element.paybr;
         obj.payRate = element.payRate;
         obj.forCase = element.forecastPrice;
         obj.operator = element.itemId + '/' + element.price ;
         tableData.push(obj)
     }
      var cols = [
          {
              data: 'boby',
              title: '宝贝',
              class: 'info',
              render: function (data, type, row, meta) {
                  return '<img src="' + data.url + '"><a href="' + data.href+ '" target="_blank">' + data.title + '</a>';
              }
          },
          {
              data: 'paybr',
              title: '支付人数'
          },
          {
              data: 'payRate',
              title: '支付转化率'
          },
          {
              data: 'forCase',
              title: '预估每天成本'
          },
          {
              data: 'operator',
              title: '操作',
            render: function (data, type, row, meta) {
                return '<label for="'+data+'" class="propt-chose"></label><input type="checkbox" id="'+data+'" class="recommendItem" value="' + data+ '" hidden>';
            }
          },
      ];
      $('#chaqz-table').DataTable({
          data: tableData,
          columns: cols,
          language: {
              "paginate": {
                  "next": "&gt;",
                  "previous": "&lt;"
              },
              "sEmptyTable": '数据为空...'
          },
          searching: false,
          ordering: false,
          info: false,
          "paging": false,
      });
      textLoading()
    //   推荐取消
      $('.chaqz-wrapper').on('click', '.canceRecommond',function(){
          $('.chaqz-wrapper').remove();
      })
    //   推荐确定
      $('.chaqz-wrapper').on('click', '.sureRecommond', function () {
        var inptVal =  $('.chaqz-wrapper input:checked').val();
        console.log(inptVal);
        if(!inptVal){
            popTip('请选择一项商品')
            return false;
        }
        var idPrice = inptVal.split('/')
        COMP_ITEM_INFO.compId = idPrice[0];
        COMP_ITEM_INFO.compPrice = idPrice[1];
        console.log('选择推荐项信息',idPrice)
        textLoading('获取数据中，请稍等', 1);
        gotoFindMainWord(idPrice[0]);
      })
}
// 添加监控
$(document).on('click', '.addMointored',function(){
    var firstCateId = COMP_ITEM_INFO.localCateId;
    var itemId = COMP_ITEM_INFO.compId;
    var addMointorUrl = 'https://sycm.taobao.com/mc/ci/config/rival/item/addToMonitored.json?itemId=' + itemId + '&rivalType=item&firstCateId=' + firstCateId;
    getHttpRquest(addMointorUrl,function(res){
        $('.chaqz-info-wrapper.pop').hide();
        textLoading('获取数据中，请稍等', 1);
        gotoFindMainWord(itemId);
    },3)
})
// 竞品推荐项选择
$(document).on('click', '.propt-chose', function () {
    if ($(this).hasClass('active')){return false;}
    $(this).addClass('active').parent().parent().siblings().find('label').removeClass('active');
    $(this).parent().parent().siblings().find('input').prop("checked", false);
})
// 获取竞品关键词数据
function gotoFindMainWord(itmeId) { 
    var selfTitle = COMP_ITEM_INFO.selfTitle;
    var dayRange = COMP_ITEM_INFO.day;
    var localCateId = COMP_ITEM_INFO.localCateId;
    COMP_ITEM_INFO.chooseId = itmeId;//保存竞品id
    var endType = '&topType=trade&indexCode=tradeIndex';
    var hotPurTrendUrl = 'https://sycm.taobao.com/mc/rivalItem/analysis/getKeywords.json?dateRange=' + dayRange + '&dateType=day&pageSize=20&page=1&device=2&sellerType=0&cateId=' + localCateId + '&itemId=' + itmeId + endType;
    getHttpRquest(hotPurTrendUrl,function(res){//竞品成交关键词获取
        $('.chaqz-wrapper').remove();
        var keyWords = JSON.parse(Decrypt(res.data));
        console.log('竞品成交关键词列表', keyWords);
        var endType2 ='&topType=flow&indexCode=uv' ;
        var hotPurTrendUrl2= 'https://sycm.taobao.com/mc/rivalItem/analysis/getKeywords.json?dateRange=' + dayRange + '&dateType=day&pageSize=20&page=1&device=2&sellerType=0&cateId=' + localCateId + '&itemId=' + itmeId + endType2;
        getHttpRquest(hotPurTrendUrl2, function (uvRes) { //竞品成交关键词获取
            var uvkeyWords = JSON.parse(Decrypt(uvRes.data));
            console.log('竞品引流关键词列表', uvkeyWords);
            var filterKeyList = keyWords.concat(uvkeyWords);
            var filterKeyWords = filterSearchRank(filterKeyList, 'keyword', 'value');
            filterKeyWords = removeDuplicates(filterKeyWords);
            console.log('符合条件的成交词', filterKeyWords)
            titleMatchRateRquest({ //竞品关键词与宝贝标题匹配
                    title1: selfTitle,
                    title2: filterKeyWords,
                    type: 2
                }, function (matRes) {//过滤标题匹配度为1的关键词
                    var suitKeyWords = matRes.data;
                    var mayKeyword = suitKeyWords.filter(function (item) {
                        return item.data.ratio == 1
                    });
                    if(mayKeyword.length){
                         console.log('待确定主刷词', mayKeyword)
                    marketSearchMainWord(mayKeyword);
                    return false
                    }
                    // 关键词为空，分词宝贝标题
                    titleMatchRateRquest({
                        title1: '',
                        title2: [selfTitle],
                        type: 2
                    }, function (cutRes) {
                        var cutWords = cutRes.data[0];
                        console.log('分词结果', cutWords)
                        //  var cutLeng = cutWords.data.chart;
                        var cutWordList = [];
                        cutWords.data.chat.map(function (item) {
                            cutWordList.push({
                                title: item.chat
                            })
                        })
                        marketSearchMainWord(cutWordList,'boby')
                    })
                    // COMP_ITEM_INFO.takeWordType = 3
            })
        })
    },1)
}
// 市场搜索进行关键词验证，是否符合
function marketSearchMainWord(mayKeywords) {
     var selfTitle = COMP_ITEM_INFO.selfTitle;
     var dateRange = COMP_ITEM_INFO.recent7;
     var totalNum = mayKeywords.length;
     var checkInfo = {
         mayKeywords,
         step:0,
         resData:[],
         saveTop:[],
         selfTitle, dateRange, totalNum
     }
     cycleFindMainWord(checkInfo)
}
function cycleFindMainWord(checkInfo,isSelf) {
    var curStep = checkInfo.step;
    var curKeyword = checkInfo.mayKeywords[curStep];
    console.log('循环市场搜索', curStep, curKeyword)
     var searchUrl = 'https://sycm.taobao.com/mc/searchword/relatedWord.json?dateRange=' + checkInfo.dateRange + '&dateType=recent7&pageSize=10&page=1&order=desc&orderBy=seIpvUvHits&keyword=' + curKeyword.title + '&device=0&indexCode=seIpvUvHits%2CsePvIndex%2CclickRate%2CclickHits%2CclickHot';
     getHttpRquest(searchUrl,function(res){// 市场搜索相关分析结果
         var searchData = JSON.parse(Decrypt(res.data));
         var searLeng = searchData.length > 100 ? 100 : searchData.length;
         var filterArr = [];
         for (let i = 0; i < searLeng; i++) {
             const element = searchData[i];
             filterArr.push(element.keyword)
         }
        manyWordRquest({
            "title1": curKeyword.title,
            "title2": filterArr,
            "type": 3
        }, function (cutRes) {
            console.log('搜索分析传参', curKeyword.title, filterArr, cutRes)
            var cutResult = cutRes.data;
            var shortNum = cutResult.short.data;
            var middleNum = cutResult.medium.data;
            var longNum = cutResult.long.data;
            if (shortNum.length > 0 && middleNum.length > 1 && longNum.length > 0){
                var saveShotList = [shortNum[0].title]
                var saveMidList = [middleNum[0].title, middleNum[0].title]
                var saveLongList = [longNum[0].title];
                var pushData = {
                    title: curKeyword.title,
                    sdWord: {
                        short: saveShotList,
                        middle: saveMidList,
                        long: saveLongList,
                    }
                }
                checkInfo.resData.push(pushData);
                var firstItem = searchData[0];
                firstItem.curKeyword = pushData;
                checkInfo.saveTop.push(searchData[0])
            }
            var nextStep = curStep+1;
            checkInfo.step = nextStep;
            var hasSaveWords = checkInfo.resData;
            
            // 判断选取主刷词数量以及是否循环完毕
            if ((hasSaveWords.length > 4 && !isSelf) || nextStep > checkInfo.totalNum - 1) {
                console.log('获取主刷词', hasSaveWords)
                var hasSaveTop = isSelf ? checkInfo.saveTop:'';
                console.log('自身宝贝分词结果', hasSaveWords, hasSaveTop)
                getMainWordsResult(hasSaveWords, hasSaveTop)
            } else {
                 cycleFindMainWord(checkInfo)
            }
        })
     }) 
}
// 获得主刷词结果
function getMainWordsResult(wordList,isBoby){
    if(!wordList.length){
        popTip('未匹配到主刷词')
        return false;
    }
    // 宝贝分词获取的结果
    if(isBoby){
        var bobyFilter = getfinalWords(isBoby);
         console.log('进入最后阶段了self', bobyFilter)
    }
    console.log('进入最后阶段了', wordList)
    if(COMP_ITEM_INFO.compItemInfo){
        indexFilter({
             itemId: COMP_ITEM_INFO.selfItemInfo.itemId,
            price: COMP_ITEM_INFO.selfItemInfo.price,
            indexData: COMP_ITEM_INFO.selfItemInfo.indexData
        } ,{
             itemId: COMP_ITEM_INFO.compItemInfo.itemId,
            price: COMP_ITEM_INFO.compItemInfo.price,
            indexData: COMP_ITEM_INFO.compItemInfo.indexData
        }, wordList)
    }else{
        var dateRange = COMP_ITEM_INFO.recent7;
        var localCateId = COMP_ITEM_INFO.localCateId;
         var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreTrend.json?dateType=recent7&dateRange=" + dateRange + "&device=0&cateId=" + localCateId + "&rivalItem1Id=" + COMP_ITEM_INFO.compId;
         getHttpRquest(finalUrl, function (comPRes) {
             var comPCoreTrendData = JSON.parse(Decrypt(comPRes.data)).rivalItem1;
             indexFilter({
                  itemId: COMP_ITEM_INFO.selfItemInfo.itemId,
                 price: COMP_ITEM_INFO.selfItemInfo.price,
                 indexData: COMP_ITEM_INFO.selfItemInfo.indexData
             }, {
                  itemId: COMP_ITEM_INFO.compId,
                 price: COMP_ITEM_INFO.compPrice,
                 indexData: comPCoreTrendData
             }, wordList)
         })
    }
}
// 宝贝分词最终结果
function getfinalWords(data){
    var sortRes = babelSort(data, 'seIpvUvHits');
    var filterList = sortRes.slice(0,5);
    var len = filterList.length;
    var res = [];
    for (let i = 0; i < len; i++) {
        const element = filterList[i];
        res.push(element.curKeyword)
    }
    return res
}
// 截取近七天指数数据
function cutOffIndex(data){
    var res = {};
    for(var key in data){
        res[key] = data[key].slice(-7);
    }
    return res
}
// 计算近七天平均数据
function cutOffAvg(data){
    var res = {};
    res.payRateIndex = data.payRateIndex.slice(-7);
    res.cltHits = data.cltHits.slice(-7);
    res.cltHits = data.cltHits.slice(-7);
    res.tradeIndex = data.tradeIndex.slice(-7);
    res.uvIndex = data.uvIndex.slice(-7);
    var filterList = ['payRateIndex', 'cltHits', 'cartHits', 'tradeIndex', 'uvIndex']
    for(let key in data){
        var avg = 0;
        if(filterList.indexOf(key)==-1){continue;}
        for (let i = 0; i < data[key].length; i++) {
            avg += data[key][i]
        }
        res[key] = avg/7
    }
    return res
}
function indexFilter(selfInfo, compInfo, wordList) {
    var selfIndex = cutOffIndex(selfInfo.indexData);
    var compIndex = cutOffIndex(compInfo.indexData);
     var selfTrans = dealIndex({
         type: 'driectIndex',
         sendData: selfIndex
     }, function () {})
     var itemTrans = dealIndex({
         type: 'driectIndex',
         sendData: compIndex
     }, function () {})
      var selfAvg = cutOffAvg(selfTrans);
      var itemAvg = cutOffAvg(itemTrans);
      var postData = {
          selfItem:{
            itemId: selfInfo.itemId,
            // price: selfInfo.price,
            index: selfAvg
          },
          item:{
               itemId: compInfo.itemId,
            price: compInfo.price,
            index: itemAvg
          },
          mainWords: wordList
      }
      console.log('传输数据',postData)
     chrome.storage.local.set({
         'AutomaticWeightedData': postData
     }, function () {
         window.open(BASE_URL + '/privilgeEscala')
          textLoading()
     })
}