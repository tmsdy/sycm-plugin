var indexTypes = {
    payRate: {
        type: 1,
        value: []
    },
    tradeIndex: {
        type: 2,
        value: []
    },
    payByr: {
        type: 3,
        value: []
    },
    uvIndex: {
        type: 4,
        value: []
    },
    seIpv: {
        type: 5,
        value: []
    },
    cartHit: {
        type: 6,
        value: []
    },
    cltHit: {
        type: 7,
        value: []
    }
};
var requestNum = 0;
var responseData = {
    payRate: [],
    tradeIndex: [],
    payByr: [],
    uvIndex: [],
    seIpv: [],
    cartHit: [],
    cltHit: []
};
var dataWrapper = {
    'monitShop': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc(\/live\/|\/)ci\/shop\/monitor\/listShop\.json',
        data: []
    },
    'monitFood': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc(\/live\/|\/)ci\/item\/monitor\/list\.json',
        data: {}
    },
    'monitCompareFood': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/rivalItem\/analysis\/get(LiveCore|Core)Indexes.json',
        data: []
    },
    'monitResource': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/rivalItem\/analysis\/get(LiveFlow|Flow)Source.json',
        data: []
    },
    'marketShop': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc(\/live\/|\/)ci\/shop\/monitor\/list\.json',
        data: []
    },
    'marketHotShop': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/mq\/monitor\/cate(.*?)\/showTopShops\.json',
        data: []
    },
    'marketHotFood': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/mq\/monitor\/cate(.*?)\/showTopItems\.json',
        data: []
    },
    'shopInfo': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/custom\/menu\/getPersonalView\.json',
        data: []
    },
    'compareSelfList': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/rivalShop\/recommend\/item\.json',
        data: []
    },
    'getMonitoredList': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/ci\/config\/rival\/item\/getMonitoredList\.json',
        data: []
    },
    'getKeywords': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/rivalItem\/analysis\/getKeywords\.json',
        data: []
    },
    'hotsale': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/mq\/mkt\/rank\/(shop|item|brand)\/hotsale\.json',
        data: []
    },
    'hotsearch': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/mq\/mkt\/rank(.*?)hotsearch\.json',
        data: []
    },
    'hotpurpose': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/mq\/mkt\/rank\/item\/hotpurpose\.json',
        data: []
    },
    'trendShop': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/ci\/config\/rival\/(shop|item|brand)\/getSingleMonitoredInfo\.json',
        data: []
    },
    'allTrend': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/ci\/(shop|item|brand)\/trend\.json',
        data: []
    },
    "currentDate": {
        urlReg: 'https:\/\/sycm\.taobao\.com\/ipoll\/activity\/getCurrentTime\.json'
    }
}
var tableInstance = null;  
var echartsInstance = null;  
var competeSelectId = 0;
var isLogin = false;
var VERSION = '1.0.5'; 
var BASE_URL = 'http://116.62.18.166:8090';
// var BASE_URL = 'http://www.chaquanzhong.com';
var SAVE_MEMBER = {};
var SAVE_BIND = {};
var PLAN_LIST = [];
var updataTime = '';
chrome.runtime.sendMessage({
    type: 'hello',
    fitlerArr: dataWrapper
}, function (response) { });
chrome.storage.local.get('chaqz_token', function (valueArray) {
    var tok = valueArray.chaqz_token;
    if (tok) {
        localStorage.setItem('chaqz_token', tok);
        isLogin = true;
    } else {
        isLogin = false;
    }
});
clearLocalstorage();
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'secahKeywords') {
        getCookie(request.keywords, sendResponse);
    }
    return true
});

