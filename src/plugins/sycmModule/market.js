import {
    dealIndex
} from '../../common/dealIndex'
import {
    formula,
    computedPayByr,
    getSearchParams,
    getCurrentTime,
    getFirstCateId,
    getDateRange,
    filterLocalData,
    formate,
    findcategory,
    trendInfoJoin,
    trendKeyJoin,
    weekMonthDate,
    monthDays,
    formulaRate
} from '../../common/commonFuns';
import {
    LoadingPop,
    isNewVersion,
    popTip
} from '../../common/promptClass'
var tableInstance = null; //table实例对象
var echartsInstance = null; //echarts实例对象
var remeSelectType = {};
var COUNT = 0;
var rememberPropId = '';
/**=------展现弹窗----------- */
 //市场模块table
 function domStructMark(data, title, type) {
     var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
     var isSmall = type == 2 ? 'small' : '';
     var switchType = data.tabs ? data.tabs: '';
     var wrapper = '<div class="chaqz-wrapper"><div class="content ' + isSmall + '">' + switchType + '<div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span><div class="chaqz-mask"><span class="loader"></span></div></div></div>'
     $('#app').append(wrapper)
     var paramsPage = data.paging ? data.paging:{};
     tableInstance = $('#chaqz-table').DataTable({
         data: data.data,
         destroy: true,
         columns: data.cols,
         language: {
             "paginate": {
                 "next": "&gt;",
                 "previous": "&lt;"
             },
             "sEmptyTable": '数据为空。'
         },
         pageLength: paramsPage.pageSize,
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
     if (paramsPage.page) {
         tableInstance.page(Number(paramsPage.page) - 1).draw(false)
     };
     tableInstance.on('page.dt', function (e, x, y) {
         var info = tableInstance.page.info();
         var timer = null;
         var hasCount = 0;
         if (type == 1) {
            $('.chaqz-wrapper .chaqz-mask').show(100);
            $('.mc-marketMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
            var titleType = title == '监控店铺' ? 'monitshop' : 'monititem';
            var localKey = getSearchParams(titleType, (info.page + 1), paramsPage.pageSize);
            var localCacheKey = getSearchParams(titleType, (info.page + 1), paramsPage.pageSize, 'local');
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
            $('.chaqz-wrapper .chaqz-mask').show(100);
            $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
            var titleType = title == '热门店铺' ? 'marketHotshop' : title == '热门品牌' ? 'marketHotbrand' : 'marketHotitem';
            var localKey = getSearchParams(titleType, (info.page + 1), paramsPage.pageSize);
            var localCacheKey = getSearchParams(titleType, (info.page + 1), paramsPage.pageSize, 'local');
            var hasSave = localStorage.getItem(localKey);
            var localSave = localStorage.getItem(localCacheKey);
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

         }  else if (type == 4) {
             $('.chaqz-wrapper .chaqz-mask').show(100)
             $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
             marketRank()
         } else if (type == 5) {
             $('.chaqz-wrapper .chaqz-mask').show(100);
             $('.op-mc-search-analyze-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
             var localKey = getSearchParams('structSearchItem', (info.page + 1), paramsPage.pageSize);
             var hasSave = localStorage.getItem(localKey);
             astructRelatedTable()
         } else if (type == 6) {
             $('.chaqz-wrapper .chaqz-mask').show(100);
             $('.op-mc-property-insight-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
             var localKey = getHotRankSelct().resLocalKey;
             var hasSave = localStorage.getItem(localKey);
              if (!hasSave) {
                  timer = setInterval(function () {
                      hasSave = localStorage.getItem(localKey);
                      if (hasSave) {
                          propHotRank(true);
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
                  propHotRank(true);
              }
         } else if (type == 7) {
             $('.chaqz-wrapper .chaqz-mask').show(100);
             $('.op-mc-property-insight-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
            var backT = title == '商品' ? 'listPropitem' : 'listPropshop';
            var localKey = getSearchParams(backT, (info.page + 1), paramsPage.pageSize);
             var hasSave = localStorage.getItem(localKey);
             if (!hasSave) {
                 timer = setInterval(function () {
                     hasSave = localStorage.getItem(localKey);
                     if (hasSave) {
                         listPropTable();
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
                 listPropTable();
             }
         } else if (type == 8) {
             $('.chaqz-wrapper .chaqz-mask').show(100);
             $('.op-mc-property-insight-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
             var rankType = title == '流量商品' ? '2' : '1';
             var localKey = getSearchParams(backT, (info.page + 1), paramsPage.pageSize,'',{
                 rankType:rankType
             });
             var hasSave = localStorage.getItem(localKey);
             if (!hasSave) {
                 timer = setInterval(function () {
                     hasSave = localStorage.getItem(localKey);
                     if (hasSave) {
                         listProductTable();
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
                 listProductTable();
             }
         }
     })
     LoadingPop()
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
             "sEmptyTable": '数据为空。',
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
        option.series = [{
                    name: title.name,
                    type: 'line',
                    smooth: true,
                    showSymbol: false,
                    symbol: 'circle',
                    data: edata
                }
            ]
     } else if (title.type == 'mqprop') {
         option.series = [{
             name: '支付买家数',
             type: 'line',
             smooth: true,
             showSymbol: false,
             symbol: 'circle',
             data: edata.payByrCnt
            },
            {
                name: '支付件数',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                data: edata.payItmCnt
            },
            {
                name: '支付子订单数',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                data: edata.payOrdCnt
            }, {
                name: '交易金额',
                type: 'line',
                smooth: true,
                showSymbol: false,
                symbol: 'circle',
                data: edata.tradeIndex
            }
        ]
     } else if (title.type == 'mqpropRnak') {
         option.toolbox = {
             show: true
         }
         option.legend = {
             data: ['交易金额', '访客人数', '搜索人数', '收藏人数', '加购人数', '支付人数', '支付转化率', '卖家数', '有支付卖家数', '支付商品数'],
             right: '5%'
         }
         option.series = [
             {
                 name: '交易金额',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.tradeIndex
             },
             {
                 name: '访客人数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.uvIndex
             },
             {
                 name: '搜索人数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.seIpvUvHits
             }, {
                 name: '收藏人数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.cltHits
             }, {
                 name: '加购人数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.cartHits
             }, {
                 name: '支付人数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.payByrCntIndex
             }, {
                 name: '支付转化率',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.payRateIndex
             }, {
                 name: '卖家数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.payItemCnt
             }, {
                 name: '有支付卖家数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.paySlrCnt
             }, {
                 name: '支付商品数',
                 type: 'line',
                 smooth: true,
                 showSymbol: false,
                 symbol: 'circle',
                 data: edata.slrCnt
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

 function domStructSearch(data, title) {
     var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
     var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span><div class="chaqz-mask"><span class="loader"></span></div></div></div>'
     $('#app').append(wrapper);
     var pageSize = data.paging ? data.paging.pageSize:10;
     tableInstance = $('#chaqz-table').DataTable({
         data: data.data,
         destroy: true,
         columns: data.cols,
         language: {
             "paginate": {
                 "next": "&gt;",
                 "previous": "&lt;",
                 "search": "查找记录:"
             },
             "sEmptyTable": '数据为空。'
         },
         pageLength: pageSize,
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
     $('.chaqz-wrapper').fadeIn(100);
 }
 function marketRank(pageType) {
    var chooseItem = $('.op-mc-market-rank-container .oui-card-header-wrapper .oui-tab-switch .oui-tab-switch-item-active').index() //0高交易，1高流量，2高意向
    var chooseList = $('.op-mc-market-rank-container .oui-tab-switch .oui-tab-switch-item-active').index() //0店铺，1商品，2品牌
    var curPage = $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.op-mc-market-rank-container .oui-page-size .ant-select-selection-selected-value').text()
    curPage = curPage ? Number(curPage) : 1;
    curPageSize = Number(curPageSize)
    var hotType = chooseItem == 1 ? 'hotsearch' : chooseItem == 2 ? 'hotpurpose' : 'hotsale';
    var rankType = chooseList == 1 ? 'item' : chooseList == 2 ? 'brand' : 'shop';
    var itemKey = getSearchParams(hotType)
    var localData = JSON.parse(sessionStorage.getItem(rankType + '/' + itemKey))
    // var totalCont = localData.length;
    // var marketData = localData.slice((curPage - 1) * curPageSize, curPage * curPageSize)
    dealIndex({
        type: hotType,
        dataType: localData
    }, function (val) {
        var res = val.value
        var resData = []
        var length = res.tradeIndex.length
        for (var i = 0; i < length; i++) {
            var obj = {
                shop: {}
            }
            obj.shop = {
                title: chooseList == 1 ? localData[i].item.title : chooseList == 2 ? localData[i].brandModel.brandName : localData[i].shop.title,
                url: chooseList == 1 ? localData[i].item.pictUrl : chooseList == 2 ? '//img.alicdn.com/tps/' + localData[i].brandModel.logo + '_36x36.jpg' : localData[i].shop.pictureUrl
            }
            var cycly = localData[i].cateRankId.cycleCqc
            obj.cate_cateRankId = {
                value: localData[i].cateRankId.value,
                cyc: dealCycle(localData[i].cateRankId.cycleCqc)
            }
            obj.tradeIndex = res.tradeIndex[i] != '超出范围,请使用插件最高支持7.8亿' ? res.tradeIndex[i] : '超出范围'
            if (chooseItem == 0) {
                obj.growth = dealTradeGrowth(localData[i].tradeGrowthRange.value)
                obj.payRate = res.payRate[i] ? (res.payRate[i]*100).toFixed(2) + "%":"-";
            } else if (chooseItem == 1) {
                obj.uvIndex = res.uvIndex[i]
                obj.seIpv = res.seIpv[i]
                obj.searRate = formula(res.seIpv[i], res.uvIndex[i], 2)
                obj.uvPrice = formula(res.tradeIndex[i], res.uvIndex[i], 1)
            } else {
                obj.cltHit = res.cltHit[i]
                obj.cartHit = res.cartHit[i]
            }
            resData.push(obj)
        }
        // if (pageType) {
            // if (totalCont > resData.length) {
            //     var visualData = []
            //     for (let i = 0; i < totalCont; i++) {
            //         visualData.push(resData[0])
            //     }
            //     var vStart = visualData.slice(0, (curPage - 1) * curPageSize)
            //     var vEndIndex = (curPage - 1) * curPageSize + curPageSize
            //     var vEnd = vEndIndex < totalCont ? visualData.slice(vEndIndex) : []
            //     resData = vStart.concat(resData, vEnd)
            // }
            var tableFont = chooseItem == 1 ? '高流量' : chooseItem == 2 ? '高意向' : '高交易';
            var tableEnd = chooseList == 1 ? '商品' : chooseItem == 2 ? '品牌' : '店铺';
            var tableTitle = tableEnd + '--' + tableFont;
            var cols = []
            if (chooseItem == 0) {
                cols = [{
                        data: 'shop',
                        title: tableEnd + '信息',
                        class: 'info',
                        render: function (data, type, row, meta) {
                            return "<div class='info'><img src = '" + data.url + "'><span>" + data.title + "</span></div>";
                        }
                    },
                    {
                        data: 'cate_cateRankId',
                        title: '行业排名',
                        render: function (data, type, row, meta) {
                            return '<span>' + data.value + '</span><p class="cycle">' + data.cyc + '</p>';
                        }
                    },
                    {
                        data: 'tradeIndex',
                        title: '交易金额',
                    },
                    {
                        data: 'growth',
                        title: '交易增长幅度',
                    },
                    {
                        data: 'payRate',
                        title: '支付转化率',
                    }
                ]
            } else if (chooseItem == 1) {
                cols = [{
                        data: 'shop',
                        title: tableEnd + '信息',
                        class: 'info',
                        render: function (data, type, row, meta) {
                            return "<div class='info'><img src = '" + data.url + "'><span>" + data.title + "</span></div>";
                        }
                    },
                    {
                        data: 'cate_cateRankId',
                        title: '行业排名',
                        render: function (data, type, row, meta) {
                            return '<span>' + data.value + '</span><p class="cycle">' + data.cyc + '</p>';
                        }
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
                        data: 'searRate',
                        title: '搜索占比',
                    },
                    {
                        data: 'tradeIndex',
                        title: '交易金额',
                    },
                    {
                        data: 'uvPrice',
                        title: 'UV价值',
                    }
                ]
            } else {
                cols = [{
                        data: 'shop',
                        title: tableEnd + '信息',
                        class: 'info',
                        render: function (data, type, row, meta) {
                            return "<div class='info'><img src = '" + data.url + "'><span>" + data.title + "</span></div>";
                        }
                    },
                    {
                        data: 'cate_cateRankId',
                        title: '行业排名',
                        render: function (data, type, row, meta) {
                            return '<span>' + data.value + '</span><p class="cycle">' + data.cyc + '</p>';
                        }
                    },
                    {
                        data: 'cltHit',
                        title: '收藏人数',
                    }, {
                        data: 'cartHit',
                        title: '加购人数',
                    },
                    {
                        data: 'tradeIndex',
                        title: '交易金额',
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
            }, tableTitle)
        // } else {
        //     for (var j = 0; j < curPageSize; j++) {
        //         tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
        //     }
        //     $('.chaqz-wrapper .chaqz-mask').hide(100)
        // }
    }, window.dataWrapper)
}
// 市场排行-商品-合并转化
 function rankMergeItem() {
     LoadingPop('show');
     COUNT = 0;
    var cycleSave = {
        step:0,
        res:[],
    }
    cycleMergeData(cycleSave)
}
// 循环获取商品类目数据
function cycleMergeData(cycleSave) {
    var curStep = cycleSave.step;
    var hotType = curStep == 1 ? 'hotsearch' : curStep == 2 ? 'hotpurpose' : 'hotsale';
     var itemKey = getSearchParams(hotType)
     var localData = JSON.parse(localStorage.getItem('item/' + itemKey))
     if (localData){
         COUNT = 0;
        cycleSave.res.push(localData)
        cycleSave.step = curStep+1;
        if ((curStep + 1)>2){
            rankMergeItemShow(cycleSave);
            return false
        }
        cycleMergeData(cycleSave)
     } else if (COUNT < 10) {
         COUNT++;
         $('.op-mc-market-rank-container .oui-card-header-wrapper .oui-tab-switch .oui-tab-switch-item').eq(curStep).click();
        setTimeout(function(){
            cycleMergeData(cycleSave)
        },500)
     }else{
        popTip('获取数据失败，请重试！');
        LoadingPop()
     }
}
// 市场排行商品合并展示
function rankMergeItemShow(localData){
    var finalItemData = mergeItemFilter(localData.res);
    var originData = finalItemData.hotSale;
    var indexData = finalItemData.resIndex;
    dealIndex({
        type: 'dealTrend',
        dataType: indexData
    }, function (val) {
        var res = val.value
        var resData = []
        var length = res.tradeIndex.length
        for (var i = 0; i < length; i++) {
            var obj = {
                shop: {}
            }
            obj.shop = {
                title: originData[i].item.title,
                url: originData[i].item.pictUrl
            }
            obj.itemId = originData[i].itemId.value;
            obj.tradeIndex = res.tradeIndex[i];
            obj.growth = dealTradeGrowth(originData[i].tradeGrowthRange.value);
            obj.uvIndex = res.uvIndex[i] ? res.uvIndex[i]:'未上榜';
            obj.seIpv = res.seIpvUvHits[i] ? res.seIpvUvHits[i] : '未上榜';
            obj.cltHit = res.cltHits[i] ? res.cltHits[i] : '未上榜';
            obj.cartHit = res.cartHits[i] ? res.cartHits[i] : '未上榜';
            obj.payBar = res.uvIndex[i] ? Math.floor(res.uvIndex[i] * res.payRateIndex[i]) : '-';
            obj.payRate = res.payRateIndex[i] ? (res.payRateIndex[i]*100).toFixed(2)+'%':'-';
            var searRate = formula(res.seIpvUvHits[i], res.uvIndex[i], 2);
            obj.searRate = searRate == '-' ? '未上榜' : searRate;
            var uvPrice = formula(res.tradeIndex[i], res.uvIndex[i], 1);
            obj.uvPrice = uvPrice == '-' ? '未上榜' : uvPrice;
            var kdPrice = formula(res.tradeIndex[i], obj.payBar, 1);
            obj.kdPrice = kdPrice == '-' ? '未上榜' : kdPrice;
            var carRate = formula(res.cartHits[i], res.uvIndex[i], 2);
            obj.carRate = carRate == '-' ? '未上榜' : carRate;
            var cltRate = formula(res.cltHits[i], res.uvIndex[i], 2);
            obj.cltRate = cltRate == '-' ? '未上榜' : cltRate;
            resData.push(obj)
        }
           var  cols = [{
                        data: 'shop',
                        title: '商品信息',
                        class: 'info',
                        render: function (data, type, row, meta) {
                            return "<div class='info'><img src = '" + data.url + "'><span>" + data.title + "</span></div>";
                        }
                    },
                    {
                        data: 'itemId',
                        title: '商品id',
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
                    },
                    {
                        data: 'payBar',
                        title: '支付人数',
                    },
                    {
                        data: 'payRate',
                        title: '支付转化率',
                    },
                    {
                        data: 'growth',
                        title: '交易增长幅度',
                    },
                    {
                        data: 'cltRate',
                        title: '收藏率',
                    },
                    {
                        data: 'carRate',
                        title: '加购率',
                    },
                    {
                        data: 'searRate',
                        title: '搜索占比',
                    },
                    {
                        data: 'kdPrice',
                        title: '客单价',
                    },
                    {
                        data: 'uvPrice',
                        title: 'UV价值',
                    }
                ]
            domStructMark({
                data: resData,
                cols: cols,
            }, '商品总览')
    })
}
function mergeItemFilter(data){
    var resIndex = {
        payRateIndex: [],
        tradeIndex: [],
        uvIndex: [],
        seIpvUvHits: [],
        cartHits: [],
        cltHits: [],
    }
    var  hotSale = data[0];
    var  hotSearch = data[1];
    var  hotPurpose = data[2];
    var saleLen = hotSale.length;
    var searchLen = hotSale.length;
    var purposeLen = hotSale.length;
    for (let i = 0; i < saleLen; i++) {
        const elSale = hotSale[i];
        resIndex.tradeIndex[i] = elSale.tradeIndex.value;
        resIndex.payRateIndex[i] = elSale.payRateIndex.value;
        for (let v = 0; v < searchLen; v++) {
            const elSear = hotSearch[v];
            if (elSale.itemId.value == elSear.itemId.value) {
                elSale.seIpvUvHits = {
                    value:elSear.seIpvUvHits.value
                }
                elSale.uvIndex = {
                    value: elSear.uvIndex.value
                }
                resIndex.seIpvUvHits[i] = elSear.seIpvUvHits.value;
                resIndex.uvIndex[i] = elSear.uvIndex.value;
            }
        }
        for (let j = 0; j < purposeLen; j++) {
            const elPur = hotPurpose[j];
             if (elSale.itemId.value == elPur.itemId.value) {
                 elSale.cartHits = {
                     value: elPur.cartHits.value
                 }
                 elSale.cltHits = {
                     value: elPur.cltHits.value
                 }
                  resIndex.cartHits[i] = elPur.cartHits.value;
                  resIndex.cltHits[i] = elPur.cltHits.value;
             }
        }
    }
    return {
        hotSale,
        resIndex
    };
}
/**=------数据处理----------- */
// listen shop\
 function marketMonitorShop(pageType) {
    var chooseTop = $('.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.mc-marketMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize)
    var backT = chooseTop == 1 ? 'monititem' : chooseTop == 2?'monitbrand': 'monitshop';
    var localCache = false;
    var finalKey = '';
    var itemKey = getSearchParams(backT, curPage, curPageSize);
    var localKey = getSearchParams(backT, curPage, curPageSize, 'local')
    if (localStorage.getItem(itemKey)) {
        finalKey = itemKey;
    } else {
        finalKey = localKey;
        localCache = true;
    }
   dealIndex({
        type: backT,
        dataType: finalKey,
        localCache: localCache
    }, function (vals) {
        var res = vals.value
        var finaData = vals.final.data
        var totalCont = vals.final.recordCount
        var resData = []
        var length = res.payRate.length
        for (var j = 0; j < length; j++) {
            var trandeOver = res.tradeIndex[j] != '超出范围,请使用插件最高支持7.8亿' ? Math.round(res.tradeIndex[j]) : '-'
            var computedNum = computedPayByr(res.uvIndex[j], res.payRate[j], trandeOver)
            var obj = {
                shop: {}
            }
            var cateRnkId = finaData[j].cateRankId
            if (chooseTop==1) {
                obj.shop = {
                    title: finaData[j].item.title,
                    url: finaData[j].item.pictUrl
                }
            } else if (chooseTop == 2) {
                 obj.shop = {
                     title: finaData[j].brandModel.brandName,
                     url: '//img.alicdn.com/tps/'+ finaData[j].brandModel.logo
                 }
            }else {
                obj.shop = {
                    title: finaData[j].shop.title,
                    url: finaData[j].shop.pictureUrl
                }
            }
            obj.cate_cateRankId = cateRnkId ? cateRnkId.value ? cateRnkId.value : '-' : '-'
            obj.tradeIndex = trandeOver
           if(chooseTop!=2){
                obj.uvIndex = Math.round(res.uvIndex[j])
                obj.seIpv = Math.round(res.seIpv[j])
                obj.cltHit = Math.round(res.cltHit[j])
                obj.cartHit = Math.round(res.cartHit[j])
                obj.payRate = res.payRate[j] ? (res.payRate[j] * 100).toFixed(2) + '%' : '-';
                obj.payByr = computedNum.res1
                obj.kdPrice = computedNum.res2
                obj.uvPrice = formula(trandeOver, res.uvIndex[j], 1)
                obj.searRate = formula(res.seIpv[j], res.uvIndex[j], 2)
                obj.scRate = formula(res.cltHit[j], res.uvIndex[j], 2)
                obj.jgRate = formula(res.cartHit[j], res.uvIndex[j], 2)
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
             var choseItem = chooseTop == 1 ? '监控商品' : chooseTop == 2 ? '监控品牌' : "监控店铺";
             var tableTie = chooseTop == 1 ? '商品信息' : chooseTop == 2 ? "店铺信息" : "品牌信息";
            var cols = []
            if(chooseTop ==2){
                 cols = [{
                             data: 'shop',
                             title: tableTie,
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
                         }]
            }else{
                cols = [{
                        data: 'shop',
                        title: tableTie,
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
            }
            domStructMark({
                data: resData,
                cols: cols,
                paging: {
                    page: curPage,
                    pageSize: curPageSize
                }
            }, choseItem, 1)
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    }, window.dataWrapper)
}
// hotShop 
 function marketMonitorItem(pageType) {
    var hotType = $('.op-mc-market-monitor-industryCard .oui-card-header-item .oui-tab-switch-item-active').index()
    var curPage = $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.op-mc-market-monitor-industryCard .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize)
    var backT = hotType == 1 ? 'marketHotitem' : hotType == 2 ? 'marketHotbrand' : 'marketHotshop'
     var localCache = false;
     var finalKey = '';
     var itemKey = getSearchParams(backT, curPage, curPageSize);
     var localKey = getSearchParams(backT, curPage, curPageSize, 'local')

     if (localStorage.getItem(itemKey)) {
         finalKey = itemKey;
     } else {
         finalKey = localKey;
         localCache = true;
     }
     dealIndex({
                 type: 'marketHot',
                 dataType: finalKey,
                 localCache: localCache
        },
        function (val) {
            var res = val.value
            var finaData = val.final.data
            var totalCont = val.final.recordCount
            var resData = []
            var length = res.tradeIndex.length
            for (var i = 0; i < length; i++) {
                var obj = {
                    shop: {}
                }
                if (hotType == 0) {
                    obj.shop = {
                        title: finaData[i].shop.title,
                        url: finaData[i].shop.pictureUrl
                    }
                } else if (hotType == 1) {
                    obj.shop = {
                        title: finaData[i].item.title,
                        url: finaData[i].item.pictUrl
                    }
                }else{
                     obj.shop = {
                         title: finaData[i].brandModel.brandName,
                         url: '//img.alicdn.com/tps/' + finaData[i].brandModel.logo
                     }
                }
                var cateRnkId = finaData[i].cateRankId
                obj.cate_cateRankId = cateRnkId ? cateRnkId.value : '-'
                obj.tradeIndex = res.tradeIndex[i] == '超出范围,请使用插件最高支持7.8亿' ? '超出范围' : res.tradeIndex[i];
                resData.push(obj)
            }
            if (pageType) {
                if (totalCont > resData.length) {
                    var visualData = []
                    for (let i = 0; i < totalCont; i++) {
                        visualData.push({
                            shop: {
                                title: '',
                                url: ''
                            },
                            cate_cateRankId: '',
                            tradeIndex: ''
                        })
                    }
                    var vStart = visualData.slice(0, (curPage - 1) * curPageSize)
                    var vEndIndex = (curPage - 1) * curPageSize + curPageSize
                    var vEnd = vEndIndex < totalCont ? visualData.slice(vEndIndex) : []
                    resData = vStart.concat(resData, vEnd)
                }
                var headTitle = hotType == 1 ? '商品' : hotType == 2 ? '品牌' : '店铺';
                var cols = [{
                        data: 'shop',
                        title: headTitle +'信息',
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
                domStructMark({
                    data: resData,
                    cols: cols,
                    paging: {
                        page: curPage,
                        pageSize: curPageSize
                    }
                }, '热门'+headTitle, 2)
            } else {
                for (var j = 0; j < curPageSize; j++) {
                    tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
                }
                $('.chaqz-wrapper .chaqz-mask').hide(100)
            }
        }, window.dataWrapper)
}
 function trendTable(paramsSwitch) {
     var maskWrap = $('.ant-modal-mask:not(.ant-modal-mask-hidden)').siblings('.ant-modal-wrap')
     var maskHead = maskWrap.find('.ant-modal-header')
     var chooseList = $('.op-mc-market-rank-container .ebase-FaCommonFilter__root .oui-tab-switch .oui-tab-switch-item').index() //0店铺，1商品，2品牌
     var switchType = chooseList == 1 ? 'item' : chooseList == 2 ? 'brand' : 'shop';
     switchType = paramsSwitch ? paramsSwitch : switchType;
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
                 obj.payRate = res.payRateIndex[i] ? (res.payRateIndex[i]*100).toFixed(2)+'%':'-';
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
     })
}
// 市场大盘
function bigMarketTable(){
    if (!isNewVersion()) {
        return false
    }
    var overviewKey = getSearchParams('industryTrend', 0, 0, 'local');
    dealIndex({
        type: 'industryTrend',
        dataType: overviewKey
    },function(val){
        var isTrans = val.final?true:false;
        var fianlVal = isTrans?val.final:val;
        // var cols = []
        var obj = {};
        obj.uv = fianlVal.uv.value;
        obj.pv = fianlVal.pv.value;
        obj.cltByrCnt = fianlVal.cltByrCnt.value;
        obj.cltTimes = fianlVal.cltTimes.value;
        obj.cartByrCnt = fianlVal.cartByrCnt.value;
        obj.cartTimes = fianlVal.cartTimes.value;
        obj.cltRate = formulaRate(obj.cltByrCnt, obj.uv, 1);
        obj.carRate = formulaRate(obj.cartByrCnt, obj.uv, 1);
        var cols = [{
                data: 'uv',
                title: '访客数',
            },
            {
                data: 'pv',
                title: '浏览量',
            },
            {
                data: 'cltByrCnt',
                title: '收藏人数',
            },
            {
                data: 'cltTimes',
                title: '收藏次数',
            },
            {
                data: 'cartByrCnt',
                title: '加购人数',
            },
            {
                data: 'cartTimes',
                title: '加购次数',
            },
            {
                data: 'cltRate',
                title: '收藏率',
            },
            {
                data: 'carRate',
                title: '加购率',
            }
        ]
        // index transform
        if (isTrans) {
            var indexs = val.value ;
            obj.seIpvUvHits = indexs.seIpv[0];
            obj.payByrCntIndex = indexs.payByr[0];
            obj.sePvIndex = indexs.sePvIndex[0];
            obj.tradeIndex =  indexs.tradeIndex[0];
            obj.kdPrice = formulaRate(obj.tradeIndex, obj.payByrCntIndex);
            obj.payRate = (obj.payByrCntIndex / obj.uv*100).toFixed(2)+'%';
            obj.uvPrice = obj.tradeIndex == '超出范围' ? '-' : (obj.tradeIndex / obj.uv).toFixed(2);
            obj.searchRate = indexs.sePvIndex[0] == '超出范围' ? '-' : (indexs.sePvIndex[0] / obj.uv*100).toFixed(2)+'%';
            cols.push(
                {
                    data: 'seIpvUvHits',
                    title: '搜索人数',
                }, {
                    data: 'sePvIndex',
                    title: '搜索次数',
                },
                {
                    data: 'payByrCntIndex',
                    title: '支付人数',
                },
                {
                    data: 'tradeIndex',
                    title: '交易金额',
                },
                {
                    data: 'searchRate',
                    title: '搜索占比',
                },
                {
                    data: 'uvPrice',
                    title: 'UV价值',
                },
                {
                    data: 'kdPrice',
                    title: '客单价',
                },
                {
                    data: 'payRate',
                    title: '支付转化率',
                }
            )
        }
        domStructMark({
            data: [obj],
            cols: cols,
            paging:{}
        }, '市场分析-市场大盘')
    })
}
// 市场大盘-行业趋势
function getAllbigPanData(){
    if (!isNewVersion()) {
        LoadingPop()
        return false
    }
    $('.op-mc-market-overview-container #cateTrend .alife-one-design-sycm-indexes-trend-index-item-multiple-line-selectable').eq(0).click()
     var selectType = $('.op-mc-market-overview-container #cateTrend .oui-card-switch .oui-card-switch-item-container-active').index(); //0-对比行业，1-对比本店，2-对比周期
     var dayIndex = $('.oui-date-picker .ant-btn-primary').text();
     var compareType = selectType == 1 ? 'self' : selectType == 2 ? 'cycle' : "cate";
     var rootCateInfo = findcategory(); //本店目录选择
     var comCateInfo = findComcategory(); //对比目录选择
     var diffCate = selectType ? '' : comCateInfo['id'] ? ('&diffCateId=' + comCateInfo['id']) : ''; //对比类目选择
     var selectIndexType = $('.op-mc-market-overview-container #cateTrend .index-area-multiple-root-container .active .oui-index-cell').attr('value');
     COUNT = 0;
     cycleBigPanData(selectIndexType, {
         selectType, dayIndex, compareType, rootCateInfo, comCateInfo, diffCate
     }, {
         step: 0,
         saveData: {}
     })
}
function cycleBigPanData(selectIndexType, sendInfo,processInfo) {
    var trendKey = getSearchParams('bigMarket', 0, 0, 'local', {
        selectIndex: selectIndexType,
        compareType: sendInfo.compareType,
        diffCate: sendInfo.diffCate,
        localCateId: sendInfo.rootCateInfo.id
    });
    var storageVal = localStorage.getItem(trendKey);
    if (!storageVal) {
        if (COUNT>10){
             popTip('获取数据失败！');
             LoadingPop
             return false;
        }else{
            setTimeout(function(){
                cycleBigPanData(selectIndexType, sendInfo, processInfo)
            },500)
        }
    }else{
        COUNT = 0;
        var reductData = JSON.parse(filterLocalData(storageVal));
        var selfData = sendInfo.selectType == 1 ? reductData.self[selectIndexType] : sendInfo.selectType == 2 ? reductData.cate[selectIndexType] : reductData.self[selectIndexType];
        var cateData = sendInfo.selectType == 1 ? reductData.cate[selectIndexType] : sendInfo.selectType == 2 ? reductData.cycle[selectIndexType] : reductData.cate ? reductData.cate[selectIndexType] : '';
        processInfo.saveData[selectIndexType] = cateData ? selfData.concat(cateData) : selfData;
        var nextStep = processInfo.step+1;
        processInfo.step = nextStep;
        var nextClickDom = $('.op-mc-market-overview-container #cateTrend .alife-one-design-sycm-indexes-trend-index-item-multiple-line-selectable').eq(nextStep)
        if (!nextClickDom.length) {
             var proSaveData = processInfo.saveData;
             var typeNames = getShowTableName(sendInfo.rootCateInfo.name, remeSelectType.name, sendInfo.selectType, selectIndexType);
            if (nextStep>6){
                var sendData = {};
                sendData.seIpvUvHits = proSaveData.seIpvUvHits;
                sendData.sePvIndex = proSaveData.sePvIndex;
                sendData.payByrCntIndex = proSaveData.payByrCntIndex;
                sendData.tradeIndex = proSaveData.tradeIndex;
                dealIndex({type:'dealTrend',dataType:sendData},function(val){
                    bigMarketShowData(proSaveData, val.value, sendInfo.dayIndex, typeNames, 1)
                })
            }else{
                bigMarketShowData(proSaveData, {}, sendInfo.dayIndex, typeNames)
            }
            return false;
        }
        nextClickDom.click();
        var selectIndexType2 = $('.op-mc-market-overview-container #cateTrend .index-area-multiple-root-container .active .oui-index-cell').attr('value');
        cycleBigPanData(selectIndexType2, sendInfo, processInfo)
    }
}
function bigMarketShowData(fianlVal, indexs, selectIndexType, typeNames, type) {
    var yearMonthDays = '';
    if (selectIndexType=='周'){
        yearMonthDays = weekMonthDate('',12)
    } else if (selectIndexType == '月'){
        yearMonthDays = weekMonthDate('month',12)
    }else{
        yearMonthDays = monthDays()
    }
    var len = yearMonthDays.length;
    var itemLen = fianlVal.uv.length > len ? 2 : 1;
     var resData = [];
     for (let j = 0; j < len; j++) {
         for (let k = 0; k < itemLen; k++) {
            var obj = {};
            var cot = k*len+j;
            obj.date = yearMonthDays[j];
            obj.categroy = k ? typeNames.cateName : typeNames.selfName;
            obj.uv = fianlVal.uv[cot];
            obj.pv = fianlVal.pv[cot];
            obj.cltByrCnt = fianlVal.cltByrCnt[cot];
            obj.cltTimes = fianlVal.cltTimes[cot];
            obj.cartByrCnt = fianlVal.cartByrCnt[cot];
            obj.cartTimes = fianlVal.cartTimes[cot];
            obj.cltRate = formulaRate(obj.cltByrCnt, obj.uv, 1);
            obj.carRate = formulaRate(obj.cartByrCnt, obj.uv, 1);
            if(type){
                obj.seIpvUvHits = indexs.seIpvUvHits[cot];
                obj.payByrCntIndex = indexs.payByrCntIndex[cot];
                obj.sePvIndex = indexs.sePvIndex[cot];
                obj.tradeIndex = indexs.tradeIndex[cot];
                obj.kdPrice = formulaRate(obj.tradeIndex, obj.payByrCntIndex);
                obj.payRate = formulaRate(obj.payByrCntIndex, obj.uv, 1);
                obj.uvPrice = formulaRate(obj.tradeIndex, obj.uv) ;
                obj.searchRate = formulaRate(indexs.sePvIndex[0], obj.uv, 1);
            }
            resData.push(obj)
         }
     }
     var cols = [
             {
                 data: 'categroy',
                 title: '类别',
             },
             {
                 data: 'date',
                 title: '日期',
             },
             {
                 data: 'uv',
                 title: '访客数',
             },
             {
                 data: 'pv',
                 title: '浏览量',
             },
             {
                 data: 'cltByrCnt',
                 title: '收藏人数',
             },
             {
                 data: 'cltTimes',
                 title: '收藏次数',
             },
             {
                 data: 'cartByrCnt',
                 title: '加购人数',
             },
             {
                 data: 'cartTimes',
                 title: '加购次数',
             },
             {
                 data: 'cltRate',
                 title: '收藏率',
             },
             {
                 data: 'carRate',
                 title: '加购率',
             }
         ];
     if (type) {
        cols.push(
            {
                data: 'seIpvUvHits',
                title: '搜索人数',
            }, {
                data: 'sePvIndex',
                title: '搜索次数',
            },
            {
                data: 'payByrCntIndex',
                title: '支付人数',
            },
            {
                data: 'tradeIndex',
                title: '交易金额',
            },
            {
                data: 'searchRate',
                title: '搜索占比',
            },
            {
                data: 'uvPrice',
                title: 'UV价值',
            },
            {
                data: 'kdPrice',
                title: '客单价',
            },
            {
                data: 'payRate',
                title: '支付转化率',
            })
     }
     domStructMark({
         data: resData,
         cols: cols
     }, '行业趋势总览')
}
// 搜索排行
function searchRankTable(){
    if (!isNewVersion()) {
        return false
    }
    var wordType = $('.op-mc-search-rank-container .ebase-FaCommonFilter__left .oui-tab-switch .oui-tab-switch-item-active').index(); //哪种词
    var wordTabType = $('.op-mc-search-rank-container .oui-card-header .oui-tab-switch .oui-tab-switch-item-active').index(); //词的种类
    var loaclKey = getSearchParams('SearchRanking', 1, 10, 'local', {
        selType: wordType,
        rank: wordTabType
    });
    var localData = localStorage.getItem(loaclKey);
    if (!localData) {
        popTip('获取数据失败！')
        return false;
    }
    var reductData = JSON.parse(filterLocalData(localData));
    var filteWord = wordType < 2 ? 'seIpvUvHits' : 'avgWordSeIpvUvHits';
    var filteWord2 = wordType < 2 ? 'clickHits' : 'avgWordClickHits';
    var chooseData = wordTabType ? reductData.soarList : reductData.hotList;
    var spIv = filterSearchRank(chooseData, filteWord);
    var clickHits = filterSearchRank(chooseData, filteWord2);
    dealIndex({
        type: 'dealTrend',
        dataType: {
            seIpvUvHits: spIv,
            clickHits: clickHits
        }
    }, function (val) {
        var resData = [];
        var rankLength = chooseData.length;
        var spIv = val.value.seIpvUvHits;
        var clcikHits = val.value.clickHits;
        for (let i = 0; i < rankLength; i++) {
            var obj = {};
            obj.word = chooseData[i].searchWord;
            obj.seIpvUvHits = spIv[i];
            obj.hotrank = wordTabType ? chooseData[i].soarRank : chooseData[i].hotSearchRank;
            obj.p4pRefPrice = chooseData[i].p4pRefPrice ? (chooseData[i].p4pRefPrice*1).toFixed(2) : '-';
            if (wordType < 2) {
                obj.clickCount = clcikHits[i];
                obj.clickRate = chooseData[i].clickRate?(chooseData[i].clickRate * 100).toFixed(2) + '%':'-';
                obj.payRate = chooseData[i].payRate?(chooseData[i].payRate * 100).toFixed(2) + '%':'-';
            } else {
                obj.clickCount = clcikHits[i];
                obj.clickRate = chooseData[i].avgWordClickRate?(chooseData[i].avgWordClickRate * 100).toFixed(2)+'%':'-';
                obj.payRate = chooseData[i].avgWordPayRate?(chooseData[i].avgWordPayRate * 100).toFixed(2)+'%':'-';
                obj.relSeWordCnt = chooseData[i].relSeWordCnt;
            }
            resData.push(obj)
        }
        var cols = [];
        if (wordType < 2) {
            cols = [{
                    data: 'word',
                    title: '搜索词',
                },
                {
                    data: 'hotrank',
                    title: '热搜排名'
                },
                {
                    data: 'seIpvUvHits',
                    title: '搜索人数'
                },
                {
                    data: 'clickCount',
                    title: '点击人数'
                },
                {
                    data: 'clickRate',
                    title: '点击率'
                },
                {
                    data: 'payRate',
                    title: '支付转化率'
                },
                {
                    data: 'p4pRefPrice',
                    title: '参考价格'
                },
            ]
        } else {
            cols = [{
                    data: 'word',
                    title: '搜索词',
                },
                {
                    data: 'hotrank',
                    title: '热搜排名'
                },
                {
                    data: 'relSeWordCnt',
                    title: '相关搜索词数'
                },
                {
                    data: 'seIpvUvHits',
                    title: '相关搜索人数'
                },
                {
                    data: 'clickCount',
                    title: '相关点击人数'
                },
                {
                    data: 'clickRate',
                    title: '词均点击率'
                },
                {
                    data: 'payRate',
                    title: '词均支付转化率'
                },
                {
                    data: 'p4pRefPrice',
                    title: '参考价格'
                },
            ]
        }
        var titleFont = wordType == 1 ? '长尾词' : wordType == 2 ? '品牌词' : wordType == 3 ? '核心词' : wordType == 4 ? '修饰词' : '搜索词';
        var titleEnd = wordTabType ? '飙升' : '热搜';
        domStructSearch({
            data: resData,
            cols: cols,
            paging: {
                pageSize: 10
            }
        }, (titleFont + '-' + titleEnd))
    })
}

// 搜索分析
function analyOverviewTable(){//'ovewview
    if (!isNewVersion()) {
        return false
    }
    var searchWord = $('.op-mc-search-analyze-container .op-cc-item-info .item-keyword').text().toLocaleLowerCase();
    var overviewKey = getSearchParams('searchOverview', 0, 0, 'local',{
        keyword: searchWord
    });
    var localData = localStorage.getItem(overviewKey);
    if (!localData) {
        popTip('获取数据失败！')
        return false;
    }
    var reductData = JSON.parse(filterLocalData(localData));
    var resSend = {
        seIpvUvHits: [reductData.seIpvUvHits.value],
        tradeIndex: [reductData.tradeIndex.value],
        clickHits: [reductData.clickHits.value],
        sePvIndex: [reductData.sePvIndex.value],
        clickHot: [reductData.clickHot.value]
    }
    dealIndex({
        type: 'dealTrend',
        dataType: resSend
    }, function (val) {
        var fianlVal = val.value;
        var obj = {};
        obj.seIpvUvHits = fianlVal.seIpvUvHits[0];
        obj.trande = fianlVal.tradeIndex[0] == '超出范围,请使用插件最高支持7.8亿' ? '超出范围' : fianlVal.tradeIndex[0];
        obj.payrate = reductData.payConvRate.value ? (reductData.payConvRate.value*100).toFixed(2)+'%':'-';
        obj.sePvIndex = fianlVal.sePvIndex[0];
        obj.clickHits = fianlVal.clickHits[0];
        obj.clickHot = fianlVal.clickHot[0];
        obj.clickRate = reductData.clickRate.value ? (reductData.clickRate.value*100).toFixed(2)+'%':'-';
       var cols = [
             {
                 data: 'seIpvUvHits',
                 title: '搜索人数',
             },
            {
                data: 'sePvIndex',
                title: '搜索次数',
            },
            {
                data: 'clickHits',
                title: '点击人气',
            },
            {
                data: 'clickHot',
                title: '点击次数',
            },
            {
                data: 'clickRate',
                title: '点击率',
            },
            {
                data: 'trande',
                title: '交易额',
            },
            {
                data: 'payrate',
                title: '支付转化率',
            }
        ]
        domStructMark({
            data: [obj],
            cols: cols,
            paging: {}
        }, '搜索分析-总览')
    })
}
function analyTrendTable(){
    if (!isNewVersion()) {
        return false
    }
     var searchWord = $('.op-mc-search-analyze-container .op-cc-item-info .item-keyword').text().toLocaleLowerCase();
    var selectIndexType = $('.op-mc-search-analyze-container #searchTrend .index-area-multiple-root-container .active .oui-index-cell').attr('value');
    var trendKey = getSearchParams('analySearchTrend', 0, 0, 'local', {
        keyword: searchWord,
    });
    var transList = 'seIpvUvHits,tradeIndex';
    var storageVal = localStorage.getItem(trendKey);
    if (!storageVal) {
        popTip('获取数据失败！');
        return false;
    }
    var reductData = JSON.parse(filterLocalData(storageVal));
    var useData = reductData.self[selectIndexType];
    if (transList.indexOf(selectIndexType) == -1) {
        analytTrendShowData(useData, selectIndexType)
    } else {
        dealIndex({
            type: 'industryTrendChart',
            dataType: selectIndexType,
            sendData: useData
        }, function (val) {
            var selfData = val.value[selectIndexType];
            analytTrendShowData(selfData, selectIndexType)
        })
    }
}
function analytTrendShowData(selfData,selectIndexType) {
    var typeToWord = {
        seIpvUvHits: '搜索人数',
        sePvIndex: '搜索热度',
        clickHits: '点击人数',
        clickHot: '点击热度',
        clickRate: '点击率',
        payConvRate: '支付转化率',
        tradeIndex: '交易金额'
    }
    var month30Days = monthDays();
    var resData = [];
    for (let j = 0; j < 30; j++) {
        var obj = {};
        obj.self = selfData[j];
        obj.date = month30Days[j];
        resData.push(obj)
    }
    var selecName = typeToWord[selectIndexType];
    var cols = [{
                data: 'date',
                title: '日期',
            },
            {
                data: 'self',
                title: selecName
            }
        ]

    domStructTrend({
        data: resData,
        cols: cols
    }, {
        name: selecName,
        type: 'dapan'
    }, month30Days, {
        self: selfData,
        typeNames: {
            selfName: selecName
        }
    })
}
function analyRelatedTable(){//相关分析
    if (!isNewVersion()) {
        return false
    }
     var searchWord = $('.op-mc-search-analyze-container .op-cc-item-info .item-keyword').text().toLocaleLowerCase();
     var selectItem = $('.op-mc-search-analyze-container .oui-card .oui-tab-switch .oui-tab-switch-item-active').index();
     var keyType = selectItem == 1 ? 'relatedBrand' : selectItem == 2 ? 'relatedProperty' : selectItem == 3 ? 'relatedHotWord' : 'relatedWord';
    var localKey = getSearchParams(keyType, 1, 10, 'loacl', {
        keyword: searchWord
    })
    var localData = localStorage.getItem(localKey);
    if (!localData) {
        popTip('获取数据失败！')
        return false;
    }
    var reductData = JSON.parse(filterLocalData(localData));
    var sendData = {}
    if (!selectItem) {
        sendData.clickHits = filterSearchRank(reductData, 'clickHits');
        sendData.clickHot = filterSearchRank(reductData, 'clickHot');
        sendData.seIpvUvHits = filterSearchRank(reductData, 'seIpvUvHits');
        sendData.sePvIndex = filterSearchRank(reductData, 'sePvIndex');
        sendData.tradeIndex = filterSearchRank(reductData, 'tradeIndex');
    }else{
         sendData.clickHits = filterSearchRank(reductData, 'clickHits');
         sendData.seIpvUvHits = filterSearchRank(reductData, 'seIpvUvHits');
    }
    dealIndex({
        type: 'dealTrend',
        dataType: sendData
    }, function (val) {
        var indexVal = val.value;
        var len = reductData.length;
        var tableData = [];
        for (let i = 0; i < len; i++) {
            var obj = {};
            obj.keyword = reductData[i].keyword;
            obj.spev = indexVal.seIpvUvHits[i];
            obj.clickHits = indexVal.clickHits[i];
            obj.p4pAmt = reductData[i].p4pAmt ? (reductData[i].p4pAmt*1).toFixed(2) : '-';
            if (!selectItem) {
                obj.clickRate = (reductData[i].clickRate*100).toFixed(2) + '%';
                obj.trade = indexVal.tradeIndex[i];
                obj.sePvIndex = indexVal.sePvIndex[i];
                obj.clickhot = indexVal.clickHot[i];
                obj.payrate = (reductData[i].payConvRate * 100).toFixed(2) + '%';
                obj.onlineFood = reductData[i].onlineGoodsCnt;
                obj.shopClickRate = reductData[i].tmClickRatio ? (reductData[i].tmClickRatio*100).toFixed(2)+'%':'-';
                obj.uvPrice = (indexVal.tradeIndex[i] && indexVal.tradeIndex[i] != "超出范围") ? (indexVal.tradeIndex[i] / indexVal.seIpvUvHits[i]).toFixed(2) : '-';
                obj.compare = (indexVal.seIpvUvHits[i] / reductData[i].onlineGoodsCnt).toFixed(2);
                obj.shopper = (indexVal.tradeIndex[i] && indexVal.tradeIndex[i] != "超出范围") ? (indexVal.tradeIndex[i] / reductData[i].onlineGoodsCnt).toFixed(2) : '-';
            } else {
                obj.clickRate = reductData[i].avgWordClickRate?(reductData[i].avgWordClickRate * 100).toFixed(2) + '%':'-';
                obj.payrate = reductData[i].avgWordPayRate?(reductData[i].avgWordPayRate * 100).toFixed(2) + '%':'-';
            }
            tableData.push(obj);
        }
        var cols = [];
        if (selectItem) {
            cols = [{
                    data: 'keyword',
                    title: '搜索词'
                },
                {
                    data: 'spev',
                    title: '搜索人数'
                },
                {
                    data: 'clickRate',
                    title: '点击率'
                },
                {
                    data: 'clickHits',
                    title: '点击人数'
                },
                {
                    data: 'payrate',
                    title: '支付转化率'
                },
                {
                    data: 'p4pAmt',
                    title: '直通车参考价'
                },
            ]
        } else {
            cols = [{
                    data: 'keyword',
                    title: '搜索词'
                },
                {
                    data: 'spev',
                    title: '搜索人数'
                },
                {
                    data: 'sePvIndex',
                    title:'搜索次数'
                },
                {
                    data: 'clickRate',
                    title: '点击率'
                },
                {
                    data: 'clickHits',
                    title: '点击人数'
                }, 
                {
                    data: 'clickhot',
                    title: '点击次数'
                },
                {
                    data: 'trade',
                    title: '交易金额'
                },
                {
                    data: 'payrate',
                    title: '支付转化率'
                },
                {
                    data: 'onlineFood',
                    title: '在线商品数'
                },
                {
                    data: 'shopClickRate',
                    title: '商城点击占比'
                },
                {
                    data: 'p4pAmt',
                    title: '直通车参考价'
                },
                //  {
                //      data: 'searchRate',
                //      title: '搜索占比'
                //  },
                {
                    data: 'uvPrice',
                    title: 'uv价值'
                },
                {
                    data: 'compare',
                    title: '竞争力'
                },
                {
                    data: 'shopper',
                    title: '购买力'
                }
            ]
        }
        var titleName = ['相关搜索词', '关联品牌词', '关联修饰词', '关联热词']
        domStructSearch({
            data: tableData,
            cols: cols
        }, titleName[selectItem])

    })
}
// 搜索分析-结构
function astructRelatedTable(pagetype){
    if (!isNewVersion()) {
        return false
    }
    var selItem = $('.op-mc-search-analyze-container .oui-card .op-mc-search-analyze-cate-menu .oui-tab-switch-item-custom-active').index();//选择项
    var searchWord = $('.op-mc-search-analyze-container .op-cc-item-info .item-keyword').text().toLocaleLowerCase();//搜索词
    var curPage = $('.op-mc-search-analyze-container .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.op-mc-search-analyze-container .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize);
    var allItmeKey = getSearchParams('structSearchAll', curPage, curPageSize, 'local', {
        keyword: searchWord
    })
    var allItemData = localStorage.getItem(allItmeKey);
    if(!allItemData){
        popTip('数据获取失败！')
        return false;
    }
    var allItemInfo = JSON.parse(filterLocalData(allItemData));
    remeSelectType = allItemInfo.data;
    var selectId = allItemInfo.data[selItem]['cateId'];
    var itemKey = getSearchParams('structSearchItem', curPage, curPageSize, 'local', {
        keyword: searchWord,
        cateId: selectId
    })
    cycleFind(itemKey, allItemInfo, {
        page: curPage, 
        pageSize: curPageSize,
        selItem: selItem,
        pagetype: pagetype
    })
}
function cycleFind(localKey, allItemInfo,extra) {
     var localItemData = localStorage.getItem(localKey);
     if (localItemData) {
         var reductData = JSON.parse(filterLocalData(localItemData));
        getstructshow(reductData, allItemInfo, extra)
     } else {
         setTimeout(function () {
            if (COUNT>20){
                popTip('获取数据失败！')
                return false;
            }else{
                COUNT++
                cycleFind(localKey, allItemInfo, extra)
            }
         }, 200)
     }
}
function getstructshow(itemData, allItemInfo, extra) {
    var itemTabsData = allItemInfo.data;
    var tabsHtml = '';
    var showHtml = '';
    var itemLength = itemTabsData.length > 5 ? 5 : itemTabsData.length;
    for (let r = 0; r < itemLength; r++) {
        var isActive = extra.selItem == r ?'active':'';
        if (extra.selItem == r) {
            showHtml = '<p class="tabs-show">点击人数：<span class="clickHit">' + itemTabsData[r].clickHits + '</span>点击人数占比：<span class="clickRate">' + (itemTabsData[r].clickRate).toFixed(2) + '%</span></p>'
        }
        tabsHtml += ('<button class="switchBtn ' + isActive + ' switchStruct">' + itemTabsData[r].cateName + '</button>');
    }
    tabsHtml = '<div class="chaqz-top-tabs">' + tabsHtml + showHtml + '</div>';
    // var res = vals.value
    var finaData = itemData.data;
    var totalCont = itemData.recordCount;
    var sendData = {};
     sendData.clickHits = filterSearchRank(finaData, 'clickHits');
     sendData.clickHot = filterSearchRank(finaData, 'clickHot');
    dealIndex({
        type: 'dealTrend',
        dataType:sendData
    }, function (val) {
        var resData = [];
        var clickH = val.value.clickHot;
        var clickHt = val.value.clickHits;
        var length = finaData.length;
        var curPage = extra.page ? extra.page:1;
        var curPageSize = extra.pageSize;
        for (var j = 0; j < length; j++) {
            var obj={};
            obj.cateName = finaData[j].cateName;
            obj.cateId = finaData[j].cateId;
            obj.clickHits = clickHt[j];
            obj.clickHitsRatio = (finaData[j].clickHitsRatio*100).toFixed(2)+'%';
            obj.clickHot = clickH[j];
            obj.clickCntRatio = (finaData[j].clickCntRatio*100).toFixed(2)+'%';
            obj.clickRate = (finaData[j].clickRate*100).toFixed(2)+'%';
            resData.push(obj)
        }
        if (extra.pagetype) {
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
            var cols = [
                {
                    data: 'cateName',
                    title: '类目名称',
                },
                {
                    data: 'cateId',
                    title: '类目ID',
                },
                {
                    data: 'clickHits',
                    title: '点击人数',
                },
                {
                    data: 'clickHitsRatio',
                    title: '点击人数占比',
                },
                {
                    data: 'clickHot',
                    title: '点击次数',
                },
                 {
                    data: 'clickCntRatio',
                    title: '点击次数占比',
                }, 
                {
                    data: 'clickRate',
                    title: '点击率',
                }
            ]
            if ($('.chaqz-wrapper').length){
                $('.chaqz-wrapper .tabs-show .clickHit').text(itemTabsData[extra.selItem].clickHits);
                $('.chaqz-wrapper .tabs-show .clickRate').text((itemTabsData[extra.selItem].clickRate*100).toFixed(2)+'%');
                tableInstance.clear();
                tableInstance.rows.add(resData).draw();
            }else{
                domStructMark({
                    data: resData,
                    cols: cols,
                    paging: {
                        page: curPage,
                        pageSize: curPageSize
                    },
                    tabs: tabsHtml
                }, '类目结构', 5)
            }
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    })
}
// 搜索人群-all
function searchPersonAll(){
    if (!isNewVersion()) {
        return false
    }
    LoadingPop('show')
    var searchwordInfo = getSearchKeyword();
    $('#completeShopPortrait .mc-SearchCustomerPortrait .ant-radio-wrapper').eq(0).click();
    cycleFindPerson(searchwordInfo.key, {step:0,res:{},keyArr:searchwordInfo.keyItems})
}
function cycleFindPerson(localKey, extra) {
    var typeItems = ['searchPopularity','searchRatio','clickPopularity','clickRatio','clickRate','payPopularity','payRate'];
    var curStep = extra.step;
    var keys = getSearchParams('searchPerson',1,10,'local',{
        attrType:'all',
        keyword:localKey,
        indexCode: typeItems[curStep]
    })
    var localItemData = localStorage.getItem(keys);
    if (localItemData) {
        var reductData = JSON.parse(filterLocalData(localItemData));
        if(curStep>5){
            extra.res[typeItems[curStep]] = reductData;
            searPersonShow(extra.res,extra.keyArr)
            console.log(extra.res);
        }else{
            var nextStep = curStep+1;
            setTimeout(function(){
                 extra.res[typeItems[curStep]] = reductData;
                 $('#completeShopPortrait .mc-SearchCustomerPortrait .ant-radio-wrapper').eq(nextStep).click();
                 extra.step = nextStep;
                 cycleFindPerson(localKey, extra)
            },300)
           
        }
    } else {
        setTimeout(function () {
            if (COUNT > 20) {
                popTip('获取数据失败！')
                LoadingPop()
                return false;
            } else {
                COUNT++
                cycleFindPerson(localKey, extra)
            }
        }, 350)
    }
}
function searPersonShow(indexData,wordsArr){
    var resBox = {}
    for (var k in indexData) {
        var element = indexData[k];
        resBox[k] = [];
        var words1 = wordsArr[0];
        var words2 = wordsArr[1]?wordsArr[1]:'';
        var words3 = wordsArr[2]?wordsArr[2]:'';
        resBox[k].push(element[words1].allValue?element[words1].allValue:'');
        words2?resBox[k].push(element[words2].allValue?element[words2].allValue:''):'';
        words3?resBox[k].push(element[words3].allValue?element[words3].allValue:''):'';
    }
    dealIndex({
        type: 'dealTrend',
        dataType:{
            seIpvUvHits:resBox.searchPopularity,
            clickHits:resBox.clickPopularity,
            tradeIndex:resBox.payPopularity
        }
    }, function (val) {
        var transIndex = val.value;
        var tableData = [];
        var len = wordsArr.length;
        for (let i = 0; i < len; i++) {
            var obj = {};
            obj.keyword = wordsArr[i];
            obj.seIpvUvHits = transIndex.seIpvUvHits[i];
            obj.searchRate = resBox.searchRatio[i]? (resBox.searchRatio[i]*100).toFixed(2) + '%':'';
            obj.clickHits = transIndex.clickHits[i];
            obj.clickPerRate = resBox.clickRatio[i] ?(resBox.clickRatio[i]*100).toFixed(2) + '%':'';
            obj.clickRatio = resBox.clickRate[i]?(resBox.clickRate[i] * 100).toFixed(2) + '%':'';
            obj.tradeIndex = transIndex.tradeIndex[i];
            obj.payrate = resBox.payRate[i]?(resBox.payRate[i] * 100).toFixed(2) + '%':'';
            tableData.push(obj)
        }
        var cols = [
            {
                data: 'keyword',
                title: '搜索词',
            },
            {
                data: 'seIpvUvHits',
                title: '搜索人数',
            },
            {
                data: 'searchRate',
                title: '搜索人数占比',
            },
            {
                data: 'clickHits',
                title: '点击人数',
            },
            {
                data: 'clickPerRate',
                title: '点击人数占比',
            },
             {
                data: 'clickRatio',
                title: '点击率',
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
            paging:{}
        }, '搜索人群-总览')
    })
}
function searchProvce(type,selectItem){
    if (!isNewVersion()) {
        return false
    }
    var searchwordInfo = getSearchKeyword();
    var words = searchwordInfo.keyItems;
    var slectItem = $('#completeShopPortrait .mc-SearchCustomerPortrait .ant-radio-wrapper-checked').index();
    var tabsHtml = '';
    for (let i = 0; i < words.length; i++) {
        var isActive = i==0?'active':'';
        tabsHtml += ('<button class="switchBtn '+isActive+' switchCity">' + words[i] + '</button>');
    }
    tabsHtml = '<div class="chaqz-top-tabs">' + tabsHtml  + '</div>';
    remeSelectType = {
        type: type
    }
    var typeItems = ['searchPopularity','searchRatio','clickPopularity','clickRatio','clickRate','payPopularity','payRate'];
    var testReg = 'searchPopularity,clickPopularity,payPopularity';
    var curAttrType = typeItems[slectItem];
    var isNeedTrans = testReg.indexOf(curAttrType) != -1;
    var localKey = getSearchParams('searchPerson',1,10,'local',{
        keyword: searchwordInfo.key,
        attrType: type,
        indexCode: curAttrType
    })
    var localData = localStorage.getItem(localKey);
    if(!localData){
        popTip('数据获取失败！')
        return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    var selWord = selectItem ? words[selectItem] : words[0];
    var filteDa = reduceData[selWord].dataList ? reduceData[selWord].dataList : [];
    if(isNeedTrans){
        var sendArr = filterSearchRank(filteDa, 'value');
        var relateWord = {
            searchPopularity:'seIpvUvHits',
            clickPopularity: 'clickHits',
            payPopularity:'tradeIndex'
        }
        var sendData = {};
        sendData[relateWord[curAttrType]] = sendArr
        dealIndex({
            type: 'dealTrend',
            dataType: sendData
            }, function (val) {
                showProvCity(type, {
                            word:selWord,
                            tabs: tabsHtml
                        }, curAttrType, filteDa, {
                    isTrans:true,
                    data: val.value[relateWord[curAttrType]]
                })
            })
    }else{
        showProvCity(type, {
                    word: selWord,
                    tabs: tabsHtml
                }, curAttrType, filteDa, {
            isTrans: false,
        })
    }
}
function showProvCity(type,word,selType,oriData,transInfo){
    var tableData = [];
    var len = oriData.length;
    for (let i = 0; i < len; i++) {
        var obj = {};
        obj.rank = i+1;
        obj.type = oriData[i].key;
        obj.count = transInfo.isTrans ? transInfo.data[i] : oriData[i].value?(oriData[i].value * 100).toFixed(2) + '%':'-';
        tableData.push(obj)
    }
    var whre = type =='prov'?'省份':"城市";
    var numWord = {
        searchPopularity:'搜索人数',
        searchRatio: '搜索人数占比',
        clickPopularity: '点击人数',
        clickRatio: '点击人数占比',
        clickRate: '点击率',
        payPopularity: '交易金额',
        payRate: '支付转化率',
    }
    var cols=[
        {
            data: 'rank',
            title:  '排名'
        },
        {
            data: 'type',
            title: whre
        },
        {
            data: 'count',
            title: numWord[selType]
        },
    ];
     if ($('.chaqz-wrapper').length) {
        tableInstance.clear();
        tableInstance.rows.add(tableData).draw();
        $('.chaqz-wrapper .chaqz-table-title').text('搜索词' + word.word);
     }else{
         domStructMark({
             data: tableData,
             cols: cols,
             paging: {

             },
             tabs: word.tabs
         }, '搜索词' + word.word)
     }
}
// 行业客群
function customerTrend() { // 行业客群-客群趋势
    if (!isNewVersion()) {
        return false
    }
    var canSelect = $('#sycmMqIndustryCunstomer .index-picker-container');
    var selectItem = canSelect.length ? $('#sycmMqIndustryCunstomer .index-picker-container .ant-radio-wrapper-checked').parent().index():0;
    var itemList = ['payRateIndex', 'payByrCntIndex', 'tradeIndex'];
    var selType = itemList[selectItem];//展示指数类型
    var localKey = getSearchParams('customerTrend', 1, 10, 'local')
    var localData = localStorage.getItem(localKey);
    if (!localData){
        popTip('获取数据失败');
        return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    var sendData = {};
    sendData[selType] = reduceData[selType];
    dealIndex({
        type:'dealTrend',
        dataType: sendData
    },function(val){
        var tableData = [];
        var transData = val.value[selType];
        var len = transData.length;
        var month30Days = monthDays();
        for (let i = 0; i < len; i++) {
            var obj = {};
            obj.value = selType == 'payRateIndex' ? (transData[i] * 100).toFixed(2)+'%' : transData[i];
            obj.date = month30Days[i];
            tableData.push(obj);
        }
        var relaNames = {
            payRateIndex:'支付转化率',
            payByrCntIndex:'支付人数',
            tradeIndex: '交易金额'
        }
        var cols = [
            {
                data: 'date',
                title: '日期'
            },
            {
                data: 'value',
                title: relaNames[selType]
            }
            
        ]
        domStructTrend({
            data:tableData,
            cols: cols,
        }, {
            name:relaNames[selType],
            type:'only'
        }, month30Days, transData)
    })

}
function buyerPortraitFuns(type) { // 行业客群-偏好
     if (!isNewVersion()) {
         return false
     }
    var selType = type ? 'Cates' : 'Brands';
    var localKey = getSearchParams('buyerPortrait', 1, 10, 'lcoal', {
        type: selType
    })
    var localData = localStorage.getItem(localKey);
    if(!localData){
        popTip('获取数据失败');
        return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    var sendData = filterSearchRank(reduceData, 'tradeIndex');
    dealIndex({
        type:'dealTrend',
        dataType:{tradeIndex:sendData}
    },function(val){
        var transData = val.value.tradeIndex;
        var len  = transData.length;
        var tableData = [];
        var names = filterSearchRank(reduceData, 'name');
        for (let i = 0; i < len; i++) {
            var obj = {};
            obj.rank = i+1;
            obj.name = names[i];
            obj.transIndex = transData[i];
            tableData.push(obj);
        }
        var cols = [
            {
                data:'rank',
                title:'排名'
            },
            {
                data: 'name',
                title: '品牌名称'
            },
            {
                data: 'transIndex',
                title: '交易金额'
            }
        ];
        var typyName = type?'类目偏好':'品牌偏好' ;
        domStructMark({
            data: tableData,
            cols: cols
        }, typyName)
    })
}
// 属性洞察
function propHotRank(isTurnPage){
     if (!isNewVersion()) {
         return false
     }
    var allInfo = getHotRankSelct();
    var localKey = allInfo.resLocalKey;
    var localData = localStorage.getItem(localKey);
    if (!localData){
         popTip('获取数据失败');
         return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    var sendData = filterSearchRank(reduceData.data, 'tradeIndex');
    dealIndex({
        type: 'dealTrend',
        dataType: {
            tradeIndex: sendData
        }
    }, function (val) {
        var transData = val.value.tradeIndex;
        var len = transData.length;
        var tableData = [];
        var totalCont = reduceData.recordCount;//总数据数
        var curPage = allInfo.page;
        var curPageSize = Number(allInfo.pageSize);
        for (let i = 0; i < len; i++) {
            var obj = {};
            obj.payItmCnt = reduceData.data[i].payItmCnt;
            obj.name = reduceData.data[i].properties[0].value.name;
            obj.transIndex = transData[i];
            tableData.push(obj);
        }
        if (!isTurnPage) {
            if (totalCont > tableData.length) {
                var visualData = []
                for (let i = 0; i < totalCont; i++) {
                    visualData.push(tableData[0])
                }
                var vStart = visualData.slice(0, (curPage - 1) * curPageSize)
                var vEndIndex = (curPage - 1) * curPageSize + curPageSize
                var vEnd = vEndIndex < totalCont ? visualData.slice(vEndIndex) : []
                tableData = vStart.concat(tableData, vEnd)
            }
            var cols = [{
                    data: 'name',
                    title: '属性值'
                },
                {
                    data: 'transIndex',
                    title: '交易金额'
                },
                {
                    data: 'payItmCnt',
                    title: '支付件数'
                }
            ];
            if ($('.chaqz-wrapper').length) {
                tableInstance.clear();
                tableInstance.rows.add(tableData).draw();
            } else {
                var typyName = allInfo.hotType ? '热销属性组合' : '热销属性';
                domStructMark({
                    data: tableData,
                    cols: cols,
                    paging: {
                        page: curPage,
                        pageSize: curPageSize
                    },
                }, typyName, 6)
            }
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(tableData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    })
}
function getHotRankSelct() {
    // 获取页面选择项；
    var pageSizeDom = $('.op-mc-property-insight-container .alife-dt-card-common-table-page-size-wrapper .ant-select-selection-selected-value')
    var pageDom = $('.op-mc-property-insight-container .alife-dt-card-common-table-pagination-wrapper .ant-pagination-item-active')
    var page = pageDom.length?pageDom.text():1;
    var pageSize = pageSizeDom.length ? pageSizeDom.text() : 10;
    var tabSel = $('.op-mc-property-insight-container .oui-card-header .oui-tab-switch-item-active').index();//属性排行tab
    var firItemSel = $('.op-mc-property-insight-container .oui-card-content .op-mc-property-insight-filter-area .ant-select-selection-selected-value').attr('title'); //属性排行子类型选择
    var sortType = $('.op-mc-property-insight-container .contentContainer .ant-table-thead .alife-dt-card-common-table-sortable-icon-wrapper .active');
    var sortArrow = sortType.index()?'desc':'asc';
    var orderByText = sortType.parent().prev().text();
    var orderBy = orderByText == '支付件数' ? 'payItmCnt' : 'tradeIndex';//排序类型
    var propId = '';
    if (firItemSel){
         var cateId = findcategory();
         var localKey = '/mc/mq/prop/props.json?cateId=' + cateId.id;
         var reduceData = JSON.parse(filterLocalData(localStorage.getItem(localKey)));
        for (let i = 0; i < reduceData.length; i++) {
            if (reduceData[i].name == firItemSel){
                propId = reduceData[i].id;
                break;
            }
        }
        rememberPropId = propId;
    }else{
        propId = rememberPropId;
    }
     var resLocalKey = getSearchParams('hotRank', page, pageSize, 'local', {
         hotType: tabSel,
         propId: propId,
         orderBy: orderBy,
         sort: sortArrow,
     });
    return {
        page:page,
        pageSize:pageSize,
        hotType: tabSel,
        resLocalKey: resLocalKey
    }
}
function listPropTable(pageType) {
    // 热销榜单
    var chooseTop = $('.op-mc-property-insight-container .oui-card-header .oui-tab-switch .oui-tab-switch-item-active').index();
    var curPage = $('.op-mc-property-insight-container .ant-pagination .ant-pagination-item-active').attr('title');
    var curPageSize = $('.op-mc-property-insight-container .oui-page-size .ant-select-selection-selected-value').text();
    curPageSize = Number(curPageSize);
    var backT = chooseTop == 1 ? 'listPropitem' : 'listPropshop';
    var loaclKey = getSearchParams(backT, curPage, curPageSize);
    var localData = localStorage.getItem(loaclKey);
    if (!localData) {
        popTip('获取数据失败！')
        return false;
    }
    var reductData = JSON.parse(localData);
    var sendData = {};
      sendData.tradeIndex = filterSearchRank(reductData.data, 'tradeIndex');
      sendData.payRateIndex = filterSearchRank(reductData.data, 'payRateIndex');
     dealIndex({
         type: 'dealTrend',
         dataType: sendData
     }, function (vals) {
         var transData = vals.value;
         var totalCont = reductData.recordCount;
         var finaData = reductData.data;
         var resData = []
         var length = finaData.length
         for (var j = 0; j < length; j++) {
             var obj = {
                 shop: {}
             }
             if (chooseTop == 1) {
                 obj.shop = {
                     title: finaData[j].title,
                     url: finaData[j].picUrl
                 }
             }  else {
                 obj.shop = {
                     title: finaData[j].title,
                     url: finaData[j].pictureUrl
                 }
             }
             obj.tradeIndex = transData.tradeIndex[j];
             obj.payRate = transData.payRateIndex[j] ? (transData.payRateIndex[j]*100).toFixed(2)+'%':'-';
             obj.payByCut = finaData[j].payItmCnt;
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
             var tableTie = chooseTop == 1 ? '商品' : "店铺";
             var cols = [{
                         data: 'shop',
                         title: tableTie +'信息',
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
                          data: 'payByCut',
                          title: '支付件数',
                      },
                       {
                           data: 'payRate',
                           title: '支付转化率',
                       },
                 ]
             domStructMark({
                 data: resData,
                 cols: cols,
                 paging: {
                     page: curPage,
                     pageSize: curPageSize
                 }
             }, tableTie, 7)
         } else {
             for (var j = 0; j < curPageSize; j++) {
                 tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
             }
             $('.chaqz-wrapper .chaqz-mask').hide(100)
         }
     })

}
// 产品洞察
function productHotRank() {
    if (!isNewVersion()) {
        return false
    }
    var brandId = getProdSelectId();
    var localKey = getSearchParams('prodHotRank', 1, 10, 'local', {
        brandId: brandId
    });
    var localData = localStorage.getItem(localKey);
    if (!localData) {
        popTip('获取数据失败');
        return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    var sendData = filterSearchRank(reduceData, 'tradeIndex');
    dealIndex({
        type: 'dealTrend',
        dataType: {
            tradeIndex: sendData
        }
    }, function (val) {
        var transData = val.value.tradeIndex;
        var len = transData.length;
        var tableData = [];
        for (let i = 0; i < len; i++) {
            var obj = {};
            obj.payItmCnt = reduceData[i].payItmCnt;
            obj.name = reduceData[i].brandName;
            obj.transIndex = transData[i];
            tableData.push(obj);
        }
        var cols = [{
                data: 'name',
                title: '产品名称'
            },
            {
                data: 'transIndex',
                title: '交易金额'
            },
            {
                data: 'payItmCnt',
                title: '支付件数'
            }
        ];
            domStructMark({
                data: tableData,
                cols: cols
            }, '产品排行')
    })
}
function getProdSelectId(){
    var brandText = $('.op-mc-product-insight-container .oui-card-header-item-pull-right .sycm-common-select-simple-text').attr('title');
    var cateId = findcategory();
    var localKey = '/mc/mq/product/getBrands.json?cateId=' + cateId.id + '&keyword=';
    var reduceData = JSON.parse(filterLocalData(localStorage.getItem(localKey)));
    var resId = '';
    if(brandText!='所有品牌'){
        for (let i = 0; i < reduceData.length; i++) {
            if (reduceData[i].brandName == brandText) {
                resId = reduceData[i].brandId;
                break;
            }
        }
    }
    return resId;
}
function listProductTable(pageType) {
    // 产品洞察-热销榜单
    var chooseTop = $('.op-mc-product-insight-container .oui-card-header .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.op-mc-product-insight-container .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.op-mc-product-insight-container .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize)
    var backT = 'listProduct' ;
    var loaclKey = getSearchParams(backT, curPage, curPageSize, '', {
        rankType: chooseTop+1
    });
    var localData = localStorage.getItem(loaclKey);
    if (!localData) {
        popTip('获取数据失败！')
        return false;
    }
    var reductData = JSON.parse(localData);
    var sendData = {};
    if(chooseTop){
         sendData.seIpvUvHits = filterSearchRank(reductData.data, 'seIpvUvHits');
         sendData.uvIndex = filterSearchRank(reductData.data, 'uvIndex');
    }else{
        sendData.payRateIndex = filterSearchRank(reductData.data, 'payRateIndex');
    }
    sendData.tradeIndex = filterSearchRank(reductData.data, 'tradeIndex');
    dealIndex({
        type: 'dealTrend',
        dataType: sendData
    }, function (vals) {
        var transData = vals.value;
        var totalCont = reductData.recordCount;
        var finaData = reductData.data;
        var resData = []
        var length = finaData.length
        for (var j = 0; j < length; j++) {
            var obj = {
                shop: {}
            }
            obj.shop = {
                title: finaData[j].title,
                url: finaData[j].picUrl
            }
            if(chooseTop){
                  obj.seIpvUvHits = transData.seIpvUvHits[j];
                  obj.uvIndex = transData.uvIndex[j];
            }else{
                 obj.payRate = transData.payRateIndex[j] ? (transData.payRateIndex[j] * 100).toFixed(2)+'%' : '-';
                 obj.payByCut = finaData[j].payItmCnt;
            }
            obj.tradeIndex = transData.tradeIndex[j];
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
            var tableTie = chooseTop == 1 ? '流量商品' : "热销商品";
            var cols = []
            if(chooseTop){
                 cols = [{
                         data: 'shop',
                         title: tableTie,
                         class: 'info',
                         render: function (data, type, row, meta) {
                             return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                         }
                     },
                     {
                         data: 'uvIndex',
                         title: '访客人数',
                     },
                     {
                         data: 'seIpvUvHits',
                         title: '搜索人数',
                     },
                     {
                         data: 'tradeIndex',
                         title: '交易金额',
                     },
                 ]
            }else{
                cols = [
                    {
                        data: 'shop',
                        title: tableTie,
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
                        data: 'payByCut',
                        title: '支付件数',
                    },
                    {
                        data: 'payRate',
                        title: '支付转化率',
                    },
                ]
            }
            domStructMark({
                data: resData,
                cols: cols,
                paging: {
                    page: curPage,
                    pageSize: curPageSize
                }
            }, tableTie, 8)
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    })

}
function productTrendTop(isTrend){
     if (!isNewVersion()) {
         return false
     }
    var propId = getDetailParam('propertyIds');
    var propValId = getDetailParam('propertyValueIds');
    propId=propId.replace(/,/ig,'|')
    propValId = propValId.replace(/,/ig, '|')
    var propType = isTrend?'trend':'';
    var localKey = getSearchParams('mqPropOverview', 1, 10, 'local', {
        propId: propId,
        propValId: propValId,
        type: propType
    });
    var localData = localStorage.getItem(localKey);
    if (!localData) {
        popTip('获取数据失败');
        return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    console.log(reduceData)
    var sendData = {}
    if(isTrend){
        sendData.tradeIndex = reduceData.tradeIndex
    }else{
        sendData.tradeIndex = [reduceData.tradeIndex.value]
    }
    dealIndex({
        type:'dealTrend',
        dataType:sendData
    },function(val){
        var transData = val.value.tradeIndex;
        var obj = {};
        var tableData = [];
        var month30Days = isTrend? monthDays():'';
        for (let i = 0; i < transData.length; i++) {
            var obj = {};
            if(isTrend){
                obj.date = month30Days[i]
            }
            obj.tradeIndex = transData[i];
            obj.payOrdCnt = isTrend ? reduceData.payOrdCnt[i] : reduceData.payOrdCnt.value ? reduceData.payOrdCnt.value:'-';
            obj.payItmCnt = isTrend ? reduceData.payItmCnt[i] : reduceData.payItmCnt.value ? reduceData.payItmCnt.value:'-';
            obj.payByrCnt = isTrend ? reduceData.payByrCnt[i] : reduceData.payByrCnt.value ? reduceData.payByrCnt.value:'-';
            tableData.push(obj)
        }
        var cols = [
            {
                title: '交易金额',
                data: 'tradeIndex'
            },
            {
                title: '支付子订单数',
                data: 'payOrdCnt'
            },
            {
                title: '支付件数',
                data: 'payItmCnt'
            },
            {
                title: '支付买家数',
                data: 'payByrCnt'
            },
        ]
        var titleName = isTrend ? '属性趋势' : '属性趋势总览';
        if(isTrend){
            cols.unshift({
                data:'date',
                title:'日期'
            })
            domStructTrend({
                data: tableData,
                cols: cols
            }, {
                name: titleName,
                type:'mqprop'
            }, month30Days, {
                payByrCnt: reduceData.payByrCnt,
                payItmCnt: reduceData.payItmCnt,
                payOrdCnt: reduceData.payOrdCnt,
                tradeIndex: transData
            })
        }else{
             domStructMark({
                 data: tableData,
                 cols: cols
             }, titleName)
        }
    })
}
function prodRankTrendTop(isTrend) {
    if (!isNewVersion()) {
        return false
    }
    var spuId = getPropRankIds();
    var propType = isTrend ? 'trend' : '';
    var localKey = getSearchParams('mqPropRankOverview', 1, 10, 'local', {
        spuId: spuId,
        type: propType
    });
    var localData = localStorage.getItem(localKey);
    if (!localData) {
        popTip('获取数据失败');
        return false;
    }
    var reduceData = JSON.parse(filterLocalData(localData));
    console.log(reduceData)
    var sendData = {}
    if (isTrend) {
        sendData.tradeIndex = reduceData.tradeIndex;
        sendData.uvIndex = reduceData.uvIndex;
        sendData.cartHits = reduceData.cartHits;
        sendData.cltHits = reduceData.cltHits;
        sendData.payByrCntIndex = reduceData.payByrCntIndex;
        sendData.payRateIndex = reduceData.payRateIndex;
        sendData.seIpvUvHits = reduceData.seIpvUvHits;
    } else {
        sendData.tradeIndex = [reduceData.tradeIndex.value]
        sendData.uvIndex = [reduceData.uvIndex.value]
        sendData.cartHits = [reduceData.cartHits.value]
        sendData.cltHits = [reduceData.cltHits.value]
        sendData.payByrCntIndex = [reduceData.payByrCntIndex.value]
        sendData.payRateIndex = [reduceData.payRateIndex.value]
        sendData.seIpvUvHits = [reduceData.seIpvUvHits.value]
    }
    dealIndex({
        type: 'dealTrend',
        dataType: sendData
    }, function (val) {
        var transData = val.value;
        var obj = {};
        var tableData = [];
        var month30Days = monthDays();
        var len = transData.tradeIndex.length
        for (let i = 0; i < len; i++) {
            var obj = {};
            if (isTrend) {
                obj.date = month30Days[i]
            }
            obj.tradeIndex = transData.tradeIndex[i];
            obj.uvIndex = transData.uvIndex[i];
            obj.seIpvUvHits = transData.seIpvUvHits[i];
            obj.cltHit = transData.cltHits[i];
            obj.cartHit = transData.cartHits[i];
            obj.payByrCntIndex = transData.payByrCntIndex[i];
            obj.payRateIndex = (transData.payRateIndex[i] * 100).toFixed(2) + '%';
            obj.kdPrice = formulaRate(transData.tradeIndex[i], obj.payByrCntIndex);
            obj.uvPrice = formulaRate(transData.tradeIndex[i], obj.uvIndex);
            obj.searchRate = formulaRate(obj.seIpvUvHits, obj.uvIndex, 1);
            obj.cltRate = formulaRate(obj.cltHit, obj.uvIndex, 1);
            obj.carRate = formulaRate(obj.cartHit, obj.uvIndex, 1);
            obj.payItemCnt = isTrend ? reduceData.payItemCnt[i] : reduceData.payItemCnt.value ? reduceData.payItemCnt.value:'-';
            obj.paySlrCnt = isTrend ? reduceData.paySlrCnt[i] : reduceData.paySlrCnt.value ? reduceData.paySlrCnt.value:'-';
            obj.slrCnt = isTrend ? reduceData.slrCnt[i] : reduceData.slrCnt.value ? reduceData.slrCnt.value:'-';
            tableData.push(obj)
        }
        var cols = [
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
                    data: 'payItemCnt',
                    title: '卖家数'
                },
                {
                    data: 'paySlrCnt',
                    title: '有支付卖家数'
                },
                {
                    data: 'slrCnt',
                    title: '支付商品数'
                }
        ]
        var titleName = isTrend ? '产品趋势' : '产品趋势总览';
        if (isTrend) {
             // 表格数据
             transData.payItemCnt = reduceData.payItemCnt;
             transData.paySlrCnt = reduceData.paySlrCnt;
             transData.slrCnt = reduceData.slrCnt;
            cols.unshift({
                data: 'date',
                title: '日期'
            })
            domStructTrend({
                data: tableData,
                cols: cols
            }, {
                name: titleName,
                type: 'mqpropRnak'
            }, month30Days, transData)
        } else {
            domStructMark({
                data: tableData,
                cols: cols
            }, titleName)
        }
    })
}
/**=------方法类----------- */
// 产品洞察-获取ids funs
function getPropRankIds(){
    var loaclId = findcategory().id;
    var brandListStrify = localStorage.getItem('/mc/mq/product/getBrands.json?cateId=' + loaclId + '&keyword=');
    var brandList = brandListStrify?JSON.parse(filterLocalData(brandListStrify)):'';
    if(!brandList){
        return ''
    }
    var seleBrand = $('.op-mc-product-insight-container .op-mc-product-insight-product-filter-area .sycm-common-select-simple-text').eq(0).attr('title');
    var seleModel = $('.op-mc-product-insight-container .op-mc-product-insight-product-filter-area .sycm-common-select-simple-text').eq(1).attr('title');
    var brandId = '';
    for (let i = 0; i < brandList.length; i++) {
        const element = brandList[i];
        if (seleBrand == element.brandName){
            brandId = element.brandId;
            break;
        }
    }
    if (!brandId) {
        var urlModelId = getDetailParam('modelId')
        return urlModelId
    }
    var modeLocalkey = '/mc/mq/product/getModels.json?brandId=' + brandId + '&cateId=' + loaclId + '&keyword=';
    var modelListStrify = localStorage.getItem(modeLocalkey);
    var modelList = modelListStrify?JSON.parse(filterLocalData(modelListStrify)):'';
    if (!modelList) {
        return ''
    }
    var modelId = '';
    for (let i = 0; i < modelList.length; i++) {
        const element = modelList[i];
        if (seleModel == element.modelName) {
            modelId = element.spuId;
            break;
        }
    }
    return modelId;
}
// get params
function getDetailParam(key){
    var params = window.location.search;
    var clearParams = params.split('?')[1];
    var fitleParams = clearParams.split('&');
    var res = '';
    for (let i = 0; i < fitleParams.length; i++) {
        const element = fitleParams[i];
        var keyValue = element.split('=');
        if (key == keyValue[0]){
            res = keyValue[1];
            break;
        }
    }
    return decodeURIComponent(res);
}
function dealCycle(data) {
    if (!data) {
        return '_'
    }
    if (data > 0) {
        return '降' + data + "名"
    } else {
        return '升' + (data + '').slice(1) + "名"
    }
}

function dealTradeGrowth(data) {
    if (!data) {
        return '-'
    }
    return Number(data * 100).toFixed(2) + "%"
}
// 市场cateid
function findComcategory() {
    var text = '';
    text = $('.op-mc-market-overview-container .op-mc-market-overview-compare-area .common-picker-header').attr('title');
    if (text == '请选择类目' || text == '本店' || !text) {
        var hasRes = remeSelectType.id?remeSelectType:{};
        return hasRes;
    }
    var deText = text.split('>');
    var fianlText = deText[deText.length - 1].trim();
    var allCate = dataWrapper['getShopCate'].data.allInfo;
    var len = allCate ? allCate.length : 0;
    var res = '';
    for (let i = 0; i < len; i++) {
        const element = allCate[i];
        if (element[2] == fianlText) {
            res = element[1];
            break;
        }
    }
    return {
        id: res,
        name: fianlText
    };
}
// 获取表格以及图标的展示名称
function getShowTableName(rootName,comName,selType,typeVal){
    var firName = '',
    secName = '';
    // var typeToWord = {
    //     seIpvUvHits: '搜索人数',
    //     sePvIndex: '搜索热度',
    //     uv: '访客数',
    //     pv: '浏览量',
    //     cltByrCnt: '收藏人数',
    //     cltTimes: '收藏次数',
    //     cartByrCnt: '加购人数',
    //     cartTimes: '加购次数',
    //     payByrCntIndex: '支付人数',
    //     tradeIndex: '交易金额'
    // }
    if(selType==1){
        firName = '本店' + rootName ;
        secName = rootName ;
    } else if (selType == 2) {
        firName = '本周期' ;
        secName = '上一周期' ;
    }else{
        firName = rootName ;
        secName = comName ? (comName):'';
    }
    return {
        selfName: firName,
        cateName:secName,
        // tabName: typeToWord[typeVal]
    }

}
// filter index
function filterSearchRank(data, filteWord) {
    if(!data){
        return ''
    }
    var res = [];
    var len = data.length;
    for (let i = 0; i < len; i++) {
        const element = data[i];
        res.push(element[filteWord])
    }
    return res;
}
// get select words
function getSearchKeyword(){
    var searchwordWrap = $('.mc-searchCustomer #completeShop .sycm-common-select-wrapper .alife-dt-card-sycm-common-select');
    var searchKey1 = searchwordWrap.eq(0).find('.sycm-common-select-selected-title').length?searchwordWrap.eq(0).find('.sycm-common-select-selected-title').text():'';
    var searchKey2 = searchwordWrap.eq(1).find('.sycm-common-select-selected-title').length?searchwordWrap.eq(1).find('.sycm-common-select-selected-title').text():'';
    var searchKey3 = searchwordWrap.eq(2).find('.sycm-common-select-selected-title').length?searchwordWrap.eq(2).find('.sycm-common-select-selected-title').text():"";
    var keyword = [];
    searchKey1?keyword.push(searchKey1):'';
    searchKey2?keyword.push(searchKey2):'';
    searchKey3?keyword.push(searchKey3):'';
    return {
        keyItems: keyword,
        key:searchKey1+'|'+searchKey2+'|'+searchKey3
    }
}
/*------市场模块触发事件 ----------*/
//市场-我的监控-店铺 商品
$(document).on('click', '.mc-marketMonitor #search', function () {
    if (!isNewVersion()) {
        return false
    }
    marketMonitorShop("page")
})
//市场-行业监控-热门店铺、商品
$(document).on('click', '.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right #search', function () {
    if (!isNewVersion()) {
        return false
    }
    marketMonitorItem('pageType')
})
// 市场-市场排行
$(document).on('click', '.op-mc-market-rank-container #search', function () {
     if (!isNewVersion()) {
         return false
     }
    marketRank('pagetype')
})
// 市场-市场排行-合并转化
$(document).on('click', '.op-mc-market-rank-container #mergeItem', function () {
     if (!isNewVersion()) {
         return false
     }
    rankMergeItem('pagetype')
})
// 市场-市场排行- 趋势分析
$(document).on('click', '.op-mc-market-rank-container .alife-dt-card-common-table-right-column', function () { //趋势分析
    setTimeout(() => {
        trendTable()
    }, 500);
})
// 市场-市场排行- 市场大盘
$(document).on('click', '.op-mc-market-overview-container #cateTrend .cardHeader #search', function () {
    bigMarketTable()
})
// 市场-市场排行- 市场大盘-hangye
$(document).on('click', '.op-mc-market-overview-container #cateTrend .op-mc-market-overview-compare-area #search', function () {
    // bigMarketTrendTable()
    LoadingPop('show')
    getAllbigPanData()
})
// 市场-市场排行- 市场大盘-hangye
$(document).on('click', '.op-mc-search-rank-container .oui-card-header-wrapper #search', function () {
    searchRankTable()
})
// 市场-搜索分析- overview
$(document).on('click', '.op-mc-search-analyze-container #searchTrend .cardHeader #search', function () {
    if ($('.op-mc-search-analyze-container #searchTrend .oui-card-header-wrapper .oui-card-header #search').length) {
        analyOverviewTable();
    }
})
// 市场-搜索分析- trend
$(document).on('click', '.op-mc-search-analyze-container #searchTrend .alife-one-design-sycm-indexes-trend-addition-middle #search', function () {
    analyTrendTable()
})
// 市场-搜索分析- related
$(document).on('click', '.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-header #search', function () {
   if ($('.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-title').eq(0).text() == '相关词分析') {
        analyRelatedTable()
    }
})
// 市场-搜索分析- struct
$(document).on('click', '.op-mc-search-analyze-container  .oui-card-header-wrapper  #search', function () {
     if ($('.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-title').eq(0).text() == '类目构成') {
         astructRelatedTable('type')
     }
    
})
// 市场-搜索分析- 切换
$(document).on('click', '.chaqz-wrapper  .chaqz-top-tabs .switchStruct', function () {
    var index = $(this).index();
      if ($(this).hasClass('active')) {
          return false;
      }
      $(this).addClass('active').siblings().removeClass('active');
    $('.op-mc-search-analyze-container .op-mc-search-analyze-cate-menu .oui-tab-switch-item-custom').eq(index).click();
    astructRelatedTable('type')
})
// 市场-搜索人群- all 
$(document).on('click', '.mc-searchCustomer #completeShopPortrait  .oui-card-header-wrapper #search', function () {
   searchPersonAll()
})
// 市场-搜索人群- provce-city$('').eq(3).find('.portrait-title')
$(document).on('click', '.mc-searchCustomer #completeShopPortrait .portrait-container #search', function () {
   var parent = $(this).parents('.oui-col').index();
   if(parent == 3){
       searchProvce('prov')
   }else if(parent == 4){
       searchProvce('city')
   }
})
//行业客群-客群趋势
$(document).on('click', '#sycmMqIndustryCunstomer .oui-card-header-wrapper #search', function () {
  customerTrend()
})
//行业客群-类目偏好
$(document).on('click', '#completeShopPurchase .mc-Purchase #search', function () {
    var selecItem = $(this).parents('.sycm-trade-rank-portrait-card').index();
    selecItem ? buyerPortraitFuns(1) : buyerPortraitFuns();
})
//属性洞察-热门属性&&热销榜单
$(document).on('click', '.op-mc-property-insight-container .oui-card-header-wrapper #search', function () {
    if ($(this).parents('.oui-card-header').prev().text() == '热销榜单') {
        listPropTable('pageType');
    } else if ($(this).parents(':contains("属性排行")').length) {
        propHotRank();
    }
})
//属性洞察-属性趋势$('.op-mc-property-insight-container #propertyTrend .oui-card-header-item-pull-left')
$(document).on('click', '.op-mc-property-insight-container #propertyTrend .oui-card-header-item-pull-left #search', function () {
    productTrendTop()
})
//属性洞察-属性趋势图表$('.op-mc-property-insight-container #propertyTrend .oui-card-header-item-pull-left')
$(document).on('click', '.op-mc-property-insight-container #propertyTrend .recharts-wrapper #search', function () {
    productTrendTop('trend')
})
// 市场-属性洞察- 趋势分析
$(document).on('click', '.op-mc-property-insight-container .alife-dt-card-common-table-right-column', function () { //趋势分析
     var chooseTop = $('.op-mc-property-insight-container .oui-tab-switch .oui-tab-switch-item-active').index();
     var trendType= chooseTop?'item':'shop';
    setTimeout(() => {
        trendTable(trendType)
    }, 500);
})
//产品洞察-属性趋势
$(document).on('click', '.op-mc-product-insight-container #productTrend .oui-card-header-item-pull-left #search', function () {
    prodRankTrendTop()
})
//产品洞察-属性趋势图表
$(document).on('click', '.op-mc-product-insight-container #productTrend .recharts-wrapper #search', function () {
    prodRankTrendTop('trend')
})
//产品洞察-热门属性&&热销榜单
$(document).on('click', '.op-mc-product-insight-container .oui-card-header-wrapper #search', function () {
    if ($(this).parents('.oui-card-header').prev().text() == '热销榜单') {
        listProductTable('pageType');
    } else if ($(this).parents(':contains("产品排行")').length) {
        productHotRank();
    }
})
// 市场-产品洞察- 趋势分析
$(document).on('click', '.op-mc-product-insight-container .alife-dt-card-common-table-right-column', function () { //趋势分析
    setTimeout(() => {
        trendTable('item')
    }, 500);
})
// 市场-搜索人群- 切换
$(document).on('click', '.chaqz-wrapper  .chaqz-top-tabs .switchCity', function () {
    var index = $(this).index();
    if ($(this).hasClass('active')) {
        return false;
    }
    $(this).addClass('active').siblings().removeClass('active');
    searchProvce(remeSelectType.type, index)
})
// 选择对比
$(document).on('click', '.op-mc-market-overview-compare-area .common-picker-menu', function () {
   setTimeout(function(){
       remeSelectType = findComcategory()
   },300)
})
