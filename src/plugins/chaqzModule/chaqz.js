var BASE_URL = (process.env.NODE_ENV == 'production' && !process.env.ASSET_PATH) ? 'http://www.chaquanzhong.com' :
    'http://118.25.153.205:8090';
chrome.storage.local.get(['chaqz_token', 'compareProduceData'], function (valueArray) {
    var local = localStorage.getItem('token');
    var newLoacal = valueArray.chaqz_token;
    var hasSetToken = localStorage.getItem('pluginHasSetToken')
    if (newLoacal) {
        // if (local != newLoacal ) {
            console.log(BASE_URL)
        if (local != newLoacal && hasSetToken != newLoacal) {
            localStorage.setItem('token', valueArray.chaqz_token);
            localStorage.setItem('pluginHasSetToken', valueArray.chaqz_token);
            var url = window.location.href
            if (url.indexOf('plugin') != -1) {
                window.location.href = BASE_URL + "/vipInfo?from=plugin"
            }
            if (url.indexOf('privilgeEscala') != -1) {
                window.location.href = BASE_URL + "/privilgeEscala"
            }
        }
    }
    var quiltyFoods = valueArray.compareProduceData
    if (quiltyFoods) {
        sessionStorage.CompetingGoodsData = JSON.stringify(quiltyFoods)
    }
})
$(function () {
    $('#app').on('DOMNodeInserted', function (e) {
        if (e.target.className == 'operat') {
            var newToken = localStorage.getItem('token')
            chrome.storage.local.set({
                'chaqz_token': newToken
            }, function () {});
        }
    })
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