$(function () {
    $(document).on('click', '#loginbtn', function () {
        anyDom.init();
        return false
    });
    userInfoRes();
    $(document).on('click', '#userBtn', function () {
        anyDom.getInfo();
        return false
    });
    updataTime = getTimeNode();
    competePop()
    $('#app').on('DOMNodeInserted', function (e) {
        if (e.target.className == 'oui-index-picker') {
            $('.mc-shopMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
        }
        if (e.target.className == 'oui-index-picker-group') {
            $('.mc-ItemMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
        }
        if (e.target.id == 'itemAnalysisTrend') {
            $('.op-mc-item-analysis #itemAnalysisTrend .oui-card-header').append(showBtn())
        }
        if (e.target.id == 'sycm-mc-flow-analysis') {
            $('.sycm-mc-flow-analysis .oui-card-header').append(showBtn())
        }
        if (e.target.className == 'mc-marketMonitor') {
            $('.mc-marketMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
        }
        if (e.target.className == 'tree-menu common-menu tree-scroll-menu-level-2') {
            $('.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right').prepend(showBtn())
        }
        if (e.target.className == 'industry-tab-index') {
            $('.op-mc-market-rank-container  .oui-card-header-wrapper .oui-card-header').append(showBtn())
        }
        if (e.target.className == 'oui-index-picker-group') {
            if ($('.op-mc-market-rank-container .oui-card-header .chaqz-btns').length > 0) {
                return false
            }
            $('.op-mc-market-rank-container .oui-card-header').append(showBtn())
        }
    });
    $(document).on('click', '#parsing', function () {
         if (!isNewVersion()) {
             return false
         };
        popUp.init('competingGoodsAnalysis')
    });
    $(document).on('click', '#weightParsing', function () {
         if (!isNewVersion()) {
             return false
         };
        popUp.init('competingTopAnalysis')
    });
    $(document).on('click', '.mc-shopMonitor #search', function () {
        if (!isNewVersion()) {
            return false
        }
        dealIndex({
            type: 'monitShop'
        }, function (resData) {
            var cols = [{
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
            ];
            domStruct({
                data: resData,
                cols: cols
            }, '监控店铺')
        })
    });
    $(document).on('click', '.mc-ItemMonitor #search', function () {
        if (!isNewVersion()) {
            return false
        }
        MonitorItem('page')
    });
    $(document).on('click', '#itemAnalysisTrend .oui-card-header #search', function () {
        if (!isNewVersion()) {
            return false
        }
        var productInfo = getProductInfo();
        if (productInfo.totalNum < 2) {
            alert('请选择比较商品');
            return false
        };
        var idParams = getproduceIds(productInfo);
        var fontKey = getSearchParams('monitCompareFood').split('&page')[0];
        var fontKey = getSearchParams('monitCompareFood').split('&page')[0];
        var fact = $('#itemAnalysisTrend .ant-select-selection-selected-value').attr('title');
        var device = fact == '所有终端' ? '0' : fact == 'PC端' ? '1' : fact == '无线端' ? '2' : '';
        dealIndex({
            type: 'monitCompareFood',
            dataType: fontKey + device + idParams
        },
            function (res) {
                var resData = []
                var length = productInfo.totalNum
                for (var i = 0; i < length; i++) {
                    var obj = {
                        shop: {}
                    }
                    obj.shop = {
                        url: i == 0 ? productInfo.selfItem.imgurl : productInfo["rivalItem" + (i)].imgurl ? productInfo["rivalItem" + (i)].imgurl : productInfo["rivalItem" + (i + 1)].imgurl,
                        title: i == 0 ? productInfo.selfItem.title : productInfo["rivalItem" + (i)].title ? productInfo["rivalItem" + (i)].title : productInfo["rivalItem" + (i + 1)].title
                    }
                    obj.name = {}
                    obj.name = i == 0 ? {
                        name: '本店竞品',
                        class: ''
                    } :
                        productInfo["rivalItem" + (i)].title ? {
                            name: ('竞品' + i),
                            class: 'red'
                        } : {
                                name: ('竞品' + (i + 1)),
                                class: 'red'
                            };
                    var rateNum = Number(res.payRate[i]);
                    var isNumber = isNaN(rateNum);
                    obj.tradeIndex = Math.round(res.tradeIndex[i]);
                    obj.uvIndex = Math.round(res.uvIndex[i]);
                    obj.payRate = !isNumber ? (rateNum.toFixed(2) + '%') : "-";
                    obj.payByr = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num1;
                    obj.kdPrice = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num2;
                    obj.uvPrice = formula(res.tradeIndex[i], res.uvIndex[i], 1);
                    resData.push(obj)
                }
                if (resData.length > 2) {
                    resData.splice(2, 0, resData[0])
                }

                var cols = [{
                    data: 'name',
                    title: '类别',
                    render: function (data, type, row, meta) {
                        return '<p class="btn ' + data.class + '">' + data.name + '</p>';
                    }
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
                }, '关键词指标对比')
            })
    });
    $(document).on('click', '#sycm-mc-flow-analysis .oui-card-header #search', function () {
        if (!isNewVersion()) {
            return false
        }
        var productInfo = getProductInfo();
        if (productInfo.ispass) {
            alert('请选择比较商品');
            return false;
        };
        var idParams = getproduceIds(productInfo);
        var fontKey = getSearchParams('monitResource').split('&page')[0];
        var fontKey = getSearchParams('monitResource').split('&page')[0];
        var fact = $('#sycm-mc-flow-analysis .ant-select-selection-selected-value').attr('title');
        var device = fact == '所有终端' ? '0' : fact == 'PC端' ? '1' : fact == '无线端' ? '2' : '';
        dealIndex({
            type: 'monitResource',
            dataType: fontKey + device + idParams
        }, function (val) {
            var findRes = val.value
            var finaData = val.final
            var productId = val.ids
            var Length = findRes['selfItem']['payRate'].length
            var resData = []
            for (var i = 0; i < Length; i++) {
                var itemAcct = productInfo.totalNum
                var wItem = itemAcct == 2 ? findRes['rivalItem1'] ? 'rivalItem1' : 'rivalItem2' : ''
                for (var j = 0; j < itemAcct; j++) {
                    var obj = {
                        shop: {}
                    }
                    obj.shop = {
                        url: j == 0 ? productInfo.selfItem.imgurl : itemAcct == 3 ? productInfo['rivalItem' + j].imgurl : productInfo[wItem].imgurl,
                        title: j == 0 ? productInfo.selfItem.title : itemAcct == 3 ? productInfo['rivalItem' + j].title : productInfo[wItem].title
                    }
                    obj.name = {}
                    obj.name = j == 0 ? {
                        name: '本店竞品',
                        class: ''
                    } : itemAcct == 3 ? {
                        name: ('竞品' + j),
                        class: 'red'
                    } : {
                                name: ('竞品' + wItem.slice(-1)),
                                class: 'red'
                            };
                    var selfId = j == 0 ? productId.selfItemId : itemAcct == 3 ? productId['rivalItem' + j + 'Id'] : productId[wItem + 'Id'];
                    obj.cateRank = selfId ? selfId : '-';
                    obj.pageName = finaData[i].pageName ? finaData[i].pageName.value : '-';
                    var tradeIndex = j == 0 ? findRes.selfItem.tradeIndex[i] : itemAcct == 3 ? findRes['rivalItem' + j].tradeIndex[i] : findRes[wItem].tradeIndex[i];
                    var payByr = j == 0 ? findRes.selfItem.payByr[i] : itemAcct == 3 ? findRes['rivalItem' + j].payByr[i] : findRes[wItem].payByr[i];
                    var uv = j == 0 ? findRes.selfItem.uvIndex[i] : itemAcct == 3 ? findRes['rivalItem' + j].uvIndex[i] : findRes[wItem].uvIndex[i];
                    var payRate = j == 0 ? findRes.selfItem.payRate[i] : itemAcct == 3 ? findRes['rivalItem' + j].payRate[i] : findRes[wItem].payRate[i];
                    obj.tradeIndex = Math.round(tradeIndex)
                    obj.uvIndex = uv ? Math.round(uv) : '-'
                    obj.payRate = payRate.toFixed(2) + '%'
                    obj.payByr = Math.round(payByr)
                    obj.kdPrice = formula(delePoint(tradeIndex), delePoint(payByr), 1)
                    obj.uvPrice = formula(delePoint(tradeIndex), delePoint(uv), 1)
                    resData.push(obj)
                }
            }
            var cols = [{
                data: 'name',
                title: '类别',
                render: function (data, type, row, meta) {
                    return '<p class="btn ' + data.class + '">' + data.name + '</p>';
                }
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

        })
        // }
    })
    $(document).on('click', '.chaqz-close', function () {
        $('.chaqz-wrapper .content').removeClass('small')
        $('.chaqz-wrapper').remove()
        tableInstance = null;
        echartsInstance = null;
    })
    $(document).on('click', '#vesting', function () {
        var reg = /https:\/\/sycm\.taobao\.com\/mc\/ci\/item\/analysis/;
        var currentUrl = window.location.href
        var matchUrl = reg.test(currentUrl)
        if (!matchUrl) {
            popUp.init('goChoose')
            return false
        }
        if (!isNewVersion()) {
            return false
        }
        var productInfo = getProductInfo()
        if ((productInfo.rivalItem1.title && productInfo.rivalItem2.title) || (!productInfo.rivalItem1.title && !productInfo.rivalItem2.title)) {
            popUp.init('onlyOne')
            return false
        }
        var saveToke = localStorage.getItem('chaqz_token')
        chrome.runtime.sendMessage({
            key: 'getData',
            options: {
                url: BASE_URL + '/api/v1/plugin/planData',
                type: "GET",
                headers: {
                    Authorization: "Bearer " + saveToke
                }
            },
        }, function (val) {
            if (val.code == 200) {
                popUp.init("selectPlan", val.data)
                PLAN_LIST = val.data
            } else if (val.code == 4001) {
                popUp.init("selectPlan")
            } else if (val.code == 2030) {
                LogOut()
            } else {
                popTip('获取计划列表失败，请重试')
            }
        })
    })
    $(document).on('click', '.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item', function () {
        if ($(this).index() == 2) {
            $('.mc-marketMonitor #search').hide()
        } else {
            $('.mc-marketMonitor #search').show()
        }
    })
    $(document).on('click', '.op-mc-market-monitor-industryCard .oui-tab-switch .oui-tab-switch-item', function () {
        if ($(this).index() == 2) {
            $('.op-mc-market-monitor-industryCard #search').hide()
        } else {
            $('.op-mc-market-monitor-industryCard #search').show()
        }
    })
    $(document).on('click', '.mc-marketMonitor #search', function () {
        if (!isNewVersion()) {
            return false
        }
        marketMonitorShop("page")
    })
    $(document).on('click', '.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right #search', function () {
        if (!isNewVersion()) {
            return false
        }
        marketMonitorItem('pageType')
    })
    $(document).on('click', '.op-mc-market-rank-container #search', function () {
         if (!isNewVersion()) {
             return false
         }
        marketRank('pagetype')
    })
    $(document).on('click', '.op-mc-market-rank-container .alife-dt-card-common-table-right-column', function (e) {
        if (!isLogin) {
            return false;
        }
        var maskWrap = $('.ant-modal-mask:not(.ant-modal-mask-hidden)').siblings('.ant-modal-wrap')
        var maskHead = maskWrap.find('.ant-modal-header')
        var chooseList = $('.op-mc-market-rank-container .op-ebase-switch .ebase-Switch__activeItem').index()
        var switchType = chooseList == 1 ? 'item' : chooseList == 2 ? 'brand' : 'shop'
        if ($(maskHead).find('.serachBtn').length) {
            return false
        }
        $(maskHead).append('<div class="chaqz-btns btnsItem1 trend"><button id="search" class="serachBtn">一键转化</button></div>')
        var useIdDom = $(maskWrap).find('.op-mc-rival-trend-analysis').attr('id')
        var useArr = useIdDom ? useIdDom.split('-') : ''
        var useId = useArr[useArr.length - 1]
        $(maskHead).find('#search').click(function () {
            LoadingPop('show')
            var trendFont = getSearchParams("allTrend", null, null, 'type')
            var trendKey = switchType + '/' + trendFont + '&userId=' + useId
            var firstCateId = getFirstCateId()
            var shopInfoKey = switchType + "/trendShopcateId=" + firstCateId + '&userId=' + useId
            var shopInfo = JSON.parse(localStorage.getItem(shopInfoKey))
            var localTrendData = JSON.parse(localStorage.getItem(trendKey))
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
                    if (chooseList) {
                        obj.seIpv = res.seIpvUvHits[i]
                        obj.cltHit = res.cltHits[i]
                        obj.cartHit = res.cartHits[i]
                        obj.searRate = formula(res.seIpvUvHits[i], res.uvIndex[i], 2)
                        obj.scRate = formula(res.cltHits[i], res.uvIndex[i], 2)
                        obj.jgRate = formula(res.cartHits[i], res.uvIndex[i], 2)
                    }
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
                if (chooseList) {
                    cols = [{
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

                domStructTrend({
                    data: resData,
                    cols: cols
                }, shopInfo, eDateArr, res)
            })
        })
    })
    $(document).on('click', '.chaqz-wrapper .switchData', function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        var btnArr = [0, 2, 1];
        var btnIndex = $(this).index();
        $(this).addClass('active').siblings().removeClass('active')
        competeDataAnaly(competeSelectId, btnArr[btnIndex])
    })
    $(document).on('click', '.chaqz-wrapper .switchFlow', function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        var btnArr = [0, 2, 1];
        var btnIndex = $(this).index() + 1;
        $(this).addClass('active').siblings().removeClass('active')
        competeFlowAnaly(competeSelectId, btnArr[btnIndex])
    })
    $(document).on('click', '.chaqz-wrapper .switchKey', function () {
        if ($(this).hasClass('active')) {
            return false;
        }
        var btnArr = [0, 2, 1];
        var btnIndex = $(this).index() + 1;
        $(this).addClass('active').siblings().removeClass('active')
        competeKeywordAnaly(competeSelectId, btnArr[btnIndex])
    })
})
function domStruct(data, title) {
    var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
    var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span></div></div>'
    $('#app').append(wrapper)
    $('#chaqz-table').DataTable({
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
        if (type == 1) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.mc-marketMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            var titleType = title == '监控店铺' ? 'marketShop' : 'monitFood'
            var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize)
            var hasSave = localStorage.getItem(localKey)
            if (hasSave) {
                listenShop()
            } else {
                chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                    if (request.type = 'holdup') {
                        var reg1 = new RegExp(dataWrapper['marketShop'])
                        var reg2 = new RegExp(dataWrapper['monitFood'])
                        if (reg1.test(request.url) || reg2.test(request.url)) {
                            listenShop()
                        }
                    }
                });
            }
        } else if (type == 2) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            var titleType = title == '热门店铺' ? 'marketHotShop' : 'marketHotFood'
            var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize)
            var hasSave = localStorage.getItem(localKey)
            if (hasSave) {
                marketMonitorItem()
            } else {
                chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                    if (request.type = 'holdup') {
                        var reg1 = new RegExp(dataWrapper['marketHotShop'])
                        var reg2 = new RegExp(dataWrapper['marketHotFood'])
                        if (reg1.test(request.url) || reg2.test(request.url)) {
                            marketMonitorItem()
                        }
                    }
                });
            }

        } else if (type == 3) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('#mqItemMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            var localKey = getSearchParams('monitFood', (info.page + 1), data.paging.pageSize)
            var hasSave = localStorage.getItem(localKey)
            if (hasSave) {
                MonitorItem()
            } else {
                chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                    if (request.type = 'holdup') {
                        var reg = new RegExp(dataWrapper['monitFood'])
                        if (reg.test(request.url)) {
                            MonitorItem()
                        }
                    }
                });
            }
        } else if (type == 4) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            marketRank()
        }
    })
    $('.chaqz-wrapper').fadeIn(100);
}
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
            step: function (a, b) {
                $(this).html(parseInt(b.pos * eData.combat));
            }
        });
    var weightData = eData.weight
    var myChart = echarts.init(document.getElementById('chaqzx-echarts-wrap'));
    option = {
        grid: {
            top: "10%",
        },
        tooltip: {},
        radar: {
            name: {
                textStyle: {
                    color: '#888',
                    fontSize: 14
                }
            },
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
            },]
        }]
    };
    myChart.setOption(option);
    LoadingPop()
}
var anyDom = {
    loginDom: '<div class="chaqz-info-wrapper login"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><div class="formList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><div class="phone"><input id="phone" type="text" placeholder="请输入手机号码"><p class="tips">请输入手机号码</p></div><div class="pwd"><input id="pwd" type="password" placeholder="请输入登录密码"><p class="tips">请输入登录密码</p></div><div class="router"><a href="' + BASE_URL + '/reg" class="right" target="_blank">免费注册</a><a href="' + BASE_URL + '/findP" target="_blank">忘记密码</a></div><button class="orange-default-btn login-btn">登录</button></div></div></div>',
    infoDom: function (memInfo, bindedInfo) {
        var acct = memInfo.username;
        var title = memInfo.member.title;
        var expirTime = memInfo.member.expireAt;
        var whetherOrder = '';
        var binded = '未绑定';
        var shopInfo = dealShopInfo();
        if (title && expirTime) {
            var formDate = new Date(expirTime)
            var isExpire = formDate - memInfo.time * 1000
            if (isExpire > 0) {
                whetherOrder = '续费';
            } else {
                whetherOrder = '订购';
            }
            bindedInfo.data.forEach(function (item) {
                if (item['mainUid'] = shopInfo['mainUserId']) {
                    binded = "已绑定"
                }
            })
        } else {
            title = '普通会员';
            expirTime = '--';
            whetherOrder = '订购'
            binded = '未绑定'
        }
        var wrap = '<div class="chaqz-info-wrapper user"><div class="c-cont"><span class="close2 hided">×</span><div class="help"><img src="https://file.cdn.chaquanzhong.com/wenhao.png" alt="?"><a href="' + BASE_URL + '/pluginIntro" target="_blank">帮助</a></div><div class="infoList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><ul class="user-list"><li><span class="name">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:</span><span>' + acct + '</span><span class="fr" id="logout">退出登录</span></li><li><span class="name">会员信息:</span><span>' + title + '</span></li><li><span class="name">到期时间:</span><span>' + expirTime + '</span><a href="' + BASE_URL + '/homePage?from=plugin" target="_blank" class="fr">' + whetherOrder + '</a></li><li><span class="name">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span><span>' + VERSION + '</span></li><li><span class="name">联系客服:</span><span><a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><img class="mr_10" src="https://file.cdn.chaquanzhong.com/qq_icon.png" alt="qq"></a><img src="https://file.cdn.chaquanzhong.com/wx_icon.png" alt="wx" class="wxpop"></span></li><li><span class="name">店铺绑定</span><span>' + binded + '</span></li></ul></div></div></div>';
        $('#app').append(wrap);

    },
    login: function () {
        var onLoading = false;
        var _that = this
        var user = $('.chaqz-info-wrapper #phone').val()
        var pwd = $('.chaqz-info-wrapper #pwd').val()
        if (!user || !pwd || onLoading) {
            return false
        }
        chrome.runtime.sendMessage({
            key: "getData",
            options: {
                url: BASE_URL + '/api/v1/user/login',
                type: "POST",
                data: JSON.stringify({
                    phone: user,
                    password: pwd
                }),
                contentType: "application/json,charset=utf-8",
            }
        }, function (val) {
            if (val.code == 200) {
                $('.chaqz-info-wrapper').remove();
                var member = val.data;
                var token = val.data.token;
                localStorage.setItem('chaqz_token', token);
                SAVE_MEMBER = member
                chrome.storage.local.set({
                    'chaqz_token': token
                }, function () { });
                isLogin = true;
                _that.getShopBind()
                changeLoginStatus()
                $('.chaqz-info-wrapper.login').remove();
            } else {
                $('.chaqz-info-wrapper.login .pwd .tips').text('账号或密码错误').show()
                onLoading = false
            }
        })
    },
    init: function () {
        var _that = this
        $('#app').append(this.loginDom);
        $(document).on('blur', '.chaqz-info-wrapper #phone', function () {
            var phoneVal = $(this).val()
            var phoneReg = /^1[34578]\d{9}$/;
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
        $(document).on('click', '.chaqz-info-wrapper .login-btn', function () {
            _that.login()
        })
        $('.chaqz-info-wrapper #pwd').bind('keydown', function (event) {
            var evt = window.event || event;
            if (evt.keyCode == 13) {
                _that.login()
            }
        });
        $(document).on('click', '.chaqz-info-wrapper .hided', function () {
            $('.chaqz-info-wrapper.login').remove()
        })
    },
    getShopBind: function () {
        var saveToke = localStorage.getItem('chaqz_token')
        chrome.runtime.sendMessage({
            key: 'getData',
            options: {
                url: BASE_URL + '/api/v1/plugin/shop',
                type: 'GET',
                headers: {
                    Authorization: "Bearer " + saveToke
                }
            }
        }, function (val) {
            if (val.code == 200) {
                var bindInfo = val.data
                SAVE_BIND = bindInfo
            } else if (val.code == 2030) {
                LogOut()
            }
        })
    },
    getInfo: function () {
        var userWrap = $('.chaqz-info-wrapper.user')
        if (userWrap.length) {
            userWrap.show()
        } else {
            var memInfo = SAVE_MEMBER;
            var bindInfo = SAVE_BIND;
            if (memInfo.token) {
                this.infoDom(memInfo, bindInfo)
            } else {
                popUp.init('noShopInfo')
            }
            $(document).on('click', '.chaqz-info-wrapper .hided', function () {
                $('.chaqz-info-wrapper.user').hide()
            })
            $(document).on('click', '#logout', function () {
                $('.chaqz-info-wrapper.user').hide();
                changeLoginStatus('out')
                chrome.storage.local.clear(function () { });
                localStorage.removeItem('chaqz_token')

            })
            $(document).on('click', '.chaqz-info-wrapper.user .wxpop', function () {
                $('.chaqz-info-wrapper.user').hide()
                popUp.init('weixin')
            })
        }
    }
}
function showBtn() {
    var reDom = '';
    if (isLogin) {
        reDom = '<div class="chaqz-btns btnsItem1"><button id="userBtn" class="serachBtn user">用户信息</button><button id="search" class="serachBtn">一键转化</button><button id="vesting" class="serachBtn vesting">一键加权</button><div>';
    } else {
        reDom = '<div class="chaqz-btns btnsItem1"><button id="loginbtn" class="serachBtn user">登录</button><div>'
    }
    return reDom
}
function competePop() {
    var url = window.location.href;
    if (url.indexOf('https://sycm.taobao.com/custom/login.htm') != -1) {
        $('.chaqz-compete-wrap').remove();
        return false;
    }
    if (isLogin) {
        $('body').append('<div class="chaqz-compete-wrap"><div class="head"><img src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png" alt=""></div><div class="content" id="parsing"><img src="https://file.cdn.chaquanzhong.com/plugin-compete-analy.png" alt=""></div><div class="footer" id="weightParsing"><img src="https://file.cdn.chaquanzhong.com/weightPars.png" alt=""></div></div>')
    } else {
        $('.chaqz-compete-wrap').remove();
    }
}
function changeLoginStatus(type) {
    if (type == 'out') {
        $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>');
        $('.chaqz-compete-wrap').remove();
    } else {
        $('.chaqz-btns').html('<button id="userBtn" class="serachBtn user">用户信息</button><button id="search" class="serachBtn">一键转化</button><button id="vesting" class="serachBtn vesting">一键加权</button>');
        $('body').append('<div class="chaqz-compete-wrap"><div class="head"><img src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png" alt=""></div><div class="content" id="parsing"><img src="https://file.cdn.chaquanzhong.com/plugin-compete-analy.png" alt=""></div><div class="footer" id="weightParsing"><img src="https://file.cdn.chaquanzhong.com/weightPars.png" alt=""></div></div>')
    }
}
function isNewVersion() {
    if (CHAQZ_VERSION != LOCAL_VERSION) {
        popUp.init('version')
        return false
    }
    var allInfo = SAVE_MEMBER
    if (!allInfo) {
        popUp.init('noShopInfo');
        return false;
    }
    var memInfo = allInfo.member;
    var bindInfo = SAVE_BIND;
    var shopInfo = dealShopInfo();
    if (!memInfo.level) {
        popUp.init('orderMem')
        return false;
    }
    var star_time = allInfo.time;
    var star_end = memInfo.expireAt;
    var remian = new Date(star_end) - star_time * 1000;
    if (remian <= 0) {
        popUp.init('overdue')
        return false;
    }
    var hasBind = bindInfo.data.length;
    var totalBind = bindInfo.count;
    var isSelf = false
    var isClose = false
    var activeNum = 0
    bindInfo.data.forEach(function (item) {
        if (item['runShopId'] == shopInfo['runAsShopId']) {
            isSelf = true
            isClose = item['closed']
        }
        if (item['closed'] == 0) {
            activeNum++
        }
    })
    if (!isSelf) {
        if (hasBind < totalBind) {
            popUp.init('binding')
            return false
        }
        if (memInfo.level < 4) {
            popUp.init('upLimit')
            return false
        }
        popUp.init('bindLimit')
        return false
    }
    if (isClose == 0) {
        return true;
    }
    if (activeNum < totalBind) {
        popUp.init('active2')
        return false
    }
    if (memInfo.level < 4) {
        popUp.init('upLimit')
        return false
    }
    popUp.init('bindLimit')
    return false
}
function LogOut() {
    isLogin = false;
    changeLoginStatus('out');
    chrome.storage.local.clear(function () { });
    localStorage.removeItem('chaqz_token');
    $('.chaqz-compete-wrap').remove();
    LoadingPop()
}
var popUp = {
    version: '<p class="tips">当前插件已更新，请到官网下载最新版本。</p><div class="cha-btns"><a class="btn" href="' + BASE_URL + '/pluginIntro" target="_blank"><button class="btn">前往下载</button></a></div>',
    orderMem: '<p class="tips">账户未开通会员，请联系客服或订购会员。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><button class="btn">联系客服</button></a><button class="btn buyBtn">订购</button></div>',
    overdue: '<p class="tips">会员已过期，请重新订购。</p><div class="cha-btns"><button class="btn buyBtn">订购</button></div>',
    overdue2: '<p class="tips">登录账户未绑定本店铺，<br>如有疑问请联系客服。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes" ><button class="btn">联系客服</button></a><button class="btn hides">取消</button></div>',
    binding: '<p class="tips">店铺暂未绑定，是否绑定店铺？</p><div class="cha-btns"><button class="hides mr_30 btn">取消</button><button id="goBind" class="btn">绑定</button></div>',
    nonBind: '<p class="tips">店铺已绑定其余账户，<br>若非本人操作请联系客服。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes" ><button class="btn">联系客服</button></a><button class="btn hides">确定</button></div>',
    renewal: '<p class="tips"> 会员已过期， 为不影响正常使用，<br>请前往官网续费。</p><div class="cha-btns"><button class="cancel mr_30 btn">暂不处理</button><button class="btn">续费</button></div>',
    orderSucc: '<p class="tips">若订购成功请刷新。</p><div class="cha-btns"><button id="pageRefresh" class="btn">确定</button></div>',
    noShopInfo: '<p class="tips">未获取用户信息，请刷新页面重试。</p><div class="cha-btns"><button id="pageRefresh" class="btn">确定</button></div>',
    upLimit: '<p class="tips">该账户会员已达绑定上限，请升级会员。</p><div class="cha-btns"><button class="btn buyBtn">升级会员</button></div>',
    bindLimit: '<p class="tips">已达插件绑定上限，请联系客服。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes" ><button class="btn">联系客服</button></div>',
    weixin: '<p class="head">查权重客服很高兴为您服务</p><img src="https://file.cdn.chaquanzhong.com/wx_contact.jpg" alt="wx"><p class="foot">微信扫一扫 添加客服</p>',
    goChoose: '<p class="tips">请在竞品分析界面，选择目标竞品。</p><div class="cha-btns"><button class="btn hides">确定</button></div>',
    onlyOne: '<p class="tips">竞品选择有误，现仅支持单项竞品加权。</p><div class="cha-btns"><button class="btn hides">确定</button></div>',
    competingGoodsAnalysis: '<p class="head-title">竞品分析</p><div class="analy-goods"><input type="text" class="anayEditor selcet" placeholder="请输入url或者商品id"><p class="good-tips"></p></div><div class="cha-btns"><button class="btn analyBtn">数据解析</button><button class="btn analyBtn">流量解析</button><button class="btn analyBtn">关键词解析</button></div>',
    competingTopAnalysis: '<p class="head-title">权重解析</p><div class="analy-goods"><input type="text" class="anayEditor selcet" placeholder="请输入url或者商品id"><p class="good-tips"></p></div><div class="cha-btns"><button class="btn hides mr_30 cancel">取消</button><button class="btn analyBtn2">确定</button></div><p class="bot-tips">暂只支持同类目权重解析</p>',
    selectPlan: function (data) {
        var html = '';
        if (data) {
            data.forEach(function (item) {
                html += '<option value="' + item.title + '">' + item.title + '</option>'
            })
        } else {
            html += '<option value="0">请选择</option>'
        }
        return '<p class="head-title">加入加权计划</p><div class="form-list"><div><span>计划名称</span><select class="selcet" placeholder="请选择">' + html + '</select></div><p class="ctPlan">创建新计划</p></div><div class="cha-btns"><button id="vestBtn" class="btn">确定</button></div>';
    },
    createPlan: '<p class="head-title" id="giveupPlan">新建计划</p><div class="form-list"><div class="item"><span>计划目的</span><select class="selcet"><option value="新品">新品</option></select></div><div><span>计划名称</span><input type="text" class="editor selcet" placeholder="请输入计划名称"></div></div><div class="cha-btns"><button class="btn planBtn">确定</button></div>',
    active2: function () {
        var bindList = SAVE_BIND.data;
        var len = bindList.length;
        var html = '';
        for (var i = 0; i < len; i++) {
            if (bindList[i]) {
                var isClosed = bindList[i].closed
                var name = bindList[i].mainUname
                var hasClose = isClosed == 1 ? '未激活' : '已激活';
                var status = isClosed == 1 ? '' : 'checked disabled';
                var runShopId = bindList[i].runShopId;
                var hasActive = isClosed == 1 ? '' : 'chose';
                var order = i + 1
                var idNum = 'label' + order
                html += '<tr><td><label for="' + idNum + '" class="' + hasActive + '"></label><input id=' + idNum + ' type="checkbox" ' + status + ' data-id="' + runShopId + '" hidden><span class="num">' + order + '</span></td><td>' + name + '</td><td>' + hasClose + '</td></tr>'
            }
        }
        var ret = '<div class="chaqz-info-wrapper pop"><div class="c-cont"><span class="close hides" click="hideInfo">×</span><div class="alert"><div class="table-wrap"><table><thead><tr><td>序号</td><td>店铺名</td><td>状态</td></tr></thead><tbody>' + html + '</tbody></table></div><div class="cha-btns"><button class="btn activeShop">激活</button></div><p class="foot-tips">如有绑定疑问，请<a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes">联系客服</a></p></div></div></div>'
        return ret
    },
    init: function (type, data) {
        if ($('.chaqz-info-wrapper.pop').length) {
            this.changeDom(type, data)
            return false
        }
        var wrapFont = '<div class="chaqz-info-wrapper pop"><div class="c-cont"><span class="close hides" click="hideInfo">×</span><div class="alert">'
        var wrapEnd = '</div></div></div>'
        var resultDom = ''
        if (typeof this[type] == 'function') {
            resultDom = this[type](data)
        } else {
            resultDom = this[type]
        }
        var _html = wrapFont + resultDom + wrapEnd;
        var _that = this
        $('#app').append(_html)
        $('.chaqz-info-wrapper.pop').on('click', '.hides', function () {
            var hidePlan = $('.chaqz-info-wrapper.pop').find('#giveupPlan')
            if (hidePlan.length) {
                _that.init("selectPlan", PLAN_LIST)
                return false
            }
            $('.chaqz-info-wrapper.pop').hide()
        })
        $('.chaqz-info-wrapper.pop').on('click', '.buyBtn', function () {
            window.open(BASE_URL + '/homePage?from=plugin')
            _that.init('orderSucc')
        })
        $('.chaqz-info-wrapper.pop').on('click', '#logout', function () {
            $('.chaqz-info-wrapper.pop').hide();
            changeLoginStatus('out')
            chrome.storage.local.clear(function () { });
            localStorage.removeItem('chaqz_token')
        })
        $('.chaqz-info-wrapper.pop').on('click', '#goBind', function () {
            var curShop = dealShopInfo()
            var saveToke = localStorage.getItem('chaqz_token')
            chrome.runtime.sendMessage({
                key: 'getData',
                options: {
                    url: BASE_URL + '/api/v1/plugin/shop',
                    type: 'POST',
                    headers: {
                        Authorization: "Bearer " + saveToke
                    },
                    contentType: "application/json,charset=utf-8",
                    data: JSON.stringify({
                        "login_user_id": curShop.loginUserId,
                        "login_user_name": curShop.loginUserName,
                        "main_user_id": curShop.mainUserId,
                        "main_user_name": curShop.mainUserName,
                        "run_as_shop_id": curShop.runAsShopId,
                        "run_as_shop_title": curShop.runAsShopTitle,
                        "run_as_user_id": curShop.runAsUserId,
                        "run_as_shop_type": curShop.runAsShopType,
                        "run_as_user_name": curShop.runAsUserName
                    })
                }
            }, function (res) {
                $('.chaqz-info-wrapper.pop').hide();
                if (res.code == 200) {
                    popTip('已绑定成功')
                    window.location.reload()
                } else if (res.code == 4005) {
                    popTip('用户无绑定店铺权限')
                } else if (res.code == 4006) {
                    popTip('超出绑定上限')
                } else if (res.code == 5005) {
                    popTip('店铺已被其他账号绑定 ')
                } else if (res.code == 2030) {
                    LogOut()
                } else {
                    popTip('绑定失败')
                }
            })
            $('.chaqz-info-wrapper.pop').hide();
        })
        $('.chaqz-info-wrapper.pop').on('click', '#pageRefresh', function () {
            window.location.reload();
        })
        $('.chaqz-info-wrapper.pop').on('change', '.table-wrap input', function () {
            var checkNum = $('.chaqz-info-wrapper.pop input:checked').length;
            var totalBindNum = SAVE_BIND.count;
            if (checkNum > totalBindNum) {
                $(this).prop({
                    'checked': false
                })
                popTip('绑定用户达上限', 'top:10%;')
            } else {
                var isTrue = $(this).prop('checked')
                if (isTrue) {
                    $(this).siblings('label').addClass('chose')
                } else {
                    $(this).siblings('label').removeClass('chose')
                }
            }
        })
        $(document).on('click', '.activeShop', function () {
            var activeList = $('.chaqz-info-wrapper.pop input:checked:not(:disabled)')
            var len = activeList.length;
            var saveToke = localStorage.getItem('chaqz_token');
            if (len) {
                var countNum = 0;
                var saveToke = localStorage.getItem('chaqz_token');
                for (var i = 0; i < len; i++) {
                    var runShopId = $(activeList[i]).data('id')
                    chrome.runtime.sendMessage({
                        key: 'getData',
                        options: {
                            url: BASE_URL + '/api/v1/plugin/shop',
                            type: 'PATCH',
                            headers: {
                                Authorization: "Bearer " + saveToke
                            },
                            contentType: "application/json,charset=utf-8",
                            data: JSON.stringify({
                                run_as_shop_id: runShopId
                            })
                        }
                    }, function (res) {
                        if (res.code == 200) {
                            popTip('激活成功', 'top:10%;');
                        } else {
                            popTip('激活失败', 'top:10%;');
                        }
                        countNum++
                        if (countNum > len - 1) {
                            window.location.reload();
                        }
                    })
                }
            }
        })
        $(document).on('click', '.chaqz-info-wrapper.pop .ctPlan', function () {
            _that.init('createPlan')
        })
        $(document).on('blur', '.chaqz-info-wrapper.pop .editor', function () {
            if ($(this).val().length > 8) {
                $(this).val($(this).val().slice(0, 8))
                popTip('最多可输入8个汉字', 'top:10%;')
                return false
            }
        })
        $('.chaqz-info-wrapper.pop').on('click', '.planBtn', function () {
            var planName = $('.chaqz-info-wrapper.pop .editor').val();
            var purpose = $('.chaqz-info-wrapper.pop .selcet').val();
            var hasCreatePlan = PLAN_LIST
            var isExist = _that.checkRepeat(PLAN_LIST, planName)
            if (!planName || !purpose) {
                popTip('请填写计划')
                return false
            }
            if (isExist) {
                popTip('计划名已存在')
                return false
            }
            var saveToke = localStorage.getItem('chaqz_token')
            chrome.runtime.sendMessage({
                key: 'getData',
                options: {
                    url: BASE_URL + '/api/v1/plugin/planData',
                    type: "POST",
                    headers: {
                        Authorization: "Bearer " + saveToke
                    },
                    contentType: "application/json,charset=utf-8",
                    data: JSON.stringify({
                        "title": planName,
                        "type": 1,
                    })
                }
            }, function (val) {
                if (val.code == 200) {
                    hasCreatePlan.unshift(val.data)
                    _that.init("selectPlan", hasCreatePlan)
                } else if (val.code == 2030) {
                    LogOut()
                } else {
                    popTip('计划生成失败！')
                }
            })
        })
        $('.chaqz-info-wrapper.pop').on('click', '#vestBtn', function () {
            LoadingPop('show')
            var planName = $('.chaqz-info-wrapper.pop .form-list .selcet').val()
            var selectPlan = _that.chosePlan(PLAN_LIST, planName)
            if (planName == 0) {
                LoadingPop()
                popTip('请选择计划', 'top:10%;')
                return false
            }
            var timer = null;
            var countNum = 0;
            $(".oui-date-picker .oui-canary-btn:contains('7天')").click()
            var productInfo = getProductInfo()
            var idParams = getproduceIds(productInfo)
            var fontKey = getSearchParams('monitCompareFood').split('&page')[0]
            var fact = $('#itemAnalysisTrend .ant-select-selection-selected-value').attr('title')
            var device = fact == '所有终端' ? '0' : fact == 'PC端' ? '1' : fact == '无线端' ? '2' : '';
            var recent7Key = fontKey + device + idParams
            if (localStorage.getItem(recent7Key)) {
                _that.getDay(productInfo, recent7Key, selectPlan)
            } else {
                timer = setInterval(function () {
                    countNum++;
                    if (localStorage.getItem(recent7Key)) {
                        clearInterval(timer)
                        timer = null;
                        _that.getDay(productInfo, recent7Key, selectPlan)

                    } else if (countNum > 10) {
                        clearInterval(timer)
                        timer = null;
                        popTip('获取指数数据失败！', 'top:10%;')
                        LoadingPop()
                    }
                }, 500)
            }
        })
        $(document).on('blur', '.chaqz-info-wrapper.pop .anayEditor', function () {
            $(this).siblings('.good-tips').removeClass('alert')
        })
        $(document).on('click', '.chaqz-info-wrapper.pop .analyBtn', function () {
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
        $(document).on('click', '.chaqz-info-wrapper.pop .analyBtn2', function () {
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
                    url: BASE_URL + '/py/api/v1/item?id=' + iptVal,
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
        $(document).on('click', '.chaqz-info-wrapper.pop .contactService', function () {
            _that.init('weixin')
        })
    },
    getDay: function (productInfo, key, planName) {
        var timer = null;
        var countNum = 0;
        var _that = this;
        dealIndex({
            type: 'monitCompareFood',
            dataType: key
        }, function (res) {
            $(".oui-date-picker .oui-canary-btn:contains('日')").click()
            var cltHeight = window.innerHeight;
            var remianHei = 900 - cltHeight;
            if (remianHei > 0) {
                $(document).scrollTop(remianHei)
            }
            var wordsIds = getproduceIds(productInfo, 'idObj')
            var keyWrap = $('.op-mc-item-analysis #itemAnalysisKeyword')
            if (!keyWrap.length) {
                return false
            }
            $("#itemAnalysisKeyword .oui-tab-switch-item:contains('成交关键词')").click()
            var wordsfontKey = getSearchParams('getKeywords', 1, 20).split('&page')[0];
            var wordsfact = $('#itemAnalysisKeyword .ant-select-selection-selected-value').attr('title');
            var wordsdevice = wordsfact == '所有终端' ? '0' : wordsfact == 'PC端' ? '1' : wordsfact == '无线端' ? '2' : '';
            var itemWho = wordsIds.item1.itemId ? 'item1' : 'item2'
            var dayParam = itemWho == 'item1' ? ('&itemId=' + wordsIds.item1.itemId) : ('&itemId=' + wordsIds.item2.itemId)
            var dayKey = wordsfontKey + wordsdevice + dayParam
            if (localStorage.getItem(dayKey)) {
                _that.sendResponseData(wordsIds, itemWho, res, localStorage.getItem(dayKey), planName)
            } else {
                timer = setInterval(function () {
                    countNum++;
                    if (localStorage.getItem(dayKey)) {
                        clearInterval(timer)
                        timer = null;
                        _that.sendResponseData(wordsIds, itemWho, res, localStorage.getItem(dayKey), planName)
                    } else if (countNum > 10) {
                        clearInterval(timer)
                        timer = null;
                        popTip('获取关键词失败！', 'top:10%;')
                        LoadingPop()
                    }
                }, 500)
            }
        })
    },
    sendResponseData: function (wordsIds, itemWho, res, dayKey, planName) {
        var keywordsList = {}
        keywordsList.selfItem = wordsIds.self ? wordsIds.self : {};
        keywordsList.item = wordsIds[itemWho]
        var indexData = this.filterData(res)
        if (indexData.count == 1) {
            for (var k in indexData.item0) {
                keywordsList.item[k] = indexData.item0[k]
            }
        } else {
            for (var k in indexData.item0) {
                keywordsList.selfItem[k] = indexData.item0[k]
            }
            for (var j in indexData.item1) {
                keywordsList.item[j] = indexData.item1[j]
            }
        }
        keywordsList.keywords = this.filterKeywords(JSON.parse(dayKey))
        keywordsList.plan_id = planName.plan_id
        keywordsList.plan_name = planName.title
        keywordsList.day = 7
        if (!keywordsList.keywords.length) {
            chrome.storage.local.set({
                'compareProduceData': keywordsList
            }, function () {
                $('.chaqz-info-wrapper.pop').fadeOut(100)
                window.open(BASE_URL + '/privilgeEscala')
            })
            LoadingPop()
            return false;
        }
        var saveToke = localStorage.getItem('chaqz_token')
        chrome.runtime.sendMessage({
            key: 'getData',
            options: {
                url: BASE_URL + '/api/v1/plugin/planData',
                type: "PUT",
                headers: {
                    Authorization: "Bearer " + saveToke
                },
                contentType: "application/json,charset=utf-8",
                data: JSON.stringify(keywordsList)
            }
        }, function (val) {
            if (val.code == 200) {
                chrome.storage.local.set({
                    'compareProduceData': keywordsList
                }, function () {
                    $('.chaqz-info-wrapper.pop').fadeOut(100)
                    window.open(BASE_URL + '/privilgeEscala')
                })
            } else if (val.code == 2030) {
                LogOut()
            } else {
                popTip('上传数据失败请重试')
            }
            LoadingPop()
        })
    },
    checkRepeat: function (data, name) {
        if (!data) {
            return false
        }
        var isHas = false
        data.forEach(function (item) {
            if (item.title == name) {
                isHas = true
            }
        })
        return isHas
    },
    filterKeywords: function (data) {
        if (!data) {
            return []
        }
        var resBox = []
        data.forEach(function (item) {
            if (item.tradeIndex.value > 100 && item.tradeIndex.value < 450) {
                resBox.push(item.keyword.value)
            }
        })
        return resBox
    },
    chosePlan: function (data, aim) {
        if (!data) {
            return {}
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i].title == aim) {
                return data[i]
            }
        }

    },
    changeDom: function (type, data) {
        var changeHtml = ''
        if (typeof this[type] == 'function') {
            changeHtml = this[type](data)
        } else {
            changeHtml = this[type]
        }
        $('.chaqz-info-wrapper.pop .c-cont .alert').html(changeHtml)
        $('.chaqz-info-wrapper.pop').show()
    },
    filterData: function (data) {
        var result = {
            item0: {},
            item1: {}
        }
        for (var key in data) {
            var len = data.payRate.length
            result.count = len
            data[key].forEach(function (item, index) {
                if (key == 'payRate') {
                    item = item ? item / 100 : ''
                }
                result['item' + index][key] = item ? item : ''
            })
        }
        return result
    }
}
function testUrl(val) {
    var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
    var numReg = /^\d+$/;
    var isUrl = urlReg.test(val);
    var isNum = numReg.test(val);
    var id = '';
    if (isUrl) {
        var params = val.split('?')[1]
        var searchKey = params.split('&')
        searchKey.forEach(function (item) {
            var text = item.split("=")
            if (text[0] == 'id') {
                id = text[1]
            }
        })
        return id
    }
    if (isNum) {
        return val
    }
    return false
}
function userInfoRes() {
    var saveToke = localStorage.getItem('chaqz_token')
    anyDom.getShopBind()
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
            let res = val.data;
            res.username = res.account;
            res.member.expireAt = res.member.expire_at;
            SAVE_MEMBER = res
        } else {
            LogOut()
        }
    })
}

function popTip(text, style, time) {
    var st = style ? style : ''
    $('#app').append('<div class="small-alert" style="' + style + '">' + text + '</div>');
    setTimeout(function () {
        $('#app .small-alert').fadeOut(300)
    }, 500)
}
function LoadingPop(status) {
    if (!status) {
        $('.load-pop').fadeOut(100)
        return false
    }
    var load = $('.load-pop')
    if (load.length) {
        load.fadeIn(200)
    }
    $('body').append('<div class="load-pop"><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>')
}
function getFirstCateId() {
    var deaultId = localStorage.getItem('shopCateId');
    var cateIdF = JSON.parse(localStorage.getItem('tree_history_op-mc._cate_picker'));
    var cateIdS = cateIdF.split("|")[1];
    var cateIdT = cateIdS ? JSON.parse(cateIdS).value : '';
    if (!cateIdT) {
        return deaultId;
    }
    var resData = ''
    cateIdT.forEach(function (item) {
        if (item.realObj.cateId == deaultId) {
            resData = item.realObj.cateLevel1Id;
        }
    })
    return resData
}
function clearLocalstorage() {
    if (!localStorage.getItem('isFirstInstallPlugin')) {
        localStorage.clear();
        localStorage.setItem('isFirstInstallPlugin', 'hasInstall')
    }
}
function getCurrentTime(dayType) {
    var upTime = updataTime.updateNDay;
    var up1Time = updataTime.update1Day;
    var sureDate = dayType == 'moreDay' ? upTime : up1Time;
    var saveTime = sureDate ? (new Date(sureDate).getTime()) : localStorage.getItem('currentDate') ? JSON.parse(localStorage.getItem('currentDate')).data.timestamp : '';
    if (!saveTime) {
        return new Date().getTime()
    }
    return saveTime
}
function setDateRange(data, type) {
    var recentDay = data
    var fontDate = formate('yyyy-MM-dd', new Date(recentDay))
    if (type == 'day') {
        return fontDate + '|' + fontDate
    }
    if (type == 'recent7') {
        var recent7 = recentDay - 518400000;
        var endDate7 = formate('yyyy-MM-dd', new Date(recent7))
        return endDate7 + '|' + fontDate
    }
    var recent30 = recentDay - 2505600000;
    var endDate = formate('yyyy-MM-dd', new Date(recent30))
    return endDate + '|' + fontDate
}
function getTimeNode() {
    var allLocal = localStorage.valueOf();
    var dateBox = '';
    for (var k in allLocal) {
        if (k.indexOf('//sycm.taobao.com/portal/common/commDate.json?targetUrl=http://sycm.taobao.com/mc') != -1) {
            dateBox = allLocal[k];
            break;
        }
    }
    if (!dateBox) {
        return ''
    }
    var res = JSON.parse(dateBox).split("|")[1];
    return JSON.parse(res).value._d;
}
function dealShopInfo() {
    var info = dataWrapper.shopInfo.data
    var localShop = localStorage.getItem('chaqz_shopInfo')
    if (info.length) {
        var ret = JSON.parse(info).data
        return ret
    }
    if (localShop) {
        var resd = JSON.parse(localShop).data
        return resd
    }
}
function getLocalSelfList() {
    var localSelf = JSON.parse(localStorage.getItem('/mc/rivalShop/recommend/item.json'))
    var getLocal = localSelf ? JSON.parse(localSelf.split("|")[1]).value._d : '';
    return Decrypt(getLocal)
}
function getproduceIds(product, type) {

    var selfListJson = localStorage.getItem('chaqz_compareSelfList') || getLocalSelfList();
    var mointListJson = dataWrapper.getMonitoredList.data;
    if (!selfListJson || !mointListJson.length) {
        popTip('获取竞品数据失败，请刷新重试！');
        LoadingPop()
        return false;
    }
    var selfList = JSON.parse(selfListJson)
    var mointList = JSON.parse(mointListJson);
    var ids = {
        item1: '',
        item2: '',
        self: ''
    }
    var item1 = ''
    var item2 = ''
    var self = ''
    for (var i = 0; i < selfList.length; i++) {
        if (selfList[i].title == product.selfItem.title) {
            self = '&selfItemId=' + selfList[i].itemId
            ids.self = selfList[i]
        }
    }
    for (var j = 0; j < mointList.length; j++) {
        if (mointList[j].name == product.rivalItem1.title) {
            ids.item1 = mointList[j]
            item1 = '&rivalItem1Id=' + mointList[j].itemId
        } else if (mointList[j].name == product.rivalItem2.title) {
            ids.item2 = mointList[j]
            item2 = '&rivalItem2Id=' + mointList[j].itemId
        }
    }
    if (type == 'idObj') {
        return ids
    } else {
        return item1 + item2 + self
    }
}
function formula(val, val2, type) {
    if (val == "undefined" || val === '' || val == '-' || !val2 || val2 == '-' || val2 == '0') {
        return '-'
    } else {
        val = (val + '').replace(',', '');
        val2 = (val2 + '').replace(',', '')
        if (type == 1) {
            return (Math.round((val / val2) * 100) / 100).toFixed(2)
        } else if (type == 2) {
            return (Math.round((val / val2) * 10000) / 100).toFixed(2) + '%'
        }
    }
}
function integer(val, type) {
    if (val == 0) {
        return 0
    } else if (!val || val == '-') {
        return '-'
    } else {
        val = (val + '').replace(',', '')
        if (type == 'inter') {
            return Math.round(val)
        } else if (type == 'precent') {
            return (val.indexOf('%') !== -1) ? (val.slice(0, -1) / 100) : val
        } else {
            return val
        }
    }
}
function delePoint(val) {
    val = (val + '').replace(',', '')
    if (val.indexOf('%') !== -1) {
        return val.slice(0, -1) / 100
    } else {
        return val
    }

}
function searchItemhas() {
    var params = window.location.search.split('?')[1]
    var keyValue = params.split('&')
    var obj = {
        ispass: false
    };
    keyValue.forEach(function (item) {
        var key = item.split("=")
        if (key[1]) {
            if (key[0] == 'rivalItem1Id' && key[1]) {
                obj.ispass = true
            }
            obj[key[0]] = key[1];
        }
    })
    return obj
}
function getProductInfo() {
    var items = $('#itemAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select')
    var info = {
        selfItem: {
            imgurl: '',
            title: ''
        },
        rivalItem1: {
            imgurl: '',
            title: ''
        },
        rivalItem2: {
            imgurl: '',
            title: ''
        },
        totalNum: 0
    }
    for (var i = 0; i < 3; i++) {
        var $title = $(items[i]).find('.sycm-common-select-selected-title')
        var $img = $(items[i]).find('.sycm-common-select-selected-image-wrapper img')
        if ($title.length) {
            var productTitle = $title ? $title.attr('title') : ''
            var productImg = $img ? $img.attr('src') : ''
            info.totalNum += 1
            if (i == 0) {
                info.selfItem.imgurl = productImg
                info.selfItem.title = productTitle
            } else if (i == 1) {
                info.rivalItem1.imgurl = productImg
                info.rivalItem1.title = productTitle
            } else if (i == 2) {
                info.rivalItem2.imgurl = productImg
                info.rivalItem2.title = productTitle
            }


        }
    }
    return info
}
function getSearchParams(key, page, pagesize, dealType) {
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
    var dateType = dayIndex == '实 时' ? 'today' : dayIndex == '7天' ? 'recent7' : dayIndex == '30天' ? 'recent30' : dayIndex == '日' ? 'day' : dayIndex == '周' ? 'week' : dayIndex == '月' ? 'month' : 'today';
    var endpointTyep = $('.ebase-FaCommonFilter__root .fa-common-filter-device-select .oui-select-container-value').html();
    var shopType = $('.ebase-FaCommonFilter__root .sellerType-select .ant-select-selection-selected-value').attr('title');
    var timeRnage = $('.ebase-FaCommonFilter__root .oui-date-picker .oui-date-picker-current-date').text();
    var device = endpointTyep == '所有终端' ? '0' : endpointTyep == 'PC端' ? '1' : endpointTyep == '无线端' ? '2' : '';
    var sellType = shopType == '全部' ? '-1' : shopType == '天猫' ? '1' : shopType == '淘宝' ? '0' : '';
    var spliteTime = timeRnage.split(' ');
    var splitLen = spliteTime.length;
    var finalTime = '';
    if (splitLen == 3 || splitLen == 2) {
        finalTime = spliteTime[1] + '|' + spliteTime[1];
    } else if (splitLen == 4) {
        finalTime = dealType ? (spliteTime[3] + '|' + spliteTime[3]) : (spliteTime[1] + '|' + spliteTime[3]);
    }
    page = page ? page : 1;
    pagesize = pagesize ? pagesize : 10;
    if (key == 'allTrend') {
        finalTime = setDateRange(getCurrentTime(), 'day');
    }
    var localCateId = localStorage.getItem('shopCateId');
    if (dealType) {
        return key += 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=day' + '&device=' + device + '&sellerType=' + sellType
    }
    return key += 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&page=' + page + '&pageSize=' + pagesize + '&sellerType=' + sellType
}
function operatcPmpareData(v1, v2, v3) {
    v1 = (v1 + '').replace(',', '')
    v2 = (v2 + '').replace(',', '')
    v3 = (v3 + '').replace(',', '')
    var result = {
        num1: 0,
        num2: 0
    }
    if (!v1 || !v2 || v1 == '-' || v2 == '-' || v2 == '0') {
        result.num1 = '-';
        result.num2 = '-';
    } else if (!v3 || v3 == '-') {
        result.num1 = Math.round(v1 * v2 / 100)
        result.num2 = '-';
    } else {
        result.num1 = Math.round(v1 * v2 / 100)
        result.num2 = result.num1 ? Math.round((v3 / result.num1) * 100).toFixed(2) / 100 : '-';
    }
    return result
}
function computedPayByr(v1, v2, v3) {
    var result = {
        res1: 0,
        res2: 0,
    }
    if (!v1 || v1 == '-' || !v2 || v2 == '-') {
        result.res1 = '-'
        result.res2 = '-'
    } else {
        v1 = (v1 + '').replace(',', '');
        v2 = (v2 + '').replace(',', '').slice(0, -1);
        v3 = (v3 + '').replace(',', '');
        var del = v1 * v2
        result.res1 = Math.round(del / 100)
        if (v3 == '-') {
            result.res2 = '-'
        } else {
            result.res2 = del ? Math.round((v3 / del) * 10000) / 100 : '-'
        }
    }
    return result
}
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
function keywordUrl(rivalId, device, type) {
    var nowTime = getCurrentTime();
    var dateRange = setDateRange(nowTime, 'day');
    var localCateId = localStorage.getItem('shopCateId');
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
function getDateRange(data, fm) {
    var resArr = []
    var fmt = fm ? fm : 'yyyy-MM-dd';
    for (var i = 1; i < 31; i++) {
        resArr.unshift(formate(fmt, new Date(data - 86400000 * i)));
    }
    return resArr
}
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
function MonitorItem(pageType) {
    var curPage = $('.mc-ItemMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-ItemMonitor .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize)
    var itemKey = getSearchParams('monitFood', curPage, curPageSize)
    dealIndex({
        type: 'monitFood',
        dataType: itemKey
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
            obj.payRate = res.payRate[i].toFixed(2) + '%'
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
function competeDataAnaly(rivalId, device) {
    LoadingPop('show')
    var nowTime = getCurrentTime('moreDay');
    var dateRange = setDateRange(nowTime);
    var titleDate = dateRange.replace('|', '~');
    var localCateId = localStorage.getItem('shopCateId')
    var finalUrl = "https://sycm.taobao.com/mc/rivalItem/analysis/getCoreTrend.json?dateType=recent30&dateRange=" + dateRange + "&device=" + device + "&cateId=" + localCateId + "&rivalItem1Id=" + rivalId;
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
    chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl,
            type: 'GET',
            headers: {
                "transit-id": val.transitId
            },
            error: function () {
                popTip('获取数据失败请重试！')
                LoadingPop()
            },
            success: function (res) {
                var decryData = JSON.parse(Decrypt(res.data)).rivalItem1
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
                        res.uvPrice.push(obj.uvPrice);
                        res.searchRate.push(obj.searRate.slice(0, -1));
                        res.cangRate.push(obj.scRate.slice(0, -1));
                        res.buyRate.push(obj.jgRate.slice(0, -1));
                        resData.push(obj);
                    }
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
    })
}
function competeFlowAnaly(rivalId, device) {
    LoadingPop('show')
    var nowTime = getCurrentTime();
    var dateRange = setDateRange(nowTime, 'day');
    var titleDate = dateRange.replace('|', '~');
    var localCateId = localStorage.getItem('shopCateId')
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
    chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl,
            type: 'GET',
            headers: {
                "transit-id": val.transitId
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
                    cols = [{
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
    })
}
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
    chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl.url,
            type: 'GET',
            headers: {
                "transit-id": val.transitId
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
                        "transit-id": val.transitId
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
                                cols = [{
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
    })
}
function weightParsing(rivald, category, itemInfo) {
    var nowTime = getCurrentTime('moreDay');
    var dateRange = setDateRange(nowTime, 'recent7');
    var localCateId = localStorage.getItem('shopCateId')
    var finalUrl = "https://sycm.taobao.com/mc/mq/mkt/rank/item/hotsale.json?dateRange=" + dateRange + "&dateType=recent7&pageSize=100&page=2&order=desc&orderBy=tradeIndex&cateId=" + category + "&device=0&sellerType=-1&indexCode=cateRankId%2CtradeIndex%2CtradeGrowthRange%2CpayRateIndex";
    chrome.storage.local.get('transitId', function (val) {
        $.ajax({
            url: finalUrl,
            type: 'GET',
            headers: {
                "transit-id": val.transitId
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
                        transId: val.transitId,
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
    })
}
function getCompareData(params) {
    var nowTime = getCurrentTime('moreDay');
    var dateRange = setDateRange(nowTime, 'recent7');
    var localCateId = localStorage.getItem('shopCateId')
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
function marketMonitorShop(pageType) {
    var chooseTop = $('.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.mc-marketMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
    var backT = chooseTop ? 'marketFood' : 'marketShop';
    var itemKey = getSearchParams(backT, curPage, curPageSize)
    if (backT) {
        itemKey = itemKey.replace('marketFood', 'monitFood')
    }
    dealIndex({
        type: backT,
        dataType: itemKey
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
            if (chooseTop) {
                obj.shop = {
                    title: finaData[i].item.title,
                    url: finaData[i].item.pictUrl
                }
            } else {
                obj.shop = {
                    title: finaData[i].shop.title,
                    url: finaData[i].shop.pictureUrl
                }
            }
            obj.cate_cateRankId = cateRnkId ? cateRnkId.value ? cateRnkId.value : '-' : '-'
            obj.tradeIndex = trandeOver
            obj.uvIndex = Math.round(res.uvIndex[i])
            obj.seIpv = Math.round(res.seIpv[i])
            obj.cltHit = Math.round(res.cltHit[i])
            obj.cartHit = Math.round(res.cartHit[i])
            obj.payRate = res.payRate[i].toFixed(2) + '%'
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
            var choseItem = !chooseTop ? '监控店铺' : "监控商品"
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
            }, choseItem, 1)
        } else {
            for (var j = 0; j < curPageSize; j++) {
                tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
            }
            $('.chaqz-wrapper .chaqz-mask').hide(100)
        }
    })
}
function marketMonitorItem(pageType) {
    var hotType = $('.op-mc-market-monitor-industryCard .oui-card-header-item .oui-tab-switch-item-active').index()
    var curPage = $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.op-mc-market-monitor-industryCard .oui-page-size .ant-select-selection-selected-value').text()
    curPageSize = Number(curPageSize)
    var backT = hotType ? 'marketHotFood' : 'marketHotShop'
    var itemKey = getSearchParams(backT, curPage, curPageSize)
    dealIndex({
        type: backT,
        dataType: itemKey
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
        })
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

function marketRank(pageType) {
    var chooseItem = $('.op-mc-market-rank-container .oui-card-header-wrapper .oui-tab-switch .oui-tab-switch-item-active').index();
    var chooseList = $('.op-mc-market-rank-container .op-ebase-switch .ebase-Switch__activeItem').index();
    var curPage = $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-active').attr('title');
    var curPageSize = $('.op-mc-market-rank-container .oui-page-size .ant-select-selection-selected-value').text();
    curPage = curPage ? Number(curPage) : 1;
    curPageSize = Number(curPageSize);
    var hotType = chooseItem == 1 ? 'hotsearch' : chooseItem == 2 ? 'hotpurpose' : 'hotsale';
    var rankType = chooseList == 1 ? 'item' : chooseList == 2 ? 'brand' : 'shop';
    var itemKey = getSearchParams(hotType);
    var localData = JSON.parse(localStorage.getItem(rankType + '/' + itemKey));
    var totalCont = localData.length;
    var marketData = localData.slice((curPage - 1) * curPageSize, curPage * curPageSize);
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
                obj.growth = dealTradeGrowth(marketData[i].tradeGrowthRange.value)
                obj.payRate = res.payRate[i] + "%"
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
    })
}
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'holdup') {
            var baseUrl = request.url;
            var resData = request.back;
            if (baseUrl) {
                for (var k in dataWrapper) {
                    if ((new RegExp(dataWrapper[k].urlReg)).test(baseUrl)) {
                        var hasEncryp = JSON.parse(resData).data ? JSON.parse(resData).data : '';
                        var finaData = (typeof hasEncryp == 'object') ? resData : Decrypt(hasEncryp);
                        if (k == 'monitShop' || k == 'getMonitoredList') {
                            dataWrapper[k].data = finaData;
                        } else if (k == 'shopInfo') {
                            dataWrapper[k].data = finaData;
                            localStorage.setItem('chaqz_' + k, finaData)
                        } else if (k == 'compareSelfList') {
                            localStorage.setItem('chaqz_' + k, finaData)
                        } else if (k == 'monitCompareFood') {
                            var dataTypes = getParamsItem(baseUrl, 'com')
                            localStorage.setItem(k + dataTypes, finaData)
                        } else if (k == 'getKeywords') {
                            if (baseUrl.indexOf("topType=trade") != -1) {
                                var dataTypes = getParamsItem(baseUrl, 'only')
                                localStorage.setItem(k + dataTypes, finaData)
                            }
                        } else if (k == 'monitResource') {
                            var dataTypes = getParamsItem(baseUrl, 'com')
                            localStorage.setItem(k + dataTypes, finaData)
                            dataWrapper[k].ids = getItemId(baseUrl, 'url')
                        } else if (k == 'hotsale' || k == 'hotsearch' || k == 'hotpurpose') {
                            var dataTypes = getParamsItem(baseUrl)
                            var rankKey = marketRankType(baseUrl)
                            var saveData = bubbleSort(finaData)
                            localStorage.setItem(rankKey + '/' + k + dataTypes, saveData)
                        } else if (k == 'allTrend') {
                            var rankKey = marketRankType(baseUrl)
                            var dataTypes = getParamsItem(baseUrl, 'trend', rankKey)
                            localStorage.setItem(rankKey + '/' + k + dataTypes, finaData)
                        } else if (k == 'trendShop') {
                            var rankKey = marketRankType(baseUrl)
                            var dataTypes = getParamsItem(baseUrl, 'trendShopInfo', rankKey)
                            localStorage.setItem(rankKey + '/' + k + dataTypes, finaData)
                        } else if (k == 'currentDate') {
                            localStorage.setItem(k, finaData)
                        } else {
                            var dataTypes = getParamsItem(baseUrl)
                            localStorage.setItem(k + dataTypes, finaData)
                        }
                    }
                }
            }
            sendResponse('shoudao')
        }
    })

function dealIndex(request, sendResponse) {
    responseData = {
        payRate: [],
        tradeIndex: [],
        payByr: [],
        uvIndex: [],
        seIpv: [],
        cartHit: [],
        cltHit: []
    }
    if (request.type == 'version') {
        getVersion(request.ver, sendResponse)
    } else if (request.type == 'monitShop') {
        var moniShopData = jsonParse(dataWrapper[request.type].data)
        filterMinoShop(moniShopData)
        for (var key in responseData) {
            getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'monitShop', moniShopData)
        }
    } else if (request.type == 'monitFood') {
        var pageData = jsonFoodParse(localStorage.getItem(request.dataType), 'page')
        var markShop = pageData.data.data ? pageData.data.data : pageData.data;
        var sendPageData = pageData.recordCount ? pageData : pageData.data;
        filterMarketShop(markShop)
        for (var key in responseData) {
            getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'marketShop', sendPageData)
        }
    } else if (request.type == 'monitCompareFood') {
        var moniComData = jsonParse(localStorage.getItem(request.dataType))
        filterMoinCompare(moniComData)
        for (var key in responseData) {
            getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'monitCompareFood', moniComData)
        }
    } else if (request.type == 'monitResource') {
        var moniResData = jsonParse(localStorage.getItem(request.dataType))
        var itemIds = dataWrapper['monitResource'].ids
        var resouceIndex = filterMoinRes(moniResData, itemIds)
        var ajaxNum = Object.keys(resouceIndex).length == 2 ? 6 : 9
        responseData['selfItem'] = {}
        responseData['rivalItem1'] = {}
        responseData['rivalItem2'] = {}
        for (var key in resouceIndex) {
            for (var j in resouceIndex[key]) {
                if (j != 'uvIndex') {
                    getAjax(resouceIndex[key][j], j, sendResponse, ajaxNum, 'monitResource', moniResData, key)
                } else {
                    responseData[key][j] = resouceIndex[key][j]
                }
            }
        }

    } else if (request.type == 'marketShop' || request.type == 'marketFood') {
        var pageData = request.type == 'marketShop' ? jsonFoodParse(localStorage.getItem(request.dataType), 'page') : jsonFoodParse(localStorage.getItem(request.dataType), 'page')
        var markShop = pageData.data.data ? pageData.data.data : pageData.data;
        var sendPageData = pageData.recordCount ? pageData : pageData.data;
        filterMarketShop(markShop)
        for (var key in responseData) {
            getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'marketShop', sendPageData)
        }
    } else if (request.type == 'marketHotShop' || request.type == 'marketHotFood') {
        var pageData = jsonFoodParse(localStorage.getItem(request.dataType), 'page')
        var marketHot = pageData.data
        var markHotIndex = filterMarketHot(marketHot)
        for (var key in markHotIndex) {
            getAjax(markHotIndex[key], key, sendResponse, Object.keys(markHotIndex).length, 'marketHotShop', pageData)
        }
    } else if (request.type == 'marketHotShop' || request.type == 'marketHotFood') {
        var pageData = jsonFoodParse(localStorage.getItem(request.dataType), 'page')
        var marketHot = pageData.data
        var markHotIndex = filterMarketHot(marketHot)
        for (var key in markHotIndex) {
            getAjax(markHotIndex[key], key, sendResponse, Object.keys(markHotIndex).length, 'marketHotShop', pageData)
        }
    } else if (request.type == 'hotsale') {
        var hotSale = filterMarketHotsale(request.dataType)
        for (var key in hotSale) {
            getAjax(hotSale[key], key, sendResponse, Object.keys(hotSale).length, 'hotsale')
        }
    } else if (request.type == 'hotsearch') {
        var hotsearch = filterMarketHotsearch(request.dataType)
        for (var key in hotsearch) {
            getAjax(hotsearch[key], key, sendResponse, Object.keys(hotsearch).length, 'hotsearch')
        }
    } else if (request.type == 'hotpurpose') {
        var hotpurpose = filterMarketHotpurpose(request.dataType)
        for (var key in hotpurpose) {
            getAjax(hotpurpose[key], key, sendResponse, Object.keys(hotpurpose).length, 'hotpurpose')
        }
    } else if (request.type == 'dealTrend') {
        var dealTrend = request.dataType
        for (var key in dealTrend) {
            getAjax(dealTrend[key], key, sendResponse, Object.keys(dealTrend).length, 'dealTrend')
        }
    } else if (request.type == 'singleCompete') {
        var singleData = request.dataType;
        var filterSingle = fliterSingleCompete(singleData);
        for (var key in filterSingle) {
            getAjax(filterSingle[key], key, sendResponse, Object.keys(filterSingle).length, 'singleCompete')
        }
    }
    return true;
}
function getAjax(data, type, sendResponse, num, fType, lastData, compareItem) {
    var filterType = (type == 'payRate' || type == 'payRateIndex') ? 1 : type == 'tradeIndex' ? 2 : (type == 'payByr' || type == 'payByrCntIndex') ?
        3 : type == 'uvIndex' ? 4 : (type == 'seIpv' || type == 'seIpvUvHits') ? 5 : (type == 'cartHit' || type == 'cartHits') ? 6 : (type == 'cltHit' || type == 'cltHits') ? 7 : '';
    var saveToke = localStorage.getItem('chaqz_token')
    chrome.runtime.sendMessage({
        key: "getData",
        options: {
            url: BASE_URL + '/api/v1/plugin/flowFormula?type=' + filterType,
            type: "POST",
            contentType: "application/json,charset=utf-8",
            headers: {
                Authorization: "Bearer " + saveToke
            },
            data: JSON.stringify({
                exponent: data
            })
        }
    },
        function (val) {
            requestNum++
            if (val.code == 200) {
                if (!compareItem) {
                    responseData[type] = val.data
                } else {
                    responseData[compareItem][type] = val.data
                }
            } else if (val.code == 2030) {
                LogOut()
                requestNum = 0
            }
            if (requestNum > num - 1) {
                var resData = fType == 'monitShop' ? moinShopTable(lastData) : fType == 'monitFood' ? moinFoodTable(lastData) : fType == 'monitCompareFood' ? responseData : fType == 'monitResource' ? {
                    value: responseData,
                    final: lastData,
                    ids: dataWrapper['monitResource'].ids
                } : fType == 'marketShop' ? {
                    value: responseData,
                    final: lastData
                } : fType == 'marketHotShop' ? {
                    value: responseData,
                    final: lastData
                } : {
                                value: responseData
                            };
                requestNum = 0
                sendResponse(resData)
            }
        })
}
function bubbleSort(data) {
    if (!data) {
        return ''
    }
    var arr = JSON.parse(data)
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j].cateRankId.value > arr[j + 1].cateRankId.value) {
                var temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return JSON.stringify(arr);
}
function jsonParse(data, type) {
    if (!data) {
        return ''
    } else {
        var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
        var orignData = JSON.parse(data)
        var finalData = dayIndex != '实 时' ? orignData : orignData.data.data ? orignData.data.data : orignData.data
        return finalData
    }
}

