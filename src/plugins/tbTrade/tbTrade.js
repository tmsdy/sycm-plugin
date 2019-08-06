console.log("taobao 交易管理");

var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://www.chaquanzhong.com' :
    'http://118.25.153.205:8090';
var LOGO_BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://account.chaquanzhong.com' : 'http://118.25.92.247:8099';
var LOCAL_VERSION = '1.0.14';
var isLogin = false;
var searchWang = '';
var SAVE_MEMBER = {};

checkLoginCode()

    var haset = true;
    $(document).on('DOMNodeInserted', '.ww-light.ww-large', function (e) {
        // console.log(e.target.id, ',', e.target.className)
        if (e.target.className.indexOf('ww-inline')!=-1) {
            if (haset) {
                $('.item-mod__trade-order___2LnGB .buyer-mod__buyer___3NRwJ').parent().append('<button id="chaqzSearch" class="tbtrade-btn">点击查黑号</button>');
                $('.item-mod__thead-cell___3aIQ_:first-child').append('<button id="chaqzCheck" class="tbtrade-btn" style="margin-left:20px;">淘客订单检测</button>');
                haset = false
            }

        }
    })
    $(document).on('click', '#sold_container .pagination li', function () {
        haset = true;
    })
    $(function () {
      // 右下角

      rightConcer()
})
$(document).on('click', '#chaqzSearch', function () {
    var tbName = $(this).siblings().find('.buyer-mod__name___S9vit').text();
    isLogin ? anyDom.searchHei(tbName) : anyDom.init(tbName);

})
// 逃课检测
$(document).on('click', '#chaqzCheck', function () {
    var tbName = $(this).prev().children().eq(3).text()+'';
    isLogin ? anyDom.searchTbk(tbName) : anyDom.init();

})
// 判断是否登录过来
function checkLoginCode() {
    var url = window.location.href;
    var hasCode = getSearchPara(url, 'code');
    var hasAccout = getSearchPara(url, 'account');
    if (hasCode && hasAccout) {
        var cutPara = url.replace(/account=\d*&?/, '')
        var cutPara2 = cutPara.replace(/code=\w*&?/, '')
        chrome.runtime.sendMessage({
            key: "getData",
            options: {
                url: BASE_URL + '/api/v1/user/token',
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify({
                    account: hasAccout,
                    code: hasCode
                }),
            }
        }, function (val) {
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
            isLogin = true;
            window.location.href = cutPara2;
        })
    } else {
        chrome.storage.local.get(['chaqz_token', 'chaqzShopInfo'], function (valueArray) {
            var tok = valueArray.chaqz_token;
            if (tok) {
                localStorage.setItem('chaqz_token', tok.token);
                isLogin = true;
                getUserInfo()
            } else {
                isLogin = false;
            }
        });
    }
}
function getSearchPara(url, key) {
    if (!url) return '';
    var params = url.split('?')[1];
    var parList = params.split('&');
    var res = '';
    for (let i = 0; i < parList.length; i++) {
        const element = parList[i];
        var keyVale = element.split('=');
        if (keyVale[0] == key) {
            res = keyVale[1]
            break;
        }
    }
    return res;
}
var anyDom = {
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
        $('#page').append(wrap);

    },
    init: function () {
         var curUrl = window.location.href.split('?')[0];
         var dumpUrl = LOGO_BASE_URL + '/java/api/v1/platfrom/userAuth/acceptAppInfo?appId=M177293746593&callback=' + curUrl + '&redirectUrl=' + LOGO_BASE_URL + '/login&check=GPFEX346'
         window.open(dumpUrl, '_blank')
         return
    },
    getInfo: function () {
        var userWrap = $('.chaqz-info-wrapper.user')
        if (userWrap.length && isLogin) {
            userWrap.show()
        } else {
            var memInfo = SAVE_MEMBER;
            if (memInfo.member) {
                anyDom.infoDom(memInfo)
            } else {
                anyDom.init()
            }
            $('.chaqz-info-wrapper #logout').click(function () {
                $('.chaqz-info-wrapper.user').hide();
                logOut()
            })
        }
    },
    searchHei: function (tbName) {
        LoadingPop('show')
        var saveToke = localStorage.getItem('chaqz_token');
        chrome.runtime.sendMessage({
            key: "getData",
            options: {
                url: BASE_URL + '/api/v1/tools/failAccountCenter?account=' + tbName,
                type: "GET",
                headers: {
                    Authorization: "Bearer " + saveToke
                }
            }
        }, function (val) {
            if (val.code == 200 || val.code == 202) {
                domstrcut(val.data)
            } else if (val.code == -5500 || val.code == -5501 || val.code == -5502) {
                popUp.init('renewal')
            } else if (val.code == 2030) {
                setIntRefreshToken(anyDom.searchHei(tbName),1)
                // searchWang = tbName;
            //    logOut()
            //    popUp.init('hasLogout')
            } else {
                popTip('未查询到结果')
            }
            LoadingPop()
        })
    },
    searchTbk:function(ids){
        var text = 'https://mos.m.taobao.com/union/query_cps_result?tbTradeParentId=' + ids;
        popUp.init('weixin')
        var QRCode = require('qrcode');
        var canvas = document.getElementById('qrcode');
        QRCode.toCanvas(canvas, text, function (error) {
            if (error) console.error(error)
            console.log('success!');
        })
    }
}
  function getUserInfo() {
      var saveToke = localStorage.getItem('chaqz_token');
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
              isLogin = true;
          } else {
              setIntRefreshToken(getUserInfo)
            //   isLogin = false;
            //   LogOut()
          }
      })
  }
  function setIntRefreshToken(cb,type) {
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
           if (val.code != 200 ) {
               isLogin = false;
               logOut();
               type ? popUp.init('hasLogout'):'';
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
           // 背景页解决方案
           // tellRefreshToken(val.data.expires,curToken)
          cb && cb()
      })
  }
