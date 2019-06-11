
var dataWrapper = {
    deviceData: {
        urlReg: /\/report\/getNetworkPerspective\.htm.*perspectiveType=2$/,
        data: ''
    },
    areaPers: {
        urlReg: /\/report\/getAreaPerspective\.htm/,
        data: ''
    }
}
var ZTCCOUNT = 0;
interceptRequest();
$(function () {
    judgeGetData()
})

function interceptRequest() {
    // 在页面上插入代码
    window.removeEventListener("pageScript", orginStartFuns);
    window.addEventListener("pageScript", function (event) {
        var oriLen = orginInterceptData.length;
        if (oriLen) {
            for (var i = 0; i < oriLen; i++) {
                var element = orginInterceptData[i];
                element ? receiveResponse(element.url, element.data, element.type) : '';
            }
            orginInterceptData = [];
        }
        receiveResponse(event.detail.url, event.detail.data, event.detail.type);
    })
}

function receiveResponse(reqParams, resData, xhrType) {
    var baseUrl = reqParams ? reqParams[0] : "";
    if (!baseUrl) {
        return false;
    }
    for (var k in dataWrapper) {
        if (dataWrapper[k].urlReg.test(baseUrl)) {
            var finaData = resData ? JSON.parse(resData) : resData;
            dataWrapper[k].data = finaData.result;
        }
    }
}

function judgeGetData() {
    chrome.storage.local.get('ztcAreaData', function (val) {
        var baseData = val.ztcAreaData;
        var isFinshed = baseData ? baseData.ISFINSH : true;
        if (isFinshed) {
            return false
        }
        textLoading()
        cycleData(baseData)
    })
}
//   var ztcAreaData = {
//         keyword: searchWord,
//         step: 0,
//         tenKeyWords: needSearAll,
//         tenKeySearch: {},
//   }
function cycleData(baseData) {
    var deviceData = dataWrapper.deviceData.data;
    var areaPers = dataWrapper.areaPers.data;
    if (deviceData && areaPers) {
        // 获取数据的存储
        var areaUseful = areaPers[0];
        var keyword = areaUseful.word;
        var areaInfo = areaUseful.areaBaseDTOList;
        var finalArea = filterAreaData(keyword, areaInfo, deviceData);
        var curStep = baseData.step;
        baseData.step = curStep + 1;
        textLoading(curStep + '/' + baseData.tenKeyWords.length + ',获取数据中，请稍等…')
        if (curStep >= baseData.tenKeyWords.length) {
            baseData.ISFINSH = true;
             chrome.storage.local.set({
                 ztcAreaData: baseData
             }, function () {
                  chrome.runtime.sendMessage({
                      type: 'chaqzRootWordEnd',
                      cont: {
                          hasZTCDone: true,
                          type: 'ztcSear'
                      }
                  }, function () {})
             })
             window.close();
            return false;
        }
        
        var nextSearchKey = baseData.tenKeyWords[curStep + 1]; //下一个搜索词
        baseData.tenKeySearch[keyword] = finalArea;
        console.log(nextSearchKey)
        var urlBase = 'https://subway.simba.taobao.com/#!/tools/insight/queryresult?kws=' + nextSearchKey + '&tab=tabs-region';
        window.open(urlBase, "_self")
        dataWrapper.deviceData.data = '';
        dataWrapper.areaPers.data = '';
        cycleData(baseData)
        // chrome.storage.local.set({
        //     ztcAreaData: baseData
        // }, function () {
        //     dataWrapper.deviceData.data='';
        //     dataWrapper.areaPers.data = '';
        //     var urlBase = 'https://subway.simba.taobao.com/#!/tools/insight/queryresult?kws=' + nextSearchKey + '&tab=tabs-region';
        //     window.open(urlBase, "_self")
        // })
    } else {
        setTimeout(function(){
            // if (ZTCCOUNT<20){
                //  ZTCCOUNT++;
                 cycleData(baseData)
            // }else{
                //  chrome.runtime.sendMessage({
                //      type: 'chaqzRootWordEnd',
                //      cont: {
                //          hasZTCDone: false,
                //          type: 'ztcBreak'
                //      }
                //  }, function () {})
            // }
        },500)
    }
}
//    过滤数据
function filterAreaData(word, areaData, devData) {
    var filterArea = bubbleSort(areaData);
    var areaArr = filterArea ? filterArea.slice(0, 10) : []; //截取前十
    var finalArea = [];
    var len = areaArr.length
    for (let i = 0; i < len; i++) {
        const element = areaArr[i];
        finalArea.push(element.name)
    }
    return {
        device: devData,
        areaInfo: finalArea
    }

}

function bubbleSort(arr) { //排序
    if (!arr) {
        return ''
    }
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j].inRecordBaseDTO.click > arr[j + 1].inRecordBaseDTO.click) {
                var temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr;
}
// loading
function textLoading(text, statu) {
    if (statu) {
        $('#caseBlanche').remove();
    } else {
        var deText = text ? text : '获取数据中，请稍等…';
        var hasSave = $('#caseBlanche').length;
        if (hasSave){
            $('#caseBlanche .text').text(text);
        }else{
             $('body').append('<div id="caseBlanche"><div id="load"><p id="rond"></p><p class="text">' + deText + '</p></div></div>');
        }
    }
}