function jsonFoodParse(data, type) {
    if (!data) {
        return ''
    } else if (type == 'page') {
        var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
        var orignData = JSON.parse(data)
        var page = dayIndex != '实 时' ? orignData : orignData.data.data.data ? orignData.data.data : orignData.data
        return page
    } else {
        var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
        var orignData = JSON.parse(data)
        var finalData = dayIndex != '实 时' ? orignData : orignData.data.data.data ? orignData.data.data.data : orignData.data.data
        return finalData
    }
}

function Decrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("sycmsycmsycmsycm");
    var iv = CryptoJS.enc.Utf8.parse('mcysmcysmcysmcys');
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
function filterMinoShop(data) {
    if (data) {
        data.forEach((item) => {
            var va1 = item.shop_payRateIndex ? item.shop_payRateIndex.value : 0;
            var va2 = item.shop_tradeIndex ? item.shop_tradeIndex.value : 0;
            var va3 = item.shop_payByrCntIndex ? item.shop_payByrCntIndex.value : 0;
            var va4 = item.shop_uvIndex ? item.shop_uvIndex.value : 0;
            var va5 = item.shop_seIpvUvHits ? item.shop_seIpvUvHits.value : 0;
            var va6 = item.shop_cartHits ? item.shop_cartHits.value : 0;
            var va7 = item.shop_cltHits ? item.shop_cltHits.value : 0;
            responseData.payRate.push(va1);
            responseData.tradeIndex.push(va2);
            responseData.payByr.push(va3);
            responseData.uvIndex.push(va4);
            responseData.seIpv.push(va5);
            responseData.cartHit.push(va6);
            responseData.cltHit.push(va7);
        });
    }
}
function moinShopTable(finaData) {
    var resData = []
    var length = responseData.payRate.length
    for (var i = 0; i < length; i++) {
        var obj = {
            shop: {}
        }
        var cateRnkId = finaData[i].cate_cateRankId
        obj.shop = {
            title: finaData[i].shop.title,
            url: finaData[i].shop.pictureUrl
        }
        obj.cate_cateRankId = cateRnkId ? (cateRnkId.value ? cateRnkId.value : '-') : '-'
        obj.tradeIndex = Math.round(responseData.tradeIndex[i])
        obj.uvIndex = Math.round(responseData.uvIndex[i])
        obj.seIpv = Math.round(responseData.seIpv[i])
        obj.cltHit = Math.round(responseData.cltHit[i])
        obj.cartHit = Math.round(responseData.cartHit[i])
        obj.payRate = responseData.payRate[i].toFixed(2) + '%'
        obj.payByr = integer(responseData.payByr[i], "inter")
        obj.kdPrice = formula(responseData.tradeIndex[i], responseData.payByr[i], 1)
        obj.uvPrice = formula(responseData.tradeIndex[i], responseData.uvIndex[i], 1)
        obj.searRate = formula(responseData.seIpv[i], responseData.uvIndex[i], 2)
        obj.scRate = formula(responseData.cltHit[i], responseData.uvIndex[i], 2)
        obj.jgRate = formula(responseData.cartHit[i], responseData.uvIndex[i], 2)
        resData.push(obj)
    }
    return resData
}
function filterMinoFood(data) {
    if (data) {
        data.forEach((item) => {
            var va1 = item.payRateIndex ? item.payRateIndex.value : 0;
            var va2 = item.tradeIndex ? item.tradeIndex.value : 0;
            var va4 = item.uvIndex ? item.uvIndex.value : 0;
            var va5 = item.seIpvUvHits ? item.seIpvUvHits.value : 0;
            var va6 = item.cartHits ? item.cartHits.value : 0;
            var va7 = item.cltHits ? item.cltHits.value : 0;
            responseData.payRate.push(va1);
            responseData.tradeIndex.push(va2);
            responseData.uvIndex.push(va4);
            responseData.seIpv.push(va5);
            responseData.cartHit.push(va6);
            responseData.cltHit.push(va7);
        });
    }
}

