console.log("taobao 交易管理");
var BASE_URL = 'http://118.25.153.205:8090';
var isLogin = false;

chrome.storage.local.get('chaqz_token', function (valueArray) {
    var tok = valueArray.chaqz_token;
    if (tok) {
        localStorage.setItem('chaqz_token', tok);
        isLogin = true;
    } else {
        isLogin = false;
    }
});
$(function () {
    var haset = true;
    $('#page').on('DOMNodeInserted', function (e) {
        // console.log(e.target.id, ',', e.target.className)
        if (e.target.className == 'ww-inline ww-online') {
            if (haset) {
                $('.item-mod__trade-order___2LnGB .buyer-mod__buyer___3NRwJ').parent().append('<button id="chaqzSearch" class="tbtrade-btn">点击查黑号</button>');
                haset = false
            }

        }
    })
    $(document).on('click', '#sold_container .pagination li', function () {
        haset = true;
    })
})
$(document).on('click', '#chaqzSearch', function () {
    var tbName = $(this).siblings().find('.buyer-mod__name___S9vit').text();
    isLogin ? anyDom.searchHei(tbName) : anyDom.init(tbName);

})
var anyDom = {
    loginDom: '<div class="chaqz-info-wrapper login"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><div class="formList"><div class="title"><img src="https://file.cdn.chaquanzhong.com/logo-info.png" alt="logo"></div><div class="phone"><input id="phone" type="text" placeholder="请输入手机号码"><p class="tips">请输入手机号码</p></div><div class="pwd"><input id="pwd" type="password" placeholder="请输入登录密码"><p class="tips">请输入登录密码</p></div><div class="router"><a href="' + BASE_URL + '/reg" class="right" target="_blank">免费注册</a><a href="' + BASE_URL + '/findP" target="_blank">忘记密码</a></div><button class="orange-default-btn login-btn">登录</button></div></div></div>',
    login: function (tbName) {
        var _that = this;
        var onLoading = false;
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
                var token = val.data.token;
                localStorage.setItem('chaqz_token', token);
                chrome.storage.local.set({
                    'chaqz_token': token
                }, function () {});
                isLogin = true;
                $('.chaqz-info-wrapper.login').remove();
                _that.searchHei(tbName);
            } else {
                $('.chaqz-info-wrapper.login .pwd .tips').text('账号或密码错误').show()
                onLoading = false
            }
        })
    },
    init: function (tbName) {
        var _that = this
        $('#page').append(this.loginDom);
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
            _that.login(tbName)
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
            if (val.code == 200) {
                domstrcut(val.data)
                LoadingPop()
            } else if (val.code == -5500 || val.code == -5501 || val.code == -5502) {
                popUp.init('renewal')
                LoadingPop()
            } else {
                LoadingPop()
                popTip('未查询到结果')
            }
        })
    }
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
    var customerLabel = data.tag ? ('<div class="customer-label"><span class="customr">用户标签</span>' + data.tag + '</div>') : '';
    var isShop = data.isshoper ? data.isshoper : '~';
    var week = data.week !== '' ? data.week : '~'; //周率
    var prestige = heartShow(data.prestige); //星钻
    var xfld = data.xfld ? data.xfld + '元' : "~"; //消费力度
    var LastLoginTime = data.LastLoginTime ? data.LastLoginTime : data.last_visit ? data.last_visit : '~';; //最近登录
    var regArea = data.area ? data.area : data.Area ? data.Area : '~';
    var queryNum = data.QueryNum ? data.QueryNum : 0;
    var dom = '<div class="chaqz-info-wrapper tbtrade"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><table class="trade-table"><tr><td><span class="label">旺旺号：</span>' + data.aliname + '<img src="https://file.cdn.chaquanzhong.com/hwangwnag.png"alt=""></td><td><span class="label">会员等级：</span>' + wLevel + levelImg + '</td><td><span class="label">是否商家：</span>' + isShop + '</td></tr><tr><td><span class="label">性别：</span>' + sex + '<img src="https://file.cdn.chaquanzhong.com/' + sexImg + '"alt=""></td><td><span class="label">好评率：</span><span class="hot">' + data.evaluate + '</span></td><td><span class="label">注册地区：</span>' + regArea + '</td></tr><tr><td><span class="label">注册时间：</span>' + data.register + '</td><td><span class="label">淘龄：</span><span class="hot">' + data.tbages + '</span></td><td><span class="label">周均单：</span>' + week + '</td></tr><tr><td><span class="label">是否实名：</span><span class="blue">' + data.realname + '</span></td><td><span class="label">是否超级会员：</span>' + isShoper + '<img src="https://file.cdn.chaquanzhong.com/' + isShoperImg + '"alt=""></td><td><span class="label">买家信誉：</span>' + prestige + '</td></tr><tr><td><span class="label">最近消费力度：</span><span>' + xfld + '</span></td><td><span class="label">最近登录时间：</span>' + LastLoginTime + '</td><td><span class="label">查询次数：</span>' + queryNum + '</td></tr></table>' + customerLabel + '<table class="report-table"><tr class="thead"><td>举报类型</td><td>跑单</td><td>敲诈</td><td>骗子</td><td>打假</td><td>差评</td><td>淘客</td><td>降权</td><td>黑名单</td></tr><tr><td>举报次数</td><td>' + data.pd + '</td><td>' + data.qz + '</td><td>' + data.pz + '</td><td>' + data.dj + '</td><td>' + data.cp + '</td><td>~</td><td>' + data.jq + '</td><td>' + data.hmd + '</td></tr></table></div></div>';
    $('#page').append(dom);
}
$(document).on('click', '.chaqz-info-wrapper .hided', function () {
    $('.chaqz-info-wrapper').remove()
})
var popUp = {
    renewal: '<p class="tips"> 已达使用上限,请前往官网升级续费。</p><div class="cha-btns"><button class="cancel  mr_30 btn hided">取消</button><button class="btn buyBtn">前往</button></div>',
    orderSucc: '<p class="tips">若订购成功请刷新。</p><div class="cha-btns"><button id="pageRefresh" class="btn">确定</button></div>',
    weixin: '<p class="head">查权重客服很高兴为您服务</p><img src="https://file.cdn.chaquanzhong.com/wx_contact.jpg" alt="wx"><p class="foot">微信扫一扫 添加客服</p>',
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

function popTip(text, options) {
    var st = '';
    var tm = '';
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
    var imgfont = '<img class="no-margin" src="https://file.cdn.chaquanzhong.com/heartShow';
    var imgend = '.png"alt="">';
    var html = '';
    for (let i = 0; i < prestigeIcon.num; i++) {
        html += imgfont + prestigeIcon.type + imgend
    }
    html = star + html;
    return html;
}