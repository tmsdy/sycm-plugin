 console.log('chaquan_come')
 var BASE_URL = 'http://116.62.18.166:8090';
 chrome.storage.local.get(['chaqz_token', 'compareProduceData'], function (valueArray) {
     var local = localStorage.getItem('token');
     var hasSetToken = localStorage.getItem('pluginHasSetToken')
     var newLoacal = valueArray.chaqz_token;
     if (newLoacal){
         console.log(window.location.href+'125555')
         if (local != newLoacal && hasSetToken != newLoacal) {
             console.log('复制token')
             localStorage.setItem('token', valueArray.chaqz_token);
             localStorage.setItem('pluginHasSetToken', valueArray.chaqz_token)
             var url = window.location.href
             if ( url.indexOf('plugin') != -1) {
                 window.location.href = BASE_URL +"/homePage?from=plugin"
             }
            console.log(window.location.href)
            if ( window.location.href.indexOf('privilgeEscala') != -1) {
                console.log('跳转页面')
                window.location.href = BASE_URL + "/privilgeEscala"
            }
            // window.location.reload()
         }  
     }
    //  提权计划
    var quiltyFoods = valueArray.compareProduceData
    if (quiltyFoods){
        sessionStorage.CompetingGoodsData = JSON.stringify(quiltyFoods)
    }
 })
$(function(){
       $('#app').on('DOMNodeInserted', function (e) {
           if (e.target.className == 'operat') { //竞争-监控店铺
            var newToken = localStorage.getItem('token')
                chrome.storage.local.set({
                    'chaqz_token': newToken
                }, function () {});
           }
       })
       $(document).on('click', '.tools-main .is-all-true', function () {
           var btnData = $(this).val()
           var keywords = $(this).attr('data-value')
        //    console.log(keywords,$(this).attr('data-value'))
           if (keywords){
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
        if (request.type == 'goWeb'){
            console.log(request.searchAnalysis)
            sessionStorage.setItem('CoreWordResolve', request.searchAnalysis)
        }
    })