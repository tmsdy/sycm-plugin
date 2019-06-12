import {
    BASE_URL,
    LOCAL_VERSION
} from '../../common/constState'
import {
    popTip,
    popUp,
    dealShopInfo,
    changeLoginStatus,
    LogOut
} from '../../common/promptClass'
var isLogin = false; //是否登录
var SAVE_MEMBER = {};
var SAVE_BIND = {};
// var SET_WAIT_TIME = 600000
// 对应模块数据存储
var dataWrapper = {
    'monitShop': {
        urlReg: '\/mc(\/live\/|\/)ci\/shop\/monitor\/listShop\.json',
        data: []
    },
    'monitFood': {
        urlReg: '\/mc(\/live\/|\/)ci\/item\/monitor\/list\.json',
        data: {}
    },
    'monitCompareFood': {
        urlReg: '\/mc\/rivalItem\/analysis\/get(LiveCore|Core)Indexes.json',
        data: []
    },
    'monitResource': {
        urlReg: '\/mc\/rivalItem\/analysis\/get(LiveFlow|Flow)Source.json',
        data: []
    },
    'marketShop': {
        urlReg: '\/mc(\/live\/|\/)ci\/shop\/monitor\/list\.json',
        data: []
    },
    'marketHotShop': {
        urlReg: '\/mc\/mq\/monitor\/cate(.*?)\/showTopShops\.json',
        data: []
    },
    'marketHotFood': {
        urlReg: '\/mc\/mq\/monitor\/cate(.*?)\/showTopItems\.json',
        data: []
    },
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
        urlReg: '\/mc\/mq\/monitor\/offline\/public\.json'
    },
    "getShopCate": {
        urlReg: '\/mc\/common\/getShopCate\.json'
    }
}
window.dataWrapper2 = dataWrapper;
window.SAVE_MEMBER2 = SAVE_MEMBER;
window.SAVE_BIND2 = SAVE_BIND;


