
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
    // 判断是否是嵌入的iframe
    if (!(self.name == 'polling')) {
        return false;
    }
    chrome.storage.local.get('ztcAreaData', function (val) {
        var baseData = val.ztcAreaData;
        var isFinshed = baseData ? baseData.ISFINSH : true;
        if (isFinshed) {
            return false
        }
        var isWantPage = testPages(baseData.step)
        if (isWantPage){
        //    setTimeout(function(){
               var urlBase = 'https://subway.simba.taobao.com/#!/tools/insight/queryresult?kws=' + baseData.tenKeyWords[baseData.step] + '&tab=tabs-region';
               window.open(urlBase, "_self")
        //    },500)
        }
        cycleData(baseData)
    })
}
//   var ztcAreaData = {
//         keyword: searchWord,
//         step: 0,
//         tenKeyWords: needSearAll,
//         tenKeySearch: {},
//   }
function cycleData(baseData,isEmpty) {
    var deviceData = dataWrapper.deviceData.data;
    var areaPers = dataWrapper.areaPers.data;
    if (isEmpty == 'empty'){
        deviceData = [];
        areaPers = [];
    }
    if (deviceData && areaPers) {
        // 获取数据的存储
        var areaUseful = areaPers[0];
        var curStep = baseData.step;
        var keyword = baseData.tenKeyWords[curStep];
        var areaInfo = areaUseful ? areaUseful.areaBaseDTOList:[];
        var finalArea = filterAreaData(keyword, areaInfo, deviceData);
        baseData.step = curStep + 1;
        if (curStep >= baseData.tenKeyWords.length - 1 && !baseData.tenKeyWords[curStep]) {
            var curStepPro = baseData.tenKeyWords.length + 1;
            baseData.ISFINSH = true;
             chrome.storage.local.set({
                 ztcAreaData: baseData
             }, function () {
                  chrome.runtime.sendMessage({
                      type: 'chaqzRootWordEnd',
                      cont: {
                          hasZTCDone: true,
                          type: 'ztcSear',
                          text: curStepPro + '/' + curStepPro
                      }
                  }, function () {})
             })
            //  window.close();
            return false;
        }
        
        var nextSearchKey = baseData.tenKeyWords[curStep + 1]; //下一个搜索词
        baseData.tenKeySearch[keyword] = finalArea;
        // console.log(nextSearchKey)
        var urlBase = 'https://subway.simba.taobao.com/#!/tools/insight/queryresult?kws=' + nextSearchKey + '&tab=tabs-region';
        window.open(urlBase, "_self")
        dataWrapper.deviceData.data = '';
        dataWrapper.areaPers.data = '';
        ZTCCOUNT = 0
        cycleData(baseData);
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
            if (ZTCCOUNT<20){
                // console.log(ZTCCOUNT)
                 ZTCCOUNT++;
                 cycleData(baseData)
            }else{
                cycleData(baseData,'empty')
                // ZTCCOUNT =0;
                //  chrome.runtime.sendMessage({
                //      type: 'chaqzRootWordEnd',
                //      cont: {
                //          hasZTCDone: false,
                //          type: 'ztcBreak'
                //      }
                //  }, function () {})
            }
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
// 判断是否为获取数据页面
function testPages(curStep){
    var href = window.location.href;
    if (href.indexOf('target=suberror'!=-1)){
        console.log('未开通权限')
        // 未授权
         chrome.runtime.sendMessage({
             type: 'chaqzRootWordEnd',
             cont: {
                 hasZTCDone: false,
                 type: 'ztcBreak'
             }
         }, function () {})
    }
    var testRes = href.indexOf('https://subway.simba.taobao.com/#!/tools/insight');
    // console.log(href)
    if (testRes != -1 || curStep>0) {
        return false
    }
    return true;
}