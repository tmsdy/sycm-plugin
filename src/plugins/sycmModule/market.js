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
    filterLocalData
} from '../../common/commonFuns';
import {
    LoadingPop,
    isNewVersion
} from '../../common/promptClass'
var tableInstance = null; //table实例对象
var echartsInstance = null; //echarts实例对象
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
         }
     })
     $('.chaqz-wrapper').fadeIn(100);
 }
 // 趋势table
 function domStructTrend(data, title, eDate, edata) {
     var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">趋势分析</span></div><div><img src="' + title.picUrl + '"><span>' + title.name + '</span></div></div><div id="chaqzx-echarts-wrap"></div><div class="table-box"><table id="chaqz-table-trend" class="trend-table"></table></div></div><span class="chaqz-close">×</span></div></div>'
     $('#app').append(wrapper)
     $('#chaqz-table-trend').DataTable({
         data: data.data,
         columns: data.cols,
         language: {
             "paginate": {
                 "next": "&gt;",
                 "previous": "&lt;"
             },
             "sEmptyTable": '获取数据失败，请刷新界面'
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
     myChart.setOption(option);
     LoadingPop()
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
// listen shop\
 function marketMonitorShop(pageType) {
    var chooseTop = $('.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.mc-marketMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
    var backT = chooseTop ? 'marketFood' : 'marketShop';
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
                obj.tradeIndex = res.tradeIndex[i]
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
         var firstCateId = localStorage.getItem('shopCateId');
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
/*市场模块添加事件 */
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