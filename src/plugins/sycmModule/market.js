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
    findcategory
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
/**=------展现弹窗----------- */
 //市场模块table
 function domStructMark(data, title, type) {
     var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
     var isSmall = type == 2 ? 'small' : '';
     var switchType = data.tabs ? data.tabs: '';
     var wrapper = '<div class="chaqz-wrapper"><div class="content ' + isSmall + '">' + switchType + '<div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span><div class="chaqz-mask"><span class="loader"></span></div></div></div>'
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
         var info = tableInstance.page.info();
         var timer = null;
         var hasCount = 0;
         if (type == 1) {
            $('.chaqz-wrapper .chaqz-mask').show(100);
            $('.mc-marketMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
            var titleType = title == '监控店铺' ? 'marketShop' : 'monitFood';
            var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize);
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
            $('.chaqz-wrapper .chaqz-mask').show(100);
            $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-' + (info.page + 1)).click();
            var titleType = title == '热门店铺' ? 'marketHotShop' : 'marketHotFood';
            var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize);
            var localCacheKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize, 'local');
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
             var localKey = getSearchParams('structSearchItem', (info.page + 1), data.paging.pageSize);
             var hasSave = localStorage.getItem(localKey);
             astructRelatedTable()
            //  if (!hasSave) {
            //      timer = setInterval(function () {
            //          hasSave = localStorage.getItem(localKey);
            //          if (hasSave ) {
            //              astructRelatedTable();
            //              clearInterval(timer);
            //              timer = null;
            //              hasCount = 0;
            //          } else if (hasCount > 10) {
            //              clearInterval(timer);
            //              timer = null;
            //              hasCount = 0;
            //              popTip('获取数据失败！');
            //              LoadingPop();
            //          } else {
            //              hasCount++
            //          }

            //      }, 200);
            //  } else {
            //      astructRelatedTable()
            //  }

         }
     })
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
     var option = {}
     if (title.type == 'dapan') {
         option = {
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
            series: [{
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
        };
     }else{
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
             "sEmptyTable": '获取数据失败，请刷新界面'
         },
         pageLength: pageSize,
        //  searching: false,
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
  function domStructHeader(data, title) {
      var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text();
      var switchType = '';
      var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="chaqz-top-tabs">' + switchType + '</div><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span><div class="chaqz-mask"><span class="loader"></span></div></div></div>'
      $('#app').append(wrapper);
      var pageSize = data.paging ? data.paging.pageSize : 10;
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
          pageLength: pageSize,
          //  searching: false,
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
    var chooseList = $('.op-mc-market-rank-container .op-ebase-switch .ebase-Switch__activeItem').index() //0店铺，1商品，2品牌
    var curPage = $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.op-mc-market-rank-container .oui-page-size .ant-select-selection-selected-value').text()
    curPage = curPage ? Number(curPage) : 1;
    curPageSize = Number(curPageSize)
    var hotType = chooseItem == 1 ? 'hotsearch' : chooseItem == 2 ? 'hotpurpose' : 'hotsale';
    var rankType = chooseList == 1 ? 'item' : chooseList == 2 ? 'brand' : 'shop';
    var itemKey = getSearchParams(hotType)
    var localData = JSON.parse(localStorage.getItem(rankType + '/' + itemKey))
    var totalCont = localData.length;
    var marketData = localData.slice((curPage - 1) * curPageSize, curPage * curPageSize)
    dealIndex({
        type: hotType,
        dataType: marketData
    }, function (val) {
        var res = val.value
        var resData = []
        var length = res.tradeIndex.length
        for (var i = 0; i < length; i++) {
            var obj = {
                shop: {}
            }
            obj.shop = {
                title: chooseList == 1 ? marketData[i].item.title : chooseList == 2 ? marketData[i].brandModel.brandName : marketData[i].shop.title,
                url: chooseList == 1 ? marketData[i].item.pictUrl : chooseList == 2 ? '//img.alicdn.com/tps/' + marketData[i].brandModel.logo + '_36x36.jpg' : marketData[i].shop.pictureUrl
            }
            var cycly = marketData[i].cateRankId.cycleCqc
            obj.cate_cateRankId = {
                value: marketData[i].cateRankId.value,
                cyc: dealCycle(marketData[i].cateRankId.cycleCqc)
            }
            obj.tradeIndex = res.tradeIndex[i] != '超出范围,请使用插件最高支持7.8亿' ? res.tradeIndex[i] : '超出范围'
            if (chooseItem == 0) {
                //  obj.tradeIndex = res.tradeIndex[i] != '超出范围,请使用插件最高支持7.8亿' ? res.tradeIndex[i]:'超出范围'
                obj.growth = dealTradeGrowth(marketData[i].tradeGrowthRange.value)
                obj.payRate = res.payRate[i] + "%"
            } else if (chooseItem == 1) {
                //  obj.tradeIndex = res.tradeIndex[i]
                obj.uvIndex = res.uvIndex[i]
                obj.seIpv = res.seIpv[i]
                obj.searRate = formula(res.seIpv[i], res.uvIndex[i], 2)
                obj.uvPrice = formula(res.tradeIndex[i], res.uvIndex[i], 1)
            } else {
                //  obj.tradeIndex = res.tradeIndex[i]
                obj.cltHit = res.cltHit[i]
                obj.cartHit = res.cartHit[i]
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
            }, tableTitle, 4)
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    }, window.dataWrapper2)
}
/**=------数据处理----------- */
// listen shop\
 function marketMonitorShop(pageType) {
    var chooseTop = $('.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.mc-marketMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize)
    var backT = chooseTop ? 'monitFood' : 'marketShop';
   // var itemKey = getSearchParams(backT, curPage, curPageSize)

   var localCache = false;
   var finalKey = '';
   var itemKey = getSearchParams(backT, curPage, curPageSize);
   var localKey = getSearchParams(backT, curPage, curPageSize, 'local')

   if (localStorage.getItem(itemKey)) {
       finalKey = itemKey;
       if (chooseTop) {
           itemKey = itemKey.replace('marketFood', 'monitFood')
       }
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
            if (chooseTop) {
                obj.shop = {
                    title: finaData[j].item.title,
                    url: finaData[j].item.pictUrl
                }
            } else {
                obj.shop = {
                    title: finaData[j].shop.title,
                    url: finaData[j].shop.pictureUrl
                }
            }
            obj.cate_cateRankId = cateRnkId ? cateRnkId.value ? cateRnkId.value : '-' : '-'
            obj.tradeIndex = trandeOver
            obj.uvIndex = Math.round(res.uvIndex[j])
            obj.seIpv = Math.round(res.seIpv[j])
            obj.cltHit = Math.round(res.cltHit[j])
            obj.cartHit = Math.round(res.cartHit[j])
            obj.payRate = res.payRate[j].toFixed(2) + '%'
            obj.payByr = computedNum.res1
            obj.kdPrice = computedNum.res2
            obj.uvPrice = formula(trandeOver, res.uvIndex[j], 1)
            obj.searRate = formula(res.seIpv[j], res.uvIndex[j], 2)
            obj.scRate = formula(res.cltHit[j], res.uvIndex[j], 2)
            obj.jgRate = formula(res.cartHit[j], res.uvIndex[j], 2)
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
             var choseItem = !chooseTop ? '监控店铺' : "监控商品";
             var tableTie = !chooseTop ? '店铺信息' : "商品信息";
            var cols = [{
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
    }, window.dataWrapper2)
}
// hotShop 
 function marketMonitorItem(pageType) {
    var hotType = $('.op-mc-market-monitor-industryCard .oui-card-header-item .oui-tab-switch-item-active').index()
    var curPage = $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.op-mc-market-monitor-industryCard .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize)
    var backT = hotType ? 'marketHotFood' : 'marketHotShop'
     // var itemKey = getSearchParams(backT, curPage, curPageSize)
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
                } else {
                    obj.shop = {
                        title: finaData[i].item.title,
                        url: finaData[i].item.pictUrl
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
                var headTitle = hotType ? '热门商品' : '热门店铺'
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
                    }
                ]
                domStructMark({
                    data: resData,
                    cols: cols,
                    paging: {
                        page: curPage,
                        pageSize: curPageSize
                    }
                }, headTitle, 2)
            } else {
                for (var j = 0; j < curPageSize; j++) {
                    tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
                }
                $('.chaqz-wrapper .chaqz-mask').hide(100)
            }
        }, window.dataWrapper2)
}
 function trendTable() {
     var maskWrap = $('.ant-modal-mask:not(.ant-modal-mask-hidden)').siblings('.ant-modal-wrap')
     var maskHead = maskWrap.find('.ant-modal-header')
     var chooseList = $('.op-mc-market-rank-container .op-ebase-switch .ebase-Switch__activeItem').index() //0店铺，1商品，2品牌
     var switchType = chooseList == 1 ? 'item' : chooseList == 2 ? 'brand' : 'shop'
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
                 obj.payRate = res.payRateIndex[i]
                 obj.kdPrice = formula(obj.tradeIndex, res.payByrCntIndex[i], 1)
                 obj.uvPrice = formula(obj.tradeIndex, res.uvIndex[i], 1)
                //  if (chooseList==1) {
                //      obj.seIpv = res.seIpvUvHits[i]
                //      obj.cltHit = res.cltHits[i]
                //      obj.cartHit = res.cartHits[i]
                //      obj.searRate = formula(res.seIpvUvHits[i], res.uvIndex[i], 2)
                //      obj.scRate = formula(res.cltHits[i], res.uvIndex[i], 2)
                //      obj.jgRate = formula(res.cartHits[i], res.uvIndex[i], 2)
                //  }
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
            //  if (chooseList==1) {
            //      cols = [{
            //              data: 'date',
            //              title: '日期',
            //          },
            //          {
            //              data: 'tradeIndex',
            //              title: '交易金额',
            //          },
            //          {
            //              data: 'uvIndex',
            //              title: '访客人数',
            //          },
            //          {
            //              data: 'seIpv',
            //              title: '搜索人数',
            //          },
            //          {
            //              data: 'cltHit',
            //              title: '收藏人数',
            //          }, {
            //              data: 'cartHit',
            //              title: '加购人数',
            //          }, {
            //              data: 'payRate',
            //              title: '支付转化率',
            //          }, {
            //              data: 'payByr',
            //              title: '支付人数',
            //          }, {
            //              data: 'kdPrice',
            //              title: '客单价',
            //          }, {
            //              data: 'uvPrice',
            //              title: 'UV价值',
            //          }, {
            //              data: 'searRate',
            //              title: '搜索占比',
            //          }, {
            //              data: 'scRate',
            //              title: '收藏率',
            //          }, {
            //              data: 'jgRate',
            //              title: '加购率',
            //          }
            //      ]
            //  }

             domStructTrend({
                 data: resData,
                 cols: cols
             }, shopInfo, eDateArr, res)
         })
     })
}
// 市场大盘
function bigMarketTable(){
    var overviewKey = getSearchParams('industryTrend', 0, 0, 'local');
    dealIndex({
        type: 'industryTrend',
        dataType: overviewKey
    },function(val){
        var isTrans = val.final?true:false;
        var fianlVal = isTrans?val.final:val;
        var cols = []
        var obj = {};
        obj.uv = fianlVal.uv.value;
        obj.pv = fianlVal.pv.value;
        obj.cltByrCnt = fianlVal.cltByrCnt.value;
        obj.cltTimes = fianlVal.cltTimes.value;
        obj.cartByrCnt = fianlVal.cartByrCnt.value;
        obj.cartTimes = fianlVal.cartTimes.value;
        cols = [{
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
            }
        ]
        // index transform
        if (isTrans) {
            var indexs = val.value ;
            obj.seIpvUvHits = indexs.seIpv[0];
            obj.payByrCntIndex = indexs.payByr[0];
            obj.sePvIndex = indexs.sePvIndex[0];
            obj.tradeIndex = indexs.tradeIndex[0] == '超出范围,请使用插件最高支持7.8亿' ? '超出范围' : indexs.tradeIndex[0];
            obj.uvPrice = obj.tradeIndex == '超出范围' ? '-' : (obj.tradeIndex / obj.uv);
            obj.searchRate = indexs.sePvIndex[0] == '超出范围' ? '-' : (indexs.sePvIndex[0] / obj.uv*100).toFixed(2);
            cols = [{
                    data: 'uv',
                    title: '访客数',
                },
                {
                    data: 'pv',
                    title: '浏览量',
                },
                {
                    data: 'seIpvUvHits',
                    title: '搜索人数',
                },
                {
                    data: 'sePvIndex',
                    title: '搜索次数',
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
                }
            ]
        }
        domStructMark({
            data: [obj],
            cols: cols,
            paging:{}
        }, '市场分析-市场大盘')
    })
}
// 市场大盘-行业趋势
function bigMarketTrendTable(){
     var selectType = $('.op-mc-market-overview-container #cateTrend .oui-card-switch .oui-card-switch-item-container-active').index(); //0-对比行业，1-对比本店，2-对比周期
     var selectIndexType = $('.op-mc-market-overview-container #cateTrend .index-area-multiple-root-container .active .oui-index-cell').attr('value');
     var compareType = selectType == 1 ? 'self' : selectType == 2 ? 'cycle' : "cate";
     var rootCateInfo = findcategory();//本店目录选择
     var comCateInfo = findComcategory(); //对比目录选择
     var diffCate = selectType ? '' : comCateInfo['id'] ? ('&diffCateId=' + comCateInfo['id']) : ''; //对比类目选择
     var trendKey = getSearchParams('bigMarket', 0, 0, 'local', {
         selectIndex: selectIndexType,
         compareType: compareType,
         diffCate: diffCate,
         localCateId: rootCateInfo.id
     });
     var transList = 'seIpvUvHits,sePvIndex,payByrCntIndex,tradeIndex';
      var storageVal = localStorage.getItem(trendKey);
      if (!storageVal) {
          popTip('获取数据失败！');
          return false;
      }
      var typeNames = getShowTableName(rootCateInfo.name, remeSelectType.name, selectType, selectIndexType)
      var reductData = JSON.parse(filterLocalData(storageVal));
      var selfData = selectType == 1 ? reductData.self[selectIndexType] : selectType == 2 ? reductData.cate[selectIndexType] : reductData.self[selectIndexType];
      var cateData = selectType == 1 ? reductData.cate[selectIndexType] : selectType == 2 ? reductData.cycle[selectIndexType] : reductData.cate ? reductData.cate[selectIndexType] : '';
     if (transList.indexOf(selectIndexType)==-1){
       bigMarketShowData(selfData, cateData, selectIndexType, typeNames)
     }else{
         var sendData = cateData ? selfData.concat(cateData) : selfData;
        dealIndex({
            type: 'industryTrendChart',
            dataType: selectIndexType,
            sendData: sendData
        }, function (val) {
            var selfData = val.value[selectIndexType].slice(0,30);
            var cateDataTran = cateData ? val.value[selectIndexType].slice(30) : '';
            bigMarketShowData(selfData, cateDataTran, selectIndexType, typeNames)
        })
     }
}
function bigMarketShowData(selfData, cateData, selectIndexType, typeNames) {
     var month30Days = monthDays();
     var resData = [];
     for (let j = 0; j < 30; j++) {
         var obj = {};
         obj.self = selfData[j];
         obj.cate = cateData ? cateData[j] : '';
         obj.date = month30Days[j];
         resData.push(obj)
     }
     var cols =[];
     if (cateData){
        cols = [{
                data: 'date',
                title: '日期',
            },
            {
                data: 'self',
                title: typeNames.selfName,
            },
            {
                data: 'cate',
                title: typeNames.cateName,
            },
        ]
     }else{
        cols = [
            {
                 data: 'date',
                 title: '日期',
             },
             {
                 data: 'self',
                 title: typeNames.selfName,
             }
         ]
     }
     
     domStructTrend({
         data: resData,
         cols: cols
     }, {
         name: typeNames.tabName,
         type: 'dapan'
     }, month30Days, {
         self: selfData,
         cate: cateData,
         typeNames: typeNames
     })
}
// 搜索排行
function searchRankTable(){
    var wordType = $('.op-mc-search-rank-container .ebase-FaCommonFilter__left .op-ebase-switch .ebase-Switch__activeItem').index();//哪种词
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
    // var relateLength = needIndex.length;
    // var res=[];
    // var counter = 0;
    // termialWord(relateLength, counter, needIndex, res, {
    //     data: chooseData,
    //     choseInfo: {
    //         selType: wordType,
    //         tabType: wordTabType
    //     }
    // })
    

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
            obj.p4pRefPrice = chooseData[i].p4pRefPrice ? Math.ceil(chooseData[i].p4pRefPrice) : '-';
            if (wordType < 2) {
                obj.clickCount = clcikHits[i];
                obj.clickRate = (chooseData[i].clickRate * 100).toFixed(2);
                obj.payRate = (chooseData[i].payRate * 100).toFixed(2);
                // obj.searchRate = chooseData[i].p4pRefPrice ? chooseData[i].p4pRefPrice : '-';
            } else {
                obj.clickCount = clcikHits[i];
                obj.clickRate = (chooseData[i].avgWordClickRate * 100).toFixed(2);
                obj.payRate = (chooseData[i].avgWordPayRate * 100).toFixed(2);
                obj.relSeWordCnt = chooseData[i].relSeWordCnt;
                // obj.searchRate = chooseData[i].p4pRefPrice ? chooseData[i].p4pRefPrice : '-';
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
                    title: '点击率(%)'
                },
                {
                    data: 'payRate',
                    title: '支付转化率'
                },
                {
                    data: 'p4pRefPrice',
                    title: '参考价格'
                },
                // {
                //     data: 'searchRate',
                //     title: '搜索占比(%)'
                // },
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
                    title: '词均点击率(%)'
                },
                {
                    data: 'payRate',
                    title: '词均支付转化率'
                },
                {
                    data: 'p4pRefPrice',
                    title: '参考价格'
                },
                // {
                //     data: 'searchRate',
                //     title: '搜索占比(%)'
                // },
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
// function termialWord(relateLength, counter, relateSeI, res, relateWord) {
//     var start = counter * 100;
//     var end = (counter + 1) * 100;
//     if (start < relateLength) {
//         var sendData = relateSeI.slice(start, end);
//         dealIndex({
//             type: 'dealTrend',
//             dataType: {
//                 seIpvUvHits: sendData
//             }
//         }, function (val) {
//             res = res.concat(val.value.seIpvUvHits);
//             termialWord(relateLength, counter + 1, relateSeI, res, relateWord);
//         })
//     } else {
//         searchRankShow(res, relateWord)
//     }

