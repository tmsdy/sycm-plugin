//  弹窗，吐司呀，loading
import {
    BASE_URL,
    LOGO_BASE_URL,
} from './constState'
 // 弹窗模块
 export var popUp = {
     version: '<p class="tips">为了更好的体验，请到官网下载最新版本。</p><div class="cha-btns"><a class="btn" href="' + BASE_URL + '/pluginIntro" target="_blank"><button class="btn">前往下载</button></a></div>',
     orderMem: '<p class="tips">账户未开通会员，请联系客服或订购会员。</p><div class="cha-btns"><a class="mr_30 btn" href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><button class="btn">联系客服</button></a><button class="btn buyBtn">订购</button></div>',
     overdue: '<p class="tips">会员已过期，请重新订购。</p><div class="cha-btns"><button class="btn buyBtn">订购</button></div>',
     renewal: '<p class="tips"> 会员已过期， 为不影响正常使用，<br>请前往官网续费。</p><div class="cha-btns"><button class="cancel mr_30 btn">暂不处理</button><button class="btn">续费</button></div>',
     orderSucc: '<p class="tips">若订购成功请刷新。</p><div class="cha-btns"><button id="pageRefresh" class="btn">确定</button></div>',
     noShopInfo: '<p class="tips">未获取用户信息，请刷新页面重试。</p><div class="cha-btns"><button id="pageRefresh" class="btn">确定</button></div>',
     weixin: '<p class="head">查权重客服很高兴为您服务</p><img src="https://file.cdn.chaquanzhong.com/wx_contact.jpg" alt="wx"><p class="foot">微信扫一扫 添加客服</p>',
    onlyOne: '<p class="tips">竞品选择有误，现仅支持单项竞品加权。</p><div class="cha-btns"><button class="btn hides">确定</button></div>',
    emptyChoose: '<p class="tips">未选择竞品，请先选择竞品<br><span style="font-size:14px;">现仅支持单项竞品加权</span></p><div class="cha-btns"><button class="btn hides">确定</button></div>',
     competingGoodsAnalysis: '<p class="head-title">竞品分析</p><div class="cross-tabs"><span class="cross-btn hasCross">监控商品</span><span class="cross-btn">跨类目商品</span></div><div class="analy-goods"><input type="text" class="anayEditor selcet" placeholder="请输入url或者商品id"><p class="good-tips"></p></div><div class="cha-btns"><button class="btn analyBtn">数据解析</button><button class="btn analyBtn">流量解析</button><button class="btn analyBtn ">关键词解析</button></div><p class="bot-tips ">暂只支持同类目竞品解析</p>',
     competingTopAnalysis: '<p class="head-title">权重解析</p><div class="analy-goods"><input type="text" class="anayEditor selcet" placeholder="请输入url或者商品id"><p class="good-tips"></p></div><div class="cha-btns"><button class="btn hides mr_30 cancel">取消</button><button class="btn analyBtn2">确定</button></div><p class="bot-tips">暂只支持监控商品权重解析</p>',
     goOperator: '<p class="tips">前往将商品添加到监控</p><div class="cha-btns"><a class="btn" href="https://sycm.taobao.com/mc/ci/config/rival?activeKey=item"><button class="btn mr_30">前往添加</button></a><button class="btn hides  cancel">取消</button></div>',
     addMointored: '<p class="tips">前往将商品添加到监控</p><div class="cha-btns"><button class="btn mr_30 addMointored">前往添加</button><button class="btn hides  cancel">取消</button></div>',
     wantPromptTitle: '<p class="tips"> 标题对加权计划及效果影响较大，<br/>是否需优化宝贝标题 </p><div class="cha-btns"><button class="cancel mr_30 btn jugdeItem">忽略</button><button class="btn promptTitle">优化</button></div> ',
     promptTitle: '<p class="head">添加客服领取标题优化教程，按照教程并修改标题，点击下一步</p><img src="https://file.cdn.chaquanzhong.com/promt-wx.png" alt="wx" style="margin-top: -20px;margin-bottom: 20px;"><div class="cha-btns"><button class="cancel mr_30 btn jugdeItem">忽略</button><button class="btn jugdeItem">下一步</button></div>',
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
         // 事件加载
         $('.chaqz-info-wrapper.pop').on('click', '.buyBtn', function () {
             window.open(BASE_URL + '/homePage?from=plugin')
             _that.init('orderSucc')
         })
         $('.chaqz-info-wrapper.pop').on('click', '#pageRefresh', function () { //刷新
             window.location.reload();
         })
         $('.chaqz-info-wrapper.pop').on('click', '.promptTitle',function () { //标题优化
            _that.init('promptTitle')
         })
         $('.chaqz-info-wrapper.pop').on('click', '.hides ',function () {
            $('.chaqz-info-wrapper.pop').hide();
            $('#caseBlanche').remove();
         })
         $('.chaqz-info-wrapper.pop').on('blur', '.chaqz-info-wrapper.pop .anayEditor', function () {
             $(this).siblings('.good-tips').removeClass('alert')
         })
     },
     changeDom: function(types, data1) {
         //弹窗存在更换内容
         var changeHtml = ''
         if (typeof this[types] == 'function') {
             changeHtml = this[types](data1)
         } else {
             changeHtml = this[types]
         }
         $('.chaqz-info-wrapper.pop .c-cont .alert').html(changeHtml)
         $('.chaqz-info-wrapper.pop').show()
     }

 }
 // loading
 export function LoadingPop(status) {
     if (!status) {
         $('.load-pop').fadeOut(100)
         return false
     }
     var load = $('.load-pop')
     if (load.length) {
         load.show();
         return false;
     }
     $('body').append('<div class="load-pop"><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div>')
 }
 // tushi
 export function popTip(text, options) {
     var st = '';
     var tm = 500;
     if(options){
         st = options ? options.style:'';
         tm = options ? options.time:tm;
     }
     $('#app').append('<div class="small-alert" style="' + st + '">' + text + '</div>');
     setTimeout(function () {
         $('#app .small-alert').fadeOut(300,function(){
             $('#app .small-alert').remove();
         })
     }, tm)
 }
  // 获取店铺信息
  export function dealShopInfo() {
      var localShop = localStorage.getItem('chaqz_shopInfo')
      if (localShop) {
          var resd = JSON.parse(localShop)
          return resd
      }
      return '';
  }
  //check is pass
  export function isNewVersion() {
    //    if (process.env.NODE_ENV == 'production') {
        //    if (CHAQZ_VERSION != LOCAL_VERSION) {
        //        popUp.init('version')
        //        return false
        //    }
    //    }
      try {
          if (CHAQZ_VERSION != LOCAL_VERSION) {
              popUp.init('version')
              return false
          }
      } catch (err) {
          popUp.init('version')
          return false
      }
       if (!isLogin) {
           anyDom.login();
           return false
       }
      var allInfo = window.SAVE_MEMBER2
      if (!allInfo) {
          popUp.init('noShopInfo');
          return false;
      }
      var memInfo = allInfo.member; //会员信息
      //不是否为会员
      if (!memInfo) {
          LogOut()
          return false;
      }
      return true
  }
