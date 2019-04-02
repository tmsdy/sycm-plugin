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
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/mq\/monitor\/cate(\/live\/|\/)showTopShops\.json',
        data: []
    },
    'marketHotFood': {
        urlReg: 'https:\/\/sycm\.taobao\.com\/mc\/mq\/monitor\/cate(\/live\/|\/)showTopItems\.json',
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
    }
};
var isRecently = false; //是否为最新版本
// var dateType = 'today' //选择时间
var tableInstance = null; //table实例对象
var isLogin = false; //是否登录
var VERSION = '1.2.0'; //版本号
var BASE_URL = 'http://47.111.5.205:8090';
var SAVE_MEMBER = {};
var SAVE_BIND = {};
// 触发数据监听
console.log('sendurlData', new Date().getTime())
chrome.runtime.sendMessage({
    type: 'hello',
    fitlerArr: dataWrapper
}, function (response) {});
// 判断是否登录
chrome.storage.local.get('chaqz_token', function (valueArray) {
    var tok = valueArray.chaqz_token;
    if (tok) {
        localStorage.setItem('chaqz_token', tok)
        isLogin = true;
        userInfoRes()
    } else {
        isLogin = false
    }
})
$(function () {
    // 版本
    //  versionCheck(3)
    // 登录
    $(document).on('click', '#loginbtn', function () {
        anyDom.init()
        return false
    })
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
    })
    $(document).on('click', '.mc-shopMonitor #search', function () { //竞争-监控店铺
        // if (!isNewVersion()) {
        //     return false
        // }
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
    $(document).on('click', '.mc-ItemMonitor #search', function () { //竞争-监控商品
        if (!isNewVersion()) {
            return false
        }
        MonitorItem('page')
    })
    $(document).on('click', '#itemAnalysisTrend .oui-card-header #search', function () { //竞争-分析竞品
        if (!isNewVersion()) {
            return false
        }
        var productInfo = getProductInfo()
        if (productInfo.totalNum < 2) {
            alert('请选择比较商品')
            return false
        }
        var idParams = getproduceIds(productInfo)
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
                    obj.tradeIndex = Math.round(res.tradeIndex[i])
                    obj.uvIndex = Math.round(res.uvIndex[i])
                    obj.payRate = res.payRate[i].toFixed(2) + '%'
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
    $(document).on('click', '#sycm-mc-flow-analysis .oui-card-header #search', function () { //竞争-分析竞品-入口来源
        if (!isNewVersion()) {
            return false
        }
        var productInfo = getProductInfo()
        if (productInfo.ispass) {
            alert('请选择比较商品')
            return false;
        }
        var idParams = getproduceIds(productInfo)
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
            // var ayalMid = ayalyDatat(res)
            // var findRes = ayalMid.data
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
    /*市场模块添加事件 */
    $('#app').on('DOMNodeInserted', function (e) {
        // console.log(e.target.id + ',', e.target.className)
        if (e.target.className == 'mc-marketMonitor') {
            $('.mc-marketMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
            // $('#app').off('DOMNodeInserted')
        }
        if (e.target.className == 'tree-menu common-menu tree-scroll-menu-level-2') {
            $('.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right').prepend(showBtn())
        }
    })
    $(document).on('click', '.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item', function () { //市场店铺的按钮是否显示控制
        if ($(this).index() == 2) {
            $('.mc-marketMonitor #search').hide()
        } else {
            $('.mc-marketMonitor #search').show()
        }
    })
    $(document).on('click', '.op-mc-market-monitor-industryCard .oui-tab-switch .oui-tab-switch-item', function () { //市场行业监控品牌不需要转换
        if ($(this).index() == 2) {
            $('.op-mc-market-monitor-industryCard #search').hide()
        } else {
            $('.op-mc-market-monitor-industryCard #search').show()
        }
    })
    $(document).on('click', '.mc-marketMonitor #search', function () { //市场监控店铺 商品
        if (!isNewVersion()) {
            return false
        }
        marketMonitorShop("page")
    })
    $(document).on('click', '.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right #search', function () { //热门店铺、商品
        if (!isNewVersion()) {
            return false
        }
        marketMonitorItem('pageType')
    })

})

function domStruct(data, title) { //竞争模块table
    // var hasWrap = $('.chaqz-wrapper').length
    var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
    var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span></div></div>'
    $('#app').append(wrapper)
    // }
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

function domStructMark(data, title, type) { //市场模块table
    // var hasWrap = $('.chaqz-wrapper').length
    var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
    // if (!hasWrap) {
    var isSmall = type == 2 ? 'small' : ''
    var wrapper = '<div class="chaqz-wrapper"><div class="content ' + isSmall + '"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span><div class="chaqz-mask"><span class="loader"></span></div></div></div>'
    $('#app').append(wrapper)
    // }
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
            } else {
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
            if (hasSave) {
                MonitorItem()
            } else {
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
        }
    })
    $('.chaqz-wrapper').fadeIn(100);
}
/**------ 登录模块-------------------*/
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
                // localStorage.setItem('chaqz_member', JSON.stringify(member))
                chrome.storage.local.set({
                    'chaqz_token': token
                }, function () {});
                isLogin = true;
                _that.getShopBind()
                $('.chaqz-btns').html('<button id="search" class="serachBtn">一键转化</button><button id="userBtn" class="serachBtn user">用户信息</button>')
                $('.chaqz-info-wrapper.login').remove();
                //  versionCheck(3)
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
        // 登录处理
        $(document).on('click', '.chaqz-info-wrapper .login-btn', function () {
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
            // var memInfo = JSON.parse(localStorage.getItem('chaqz_member'));
            // var bindInfo = JSON.parse(localStorage.getItem('chaqz_binded'));
            if (memInfo) {
                this.infoDom(memInfo, bindInfo)
            }
            $(document).on('click', '.chaqz-info-wrapper .hided', function () {
                $('.chaqz-info-wrapper.user').hide()
            })
            $(document).on('click', '#logout', function () {
                $('.chaqz-info-wrapper.user').hide();
                $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>')
                chrome.storage.local.clear(function () {});
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
function showBtn() {
    var reDom = '';
    if (isLogin) {
        reDom = '<div class="chaqz-btns btnsItem1"><button id="search" class="serachBtn">一键转化</button><button id="userBtn" class="serachBtn user">用户信息</button><div>'
    } else {
        reDom = '<div class="chaqz-btns btnsItem1"><button id="loginbtn" class="serachBtn user">登录</button><div>'
    }
    return reDom
}
//   version check
// function versionCheck(ver) {
//     var saveToke = localStorage.getItem('chaqz_token')
//     chrome.runtime.sendMessage({
//         key: 'getData',
//         options: {
//             url: BASE_URL+'/api/v1/plugin/version?v=' + ver,
//             type: 'GET',
//              headers: {
//                  Authorization: "Bearer " + saveToke
//              }
//         }
//     }, function (res) {
//         if (res.code == 200) {
//             isRecently = true
//         } else if (res.code == 2030) {
//             isLogin =false
//             LogOut()
//         } else {
//             isRecently = false
//         }

//     })
// }
//check is pass
function isNewVersion() {
    if (CHAQZ_VERSION != '1.0.0') {
        popUp.init('version')
        return false
    }
    // } else{
    var allInfo = SAVE_MEMBER
    var memInfo = allInfo.member; //会员信息
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
        if (item['closed'] == 0) {
            activeNum++
        }
    })
    if (!isSelf) { // 不是本店铺
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
        // popUp.init('overdue2')
        // return false
    }
    if (isClose == 0) { //激活
        return true;
    }
    if (activeNum < totalBind) { //未达激活上限
        popUp.init('active2')
        return false
    }
    // if (hasBind >= totalBind) { //
    //     popUp.init('binding')
    //     return false
    // }
    if (memInfo.level < 4) {
        popUp.init('upLimit')
        return false
    }
    popUp.init('bindLimit')
    return false

    // }
    // var hasBind = bindInfo.data.length
    // if (hasBind < totalBind) {
    //     popUp.init('binding')
    //     return false
    // }
    // if (memInfo.level < 4){
    //      popUp.init('upLimit')
    //      return false
    // }
    // popUp.init('bindLimit')
    // return false


    // if (memInfo.level) { //是否为会员
    //     var star_time = allInfo.time
    //     var star_end = memInfo.expireAt
    //     var remian = new Date(star_end) - star_time*1000
    //     if (remian>0){//会员过期
    //         if (bindInfo.count>0){ //店铺绑定
    //             var isBind = false
    //             bindInfo.data.forEach(function(item){
    //                 if(item['mainUid'] = shopInfo['mainUserId']){
    //                     isBind = true
    //                 }
    //             })
    //             if(isBind){//是否绑定本账号
    //                 return true
    //             }else{
    //                 popUp.init('overdue2')
    //                 return false
    //             }
    //         }else{
    //             var hasBind = bindInfo.data.length
    //             if (hasBind >= bindInfo.count ){//还有空位吗
    //                     popUp.init('binding')
    //                     return false
    //             }else{
    //                 if (memInfo.level>3){//是否为最高级
    //                         popUp.init('upLimit')
    //                         return false
    //                 }else{
    //                     popUp.init('bindLimit')
    //                     return false
    //                 }
    //             }
    //         }

    //     }else{
    //         popUp.init('overdue')
    //             return false;
    //     }
    // }else{
    //     popUp.init('orderMem')
    //     return false;
    // }
    // }
}
// 退出登录
function LogOut() {
    $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>')
    chrome.storage.local.clear(function () {});
    localStorage.removeItem('chaqz_token')
}
// 弹窗模块
var popUp = {
    version: '<p class="tips">当前插件已更新，请到官网下载最新版本。</p><div class="cha-btns"><a class="btn" href="' + BASE_URL + '/pluginIntro" target="_blank"><button class="btn">前往下载</button></a></div>',
    orderMem: '<p class="tips">账户未开通会员，请联系客服或订购会员。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><button class="btn">联系客服</button></a><button class="btn buyBtn">订购</button></div>',
    overdue: '<p class="tips">会员已过期，请重新订购。</p><div class="cha-btns"><button class="btn buyBtn">订购</button></div>',
    overdue2: '<p class="tips">登录账户未绑定本店铺，<br>如有疑问请联系客服。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes" ><button class="btn">联系客服</button></a><button class="btn hides">取消</button></div>',
    binding: '<p class="tips">店铺暂未绑定，是否绑定店铺？</p><div class="cha-btns"><button class="hides mr_30 btn">取消</button><button id="goBind" class="btn">绑定</button></div>',
    nonBind: '<p class="tips">店铺已绑定其余账户，<br>若非本人操作请联系客服。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes" ><button class="btn">联系客服</button></a><button class="btn hides">确定</button></div>',
    renewal: '<p class="tips"> 会员已过期， 为不影响正常使用，<br>请前往官网续费。</p><div class="cha-btns"><button class="cancel mr_30 btn">暂不处理</button><button class="btn">续费</button></div>',
    orderSucc: '<p class="tips">若订购成功请刷新。</p><div class="cha-btns"><button id="pageRefresh" class="btn">确定</button></div>',
    upLimit: '<p class="tips">该账户会员已达绑定上限，请升级会员。</p><div class="cha-btns"><button class="btn buyBtn">升级会员</button></div>',
    bindLimit: '<p class="tips">已达插件绑定上限，请联系客服。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes" ><button class="btn">联系客服</button></div>',
    weixin: '<p class="head">查权重客服很高兴为您服务</p><img src="https://file.cdn.chaquanzhong.com/wx_contact.jpg" alt="wx"><p class="foot">微信扫一扫 添加客服</p>',
    active: '<div class="table-wrap"><table><thead><tr><td>序号</td><td>店铺名</td><td>状态</td></tr></thead><tbody><tr><td><input type="checkbox"></td><td>阿萨德旗舰店</td><td>未激活</td></tr><tr><td> <input type="checkbox"></td><td>阿萨德旗舰店</td><td>未激活</td></tr><tr><td><input type="checkbox"></td><td>阿萨德旗舰店</td><td>未激活</td></tr></tbody></table></div><div class="cha-btns"><button class="btn">激活</button></div><p class="foot-tips">如有绑定疑问，请<a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes">联系客服</a></p>',
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
        //  $('#app').append(ret)
        return ret
    },
    init: function (type) {
        if ($('.chaqz-info-wrapper.pop').length) {
            this.changeDom(type)
            return false
        }
        var wrapFont = '<div class="chaqz-info-wrapper pop"><div class="c-cont"><span class="close hides" click="hideInfo">×</span><div class="alert">'
        var wrapEnd = '</div></div></div>'
        var resultDom = ''
        if (typeof this[type] == 'function') {
            resultDom = this[type]()
        } else {
            resultDom = this[type]
        }
        var _html = wrapFont + resultDom + wrapEnd;
        var _that = this
        $('#app').append(_html)
        // 事件加载
        $('.chaqz-info-wrapper.pop').on('click', '.hides', function () {
            $('.chaqz-info-wrapper.pop').hide()
        })
        $('.chaqz-info-wrapper.pop').on('click', '.buyBtn', function () {
            window.open(BASE_URL + '/homePage?from=plugin')
            // window.open('http://192.168.2.160:8080/homePage?from=plugin')
            _that.init('orderSucc')
        })
        $('.chaqz-info-wrapper.pop').on('click', '#logout', function () {
            $('.chaqz-info-wrapper.pop').hide();
            $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>');
            chrome.storage.local.clear(function () {});
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
        $('.chaqz-info-wrapper.pop').on('change', '.table-wrap input', function (data) {
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
    },
    changeDom: function (type) {
        var changeHtml = ''
        if (typeof this[type] == 'function') {
            changeHtml = this[type]()
        } else {
            changeHtml = this[type]
        }
        $('.chaqz-info-wrapper.pop .c-cont .alert').html(changeHtml)
        $('.chaqz-info-wrapper.pop').show()
    }
}
// 更新用户信息
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
            // localStorage.setItem('chaqz_member', JSON.stringify(res))
        } else {
            LogOut()
        }
    })
}

function popTip(text, style, time) {
    var st = style ? style : ''
    // var tm = time?time: 500
    $('#app').append('<div class="small-alert" style="' + style + '">' + text + '</div>');
    setTimeout(function () {
        $('#app .small-alert').fadeOut(300)
    }, 500)
}
/**===========================市场竞争数字格式化方法以及页面信息======================================= */
// 店铺信息处理了
function dealShopInfo() {
    var info = dataWrapper.shopInfo
    console.log(info)
    if (info) {
        var ret = JSON.parse(info.data).data
        console.log(ret)
        return ret
    }
}
// 获取竞争分析商品id
function getproduceIds(product) {
    var selfList = JSON.parse(localStorage.getItem('chaqz_compareSelfList')).data
    var mointList = JSON.parse(dataWrapper.getMonitoredList.data).data
    var item1 = ''
    var item2 = ''
    var self = ''
    for (var i = 0; i < selfList.length; i++) {
        if (selfList[i].title == product.selfItem.title) {
            self = '&selfItemId=' + selfList[i].itemId
        }
    }
    for (var j = 0; j < mointList.length; j++) {
        if (mointList[j].name == product.rivalItem1.title) {
            item1 = '&rivalItem1Id=' + mointList[j].itemId
        } else if (mointList[j].name == product.rivalItem2.title) {
            item2 = '&rivalItem2Id=' + mointList[j].itemId
        }
    }
    return item1 + item2 + self
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
function getSearchParams(key, page, pagesize) {
    // 获取时间范围
    // var dateType = 'today'
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
    var dateType = dayIndex == '实 时' ? 'today' : dayIndex == '7天' ? 'recent7' : dayIndex == '30天' ? 'recent30' : dayIndex == '日' ? 'day' : dayIndex == '周' ? 'week' : dayIndex == '月' ? 'month' : 'today';
    // if (dataTy[dayIndex]) {
    //     dateType = dataTy[dayIndex]
    // }
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
        finalTime = spliteTime[1] + '|' + spliteTime[3]
    }
    page = page ? page : 1;
    pagesize = pagesize ? pagesize : 10;
    var localCateId = localStorage.getItem('shopCateId')
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
// listen shop\
function marketMonitorShop(pageType) {
    var chooseTop = $('.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.mc-marketMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
    var backT = chooseTop ? 'marketFood' : 'marketShop'
    var itemKey = getSearchParams(backT, curPage, curPageSize)
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
// /////////////////////////////////////--------背景数据处理-------//////////////////////////////////////////////
console.log('listern start', new Date().getTime())
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'holdup') {
            console.log('has recevied data', new Date().getTime())
            var baseUrl = request.url;
            var resData = request.back;
            // var urlKey = baseUrl ? baseUrl.split('?')[0] : '';
            var urlParams = baseUrl ? baseUrl.split('?')[1] : '';
            if (baseUrl) {
                for (var k in dataWrapper) {
                    if ((new RegExp(dataWrapper[k].urlReg)).test(baseUrl)) {
                        // 根据期限存储数据
                        if (k == 'monitShop' || k == 'shopInfo' || k == 'getMonitoredList') {
                            dataWrapper[k].data = resData;
                            console.log(k, resData)
                        } else if (k == 'compareSelfList') {
                            localStorage.setItem('chaqz_' + k, resData)
                        } else {
                            if (k == 'monitResource' || k == 'monitCompareFood') { //竞品分析
                                var dataTypes = getParamsItem(baseUrl, 'com')
                            } else {
                                var dataTypes = getParamsItem(baseUrl)
                            }
                            localStorage.setItem(k + dataTypes, resData)
                        }
                        if (k == 'monitResource') {
                            dataWrapper[k].ids = getItemId(urlParams, 'url')
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
    if (request.type == 'resource') {
        getResouce(request.url, function (data) {
            sendResponse(data)
        })

    } else if (request.type == 'version') {
        getVersion(request.ver, sendResponse)
    } else if (request.type == 'monitShop') {
        var moniShopData = jsonParse(dataWrapper[request.type].data)
        filterMinoShop(moniShopData)
        for (var key in responseData) {
            getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'monitShop', moniShopData)
        }
    } else if (request.type == 'monitFood') {
        var pageData = jsonFoodParse(localStorage.getItem(request.dataType), 'page')
        var markShop = pageData.data
        filterMarketShop(markShop)
        for (var key in responseData) {
            getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'marketShop', pageData)
        }
        // var moniFoodData = jsonFoodParse(localStorage.getItem('monitFood' + request.dataType))
        // filterMinoFood(moniFoodData)
        // for (var key in responseData) {
        //     getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'monitFood', moniFoodData)
        // }
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
        var markShop = pageData.data
        filterMarketShop(markShop)
        for (var key in responseData) {
            getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'marketShop', pageData)
        }
    } else if (request.type == 'marketHotShop' || request.type == 'marketHotFood') {
        var pageData = jsonFoodParse(localStorage.getItem(request.dataType), 'page')
        var marketHot = pageData.data
        var markHotIndex = filterMarketHot(marketHot)
        for (var key in markHotIndex) {
            getAjax(markHotIndex[key], key, sendResponse, Object.keys(markHotIndex).length, 'marketHotShop', pageData)
        }
    }
    return true;
}
// );

function getAjax(data, type, sendResponse, num, fType, lastData, compareItem) {
    var filterType = type == 'payRate' ? 1 : type == 'tradeIndex' ? 2 : type == 'payByr' ?
        3 : type == 'uvIndex' ? 4 : type == 'seIpv' ? 5 : type == 'cartHit' ? 6 : type == 'cltHit' ? 7 : '';
    var saveToke = localStorage.getItem('chaqz_token')
    chrome.runtime.sendMessage({
            key: "getData",
            options: {
                url: BASE_URL + '/api/v1/plugin/flowFormula?type=' + filterType,
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
            if (val.code == 200) {
                if (!compareItem) {
                    responseData[type] = val.data
                } else {
                    responseData[compareItem][type] = val.data
                }
                requestNum++
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
                    } : ''
                    sendResponse(resData)
                    requestNum = 0
                }
            } else if (val.code == 2030) {
                LogOut()
            }
        })
}

function getResouce(url, cb) {
    $.ajax({
        url,
        type: "GET",
        success: function (data) {
            cb(data)
        }
    })
}
// ------------------------data operator--------------------------------//
// 数据转对象
function jsonParse(data, type) {
    if (!data) {
        return ''
    } else {
        var orignData = JSON.parse(data)
        var finalData = orignData.data.data ? orignData.data.data : orignData.data
        return finalData
    }
}

function jsonFoodParse(data, type) {
    if (!data) {
        return ''
    } else if (type == 'page') {
        var orignData = JSON.parse(data)
        var page = orignData.data.data.data ? orignData.data.data : orignData.data
        return page
    } else {
        var orignData = JSON.parse(data)
        var finalData = orignData.data.data.data ? orignData.data.data.data : orignData.data.data
        return finalData
    }
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
/*-------tools---------*/
//   获取竞品分析项的id
function getItemId(para) {
    var ids = {}
    if (para) {
        var paraArr = para.split('&');
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

function getParamsItem(para, com) {
    var keyObj = {}
    var key = ''
    if (para) {
        var params = para.split("?")[1]
        var paraArr = params.split('&');
        paraArr.forEach(function (item) {
            var itemArr = item.split('=')
            keyObj[itemArr[0]] = itemArr[1]
        })
        localStorage.setItem('shopCateId', keyObj['cateId'])
        keyObj['dateRange'] = keyObj['dateRange'] ? decodeURIComponent(keyObj['dateRange']) : '';
        if (com) {
            var item1 = keyObj['rivalItem1Id'] ? ('&rivalItem1Id=' + keyObj['rivalItem1Id']) : '';
            var item2 = keyObj['rivalItem2Id'] ? ('&rivalItem2Id=' + keyObj['rivalItem2Id']) : '';
            var self = keyObj['selfItemId'] ? ('&selfItemId=' + keyObj['selfItemId']) : '';
            key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + item1 + item2 + self
        } else {
            key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&page=' + keyObj['page'] + '&pageSize=' + keyObj['pageSize'] + '&sellerType=' + keyObj['sellerType']
        }
    }
    return key
}
chrome.runtime.sendMessage({
    type: 'listenContat'
}, function () {})