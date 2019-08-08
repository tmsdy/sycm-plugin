import {
    getCurrentTime,
    setDateRange,
    getFirstCateId,
    getSearchParams,
    filterLocalData,
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
var competeType = '';
var rootWordSaveKey = '';
var COUNTER = 0;
var personDone = false;//人群搜索结束
var ztcDone = false;//直通车结束
// 判断是否有没有处理的词根模块的数据
searchPeople()
/** ----展现面板 ----*/
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
    var option = '';
    if (chartType == 1) {
         option = {
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
         option = {
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
    } else if (competeType=='cross') {
         option = {
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
            yAxis: [
                {
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
                }, 
                {
                    type: 'value',
                    show: false,
                }, 
                {
                    type: 'value',
                    show: false,
                }],
            series: [
                {
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
                    name: '转化率（%）',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.payRateIndex
                },
                {
                    name: 'uv价值',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 1,
                    data: edata.uvPrice
                },
                {
                    name: '买家数',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: edata.payByr
                },
                {
                    name: '客单价',
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 0,
                    data: edata.kdPrice
                },
            ]
        };
    } else {
         option = {
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
    var weightData = eData.weight;
    var filterWeight = operatWeight(weightData);
    var wrapper = '<div class="chaqz-wrapper weight-pop"><div class="content"><div class="cha-box"><div class="parsing-title">竞品权重解析</div><div class="weight-parsing"><div class="left"><div class="head-info"><img src="' + info.pic + '" alt="pic"><div class="name"><p>' + info.title + '</p><span class="price">' + info.priceRange + '</span></div></div><div id="chaqzx-echarts-wrap"></div></div><div class="right"><div class="scores"><p class="sorce-head">本次权重得分</p><p class="dScore"></p><p class="moreShop">超过市场' + eData.rank + '%商品</p></div><div class="proposal"><div class="propos-title">优化方案</div><ul class="prompt-list">' + filterWeight.promtHtml + '</ul></div></div></div></div><span class="chaqz-close">×</span></div></div>'
    $('#app').append(wrapper)
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
    // var filterData = filterWeight.filterData;
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
                    max: weightData.payRateIndex.max_index
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
            data: [
                {
                value: [weightData.uvIndex.log, weightData.payItemCnt.log, weightData.payRateIndex.log, weightData.cltHits.log, weightData.cartHits.log, weightData.seIpvUvHits.log]
            }]
        }]
    };
    myChart.setOption(option);
    LoadingPop()
}
// 处理权重返回数据
function operatWeight(weightData) {
    // var filterData = {};
    var sortList = [];
    for (var key in weightData) { //大于1
        var obj = {};
        // var curNum = weightData[key] > 1 ? 100 : (weightData[key]*100).toFixed(2);
        // filterData[key] = curNum;
        obj.name = key;
        obj.value = weightData[key].log;
        sortList.push(obj);
    }
    var sortEndList = rootwordSort(sortList);
    var typeName = {
        seIpvUvHits: '搜索',
        payRateIndex: '坑产',
        cartHits: '加购率',
        cltHits: '收藏率',
        uvIndex: '流量',
        payItemCnt: '客群',
    }
    var promtHtml = '';
    for (let j = 0; j < 2; j++) {
        var proKey = sortEndList[5 - j].name;
        var name = typeName[proKey];
        var url = 'payItemCnt,payRateIndex'.indexOf(proKey) == -1 ? 'http://www.liuliang120.com/homePage/mainPage' : 'http://www.renwu188.com/';
        promtHtml += '<li><span>宝贝' + name + '低于行业优秀，建议</span><a href="' + url + '" target="_blank"><button>优化</button></li></a>';
    }
    return {
        promtHtml: promtHtml
    }
}
// 词根数据解析
function domStructRootWord(data, rootType) {
    var switchType = '<button class="switchBtn active switchRoot">词根数据分析</button><button class="switchBtn switchRoot">词根人群分析</button><button class="switchBtn switchRoot">人群词根选词</button>';
    var title = '分析结果';
    var chqzWrap = $('.chaqz-wrapper').length;
    if (!chqzWrap) {
        var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="chaqz-top-tabs">' + switchType + '</div><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span></div></div><div class="chaqz-echarts-wrap"></div><div class="table-box rootword-table"><table id="chaqz-table-trend" class="trend-table"></table></div></div><span class="chaqz-close">×</span></div></div>'
        $('#app').append(wrapper)
    }
    if (tableInstance) {
        tableInstance.destroy();
        $('#chaqz-table-trend').empty();
    }
        tableInstance = $('#chaqz-table-trend').DataTable({
            data: data.data,
            columns: data.cols,
            // "scrollX": true,
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
    if (rootType) {
        var echartDom = '<div id="chaqzx-echarts-wrap"></div>';
        $('.chaqz-wrapper .chaqz-echarts-wrap').append(echartDom);
        echartsInstance = echarts.init(document.getElementById('chaqzx-echarts-wrap'));
        var echartData = data.data[0];
        var showTitle = echartData.keyword;
        var option = {
             title: {
                 text: '选中词根：' + showTitle,
                 left: 30
             },
            tooltip: {
                trigger: 'axis'
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
                data: echartData.echrtData.eCate
            },
            yAxis: [{
                type: 'value',
            }, ],
            series: [{
                name: '数值',
                type: 'bar',
                data: echartData.echrtData.eData
            }]
        };
        echartsInstance.setOption(option);
        $('#chaqz-table-trend tbody tr').eq(0).addClass('bstr');
        $('#chaqz-table-trend tbody').on('click', 'tr', function () {
            var trIndex = $(this).index();
            $(this).addClass('bstr').siblings().removeClass('bstr');
            var changeEchartData = data.data[trIndex];
            var selectShowTitle = changeEchartData.keyword;
            var trSetOption = {
                 title: {
                     text: '选中词根：' + selectShowTitle,
                     left: 30
                 },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    axisLabel: {
                        rotate: -45
                    },
                    data: changeEchartData.echrtData.eCate
                },
                series: [{
                    name: '数值',
                    type: 'bar',
                    data: changeEchartData.echrtData.eData
                }]
            }
            echartsInstance.setOption(trSetOption);
        })
    } else {
        $('#chaqzx-echarts-wrap').remove();
    }
    LoadingPop();
    textLoading('', 'hide');
}
/*------触发方法点击类-----*/
 // 竞品解析-切换是否夸类目-关键词项显影
 $(document).on('click', '.chaqz-info-wrapper .cross-btn', function () {
      if ($(this).hasClass('hasCross')) {
          return false;
      }
      var _index = $(this).index();
      if (_index){
          popTip('正在升级中，敬请期待')
          return false;
      }
      $(this).addClass('hasCross').siblings().removeClass('hasCross');
       competeType = !_index ? 'all' : 'cross';
    //   if (!_index){
    //     $('.chaqz-info-wrapper .analyBtn').eq(2).removeClass('hide-btn');
    //     $('.chaqz-info-wrapper .analyBtn').eq(1).removeClass('hide-btn');
    //     $('.chaqz-info-wrapper .bot-tips').removeClass('hide-btn');
    //   }else{
    //       $('.chaqz-info-wrapper .analyBtn').eq(2).addClass('hide-btn');
    //       $('.chaqz-info-wrapper .analyBtn').eq(1).addClass('hide-btn');
    //       $('.chaqz-info-wrapper .bot-tips').addClass('hide-btn');
    //   }
 })
 // 竞品解析-切换终端-数据解析
 $(document).on('click', '.chaqz-wrapper .switchData', function () {
     if ($(this).hasClass('active')) {
         return false;
     }
     var btnArr = [0, 2, 1];
     var btnIndex = $(this).index();
     $(this).addClass('active').siblings().removeClass('active');
     competeDataAnaly(competeSelectId, btnArr[btnIndex],competeType);
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
            competeDataAnaly(isPassReg, 0, competeType);
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
    //  暂时使用获取token
     isOverTimeToken(isPassReg, tips)
    //  var saveToke = localStorage.getItem('chaqz_token')
    //  chrome.runtime.sendMessage({
    //      key: 'getData',
    //      options: {
    //          url: BASE_URL + '/py/api/v1/item?id=' + isPassReg,
    //          type: "GET",
    //          headers: {
    //              Authorization: "Bearer " + saveToke
    //          }
    //      }
    //  }, function (val) {
    //      if (val.code == 200) {
    //          var localCateId = getFirstCateId();
    //          var resCateId = val.data.rootCategoryId;
    //          if (localCateId != resCateId) {
    //              tips.html('校验失败,仅支持同类目商品！<a class="contactService">请联系客服</a>')
    //              $('.chaqz-info-wrapper.pop .good-tips').addClass('alert');
    //              LoadingPop();
    //              return false
    //          }
    //          var itemInfo = {
    //              pic: val.data.images[0],
    //              title: val.data.title,
    //              priceRange: '￥' + val.data.min_price + "~￥" + val.data.max_price
    //          }
    //          weightParsing(isPassReg, val.data.categoryId, itemInfo,localCateId);
    //      } else if (val.code == 2030) {
    //          LogOut();
    //          LoadingPop();
    //      } else {
    //          tips.html('校验失败！<a class="contactService">请联系客服</a>')
    //          $('.chaqz-info-wrapper.pop .good-tips').addClass('alert');
    //          LoadingPop();
    //      }
    //  })
 })
 function isOverTimeToken(isPassReg) {
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
             weightParsing(isPassReg, val.data.categoryId, itemInfo, localCateId);
         } else if (val.code == 2030) {
            setIntRefreshToken(isOverTimeToken(isPassReg, tips))
            //  LogOut();
            //  LoadingPop();
         } else {
             tips.html('校验失败！<a class="contactService">请联系客服</a>')
             $('.chaqz-info-wrapper.pop .good-tips').addClass('alert');
             LoadingPop();
         }
     })
 }
 function setIntRefreshToken(cb) {
     var curToken = localStorage.getItem('chaqz_token');
     chrome.runtime.sendMessage({
         key: "getData",
         options: {
             url: BASE_URL + '/api/v1/user/Retoken',
             type: "POST",
             contentType: 'application/json',
             data: JSON.stringify({
                 token: curToken
             }),
         }
     }, function (val) {
          if (val.code != 200) {
              LogOut();
              LoadingPop();
              return false;
          }
         var token = val.data.token;
         localStorage.setItem('chaqz_token', token);
         var curTime = new Date().getTime();
         var saveToke = {
             expiration: curTime + val.data.expires * 1000,
             token: token
         }
         chrome.storage.local.set({
             'chaqz_token': saveToke
         }, function () {});
         cb && cb()
     })
 }
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
 // 词根解析标签切换
 $(document).on('click', '.chaqz-wrapper .chaqz-top-tabs .switchRoot', function () {
     LoadingPop('show');
     var curIndex = $(this).index();
     if ($(this).hasClass('active')) {
         return false;
     }
     $(this).addClass('active').siblings().removeClass('active');
     curIndex == 1 ? rootWordPerson() : curIndex == 2 ? personRootWord() : rootWordAnaly();
 })