function moinFoodTable(finaData) {
    var resData = []
    var length = responseData.payRate.length
    for (var i = 0; i < length; i++) {
        var payNum = '',
            pray1 = integer(responseData.payRate[i], "precent"),
            pray2 = integer(responseData.uvIndex[i]);
        if (pray1 == '-' || pray2 == '-') {
            payNum = '-'
        } else {
            payNum = Math.round(pray1 * pray2 / 100)
        }
        var obj = {
            shop: {}
        }
        var cateRnkId = finaData[i].cateRankId
        obj.shop = {
            title: finaData[i].item.title,
            url: finaData[i].item.pictUrl
        }
        obj.cate_cateRankId = cateRnkId ? cateRnkId.value : '-'
        obj.tradeIndex = Math.round(responseData.tradeIndex[i])
        obj.uvIndex = Math.round(responseData.uvIndex[i])
        obj.seIpv = Math.round(responseData.seIpv[i])
        obj.cltHit = Math.round(responseData.cltHit[i])
        obj.cartHit = Math.round(responseData.cartHit[i])
        obj.payRate = responseData.payRate[i].toFixed(2) + '%'
        obj.payByr = payNum
        obj.kdPrice = formula(responseData.tradeIndex[i], payNum, 1)
        obj.uvPrice = formula(responseData.tradeIndex[i], responseData.uvIndex[i], 1)
        obj.searRate = formula(responseData.seIpv[i], responseData.uvIndex[i], 2)
        obj.scRate = formula(responseData.cltHit[i], responseData.uvIndex[i], 2)
        obj.jgRate = formula(responseData.cartHit[i], responseData.uvIndex[i], 2)
        resData.push(obj)
    }
    return resData
}
function filterMoinCompare(data) {
    if (data) {
        var dataArrr = [data['selfItem'], data["rivalItem1"], data["rivalItem2"]].filter(function (item) {
            return item
        })
        dataArrr.forEach(function (item) {
            var va1 = item.payRateIndex ? item.payRateIndex.value : 0;
            var va2 = item.tradeIndex ? item.tradeIndex.value : 0;
            var va4 = item.uvIndex ? item.uvIndex.value : 0;
            var va5 = item.seIpvUvHits ? item.seIpvUvHits.value : 0;
            var va6 = item.cartHits ? item.cartHits.value : 0;
            var va7 = item.cltHits ? item.cltHits.value : 0;
            responseData.payRate.push(va1);
            responseData.tradeIndex.push(va2);
            responseData.uvIndex.push(va4);
            responseData.seIpv.push(va5);
            responseData.cartHit.push(va6);
            responseData.cltHit.push(va7);
        })
    }
}
function filterMoinRes(data, produceData) {
    var sourceIndex = {
        'selfItem': {
            payRate: [],
            tradeIndex: [],
            payByr: [],
            uvIndex: []
        }
    }
    if (produceData.rivalItem1Id) {
        sourceIndex['rivalItem1'] = {
            payRate: [],
            tradeIndex: [],
            payByr: [],
            uvIndex: []
        }
    }
    if (produceData.rivalItem2Id) {
        sourceIndex['rivalItem2'] = {
            payRate: [],
            tradeIndex: [],
            payByr: [],
            uvIndex: []
        }
    }
    if (data) {
        data.forEach(function (item) {
            var selfBox = sourceIndex.selfItem
            var item1 = item.selfItemPayRateIndex ? item.selfItemPayRateIndex.value : 0
            var item2 = item.selfItemTradeIndex ? item.selfItemTradeIndex.value : 0
            var item3 = item.selfItemPayByrCntIndex ? item.selfItemPayByrCntIndex.value : 0
            var item4 = item.selfItemUv ? item.selfItemUv.value : 0
            selfBox.payRate.push(item1);
            selfBox.tradeIndex.push(item2);
            selfBox.payByr.push(item3);
            selfBox.uvIndex.push(item4);
            if (produceData.rivalItem1Id) {
                var rivalBox = sourceIndex.rivalItem1
                var itemb1 = item.rivalItem1PayRateIndex ? item.rivalItem1PayRateIndex.value : 0
                var itemb2 = item.rivalItem1TradeIndex ? item.rivalItem1TradeIndex.value : 0
                var itemb3 = item.rivalItem1PayByrCntIndex ? item.rivalItem1PayByrCntIndex.value : 0
                var itemb4 = item.rivalItem1Uv ? item.rivalItem1Uv.value : 0
                rivalBox.payRate.push(itemb1);
                rivalBox.tradeIndex.push(itemb2);
                rivalBox.payByr.push(itemb3);
                rivalBox.uvIndex.push(itemb4);
            }
            if (produceData.rivalItem2Id) {
                var rival2Box = sourceIndex.rivalItem2
                var itemc1 = item.rivalItem2PayRateIndex ? item.rivalItem2PayRateIndex.value : 0
                var itemc2 = item.rivalItem2TradeIndex ? item.rivalItem2TradeIndex.value : 0
                var itemc3 = item.rivalItem2PayByrCntIndex ? item.rivalItem2PayByrCntIndex.value : 0
                var itemc4 = item.rivalItem2Uv ? item.rivalItem2Uv.value : 0
                rival2Box.payRate.push(itemc1);
                rival2Box.tradeIndex.push(itemc2);
                rival2Box.payByr.push(itemc3);
                rival2Box.uvIndex.push(itemc4);
            }

        })
    }
    return sourceIndex
}
function filterMarketShop(data) {
    if (data) {
        data.forEach((item) => {
            var va1 = item.payRateIndex ? item.payRateIndex.value : 0;
            var va2 = item.tradeIndex ? item.tradeIndex.value : 0;
            var va3 = item.payByrCntIndex ? item.payByrCntIndex.value : 0;
            var va4 = item.uvIndex ? item.uvIndex.value : 0;
            var va5 = item.seIpvUvHits ? item.seIpvUvHits.value : 0;
            var va6 = item.cartHits ? item.cartHits.value : 0;
            var va7 = item.cltHits ? item.cltHits.value : 0;
            responseData.payRate.push(va1);
            responseData.tradeIndex.push(va2);
            responseData.payByr.push(va3);
            responseData.uvIndex.push(va4);
            responseData.seIpv.push(va5);
            responseData.cartHit.push(va6);
            responseData.cltHit.push(va7);
        });
    }
}

