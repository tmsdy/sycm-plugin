var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'https://www.chaquanzhong.com' :
    'http://118.25.153.205:8090';
chrome.storage.local.get(['chaqz_token', 'AutomaticWeightedData'], function (valueArray) {
    var local = localStorage.getItem('saveToken');
    var newLoacal = valueArray.chaqz_token;
    local = local ? JSON.parse(local) : {};
    if (newLoacal) {
        // 获取token发生时间
        var bendiTime = new Date().getTime();
        var localTime = local.expiration ? local.expiration : bendiTime;
        var enjoyTime = newLoacal.expiration;
        // var remeSaveTime = localStorage.getItem('prevSaveTime');
        // remeSaveTime = remeSaveTime ? remeSaveTime:0;
        // if (bendiTime - remeSaveTime < 2000){
        //      return false;
        // }
        if (local.token != newLoacal.token && enjoyTime > localTime) {
            // 设置最新token
            // localStorage.setItem('prevSaveTime', bendiTime);
            // localStorage.setItem('token', newLoacal.token);
            // localStorage.setItem('saveToken', JSON.stringify(newLoacal));
            // var isLogin = getUrlParam();
            // if (isLogin) { //判断是否在login页面以及是否有重定向
            //     window.location.href = BASE_URL + isLogin
            // } else {
            //     window.location.reload();
            // }
            window.postMessage({
                type: 'hasSetToken',
                msg: newLoacal
            }, '*');
        }
    }
    var quiltyFoods = valueArray.AutomaticWeightedData
    if (quiltyFoods) {
        sessionStorage.AutomaticWeightedData = JSON.stringify(quiltyFoods)
    }
})

$(function () {
    window.addEventListener("message", function (event) {
        if (event.data.type != "tokenStatus") {
            return;
        }
         chrome.storage.local.set({
             'chaqz_token': event.data.msg
         }, function () {});
    }, false);
    $(document).on('click', '.tools-main .is-all-true', function () {
        var keywords = $(this).attr('data-value');
        if (keywords) {
            chrome.runtime.sendMessage({
                type: 'fromWeb',
                keywords: keywords
            }, function (res) {
                sessionStorage.setItem('CoreWordResolve', res)
            })
        }
    })
})
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.type == 'goWeb') {
            sessionStorage.setItem('CoreWordResolve', request.searchAnalysis)
        }
    })

function getUrlParam(para) {
    var url = window.location.search;
    var serchs = url.split('?')[1];
    if (!serchs) {
        return ''
    }
    var res = '';
    var filteArr = serchs.split('&');
    for (let i = 0; i < filteArr.length; i++) {
        const element = filteArr[i].split('=');
        if (element[0] == 'redirect') {
            res = element[1];
        }
    }
    return decodeURIComponent(res)
}