// 词根搜索
$(document).on('click', '.op-mc-search-analyze-container .ebase-FaCommonFilter__left #search', function () {
    textLoading();
     if (!isNewVersion()) {
         textLoading('', 'hide')
         return false;
     };
    $('.op-mc-search-analyze-container .ebase-FaCommonFilter__root .oui-tab-switch .oui-tab-switch-item').eq(1).trigger('click');
    $('.op-mc-search-analyze-container .oui-card .oui-card-header-wrapper .oui-tab-switch-item:contains("相关搜索词")').trigger('click');
    var searchWord = $('.op-mc-search-analyze-container .op-cc-item-info .item-keyword').text().toLocaleLowerCase();
    var searchTime = $('.op-mc-search-analyze-container .oui-date-picker-current-date').text()
    var serDate = searchTime.split(' ')[1];
    var hasSaveData = sessionStorage.getItem(searchWord + '/' + serDate);
    if (hasSaveData){
        textLoading('','hide')
        rootWordSaveKey = searchWord + '/' + serDate;
        rootWordAnaly();
        return false;
    }
    relateWordDeal(searchWord, serDate)
})
// 获取相关数据
function relateWordDeal(searchWord, serDate) {
     // 防止没有cateID
    //  getShopCateId()
    var relateData = getLocalItemData('relatedWord', searchWord, 0);
    if (relateData){
        COUNTER = 0;
        $('.op-mc-search-analyze-container .oui-card .oui-card-header-wrapper .oui-tab-switch-item:contains("关联热词")').trigger('click');
        // 加载完成数据获取
        relateHotDeal(searchWord, serDate)
    }else{
        setTimeout(function(){
            if(COUNTER>20){
                textLoading('', 'hide');
                COUNTER=0;
                popTip('数据获取失败，请刷新重试！');
               return false;
            }
            COUNTER++
            relateWordDeal(searchWord, serDate)
        }, 500);
    }
}
function relateHotDeal(searchWord, serDate) {
    var _selfData = getLocalItemData('relatedHotWord', searchWord, 0); //关联热词数据
    if (_selfData) {
        COUNTER=0;
        // 获取相关词数据
        var relateData = getLocalItemData('relatedWord', searchWord, 0);
        if (!relateData) {
            textLoading('', 'hide')
            popTip('获取相关词失败，，请重试！');
            return false;
        }
        var needSearchWord = _selfData.slice(0, 10);
        var needSearchRela = relateData.slice(0, 10);
        var needSearAll = concantSearKey(needSearchWord, needSearchRela).allKeys;
        var searchFrist = needSearAll[0];
       
        // 告诉背景页开始执行了
        chrome.runtime.sendMessage({
            type: "chaqzRootWordStart"
        }, function (response) {})
        //  人群数据存取
        chrome.storage.local.set({
            chaqzRootWord: {
                keyword: searchWord,
                step: 0,
                tenKeyWords: needSearAll,
                tenKeySearch: {},
                allRelatedHotWord: _selfData,
                tenRelatedword: needSearchRela,
                saveDate: serDate
            }
        }, function () {
            var iframe = document.createElement('iframe');
            iframe.id = "chaqz_frame",
                iframe.style = "display:none;",
                iframe.name = "polling",
                iframe.src = 'https://sycm.taobao.com/mc/mq/search_customer?selfCustomerId=' + searchFrist;
            $('#app').append(iframe);
            // var urlBase = 'https://sycm.taobao.com/mc/mq/search_customer?selfCustomerId=' + searchFrist;
            // window.open(urlBase, "_blank")
        })
    } else {
        setTimeout(function () {
            if (COUNTER > 20) {
                popTip('数据获取失败，请刷新重试！');
                COUNTER = 0;
                return false;
            }
            COUNTER++
            relateHotDeal(searchWord, serDate)
        }, 300)
    }
}
 /*-------------方法类-------*/
