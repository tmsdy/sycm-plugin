import {
    getCurrentTime,
    setDateRange,
    getFirstCateId,
    getDateRange,
    formula,
    Decrypt,
    testUrl
}
from '../../common/commonFuns'
import {
    LoadingPop,
    popTip,
    popUp,
     isNewVersion,
     LogOut
}
from '../../common/promptClass'
import {
    dealIndex
}
from '../../common/dealIndex'
import {
    BASE_URL
} from '../../common/constState'
var tableInstance = null; //table实例对象
var echartsInstance = null; //echarts实例对象
var competeSelectId =0;
// 关键词解析-不同的类型
function keywordUrl(rivalId, device, type) {
    var nowTime = getCurrentTime();
    var dateRange = setDateRange(nowTime, 'day');
    var localCateId = getFirstCateId();
    var defaultEnd = '&topType=trade&indexCode=tradeIndex';
    if (type) {
        defaultEnd = '&topType=flow&indexCode=uv'
    }
    var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getKeywords.json?dateRange=" + dateRange + "&dateType=day&pageSize=100&page=1&device=" + device + "&sellerType=0&cateId=" + localCateId + "&itemId=" + rivalId + defaultEnd;
    return {
        url: finalUrl,
        time: dateRange
    }
}
// 关键词解析--合并数组
function concatArr(decryData, decryDataTwo) {
    if (!decryData.length) {
        return decryDataTwo
    }
    if (!decryDataTwo.length) {
        return decryData
    }
    var bigLen = decryData.length;
    for (var i = 0; i < bigLen; i++) {
        var obj = decryData[i];
        for (let j = 0; j < decryDataTwo.length; j++) {
            if (obj.keyword.value == decryDataTwo[j].keyword.value) {
                decryData[i].uv = decryDataTwo[j].uv
                decryDataTwo.splice(j, 1)
            }

        }
    }
    return decryData.concat(decryDataTwo)
}
// 竞品解析
function domStructEchart(data, eDate, edata, time, chartType) {
    var switchType = chartType == 1 ? '<button class="switchBtn active switchFlow">移动数据</button><button class="switchBtn switchFlow">pc数据</button>' : chartType == 2 ? '<button class="switchBtn active switchKey">移动数据</button><button class="switchBtn switchKey">pc数据</button>' : '<button class="active switchBtn switchData">总数据</button><button class="switchBtn switchData">移动数据</button><button class="switchBtn switchData">pc数据</button>';
    var title = chartType == 1 ? '竞品流量解析' : chartType == 2 ? '竞品关键词解析' : '竞品数据解析';
    var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="chaqz-top-tabs">' + switchType + '</div><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + time + '</span></div></div><div id="chaqzx-echarts-wrap"></div><div class="table-box"><table id="chaqz-table-trend" class="trend-table"></table></div></div><span class="chaqz-close">×</span></div></div>'
    $('#app').append(wrapper)
    tableInstance = $('#chaqz-table-trend').DataTable({
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
        paging: false,
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
    echartsInstance = echarts.init(document.getElementById('chaqzx-echarts-wrap'));
    if (chartType == 1) {
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true
            },
            legend: {
                show: true
            },
            grid: {
                right: '5%',
                left: '5%',
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: eDate
            },
            yAxis: [{
                type: 'value',
            }, {
                type: 'value',
                show: false,
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
                    name: '访客数',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: edata.uvIndex
                },
                {
                    name: '买家数',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: edata.payByr
                },
                {
                    name: '转化率',
                    type: 'bar',
                    yAxisIndex: 2,
                    data: edata.payRate
                },
                {
                    name: '交易金额',
                    type: 'bar',
                    yAxisIndex: 3,
                    data: edata.tradeIndex
                },
                {
                    name: 'UV价值',
                    type: 'bar',
                    yAxisIndex: 4,
                    data: edata.uvPrice
                }
            ]
        };
    } else if (chartType == 2) {
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true
            },
            legend: {
                data: ['访客数', '支付件数', '支付转化率']
            },
            grid: {
                right: '5%',
                left: '5%',
                bottom: 100
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                axisLabel: {
                    rotate: -45
                },
                data: eDate
            },
            yAxis: [{
                type: 'value',
            }, {
                type: 'value',
                show: false,
            }, {
                type: 'value',
                show: false,
            }],
            series: [{
                    name: '访客数',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: edata.uvIndex
                },
                {
                    name: '支付件数',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: edata.tradeIndex
                },
                {
                    name: '支付转化率',
                    type: 'bar',
                    yAxisIndex: 2,
                    data: edata.payRate
                }
            ]
        };
    } else {
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                show: true
            },
            legend: {
                show: true
            },
            grid: {
                right: '5%',
                left: '5%',
                bottom: 100
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
            }],
            series: [{
                    name: '访客人数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: edata.uvIndex
                },
                {
                    name: '交易金额',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 2,
                    data: edata.tradeIndex
                },
                {
                    name: '搜索人数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: edata.seIpvUvHits
                },
                {
                    name: '收藏人数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: edata.cltHits
                },
                {
                    name: '转化率（%）',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.payRateIndex
                },
                {
                    name: '支付件数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.payItemCnt
                },
                {
                    name: '加购人数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: edata.cartHits
                },
                {
                    name: 'uv价值',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.uvPrice
                },
                {
                    name: '搜索占比（%）',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.searchRate
                },
                {
                    name: '收藏率（%）',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.cangRate
                },
                {
                    name: '买家数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: edata.payItemCnt
                },
                {
                    name: '加购率',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.buyRate
                }
            ]
        };
    }
    echartsInstance.setOption(option);
    LoadingPop()
}
//  权重解析
function domStructweightPars(info, eData) {
    var wrapper = '<div class="chaqz-wrapper weight-pop"><div class="content"><div class="cha-box"><div class="parsing-title">竞品权重解析</div><div class="weight-parsing"><div class="left"><div class="head-info"><img src="' + info.pic + '" alt="pic"><div class="name"><p>' + info.title + '</p><span class="price">' + info.priceRange + '</span></div></div><div id="chaqzx-echarts-wrap"></div></div><div class="right"><div class="scores"><p class="sorce-head">本次权重得分</p><p class="dScore"></p><p class="moreShop">超过市场' + eData.rank + '%商品</p></div><div class="proposal"><div class="propos-title">优化方案</div><ul class="prompt-list"><li><span>标题热度提升</span><button>优化</button></li><li><span>补冲流量，稳定转化</span><button>优化</button></li><li><span>补充单量</span><button>优化</button></li></ul></div></div></div></div><span class="chaqz-close">×</span></div></div>'
    $('#app').append(wrapper)
    $(document).on('click', '.weight-pop button', function () {
        popTip('开发中,敬请期待')
    })
    $(".weight-pop .dScore").animate({
        num: "dd",
    }, {
        duration: 1000,
        easing: 'swing',
        // complete: function () {
        //     console.log("success");
        // },
        step: function (a, b) {
            $(this).html(parseInt(b.pos * eData.combat));
        }
    });
    var weightData = eData.weight
    var myChart = echarts.init(document.getElementById('chaqzx-echarts-wrap'));
    var option = {
        grid: {
            top: "10%",
            // left: '5%',
        },
        tooltip: {},
        radar: {
            // shape: 'circle',
            name: {
                textStyle: {
                    color: '#888',
                    fontSize: 14
                }
            },
            //  splitArea: {
            //      areaStyle: {
            //          color: ['rgba(0,0,0)', 'rgba(50,50,50)']
            //      }
            //  },
            splitNumber: 4,
            indicator: [{
                    name: '流量',
                    max: weightData.uvIndex.max_index
                },
                {
                    name: '客群',
                    max: weightData.payItemCnt.max_index
                },
                {
                    name: '坑产',
                    max: weightData.tradeIndex.max_index
                },
                {
                    name: '收藏',
                    max: weightData.cltHits.max_index
                },
                {
                    name: '加购',
                    max: weightData.cartHits.max_index
                },
                {
                    name: '搜索',
                    max: weightData.seIpvUvHits.max_index
                }
            ]
        },
        // backgroundColor: '#000',
        series: [{
            name: '商品权重',
            type: 'radar',
            areaStyle: {
                color: 'rgba(235,111,60,0.38)'
            },
            itemStyle: {
                borderWidth: 2,
                borderColor: '#EB6F3C'
            },
            lineStyle: {
                color: '#EB6F3C',
                width: 2
            },
            data: [{
                value: [weightData.uvIndex.log, weightData.payItemCnt.log, weightData.tradeIndex.log, weightData.cltHits.log, weightData.cartHits.log, weightData.seIpvUvHits.log],
            }, ]
        }]
    };
    myChart.setOption(option);
    LoadingPop()
}
 // 竞品解析-切换终端-数据解析
 $(document).on('click', '.chaqz-wrapper .switchData', function () {
     if ($(this).hasClass('active')) {
         return false;
     }
     var btnArr = [0, 2, 1];
     var btnIndex = $(this).index();
     $(this).addClass('active').siblings().removeClass('active')
     competeDataAnaly(competeSelectId, btnArr[btnIndex])
 })
 // 竞品解析-切换终端-流量解析
 $(document).on('click', '.chaqz-wrapper .switchFlow', function () {
     if ($(this).hasClass('active')) {
         return false;
     }
     var btnArr = [0, 2, 1];
     var btnIndex = $(this).index() + 1;
     $(this).addClass('active').siblings().removeClass('active')
     competeFlowAnaly(competeSelectId, btnArr[btnIndex])
 })
 // 竞品解析-切换终端-关键词解析
 $(document).on('click', '.chaqz-wrapper .switchKey', function () {
     if ($(this).hasClass('active')) {
         return false;
     }
     var btnArr = [0, 2, 1];
     var btnIndex = $(this).index() + 1;
     $(this).addClass('active').siblings().removeClass('active')
     competeKeywordAnaly(competeSelectId, btnArr[btnIndex])
 })
