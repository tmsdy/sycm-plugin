import {
    BASE_URL,
} from '../../common/constState'
import {
    popTip,
    dealShopInfo,
    changeLoginStatus,
    anyDom,
    LogOut,
    isNewVersion
} from '../../common/promptClass'
var SAVE_MEMBER = {};
// var SAVE_BIND = {};
// var SET_WAIT_TIME = 600000
// 对应模块数据存储
var dataWrapper = {
    'monitShop': {
        urlReg: '\/mc(\/live\/|\/)ci\/shop\/monitor\/listShop\.json',
        data: []
    },
    // 'monitFood': {
    //     urlReg: '\/mc(\/live\/|\/)ci\/item\/monitor\/list\.json',
    //     data: {}
    // },
    'monitCompareFood': {
        urlReg: '\/mc\/rivalItem\/analysis\/get(LiveCore|Core)Indexes.json',
        data: []
    },
    'monitResource': {
        urlReg: '\/mc\/rivalItem\/analysis\/get(LiveFlow|Flow)Source.json',
        data: []
    },
    'ShopItemBrand': {
        urlReg: '\/mc(\/live\/|\/)ci(.*?)monitor\/list\.json',
        data: []
    },
    'marketHot': {
        urlReg: '\/mc\/mq\/monitor\/cate(.*?)\/showTop(Shops|Items|Brands)\.json',
        data: []
    },
    // 'marketHotFood': {
    //     urlReg: '\/mc\/mq\/monitor\/cate(.*?)\/showTopItems\.json',
    //     data: []
    // },
    'shopInfo': {
        urlReg: '\/custom\/menu\/getPersonalView\.json',
        data: []
    },
    'compareSelfList': {
        urlReg: '\/mc\/rivalShop\/recommend\/item\.json',
        data: []
    },
    'getMonitoredList': {
        urlReg: '\/mc\/ci\/config\/rival\/item\/getMonitoredList\.json',
        data: []
    },
    'getKeywords': {
        urlReg: '\/mc\/rivalItem\/analysis\/getKeywords\.json',
        data: []
    },
    'hotsale': {
        urlReg: '\/mc\/mq\/mkt\/rank\/(shop|item|brand)\/hotsale\.json',
        data: []
    },
    'hotsearch': {
        urlReg: '\/mc\/mq\/mkt\/rank(.*?)hotsearch\.json',
        data: []
    },
    'hotpurpose': {
        urlReg: '\/mc\/mq\/mkt\/rank\/item\/hotpurpose\.json',
        data: []
    },
    'trendShop': {
        urlReg: '\/mc\/ci\/config\/rival\/(shop|item|brand)\/getSingleMonitoredInfo\.json',
        data: []
    },
    'allTrend': {
        urlReg: '\/mc\/ci\/(shop|item|brand)\/trend\.json',
        data: []
    },
    "currentDate": {
        urlReg: '\/ipoll\/activity\/getCurrentTime\.json'
    },
    "publicInfo": {
        urlReg: '\/mc\/mq\/monitor\/offline\/public\.json',
        data:''
    },
    "getShopCate": {
        urlReg: '\/mc\/common\/getShopCate\.json',
        data:{
            cateId:'',
            version:'',
            allInfo:''
        }
    },
    "listProp": {
        urlReg: '\/mc\/mq/prop\/listProp(Shop|Item)\.json',
    },
    "listProduct": {
        urlReg: '\/mc\/mq\/product\/listProdItemRank\.json',
    }
}
window.dataWrapper2 = dataWrapper;
window.SAVE_MEMBER2 = SAVE_MEMBER;
window.isLogin = false;
// window.SAVE_BIND2 = SAVE_BIND;