// 权重解析
function findFirstItme(arr,type) {
    var firstItem = '';
    if (!arr.length) {
        return ''
    }
    var len = arr.length;
    var firNum = 0;
    var secNum = 0;
    for (var i = 0; i < len; i++) {
        if (type == 1) {
            firNum = arr[i].tradeIndex.value > firNum ? arr[i].tradeIndex.value : firNum;
            secNum = arr[i].payRateIndex.value > secNum ? arr[i].payRateIndex.value : secNum;
            // console.log(firNum,secNum)
        }else if(type == 2){
            firNum = arr[i].uvIndex.value > firNum ? arr[i].uvIndex.value : firNum;
            secNum = arr[i].seIpvUvHits.value > secNum ? arr[i].seIpvUvHits.value : secNum;
        }else{
            firNum = arr[i].cltHits.value > firNum ? arr[i].cltHits.value : firNum;
            secNum = arr[i].cartHits.value > secNum ? arr[i].cartHits.value : secNum;
        }
    }
    if(type==1){
        firstItem={
            tradeIndex: firNum,
            payRateIndex: secNum,
        }
    }else if(type == 2){
        firstItem = {
            uvIndex: firNum,
            seIpvUvHits: secNum,
        }
    }else{
        firstItem = {
            cltHits: firNum,
            cartHits: secNum,
        }
    }
    return firstItem;
}

