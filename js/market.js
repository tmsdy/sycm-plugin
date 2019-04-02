var isRecently = false
var tableInstance = null
var dataType = 'today'
$(function () {
    // 触发数据监听
    chrome.runtime.sendMessage({
        greeting: "hello"
    }, function (response) {
        console.log('回调1');
        console.log(response);
    });
    versionCheck(3)
    $('#app').on('DOMNodeInserted', function (e) {
        // console.log(e.target.id + ',', e.target.className)
        if (e.target.className == 'mc-marketMonitor') {
            $('.mc-marketMonitor .oui-card-header-wrapper .oui-card-header').append('<div class="chaqz-btns btnsItem1"><button class="serachBtn">一键转化</button></div>')
            // $('#app').off('DOMNodeInserted')
        }
        if (e.target.className == 'tree-menu common-menu tree-scroll-menu-level-2') {
            $('.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right').prepend('<div class="chaqz-btns btnsItem1"><button class="serachBtn">一键转化</button></div>')
        }
    })
    $(document).on('click', '.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item', function () { //市场店铺的按钮是否显示控制
        if ($(this).index() == 2) {
            $('.mc-marketMonitor .serachBtn').hide()
        } else {
            $('.mc-marketMonitor .serachBtn').show()
        }
    })
    $(document).on('click', '.op-mc-market-monitor-industryCard .oui-tab-switch .oui-tab-switch-item', function () { //市场行业监控品牌不需要转换
        if ($(this).index() == 2) {
            $('.op-mc-market-monitor-industryCard .serachBtn').hide()
        } else {
            $('.op-mc-market-monitor-industryCard .serachBtn').show()
        }
    })
    // 判断获取的是时间段
    $(document).on('click', '.oui-date-picker .ant-btn-primary', function () {
        var dayIndex = $('.oui-date-picker .ant-btn-primary').index()
        var dataTy = ['today', 'recent7', 'recent30', 'day', 'week', 'month']
        if (dataTy[dayIndex]) {
            dataType = dataTy[dayIndex]
        }
    })
    $(document).on('click', '.mc-marketMonitor .serachBtn', function () { //市场监控店铺 商品
        if (!isNewVersion()) {
            return false
        }
       marketMonitorShop("page")
    })
    $(document).on('click', '.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right .serachBtn', function () { //热门店铺、商品
        if (!isNewVersion()) {
            return false
        }
       marketMonitorItem('pageType')
    })
    $(document).on('click', '.chaqz-close', function () { //影藏弹窗
        $('.chaqz-wrapper .content').removeClass('small')
        $('.chaqz-wrapper').remove()
    })

})

function domStructMark(data, title, type) {
    // var hasWrap = $('.chaqz-wrapper').length
    var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
    // if (!hasWrap) {
    var isSmall = type==2?'small':'' 
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
            $('.mc-marketMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            $('.chaqz-wrapper .chaqz-mask').show(100)
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.type == 'marketShop' || request.type == 'monitFood') {
                    listenShop()
                }
            });
        } else if (type == 2) {
            $('.chaqz-wrapper .chaqz-mask').show(100)
            $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
            // 监听消息
            chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                if (request.type == 'marketHotShop' || request.type == 'marketHotFood') {
                    marketMonitorItem()
                }
            });
        } 
    })
    $('.chaqz-wrapper').fadeIn(100);
}

function formula(val, val2, type) {
    if (!val2 || val == "" || val == "undefined" || val == '-' || val2 == '-') {
        return '-'
    } else {
        val = (val + '').replace(',', '');
        val2 = (val2 + '').replace(',', '')
        if (type == 1) {
            return (Math.round((val / val2) * 100) / 100).toFixed(2)
        } else {
            return (Math.round((val / val2) * 10000) / 100).toFixed(2) + '%'
        }
    }
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
            result.res2 = del?Math.round((v3 / del) * 10000) / 100:'-'
        }
    }
    return result
}
//   version check
function versionCheck(ver) {
    chrome.runtime.sendMessage({
        type: 'version',
        ver: ver
    }, function (res) {
        if (res == 'pass') {
            isRecently = true
        } else {
            isRecently = false
        }
    })
}
//check is pass
function isNewVersion() {
    if (!isRecently) {
        var dom = '<div class="chaqz-info-wrapper"><div class="c-cont"><span class="close" click="hideInfo">×</span><div class="alert"><h2>版本更新</h2><p class="tips">当前插件已更新，请到官网下载最新版本</p><div class="cha-btns"><button class="cancel btn">取消</button><a  class="abtn" href="http://www.chaquanzhong.com" target="_blank">前往下载</div></div></div></div>'
        $('#app').append(dom)
        // window.open('http://www.chaquanzhong.com/Kasp') //pluginIntro
        return false
    } else {
        return true
    }
}
$(document).on('click', '.chaqz-info-wrapper .c-cont', function () {
    $('.chaqz-info-wrapper').remove()
})
// listen shop\
function marketMonitorShop(pageType) {
    var chooseTop = $('.mc-marketMonitor .oui-tab-switch .oui-tab-switch-item-active').index()
    var curPage = $('.mc-marketMonitor .ant-pagination .ant-pagination-item-active').attr('title')
    var curPageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
    var backT = chooseTop ? 'marketFood' : 'marketShop'
    chrome.runtime.sendMessage({
        type: backT,
        dataType:dataType
    }, function (val) {
        var res = val.value
        var finaData = val.final.data
        var totalCont = val.final.recordCount
        var resData = []
        var length = res.payRate.length
        for (var i = 0; i < length; i++) {
            var trandeOver = res.tradeIndex[i] != '超出范围,请使用插件最高支持7.8亿' ? Math.round(res.tradeIndex[i]): '-'
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
            obj.cate_cateRankId = cateRnkId ? cateRnkId.value ? cateRnkId.value : '-':'-'
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
    chrome.runtime.sendMessage({
            type: backT,
            dataType: dataType
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
            if(pageType){
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
            }else{
                for (var j = 0; j < curPageSize; j++) {
                    tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
                }
                $('.chaqz-wrapper .chaqz-mask').hide(100)
            }
        })
}