$(document).on('click', '.chaqz-info-wrapper.pop .analyBtn', function () { //竞品解析
    var iptVal = $('.chaqz-info-wrapper.pop .anayEditor').val();
    var tips = $('.chaqz-info-wrapper.pop .good-tips')
    if (!iptVal) {
        tips.text('请输入url或者id')
        tips.addClass('alert');
        return false;
    }
    var isPassReg = testUrl(iptVal);
    if (!isPassReg) {
        tips.text('请输入正确url或者id')
        $('.chaqz-info-wrapper.pop .good-tips').addClass('alert');
        return false;
    }
    competeSelectId = isPassReg;
    var index = $(this).index();
    switch (index) {
        case 0:
            competeDataAnaly(isPassReg, 0);
            break;
        case 1:
            competeFlowAnaly(isPassReg, 2);
            break;
        case 2:
            competeKeywordAnaly(isPassReg, 2);
            break;
    }
    $('.chaqz-info-wrapper.pop').hide()
})
 $(document).on('click', '.chaqz-info-wrapper.pop .analyBtn2', function () { //权重解析
     LoadingPop('show');
     var iptVal = $('.chaqz-info-wrapper.pop .anayEditor').val();
     var tips = $('.chaqz-info-wrapper.pop .good-tips');
     if (!iptVal) {
         tips.text('请输入url或者id')
         tips.addClass('alert');
         LoadingPop();
         return false;
     }
     var isPassReg = testUrl(iptVal);
     if (!isPassReg) {
         tips.text('请输入正确url或者id')
         $('.chaqz-info-wrapper.pop .good-tips').addClass('alert');
         LoadingPop()
         return false;
     }
     competeSelectId = isPassReg;
     var saveToke = localStorage.getItem('chaqz_token')
     chrome.runtime.sendMessage({
         key: 'getData',
         options: {
             url: BASE_URL + '/py/api/v1/item?id=' + isPassReg,
             type: "GET",
             headers: {
                 Authorization: "Bearer " + saveToke
             }
         }
     }, function (val) {
         if (val.code == 200) {
             var localCateId = getFirstCateId();
             var resCateId = val.data.rootCategoryId;
             if (localCateId != resCateId) {
                 tips.html('校验失败,仅支持同类目商品！<a class="contactService">请联系客服</a>')
                 $('.chaqz-info-wrapper.pop .good-tips').addClass('alert');
                 LoadingPop();
                 return false
             }
             var itemInfo = {
                 pic: val.data.images[0],
                 title: val.data.title,
                 priceRange: '￥' + val.data.min_price + "~￥" + val.data.max_price
             }
             console.log(val.data.categoryId)
             weightParsing(isPassReg, val.data.categoryId, itemInfo);
         } else if (val.code == 2030) {
             LogOut();
             LoadingPop();
         } else {
             tips.html('校验失败！<a class="contactService">请联系客服</a>')
             $('.chaqz-info-wrapper.pop .good-tips').addClass('alert');
             LoadingPop();
         }
     })
 })
 // all-竞品解析
 $(document).on('click', '#parsing', function () {
     if (!isNewVersion()) {
         return false
     };
     popUp.init('competingGoodsAnalysis')
 });
 // all-权重解析
 $(document).on('click', '#weightParsing', function () {
     if (!isNewVersion()) {
         return false
     };
     popUp.init('competingTopAnalysis')
 });