//  判断是否首次安装
clearLocalstorage();
// 触发数据监听
interceptRequest();
// 判断是否登录
chrome.storage.local.get('chaqz_token', function (valueArray) {
    var tok = valueArray.chaqz_token;
    if (tok) {
        localStorage.setItem('chaqz_token', tok);
        isLogin = true;
        // window.isLogin = true;
    } else {
        LogOut()
        // isLogin = false;
    }
});
$(function () {
    // 登录
    $(document).on('click', '#loginbtn', function () {
        anyDom.init();
        return false
    });
     // 个人信息
     $(document).on('click', '#userBtn', function () {
         if(!isNewVersion()){
             return false
         }
         anyDom.getInfo();
         return false
     });
    //更新用户信息
    userInfoRes();

    // 信息上查
    sendUserInfo();
    var setTimer = null;
    setTimer = setInterval(function () {
        sendUserInfo()
    }, SET_WAIT_TIME)
    /**竞争模块添加事件 */
    $('#app').on('DOMNodeInserted', function (e) {
        console.log(e.target.id, ',', e.target.className)
        if (e.target.className == 'oui-index-picker') { //竞争-监控店铺
            $('.mc-shopMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
        } else if (e.target.className == 'oui-index-picker-group') { //竞争-监控商品
            $('.mc-ItemMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn());
            if (!$('.op-mc-search-rank-container .oui-card-header-wrapper .oui-card-header .chaqz-btns').length) {
                $('.op-mc-search-rank-container .oui-card-header-wrapper .oui-card-header').append(showBtn());
            }
            if (!$('.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-header .chaqz-btns').length) {
                $('.op-mc-search-analyze-container .oui-card-header-wrapper .oui-card-header').append(showBtn());
            }
             if (!$('.op-mc-market-rank-container .oui-card-header .chaqz-btns').length) {
                 $('.op-mc-market-rank-container .oui-card-header').append(showBtn())
             }
        } else if (e.target.id == 'itemAnalysisTrend') { //竞争-分析竞品
            $('.op-mc-item-analysis #itemAnalysisTrend .oui-card-header').append(showBtn('keyRight'))
        } else if (e.target.id == 'sycm-mc-flow-analysis') { //竞争-分析竞品-入口来源
            $('.op-mc-item-analysis .sycm-mc-flow-analysis .oui-card-header').append(showBtn());
        } else if (e.target.className == 'mc-marketMonitor') {
            $('.mc-marketMonitor .oui-card-header-wrapper .oui-card-header').append(showBtn())
            // $('#app').off('DOMNodeInserted')
        } else if (e.target.className == 'tree-menu common-menu tree-scroll-menu-level-2') {
            $('.op-mc-market-monitor-industryCard .oui-card-header-item-pull-right').prepend(showBtn())
        } else if (e.target.className == 'industry-tab-index') { //市场排行类
            $('.op-mc-market-rank-container  .oui-card-header-wrapper .oui-card-header').append(showBtn())
        }  else if (e.target.className == 'ebase-metaDecorator__root') { // 市场-搜索分析
             if (judgeCor()) {
                  $('.op-mc-search-analyze-container .oui-card-content').append('<div class="root-word-entry">输入关键词,按回车键</div>');
                  $('.op-mc-search-analyze-container .ebase-Switch__root').parent().append(showBtn('isRootWord'));
             } 
        } else if (e.target.className == 'index-area-multiple-root-container') { //market-市场大盘
            if (!$('.op-mc-market-overview-container #cateTrend .cardHeader .chaqz-btns').length) {
               $('.op-mc-market-overview-container #cateTrend .cardHeader').append(showBtn())
            }
            if (!$('.op-mc-search-analyze-container #searchTrend .cardHeader .chaqz-btns').length) {
               $('.op-mc-search-analyze-container #searchTrend .cardHeader').append(showBtn()) //搜索分析
               $('.op-mc-search-analyze-container #searchTrend .alife-one-design-sycm-indexes-trend-addition-middle').append(showBtn()) //搜索分析
               
            }
            if (!$('.op-mc-market-overview-container #cateTrend .op-mc-market-overview-compare-area .chaqz-btns').length) {
                $('.op-mc-market-overview-container #cateTrend .op-mc-market-overview-compare-area').append(showBtn('download'))
            }
             if (!$('.op-mc-property-insight-container .oui-card-header-wrapper .oui-card-header #search').length) { //属性洞察-hotlOIST
                 $('.op-mc-property-insight-container .oui-card-header-wrapper .oui-card-header').append(showBtn());
             }
        } else if (e.target.id == 'categoryConstitute') { //market-analy-struct
            if (!$('.op-mc-search-analyze-container  .oui-card-header-wrapper #search').length) {
                $('.op-mc-search-analyze-container  .oui-card-header-wrapper').eq(0).append(showBtn())
            }
        } else if (e.target.id == 'completeShopPortrait') { //搜索人群-all
            $('.mc-searchCustomer #completeShopPortrait  .oui-card-header-wrapper').append(showBtn());
        } else if (e.target.className == 'portrait-content-table') { //搜索人群-prov/city
            if (!$('.mc-searchCustomer #completeShopPortrait .portrait-container').eq(3).find('#search').length){
                $('.mc-searchCustomer #completeShopPortrait .portrait-container').eq(3).find('.portrait-title').append(showBtn())
                $('.mc-searchCustomer #completeShopPortrait .portrait-container').eq(4).find('.portrait-title').append(showBtn())
            }
        } else if (e.target.id == 'sycmMqIndustryCunstomer') { //行业客群-客群趋势
           $('#sycmMqIndustryCunstomer .oui-card-header-wrapper .oui-card-header-item-pull-left').append(showBtn());
           $('#completeShopPurchase .mc-Purchase .sycm-trade-rank-table-title').append(showBtn());
        } else if (e.target.id == 'propsRank') { //属性洞察-人们属性
            if (!$('.op-mc-property-insight-container .oui-card-header-wrapper .oui-card-header #search').length){
                $('.op-mc-property-insight-container .oui-card-header-wrapper .oui-card-header').append(showBtn());
            }
        } else if (e.target.className == 'sycm-common-select-simple-text') { //属性洞察-人们属性
            // if (!$('.op-mc-property-insight-container .oui-card-header-wrapper .oui-card-header #search').length) {
                $('.op-mc-product-insight-container .oui-card-header-wrapper .oui-card-title').append(showBtn());
            // }
        }
    });
})
/**-----用户信息登录模块方法-------------------*/
// var anyDom = {
//     loginDom: '<div class="chaqz-info-wrapper login"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><div class="formList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><div class="phone"><input id="phone" type="text" placeholder="请输入手机号码"><p class="tips">请输入手机号码</p></div><div class="pwd"><input id="pwd" type="password" placeholder="请输入登录密码"><p class="tips">请输入登录密码</p></div><div class="router"><a href="' + BASE_URL + '/reg" class="right" target="_blank">免费注册</a><a href="' + BASE_URL + '/findP" target="_blank">忘记密码</a></div><button class="orange-default-btn login-btn">登录</button></div></div></div>',
//     infoDom: function (memInfo, bindedInfo) {
//         var acct = memInfo.username;
//         var title = memInfo.member.title;
//         var expirTime = memInfo.member.expireAt;
//         var whetherOrder = '';
//         // var binded = '未绑定';
//         // var shopInfo = dealShopInfo();
//         if (title && expirTime) {
//             var formDate = new Date(expirTime)
//             var isExpire = formDate - memInfo.time * 1000
//             if (isExpire > 0) {
//                 whetherOrder = '续费';
//             } else {
//                 whetherOrder = '订购';
//             }
//             // bindedInfo.data.forEach(function (item) {
//             //     if (item['mainUid'] = shopInfo['mainUserId']) {
//             //         binded = "已绑定"
//             //     }
//             // })
//         } else {
//             title = '普通会员';
//             expirTime = '--';
//             whetherOrder = '订购'
//             // binded = '未绑定'
//         }
//         var wrap = '<div class="chaqz-info-wrapper user"><div class="c-cont"><span class="close2 hided">×</span><div class="help"><img src="https://file.cdn.chaquanzhong.com/wenhao.png" alt="?"><a href="' + BASE_URL + '/pluginIntro" target="_blank">帮助</a></div><div class="infoList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><ul class="user-list"><li><span class="name">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:</span><span>' + acct + '</span><span class="fr" id="logout">退出登录</span></li><li><span class="name">会员信息:</span><span>' + title + '</span></li><li><span class="name">到期时间:</span><span>' + expirTime + '</span><a href="' + BASE_URL + '/vipInfo?from=plugin" target="_blank" class="fr">' + whetherOrder + '</a></li><li><span class="name">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span><span>' + LOCAL_VERSION + '</span></li><li><span class="name">联系客服:</span><span><a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><img class="mr_10" src="https://file.cdn.chaquanzhong.com/qq_icon.png" alt="qq"></a><img src="https://file.cdn.chaquanzhong.com/wx_icon.png" alt="wx" class="wxpop"></span></li></ul></div></div></div>';
//         // <li><span class="name">店铺绑定</span><span>' + binded + '</span></li>
//         $('#app').append(wrap);

//     },
//     login: function () {
//         var onLoading = false;
//         var _that = this
//         var user = $('.chaqz-info-wrapper #phone').val()
//         var pwd = $('.chaqz-info-wrapper #pwd').val()
//         if (!user || !pwd || onLoading) {
//             return false
//         }
//         chrome.runtime.sendMessage({
//             key: "getData",
//             options: {
//                 url: BASE_URL + '/api/v1/user/login',
//                 type: "POST",
//                 data: JSON.stringify({
//                     phone: user,
//                     password: pwd
//                 }),
//                 contentType: "application/json,charset=utf-8",
//             }
//         }, function (val) {
//             if (val.code == 200) {
//                 $('.chaqz-info-wrapper').remove();
//                 var member = val.data;
//                 var token = val.data.token;
//                 localStorage.setItem('chaqz_token', token);
//                 SAVE_MEMBER = member;
//                 window.SAVE_MEMBER2 = member;
//                 chrome.storage.local.set({
//                     'chaqz_token': token
//                 }, function () {});
//                 isLogin = true;
//                 // _that.getShopBind()
//                 changeLoginStatus()
//                 $('.chaqz-info-wrapper.login').remove();
//             } else {
//                 $('.chaqz-info-wrapper.login .pwd .tips').text('账号或密码错误').show()
//                 onLoading = false
//             }
//         })
//     },
//     init: function () {
//         var _that = this
//         $('#app').append(this.loginDom);
//         $('.chaqz-info-wrapper #phone').blur(function () {
//             var phoneVal = $(this).val()
//             var phoneReg = /^1[34578]\d{9}$/;
//             if (!phoneVal) {
//                 $(this).siblings('.tips').text('请输入手机号码').show()
//             } else if (!phoneReg.test(phoneVal)) {
//                 $(this).siblings('.tips').text('请输入正确号码').show()
//             } else {
//                 $(this).siblings('.tips').hide()
//             }
//         })
//         $('.chaqz-info-wrapper #pwd').blur(function () {
//             var pwdValue = $(this).val()
//             if (!pwdValue) {
//                 $(this).siblings('.tips').text('请输入密码').show()
//             } else {
//                 $(this).siblings('.tips').hide()
//             }
//         })
//         // 登录处理
//         $('.chaqz-info-wrapper .login-btn').click(function () {
//             _that.login()
//         })
//         //回车搜索
//         $('.chaqz-info-wrapper #pwd').bind('keydown', function (event) {
//             var evt = window.event || event;
//             if (evt.keyCode == 13) {
//                 _that.login()
//             }
//         });
//         // 关闭登录弹窗
//         $('.chaqz-info-wrapper .hided').click(function () {
//             $('.chaqz-info-wrapper.login').remove()
//         })
//     },
//     getShopBind: function () {
//         var saveToke = localStorage.getItem('chaqz_token')
//         chrome.runtime.sendMessage({
//             key: 'getData',
//             options: {
//                 url: BASE_URL + '/api/v1/plugin/shop',
//                 type: 'GET',
//                 headers: {
//                     Authorization: "Bearer " + saveToke
//                 }
//             }
//         }, function (val) {
//             if (val.code == 200) {
//                 var bindInfo = val.data
//                 SAVE_BIND = bindInfo
//                 window.SAVE_BIND2 = bindInfo;
//             } else if (val.code == 2030) {
//                 LogOut()
//             }
//         })
//     },
//     getInfo: function () {
//         var userWrap = $('.chaqz-info-wrapper.user')
//         if (userWrap.length) {
//             userWrap.show()
//         } else {
//             var memInfo = SAVE_MEMBER;
//             // var bindInfo = SAVE_BIND;
//             if (memInfo.token) {
//                 // this.infoDom(memInfo, bindInfo)
//                 this.infoDom(memInfo)
//             } else {
//                 popUp.init('noShopInfo')
//             }
//             $('.chaqz-info-wrapper .hided').click(function () {
//                 $('.chaqz-info-wrapper.user').hide()
//             })
//             $('.chaqz-info-wrapper #logout').click(function () {
//                 $('.chaqz-info-wrapper.user').hide();
//                 LogOut()

//             })
//             $('.chaqz-info-wrapper.user .wxpop').click(function () {
//                 $('.chaqz-info-wrapper.user').hide()
//                 popUp.init('weixin')
//             })
//         }
//     }
// }
// 显示按钮切换
function showBtn(type) {
    var reDom = '';
    // var curUrl = window.location.href;
    // var isRootWord = curUrl.indexOf('https://sycm.taobao.com/mc/mq/search_analyze')==-1;
    var seachBtnText = type == 'isRootWord' ? '一键分析' : '一键转化';
    var keyRight = type == "keyRight" ? '<button id="vesting" class="serachBtn vesting">一键加权</button>':'';
    if (isLogin) {
        reDom = '<div class="chaqz-btns btnsItem1"><button id="search" class="serachBtn">' + seachBtnText + '</button>'+
        keyRight + '<div>';
    } else {
        reDom = '<div class="chaqz-btns btnsItem1"><button id="loginbtn" class="serachBtn user">登录</button><div>'
    }
    return reDom
}
// 更新用户信息
function userInfoRes() {
    // 竞品分析显示隐藏
    competePop();
    if (!isLogin) {
        return false;
    }
    var saveToke = localStorage.getItem('chaqz_token');
    // anyDom.getShopBind();
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
            var res = val.data;
            res.username = res.account;
            res.member.expireAt = res.member.expire_at;
            SAVE_MEMBER = res;
            window.SAVE_MEMBER2 = res;
            // window.isLogin = true;
            isLogin = true;
            changeLoginStatus()
        } else {
            LogOut()
        }
    })
   
}
// 判断版本
function judgeCor() {
    var shopLevel = localStorage.getItem('chaqz_getShopCate');
    var marketban = dataWrapper['publicInfo'].data;
    if (shopLevel) {
        var allLev = JSON.parse(shopLevel)[0];
        var isHig = allLev ? allLev[4] : '';
        if (isHig == 'std') {
            return false;
        }
    } else if (marketban == 'std') {
        return false;
    }
    return true;
}
// 词根解析点击
$(document).on('click', '#goRootWord',function(){
    if (judgeCor()){
        window.location.href = 'https://sycm.taobao.com/mc/mq/search_analyze';
    }else{
          popTip('暂只支持专业版/豪华版生意参谋账号', {
              time: 2000
          });
    }
})
$(document).on('keydown', '.op-mc-search-analyze-container .ant-input', function (e) {
    if (!judgeCor()){return false;}
    if (e.keyCode == 13 || e.which == 13) {
        popTip('请点击一键分析,获取数据！',{time:2000})
    }
})
// 清除缓存
function clearLocalstorage() {
    if (!localStorage.getItem('isFirstInstallPlugin')) {
        localStorage.clear();
        localStorage.setItem('isFirstInstallPlugin', 'hasInstall')
    }
}
// 竞品分析弹窗显示隐藏
function competePop() {
    var url = window.location.href;
    if (url.indexOf('https://sycm.taobao.com/custom/login.htm') != -1) {
        localStorage.removeItem('shopCateId');
        localStorage.removeItem('chaqz_getShopCate');
        $('.chaqz-compete-wrap').remove();
        return false;
    }
    var reg = /https:\/\/sycm\.taobao\.com\/mc\/(mq|ci)/
    var monitorPart = reg.test(url) ;
    if (monitorPart) {
       $('body').append('<div class="chaqz-compete-wrap"><div class="head popover-header"><div class="left"><img class=""src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png"alt=""></div><img id="userBtn" src="https://file.cdn.chaquanzhong.com/chaqz-plugins-avator.png" alt="" class="avator"></div><div class="content-wrap"><ul class="content"><li class="item"id="parsing"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup1.png"alt=""><p class="name">竞品解析</p></li><li class="item"id="weightParsing"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup2.png"alt=""><p class="name">权重解析</p></li><li class="item"id="goRootWord"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup3.png"alt=""><p class="name">词根透视</p></li><li class="item"><a href="https://sycm.taobao.com/mc/ci/item/analysis"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup4.png"alt=""><p class="name">一键加权</p></a></li><li class="item"><a href="'+BASE_URL+'/chaheihao?from=plugin" target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup5.png"alt=""><p class="name">黑号查询</p></a></li><li class="item"><a href="'+BASE_URL+'/Kasp?from=plugin" target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup6.png"alt=""><p class="name">卡首屏</p></a></li><li class="item"><a href="'+BASE_URL+'/infiniteRank?from=plugin" target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup7.png"alt=""><p class="name">查排名</p></a></li><li class="item"><a class="developing"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup8.png"alt=""><p class="name">淘客订单检测</p></a></li><li class="item"><a href="'+BASE_URL+'/toolIndex?from=plugin" target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup9.png"alt=""><p class="name">在线查指数</p></a></li><li class="item"><a href="'+BASE_URL+'/home?from=plugin" target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup12.png"alt=""><p class="name">更多功能</p></a></li></ul><div class="bottom"><a href="'+BASE_URL+'/home?from=plugin" target="_blank">www.chaquanzhong.com</a><br/><span>v1.0.12</span></div></div></div>')
    } else {
        $('.chaqz-compete-wrap').remove();
    }
}
$(document).on('click', '.developing',function(){
    popTip('开发中，敬请期待...');
})
/**===========================市场竞争数字格式化方法以及页面信息======================================= */
// 白名单-不需要进行解密处理的
var DECRYPT_WHITE_LIST = ['shopInfo', 'relatedHotWord', 'currentDate']
// /////////////////////////////////////--------背景数据处理-------//////////////////////////////////////////////
   function receiveResponse(reqParams, resData, xhrType) {
     if (!xhrType) {
         var repHeader = reqParams ? reqParams[1].headers : "";
         var transId = repHeader ? repHeader['Transit-Id'] : ''
         if (transId) {
             sessionStorage.setItem('transitId', transId);
         }
     }
     var baseUrl = reqParams ? reqParams[0] : "";
     if (baseUrl) {
         for (var k in dataWrapper) {
             if ((new RegExp(dataWrapper[k].urlReg)).test(baseUrl)) {
                 // 根据期限存储数据
                 if (xhrType) {
                     resData = resData ? JSON.parse(resData) : '';
                 }
                 var isWhite = DECRYPT_WHITE_LIST.indexOf(k) != -1;
                 if (isWhite) {
                     var finaData = resData.data ? resData.data : resData;
                     finaData = JSON.stringify(finaData);
                 } else {
                     var hasEncryp = resData.data ? resData.data : resData;
                     var finaData = (typeof hasEncryp == 'object') ? resData : Decrypt(hasEncryp);
                 }
                //  var finaData = resData.data ? JSON.stringify(resData.data) : resData;
                //  finaData=JSON.stringify(finaData);
                //  var hasEncryp = resData.data ? resData.data : resData;
                //  var finaData = (typeof hasEncryp == 'object') ? resData : Decrypt(hasEncryp);
                 if (k == 'monitShop' || k == 'getMonitoredList') {
                     dataWrapper[k].data = finaData;
                     getParamsItem(baseUrl);
                 } else if (k == 'shopInfo') {
                     dataWrapper[k].data = finaData;
                     localStorage.setItem('chaqz_' + k, finaData);
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
                     // 获取ids
                     dataWrapper[k].ids = getItemId(baseUrl, 'url')
                 } else if (k == 'hotsale' || k == 'hotsearch' || k == 'hotpurpose') {
                     var dataTypes = getParamsItem(baseUrl,'passCateid')
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
                 } else if (k == 'publicInfo') {
                     var publicFont = JSON.parse(finaData);
                     var localId = publicFont ? publicFont[0] : '';
                     var saveId = localId.cateId.value;
                     dataWrapper[k].data = localId.orderEdition.value;
                     dataWrapper['getShopCate'].data.cateId = saveId;
                 } else if (k == 'getShopCate') {
                     var shopCateFont = JSON.parse(finaData);
                     var cateInfo = shopCateFont ? shopCateFont[0] : [];
                     dataWrapper[k].data.cateId = cateInfo[6];
                     dataWrapper[k].data.version = cateInfo[4];
                     dataWrapper[k].data.allInfo = shopCateFont;
                 } else if (k == 'ShopItemBrand') {
                    var kind = searchWhatType(baseUrl);
                    var kindtyps = getParamsItem(baseUrl)
                    localStorage.setItem('monit'+kind + kindtyps, finaData)
                 } else if (k == 'marketHot') {
                     var kind = searchWhatType(baseUrl);
                     var kindtyps = getParamsItem(baseUrl)
                     localStorage.setItem(k + kind + kindtyps, finaData)
                 } else if (k == 'listProp') {
                     var kind = searchWhatType(baseUrl);
                     var kindtyps = getParamsItem(baseUrl)
                     localStorage.setItem(k + kind + kindtyps, finaData)
                 } else {
                     
                     var dataTypes = getParamsItem(baseUrl)
                     localStorage.setItem(k + dataTypes, finaData)
                 }
             }
         }
     }
 }