//  判断是否首次安装
clearLocalstorage();
// 触发数据监听
interceptRequest();
// chrome.runtime.sendMessage({
//     type: 'hello',
//     fitlerArr: dataWrapper
// }, function (response) {
// });
// 判断是否登录
chrome.storage.local.get('chaqz_token', function (valueArray) {
    var tok = valueArray.chaqz_token;
    if (tok) {
        localStorage.setItem('chaqz_token', tok);
        isLogin = true;
    } else {
        LogOut()
        isLogin = false;
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
            $('.op-mc-item-analysis .sycm-mc-flow-analysis .oui-card-header').append(showBtn());
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
         // 市场-搜索分析
         if (e.target.className == 'ebase-metaDecorator__root') {
             if (judgeCor()) {
                  $('.op-mc-search-analyze-container .oui-card-content').append('<div class="root-word-entry">输入关键词,按回车键</div>')
             } 
         }
         if (e.target.className == 'ebase-metaDecorator__root') {
             if (!judgeCor()){return false;}
             $('.op-mc-search-analyze-container .ebase-Switch__root').parent().append(showBtn())
         }
    });
})
/**-----用户信息登录模块方法-------------------*/
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
        var wrap = '<div class="chaqz-info-wrapper user"><div class="c-cont"><span class="close2 hided">×</span><div class="help"><img src="https://file.cdn.chaquanzhong.com/wenhao.png" alt="?"><a href="' + BASE_URL + '/pluginIntro" target="_blank">帮助</a></div><div class="infoList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><ul class="user-list"><li><span class="name">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:</span><span>' + acct + '</span><span class="fr" id="logout">退出登录</span></li><li><span class="name">会员信息:</span><span>' + title + '</span></li><li><span class="name">到期时间:</span><span>' + expirTime + '</span><a href="' + BASE_URL + '/homePage?from=plugin" target="_blank" class="fr">' + whetherOrder + '</a></li><li><span class="name">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span><span>' + LOCAL_VERSION + '</span></li><li><span class="name">联系客服:</span><span><a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><img class="mr_10" src="https://file.cdn.chaquanzhong.com/qq_icon.png" alt="qq"></a><img src="https://file.cdn.chaquanzhong.com/wx_icon.png" alt="wx" class="wxpop"></span></li><li><span class="name">店铺绑定</span><span>' + binded + '</span></li></ul></div></div></div>';
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
                SAVE_MEMBER = member;
                window.SAVE_MEMBER2 = member;
                chrome.storage.local.set({
                    'chaqz_token': token
                }, function () {});
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
                window.SAVE_BIND2 = bindInfo;
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
                LogOut()

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
    var curUrl = window.location.href;
    var isRootWord = curUrl.indexOf('https://sycm.taobao.com/mc/mq/search_analyze')==-1;
    var seachBtnText = isRootWord ? '一键转化' : '一键分析';
    if (isLogin) {
        reDom = '<div class="chaqz-btns btnsItem1"><button id="userBtn" class="serachBtn user">用户信息</button><button id="search" class="serachBtn">' + seachBtnText + '</button><button id="vesting" class="serachBtn vesting">一键加权</button><div>';
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
    anyDom.getShopBind();
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
        } else {
            LogOut()
        }
    })
   
}
// 判断版本
function judgeCor() {
    var shopLevel = localStorage.getItem('chaqz_getShopCate');
    if (shopLevel) {
        var allLev = JSON.parse(shopLevel)[0];
        var isHig = allLev ? allLev[4] : '';
        if (isHig == 'std') {
            return false;
        }
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
        $('.chaqz-compete-wrap').remove();
        return false;
    }
    var reg = /https:\/\/sycm\.taobao\.com\/mc\/(mq|ci)/
    var monitorPart = reg.test(url) ;
    if (isLogin && monitorPart) {
       $('body').append('<div class="chaqz-compete-wrap"><div class="head popover-header"><img class="" src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png" alt=""></div><div class="content"><div id="parsing"><img src="https://file.cdn.chaquanzhong.com/plugin-compete-analy.png" alt=""></div><div class="footer" id="weightParsing"><img src="https://file.cdn.chaquanzhong.com/weightPars.png" alt=""></div><div class="footer" id="goRootWord"><img src="https://file.cdn.chaquanzhong.com/root-word.png" alt=""></div></div></div>')
    } else {
        $('.chaqz-compete-wrap').remove();
    }
}

 $(document).on('click', '.chaqz-info-wrapper.pop #goBind', function () { //绑定店铺
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
 $(document).on('change', '.chaqz-info-wrapper.pop .table-wrap input', function () { //判断是否达到帮I定上限
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
 $(document).on('click', '.chaqz-info-wrapper.pop .activeShop', function () {
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
                 } else if (k == 'compareSelfList' || k == 'getShopCate') {
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
                     localStorage.setItem('shopCateId', saveId)
                 } else {
                     var dataTypes = getParamsItem(baseUrl)
                     localStorage.setItem(k + dataTypes, finaData)
                 }
             }
         }
     }
 }
// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         if (request.type == 'holdup') {
//             var baseUrl = request.url;
//             var resData = request.back;
//             if (baseUrl) {
//                 for (var k in dataWrapper) {
//                     if ((new RegExp(dataWrapper[k].urlReg)).test(baseUrl)) {
//                         // 根据期限存储数据
//                         var hasEncryp = JSON.parse(resData).data ? JSON.parse(resData).data : '';
//                         var finaData = (typeof hasEncryp == 'object') ? resData : Decrypt(hasEncryp);
//                         if (k == 'monitShop' || k == 'getMonitoredList') {
//                             dataWrapper[k].data = finaData;
//                             window.dataWrapper2[k].data = finaData;
//                         } else if (k == 'shopInfo') {
//                             dataWrapper[k].data = finaData;
//                             window.dataWrapper2[k].data = finaData;
//                             getParamsItem(baseUrl);
//                             localStorage.setItem('chaqz_' + k, finaData)
//                         } else if (k == 'compareSelfList') {
//                             localStorage.setItem('chaqz_' + k, finaData)
//                         } else if (k == 'monitCompareFood') {
//                             var dataTypes = getParamsItem(baseUrl, 'com')
//                             localStorage.setItem(k + dataTypes, finaData)
//                         } else if (k == 'getKeywords') {
//                             if (baseUrl.indexOf("topType=trade") != -1) {
//                                 var dataTypes = getParamsItem(baseUrl, 'only')
//                                 localStorage.setItem(k + dataTypes, finaData)
//                             }
//                         } else if (k == 'monitResource') {
//                             var dataTypes = getParamsItem(baseUrl, 'com')
//                             localStorage.setItem(k + dataTypes, finaData)
//                             // 获取ids
//                             dataWrapper[k].ids = getItemId(baseUrl, 'url')
//                             window.dataWrapper2[k].ids = getItemId(baseUrl, 'url')
//                         } else if (k == 'hotsale' || k == 'hotsearch' || k == 'hotpurpose') {
//                             var dataTypes = getParamsItem(baseUrl)
//                             var rankKey = marketRankType(baseUrl)
//                             var saveData = bubbleSort(finaData)
//                             localStorage.setItem(rankKey + '/' + k + dataTypes, saveData)
//                         } else if (k == 'allTrend') {
//                             var rankKey = marketRankType(baseUrl)
//                             var dataTypes = getParamsItem(baseUrl, 'trend', rankKey)
//                             localStorage.setItem(rankKey + '/' + k + dataTypes, finaData)
//                         } else if (k == 'trendShop') {
//                             var rankKey = marketRankType(baseUrl)
//                             var dataTypes = getParamsItem(baseUrl, 'trendShopInfo', rankKey)
//                             localStorage.setItem(rankKey + '/' + k + dataTypes, finaData)
//                         } else if (k == 'currentDate') {
//                             localStorage.setItem(k, finaData)
//                         } else {
//                             var dataTypes = getParamsItem(baseUrl)
//                             localStorage.setItem(k + dataTypes, finaData)
//                         }
//                     }
//                 }
//             }
//             sendResponse('shoudao')
//         }
//     })
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
    if (!(com == 'passCateid' || com == 'trend')) {
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
    } else {
        key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&page=' + keyObj['page'] + '&pageSize=' + keyObj['pageSize'] + '&sellerType=' + keyObj['sellerType']
    }
    return key
}
// 不可删除
// chrome.runtime.sendMessage({
//     type: 'listenContat'
// }, function () {})
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
    } 
    return true
});
// 上传用户信息
function sendUserInfo() {
    var shopInfo = dealShopInfo();
    var shopUseId = shopInfo.runAsUserId;
    var shopUseName = shopInfo.runAsUserName;
    var shopCateId = localStorage.getItem('shopCateId');
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
    hasSet: false,
    time: false
}
$(document).on('mousedown', '.popover-header', function (ev) {
    // 点击移动事件bug
    dragStatus.time = new Date();
    var ele = $('.chaqz-compete-wrap');
    dragStatus._start = true;
    var oEvent = ev || event;
    dragStatus.disX = oEvent.clientX - ele.offset().left;
    dragStatus.disY = oEvent.clientY - ele.offset().top;
    if (dragStatus.hasSet) {
        return;
    }
    dragStatus.hasSet = true;
    $(document).on("mousemove", function (ev) {
        if (dragStatus._start != true) {
            return false
        }
        //  if (obj != self.moved) {
        //      return false
        //  }
        //  self._move = true;
        var oEvent1 = ev || event;
        var l = oEvent1.clientX - dragStatus.disX;
        var t = oEvent1.clientY - dragStatus.disY;
        ele.css({
            'left': l,
            top: t,
            bottom:'unset'
        })
    });
    $(document).on("mouseup", function (ev) {
        if (dragStatus._start != true) {
            return false
        }
        //  ele.unbind("onmousemove");
        //  ele.unbind("onmouseup");
        dragStatus._start = false;
    });
})
$(document).on('click', '.popover-header', function (ev) {
    var nowTime = new Date();
    var miunsTime = nowTime - dragStatus.time;
    if (miunsTime<500) {
        var ele = $('.chaqz-compete-wrap .content');
        if(ele.hasClass('isshow')){
            ele.show(300);
            ele.removeClass('isshow');
        }else{
            ele.hide(300);
            ele.addClass('isshow');
        }
    }
})