// 权重数组合并
function mergeArr(arr, arr1) {
    var sendDecryData = {
        cartHits: [],
        cltHits: [],
        payRateIndex: [],
        seIpvUvHits: [],
        tradeIndex: [],
        uvIndex: []
    }
    for (var key in sendDecryData) {
        sendDecryData[key].push(arr[key].value)
        sendDecryData[key].push(arr1[key].value)
    }
    return sendDecryData
}
// 权重解析
function findFirstItme(arr) {
    var firstItem = '';
    if (!arr.length) {
        return ''
    }
    var len = arr.length
    for (var i = 0; i < len; i++) {
        if (arr[i].cateRankId.value == 1) {
            firstItem = arr[i];
            break;
        }
    }
    return firstItem;
}
// 权重解析
function weightParsing(rivald, category, itemInfo) {
    var nowTime = getCurrentTime('moreDay');
    var dateRange = setDateRange(nowTime, 'recent7');
    var finalUrl = "https://sycm.taobao.com/mc/mq/mkt/rank/item/hotsale.json?dateRange=" + dateRange + "&dateType=recent7&pageSize=100&page=2&order=desc&orderBy=tradeIndex&cateId=" + category + "&device=0&sellerType=-1&indexCode=cateRankId%2CtradeIndex%2CtradeGrowthRange%2CpayRateIndex";
    var sessionKey = sessionStorage.getItem('transitId');
    // chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl,
            type: 'GET',
            headers: {
                "transit-id": sessionKey
            },
            error: function () {
                popTip('获取数据失败请重试！')
                LoadingPop()
            },
            success: function (res) { 
                if (res.code === 0) {
                    var resData = JSON.parse(Decrypt(res.data));
                    var topItem = findFirstItme(resData);
                    console.log(topItem)
                    var params = {
                        rivald: rivald,
                        rivald2: topItem.itemId.value,
                        transId: sessionKey,
                        itemInfo: itemInfo,
                        category: category
                    }
                    getCompareData(params)
                } else {
                    popTip('转化失败,请重试！')
                    LoadingPop()
                }
            }
        })
    // })
}
// 获取竞品数据
function getCompareData(params) {
    var nowTime = getCurrentTime('moreDay');
    var dateRange = setDateRange(nowTime, 'recent7');
    var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreIndexes.json?dateType=recent7&dateRange=" + dateRange + "&device=0&cateId=" + params.category + "&rivalItem1Id=" + params.rivald;
    $.ajax({
        url: finalUrl,
        type: 'GET',
        headers: {
            "transit-id": params.transId
        },
        error: function () {
            popTip('获取数据失败请重试！')
            LoadingPop()
        },
        success: function (res) {
            //  if(res.code == 1009){
            //     weightParsing(rivald,1)
            //     return false
            //  }
            if (res.code !== 0 || !res.data) {
                popTip('获取数据失败请重试！')
                LoadingPop()
                return false;
            }
            var decryData = JSON.parse(Decrypt(res.data)).rivalItem1;
            var finalUrl2 = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreIndexes.json?dateType=recent7&dateRange=" + dateRange + "&device=0&cateId=" + params.category + "&rivalItem1Id=" + params.rivald2;
            $.ajax({
                url: finalUrl2,
                type: 'GET',
                headers: {
                    "transit-id": params.transId
                },
                error: function () {
                    popTip('获取数据失败请重试！')
                    LoadingPop()
                },
                success: function (res2) {
                    if (res2.code !== 0 || !res2.data) {
                        popTip('获取数据失败请重试！')
                        LoadingPop()
                        return false;
                    }
                    var decryData2 = JSON.parse(Decrypt(res2.data)).rivalItem1;
                    var dealSendData = mergeArr(decryData, decryData2)
                    console.log(finalUrl, decryData)
                    console.log(finalUrl2, decryData2)
                    dealIndex({
                        type: 'dealTrend',
                        dataType: dealSendData
                    }, function (dealRes) {
                        var dealVal = dealRes.value
                        dealVal.payItemCnt = [];
                        dealVal.payItemCnt.push(decryData.payItemCnt.value)
                        dealVal.payItemCnt.push(decryData2.payItemCnt.value)
                        parsingAnaly(dealVal, params.itemInfo)
                    })
                }
            })
        }
    })
}
// 权重解析--解析
function parsingAnaly(dealRes, info) {
    var sendData = {},
        sendData2 = {}
    sendData.payItemCnt = dealRes.payItemCnt[0];
    sendData.cartHits = dealRes.cartHits[0];
    sendData.cltHits = dealRes.cltHits[0];
    sendData.seIpvUvHits = dealRes.seIpvUvHits[0];
    sendData.tradeIndex = dealRes.tradeIndex[0];
    sendData.uvIndex = dealRes.uvIndex[0];
    sendData2.payItemCnt = dealRes.payItemCnt[1];
    sendData2.cartHits = dealRes.cartHits[1];
    sendData2.cltHits = dealRes.cltHits[1];
    sendData2.seIpvUvHits = dealRes.seIpvUvHits[1];
    sendData2.tradeIndex = dealRes.tradeIndex[1];
    sendData2.uvIndex = dealRes.uvIndex[1];
    var saveToke = localStorage.getItem('chaqz_token')
    chrome.runtime.sendMessage({
        key: 'getData',
        options: {
            url: BASE_URL + '/py/api/v1/weight',
            type: 'POST',
            headers: {
                Authorization: "Bearer " + saveToke
            },
            data: JSON.stringify({
                selfItem: sendData,
                item: sendData2
            }),
            contentType: "application/json,charset=utf-8",
        }
    }, function (val) {
        if (val.code == 200) {
            domStructweightPars(info, val.data)
        } else if (val.code == 2030) {
            LogOut()
        } else {
            popTip('解析失败');
        }
        $('.chaqz-info-wrapper.pop').hide();
        LoadingPop();
    })
}
/**=========================== 市场竞争table数据获取 ======================================= */
// 竞品解析-数据解析
 function competeDataAnaly(rivalId, device) {
    LoadingPop('show')
    var nowTime = getCurrentTime('moreDay');
    //  var dateRange = setDateRange(nowTime, 'day');
    var dateRange = setDateRange(nowTime);
    var titleDate = dateRange.replace('|', '~');
    var localCateId = getFirstCateId();
    var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreTrend.json?dateType=recent30&dateRange=" + dateRange + "&device=" + device + "&cateId=" + localCateId + "&rivalItem1Id=" + rivalId;
    console.log(finalUrl)
    var localData = localStorage.getItem(finalUrl);
    var hasWrap = $('.chaqz-wrapper').length
    if (localData) {
        var saveData = JSON.parse(localData)
        if (hasWrap) {
            var echartData = saveData.eData
            tableInstance.clear();
            tableInstance.rows.add(saveData.tableData).draw()
            echartsInstance.setOption({
                series: [{
                    data: echartData.uvIndex
                }, {
                    data: echartData.tradeIndex
                }, {
                    data: echartData.seIpvUvHits
                }, {
                    data: echartData.cltHits
                }, {
                    data: echartData.payRateIndex
                }, {
                    data: echartData.payItemCnt
                }, {
                    data: echartData.cartHits
                }, {
                    data: echartData.uvPrice
                }, {
                    data: echartData.searchRate
                }, {
                    data: echartData.cangRate
                }, {
                    data: echartData.payItemCnt
                }, {
                    data: echartData.buyRate
                }]
            })

        } else {
            domStructEchart({
                data: saveData.tableData,
                cols: saveData.tableClos
            }, saveData.edate, saveData.eData, saveData.dateRange)
        }
        LoadingPop()
        return false;
    }
    var sessionKey = sessionStorage.getItem('transitId');
    // chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl,
            type: 'GET',
            headers: {
                "transit-id": sessionKey
            },
            error: function () {
                popTip('获取数据失败请重试！')
                LoadingPop()
            },
            success: function (res) {
                var decryData = JSON.parse(Decrypt(res.data)).rivalItem1;
                console.log(res, decryData)
                if (!decryData) {
                    popTip('获取数据失败请重试！')
                    LoadingPop()
                    return false;
                }
                var sendDecryData = {
                    cartHits: decryData.cartHits,
                    cltHits: decryData.cltHits,
                    payRateIndex: decryData.payRateIndex,
                    seIpvUvHits: decryData.seIpvUvHits,
                    tradeIndex: decryData.tradeIndex,
                    uvIndex: decryData.uvIndex
                }
                dealIndex({
                    type: 'dealTrend',
                    dataType: sendDecryData
                }, function (val) {
                    var resData = []
                    var res = val.value
                    res.uvPrice = []
                    res.searchRate = []
                    res.cangRate = []
                    res.buyRate = []
                    res.payItemCnt = decryData.payItemCnt
                    var eDateArr = getDateRange(nowTime);
                    var tableDateArr = getDateRange(nowTime);
                    for (var i = 0; i < 30; i++) {
                        var obj = {}
                        obj.order = i + 1;
                        obj.date = tableDateArr[i]
                        obj.tradeIndex = res.tradeIndex[i] == '超出范围,请使用插件最高支持7.8亿' ? '-' : res.tradeIndex[i]
                        obj.uvIndex = res.uvIndex[i]
                        var paybyr = res.payRateIndex[i] * res.uvIndex[i] / 100;
                        obj.payByr = isNaN(paybyr) ? '-' : Math.floor(paybyr);
                        obj.payRate = res.payRateIndex[i] + "%";
                        obj.kdPrice = formula(obj.tradeIndex, res.payItemCnt[i], 1)
                        obj.uvPrice = formula(obj.tradeIndex, res.uvIndex[i], 1)
                        obj.seIpv = res.seIpvUvHits[i]
                        obj.cltHit = res.cltHits[i]
                        obj.cartHit = res.cartHits[i]
                        obj.searRate = formula(res.seIpvUvHits[i], res.uvIndex[i], 2)
                        obj.scRate = formula(res.cltHits[i], res.uvIndex[i], 2)
                        obj.jgRate = formula(res.cartHits[i], res.uvIndex[i], 2)
                        //  echarts数据
                        res.uvPrice.push(obj.uvPrice);
                        res.searchRate.push(obj.searRate.slice(0, -1));
                        res.cangRate.push(obj.scRate.slice(0, -1));
                        res.buyRate.push(obj.jgRate.slice(0, -1));
                        resData.push(obj);
                    }
                    var cols = [{
                            data: 'order',
                            title: '序号',
                        },
                        {
                            data: 'date',
                            title: '日期',
                        },
                        {
                            data: 'uvIndex',
                            title: '访客人数',
                        }, {
                            data: 'seIpv',
                            title: '搜索人数',
                        },
                        {
                            data: 'searRate',
                            title: '搜索占比',
                        },
                        {
                            data: 'payByr',
                            title: '购买人数',
                        },
                        {
                            data: 'payRate',
                            title: '支付转化率',
                        },
                        {
                            data: 'cltHit',
                            title: '收藏人数',
                        },
                        {
                            data: 'scRate',
                            title: '收藏率',
                        },
                        {
                            data: 'cartHit',
                            title: '加购人数',
                        },
                        {
                            data: 'jgRate',
                            title: '加购率',
                        },
                        {
                            data: 'tradeIndex',
                            title: '交易金额',
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
                    if (hasWrap) {
                        tableInstance.clear();
                        tableInstance.rows.add(resData).draw()
                        echartsInstance.setOption({
                            series: [{
                                    data: res.uvIndex
                                },
                                {
                                    data: res.tradeIndex
                                },
                                {
                                    data: res.seIpvUvHits
                                },
                                {
                                    data: res.cltHits
                                },
                                {
                                    data: res.payRateIndex
                                },
                                {
                                    data: res.payItemCnt
                                },
                                {
                                    data: res.cartHits
                                },
                                {
                                    data: res.uvPrice
                                },
                                {
                                    data: res.searchRate
                                },
                                {
                                    data: res.cangRate
                                },
                                {
                                    data: res.payItemCnt
                                },
                                {
                                    data: res.buyRate
                                }
                            ]
                        })
                    } else {
                        domStructEchart({
                            data: resData,
                            cols: cols
                        }, eDateArr, res, titleDate)
                    }
                    localStorage.setItem(finalUrl, JSON.stringify({
                        tableData: resData,
                        tableClos: cols,
                        eData: res,
                        edate: eDateArr,
                        dateRange: titleDate
                    }))
                    LoadingPop()
                })
            }
        })
    // })
}
// 竞品解析-流量解析
 function competeFlowAnaly(rivalId, device) {
    LoadingPop('show')
    var nowTime = getCurrentTime();
    var dateRange = setDateRange(nowTime, 'day');
    var titleDate = dateRange.replace('|', '~');
    var localCateId = getFirstCateId();
    var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getFlowSource.json?device=" + device + "&cateId=" + localCateId + "&rivalItem1Id=" + rivalId + "&dateType=day&dateRange=" + dateRange + "&indexCode=uv&orderBy=uv&order=desc";
    var localData = localStorage.getItem(finalUrl);
    var hasWrap = $('.chaqz-wrapper').length
    if (localData) {
        var saveData = JSON.parse(localData)
        if (hasWrap) {
            var echartData = saveData.eData
            tableInstance.clear();
            tableInstance.rows.add(saveData.tableData).draw()
            echartsInstance.setOption({
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: saveData.edate
                },
                series: [{
                        data: echartData.uvIndex
                    },
                    {
                        data: echartData.payByr
                    },
                    {
                        data: echartData.payRate
                    },
                    {
                        data: echartData.tradeIndex
                    },
                    {
                        data: echartData.uvPrice
                    }
                ]
            })

        } else {
            domStructEchart({
                data: saveData.tableData,
                cols: saveData.tableClos
            }, saveData.edate, saveData.eData, saveData.dateRange, 1)
        }
        LoadingPop()
        return false;
    }
    var sessionKey = sessionStorage.getItem('transitId');
    // chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl,
            type: 'GET',
            headers: {
                "transit-id": sessionKey
            },
            error: function () {
                popTip('获取数据失败请重试！')
                LoadingPop()
            },
            success: function (res) {
                if (!res.data) {
                    popTip('数据获取失败，请重试！')
                    LoadingPop()
                    return false;
                }
                var decryData = JSON.parse(Decrypt(res.data));
                dealIndex({
                    type: 'singleCompete',
                    dataType: decryData
                }, function (val) {
                    var resData = []
                    var res = val.value
                    var len = res.payRate.length
                    var eDateArr = [];
                    res.uvPrice = [];
                    for (var i = 0; i < len; i++) {
                        var obj = {}
                        obj.order = i + 1;
                        obj.source = decryData[i].pageName ? decryData[i].pageName.value : '';
                        obj.tradeIndex = res.tradeIndex[i] == '超出范围,请使用插件最高支持7.8亿' ? '-' : res.tradeIndex[i];
                        obj.uvIndex = decryData[i].rivalItem1Uv ? decryData[i].rivalItem1Uv.value : '';
                        res.uvIndex[i] = obj.uvIndex;
                        obj.uvPrice = formula(obj.tradeIndex, obj.uvIndex, 1);
                        res.uvPrice[i] = obj.uvPrice;
                        obj.payByr = res.payByr[i];
                        obj.payRate = res.payRate[i] + "%";
                        eDateArr.push(obj.source);
                        resData.push(obj);
                    }
                    var cols = [{
                            data: 'order',
                            title: '序号',
                        },
                        {
                            data: 'source',
                            title: '流量来源',
                        },
                        {
                            data: 'uvIndex',
                            title: '访客数',
                        }, {
                            data: 'payByr',
                            title: '买家数',
                        },
                        {
                            data: 'payRate',
                            title: '转化率',
                        },
                        {
                            data: 'tradeIndex',
                            title: '交易金额',
                        },
                        {
                            data: 'uvPrice',
                            title: 'UV价值',
                        }
                    ];
                    if (hasWrap) {
                        tableInstance.clear();
                        tableInstance.rows.add(resData).draw()
                        echartsInstance.setOption({
                            xAxis: {
                                type: 'category',
                                boundaryGap: true,
                                data: eDateArr
                            },
                            series: [{
                                    data: res.uvIndex
                                },
                                {
                                    data: res.payByr
                                },
                                {
                                    data: res.payRate
                                },
                                {
                                    data: res.tradeIndex
                                },
                                {
                                    data: res.uvPrice
                                }
                            ]
                        })

                    } else {
                        domStructEchart({
                            data: resData,
                            cols: cols
                        }, eDateArr, res, titleDate, 1)
                    }
                    localStorage.setItem(finalUrl, JSON.stringify({
                        tableData: resData,
                        tableClos: cols,
                        eData: res,
                        edate: eDateArr,
                        dateRange: titleDate
                    }))
                    LoadingPop()
                })
            }
        })
    // })
}
// 竞品解析-关键词解析
 function competeKeywordAnaly(rivalId, device) {
    LoadingPop('show')
    var finalUrl = keywordUrl(rivalId, device);
    var titleDate = finalUrl.time.replace('|', '~');
    var localData = localStorage.getItem(finalUrl.url);
    var hasWrap = $('.chaqz-wrapper').length
    if (localData) {
        var saveData = JSON.parse(localData)
        if (hasWrap) {
            var echartData = saveData.eData
            tableInstance.clear();
            tableInstance.rows.add(saveData.tableData).draw()
            echartsInstance.setOption({
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: saveData.edate
                },
                series: [{
                        data: echartData.uvIndex
                    },
                    {
                        data: echartData.tradeIndex
                    },
                    {
                        data: echartData.payRate
                    }
                ]
            })

        } else {
            domStructEchart({
                data: saveData.tableData,
                cols: saveData.tableClos
            }, saveData.edate, saveData.eData, saveData.dateRange, 2)
        }
        LoadingPop()
        return false;
    }
    var sessionKey = sessionStorage.getItem('transitId');
    // chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl.url,
            type: 'GET',
            headers: {
                "transit-id": sessionKey
            },
            error: function () {
                popTip('获取数据失败请重试！')
                LoadingPop()
            },
            success: function (res) {
                var decryData = JSON.parse(Decrypt(res.data));
                var finalUrlTwo = keywordUrl(rivalId, device, 1)
                $.ajax({
                    url: finalUrlTwo.url,
                    type: 'GET',
                    headers: {
                        "transit-id": sessionKey
                    },
                    error: function () {
                        popTip('获取数据失败请重试！')
                        LoadingPop()
                    },
                    success: function (resTwo) {
                        var decryDataTwo = JSON.parse(Decrypt(resTwo.data));
                        var finaData = concatArr(decryData, decryDataTwo);
                        if (!finaData.length) {
                            popTip('获取数据失败，请重试！')
                            LoadingPop()
                            return false;
                        }
                        var indexData = [];
                        finaData.forEach(function (item) {
                            var indx = item.tradeIndex ? item.tradeIndex.value : 0;
                            indexData.push(indx)
                        })
                        var saveToke = localStorage.getItem('chaqz_token')
                        chrome.runtime.sendMessage({
                                key: "getData",
                                options: {
                                    url: BASE_URL + '/api/v1/plugin/flowFormula?type=2',
                                    type: "POST",
                                    contentType: "application/json,charset=utf-8",
                                    headers: {
                                        Authorization: "Bearer " + saveToke
                                    },
                                    data: JSON.stringify({
                                        exponent: indexData
                                    })
                                }
                            },
                            function (indexVal) {
                                indexVal = indexVal.data;
                                var inResData = [];
                                var inLen = indexVal.length;
                                var eDateArr = [];
                                var resDa = {
                                    tradeIndex: indexVal,
                                    uvIndex: [],
                                    payRate: []
                                }
                                for (var i = 0; i < inLen; i++) {
                                    var obj = {}
                                    obj.order = i + 1;
                                    obj.keywords = finaData[i].keyword ? finaData[i].keyword.value : '';
                                    obj.tradeIndex = indexVal[i];
                                    obj.platform = '淘宝';
                                    obj.uvIndex = finaData[i].uv ? finaData[i].uv.value : '';
                                    resDa.uvIndex[i] = obj.uvIndex;
                                    obj.payRate = formula(obj.tradeIndex, obj.uvIndex, 1);
                                    resDa.payRate[i] = obj.payRate;
                                    eDateArr.push(obj.keywords);
                                    inResData.push(obj);
                                }
                                var cols = [{
                                        data: 'order',
                                        title: '序号',
                                    },
                                    {
                                        data: 'keywords',
                                        title: '关键词',
                                    },
                                    {
                                        data: 'platform',
                                        title: '平台',
                                    },
                                    {
                                        data: 'uvIndex',
                                        title: '访客数',
                                    },
                                    {
                                        data: 'tradeIndex',
                                        title: '支付件数',
                                    },
                                    {
                                        data: 'payRate',
                                        title: '支付转化率',
                                    },
                                ];
                                if (hasWrap) {
                                    tableInstance.clear();
                                    tableInstance.rows.add(inResData).draw()
                                    echartsInstance.setOption({
                                        xAxis: {
                                            type: 'category',
                                            boundaryGap: true,
                                            data: eDateArr
                                        },
                                        series: [{
                                                data: resDa.uvIndex
                                            },
                                            {
                                                data: resDa.tradeIndex
                                            },
                                            {
                                                data: resDa.payRate
                                            }
                                        ]
                                    })

                                } else {
                                    domStructEchart({
                                        data: inResData,
                                        cols: cols
                                    }, eDateArr, resDa, titleDate, 2)
                                }
                                localStorage.setItem(finalUrl, JSON.stringify({
                                    tableData: inResData,
                                    tableClos: cols,
                                    eData: resDa,
                                    edate: eDateArr,
                                    dateRange: titleDate
                                }))
                                LoadingPop()
                            })
                    }
                })
            }
        })
    // })
}