// 方法
function concantSearKey(arr1, arr2) {
    var redArr = [];
    var arr2Names = [];
    var arr1Names = [];
    for (var j = 0; j < arr2.length; j++) {
        arr2Names.push(arr2[j].keyword)
    }
    for (var i = 0; i < arr1.length; i++) {
        var element = arr1[i];
        arr1Names.push(element.keyword);
        if (arr2Names.indexOf(element.keyword) == -1) {
            redArr.push(element.keyword);
        }
    }
    var res = {
        allKeys: redArr.concat(arr2Names),
        arr1: arr1Names,
        arr2: arr2Names
    }
    return res;
}
// request funs
function getHttpRquest(finalUrl,cb) {
     var sessionKey = sessionStorage.getItem('transitId');
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
                cb && cb(res)
        }
    })
}
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
/**=========================== table数据获取 ======================================= */
// 竞品解析-数据解析
 function competeDataAnaly(rivalId, device,type) {
    LoadingPop('show')
    var nowTime = getCurrentTime('moreDay');
    //  var dayRange = setDateRange(nowTime, 'day');
    var dateRange = setDateRange(nowTime);
    var titleDate = dateRange.replace('|', '~');
    var localCateId = getFirstCateId();
    var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreTrend.json?dateType=recent30&dateRange=" + dateRange + "&device=" + device + "&cateId=" + localCateId + "&rivalItem1Id=" + rivalId;
    // if(type=='cross'){
    //     finalUrl = 'https://sycm.taobao.com/mc/ci/item/trend.json?dateType=day&dateRange=' + dayRange + '&cateId=' + localCateId + '&itemId=' + rivalId + '&device=' + device + '&sellerType=-1&indexCode=uvIndex%2CpayRateIndex%2CtradeIndex%2CpayByrCntIndex'
    // }
    var localData = localStorage.getItem(finalUrl);
    var hasWrap = $('.chaqz-wrapper').length
    if (localData) {
        var saveData = JSON.parse(localData)
        if (hasWrap) {
            var echartData = saveData.eData
            tableInstance.clear();
            tableInstance.rows.add(saveData.tableData).draw()
            if (type == 'cross') {
                echartsInstance.setOption({
                    series: [{
                            data: echartData.uvIndex
                        },
                        {
                            data: echartData.tradeIndex
                        },
                        {
                            data: echartData.payRateIndex
                        },
                        {
                            data: echartData.uvPrice
                        },
                        {
                            data: echartData.payByr
                        },
                        {
                            data: echartData.kdPrice
                        },
                    ]
                })
            }else{
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
                }
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
                if (!res.data) {
                    popTip('暂不支持，请先将商品添加监控')
                    LoadingPop()
                    return false;
                }
                // var decryData =res.data.rivalItem1;
                var decryData = type == 'cross' ? JSON.parse(Decrypt(res.data)):JSON.parse(Decrypt(res.data)).rivalItem1;
                var sendDecryData = type == 'cross' ?{
                    payRateIndex: decryData.payRateIndex,
                    payByr: decryData.payByrCntIndex ? decryData.payByrCntIndex : [],
                    tradeIndex: decryData.tradeIndex,
                    uvIndex: decryData.uvIndex
                } :{
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
                    res.kdPrice = []
                    res.payByr = res.payByrCntIndex ? res.payByrCntIndex:[];
                    res.payItemCnt = decryData.payItemCnt;
                    var eDateArr = getDateRange(nowTime);
                    var tableDateArr = getDateRange(nowTime);
                    for (var i = 0; i < 30; i++) {
                        var obj = {}
                        obj.order = i + 1;
                        obj.date = tableDateArr[i]
                        obj.tradeIndex = res.tradeIndex[i];
                        obj.uvIndex = res.uvIndex[i];
                        obj.payRate = (res.payRateIndex[i]*100).toFixed(2) + "%";
                        obj.uvPrice = formula(obj.tradeIndex, res.uvIndex[i], 1)
                        if (type == 'cross'){
                            if (res.payByrCntIndex){
                                obj.payByr = res.payByrCntIndex[i];
                            }else{
                                obj.payByr = Math.floor(res.payRateIndex[i] * res.uvIndex[i] / 100);
                                 res.payByr.push(obj.payByr)
                            }
                            obj.kdPrice = formula(obj.tradeIndex, obj.payByr, 1);

                              //  echarts数据
                              res.kdPrice.push(obj.kdPrice);
                              res.uvPrice.push(obj.uvPrice);
                              resData.push(obj);
                              continue;
                        }
                        var paybyr = res.payRateIndex[i] * res.uvIndex[i];
                        obj.payByr = isNaN(paybyr) ? '-' : Math.floor(paybyr);
                        obj.kdPrice = formula(obj.tradeIndex, res.payItemCnt[i], 1)
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
                    var cols ='';
                    if (type == 'cross'){
                        cols = [{
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
                    }else{
                         cols = [
                            {
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
                    }
                    if (hasWrap) {
                        tableInstance.clear();
                        tableInstance.rows.add(resData).draw()
                        if(type == 'cross'){
                            echartsInstance.setOption({
                                 series: [{
                                         data: res.uvIndex
                                     },
                                     {
                                         data: res.tradeIndex
                                     },
                                     {
                                         data: res.payRateIndex
                                     },
                                     {
                                         data: res.uvPrice
                                     },
                                     {
                                         data: res.payByr
                                     },
                                     {
                                         data: res.kdPrice
                                     },
                                 ]
                            })
                        }else{
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
                        }
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
    var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getFlowSource.json?device=" + device + "&cateId=" + localCateId + "&selfItemId=" + rivalId + "&dateType=day&dateRange=" + dateRange + "&indexCode=uv&orderBy=uv&order=desc";
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
                    popTip('暂不支持，请先将商品添加监控')
                    LoadingPop()
                    return false;
                }
                // var decryData = res.data;
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
                        obj.uvIndex = decryData[i].selfItemUv ? decryData[i].selfItemUv.value : '';
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
                if (!res.data) {
                    popTip('暂不支持，请先将商品添加监控')
                    LoadingPop()
                    return false;
                }
                // var decryData = res.data;
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
                         if (!resTwo.data) {
                             popTip('暂不支持，请先将商品添加监控')
                             LoadingPop()
                             return false;
                         }
                        // var decryDataTwo = resTwo.data;
                        var decryDataTwo = JSON.parse(Decrypt(resTwo.data));
                        var finaData = concatArr(decryData, decryDataTwo);
                        var indexData = [];
                        finaData.forEach(function (item) {
                            var indx = item.tradeIndex ? item.tradeIndex.value : 0;
                            indexData.push(indx)
                        })
                        dealIndex({
                            type: 'dealTrend',
                            dataType: {
                                tradeIndex: indexData
                            }
                        },
                        function (indexVal) {
                        // })
                        // var saveToke = localStorage.getItem('chaqz_token')
                        // chrome.runtime.sendMessage({
                        //         key: "getData",
                        //         options: {
                        //             url: BASE_URL + '/api/v1/plugin/flowFormula?type=2',
                        //             type: "POST",
                        //             contentType: "application/json,charset=utf-8",
                        //             headers: {
                        //                 Authorization: "Bearer " + saveToke
                        //             },
                        //             data: JSON.stringify({
                        //                 exponent: indexData
                        //             })
                        //         }
                        //     },
                        //     function (indexVal) {
                                indexVal = indexVal.value.tradeIndex;
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
// 权重解析
function weightParsing(rivald, category, itemInfo, localCateId) {
    $('.chaqz-info-wrapper.pop').remove();
    var nowTime = getCurrentTime('moreDay');
    var dateRange = setDateRange(nowTime, 'recent7');
    var locaKey = 'rivald=' + rivald + '&dateRange=' + dateRange + '&cateId=' + localCateId;
    if(localStorage.getItem(locaKey)){
        var localData = JSON.parse(localStorage.getItem(locaKey))
        domStructweightPars(localData.itemInfo, localData.data);
        return false;
    }
    // var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreTrend.json?dateType=recent7&dateRange=" + dateRange + "&device=0&cateId=" + localCateId + "&rivalItem1Id=" + rivald;
    var finalUrl = 'https://sycm.taobao.com/mc/rivalItem/analysis/getCoreIndexes.json?dateType=recent7&dateRange=' + dateRange + '&device=0&cateId=' + localCateId + '&rivalItem1Id=' + rivald;
    itemInfo.locaKey = locaKey;
    getHttpRquest(finalUrl,function(res){
     if (!res.data) {
          popUp.init('goOperator');
         LoadingPop();
         return false;
     }
     var resData = JSON.parse(Decrypt(res.data)).rivalItem1;
    //  console.log('类目categroy', category)
    //  console.log('获取竞品自身数据', resData)
    getTopItem(category, itemInfo, localCateId, resData)
   })
}
// get top1 item info
function getTopItem(category, itemInfo, localCateId, selfCoreData) {
    var nowTime = getCurrentTime('moreDay');
    var dateRange = setDateRange(nowTime, 'recent7');
    var finalUrl = "https://sycm.taobao.com/mc/mq/mkt/rank/item/hotsale.json?dateRange=" + dateRange + "&dateType=recent7&pageSize=10&page=1&order=desc&orderBy=tradeIndex&cateId=" + category + "&device=0&sellerType=-1&indexCode=tradeIndex%2CtradeGrowthRange%2CpayRateIndex";
    getHttpRquest(finalUrl, function (res) {
        if (!res.data) {
            popTip('获取数据失败请重试')
            LoadingPop();
            return false;
        }
        var resHotsaleData = JSON.parse(Decrypt(res.data));
        var top1Item = findFirstItme(resHotsaleData,1);
        var hotSearchUrl = 'https://sycm.taobao.com/mc/mq/mkt/rank/item/hotsearch.json?dateRange=' + dateRange + '&dateType=recent7&pageSize=10&page=1&order=desc&orderBy=uvIndex&cateId=' + category + '&device=0&sellerType=-1&indexCode=uvIndex%2CseIpvUvHits%2CtradeIndex'
        getHttpRquest(hotSearchUrl, function (res2) {
            if (!res2.data) {
                popTip('获取数据失败请重试')
                LoadingPop();
                return false;
            }
            var hotsearData = JSON.parse(Decrypt(res2.data));
            var top2Item = findFirstItme(hotsearData,2);
             var hotPurposUrl = 'https://sycm.taobao.com/mc/mq/mkt/rank/item/hotpurpose.json?dateRange=' + dateRange + '&dateType=recent7&pageSize=10&page=1&order=desc&orderBy=cartHits&cateId=' + category + '&device=0&sellerType=-1&indexCode=cltHits%2CcartHits%2CtradeIndex';
             getHttpRquest(hotPurposUrl, function (res3) {
                 if (!res3.data) {
                     popTip('获取数据失败请重试')
                     LoadingPop();
                     return false;
                 }
                 var hotpurData = JSON.parse(Decrypt(res3.data));
                 var top3Item = findFirstItme(hotpurData);
                 var finalRes = Object.assign(top1Item, top2Item, top3Item)
                //  console.log('获取top商品数据', finalRes)
                 getCompareData(selfCoreData, finalRes,itemInfo)
             })
        })
    })
}
// 获取竞品数据
function getCompareData(resData, resultWrap, itemInfo) {
    dealIndex({
        type:'dealTrend',
        dataType: {
            seIpvUvHits: [resData.seIpvUvHits.value],
            cartHits: [resData.cartHits.value],
            payRateIndex: [resData.payRateIndex.value],
            uvIndex: [resData.uvIndex.value],
            cltHits: [resData.cltHits.value],
        }
    },function(val){
         dealIndex({
             type: 'dealTrend',
             dataType: {
                seIpvUvHits: [resultWrap.seIpvUvHits],
                payRateIndex: [resultWrap.payRateIndex],
                tradeIndex: [resultWrap.tradeIndex],
                uvIndex: [resultWrap.uvIndex],
                cartHits: [resultWrap.cartHits],
                cltHits: [resultWrap.cltHits]
             }
         }, function (val2) {
            var requestData = {};
            requestData.selfItem={
                seIpvUvHits: val.value.seIpvUvHits[0],
                uvIndex: val.value.uvIndex[0],
                cltHits: val.value.cltHits[0],
                cartHits: val.value.cartHits[0],
                payItemCnt: resData.payItemCnt.value,
                // tradeIndex: val.value.tradeIndex,
                payRateIndex: val.value.payRateIndex[0]
            }
            requestData.item={
                seIpvUvHits: val2.value.seIpvUvHits[0],
                uvIndex: val2.value.uvIndex[0],
                cltHits: val2.value.cltHits[0],
                cartHits: val2.value.cartHits[0],
                payItemCnt: Math.floor(val2.value.uvIndex[0] * val2.value.payRateIndex[0]),
                payRateIndex: val2.value.payRateIndex[0],
                // tradeIndex: val2.value.tradeIndex
            }
            requestData.topItem = '';
            requestData.version = '1.0';
            //  console.log('出到后台数据', requestData)

            // 过期刷新获取新token
            getWeightResult(requestData, itemInfo)
            // var saveToke = localStorage.getItem('chaqz_token')
            // chrome.runtime.sendMessage({
            //     key: 'getData',
            //     options: {
            //         url: BASE_URL + '/py/api/v1/weight',
            //         type: 'POST',
            //         headers: {
            //             Authorization: "Bearer " + saveToke
            //         },
            //         data: JSON.stringify(requestData),
            //         contentType: "application/json,charset=utf-8",
            //     }
            // }, function (val3) {
            //     if (val3.code == 200) {
            //         localStorage.setItem(itemInfo.locaKey, JSON.stringify({
            //             itemInfo:itemInfo,
            //             data: val3.data
            //         }))
            //         domStructweightPars(itemInfo, val3.data)
            //         // console.log('接收后台处理数据', val3.data)
            //     } else if (val3.code == 2030) {
            //         LogOut()
            //     } else {
            //         popTip('解析失败');
            //     }
            //     $('.chaqz-info-wrapper.pop').hide();
            //     LoadingPop();
            // })
         })
    })
}
function getWeightResult(requestData, itemInfo) {
     var saveToke = localStorage.getItem('chaqz_token')
     chrome.runtime.sendMessage({
         key: 'getData',
         options: {
             url: BASE_URL + '/py/api/v1/weight',
             type: 'POST',
             headers: {
                 Authorization: "Bearer " + saveToke
             },
             data: JSON.stringify(requestData),
             contentType: "application/json,charset=utf-8",
         }
     }, function (val3) {
         if (val3.code == 200) {
             localStorage.setItem(itemInfo.locaKey, JSON.stringify({
                 itemInfo: itemInfo,
                 data: val3.data
             }))
             domStructweightPars(itemInfo, val3.data)
             // console.log('接收后台处理数据', val3.data)
         } else if (val3.code == 2030) {
             setIntRefreshToken(getWeightResult(requestData, itemInfo))
            //  LogOut()
         } else {
             popTip('解析失败');
         }
         $('.chaqz-info-wrapper.pop').hide();
         LoadingPop();
     })
}
/*----------词根分析----------*/
//  词根分析展示
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'chaqzWordHasDone') {
        if (request.cont.type == 'personSear' && request.cont.hasDone) {
            personDone = request.cont.hasDone;
        }
        if (request.cont.type == 'ztcSear') {
            ztcDone = request.cont.hasZTCDone;
            $('#chaqz_frame').remove();
        } else if (request.cont.type == 'ztcBreak'){
             chrome.storage.local.set({
                         ztcAreaData: {
                             ISFINSH:true
                         }
                     }, function () {})
             chrome.storage.local.set({
                         chaqzRootWord: {
                             hasDone: true
                         }
                     }, function () {})
            popTip('获取数据失败，请刷新重试！');
             $('#chaqz_frame').remove();
            textLoading('', 'hide');
        }
        if (request.cont.text) {
            textLoading(request.cont.text + '，获取数据中，请稍等…');
        }
        if (personDone && ztcDone) {
            // 重置结果
            personDone = false;
            ztcDone = false;
            // session 存储数据
           chrome.storage.local.get(['chaqzRootWord', 'ztcAreaData'], function (val) {
               var chaqzRoot = val.chaqzRootWord;
               var chaqzZtc = val.ztcAreaData;
               var searchWord = chaqzRoot.keyword;
               var searchDate = chaqzRoot.saveDate;
               chaqzRoot.ztcData = chaqzZtc.tenKeySearch;
               rootWordSaveKey = searchWord + '/' + searchDate;
               sessionStorage.setItem(rootWordSaveKey, JSON.stringify(chaqzRoot));
               rootWordAnaly(chaqzRoot);
           })
        } 
       
    } else if (request.type == 'parsing'){
        if (!isNewVersion()) {
            return false
        };
        popUp.init('competingGoodsAnalysis')
    } else if (request.type == 'weightParsing') {
         if (!isNewVersion()) {
             return false
         };
         popUp.init('competingTopAnalysis')
    } else if (request.type == 'gokeyRight') {
        window.open('https://sycm.taobao.com/mc/ci/item/analysis','_self')
    } 
    sendResponse();
    return true
});
// 获取搜索人群
function searchPeople() {
    var curUrl = window.location.href;
    var isSearchPeo = curUrl.indexOf('https://sycm.taobao.com/mc/mq/search_customer') > -1;
    if (!(self.frameElement && self.frameElement.tagName == "IFRAME")) {
        return false;
    }
    if (!isSearchPeo) {
        return false;
    }
    chrome.storage.local.get('chaqzRootWord', function (valueArray) {
        var baseDa = valueArray.chaqzRootWord;
        if (!baseDa || baseDa.hasDone) {
            LoadingPop();
            return false
        }
        var curStep = baseDa.step;
        var totalLength = baseDa.tenKeyWords.length;
        textLoading(curStep + '/' + totalLength)
        var recentDom = $(".mc-searchCustomer .oui-date-picker .oui-canary-btn:contains('30天')");
        var radioDom = $("#completeShopPortrait .mc-SearchCustomerPortrait .ant-radio-wrapper");
        if (!recentDom.length || !radioDom.length) {
            setTimeout(function () {
                 if (COUNTER > 10) {
                     COUNTER=0;
                    window.location.reload();
                     return false;
                 }
                 COUNTER++;
                searchPeople();
            }, 500);
            return
        }
        $(".mc-searchCustomer .oui-date-picker .oui-canary-btn:contains('30天')").click()
        $("#completeShopPortrait .mc-SearchCustomerPortrait .ant-radio-wrapper").eq(2).click()
        
        var opWord = baseDa.tenKeyWords[curStep];
        baseDa.step = curStep + 1;
        if (baseDa.step > totalLength) {
            baseDa.hasDone = true;
            chrome.storage.local.set({
                chaqzRootWord: baseDa
            }, function () {
            })
            chrome.runtime.sendMessage({
                type: 'chaqzRootWordEnd',
                cont:{
                    hasDone:true,
                    type: 'personSear'
                }
            }, function () {
            })
             //  直通车数据存取
             chrome.storage.local.set({
                 ztcAreaData: {
                     keyword: baseDa.keyword,
                     step: 0,
                     tenKeyWords: baseDa.tenKeyWords,
                     tenKeySearch: {}
                 }
             }, function () {
                 var searchFrist = baseDa.tenKeyWords[0];
                 var urlBase = 'https://subway.simba.taobao.com/#!/tools/insight/queryresult?kws=' + searchFrist + '&tab=tabs-region';
                 window.open(urlBase, "_self")
                 //  var iframe = document.createElement('iframe');
                 //  iframe.id = "chaqz_ztc_frame",
                 //      iframe.style = "display:none;",
                 //      iframe.name = "ztc_polling",
                 //      iframe.src = 'https://subway.simba.taobao.com/#!/tools/insight/queryresult?kws=' + searchFrist + '&tab=tabs-region';
                 //  $('#app').append(iframe);
             })
            // window.close();
            return  false;
        }
        var nextSearchKey = baseDa.tenKeyWords[curStep + 1]; //下一个搜索词
        checkLoaded(opWord, nextSearchKey, baseDa)
    })

}

function checkLoaded(opWord, nextSearchKey, searchData) {
    // 判断加载完成
    var needType = ['gender', 'age', 'career']; //种类
    var pushItem = {}; //暂存数据
    var isAll = true;
    for (let i = 0; i < needType.length; i++) {
        var SearchData = getLocalItemData('popularity', opWord, needType[i]);
        if (!SearchData) {
            isAll = false;
            break;
        }
        pushItem[needType[i]] = SearchData;
    }
    if (!isAll) {
        setTimeout(function () {
             if (COUNTER > 10) {
                 COUNTER = 0;
                 window.location.reload();
                 return false;
             }
             COUNTER++;
            checkLoaded(opWord, nextSearchKey, searchData)
        }, 300)
        return false;
    }
    searchData.tenKeySearch[opWord] = pushItem;
    chrome.storage.local.set({
        chaqzRootWord: searchData
    }, function () {
        var curStepPro = searchData.step + '/' + (searchData.tenKeyWords.length+1);
        chrome.runtime.sendMessage({
            type: 'chaqzRootWordEnd',
            cont: {
                text: curStepPro,
                type: 'personSear'
            }
        }, function () {})
        // 重新刷新
        var urlBase = 'https://sycm.taobao.com/mc/mq/search_customer?selfCustomerId=' + nextSearchKey;
        window.open(urlBase, "_self")
    })
}

function getLocalItemData(keyword, opWord, type) {
    opWord = opWord ? opWord.toLocaleLowerCase() : '';
    var opWord = type ? (opWord + '||') : opWord;
    // var _selfCarceer = getSearchParams(keyword, 1, 10, 0, {
    //     keyword: opWord,
    //     attrType: type
    // })
    var localCarceer = getSearchParams(keyword, 1, 10, 1, {
        keyword: opWord,
        attrType: type
    })
    // var SearchCarData = localStorage.getItem(_selfCarceer);
    var SearchCarLocal = localStorage.getItem(localCarceer);
    // var res = SearchCarData || filterLocalData(SearchCarLocal);
    var res = filterLocalData(SearchCarLocal);
    res = res ? JSON.parse(res) : '';
    return res;
}
// 词根分析
function rootWordAnaly(sendData) {
    // chrome.storage.local.get('chaqzRootWord', function (val) {
        var chaqzRoot = sendData ? sendData : JSON.parse(sessionStorage.getItem(rootWordSaveKey));
        // var chaqzRoot = val.chaqzRootWord;
        var relateWord = chaqzRoot.allRelatedHotWord;
        var relateLength = relateWord.length;
        var relateSeI = getRelateSeiUv(relateWord);
        var counter = 0;
        var res = [];
        termialWord(relateLength, counter, relateSeI, res, relateWord)
    // })
}

function termialWord(relateLength, counter, relateSeI, res, relateWord) {
    var start = counter * 100;
    var end = (counter + 1) * 100;
    if (start < relateLength) {
        var sendData = relateSeI.slice(start, end);
        dealIndex({
            type: 'dealTrend',
            dataType: {
                uvIndex: sendData
            }
        }, function (val) {
            res = res.concat(val.value.uvIndex);
            termialWord(relateLength, counter + 1, relateSeI, res, relateWord);

        })
    } else {
        relateRootData(res, relateWord)
    }

}

function getRelateSeiUv(val) {
    if (!val) {
        return ''
    }
    var len = val.length;
    var res = [];
    for (let i = 0; i < len; i++) {
        const element = val[i];
        res.push(element.clickHits)
    }
    return res;
}

function relateRootData(resVal, orginData) {
    var resData = [];
    var length = resVal.length;
    for (var i = 0; i < length; i++) {
        var obj = {};
        obj.root = orginData[i].keyword;
        obj.relate = orginData[i].relSeWordCnt;
        obj.cliCount = resVal[i];
        obj.trade = (orginData[i].p4pAmt && orginData[i].avgWordPayRate) ? Math.ceil(resVal[i] * orginData[i].avgWordPayRate * orginData[i].p4pAmt) : '-';
        obj.payRate = orginData[i].avgWordPayRate ? Math.floor(orginData[i].avgWordPayRate * 100) + '%' : '-';
        obj.orders = orginData[i].avgWordPayRate ? Math.ceil(resVal[i] * orginData[i].avgWordPayRate) : '-';
        obj.avgPrice = orginData[i].p4pAmt ? Math.round(orginData[i].p4pAmt) : '-';
        resData.push(obj)
    }
    var cols = [{
            data: 'root',
            title: '词根',
        },
        {
            data: 'relate',
            title: '相关词数',
        },
        {
            data: 'cliCount',
            title: '点击量',
        },
        {
            data: 'trade',
            title: '交易额',
        },
        {
            data: 'payRate',
            title: '支付转化率',
        },
        {
            data: 'orders',
            title: '订单量',
        },
        {
            data: 'avgPrice',
            title: '平均客单价',
        },
    ];
    domStructRootWord({
        data: resData,
        cols: cols
    })
}
// 词根人群分析
function rootWordPerson(sendData) {
    // chrome.storage.local.get('chaqzRootWord', function (val) {
        var chaqzRoot = sendData ? sendData : JSON.parse(sessionStorage.getItem(rootWordSaveKey));
        // var chaqzRoot = val.chaqzRootWord;
        var relateWord = chaqzRoot.allRelatedHotWord;
        var tenRelateWord = relateWord.slice(0, 10); //热词前十
        var personSear = chaqzRoot.tenKeySearch; //人群搜索所有词的数据
        var areaTop = chaqzRoot.ztcData; //直通车的数据
        var dealData = dealRootPerson(tenRelateWord, personSear,areaTop,1)
        var cols = [{
                data: 'keyword',
                title: '词根',
            },
            {
                data: 'sexOne',
                title: '流量最大性别',
            },
            {
                data: 'ageOne',
                title: '流量最大年龄',
            },
            {
                data: 'cerOne',
                title: '流量最大职业',
            },
            {
                data: 'sexTwo',
                title: '流量第二大性别',
            },
            {
                data: 'ageTwo',
                title: '流量第二大年龄',
            },
            {
                data: 'cerTwo',
                title: '流量第二大职业',
            },
            {
                data: 'ztcAreaTen',
                title: '流量地域前十',
            }
        ];
        domStructRootWord({
            data: dealData,
            cols: cols
        }, 1)
    // })
}

function dealRootPerson(tenWord, minxData, areaTop,type) {
    // var ageItem = minxData.age;
    var len = tenWord.length;
    var resData = [];
    for (let i = 0; i < len; i++) {
        var objItem = {}
        const elemKey = tenWord[i].keyword;
        // 处理年龄，职业，性别的数据,并且排序完成
        var agePar = [0, 0, '18~24', '25~29', '30~34', '35~39', '40~49', '>=50']
        var allItem = minxData[elemKey];
        var ageItem = allItem.age ? rootwordSort(allItem.age[elemKey].dataList) : [];
        ageItem.map(function (item) {
            if (item) {
                item.stage = agePar[item.key]
            }
        })
        var careerItem = allItem.career ? rootwordSort(allItem.career[elemKey].dataList) : [];
        var genderItem = allItem.gender ? rootwordSort(allItem.gender[elemKey].dataList) : [];
        objItem.keyword = elemKey;
        objItem.sexOne = genderItem[0] ? genderItem[0].key : '-';
        objItem.ageOne = ageItem[0] ? ageItem[0].stage : '-';
        objItem.cerOne = careerItem[0] ? careerItem[0].key : '-';
        objItem.sexTwo = genderItem[1] ? genderItem[1].key : '-';
        objItem.ageTwo = ageItem[1] ? ageItem[1].stage : '-';
        objItem.cerTwo = careerItem[1] ? careerItem[1].key : '-';
        objItem.ztcAreaTen = areaTop[elemKey] ? areaTop[elemKey].areaInfo.join(',') : '';
        if (type) {
         objItem.echrtData = getEchartsData(genderItem.concat(ageItem, careerItem));
        }
        resData.push(objItem)
    }
    return resData;

}

function getEchartsData(val) {
    if (!val.length) {
        return []
    };
    var eCate = [];
    var eData = [];
    val.forEach(function (item) {
        if (item.stage) {
            eCate.push(item.stage);
        } else {
            eCate.push(item.key);
        }
        eData.push(item.value);
    })
    return {
        eCate: eCate,
        eData: eData
    }
}

function rootwordSort(data) {
    if (!data) {
        return []
    }
    var arr = data;
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j].value < arr[j + 1].value) {
                var temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr;
}
// 人群翅根选词
function personRootWord(sendData) {
    // chrome.storage.local.get('chaqzRootWord', function (val) {
        var chaqzRoot = sendData ? sendData : JSON.parse(sessionStorage.getItem(rootWordSaveKey));
        // var chaqzRoot = val.chaqzRootWord;
        var relateWord = chaqzRoot.tenRelatedword;
        var relateFilter = getRelateIndex(relateWord);
        var areaTop = chaqzRoot.ztcData; //直通车的数据
        var personSearchData = dealRootPerson(relateWord, chaqzRoot.tenKeySearch, areaTop);
        dealIndex({
            type: 'dealTrend',
            dataType: relateFilter
        }, function (val) {
            var dealData = [];
            var tranTrade = val.value.tradeIndex;
            var tranUv = val.value.tradeIndex;
            var reLength = relateWord.length;
            for (let i = 0; i < reLength; i++) {
                var obj = {};
                obj.keyword = relateWord[i].keyword;
                obj.clcikCount = tranUv[i];
                obj.trande = tranTrade[i];
                obj.payrate = relateWord[i].payConvRate ? (relateWord[i].payConvRate * 100).toFixed(2) + '%' : "-";
                obj.onShop = relateWord[i].onlineGoodsCnt;
                obj.orders = relateWord[i].payConvRate ? Math.ceil(tranUv[i] * relateWord[i].payConvRate) : '-';
                obj.avguv = relateWord[i].p4pAmt ? (relateWord[i].p4pAmt * 1).toFixed(2) : "-";
                obj.sexOne = personSearchData[i].sexOne;
                obj.ageOne = personSearchData[i].ageOne;
                obj.cerOne = personSearchData[i].cerOne;
                obj.sexTwo = personSearchData[i].sexTwo;
                obj.ageTwo = personSearchData[i].ageTwo;
                obj.cerTwo = personSearchData[i].cerTwo;
                obj.ztcAreaTen = personSearchData[i].ztcAreaTen;
                 var deviceData = areaTop[obj.keyword] ? areaTop[obj.keyword].device : [];
                //  if (deviceData[0]) {
                     var webData = deviceData[1];
                     var pcData = deviceData[0];
                     obj.webShowRate = webData ? webData.impressionRate ? (webData.impressionRate / 100).toFixed(1) + '%' : '-' : '-';
                     obj.webShowIndex = webData ? webData.impression ? webData.impression : '-' : '-';
                     obj.webClickIndex = webData ? webData.click ? webData.click : '-' : '-';
                     obj.webClickRate = webData ? webData.ctr ? (webData.ctr / 100).toFixed(1) + '%' : '-' : '-';
                     obj.webClickPayrate = webData ? webData.cvr ? (webData.cvr / 100).toFixed(1) + '%' : '-' : '-';
                     obj.webOrderIndex =  webData ? (webData.click&&webData.cvr) ? Math.ceil(webData.click*webData.cvr / 100) : '-': '-';
                     obj.webAvg = webData ? webData.avgPrice ? "￥" + (webData.avgPrice / 100) : '-' : '-';
                     obj.webCom = webData ? webData.competition ? webData.competition : '-' : '-';
                     // pc
                     obj.pcShowRate = pcData? pcData.impressionRate ? (pcData.impressionRate / 100).toFixed(1) + '%' : '-': '-';
                     obj.pcShowIndex = pcData ? pcData.impression ? pcData.impression : '-' : '-';
                     obj.pcClickIndex = pcData ? pcData.click ? pcData.click : '-' : '-';
                     obj.pcClickRate = pcData ? pcData.ctr ? (pcData.ctr / 100).toFixed(1) + '%' : '-' : '-';
                     obj.pcClickPayrate = pcData ? pcData.cvr ? (pcData.cvr / 100).toFixed(1) + '%' : '-' : '-';
                     obj.pcOrderIndex = pcData ? (pcData.click && pcData.cvr) ? Math.ceil(pcData.click * pcData.cvr / 100) : '-' : '-';
                     obj.pcAvg = pcData ? pcData.avgPrice ? "￥" + (pcData.avgPrice / 100) : '-' : '-';
                     obj.pcCom = pcData ? pcData.competition ? pcData.competition : '-' : '-';
                //  }
                dealData.push(obj)
            }
            var cols = [
                {
                    data: 'keyword',
                    title: '关键词',
                },
                {
                    data: 'clcikCount',
                    title: '点击量',
                },
                {
                    data: 'trande',
                    title: '交易额',
                },
                {
                    data: 'payrate',
                    title: '支付转化率',
                },
                {
                    data: 'onShop',
                    title: '在线商品数',
                },
                {
                    data: 'orders',
                    title: '订单量',
                },
                {
                    data: 'avguv',
                    title: '平均客单价',
                },
                {
                    data: 'webShowRate',
                    title: '移动端展现占比',
                }, 
                {
                    data: 'webShowIndex',
                    title: '移动端展现指数',
                }, 
                {
                    data: 'webClickIndex',
                    title: '移动端点击指数',
                }, 
                {
                    data: 'webClickRate',
                    title: '移动端点击率',
                }, 
                {
                    data: 'webClickPayrate',
                    title: '移动端点击转化率',
                }, 
                {
                    data: 'webAvg',
                    title: '移动端市场均价',
                }, 
                {
                    data: 'webOrderIndex',
                    title: '移动端订单指数',
                }, 
                {
                    data: 'webCom',
                    title: '移动端竞争度',
                }, 
                {
                    data: 'pcShowRate',
                    title: 'PC端展现占比',
                }, 
                {
                    data: 'pcShowIndex',
                    title: 'PC端展现指数',
                }, 
                {
                    data: 'pcClickIndex',
                    title: 'PC端点击指数',
                }, 
                {
                    data: 'pcClickRate',
                    title: 'PC端点击率',
                }, 
                {
                    data: 'pcClickPayrate',
                    title: 'PC端点击转化率',
                }, 
                {
                    data: 'pcAvg',
                    title: 'PC端市场均价',
                }, 
                {
                    data: 'pcOrderIndex',
                    title: 'PC端订单指数',
                }, 
                {
                    data: 'pcCom',
                    title: 'PC端竞争度',
                },
                {
                    data: 'sexOne',
                    title: '性别订单最大标签',
                }, 
                {
                    data: 'ageOne',
                    title: '年龄订单最大标签',
                },
                {
                    data: 'cerOne',
                    title: '职业订单最大标签',
                }, 
                {
                    data: 'sexTwo',
                    title: '性别第二大标签',
                }, 
                {
                    data: 'ageTwo',
                    title: '年龄第二大标签',
                }, 
                {
                    data: 'cerTwo',
                    title: '职业第二大标签',
                },
                {
                    data: 'ztcAreaTen',
                    title: '地域订单前10名标签',
                }
            ];
            domStructRootWord({
                data: dealData,
                cols: cols
            })

        })
    // })
}

function getRelateIndex(data) {
    var obj = {
        tradeIndex: [],
        uvIndex: []
    }
    if (data) {
        data.forEach((item) => {
            obj.tradeIndex.push(item.tradeIndex)
            obj.uvIndex.push(item.clickHits)
        });
        return obj
    }
}
// loading
function textLoading(text, statu) {
    if (statu) {
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

// 一键加权 
