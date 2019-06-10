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
        console.log(e.target.id, ',', e.target.className)
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
    console.log(tbName)
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
            }else{
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
    var wLevel = data.vLevel ? data.vLevel.slice(1):'';
    var isShoper = data.supper == '是' ? 'hShoper.png' : data.supper == '否' ? 'hNoshpper.png' : '';
    var sex = data.sex == '女' ? 'hSex-w.png' : data.sex == '男' ? 'hSex-w.png' : '';
    var customerLabel = data.tag? ('<div class="customer-label"><span class="customr">用户标签</span>' + data.tag + '</div>'):'';
    var isShop = data.isshoper ? data.isshoper:'~';
    var dom = '<div class="chaqz-info-wrapper tbtrade"><div class="c-cont"><span class="close2 hided" click="hideInfo">×</span><table class="trade-table"><tr><td><span class="label">旺旺号：</span>' + data.aliname + '<img src="https://file.cdn.chaquanzhong.com/hwangwnag.png"alt=""></td><td><span class="label">会员等级：</span>' + data.vLevel + '<img src="https://file.cdn.chaquanzhong.com/hLevel-' + wLevel + '.png"alt=""></td><td><span class="label">是否商家：</span>' + isShop + '</td></tr><tr><td><span class="label">性别：</span>' + data.sex + '<img src="https://file.cdn.chaquanzhong.com/' + sex + '"alt=""></td><td><span class="label">好评率：</span><span class="hot">' + data.ReceiveGoodRate + '</span></td><td><span class="label">账号类型：</span>~</td></tr><tr><td><span class="label">注册时间：</span>' + data.register + '</td><td><span class="label">淘龄：</span><span class="hot">' + data.tbages + '</span></td><td><span class="label">周均单：</span>' + data.week + '</td></tr><tr><td><span class="label">是否实名：</span><span class="blue">' + data.realname + '</span></td><td><span class="label">是否超级会员：</span>' + data.supper + '<img src="https://file.cdn.chaquanzhong.com/' + isShoper + '"alt=""></td><td><span class="label">买家信誉：</span>' + data.prestige + '</td></tr><tr><td><span class="label">最近消费力度：</span><span>' + data.xfld + '</span></td><td><span class="label">最近登录时间：</span>' + data.LastLoginTime + '</td><td><span class="label">查询次数：</span>' + data.snums + '</td></tr></table>' + customerLabel + '<table class="report-table"><tr class="thead"><td>举报类型</td><td>跑单</td><td>敲诈</td><td>骗子</td><td>打假</td><td>差评</td><td>淘客</td><td>降权</td><td>黑名单</td></tr><tr><td>举报次数</td><td>' + data.pd + '</td><td>' + data.qz + '</td><td>' + data.pz + '</td><td>' + data.dj + '</td><td>' + data.cp + '</td><td>~</td><td>' + data.jq + '</td><td>' + data.hmd + '</td></tr></table></div></div>';
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