function marketTableShop(finaData, who) {
    var res = responseData
    var totalCont = dataWrapper['marketShop'].total
    var resData = []
    var length = res.payRate.length
    for (var i = 0; i < length; i++) {
        var trandeOver = res.tradeIndex[i] != '超出范围,请使用插件最高支持7.8亿' ? res.tradeIndex[i] : '-'
        var computedNum = computedPayByr(res.uvIndex[i], res.payRate[i], trandeOver)
        var obj = {
            shop: {}
        }
        var cateRnkId = finaData[i].cateRankId
        if (who) {
            obj.shop = {
                title: finaData[i].item.title,
                url: finaData[i].item.pictUrl
            }
        } else {
            obj.shop = {
                title: finaData[i].shop.title,
                url: finaData[i].shop.pictureUrl
            }
        }
        obj.cate_cateRankId = cateRnkId ? cateRnkId.value : '-'
        obj.tradeIndex = trandeOver
        obj.uvIndex = res.uvIndex[i]
        obj.seIpv = res.seIpv[i]
        obj.cltHit = res.cltHit[i]
        obj.cartHit = res.cartHit[i]
        obj.payByr = res.payRate[i]
        obj.payRate = computedNum.res1
        obj.kdPrice = computedNum.res2
        obj.uvPrice = formula(trandeOver, res.uvIndex[i], 1)
        obj.searRate = formula(res.seIpv[i], res.uvIndex[i], 2)
        obj.scRate = formula(res.cltHit[i], res.uvIndex[i], 2)
        obj.jgRate = formula(res.cartHit[i], res.uvIndex[i], 2)
        resData.push(obj)
    }
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
    return resData
}
function marketRankType(url) {
    var res = ''
    if (url.match('item')) {
        res = 'item'
    } else if (url.match('shop')) {
        res = 'shop'
    } else if (url.match('brand')) {
        res = 'brand'
    }
    return res
}
function filterMarketHot(data) {
    var obj = {
        tradeIndex: []
    }
    if (data) {
        data.forEach((item) => {
            obj.tradeIndex.push(item.tradeIndex.value)
        });
        return obj
    }
}
function filterMarketHotsale(data) {
    var res = {
        tradeIndex: [],
        payRate: []
    }
    if (!data.length) {
        return []
    }
    data.forEach(function (item) {
        res.tradeIndex.push(item.tradeIndex.value)
        res.payRate.push(item.payRateIndex.value)
    })
    return res
}
function filterMarketHotsearch(data) {
    var res = {
        seIpv: [],
        uvIndex: [],
        tradeIndex: []
    }
    if (!data.length) {
        return []
    }
    data.forEach(function (item) {
        res.tradeIndex.push(item.tradeIndex.value)
        res.seIpv.push(item.seIpvUvHits.value)
        res.uvIndex.push(item.uvIndex.value)
    })
    return res
}
function filterMarketHotpurpose(data) {
    var res = {
        cartHit: [],
        cltHit: [],
        tradeIndex: []
    }
    if (!data.length) {
        return []
    }
    data.forEach(function (item) {
        res.tradeIndex.push(item.tradeIndex.value)
        res.cartHit.push(item.cartHits.value)
        res.cltHit.push(item.cltHits.value)
    })
    return res
}
function fliterSingleCompete(data) {
    if (!data) {
        return ''
    }
    var res = {
        payRate: [],
        tradeIndex: [],
        payByr: [],
    }
    data.forEach(function (item) {
        var itemb1 = item.rivalItem1PayRateIndex ? item.rivalItem1PayRateIndex.value : 0
        var itemb2 = item.rivalItem1TradeIndex ? item.rivalItem1TradeIndex.value : 0
        var itemb3 = item.rivalItem1PayByrCntIndex ? item.rivalItem1PayByrCntIndex.value : 0
        res.payRate.push(itemb1);
        res.tradeIndex.push(itemb2);
        res.payByr.push(itemb3);
    })
    return res
}
function getItemId(para) {
    var ids = {}
    if (para) {
        var urlParams = para.split('?')[1];
        var paraArr = urlParams.split('&');
        paraArr.forEach(function (item) {
            var itemArr = item.split('=')
            if (itemArr[0] == 'selfItemId' && itemArr[1]) {
                ids['selfItemId'] = itemArr[1]
            } else if (itemArr[0] == 'rivalItem1Id' && itemArr[1]) {
                ids['rivalItem1Id'] = itemArr[1]
            } else if (itemArr[0] == 'rivalItem2Id' && itemArr[1]) {
                ids['rivalItem2Id'] = itemArr[1]
            }
        })
    }
    return ids
}
function getParamsItem(para, com, trend) {
    var keyObj = {}
    var key = ''
    if (!para) {
        return ''
    }
    var params = para.split("?")[1]
    var paraArr = params.split('&');
    paraArr.forEach(function (item) {
        var itemArr = item.split('=')
        keyObj[itemArr[0]] = itemArr[1]
    })
    localStorage.setItem('shopCateId', keyObj['cateId'])
    keyObj['dateRange'] = keyObj['dateRange'] ? decodeURIComponent(keyObj['dateRange']) : '';
    if (com == 'com') {
        var item1 = keyObj['rivalItem1Id'] ? ('&rivalItem1Id=' + keyObj['rivalItem1Id']) : '';
        var item2 = keyObj['rivalItem2Id'] ? ('&rivalItem2Id=' + keyObj['rivalItem2Id']) : '';
        var self = keyObj['selfItemId'] ? ('&selfItemId=' + keyObj['selfItemId']) : '';
        key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + item1 + item2 + self
    } else if (com == 'only') {
        key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&itemId=' + keyObj['itemId']
    } else if (com == 'trendShopInfo') {
        var choosId = trend == 'item' ? 'itemId' : trend == 'shop' ? 'userId' : 'brandId'
        key += 'cateId=' + keyObj['firstCateId'] + '&userId=' + keyObj[choosId]
    } else if (com == 'trend') {
        var choosId = trend == 'item' ? 'itemId' : trend == 'shop' ? 'userId' : 'brandId'
        key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&sellerType=' + keyObj['sellerType'] + '&userId=' + keyObj[choosId]
    } else {
        key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&page=' + keyObj['page'] + '&pageSize=' + keyObj['pageSize'] + '&sellerType=' + keyObj['sellerType']
    }
    return key
}
chrome.runtime.sendMessage({
    type: 'listenContat'
}, function () { })
function getCookie(keyword, sendResponse) {
    $(".oui-date-picker .oui-canary-btn:contains('7天')").click()
    chrome.storage.local.get('transitId', function (val) {
        var timeRnage = $('.ebase-FaCommonFilter__root .oui-date-picker .oui-date-picker-current-date').text()
        var spliteTime = timeRnage.split(' ')
        var splitLen = spliteTime.length;
        var finalTime = ''
        if (splitLen == 3 || splitLen == 2) {
            finalTime = spliteTime[1] + '|' + spliteTime[1]
        } else if (splitLen == 4) {
            finalTime = spliteTime[1] + '|' + spliteTime[3]
        }
        var searchUrl = 'https://sycm.taobao.com/mc/searchword/relatedWord.json?dateRange=' + encodeURIComponent(finalTime) + '&dateType=recent7&pageSize=10&page=1&order=desc&orderBy=tradeIndex&keyword=' + encodeURIComponent(keyword) + '&device=0'
        var hasSaveData = localStorage.getItem('chaqz_search_keywords?' + finalTime + "&keywords=" + keyword)
        if (hasSaveData) {
            sendResponse(Decrypt(hasSaveData))
            return false
        }
        $.ajax({
            url: searchUrl,
            type: 'GET',
            headers: {
                "transit-id": val.transitId
            },
            success: function (res) {
                var resultData = res.data ? Decrypt(res.data) : '';
                localStorage.setItem('chaqz_search_keywords?' + finalTime + "&keywords=" + keyword, res.data)
                sendResponse(resultData)

            }
        })
    })
}