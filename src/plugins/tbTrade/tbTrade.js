console.log("taobao 交易管理");
var BASE_URL = 'http://118.25.153.205:8090';
var isLogin = false;

chrome.storage.local.get('chaqz_token', function (valueArray) {
    var tok = valueArray.chaqz_token;
     $('.item-mod__trade-order___2LnGB .buyer-mod__buyer___3NRwJ').parent().append('<button id="chaqzSearch" class="tbtrade-btn">点击查黑号</button>');
    if (tok) {
        localStorage.setItem('chaqz_token', tok);
        isLogin = true;
    } else {
        isLogin = false;
    }
});
$(function () {
    addStyle()
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
function addStyle() {
    var res2 = '.chaqz-wrapper{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:9999}.chaqz-wrapper .content{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;height:80%;border-radius:5px;box-sizing:border-box;width:100%;max-width:1300px}.chaqz-wrapper .content.small{width:550px}.chaqz-wrapper .content .cha-box{position:absolute;top:0;height:100%;width:100%;overflow:auto;padding-bottom:30px}.chaqz-wrapper .content .table-box{margin:0 15px}.chaqz-wrapper .content .head{line-height:30px;margin:40px 15px 12px 15px}.chaqz-wrapper .content .head .btns{float:right}.chaqz-wrapper .content .head .title{display:inline-block;line-height:18px;border-left:3px solid #4B92EC;font-size:16px;color:#222;padding-left:10px}.chaqz-wrapper .content .head .title .time{font-size:12px;color:#888888;margin-left:15px}.chaqz-wrapper .content .head img{width:40px;margin-right:10px}.chaqz-wrapper .content .trend-table{margin-top:50px}.chaqz-wrapper .content .trend-table td:first-child{text-align:center;padding:0}.chaqz-wrapper div.dt-buttons{float:right;margin-top:-44px}.chaqz-wrapper div.dt-buttons button{margin-left:15px;color:#fff}.chaqz-wrapper .content .head .btns{float:right;margin-left:15px}.chaqz-wrapper .content table{width:100%;text-align:center;color:#222;font-size:12px;border-collapse:collapse}.chaqz-wrapper table .info{white-space:nowrap}.chaqz-wrapper table .info img{width:36px;height:36px;margin-right:5px;vertical-align:middle}.chaqz-wrapper table .info span{color:#222;vertical-align:middle;max-width:180px;display:inline-block;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.chaqz-wrapper table .info1 span{color:#222;vertical-align:middle;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.chaqz-wrapper table thead tr th{padding-left:0;padding-right:0}.chaqz-wrapper table thead tr:first-child{color:#888888;background:#F7F7F7}.chaqz-wrapper table tbody tr:nth-child(2n){background:#F7F7F7}.chaqz-wrapper table td .btn{width:59px;height:20px;border:1px solid rgba(75,146,236,1);border-radius:2px;font-size:12px;color:#4B92EC;text-align:center}.chaqz-wrapper table tbody tr .btn.red{border-color:#F64C3E;color:#F64C3E}.chaqz-wrapper table td:first-child{text-align:left;padding-left:15px}.chaqz-wrapper .chaqz-close{position:absolute;right:0;top:-66px;width:36px;height:36px;border:2px solid #fff;color:#fff;font-size:33px;border-radius:50%;text-align:center;line-height:30px;cursor:pointer}.chaqz-info-wrapper{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);z-index:10000000}.chaqz-info-wrapper .c-cont{position:absolute;top:50%;left:50%;width:380px;-moz-transform:translate(-50%,-50%);-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);background:#fff;padding:20px;border-radius:5px}.chaqz-info-wrapper .c-cont .close{float:right;color:#999999;font-size:30px;line-height:15px;cursor:pointer}.chaqz-info-wrapper .c-cont .close2{position:absolute;right:0;top:-63px;width:36px;height:36px;border:2px solid #fff;border-radius:50%;color:#fff;text-align:center;font-size:35px;line-height:28px;cursor:pointer}.chaqz-info-wrapper .c-cont .alert{text-align:center}.chaqz-info-wrapper .c-cont .tips{margin-bottom:60px;color:#555555;font-size:16px;line-height:22px;margin-top:80px}.chaqz-info-wrapper .c-cont .analy-goods .anayEditor{width:100%;margin-left:0}.chaqz-info-wrapper .c-cont .cha-btns{margin-bottom:20px}.chaqz-info-wrapper .c-cont .cha-btns .btn{width:100px;height:46px;border:1px solid rgba(229,229,229,1);font-size:16px;background:#FFA200;color:#fff;border:0;border-radius:3px}.chaqz-info-wrapper .c-cont .cha-btns .analyBtn:not(:last-child){margin-right:10px}.chaqz-info-wrapper .c-cont .cha-btns .mr_30{margin-right:30px}.chaqz-info-wrapper .c-cont .cha-btns .cancel{background:#fff;border:1px solid #E5E5E5;border-radius:2px;color:#222}.chaqz-info-wrapper .c-cont .bot-tips{font-size:12px;color:#999;margin-top:-10px}.tbtrade-btn{width:92px;height:28px;background:rgba(255,101,39,1);border-radius:3px;outline:none;border:0;color:#fff}.tbtrade .c-cont{width:1200px;padding:16px 30px;font-size:14px;color:#222}.tbtrade .c-cont .trade-table,.tbtrade .c-cont .report-table{width:100%;table-layout:fixed}.tbtrade .c-cont .trade-table td{height:45px}.tbtrade .c-cont .trade-table td .label{display:inline-block;width:108px}.tbtrade .c-cont .trade-table img{margin-left:8px;vertical-align:middle}.tbtrade .c-cont .trade-table .hot{color:#FF4C3E}.tbtrade .c-cont .trade-table .blue{color:#3A7D21}.tbtrade .c-cont .customer-label{margin-top:15px;padding-top:20px;padding-bottom:30px;border-top:1px solid #E5E5E5}.tbtrade .c-cont .customer-label .customr{display:inline-block;width:70px;height:26px;line-height:24px;border:1px solid rgba(75,146,236,1);border-radius:5px;text-align:center;color:#4B92EC;margin-right:10px}.tbtrade .c-cont .report-table{border:1px solid #E5E5E5;margin-bottom:14px;text-align:center}.tbtrade .c-cont .report-table .thead{background:#4B92EC}.tbtrade .c-cont .report-table td{color:#666;height:43px}.tbtrade .c-cont .report-table .thead td{color:#fff}.chaqz-info-wrapper.login{padding:30px}.chaqz-info-wrapper.login .c-cont{width:360px;padding:30px;box-sizing:border-box}.chaqz-info-wrapper.login .login-btn{width:300px;height:48px;font-size:18px}.chaqz-info-wrapper.login input{padding-left:11px;width:300px;height:40px;border:1px solid #E5E5E5;outline:none}.chaqz-info-wrapper.login .title{margin-bottom:22px}.chaqz-info-wrapper.login .phone{margin-bottom:25px;position:relative}.chaqz-info-wrapper.login .pwd{position:relative}.chaqz-info-wrapper.login .router{margin:31px 0}.chaqz-info-wrapper.login .tips{position:absolute;top:40px;left:0;font-size:12px;color:#F64C3E;margin:0;display:none}.chaqz-info-wrapper.login a{color:#888;font-size:14px;text-decoration:none}.chaqz-info-wrapper.login a.right{float:right}.orange-default-btn{background:#FFB700;color:#fff;border:0;outline:none;border-radius:2px}.small-alert{position:fixed;top:50%;left:50%;min-width:200px;height:60px;line-height:60px;text-align:center;padding:0 10px;color:#fff;font-size:14px;border-radius:5px;background:rgba(0,0,0,.75);transform:translate(-100px,-30px);z-index:10000000000}.load-pop{position:fixed;top:0;width:100%;height:100%;z-index:10000000000000}.load-pop.progress{background:rgba(0,0,0,.5)}.load-pop.progress .spinner{width:70px;height:70px}.load-pop.progress .load-text{text-align:center;font-size:20px}.spinner{width:41px;height:40px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}.container1>div,.container2>div,.container3>div{width:10px;height:10px;background-color:#2062E6;border-radius:100%;position:absolute;-webkit-animation:bouncedelay 1.2s infinite ease-in-out;animation:bouncedelay 1.2s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.spinner .spinner-container{position:absolute;width:100%;height:100%}.container2{-webkit-transform:rotateZ(45deg);transform:rotateZ(45deg)}.container3{-webkit-transform:rotateZ(90deg);transform:rotateZ(90deg)}.circle1{top:0;left:0}.circle2{top:0;right:0}.circle3{right:0;bottom:0}.circle4{left:0;bottom:0}.container2 .circle1{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.container3 .circle1{-webkit-animation-delay:-1.0s;animation-delay:-1.0s}.container1 .circle2{-webkit-animation-delay:-0.9s;animation-delay:-0.9s}.container2 .circle2{-webkit-animation-delay:-0.8s;animation-delay:-0.8s}.container3 .circle2{-webkit-animation-delay:-0.7s;animation-delay:-0.7s}.container1 .circle3{-webkit-animation-delay:-0.6s;animation-delay:-0.6s}.container2 .circle3{-webkit-animation-delay:-0.5s;animation-delay:-0.5s}.container3 .circle3{-webkit-animation-delay:-0.4s;animation-delay:-0.4s}.container1 .circle4{-webkit-animation-delay:-0.3s;animation-delay:-0.3s}.container2 .circle4{-webkit-animation-delay:-0.2s;animation-delay:-0.2s}.container3 .circle4{-webkit-animation-delay:-0.1s;animation-delay:-0.1s}@-webkit-keyframes bouncedelay{0%,80%,100%{-webkit-transform:scale(0.0)}40%{-webkit-transform:scale(1.0)}}@keyframes bouncedelay{0%,80%,100%{transform:scale(0.0);-webkit-transform:scale(0.0)}40%{transform:scale(1.0);-webkit-transform:scale(1.0)}}'
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    //for Chrome Firefox Opera Safari
    style.appendChild(document.createTextNode(res2));
    //for IE
    //style.styleSheet.cssText = res2;
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
}