// }
// function searchRankShow(transList, orginData) {
//     var resData = [];
//     var firType = orginData.choseInfo.selType;
//     var secType = orginData.choseInfo.tabType;
//     var res = orginData.data;
//     var rankLength = transList.length
//     for (let i = 0; i < rankLength; i++) {
//         var obj = {};
//         obj.word = res[i].searchWord;
//         obj.seIpvUvHits = transList[i];
//         obj.hotrank = secType ? res[i].soarRank : res[i].hotSearchRank;
//         obj.p4pRefPrice = res[i].p4pRefPrice ? Math.ceil(res[i].p4pRefPrice) : '-';
//         if (firType<2){
//             obj.clickCount = res[i].clickHits;
//             obj.clickRate = (res[i].clickRate * 100).toFixed(2);
//             obj.payRate = (res[i].payRate * 100).toFixed(2);
//             // obj.searchRate = res[i].p4pRefPrice ? res[i].p4pRefPrice : '-';
//         }else{
//             obj.clickCount = res[i].avgWordClickHits;
//             obj.clickRate = (res[i].avgWordClickRate * 100).toFixed(2);
//             obj.payRate = (res[i].avgWordPayRate * 100).toFixed(2);
//             obj.relSeWordCnt = res[i].relSeWordCnt;
//             // obj.searchRate = res[i].p4pRefPrice ? res[i].p4pRefPrice : '-';
//         }
//         resData.push(obj)
//     }
//     var cols = [];
//     if (firType < 2){
//         cols = [{
//                 data: 'word',
//                 title: '搜索词',
//             },
//             {
//                 data: 'hotrank',
//                 title: '热搜排名'
//             },
//             {
//                 data: 'seIpvUvHits',
//                 title: '搜索人数'
//             },
//             {
//                 data: 'clickCount',
//                 title: '点击人数'
//             },
//             {
//                 data: 'clickRate',
//                 title: '点击率(%)'
//             },
//             {
//                 data: 'payRate',
//                 title: '支付转化率'
//             },
//             {
//                 data: 'p4pRefPrice',
//                 title: '参考价格'
//             },
//             {
//                 data: 'searchRate',
//                 title: '搜索占比(%)'
//             },
//         ]
//     }else{
//         cols = [{
//                 data: 'word',
//                 title: '搜索词',
//             },
//             {
//                 data: 'hotrank',
//                 title: '热搜排名'
//             },
//             {
//                 data: 'relSeWordCnt',
//                 title: '相关搜索词数'
//             },
//             {
//                 data: 'seIpvUvHits',
//                 title: '相关搜索人数'
//             },
//             {
//                 data: 'clickCount',
//                 title: '相关点击人数'
//             },
//             {
//                 data: 'clickRate',
//                 title: '词均点击率(%)'
//             },
//             {
//                 data: 'payRate',
//                 title: '词均支付转化率'
//             },
//             {
//                 data: 'p4pRefPrice',
//                 title: '参考价格'
//             },
//             // {
//             //     data: 'searchRate',
//             //     title: '搜索占比(%)'
//             // },
//         ]
//     }
//     var titleFont = firType == 1 ? '长尾词' : firType == 2 ? '品牌词' : firType == 3 ? '核心词' : firType == 4 ? '修饰词' :  '搜索词' ;
//     var titleEnd = secType?'飙升':'热搜';
//     domStructSearch({
//         data: resData,
//         cols: cols,
//         paging:{
//             pageSize:10
//         }
//     }, (titleFont+'-'+titleEnd))
// }

