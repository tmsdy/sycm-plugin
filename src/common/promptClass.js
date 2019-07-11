//  弹窗，吐司呀，loading
import {
    BASE_URL,
    // LOCAL_VERSION
} from './constState'
 // 弹窗模块
 export var popUp = {
     version: '<p class="tips">为了更好的体验，请到官网下载最新版本。</p><div class="cha-btns"><a class="btn" href="' + BASE_URL + '/pluginIntro" target="_blank"><button class="btn">前往下载</button></a></div>',
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
     goChoose: '<p class="tips">请在竞品分析界面，选择目标竞品。</p><div class="cha-btns"><button class="btn mr_30 hides cancel">取消</button><a href="https://sycm.taobao.com/mc/ci/item/analysis"><button class="btn">去选择</button></div>',
    onlyOne: '<p class="tips">竞品选择有误，现仅支持单项竞品加权。</p><div class="cha-btns"><button class="btn hides">确定</button></div>',
    emptyChoose: '<p class="tips">未选择竞品，请先选择竞品<br><span style="font-size:14px;">现仅支持单项竞品加权</span></p><div class="cha-btns"><button class="btn hides">确定</button></div>',
     competingGoodsAnalysis: '<p class="head-title">竞品分析</p><div class="cross-tabs"><span class="cross-btn hasCross">监控商品</span><span class="cross-btn">跨类目商品</span></div><div class="analy-goods"><input type="text" class="anayEditor selcet" placeholder="请输入url或者商品id"><p class="good-tips"></p></div><div class="cha-btns"><button class="btn analyBtn">数据解析</button><button class="btn analyBtn">流量解析</button><button class="btn analyBtn ">关键词解析</button></div><p class="bot-tips ">暂只支持同类目竞品解析</p>',
     competingTopAnalysis: '<p class="head-title">权重解析</p><div class="analy-goods"><input type="text" class="anayEditor selcet" placeholder="请输入url或者商品id"><p class="good-tips"></p></div><div class="cha-btns"><button class="btn hides mr_30 cancel">取消</button><button class="btn analyBtn2">确定</button></div><p class="bot-tips">暂只支持监控商品权重解析</p>',
     goOperator: '<p class="tips">前往将商品添加到监控</p><div class="cha-btns"><a class="btn" href="https://sycm.taobao.com/mc/ci/config/rival?activeKey=item"><button class="btn">前往添加</button></a><button class="btn hides mr_30 cancel">取消</button></div>',
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
         var bindList = SAVE_BIND2.data;
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
         // 事件加载
         $('.chaqz-info-wrapper.pop').on('click', '.buyBtn', function () {
             window.open(BASE_URL + '/homePage?from=plugin')
             _that.init('orderSucc')
         })
         $('.chaqz-info-wrapper.pop').on('click', '#pageRefresh', function () { //刷新
             window.location.reload();
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
         $(document).on('blur', '.chaqz-info-wrapper.pop .anayEditor', function () {
             $(this).siblings('.good-tips').removeClass('alert')
         })
         $(document).on('click', '.chaqz-info-wrapper.pop .contactService', function () {
             _that.init('weixin')
         })
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

 }
 // loading
 export function LoadingPop(status) {
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
      //  var info = dataWrapper.shopInfo.data
      var localShop = localStorage.getItem('chaqz_shopInfo')
      //  if (info.length) {
      //      var ret = JSON.parse(info).data
      //      return ret
      //  }
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
           anyDom.init();
           return false
       }
      var allInfo = window.SAVE_MEMBER2
      if (!allInfo) {
          popUp.init('noShopInfo');
          return false;
      }
      var memInfo = allInfo.member; //会员信息
    //   var bindInfo = window.SAVE_BIND2; //绑定信息
    //   var shopInfo = dealShopInfo(); //店铺信息
      //不是否为会员
      if (!memInfo) {
          LogOut()
          return false;
      }
      return true
    //   var star_time = allInfo.time;
    //   var star_end = memInfo.expireAt;
    //   var remian = new Date(star_end) - star_time * 1000;
      //会员过期
    //   if (remian <= 0) {
    //       popUp.init('overdue')
    //       return false;
    //   }
    //   var hasBind = bindInfo.data.length; //已绑定数量
    //   var totalBind = bindInfo.count; //可绑定数量
    //   var isSelf = false
    //   var isClose = false
    //   var activeNum = 0
    //   bindInfo.data.forEach(function (item) {
    //       if (item['runShopId'] == shopInfo['runAsShopId']) {
    //           isSelf = true
    //           isClose = item['closed']
    //       }
    //       if (item['closed'] == 0) {
    //           activeNum++
    //       }
    //   })
    //   if (!isSelf) { // 不是本店铺
    //       if (hasBind < totalBind) {
    //           popUp.init('binding')
    //           return false
    //       }
    //       if (memInfo.level < 4) {
    //           popUp.init('upLimit')
    //           return false
    //       }
    //       popUp.init('bindLimit')
    //       return false
    //   }
    //   if (isClose == 0) { //激活
    //       return true;
    //   }
    //   if (activeNum < totalBind) { //未达激活上限
    //       popUp.init('active2')
    //       return false
    //   }
    //   if (memInfo.level < 4) {
    //       popUp.init('upLimit')
    //       return false
    //   }
    //   popUp.init('bindLimit')
    //   return false
  }
// 登录状态切换
export function changeLoginStatus(type) {
    if (type == 'out') {
        $('.chaqz-btns').html('<button id="loginbtn" class="serachBtn user">登录</button>');
        // $('.chaqz-compete-wrap').remove();
    } else {
        $('.chaqz-btns').html('<button id="search" class="serachBtn">一键转化</button>' );
        $('.op-mc-item-analysis #itemAnalysisTrend .oui-card-header .chaqz-btns').html('<button id="search" class="serachBtn">一键转化</button><button id="vesting" class="serachBtn vesting">一键加权</button>');
        $('.op-mc-search-analyze-container .ebase-Switch__root .chaqz-btns').html('<button id="search" class="serachBtn">一键分析</button>');
        if ($('.chaqz-compete-wrap').length){
            return false;
        }
        // $('body').append('<div class="chaqz-compete-wrap"><div class="head popover-header"><div class="left"><img class=""src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png"alt=""></div><img  id="userBtn"src="https://file.cdn.chaquanzhong.com/chaqz-plugins-avator.png" alt="" class="avator"></div><div class="content-wrap"><ul class="content"><li class="item"id="parsing"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup1.png"alt=""><p class="name">竞品解析</p></li><li class="item"id="weightParsing"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup2.png"alt=""><p class="name">权重解析</p></li><li class="item"id="goRootWord"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup3.png"alt=""><p class="name">词根透视</p></li><li class="item"><a href="https://sycm.taobao.com/mc/ci/item/analysis"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup4.png"alt=""><p class="name">一键加权</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/chaheihao"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup5.png"alt=""><p class="name">黑号查询</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/Kasp"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup6.png"alt=""><p class="name">卡首屏</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/infiniteRank"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup7.png"alt=""><p class="name">查排名</p></a></li><li class="item"><a href=""target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup8.png"alt=""><p class="name">淘宝订单检测</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/toolIndex"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup9.png"alt=""><p class="name">在线查指数</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/home"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup12.png"alt=""><p class="name">更多功能</p></a></li></ul><div class="bottom"><a href="https://www.chaquanzhong.com/home"target="_blank">www.chaquanzhong.com</a><br/><span>v1.0.8</span></div></div></div>')
    }
}
// 退出登录
export function LogOut() {
    isLogin = false;
    changeLoginStatus('out');
    chrome.storage.local.remove(['chaqz_token', 'compareProduceData'], function () {});
    localStorage.removeItem('chaqz_token');
    LoadingPop();
    $('#caseBlanche').remove();//词根管理弹窗
}
// d登录
 export var anyDom = {
    loginDom: '<div class="chaqz-info-wrapper login"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><div class="formList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><div class="phone"><input id="phone" type="text" placeholder="请输入手机号码"><p class="tips">请输入手机号码</p></div><div class="pwd"><input id="pwd" type="password" placeholder="请输入登录密码"><p class="tips">请输入登录密码</p></div><div class="router"><a href="' + BASE_URL + '/reg" class="right" target="_blank">免费注册</a><a href="' + BASE_URL + '/findP" target="_blank">忘记密码</a></div><button class="orange-default-btn login-btn">登录</button></div></div></div>',
    infoDom: function (memInfo, bindedInfo) {
        var acct = memInfo.username;
        var title = memInfo.member.title;
        var expirTime = memInfo.member.expireAt;
        var whetherOrder = '';
        // var binded = '未绑定';
        // var shopInfo = dealShopInfo();
        if (title && expirTime) {
            var formDate = new Date(expirTime)
            var isExpire = formDate - memInfo.time * 1000
            if (isExpire > 0) {
                whetherOrder = '续费';
            } else {
                whetherOrder = '订购';
            }
            // bindedInfo.data.forEach(function (item) {
            //     if (item['mainUid'] = shopInfo['mainUserId']) {
            //         binded = "已绑定"
            //     }
            // })
        } else {
            title = '普通会员';
            expirTime = '--';
            whetherOrder = '订购'
            // binded = '未绑定'
        }
        var wrap = '<div class="chaqz-info-wrapper user"><div class="c-cont"><span class="close2 hided">×</span><div class="help"><img src="https://file.cdn.chaquanzhong.com/wenhao.png" alt="?"><a href="' + BASE_URL + '/pluginIntro" target="_blank">帮助</a></div><div class="infoList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><ul class="user-list"><li><span class="name">账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户:</span><span>' + acct + '</span><span class="fr" id="logout">退出登录</span></li><li><span class="name">会员信息:</span><span>' + title + '</span></li><li><span class="name">到期时间:</span><span>' + expirTime + '</span><a href="' + BASE_URL + '/vipInfo?from=plugin" target="_blank" class="fr">' + whetherOrder + '</a></li><li><span class="name">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本:</span><span>' + LOCAL_VERSION + '</span></li><li><span class="name">联系客服:</span><span><a href="tencent://message/?uin=3531553166&amp;Site=qq&amp;Menu=yes"><img class="mr_10" src="https://file.cdn.chaquanzhong.com/qq_icon.png" alt="qq"></a><img src="https://file.cdn.chaquanzhong.com/wx_icon.png" alt="wx" class="wxpop"></span></li></ul></div></div></div>';
        // <li><span class="name">店铺绑定</span><span>' + binded + '</span></li>
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
                // SAVE_MEMBER = member;
                window.SAVE_MEMBER2 = member;
                var saveToke = {
                    expiration: val.data.expire,
                    token: token
                }
                chrome.storage.local.set({
                    'chaqz_token': saveToke,
                    'chaqzShopInfo': member
                }, function () {});
                isLogin = true;
                // window.isLogin = true;
                // _that.getShopBind()
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
        $('.chaqz-info-wrapper #phone').blur(function () {
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
        $('.chaqz-info-wrapper #pwd').blur(function () {
            var pwdValue = $(this).val()
            if (!pwdValue) {
                $(this).siblings('.tips').text('请输入密码').show()
            } else {
                $(this).siblings('.tips').hide()
            }
        })
        // 登录处理
        $('.chaqz-info-wrapper .login-btn').click(function () {
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
        $('.chaqz-info-wrapper .hided').click(function () {
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
            var memInfo = SAVE_MEMBER2;
            // var bindInfo = SAVE_BIND;
            if (memInfo.member) {
                // this.infoDom(memInfo, bindInfo)
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