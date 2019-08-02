var httpRequestAjax = function (options, cb) {
    var request = $.ajax(options)
    request.done(function (res) {
        cb && cb(res);
    })
};
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.key == 'getData') {
        httpRequestAjax(request.options, function (data) {
            sendResponse(data)
        })
    }
    return true
})
var rootWordRemId = '';
var tiemr = null;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'fromWeb') {
        chrome.tabs.query({
            currentWindow: true
        }, function (tabs) {
            var choseItem = 'empty'
            tabs.forEach(function (item, index) {
                if (item.url.indexOf('https://sycm.taobao.com') != -1) {
                    choseItem = index
                }
            })
            if (choseItem == 'empty') {
                sendResponse('empty')
            } else {
                chrome.tabs.sendMessage(tabs[choseItem].id, {
                    type: "secahKeywords",
                    keywords: request.keywords,
                }, function (res) {
                    if (res) {
                        chrome.tabs.sendMessage(sender.tab.id, {
                            type: "goWeb",
                            searchAnalysis: res
                        }, function (res) {
                            
                        })
                    }
                })
            }
        })
    } else if (request.type == 'fromPlgin') {
        chrome.tabs.sendMessage(tabs[choseItem].id, {
            type: "secahKeywords",
            tabId: request.tabId
        }, function (res) {

        })
    } else if (request.type == 'chaqzRootWordStart') {
        rootWordRemId = sender.tab.id
    } else if (request.type == 'chaqzRootWordEnd') {
        chrome.tabs.sendMessage(rootWordRemId, {
            type: "chaqzWordHasDone",
            cont: request.cont
        }, function (res) {

        })
    } else if (request.type == 'hasTefresToken'){
        // token更新机制
        timer = null;
        timer = setInterval(function(){
             httpRequestAjax({
                url: BASE_URL + '/api/v1/user/Retoken',
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify({
                    token: request.curToken
                }),
            }, function (data) {
                //  sendResponse(data)
                var token = data.data.token;
                 sendMessagePage(sender.tab.id, token)
                 var curTime = new Date().getTime();
                 var saveToke = {
                     expiration: curTime + data.data.expires * 1000,
                     token: token
                 }
                 chrome.storage.local.set({
                     'chaqz_token': saveToke
                 }, function () {});
             })
        },request.time)
    }
    return true
})
function sendMessagePage(sendId,resToken){
    var list = ['sycmPage','taTragePage','tmDetailPage','tbDetailPage']
    for (let i = 0; i < list.length; i++) {
        const element = list[i];
         chrome.tabs.sendMessage(sendId, {
             type: element,
              resToken
         }, function (res) {})
    }
}
// 获取数据
// var version = "1.0";
// var tabId;
// var hasAttach = false
// var dataWrapper = []
// var count = 0;
// var attachTabId = []
// // var dataWrapper ={}
// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         var tab = sender.tab
//         var tabId = tab.id;
//         if (attachTabId.indexOf(tabId) ==-1){
//             attachTabId.push(tabId)
//             hasAttach = false
//         }
//         if (request.type == "hello" && !hasAttach) {
//             dataWrapper = request.fitlerArr
//             chrome.debugger.attach({
//                 tabId: tab.id
//             }, version, function () {
//                 chrome.debugger.sendCommand({
//                     tabId: tab.id
//                 }, "Network.enable");
//                 hasAttach = true
//                 sendResponse(11)
//                 chrome.debugger.onEvent.addListener(onEvent);
//             });
//         } else if (request.type == "listenContat") {
//             count = 'hasCont'
//         }
//     });

// var requsetUrlList = []

// function onEvent(debuggeeId, message, params) {
//     if (message == "Network.requestWillBeSent") {
//         var trasId = params.request.headers['Transit-Id']
//         if (trasId) {
//             chrome.storage.local.set({
//                 transitId: trasId
//             }, function () {})
//         }
//     }
//     if (message == "Network.responseReceived") {
//         var urlKey = params.response ? params.response.url.split('?')[0] : ''
//         var urlParams = params.response ? params.response.url.split('?')[1] : ''
//         if (urlKey) {
//             for (var k in dataWrapper) {
//                 if ((new RegExp(dataWrapper[k].urlReg)).test(urlKey)) {
//                     requsetUrlList.push({
//                         id: params.requestId,
//                         url: params.response.url
//                     })
//                 }
//             }
//         }
//     }
//     if (message == "Network.loadingFinished") {
//         var itemIndex = '',
//             paramsId = params.requestId,
//             currentObj = null
//         for (var i in requsetUrlList) {
//             if (requsetUrlList[i].id == paramsId) {
//                 itemIndex = i
//                 currentObj = requsetUrlList[i]
//             }
//         }
//         if (itemIndex) {
//             chrome.debugger.sendCommand({
//                 tabId: debuggeeId.tabId
//             }, "Network.getResponseBody", {
//                 "requestId": params.requestId
//             }, function (response) {
//                 if (response) {
//                     sendMessageToContentScript(debuggeeId.tabId, {
//                         type: 'holdup',
//                         url: currentObj.url,
//                         back: response.body
//                     })
//                 }
//             });
//         }
//     }
// }

// click change page
// function sendMessageToContentScript(tabId, message) {
//     if (!count) {
//         setTimeout(function () {
//             sendMessageToContentScript(tabId, message);
//         }, 200);
//         return false
//     }
//     chrome.tabs.sendMessage(tabId, message, function (res) {});
// }
// 获取cookie2
chrome.cookies.get({
    url: 'https://sycm.taobao.com/',
    name: 'cookie2'
}, function (cookie) {
    chrome.storage.local.set({
        'getCookie': cookie
    }, function () {})
})