// 登录状态切换
export function changeLoginStatus(type) {
    if (type == 'out') {
        $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>');
    } else {
        $('.chaqz-btns').html('<button id="search" class="serachBtn">一键转化</button>' );
        $('.op-mc-item-analysis #itemAnalysisTrend .oui-card-header .chaqz-btns').html('<button id="search" class="serachBtn">一键转化</button><button id="vesting" class="serachBtn vesting">一键加权</button>');
        $('.op-mc-search-analyze-container .ebase-Switch__root .chaqz-btns').html('<button id="search" class="serachBtn">一键分析</button>');
        if ($('.op-mc-market-rank-container .ebase-FaCommonFilter__root .oui-tab-switch .oui-tab-switch-item-active').index() == 1) {
            $('.op-mc-market-rank-container .oui-card-header .chaqz-btns').append('<button id="mergeItem" class="serachBtn ">合并转化</button>');
        }
    }
}
// 退出登录
export function LogOut() {
    isLogin = false;
    changeLoginStatus('out');
    chrome.storage.local.remove(['compareProduceData', 'chaqz_token'], function () {});
    localStorage.removeItem('chaqz_token');
    LoadingPop();
    $('#caseBlanche').remove();//词根管理弹窗
}
// d登录
 export var anyDom = {
    infoDom: function (memInfo, bindedInfo) {
        var acct = memInfo.username;
        var title = memInfo.member.title;
        var expirTime = memInfo.member.expireAt;
        var whetherOrder = '';
        if (title && expirTime) {
            var formDate = new Date(expirTime)
            var isExpire = formDate - memInfo.time * 1000
            if (isExpire > 0) {
                whetherOrder = '续费';
            } else {
                whetherOrder = '订购';
            }
        } else {
            title = '普通会员';
            expirTime = '--';
            whetherOrder = '订购'
        }
        var wrap = '<div class="chaqz-info-wrapper user"><div class="c-cont"><span class="close2 hided">×</span><div class="help"><img src="https://file.cdn.chaquanzhong.com/wenhao.png" alt="?"><a href="' + BASE_URL + '/pluginIntro" target="_blank">帮助</a></div><div class="infoList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><ul class="user-list"><li><span class="name">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:</span><span>' + acct + '</span><span class="fr" id="logout">退出登录</span></li><li><span class="name">会员信息:</span><span>' + title + '</span></li><li><span class="name">到期时间:</span><span>' + expirTime + '</span><a href="' + BASE_URL + '/vipInfo?from=plugin" target="_blank" class="fr">' + whetherOrder + '</a></li><li><span class="name">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span><span>' + LOCAL_VERSION + '</span></li><li><span class="name">联系客服:</span><span><a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><img class="mr_10" src="https://file.cdn.chaquanzhong.com/qq_icon.png" alt="qq"></a><img src="https://file.cdn.chaquanzhong.com/wx_icon.png" alt="wx" class="wxpop"></span></li></ul></div></div></div>';
        $('#app').append(wrap);
    },
    login: function () {
            var curUrl = window.location.href.split('?')[0];
            var dumpUrl = LOGO_BASE_URL + '/java/api/v1/platfrom/userAuth/acceptAppInfo?appId=M177293746593&callback=' + curUrl + '&redirectUrl=' + LOGO_BASE_URL + '/login&check=GPFEX346'
            window.open(dumpUrl, '_blank')
            return 
    },
    init: function () {
        var _that = this
        $('#app').append(this.loginDom);
    },
    getInfo: function () {
        var userWrap = $('.chaqz-info-wrapper.user')
        if (userWrap.length) {
            userWrap.show()
        } else {
            var memInfo = SAVE_MEMBER2;
            if (memInfo.member) {
                this.infoDom(memInfo)
            } else {
                popUp.init('noShopInfo')
            }
            $('.chaqz-info-wrapper .hided').click(function () {
                $('.chaqz-info-wrapper.user').hide()
            })
            $('.chaqz-info-wrapper #logout').click(function () {
                $('.chaqz-info-wrapper.user').hide();
                LogOut()

            })
            $('.chaqz-info-wrapper.user .wxpop').click(function () {
                $('.chaqz-info-wrapper.user').hide()
                popUp.init('weixin')
            })
        }
    }
}