// 搜索分析
function analyOverviewTable(){//'ovewview
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
        obj.payrate = reductData.payConvRate.value;
        obj.sePvIndex = fianlVal.sePvIndex[0];
        obj.clickHits = fianlVal.clickHits[0];
        obj.clickHot = fianlVal.clickHot[0];
        obj.clickRate = reductData.clickRate.value;
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
     var searchWord = $('.op-mc-search-analyze-container .op-cc-item-info .item-keyword').text().toLocaleLowerCase();
     var selectItem = $('.op-mc-search-analyze-container .oui-tab-switch .oui-tab-switch-item-active').index();
     var keyType = selectItem == 1 ? 'relatedBrand' : selectItem == 2 ? 'relatedProperty' : selectItem == 3 ? 'relatedHotWord' : 'relatedWord';
    var localKey = getSearchParams(keyType, 1, 10, 'loacl', {
        keyword: searchWord
    })
    var localData = localStorage.getItem(localKey);
    if (!localData) {
        popTip('获取数据失败！')
        return false;
    }
    // cycleFind(localKey, selectItem)
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
            obj.p4pAmt = reductData[i].p4pAmt ? Math.floor(reductData[i].p4pAmt) : '-';
            if (!selectItem) {
                obj.clickRate = (reductData[i].clickRate).toFixed(2) + '%';
                obj.trade = indexVal.tradeIndex[i];
                obj.sePvIndex = indexVal.sePvIndex[i];
                obj.clickhot = indexVal.clickHot[i];
                obj.payrate = (reductData[i].payConvRate * 100).toFixed(2) + '%';
                obj.onlineFood = reductData[i].onlineGoodsCnt;
                obj.shopClickRate = reductData[i].tmClickRatio;
                obj.uvPrice = (indexVal.tradeIndex[i] && indexVal.tradeIndex[i] != "超出范围") ? (indexVal.tradeIndex[i] / indexVal.seIpvUvHits[i]).toFixed(2) : '-';
                obj.compare = (indexVal.seIpvUvHits[i] / reductData[i].onlineGoodsCnt).toFixed(2);
                obj.shopper = (indexVal.tradeIndex[i] && indexVal.tradeIndex[i] != "超出范围") ? (indexVal.tradeIndex[i] / reductData[i].onlineGoodsCnt).toFixed(2) : '-';
            } else {
                obj.clickRate = reductData[i].avgWordClickRate * 100 + '%';
                obj.payrate = reductData[i].avgWordPayRate * 100 + '%';
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
    // analyRelatedShow(reductData, selectItem);
}

// function cycleFind(localKey, selectItem) {
//      var reductData = JSON.parse(filterLocalData(localKey));
//      if (reductData) {
//         analyRelatedShow(reductData, selectItem)
//      } else {
//          setTimeout(function () {
//             if (COUNT>20){
//                 popTip('获取数据失败！')
//                 return false;
//             }else{
//                 COUNT++
//                 cycleFind(localKey, selectItem)
//             }
//          }, 200)
//      }
// }
// function analyRelatedShow(reductData, selectItem) {
//     var sendData = {};
//     var seIpv =[];
//     var trade = [];
//     var res = {};
//      seIpv = filterSearchRank(reductData, 'seIpvUvHits');
//     if(selectItem){
//         sendData.seIpvUvHits = seIpv;
//     }else{
//         trade = filterSearchRank(reductData, 'tradeIndex');
//         sendData.seIpvUvHits = seIpv;
//         sendData.tradeIndex = trade;
//     }
//     var relateLength = reductData.length;
//     termialRelatedWord(relateLength, sendData, res, {
//         reductData: reductData,
//         selectItem: selectItem
//     })
// }
// function termialRelatedWord(relateLength, relateSeI, res, reductData) {//循环指数每100指数值；
//     var start = COUNT * 100;
//     var end = (COUNT + 1) * 100;
//     var sendData = {};
//     if (start < relateLength) {
//         for (var k in relateSeI) {
//             sendData[k] = relateSeI[k].slice(start, end);
//         }
//         dealIndex({
//             type: 'dealTrend',
//             dataType:sendData
//         }, function (val) {
//              for (var key in val.value) {
//                  if (val.value[key].length) {
//                      res[key] = res[key] ? res[key] : [];
//                     res[key] = res[key].concat(val.value[key]);
//                  }
//              }
//              COUNT++;
//             termialRelatedWord(relateLength, relateSeI, res, reductData);
//         })
//     } else {
//         COUNT = 0;
//         getRelatedShow(res, reductData)
//     }

// }
// function getRelatedShow(res,originData){ //展现表格数据
//     var selecType = originData.selectItem;
//     var oriData = originData.reductData; //元数据
//     var seIpv = res.seIpvUvHits;
//     var trade = res.tradeIndex;
//     var len = oriData.length;
//     var tableData = [];
//     for (let i = 0; i < len; i++) {
//         var obj = {};
//         obj.keyword = oriData[i].keyword;
//         obj.spev = seIpv[i];
//         obj.p4pAmt = oriData[i].p4pAmt ? Math.floor(oriData[i].p4pAmt) : '-';
//         if (!selecType){
//             obj.clickRate = (oriData[i].clickRate).toFixed(2)+'%';
//             obj.trade = trade[i];
//             obj.payrate = (oriData[i].payConvRate * 100).toFixed(2) + '%';
//             obj.onlineFood = oriData[i].onlineGoodsCnt;
//             obj.shopClickRate = oriData[i].tmClickRatio;
//             obj.uvPrice = (trade[i] && trade[i] != "超出范围,请使用插件最高支持7.8亿") ? (trade[i] / seIpv[i]).toFixed(2):'-';
//             obj.compare = (seIpv[i] / oriData[i].onlineGoodsCnt).toFixed(2);
//             obj.shopper = (trade[i] && trade[i] != "超出范围,请使用插件最高支持7.8亿") ? (trade[i] / oriData[i].onlineGoodsCnt).toFixed(2) : '-';
//         }else{
//             obj.clickRate = oriData[i].avgWordClickRate*100+'%';
//             obj.payrate = oriData[i].avgWordPayRate * 100 + '%';
//         }
//         tableData.push(obj);
//     }
//     var cols = [];
//     if (selecType){
//          cols = [{
//                  data: 'keyword',
//                  title: '搜索词'
//              },
//              {
//                  data: 'spev',
//                  title: '搜索人数'
//              },
//              {
//                  data: 'clickRate',
//                  title: '点击率'
//              },
//              // {
//              //     data: 'spev',
//              //     title: '点击次数'
//              // },
//              {
//                  data: 'payrate',
//                  title: '支付转化率'
//              },
//              {
//                  data: 'p4pAmt',
//                  title: '直通车参考价'
//              },
//          ]
//     }else{
//          cols = [
//              {
//                  data: 'keyword',
//                  title: '搜索词'
//              },
//              {
//                  data: 'spev',
//                  title: '搜索人数'
//              },
//              // {
//              //     data:'spev',
//              //     title:'搜索次数'
//              // },
//              {
//                  data: 'clickRate',
//                  title: '点击率'
//              },
//              // {
//              //     data: 'spev',
//              //     title: '点击人数'
//              // }, 
//              // {
//              //     data: 'spev',
//              //     title: '点击次数'
//              // },
//              {
//                  data: 'trade',
//                  title: '交易金额'
//              },
//              {
//                  data: 'payrate',
//                  title: '支付转化率'
//              },
//              {
//                  data: 'onlineFood',
//                  title: '在线商品数'
//              },
//              {
//                  data: 'shopClickRate',
//                  title: '商城点击占比'
//              },
//              {
//                  data: 'p4pAmt',
//                  title: '直通车参考价'
//              },
//             //  {
//             //      data: 'searchRate',
//             //      title: '搜索占比'
//             //  },
//              {
//                  data: 'uvPrice',
//                  title: 'uv价值'
//              },
//              {
//                  data: 'compare',
//                  title: '竞争力'
//              },
//              {
//                  data: 'shopper',
//                  title: '购买力'
//              }
//          ]
//     }
//     var titleName = ['相关搜索词', '关联品牌词', '关联修饰词', '关联热词']
//    domStructSearch({
//        data: tableData,
//        cols:cols
//    }, titleName[selecType])

// }
// 搜索分析-结构
function astructRelatedTable(pagetype){
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
// 搜索分析-all
function searchPersonAll(){
    var searchwordInfo = getSearchKeyword();
    console.log(searchwordInfo)
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
            
            extra.res[typeItems[curStep]] = reductData;
            console.log(reductData);
            $('#completeShopPortrait .mc-SearchCustomerPortrait .ant-radio-wrapper').eq(nextStep).click();
            extra.step=nextStep;
            cycleFindPerson(localKey, extra)
        }
    } else {
        setTimeout(function () {
            if (COUNT > 20) {
                popTip('获取数据失败！')
                return false;
            } else {
                COUNT++
                cycleFindPerson(localKey, extra)
            }
        }, 200)
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
            obj.searchRate = resBox.searchRatio[i];
            obj.clickHits = transIndex.clickHits[i];
            obj.clickPerRate = resBox.clickRatio[i];
            obj.clickRatio = resBox.clickRate[i];
            obj.tradeIndex = transIndex.tradeIndex[i];
            obj.payrate = resBox.payRate[i];
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
    console.log(resBox)
    // var fliterData = filterSearPerson(resBox,wordsArr)
}
function searchProvce(type){
    var searchwordInfo = getSearchKeyword();
    var words = searchwordInfo.keyItems;
    var slectItem = $('#completeShopPortrait .mc-SearchCustomerPortrait .ant-radio-wrapper-checked').index();
    var tabsHtml = '';
    for (let i = 0; i < words.length; i++) {
        var isActive = i==0?'active':'';
        tabsHtml += ('<button class="switchBtn '+isActive+' switchCity">' + words[i] + '</button>');
    }
    tabsHtml = '<div class="chaqz-top-tabs">' + tabsHtml + showHtml + '</div>';
    var typeItems = ['searchPopularity','searchRatio','clickPopularity','clickRatio','clickRate','payPopularity','payRate'];
    var testReg = 'searchPopularity,clickPopularity,payPopularity';
    var isNeedTrans = testReg.indexOf(typeItems[slectItem])!=-1;
    if(isNeedTrans){
        
    }else{

    }
    

}
/**=------方法类----------- */
function trendKeyJoin(type, idNum) {
    var trendFont = getSearchParams("allTrend", null, null, 'type');
    var res = '';
    if (type == 'brand') {
        res = '/mc/ci/brand/trend.json?brandId=' + idNum + '&' + trendFont + "&sellerType=-1";
    }
    if (type == 'shop') {
        res = '/mc/ci/shop/trend.json?' + trendFont + "&sellerType=-1&userId=" + idNum;
    }
    if (type == 'item') {
        res = '/mc/ci/shop/trend.json?' + trendFont + "&itemId=" + idNum + "&sellerType=-1";
    }
    return res
}

function trendInfoJoin(type, idNum, cateId) {
    var res = '';
    if (type == 'brand') {
        res = '/mc/ci/config/rival/brand/getSingleMonitoredInfo.json?brandId=' + idNum + '&firstCateId=' + cateId + '&rivalType=brand';
    }
    if (type == 'shop') {
        res = '/mc/ci/config/rival/shop/getSingleMonitoredInfo.json?firstCateId=' + cateId + '&rivalType=shop&userId=' + idNum;
    }
    if (type == 'item') {
        res = '/mc/ci/config/rival/item/getSingleMonitoredInfo.json?firstCateId=' + cateId + '&itemId=' + idNum + '&rivalType=item';
    }
    return res
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
// a month date
function monthDays() {
    var timeRnage = $('.ebase-FaCommonFilter__root .oui-date-picker .oui-date-picker-current-date').text();
    var spliteTime = timeRnage.split(' ');
    var splitLen = spliteTime.length;
    var finalTime = (splitLen == 3 || splitLen == 2) ? spliteTime[1] : splitLen == 4 ? spliteTime[3]:'';
    var finalDate = new Date(finalTime);
    var arr = [];
    for (let i = 0; i < 30; i++) {
        const ele = formate('yyyy-MM-dd', new Date(finalDate - 86400000 * i))
        arr.unshift(ele);
    }
    return arr;
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
    var allCate = dataWrapper2['getShopCate'].data.allInfo;
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
    var typeToWord = {
        seIpvUvHits: '搜索人数',
        sePvIndex: '搜索热度',
        uv: '访客数',
        pv: '浏览量',
        cltByrCnt: '收藏人数',
        cltTimes: '收藏次数',
        cartByrCnt: '加购人数',
        cartTimes: '加购次数',
        payByrCntIndex: '支付人数',
        tradeIndex: '交易金额'
    }
    if(selType==1){
        firName = '本店' + rootName + typeToWord[typeVal];
        secName = rootName + typeToWord[typeVal];
    } else if (selType == 2) {
        firName = '本周期' + typeToWord[typeVal];
        secName = '上一周期' + typeToWord[typeVal];
    }else{
        firName = rootName + typeToWord[typeVal];
        secName = comName ? (comName+typeToWord[typeVal]):'';
    }
    return {
        selfName: firName,
        cateName:secName,
        tabName: typeToWord[typeVal]
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
    keyword.push(searchKey1);
    searchKey2?keyword.push(searchKey2):'';
    searchKey3?keyword.push(searchKey3):'';
    return {
        keyItems: keyword,
        key:searchKey1+'|'+searchKey2+'|'+searchKey3
    }
}
/*------市场模块触发事件 ----------*/
//市场店铺的按钮是否显示控制
$(document).on('click', '.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item', function () {
    if ($(this).index() == 2) {
        $('.mc-marketMonitor #search').hide()
    } else {
        $('.mc-marketMonitor #search').show()
    }
})
//市场行业监控品牌不需要转换
$(document).on('click', '.op-mc-market-monitor-industryCard .oui-tab-switch .oui-tab-switch-item', function () {
    if ($(this).index() == 2) {
        $('.op-mc-market-monitor-industryCard #search').hide()
    } else {
        $('.op-mc-market-monitor-industryCard #search').show()
    }
})
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
// 市场-市场排行- 趋势分析
$(document).on('click', '.op-mc-market-rank-container .alife-dt-card-common-table-right-column', function (e) { //趋势分析
    setTimeout(() => {
        trendTable()
    }, 500);
})
// 市场-市场排行- 市场大盘
$(document).on('click', '.op-mc-market-overview-container #cateTrend .cardHeader #search', function (e) {
    bigMarketTable()
})
// 市场-市场排行- 市场大盘-hangye
$(document).on('click', '.op-mc-market-overview-container #cateTrend .op-mc-market-overview-compare-area #search', function (e) {
    bigMarketTrendTable()
})
// 市场-市场排行- 市场大盘-hangye
$(document).on('click', '.op-mc-search-rank-container .oui-card-header-wrapper #search', function (e) {
    searchRankTable()
})
// 市场-搜索分析- overview
$(document).on('click', '.op-mc-search-analyze-container #searchTrend .cardHeader #search', function (e) {
    if ($('.op-mc-search-analyze-container #searchTrend .oui-card-header-wrapper .oui-card-title').text() == '趋势分析') {
        analyOverviewTable();
    }
})
// 市场-搜索分析- trend
$(document).on('click', '.op-mc-search-analyze-container #searchTrend .alife-one-design-sycm-indexes-trend-addition-middle #search', function (e) {
    analyTrendTable()
})
// 市场-搜索分析- related
$(document).on('click', '.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-header #search', function (e) {
   if ($('.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-title').eq(0).text() == '相关词分析') {
        analyRelatedTable()
    }
})
// 市场-搜索分析- struct
$(document).on('click', '.op-mc-search-analyze-container  .oui-card-header-wrapper  #search', function (e) {
     if ($('.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-title').eq(0).text() == '类目构成') {
         astructRelatedTable('type')
     }
    
})
// 市场-搜索分析- 切换
$(document).on('click', '.chaqz-wrapper  .chaqz-top-tabs .switchStruct', function (e) {
    var index = $(this).index();
      if ($(this).hasClass('active')) {
          return false;
      }
      $(this).addClass('active').siblings().removeClass('active');
    $('.op-mc-search-analyze-container .op-mc-search-analyze-cate-menu .oui-tab-switch-item-custom').eq(index).click();
    astructRelatedTable('type')
})
// 市场-搜索人群- all 
$(document).on('click', '.mc-searchCustomer #completeShopPortrait  .oui-card-header-wrapper #search', function (e) {
   searchPersonAll()
})


// 选择对比
$(document).on('click', '.op-mc-market-overview-compare-area .common-picker-menu', function () {
   setTimeout(function(){
       remeSelectType = findComcategory()
   },300)
})
