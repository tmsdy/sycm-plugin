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
// 对应模块数据存储
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
    'compareSelfList':{
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
}
var isRecently = false //是否为最新版本
// var dateType = 'today' //选择时间
var tableInstance = null //table实例对象
var isLogin = false  //是否登录
var VERSION = '1.2.0' //版本号
var BASE_URL = 'http://116.62.18.166:8090'
// var BASE_URL = 'http://www.chaquanzhong.com'
var SAVE_MEMBER = {}
var SAVE_BIND = {}
var PLAN_LIST = []
  // 触发数据监听
  chrome.runtime.sendMessage({
              type: 'hello',
              fitlerArr: dataWrapper
          }, function (response) {});
   // 判断是否登录
 chrome.storage.local.get('chaqz_token', function (valueArray) {
     var tok = valueArray.chaqz_token;
     if(tok){
         localStorage.setItem('chaqz_token', tok)
         isLogin = true;
        //  userInfoRes()
     }else{
         isLogin = false
     }
 })
//  判断是否首次安装
clearLocalstorage()
//  市场搜索分析关键词
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'secahKeywords'){
         getCookie(request.keywords, sendResponse)
    }
    return true
})

$(function () {
    // 登录
    $(document).on('click', '#loginbtn',function(){
        anyDom.init()
        return false
    })
    //更新用户信息
    userInfoRes()
    // 个人信息
    $(document).on('click', '#userBtn', function () {
        anyDom.getInfo()
        return false
    })
    /**竞争模块添加事件 */
    $('#app').on('DOMNodeInserted', function (e) {
        // console.log(e.target.id, ',', e.target.className)
        if (e.target.className == 'oui-index-picker') { //竞争-监控店铺
            $('.mc-shopMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
        }
        if (e.target.className == 'oui-index-picker-group') { //竞争-监控商品
            $('.mc-ItemMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
        }
        if (e.target.id == 'itemAnalysisTrend') { //竞争-分析竞品
            $('.op-mc-item-analysis #itemAnalysisTrend .oui-card-header').append(showBtn())
        }
        if (e.target.id == 'sycm-mc-flow-analysis') { //竞争-分析竞品-入口来源
            $('.sycm-mc-flow-analysis .oui-card-header').append(showBtn())
        }
         if (e.target.className == 'mc-marketMonitor') {
             $('.mc-marketMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
             // $('#app').off('DOMNodeInserted')
         }
         if (e.target.className == 'tree-menu common-menu tree-scroll-menu-level-2') {
             $('.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right').prepend(showBtn())
         }
         //市场排行类
         if (e.target.className == 'industry-tab-index') {
             $('.op-mc-market-rank-container  .oui-card-header-wrapper .oui-card-header').append(showBtn())
         }
         if (e.target.className == 'oui-index-picker-group') {
             if ($('.op-mc-market-rank-container .oui-card-header .chaqz-btns').length > 0) {
                 return false
             }
             $('.op-mc-market-rank-container .oui-card-header').append(showBtn())
         }
    })
    //竞争-监控店铺
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
            ]
            domStruct({
                data: resData,
                cols: cols
            }, '监控店铺')
        })
    })
    //竞争-监控商品
    $(document).on('click', '.mc-ItemMonitor #search', function () { 
        //  if (!isNewVersion()) {
        //      return false
        //  }
        MonitorItem('page')
    })
    //竞争-分析竞品
    $(document).on('click', '#itemAnalysisTrend .oui-card-header #search', function () { 
        // if (!isNewVersion()) {
        //     return false
        // }
        var productInfo = getProductInfo()
        if (productInfo.totalNum < 2) {
            alert('请选择比较商品')
            return false
        }
        var idParams = getproduceIds(productInfo)
        var fontKey = getSearchParams('monitCompareFood').split('&page')[0]
        var fontKey = getSearchParams('monitCompareFood').split('&page')[0]
        var fact = $('#itemAnalysisTrend .ant-select-selection-selected-value').attr('title')
        var device = fact == '所有终端' ? '0' : fact == 'PC端' ? '1' : fact == '无线端' ? '2' : ''
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
                    var isNumber = isNaN(rateNum)
                    obj.tradeIndex = Math.round(res.tradeIndex[i])
                    obj.uvIndex = Math.round(res.uvIndex[i])
                    obj.payRate = !isNumber ? (rateNum.toFixed(2) + '%') : "-";
                    obj.payByr = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num1
                    obj.kdPrice = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num2
                    obj.uvPrice = formula(res.tradeIndex[i], res.uvIndex[i], 1)
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
    })
    //竞争-分析竞品-入口来源
    $(document).on('click', '#sycm-mc-flow-analysis .oui-card-header #search', function () { 
        // if (!isNewVersion()) {
        //     return false
        // }
        var productInfo = getProductInfo()
        if (productInfo.ispass) {
            alert('请选择比较商品')
            return false;
        }
        var idParams = getproduceIds(productInfo)
        var fontKey = getSearchParams('monitResource').split('&page')[0]
        var fontKey = getSearchParams('monitResource').split('&page')[0]
        var fact = $('#sycm-mc-flow-analysis .ant-select-selection-selected-value').attr('title')
        var device = fact == '所有终端' ? '0' : fact == 'PC端' ? '1' : fact == '无线端' ? '2' : ''
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
        tableInstance = null
    })
    //一键加权
    $(document).on('click', '#vesting', function () { 
        var reg = /https:\/\/sycm\.taobao\.com\/mc\/ci\/item\/analysis/;
        var currentUrl = window.location.href
        var matchUrl = reg.test(currentUrl)
        if (!matchUrl) { // 判断是否为精品分析页面
            popUp.init('goChoose')
            return false
        }
        //  if (!isNewVersion()) {
        //      return false
        //  }
        var productInfo = getProductInfo()
        if ((productInfo.rivalItem1.title && productInfo.rivalItem2.title) || (!productInfo.rivalItem1.title && !productInfo.rivalItem2.title)) {
            popUp.init('onlyOne')
            return false
        }
        var saveToke = localStorage.getItem('chaqz_token')
        chrome.runtime.sendMessage({
            key:'getData',
            options:{
                url: BASE_URL + '/api/v1/plugin/planData',
                type:"GET",
                 headers: {
                     Authorization: "Bearer " + saveToke
                 }
            },
        },function(val){
            if(val.code==200){
                popUp.init("selectPlan", val.data)
                PLAN_LIST = val.data
            }else if(val.code == 4001){
                popUp.init("selectPlan")
            }else if (val.code == 2030) {
                 LogOut()
            }else{
                popTip('获取计划列表失败，请重试')
            }
        })
    })
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
    //市场监控店铺 商品
    $(document).on('click', '.mc-marketMonitor #search', function () { 
        // if (!isNewVersion()) {
        //     return false
        // }
        marketMonitorShop("page")
    })
    //热门店铺、商品
    $(document).on('click', '.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right #search', function () { 
        // if (!isNewVersion()) {
        //     return false
        // }
        marketMonitorItem('pageType')
    })
    // 市场排行
     $(document).on('click', '.op-mc-market-rank-container #search', function () {
        //  if (!isNewVersion()) {
        //      return false
        //  }
         marketRank('pagetype')
     })
    //  趋势分析
    $(document).on('click', '.op-mc-market-rank-container .alife-dt-card-common-table-right-column', function (e) { //趋势分析
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
            LoadingPop('show')
            var trendFont = getSearchParams("allTrend",null,null,'type')
            var trendKey = switchType + '/' + trendFont + '&userId=' + useId
            var firstCateId =  getFirstCateId()
            var shopInfoKey = switchType + "/trendShopcateId=" + firstCateId + '&userId=' + useId
            var shopInfo = JSON.parse(localStorage.getItem(shopInfoKey))
            var localTrendData = JSON.parse(localStorage.getItem(trendKey))
             dealIndex({
                 type: 'dealTrend',
                 dataType: localTrendData
             }, function (val) {
                  var resData = []
                  var res= val.value
                  for (var i = 0; i < 30; i++) {
                    var eDateArr = getDateArr(new Date(), 'simple')
                    var tableDateArr = getDateArr(new Date(), 0)
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
                  var cols = [
                      {
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
})
//竞争模块table
function domStruct(data, title) {
    var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
    var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span></div></div>'
    $('#app').append(wrapper)
    $('#chaqz-table').DataTable({
        // destroy: true,
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
    // $('.chaqz-wrapper').fadeIn(100);
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
        // "scrollX": true,
        //  "scrollY": "630px",
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
                // 监听消息 
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
             }else{
                 // 监听消息
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
            if(hasSave){
                MonitorItem()
            }else{
            // 监听消息
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
// 趋势table
 function domStructTrend(data, title, eDate,edata) {
     var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">趋势分析</span></div><div><img src="' + title.picUrl + '"><span>' + title.name + '</span></div></div><div id="chaqzx-echarts-wrap"></div><div class="table-box"><table id="chaqz-table-trend" class="trend-table"></table></div></div><span class="chaqz-close">×</span></div></div>'
     $('#app').append(wrapper)
     $('#chaqz-table-trend').DataTable({
         // destroy: true,
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
                 title: title.name+'-趋势分析',
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
        //   title: {
        //       text: '趋势分析',
        //       left: '100px'
        //   },
          tooltip: {
              trigger: 'axis'
          },
          toolbox: {
              show: true
          },
          legend: {
              data: ['访客人数', '支付转化率', '交易金额', '支付人数'],
              right:'5%'
          },
          grid:{
            //   width: '100%',
              right:'5%',
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
/**------ 登录模块-------------------*/
var  anyDom = {
    loginDom: '<div class="chaqz-info-wrapper login"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><div class="formList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><div class="phone"><input id="phone" type="text" placeholder="请输入手机号码"><p class="tips">请输入手机号码</p></div><div class="pwd"><input id="pwd" type="password" placeholder="请输入登录密码"><p class="tips">请输入登录密码</p></div><div class="router"><a href="' + BASE_URL + '/reg" class="right" target="_blank">免费注册</a><a href="' + BASE_URL + '/findP" target="_blank">忘记密码</a></div><button class="orange-default-btn login-btn">登录</button></div></div></div>',
    infoDom: function (memInfo,bindedInfo) {
        var acct = memInfo.username;
        var title = memInfo.member.title;
        var expirTime = memInfo.member.expireAt;
        var whetherOrder='';
        var binded = '未绑定';
        var shopInfo = dealShopInfo();
        if (title && expirTime){
            var formDate = new Date(expirTime)
            var isExpire = formDate - memInfo.time*1000
            if (isExpire>0){
                whetherOrder = '续费';
            }else{
                whetherOrder = '订购';
            }
            bindedInfo.data.forEach(function (item) {
                if (item['mainUid'] = shopInfo['mainUserId']) {
                    binded = "已绑定"
                }
            })
        }else{
            title = '普通会员';
            expirTime = '--';
            whetherOrder = '订购'
            binded= '未绑定'
        }
         var wrap = '<div class="chaqz-info-wrapper user"><div class="c-cont"><span class="close2 hided">×</span><div class="help"><img src="https://file.cdn.chaquanzhong.com/wenhao.png" alt="?"><a href="'+BASE_URL+'/pluginIntro" target="_blank">帮助</a></div><div class="infoList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><ul class="user-list"><li><span class="name">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:</span><span>' + acct + '</span><span class="fr" id="logout">退出登录</span></li><li><span class="name">会员信息:</span><span>' + title + '</span></li><li><span class="name">到期时间:</span><span>' + expirTime + '</span><a href="'+BASE_URL+'/homePage?from=plugin" target="_blank" class="fr">' + whetherOrder + '</a></li><li><span class="name">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span><span>' + VERSION + '</span></li><li><span class="name">联系客服:</span><span><a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><img class="mr_10" src="https://file.cdn.chaquanzhong.com/qq_icon.png" alt="qq"></a><img src="https://file.cdn.chaquanzhong.com/wx_icon.png" alt="wx" class="wxpop"></span></li><li><span class="name">店铺绑定</span><span>' + binded + '</span></li></ul></div></div></div>';
         $('#app').append(wrap);
        
    } ,
    login:function(){
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
                  // localStorage.setItem('chaqz_member', JSON.stringify(member))
                  chrome.storage.local.set({
                      'chaqz_token': token
                  }, function () {});
                 isLogin = true;
                 _that.getShopBind()
                    changeLoginStatus()
                 $('.chaqz-info-wrapper.login').remove();
                //  versionCheck(3)
             } else {
                 $('.chaqz-info-wrapper.login .pwd .tips').text('账号或密码错误').show()
                 onLoading = false
             }
         })
    },
    init:function(){
        var _that = this
        $('#app').append(this.loginDom);
        $(document).on('blur', '.chaqz-info-wrapper #phone', function () {
           var phoneVal=  $(this).val()
           var phoneReg = /^1[34578]\d{9}$/;
           if(!phoneVal){
            $(this).siblings('.tips').text('请输入手机号码').show()
           } else if (!phoneReg.test(phoneVal)) {
            $(this).siblings('.tips').text('请输入正确号码').show()
           } else{
               $(this).siblings('.tips').hide()
           }
        })
        $(document).on('blur', '.chaqz-info-wrapper #pwd', function () {
           var pwdValue=  $(this).val()
            if (!pwdValue) {
               $(this).siblings('.tips').text('请输入密码').show()
           }else{
                $(this).siblings('.tips').hide()
           }
        })
        // 登录处理
        $(document).on('click', '.chaqz-info-wrapper .login-btn',function(){
           _that.login()
        })
         //回车搜索
         $('.chaqz-info-wrapper #pwd').bind('keydown', function (event) {
             var evt = window.event || event;
             if (evt.keyCode == 13) {
                 _that.login()
             }
         });
        // 关闭登录弹窗
        $(document).on('click', '.chaqz-info-wrapper .hided', function () {
            $('.chaqz-info-wrapper.login').remove()
        })
    },
    getShopBind:function(){
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
    getInfo:function(){
        var userWrap = $('.chaqz-info-wrapper.user')
        if (userWrap.length){
            userWrap.show()
        }else{
                var memInfo = SAVE_MEMBER;
                var bindInfo = SAVE_BIND;
                if (memInfo.token) {
                    this.infoDom(memInfo, bindInfo)
                }else{
                    popUp.init('noShopInfo')
                }
            $(document).on('click', '.chaqz-info-wrapper .hided', function () {
                $('.chaqz-info-wrapper.user').hide()
            })
            $(document).on('click', '#logout', function () {
                $('.chaqz-info-wrapper.user').hide();
                changeLoginStatus('out')
                // $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>')
                chrome.storage.local.clear(function () {
                });
                localStorage.removeItem('chaqz_token')

            })
            $(document).on('click', '.chaqz-info-wrapper.user .wxpop', function () {
                $('.chaqz-info-wrapper.user').hide()
               popUp.init('weixin')
            })
        }
    }
}
// 显示按钮切换
function showBtn(){
    var reDom = '';
    if (isLogin){
       reDom = '<div class="chaqz-btns btnsItem1"><button id="search" class="serachBtn">一键转化</button><button id="userBtn" class="serachBtn user">用户信息</button><button id="vesting" class="serachBtn vesting">一键加权</button><div>'
    }else{
        reDom = '<div class="chaqz-btns btnsItem1"><button id="loginbtn" class="serachBtn user">登录</button><div>'
    }
    return reDom
}
// 登录状态切换
function changeLoginStatus(type) {
    if(type == 'out'){
        $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>')
    }else{
        $('.chaqz-btns').html('<button id="search" class="serachBtn">一键转化</button><button id="userBtn" class="serachBtn user">用户信息</button><button id="vesting" class="serachBtn vesting">一键加权</button>')
    }
}
//check is pass
function isNewVersion() {
    // if (CHAQZ_VERSION != '1.0.5') {
    //     popUp.init('version')
    //     return false
    // }
    // } else{
        var allInfo = SAVE_MEMBER
        if(!allInfo){
            popUp.init('noShopInfo');
            return false;
        }
        var memInfo = allInfo.member;//会员信息
        var bindInfo = SAVE_BIND; //绑定信息
        var shopInfo = dealShopInfo(); //店铺信息


        if (!memInfo.level) { //不是否为会员
            popUp.init('orderMem')
            return false;
        }
         var star_time = allInfo.time
         var star_end = memInfo.expireAt
         var remian = new Date(star_end) - star_time * 1000
        if (remian <= 0) { //会员过期
            popUp.init('overdue')
            return false;
        }
        var hasBind = bindInfo.data.length //已绑定数量
        var totalBind = bindInfo.count //可绑定数量
        // if (hasBind > 0) { //店铺绑定
            var isSelf = false
            var isClose = false
            var activeNum = 0
            bindInfo.data.forEach(function (item) {
                if (item['runShopId'] == shopInfo['runAsShopId']) {
                    isSelf = true
                    isClose = item['closed']
                }
                if (item['closed']==0) {
                    activeNum++
                }
            })
            if (!isSelf) {// 不是本店铺
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
            if (isClose==0){//激活
                return true;
            }
            if (activeNum < totalBind){//未达激活上限
                popUp.init('active2')
                return false
            }
            if (memInfo.level < 4){
                popUp.init('upLimit')
                return false
            }
            popUp.init('bindLimit')
            return false
}
// 退出登录
function LogOut(){
    isLogin = false;
    changeLoginStatus('out')
    chrome.storage.local.clear(function () {});
    localStorage.removeItem('chaqz_token')
    LoadingPop()
}
// 弹窗模块
var popUp={
    version: '<p class="tips">当前插件已更新，请到官网下载最新版本。</p><div class="cha-btns"><a class="btn" href="'+BASE_URL+'/pluginIntro" target="_blank"><button class="btn">前往下载</button></a></div>',
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
    selectPlan: function (data) {
        var html = '';
        if(data){
            data.forEach(function (item) {
                html += '<option value="' + item.title + '">' + item.title + '</option>'
            })
        }else{
            html += '<option value="0">请选择</option>'
        }
      return '<p class="head-title">加入加权计划</p><div class="form-list"><div><span>计划名称</span><select class="selcet" placeholder="请选择">' + html + '</select></div><p class="ctPlan">创建新计划</p></div><div class="cha-btns"><button id="vestBtn" class="btn">确定</button></div>';
    },
    createPlan: '<p class="head-title" id="giveupPlan">新建计划</p><div class="form-list"><div class="item"><span>计划目的</span><select class="selcet"><option value="新品">新品</option></select></div><div><span>计划名称</span><input type="text" class="editor selcet" placeholder="请输入计划名称"></div></div><div class="cha-btns"><button class="btn planBtn">确定</button></div>',
    active2:function(){
        var bindList = SAVE_BIND.data;
        var len = bindList.length;
        var html = '';
        for(var i=0;i<len;i++){
            if (bindList[i]){
                var isClosed = bindList[i].closed
                var name = bindList[i].mainUname
                var hasClose = isClosed == 1 ? '未激活' : '已激活';
                var status = isClosed == 1 ? '' : 'checked disabled';
                var runShopId = bindList[i].runShopId;
                var hasActive = isClosed == 1 ? '' : 'chose';
                var order = i + 1
                var idNum = 'label'+order
                html += '<tr><td><label for="' + idNum + '" class="' + hasActive + '"></label><input id=' + idNum + ' type="checkbox" ' + status + ' data-id="' + runShopId + '" hidden><span class="num">' + order + '</span></td><td>' + name + '</td><td>' + hasClose + '</td></tr>'
            }
        }
        var ret = '<div class="chaqz-info-wrapper pop"><div class="c-cont"><span class="close hides" click="hideInfo">×</span><div class="alert"><div class="table-wrap"><table><thead><tr><td>序号</td><td>店铺名</td><td>状态</td></tr></thead><tbody>' + html + '</tbody></table></div><div class="cha-btns"><button class="btn activeShop">激活</button></div><p class="foot-tips">如有绑定疑问，请<a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes">联系客服</a></p></div></div></div>'
        //  $('#app').append(ret)
        return ret
    },
    init:function(type,data){
        if ($('.chaqz-info-wrapper.pop').length) {
            this.changeDom(type,data)
            return false
        }
        var wrapFont = '<div class="chaqz-info-wrapper pop"><div class="c-cont"><span class="close hides" click="hideInfo">×</span><div class="alert">'
        var wrapEnd = '</div></div></div>'
        var resultDom = ''
         if (typeof this[type] == 'function') {
             resultDom = this[type](data)
         }else{
             resultDom = this[type]
         }
        var _html = wrapFont + resultDom + wrapEnd;
        var _that = this
        $('#app').append(_html)
        // 事件加载
        $('.chaqz-info-wrapper.pop').on('click', '.hides', function () {
            //c创建计划弹窗
            var hidePlan = $('.chaqz-info-wrapper.pop').find('#giveupPlan')
            if (hidePlan.length){
                _that.init("selectPlan", PLAN_LIST)
                return false
            }
            $('.chaqz-info-wrapper.pop').hide()
        })
        $('.chaqz-info-wrapper.pop').on('click', '.buyBtn', function () {
            window.open(BASE_URL+'/homePage?from=plugin')
            // window.open('http://192.168.2.160:8080/homePage?from=plugin')
            _that.init('orderSucc')
        })
        $('.chaqz-info-wrapper.pop').on('click', '#logout', function () {
            $('.chaqz-info-wrapper.pop').hide();
            changeLoginStatus('out')
            chrome.storage.local.clear(function () {});
            localStorage.removeItem('chaqz_token')
        })
        $('.chaqz-info-wrapper.pop').on('click', '#goBind', function () {//绑定店铺
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
        $('.chaqz-info-wrapper.pop').on('click', '#pageRefresh', function () {//刷新
            window.location.reload();
        })
        $('.chaqz-info-wrapper.pop').on('change', '.table-wrap input',function(){//判断是否达到帮I定上限
            var checkNum = $('.chaqz-info-wrapper.pop input:checked').length;
            var totalBindNum = SAVE_BIND.count;
            if (checkNum > totalBindNum){
                $(this).prop({'checked':false})
                popTip('绑定用户达上限', 'top:10%;')
            }else{
                var isTrue = $(this).prop('checked')
                if(isTrue){
                    $(this).siblings('label').addClass('chose')
                }else{
                     $(this).siblings('label').removeClass('chose')
                }
            }
        })
        $(document).on('click', '.activeShop', function () {
            var activeList = $('.chaqz-info-wrapper.pop input:checked:not(:disabled)')
            var len  = activeList.length;
            var saveToke = localStorage.getItem('chaqz_token');
            if(len){
                var countNum = 0;
                var saveToke = localStorage.getItem('chaqz_token');
                for(var i=0;i<len;i++){
                    var runShopId = $(activeList[i]).data('id')
                     chrome.runtime.sendMessage({
                         key: 'getData',
                         options: {
                             url: BASE_URL+'/api/v1/plugin/shop',
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
                         if(res.code == 200){
                            popTip('激活成功','top:10%;');
                         }else{
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
        $(document).on('click', '.chaqz-info-wrapper.pop .ctPlan',function(){
            _that.init('createPlan')
        }) 
        $(document).on('blur', '.chaqz-info-wrapper.pop .editor', function () {
            if($(this).val().length>8){
                $(this).val($(this).val().slice(0,8))
                popTip('最多可输入8个汉字','top:10%;')
                return false
            }
        }) 
         $('.chaqz-info-wrapper.pop').on('click', '.planBtn', function () { //生成计划
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
         $('.chaqz-info-wrapper.pop').on('click', '#vestBtn', function () { //加权计划
            LoadingPop('show')
            var planName = $('.chaqz-info-wrapper.pop .form-list .selcet').val()
            var selectPlan = _that.chosePlan(PLAN_LIST,planName)
            if(planName == 0){
                LoadingPop()
                popTip('请选择计划', 'top:10%;')
                return false}
            var timer = null;
            var countNum = 0;
            $(".oui-date-picker .oui-canary-btn:contains('7天')").click()
            var productInfo = getProductInfo()
            var idParams = getproduceIds(productInfo)
            var fontKey = getSearchParams('monitCompareFood').split('&page')[0]
            var fact = $('#itemAnalysisTrend .ant-select-selection-selected-value').attr('title')
            var device = fact == '所有终端' ? '0' : fact == 'PC端' ? '1' : fact == '无线端' ? '2' : '';
            var recent7Key = fontKey + device + idParams
            // 判断本地是否缓存
            if (localStorage.getItem(recent7Key)) {
                _that.getDay(productInfo, recent7Key, selectPlan)
            }else{
                timer = setInterval(function(){
                    countNum++;
                    if (localStorage.getItem(recent7Key)){
                        clearInterval(timer)
                        timer = null;
                        _that.getDay(productInfo, recent7Key, selectPlan)
                         
                    } else if (countNum>10){
                        clearInterval(timer)
                        timer = null;
                        popTip('获取指数数据失败！', 'top:10%;')
                        LoadingPop()
                    }
                },500)
            }
         })
    },
    getDay: function (productInfo, key , planName) {
        var timer = null;
        var countNum = 0;
        var _that = this;
         dealIndex({
             type: 'monitCompareFood',
             dataType: key
         }, function (res) {
            $(".oui-date-picker .oui-canary-btn:contains('日')").click()
            // 判断屏幕高度以及是否要滑动
            var cltHeight = window.innerHeight;
            var remianHei = 900 - cltHeight;
            if (remianHei > 0) {
                $(document).scrollTop(remianHei)
            }
            var wordsIds = getproduceIds(productInfo, 'idObj')
            var keyWrap = $('.op-mc-item-analysis #itemAnalysisKeyword')
            if (!keyWrap.length) {return false}
            $("#itemAnalysisKeyword .oui-tab-switch-item:contains('成交关键词')").click()
            var wordsfontKey = getSearchParams('getKeywords', 1, 20).split('&page')[0];
            var wordsfact = $('#itemAnalysisKeyword .ant-select-selection-selected-value').attr('title');
            var wordsdevice = wordsfact == '所有终端' ? '0' : wordsfact == 'PC端' ? '1' : wordsfact == '无线端' ? '2' : '';
            var itemWho = wordsIds.item1.itemId ?'item1':'item2'
            var dayParam = itemWho == 'item1' ? ('&itemId=' + wordsIds.item1.itemId) : ('&itemId=' + wordsIds.item2.itemId)
            var dayKey = wordsfontKey + wordsdevice + dayParam
            if (localStorage.getItem(dayKey)) {
                _that.sendResponseData(wordsIds, itemWho, res, localStorage.getItem(dayKey), planName)
            }else{
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
        keywordsList.selfItem = wordsIds.self ? wordsIds.self:{};
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
        if (!keywordsList.keywords.length){
              chrome.storage.local.set({
                  'compareProduceData': keywordsList
              }, function () {
                  $('.chaqz-info-wrapper.pop').fadeOut(100)
                //   window.open('http://192.168.2.162:3000/privilgeEscala')
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
                    // window.open('http://192.168.2.162:3000/privilgeEscala')
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
            //判断是否创建过的计划
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
        //关键词筛选
        if (!data) {
            return []
        }
        var resBox = []
        data.forEach(function (item) {
            if (item.tradeIndex.value > 100 && item.tradeIndex.value<450){
            resBox.push(item.keyword.value)
            }
        })
        return resBox
    },
    chosePlan: function (data, aim) {
        //选择计划项
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
        //弹窗存在更换内容
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
                if(key=='payRate'){
                    item=item?item/100:''
                }
                result['item' + index][key] = item ? item : ''
            })
        }
        return result
    }
}
// 更新用户信息
function userInfoRes(){
    var saveToke =localStorage.getItem('chaqz_token')
    anyDom.getShopBind()
    chrome.runtime.sendMessage({
        key: 'getData',
        options: {
            url: BASE_URL + '/api/v1/user/userinfo',
            type: 'GET',
            headers:{
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
function popTip(text,style,time){
    var st = style?style:''
    // var tm = time?time: 500
 $('#app').append('<div class="small-alert" style="' + style + '">' + text + '</div>');
 setTimeout(function () {
     $('#app .small-alert').fadeOut(300)
 }, 500)
}
// loading
function LoadingPop(status){
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
// 获取店铺信息的firstCateId
function getFirstCateId(){
    var deaultId = localStorage.getItem('shopCateId');
    var cateIdF = JSON.parse(localStorage.getItem('tree_history_op-mc._cate_picker'));
    var cateIdS = cateIdF.split("|")[1];
    var cateIdT = cateIdS ? JSON.parse(cateIdS).value : '';
    if (!cateIdT) {
        return deaultId
    }
    var resData = ''
    cateIdT.forEach(function (item) {
        if (item.realObj.cateId == deaultId) {
            resData = item.realObj.cateLevel1Id;
        }
    })
    return resData
}
// 清除缓存
function clearLocalstorage(){
    if(!localStorage.getItem('isFirstInstallPlugin')){
        localStorage.clear();
        localStorage.setItem('isFirstInstallPlugin','hasInstall')
    }
}
/**===========================市场竞争数字格式化方法以及页面信息======================================= */
// 店铺信息处理了
function dealShopInfo(){
    var info = dataWrapper.shopInfo.data
    var localShop = localStorage.getItem('chaqz_shopInfo')
    if (info.length) {
        var ret = JSON.parse(info).data
        return ret
    }
    if (localShop){
        var resd = JSON.parse(localShop).data
        return resd
    }
}
function getLocalSelfList(){
 var localSelf = JSON.parse(localStorage.getItem('/mc/rivalShop/recommend/item.json'))
 var getLocal = localSelf ? JSON.parse(localSelf.split("|")[1]).value._d : '';
 return Decrypt(getLocal)
}
// 获取竞争分析商品id
function getproduceIds(product,type){
   
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
    for(var i=0;i<selfList.length;i++){
        if (selfList[i].title == product.selfItem.title){
            self = '&selfItemId=' + selfList[i].itemId
            ids.self = selfList[i]
        }
    }
    for (var j = 0; j < mointList.length; j++) {
        if (mointList[j].name == product.rivalItem1.title) {
            ids.item1 = mointList[j]
            item1 ='&rivalItem1Id='+ mointList[j].itemId
        } else if (mointList[j].name == product.rivalItem2.title){
            ids.item2 = mointList[j]
            item2 = '&rivalItem2Id=' +mointList[j].itemId
        }
    }
    if(type=='idObj'){
        return ids
    }else{
        return item1 + item2 + self
    }
}
// 计算公式
function formula(val, val2, type) {
    if (val == "undefined" || val === '' || val == '-' || !val2 || val2 == '-' || val2 == '0') {
        return '-'
    } else {
        val = (val + '').replace(',', '');
        val2 = (val2 + '').replace(',', '')
        if (type == 1) { //四舍五入
            return (Math.round((val / val2) * 100) / 100).toFixed(2)
        } else if (type == 2) { //百分比四舍五入
            return (Math.round((val / val2) * 10000) / 100).toFixed(2) + '%'
        }
    }
}
// 取整/格式化
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
// 返回数据格式修改
function delePoint(val) {
    val = (val + '').replace(',', '')
    if (val.indexOf('%') !== -1) {
        return val.slice(0, -1) / 100
    } else {
        return val
    }

}

//竞品页面判断选择几项了
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
// 获取商品信息
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
// 获取查询项信息
function getSearchParams(key,page,pagesize,dealType){
    // 获取时间范围
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
     var dateType = dayIndex == '实 时' ? 'today' : dayIndex == '7天' ? 'recent7' : dayIndex == '30天' ? 'recent30' : dayIndex == '日' ? 'day' : dayIndex == '周' ? 'week' : dayIndex == '月' ? 'month' : 'today';
    var endpointTyep = $('.ebase-FaCommonFilter__root .fa-common-filter-device-select .oui-select-container-value').html() //终端类型
    var shopType = $('.ebase-FaCommonFilter__root .sellerType-select .ant-select-selection-selected-value').attr('title') //店铺  天猫淘宝
    var timeRnage = $('.ebase-FaCommonFilter__root .oui-date-picker .oui-date-picker-current-date').text()
    var device = endpointTyep == '所有终端' ? '0' : endpointTyep == 'PC端' ? '1' : endpointTyep == '无线端' ? '2' : ''
    var sellType = shopType == '全部' ? '-1' : shopType == '天猫' ? '1' : shopType == '淘宝' ? '0' : ''
    var spliteTime = timeRnage.split(' ')
    var splitLen = spliteTime.length;
    var finalTime = ''
    if (splitLen == 3 || splitLen == 2) {
        finalTime = spliteTime[1] + '|' + spliteTime[1]
    } else if (splitLen == 4) {
        finalTime = dealType ? (spliteTime[3] + '|' + spliteTime[3]) : (spliteTime[1] + '|' + spliteTime[3])
    }
    page = page?page:1;
    pagesize = pagesize?pagesize:10;
    var localCateId = localStorage.getItem('shopCateId')
    if (dealType){
        return key += 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=day'  + '&device=' + device  + '&sellerType=' + sellType
    }
    return key += 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&page=' + page + '&pageSize=' + pagesize + '&sellerType=' + sellType
}

//数据处理-竞品分析
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
        // v2 = v2.slice(0, -1)
        result.num1 = Math.round(v1 * v2 / 100)
        result.num2 = '-';
    } else {
        // v2 = v2.slice(0, -1)
        result.num1 = Math.round(v1 * v2 / 100)
        result.num2 = result.num1 ? Math.round((v3 / result.num1) * 100).toFixed(2) / 100 : '-';
    }
    return result
}
//计算支付人数
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

/**=========================== 市场竞争table数据获取 ======================================= */
    // 监控商品
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
                // visualData.splice((curPage - 1) * curPageSize, curPageSize, resData)
                resData = vStart.concat(resData, vEnd)
            }
            var choseItem = "监控商品"
            var cols = [
                {
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
// listen shop\
function marketMonitorShop(pageType) {
    var chooseTop = $('.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.mc-marketMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
    var backT = chooseTop ? 'marketFood' : 'marketShop';
     var itemKey = getSearchParams(backT, curPage, curPageSize)
     if (backT){
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
                // visualData.splice((curPage - 1) * curPageSize, curPageSize, resData)
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

// hotShop 
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
                    // visualData.splice((curPage - 1) * curPageSize, curPageSize, resData)
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
function dealCycle(data){
    if(!data){return '_'}
    if (data > 0) {
        return '降' + data + "名"
    }else{
        return '升' + (data+'').slice(1) + "名"
    }
}
function dealTradeGrowth(data){
    if(!data){return '-'}
    return  Number(data * 100).toFixed(2)+"%"
}
function marketRank(pageType){
     var chooseItem = $('.op-mc-market-rank-container .oui-card-header-wrapper .oui-tab-switch .oui-tab-switch-item-active').index() //0高交易，1高流量，2高意向
     var chooseList = $('.op-mc-market-rank-container .op-ebase-switch .ebase-Switch__activeItem').index() //0店铺，1商品，2品牌
     var curPage = $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-active').attr('title')
     var curPageSize = $('.op-mc-market-rank-container .oui-page-size .ant-select-selection-selected-value').text()
     curPage = curPage?Number(curPage):1;
     curPageSize = Number(curPageSize)
     var hotType = chooseItem == 1 ? 'hotsearch' : chooseItem == 2 ? 'hotpurpose' : 'hotsale';
     var rankType = chooseList == 1 ? 'item' : chooseItem == 2 ? 'brand' : 'shop';
    var itemKey = getSearchParams(hotType)
     var localData = JSON.parse(localStorage.getItem(rankType+'/'+itemKey))
    var totalCont = localData.length;
    var marketData = localData.slice((curPage - 1) * curPageSize, curPage * curPageSize)
     dealIndex({
                 type: hotType,
                 dataType: marketData
             }, function (val) {
                 var res=val.value
                 var resData = []
                 var length = res.tradeIndex.length
                 for (var i = 0; i < length; i++) {
                     var obj = {
                         shop: {}
                     }
                     obj.shop = {
                         title: marketData[i].shop.title,
                         url: marketData[i].shop.pictureUrl
                     }
                     var cycly = marketData[i].cateRankId.cycleCqc
                     obj.cate_cateRankId = {
                         value: marketData[i].cateRankId.value,
                         cyc: dealCycle(marketData[i].cateRankId.cycleCqc)
                     }
                     if (chooseItem == 0) {
                         obj.tradeIndex = res.tradeIndex[i]
                         obj.growth = dealTradeGrowth(marketData[i].tradeGrowthRange.value)
                         obj.payRate = res.payRate[i]+"%"
                     } else if (chooseItem == 1) {
                         obj.tradeIndex = res.tradeIndex[i]
                         obj.uvIndex = res.uvIndex[i]
                         obj.seIpv = res.seIpv[i]
                         obj.searRate = formula(res.seIpv[i], res.uvIndex[i], 2)
                         obj.uvPrice = formula(res.tradeIndex[i], res.uvIndex[i], 1)
                     } else {
                         obj.tradeIndex = res.tradeIndex[i]
                         obj.cltHit = res.cltHit[i]
                         obj.cartHit = res.cartHit[i]
                     }
                     resData.push(obj)
                 }
                 if(pageType){
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
                 var tableTitle = chooseItem == 1 ? '店铺--高流量' : chooseItem == 2 ? '店铺--高意向' : '店铺--高交易';
                 var cols = []
                 if (chooseItem == 0) {
                     cols = [{
                             data: 'shop',
                             title: '店铺信息',
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
                             title: '店铺信息',
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
                             title: '店铺信息',
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
                 }else{
                 for (var j = 0; j < curPageSize; j++) {
                     tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
                 }
                 $('.chaqz-wrapper .chaqz-mask').hide(100)
                 }
                 })
            //  })

}
// /////////////////////////////////////--------背景数据处理-------//////////////////////////////////////////////
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'holdup') {
            var baseUrl = request.url;
            var resData = request.back;
            if (baseUrl) {
                for (var k in dataWrapper) {
                    if ((new RegExp(dataWrapper[k].urlReg)).test(baseUrl)) {
                        // 根据期限存储数据
                        var hasEncryp = JSON.parse(resData).data;
                        var finaData = (typeof hasEncryp == 'object') ? resData : Decrypt(hasEncryp);
                        if (k == 'monitShop' || k == 'getMonitoredList') {
                            dataWrapper[k].data = finaData;
                            console.log(finaData)
                        } else if ( k == 'shopInfo') {
                             dataWrapper[k].data = finaData;
                            localStorage.setItem('chaqz_' + k, finaData)
                        } else if (k == 'compareSelfList') {
                            localStorage.setItem('chaqz_' + k, finaData)
                        } else if (k == 'monitCompareFood') {
                            var dataTypes = getParamsItem(baseUrl, 'com')
                            localStorage.setItem(k + dataTypes, finaData)
                        } else if (k == 'getKeywords') {
                            if (baseUrl.indexOf("topType=trade")!=-1){
                                var dataTypes = getParamsItem(baseUrl, 'only')
                                localStorage.setItem(k + dataTypes, finaData)
                            }
                        } else if (k == 'monitResource') {
                            var dataTypes = getParamsItem(baseUrl, 'com')
                            localStorage.setItem(k + dataTypes, finaData)
                            // 获取ids
                            dataWrapper[k].ids = getItemId(baseUrl, 'url')
                        } else if (k == 'hotsale' || k == 'hotsearch' || k == 'hotpurpose') {
                            var dataTypes = getParamsItem(baseUrl)
                            var rankKey = marketRankType(baseUrl)
                            var saveData = bubbleSort(finaData)
                            localStorage.setItem(rankKey + '/' + k + dataTypes, saveData)
                        } else if (k == 'allTrend') {
                            var rankKey = marketRankType(baseUrl)
                            var dataTypes = getParamsItem(baseUrl, 'trend', rankKey)
                            localStorage.setItem(rankKey+'/'+k + dataTypes, finaData)
                        } else if (k == 'trendShop') {
                            var rankKey = marketRankType(baseUrl)
                            var dataTypes = getParamsItem(baseUrl, 'trendShopInfo', rankKey)
                            localStorage.setItem(rankKey + '/' + k + dataTypes, finaData)
                        }else {
                            var dataTypes = getParamsItem(baseUrl)
                            localStorage.setItem(k + dataTypes, finaData)
                        }
                    }
                }
            }
            sendResponse('shoudao')
        }
    })
// chrome.runtime.onMessage.addListener(
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
            var moniResData = jsonParse(localStorage.getItem( request.dataType))
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
            var dealTrend =  request.dataType
            for (var key in dealTrend) {
                getAjax(dealTrend[key], key, sendResponse, Object.keys(dealTrend).length, 'dealTrend')
            }
        }
        return true;
    }
    // );
function getAjax(data, type, sendResponse, num, fType, lastData, compareItem) {
    var filterType = (type == 'payRate' || type == 'payRateIndex') ? 1 : type == 'tradeIndex' ? 2 : (type == 'payByr' || type == 'payByrCntIndex') ?
        3: type == 'uvIndex' ? 4 : (type == 'seIpv' || type == 'seIpvUvHits') ? 5 : (type == 'cartHit' || type == 'cartHits') ? 6 : (type == 'cltHit' || type == 'cltHits') ? 7 : '';
        var saveToke = localStorage.getItem('chaqz_token')
        chrome.runtime.sendMessage({
            key:"getData",
            options: {
                url: BASE_URL+'/api/v1/plugin/flowFormula?type=' + filterType,
                type: "POST",
                // async: false,
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
            if(val.code == 200){
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
                 }: fType == 'hotsale' ? {
                     value: responseData
                 }: fType == 'hotsearch' ? {
                     value: responseData
                 }: fType == 'hotpurpose' ? {
                     value: responseData
                 }: fType == 'dealTrend' ? {
                     value: responseData
                 } : '';
                 requestNum = 0 
                 sendResponse(resData)
             }
        })
}

// ------------------------data operator--------------------------------//
// get dataArr
function getDateArr(val) {
    var arr = []
    for (var i = 0; i < 30; i++) {
        var curDate = val - 86400000 * (i + 1)
        arr.push(dateFormat(curDate, 'all'))
    }
    return arr.reverse()
}
//date format
function dateFormat(val, type) {
    var date = new Date(val)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    month = month > 9 ? month : ('0' + month)
    day = day > 9 ? day : ('0' + day)
    if (type) {
        return month + '-' + day
    } else {
        return year + '-' + month + '-' + day
    }
}
// 数据排序
function bubbleSort(data) {
    if(!data){return ''}
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
// 数据转对象
function jsonParse(data, type) {
    if (!data) {
        return ''
    } else {
        var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
        var orignData = JSON.parse(data)
        var finalData = dayIndex != '实 时' ? orignData:orignData.data.data ? orignData.data.data : orignData.data
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
      var key = CryptoJS.enc.Utf8.parse("sycmsycmsycmsycm"); //十六位十六进制数作为密钥
      var iv = CryptoJS.enc.Utf8.parse('mcysmcysmcysmcys'); //十六位十六进制数作为密钥偏移量
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

/* 竞争-监控店铺  */
// -- --//
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
// -- --//
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
/* 竞争-监控商品 */

// 监控商品过滤
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
/**竞品分析 */
// 竞品分析过滤
function filterMoinCompare(data) {
    if (data) {
        var dataArrr = [data['selfItem'], data["rivalItem1"], data["rivalItem2"]].filter(function (item) {
            return item
        })
        dataArrr.forEach(function (item) {
            var va1 = item.payRateIndex ? item.payRateIndex.value : 0;
            var va2 = item.tradeIndex ? item.tradeIndex.value : 0;
            //  var va3 = item.payByrCntIndex ? item.payByrCntIndex.value : 0;
            var va4 = item.uvIndex ? item.uvIndex.value : 0;
            var va5 = item.seIpvUvHits ? item.seIpvUvHits.value : 0;
            var va6 = item.cartHits ? item.cartHits.value : 0;
            var va7 = item.cltHits ? item.cltHits.value : 0;
            responseData.payRate.push(va1);
            responseData.tradeIndex.push(va2);
            //   indexTypes.payByr.value.push(item.payByrCntIndex.value);
            responseData.uvIndex.push(va4);
            responseData.seIpv.push(va5);
            responseData.cartHit.push(va6);
            responseData.cltHit.push(va7);
        })
    }
}

/**竞品分析-入口来源 */
// 竞品来源入口
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
/**市场-监控看板-我的监控 */
// 监控店铺过滤
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
        // visualData.splice((curPage - 1) * curPageSize, curPageSize, resData)
        resData = vStart.concat(resData, vEnd)
    }
    return resData
}
/**市场-监控看板-行业监控 */
function marketRankType(url){
    var res = ''
    if(url.match('item')){
        res = 'item'
    } else if (url.match('shop')){
        res = 'shop'
    } else if (url.match('brand')){
        res = 'brand'
    }
    return res
}
// 监控店铺过滤
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
// 市场排行-高交易
function filterMarketHotsale(data){
    var res ={
        tradeIndex: [],
        payRate: []
    }
    if(!data.length){
        return []
    }
    data.forEach(function(item){
        res.tradeIndex.push(item.tradeIndex.value)
        res.payRate.push(item.payRateIndex.value)
    })
    return res
}
// 市场排行-高流量
function filterMarketHotsearch(data) {
    var res ={
        seIpv: [],
        uvIndex: [],
        tradeIndex: []
    }
    if(!data.length){
        return []
    }
    data.forEach(function(item){
        res.tradeIndex.push(item.tradeIndex.value)
        res.seIpv.push(item.seIpvUvHits.value)
        res.uvIndex.push(item.uvIndex.value)
    })
    return res
}
// 市场排行-高意向
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
/*-------tools---------*/
//   获取竞品分析项的id
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
function getParamsItem(para,com,trend) {
    var keyObj = {}
    var key = ''
    if (!para) {return ''}
    var params = para.split("?")[1]
    var paraArr = params.split('&');
    paraArr.forEach(function (item) {
        var itemArr = item.split('=')
        keyObj[itemArr[0]] = itemArr[1]
    })
    localStorage.setItem('shopCateId', keyObj['cateId'])
    keyObj['dateRange'] = keyObj['dateRange'] ? decodeURIComponent(keyObj['dateRange']):'';
    if (com=='com'){
        var item1 = keyObj['rivalItem1Id'] ? ('&rivalItem1Id='+keyObj['rivalItem1Id']):'';
        var item2 = keyObj['rivalItem2Id'] ? ('&rivalItem2Id='+keyObj['rivalItem2Id']):'';
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
}, function () {})
function getCookie(keyword,  sendResponse) { //获取搜索词
    $(".oui-date-picker .oui-canary-btn:contains('7天')").click()
    chrome.storage.local.get('transitId',function(val){
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
         if (hasSaveData){
             console.log(Decrypt(hasSaveData))
             sendResponse(Decrypt(hasSaveData))
             return false
         }
        $.ajax({
            url: searchUrl,
            type: 'GET',
            headers:{
                "transit-id": val.transitId
            },
            success:function(res){
                var resultData = res.data ? Decrypt(res.data):'';
                localStorage.setItem('chaqz_search_keywords?' + finalTime + "&keywords=" + keyword, res.data)
                console.log(resultData)
                    sendResponse(resultData)
                    
            }
        })
    })
}