// ------------------------data operator--------------------------------//
// 数据排序
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
// shop item brand who
function searchWhatType(url){
    var typeArr = ['shop','item','brand'];
    var res = '';
    url = url.toLowerCase();
    for (let i = 0; i < typeArr.length; i++) {
        const element = typeArr[i];
        if (url.indexOf(element) != -1){
            res = element;
            break;
        }
    }
    return res;
}
function Decrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("w28Cz694s63kBYk4");
    var iv = CryptoJS.enc.Utf8.parse('4kYBk36s496zC82w');
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
/**市场-监控看板-行业监控 */
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
    if (com == 'passCateid' || com == 'trend') {
        keyObj['cateId'] ? localStorage.setItem('shopCateId', keyObj['cateId']) : '';
    }
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
    } else if (com == 'product') {
        var orderBy = keyObj['orderBy'] ? keyObj['orderBy'] : 'tradeIndex';
       var device = keyObj['device'] ? keyObj['device'] : 0;
       key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + device + '&page=' + keyObj['page'] + '&pageSize=' + keyObj['pageSize'] + '&sellerType=' + keyObj['sellerType'] + '&orderBy=' + orderBy
    } else {
        var device = keyObj['device'] ? keyObj['device']:0;
        key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + device + '&page=' + keyObj['page'] + '&pageSize=' + keyObj['pageSize'] + '&sellerType=' + keyObj['sellerType']
    }
    return key
}  
function getCookie(keyword, sendResponse) { //获取搜索词
    $(".oui-date-picker .oui-canary-btn:contains('7天')").click()
    // chrome.storage.local.get('transitId', function (val) {
        var sessionKey = sessionStorage.getItem('transitId');
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
                "transit-id": sessionKey
            },
            success: function (res) {
                var resultData = res.data ? Decrypt(res.data) : '';
                localStorage.setItem('chaqz_search_keywords?' + finalTime + "&keywords=" + keyword, res.data)
                sendResponse(resultData)

            }
        })
    // })
}
//  市场搜索分析关键词
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'secahKeywords') {
        getCookie(request.keywords, sendResponse);
    } else if (request.type == 'goRootWord'){
         if (judgeCor()) {
             window.location.href = 'https://sycm.taobao.com/mc/mq/search_analyze';
         } else {
             popTip('暂只支持专业版/豪华版生意参谋账号', {
                 time: 2000
             });
         }
    } else if (request.type == 'userBtn') {
        if(!isNewVersion()){
            return false;
        }
        anyDom.getInfo();
        return false
    }
    return true
});
// 上传用户信息
function sendUserInfo() {
    var shopInfo = dealShopInfo();
    var shopUseId = shopInfo.runAsUserId;
    var shopUseName = shopInfo.runAsUserName;
    var shopCateId = dataWrapper['getShopCate'].data.cateId;
    var transitId = sessionStorage.getItem('transitId');
    var referer = 'https://sycm.taobao.com/mc/ci/item/analysis';
    chrome.storage.local.get('getCookie', function (val) {
        if (!shopUseId || !shopUseName || !shopCateId || !transitId || !val.getCookie) {
            return false;
        }
        var localCook = document.cookie;
        var sendCookie = localCook + "; cookie2=" + val.getCookie.value;
        chrome.runtime.sendMessage({
            key: 'getData',
            options: {
                url: 'http://118.25.153.205:8888/api/v1/plugin/data',
                type: 'post',
                contentType: "application/json,charset=utf-8",
                data: JSON.stringify({
                    "transitId": transitId,
                    "cookie": sendCookie,
                    "referer": referer,
                    "runAsUserId": shopUseId,
                    "runAsUserName": shopUseName,
                    "userCateId": shopCateId,
                }),
            }
        }, function (val) {
        })

    })
}
function interceptRequest() {
  // 在页面上插入代码
 window.removeEventListener("pageScript", orginStartFuns);
 window.addEventListener("pageScript", function (event) {
     var oriLen = orginInterceptData.length;
     if(oriLen){
         for (var i = 0; i < oriLen; i++) {
             var element = orginInterceptData[i];
             element ? receiveResponse(element.url, element.data, element.type) : '';
         }
         orginInterceptData = [];
     }
     receiveResponse(event.detail.url, event.detail.data, event.detail.type);
 })
}
//拖拽事件
var dragStatus = {
    disX: 0,
    disY: 0,
    _start: false,
    time: false
}
$(document).on('mousedown', '.popover-header .left', function (ev) {
    // 点击移动事件bug
    dragStatus.time = new Date();
    var ele = $('.chaqz-compete-wrap');
    dragStatus._start = true;
    var oEvent = ev || event;
    dragStatus.disX = oEvent.clientX - ele.offset().left;
    dragStatus.disY = oEvent.clientY - ele.offset().top;
    $(document).on("mousemove", function (ev) {
        if (dragStatus._start != true) {
            return false
        }
        var oEvent1 = ev || event;
        var scrollT = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollL = document.documentElement.scrollLeft || document.body.scrollLeft;
        var l = oEvent1.clientX - dragStatus.disX - scrollL;
        var t = oEvent1.clientY - dragStatus.disY - scrollT;
        t= t<0?0:t;
        $('.chaqz-compete-wrap').css({
            'left': l,
            top: t,
            bottom:'unset'
        })
    });
    $(document).on("mouseup", function (ev) {
        if (dragStatus._start != true) {
            return false
        }
        $(document).off("mousemove");
        $(document).off("mouseup");
        dragStatus._start = false;
    });
})
$(document).on('click', '.popover-header .left', function (ev) {
    var nowTime = new Date();
    var miunsTime = nowTime - dragStatus.time;
    if (miunsTime<500) {
        var ele = $('.chaqz-compete-wrap .content-wrap');
        if(ele.hasClass('isshow')){
            ele.show(300);
            ele.removeClass('isshow');
        }else{
            ele.hide(300);
            ele.addClass('isshow');
        }
    }
})