//   function tellRefreshToken(time) {
//       chrome.runtime.sendMessage({
//           type: 'hasTefresToken',
//           time,curToken
//       }, function (res) {})
//   }
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.type == 'taTragePage') {
//         localStorage.setItem('chaqz_token', request.resToken);
//     }
// })
function logOut(){
    isLogin = false;
    SAVE_MEMBER = {};
    chrome.storage.local.remove(['chaqzShopInfo', 'chaqz_token'], function () {});
    localStorage.removeItem('chaqz_token');
}
// 个人信息
$(document).on('click', '#userBtn', function () {
anyDom.getInfo();
    return false
});
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

function domstrcut(data) {
    if (!data) {
        return ''
    }
    var wLevel = /^V/.test(data.vLevel) ? data.vLevel : data.vLevel !== '-1' ? ('V' + data.vLevel) : '0'; //等级
    var levelImg = wLevel ? ('<img src="https://file.cdn.chaquanzhong.com/hLevel-' + wLevel + '.png"alt="">') : ''; //等级icon
    var isShoper = data.supper == '是' ? '是' : data.supper == '否' ? '否' : '否';
    var isShoperImg = data.supper == '是' ? 'hShoper.png' : 'hNoshpper.png';

    var sex = data.sex.indexOf('女') != -1 ? '女' : data.sex.indexOf('男') != -1 ? '男' : '';
    var sexImg = data.sex.indexOf('女') != -1 ? 'hSex-w.png' : data.sex.indexOf('男') != -1 ? 'hSex-m.png' : '';
    var customerLabel = data.channel == 3 ? (data.tagInfo.tagCat ? ('<div class="customer-label"><span class="customr">用户标签</span>' + data.tagInfo.tagCat + '</div>'):'') : data.tag ? ('<div class="customer-label"><span class="customr">用户标签</span>' + data.tag + '</div>') : '';
    var isShop = data.isshoper ? data.isshoper : '~';
    var week = data.week !== '' ? data.week : '~'; //周率
    var prestige = heartShow(data.prestige); //星钻
    var xfld = data.xfld ? data.xfld + '元' : "~"; //消费力度
    var LastLoginTime = data.LastLoginTime ? data.LastLoginTime : data.last_visit ? data.last_visit : '~';; //最近登录
    var regArea = data.area ? data.area : data.Area ? data.Area : '~';
    var queryNum = data.QueryNum ? data.QueryNum : 0;
    var isRealname = data.realname?'已实名认证':"未实名认证";
    var dom = '<div class="chaqz-info-wrapper tbtrade"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><table class="trade-table"><tr><td><span class="label">旺旺号：</span>' + data.aliname + '<img src="https://file.cdn.chaquanzhong.com/hwangwnag.png"alt=""></td><td><span class="label">会员等级：</span>' + wLevel + levelImg + '</td><td><span class="label">是否商家：</span>' + isShop + '</td></tr><tr><td><span class="label">性别：</span>' + sex + '<img src="https://file.cdn.chaquanzhong.com/' + sexImg + '"alt=""></td><td><span class="label">好评率：</span><span class="hot">' + data.evaluate + '</span></td><td><span class="label">注册地区：</span>' + regArea + '</td></tr><tr><td><span class="label">注册时间：</span>' + data.register + '</td><td><span class="label">淘龄：</span><span class="hot">' + data.tbages + '</span></td><td><span class="label">周均单：</span>' + week + '</td></tr><tr><td><span class="label">是否实名：</span><span class="blue">' + isRealname + '</span></td><td><span class="label">是否超级会员：</span>' + isShoper + '<img src="https://file.cdn.chaquanzhong.com/' + isShoperImg + '"alt=""></td><td><span class="label">买家信誉：</span>' + prestige + '</td></tr><tr><td><span class="label">最近消费力度：</span><span>' + xfld + '</span></td><td><span class="label">最近登录时间：</span>' + LastLoginTime + '</td><td><span class="label">查询次数：</span>' + queryNum + '</td></tr></table>' + customerLabel + '<table class="report-table"><tr class="thead"><td>举报类型</td><td>跑单</td><td>敲诈</td><td>骗子</td><td>打假</td><td>差评</td><td>淘客</td><td>降权</td><td>黑名单</td></tr><tr><td>举报次数</td><td>' + data.pd + '</td><td>' + data.qz + '</td><td>' + data.pz + '</td><td>' + data.dj + '</td><td>' + data.cp + '</td><td>~</td><td>' + data.jq + '</td><td>' + data.hmd + '</td></tr></table></div></div>';
    $('#page').append(dom);
}
$(document).on('click', '.chaqz-info-wrapper .hided', function () {
    $('.chaqz-info-wrapper').remove()
})
var popUp = {
    renewal: '<p class="tips"> 已达使用上限,请前往官网升级续费。</p><div class="cha-btns"><button class="cancel  mr_30 btn hided">取消</button><button class="btn buyBtn">前往</button></div>',
    hasLogout: '<p class="tips">登录过期,去重新登录</p><div class="cha-btns"><button class="cancel  mr_30 btn hided">取消</button><button class="btn goLogin">确认</button></div>',
    orderSucc: '<p class="tips">若订购成功请刷新。</p><div class="cha-btns"><button id="pageRefresh" class="btn">确定</button></div>',
    weixin: '<canvas id="qrcode"></canvas>',
    init: function (type, data) {
        if ($('.chaqz-info-wrapper.pop').length) {
            this.changeDom(type, data)
            return false
        }
        var wrapFont = '<div class="chaqz-info-wrapper pop"><div class="c-cont"><span class="close hided" click="hideInfo">×</span><div class="alert">'
        var wrapEnd = '</div></div></div>'
        var resultDom = ''
        if (typeof this[type] == 'function') {
            resultDom = this[type](data)
        } else {
            resultDom = this[type]
        }
        var _html = wrapFont + resultDom + wrapEnd;
        var _that = this
        $('#page').append(_html)
        // 事件加载
        $('.chaqz-info-wrapper.pop').on('click', '.buyBtn', function () {
            window.open(BASE_URL + '/vipInfo')
            _that.init('orderSucc')
        })
        $('.chaqz-info-wrapper.pop').on('click', '#pageRefresh', function () { //刷新
            window.location.reload();
        })
        $('.chaqz-info-wrapper.pop .goLogin').click(function () {
            anyDom.init(searchWang)
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

function popTip(text, options) {
    var st = '';
    var tm = 500;
    if (options) {
        st = options ? options.style : '';
        tm = options ? options.time : 500;
    }
    $('#page').append('<div class="small-alert" style="' + st + '">' + text + '</div>');
    setTimeout(function () {
        $('#page .small-alert').fadeOut(300, function () {
            $('#page .small-alert').remove();
        })
    }, tm)
}
// 关闭登录弹窗
$(document).on('click', '.chaqz-info-wrapper .hided', function () {
    $('.chaqz-info-wrapper.login').remove()
})

//  星级表示
function heartShow(star) {
    if (!star) {
        return "~"
    }
    var prestigeIcon = {
        type: 0,
        num: 0
    }
    if (star !== '' && star < 4) {
        return satr
    }
    if (star >= 4 && star <= 10) {
        prestigeIcon.type = 1
        prestigeIcon.num = 1
    } else if (star >= 11 && star <= 40) {
        prestigeIcon.type = 1
        prestigeIcon.num = 2
    } else if (star >= 41 && star <= 90) {
        prestigeIcon.type = 1
        prestigeIcon.num = 3
    } else if (star >= 91 && star <= 150) {
        prestigeIcon.type = 1
        prestigeIcon.num = 4
    } else if (star >= 151 && star <= 250) {
        prestigeIcon.type = 1
        prestigeIcon.num = 5
    } else if (star >= 251 && star <= 500) {
        prestigeIcon.type = 2
        prestigeIcon.num = 1
    } else if (star >= 501 && star <= 1000) {
        prestigeIcon.type = 2
        prestigeIcon.num = 2
    } else if (star >= 1001 && star <= 2000) {
        prestigeIcon.type = 2
        prestigeIcon.num = 3
    } else if (star >= 2001 && star <= 5000) {
        prestigeIcon.type = 2
        prestigeIcon.num = 4
    } else if (star >= 5001 && star <= 10000) {
        prestigeIcon.type = 2
        prestigeIcon.num = 5
    } else if (star >= 10001 && star <= 20000) {
        prestigeIcon.type = 3
        prestigeIcon.num = 1
    } else if (star >= 20001 && star <= 50000) {
        prestigeIcon.type = 3
        prestigeIcon.num = 2
    } else if (star >= 50001 && star <= 100000) {
        prestigeIcon.type = 3
        prestigeIcon.num = 3
    } else if (star >= 100001 && star <= 200000) {
        prestigeIcon.type = 3
        prestigeIcon.num = 4
    } else if (star >= 200001 && star <= 500000) {
        prestigeIcon.type = 3
        prestigeIcon.num = 5
    } else if (star >= 500001 && star <= 1000000) {
        prestigeIcon.type = 4
        prestigeIcon.num = 1
    } else if (star >= 1000001 && star <= 2000000) {
        prestigeIcon.type = 4
        prestigeIcon.num = 2
    } else if (star >= 2000001 && star <= 5000000) {
        prestigeIcon.type = 4
        prestigeIcon.num = 3
    } else if (star >= 5000001 && star <= 10000000) {
        prestigeIcon.type = 4
        prestigeIcon.num = 4
    } else if (star >= 10000001) {
        prestigeIcon.type = 4
        prestigeIcon.num = 5
    } else {
        prestigeIcon.type = 0
        prestigeIcon.num = 0
    }
    if (!prestigeIcon.num) {
        return '~'
    }
    var imgfont = '<img class="no-margin" src="https://file.cdn.chaquanzhong.com/heartShow-';
    var imgend = '.png"alt="">';
    var html = '';
    for (let i = 0; i < prestigeIcon.num; i++) {
        html += imgfont + prestigeIcon.type + imgend
    }
    html = star + html;
    return html;
}

function rightConcer(){
    if ($('.chaqz-compete-wrap').length){return false;}
    $('body').append('<div class="chaqz-compete-wrap"><div class="head popover-header"><div class="left"><img class=""src="https://file.cdn.chaquanzhong.com/plugin-compete-logo.png"alt=""></div><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-avator.png"alt=""class="avator"id="userBtn"></div><div class="content-wrap"><ul class="content"><li class="item"><a href="https://sycm.taobao.com/mc/ci/shop/monitor"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup1.png"alt=""><p class="name">竞品解析</p></a></li><li class="item"><a href="https://sycm.taobao.com/mc/ci/shop/monitor"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup2.png"alt=""><p class="name">权重解析</p></a></li><li class="item"><a href="https://sycm.taobao.com/mc/mq/search_analyze"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup3.png"alt=""><p class="name">词根透视</p></a></li><li class="item"><a href="https://sycm.taobao.com/mc/ci/item/analysis"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup4.png"alt=""><p class="name">一键加权</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/chaheihao?from=plugin"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup5.png"alt=""><p class="name">黑号查询</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/Kasp?from=plugin"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup6.png"alt=""><p class="name">卡首屏</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/infiniteRank?from=plugin"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup7.png"alt=""><p class="name">查排名</p></a></li><li class="item"><a class="https://trade.taobao.com/trade/itemlist/list_sold_items.htm"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup8.png"alt=""><p class="name">淘客订单检测</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/toolIndex?from=plugin"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup9.png"alt=""><p class="name">在线查指数</p></a></li><li class="item"><a href="https://www.chaquanzhong.com/home?from=plugin"target="_blank"><img src="https://file.cdn.chaquanzhong.com/chaqz-plugins-popup12.png"alt=""><p class="name">更多功能</p></a></li></ul><div class="bottom"><a href="https://www.chaquanzhong.com/home?from=plugin"target="_blank">www.chaquanzhong.com</a><br/><span>' + LOCAL_VERSION + '</span></div></div></div>')
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
        t = t < 0 ? 0 : t;
        $('.chaqz-compete-wrap').css({
            'left': l,
            top: t,
            bottom: 'unset'
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
    if (miunsTime < 500) {
        var ele = $('.chaqz-compete-wrap .content-wrap');
        if (ele.hasClass('isshow')) {
            ele.show(300);
            ele.removeClass('isshow');
        } else {
            ele.hide(300);
            ele.addClass('isshow');
        }
    }
})