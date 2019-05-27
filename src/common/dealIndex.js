 import {BASE_URL} from './constState';
 import {
     formula,
     integer, filterLocalData
 } from './commonFuns';
 import {
     LogOut,
     popTip
 } from './promptClass'
 var requestNum = 0;
 var responseData = {
     payRate: [],
     tradeIndex: [],
     payByr: [],
     uvIndex: [],
     seIpv: [],
     cartHit: [],
     cltHit: []
 };
 function getAjax(data, type, sendResponse, num, fType, lastData, compareItem) {
     var filterType = (type == 'payRate' || type == 'payRateIndex') ? 1 : type == 'tradeIndex' ? 2 : (type == 'payByr' || type == 'payByrCntIndex') ?
         3 : type == 'uvIndex' ? 4 : (type == 'seIpv' || type == 'seIpvUvHits') ? 5 : (type == 'cartHit' || type == 'cartHits') ? 6 : (type == 'cltHit' || type == 'cltHits') ? 7 : '';
     var saveToke = localStorage.getItem('chaqz_token')
     chrome.runtime.sendMessage({
             key: "getData",
             options: {
                 url: BASE_URL + '/api/v1/plugin/flowFormula?type=' + filterType,
                 type: "POST",
                 contentType: "application/json,charset=utf-8",
                 headers: {
                     Authorization: "Bearer " + saveToke
                 },
                 data: JSON.stringify({
                     exponent: data
                 })
             }
         },
         function (val) {
             requestNum++
             if (val.code == 200) {
                 if (!compareItem) {
                     responseData[type] = val.data
                 } else {
                     responseData[compareItem][type] = val.data
                 }
             } else if (val.code == 2030) {
                 LogOut()
                 requestNum = 0
             }
             if (requestNum > num - 1) {
                 var resData = fType == 'monitShop' ? moinShopTable(lastData) : fType == 'monitFood' ? moinFoodTable(lastData) : fType == 'monitCompareFood' ? responseData : fType == 'monitResource' ? {
                     value: responseData,
                     final: lastData
                 } : fType == 'marketShop' ? {
                     value: responseData,
                     final: lastData
                 } : fType == 'marketHotShop' ? {
                     value: responseData,
                     final: lastData
                 } : {
                     value: responseData
                 };
                 requestNum = 0
                 sendResponse(resData)
             }
         })
 }
 // 数据转对象
function jsonParse(val, type) {
    var data = val;
    if (type) {
        var data = filterLocalData(val);
    }
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
    var orignData = JSON.parse(data)
    var finalData = dayIndex != '实 时' ? orignData : orignData.data.data ? orignData.data.data : orignData.data
    return finalData
}
function jsonFoodParse(val, type) {
    var data = val;
    if (type) {
        var data = filterLocalData(val);
    }
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
    var orignData = JSON.parse(data)
    var page = dayIndex != '实 时' ? orignData : orignData.data.data.data ? orignData.data.data : orignData.data
    return page
}
 /* 竞争-监控店铺  */
 function filterMinoShop(data) {
     if (data) {
         data.forEach((item) => {
             var va1 = item.shop_payRateIndex ? item.shop_payRateIndex.value : 0;
             var va2 = item.shop_tradeIndex ? item.shop_tradeIndex.value : 0;
             var va3 = item.shop_payByrCntIndex ? item.shop_payByrCntIndex.value : 0;
             var va4 = item.shop_uvIndex ? item.shop_uvIndex.value : 0;
             var va5 = item.shop_seIpvUvHits ? item.shop_seIpvUvHits.value : 0;
             var va6 = item.shop_cartHits ? item.shop_cartHits.value : 0;
             var va7 = item.shop_cltHits ? item.shop_cltHits.value : 0;
             responseData.payRate.push(va1);
             responseData.tradeIndex.push(va2);
             responseData.payByr.push(va3);
             responseData.uvIndex.push(va4);
             responseData.seIpv.push(va5);
             responseData.cartHit.push(va6);
             responseData.cltHit.push(va7);
         });
     }
 }
 function moinShopTable(finaData) {
     var resData = []
     var length = responseData.payRate.length
     for (var i = 0; i < length; i++) {
         var obj = {
             shop: {}
         }
         var cateRnkId = finaData[i].cate_cateRankId
         obj.shop = {
             title: finaData[i].shop.title,
             url: finaData[i].shop.pictureUrl
         }
         obj.cate_cateRankId = cateRnkId ? (cateRnkId.value ? cateRnkId.value : '-') : '-'
         obj.tradeIndex = Math.round(responseData.tradeIndex[i])
         obj.uvIndex = Math.round(responseData.uvIndex[i])
         obj.seIpv = Math.round(responseData.seIpv[i])
         obj.cltHit = Math.round(responseData.cltHit[i])
         obj.cartHit = Math.round(responseData.cartHit[i])
         obj.payRate = responseData.payRate[i].toFixed(2) + '%'
         obj.payByr = integer(responseData.payByr[i], "inter")
         obj.kdPrice = formula(responseData.tradeIndex[i], responseData.payByr[i], 1)
         obj.uvPrice = formula(responseData.tradeIndex[i], responseData.uvIndex[i], 1)
         obj.searRate = formula(responseData.seIpv[i], responseData.uvIndex[i], 2)
         obj.scRate = formula(responseData.cltHit[i], responseData.uvIndex[i], 2)
         obj.jgRate = formula(responseData.cartHit[i], responseData.uvIndex[i], 2)
         resData.push(obj)
     }
     return resData
 }
 /* 竞争-监控商品 */
 // 监控商品过滤
 function moinFoodTable(finaData) {
     var resData = []
     var length = responseData.payRate.length
     for (var i = 0; i < length; i++) {
         var payNum = '',
             pray1 = integer(responseData.payRate[i], "precent"),
             pray2 = integer(responseData.uvIndex[i]);
         if (pray1 == '-' || pray2 == '-') {
             payNum = '-'
         } else {
             payNum = Math.round(pray1 * pray2 / 100)
         }
         var obj = {
             shop: {}
         }
         var cateRnkId = finaData[i].cateRankId
         obj.shop = {
             title: finaData[i].item.title,
             url: finaData[i].item.pictUrl
         }
         obj.cate_cateRankId = cateRnkId ? cateRnkId.value : '-'
         obj.tradeIndex = Math.round(responseData.tradeIndex[i])
         obj.uvIndex = Math.round(responseData.uvIndex[i])
         obj.seIpv = Math.round(responseData.seIpv[i])
         obj.cltHit = Math.round(responseData.cltHit[i])
         obj.cartHit = Math.round(responseData.cartHit[i])
         obj.payRate = responseData.payRate[i].toFixed(2) + '%'
         obj.payByr = payNum
         obj.kdPrice = formula(responseData.tradeIndex[i], payNum, 1)
         obj.uvPrice = formula(responseData.tradeIndex[i], responseData.uvIndex[i], 1)
         obj.searRate = formula(responseData.seIpv[i], responseData.uvIndex[i], 2)
         obj.scRate = formula(responseData.cltHit[i], responseData.uvIndex[i], 2)
         obj.jgRate = formula(responseData.cartHit[i], responseData.uvIndex[i], 2)
         resData.push(obj)
     }
     return resData
 }
 /**竞品分析 */
 // 竞品分析过滤
 function filterMoinCompare(data) {
     if (data) {
         var dataArrr = [data['selfItem'], data["rivalItem1"], data["rivalItem2"]].filter(function (item) {
             return item
         })
         dataArrr.forEach(function (item) {
             var va1 = item.payRateIndex ? item.payRateIndex.value : 0;
             var va2 = item.tradeIndex ? item.tradeIndex.value : 0;
             //  var va3 = item.payByrCntIndex ? item.payByrCntIndex.value : 0;
             var va4 = item.uvIndex ? item.uvIndex.value : 0;
             var va5 = item.seIpvUvHits ? item.seIpvUvHits.value : 0;
             var va6 = item.cartHits ? item.cartHits.value : 0;
             var va7 = item.cltHits ? item.cltHits.value : 0;
             responseData.payRate.push(va1);
             responseData.tradeIndex.push(va2);
             //   indexTypes.payByr.value.push(item.payByrCntIndex.value);
             responseData.uvIndex.push(va4);
             responseData.seIpv.push(va5);
             responseData.cartHit.push(va6);
             responseData.cltHit.push(va7);
         })
     }
 }
 /**竞品分析-入口来源 */
 // 竞品来源入口
 function filterMoinRes(data, produceData) {
     var sourceIndex = {
         'selfItem': {
             payRate: [],
             tradeIndex: [],
             payByr: [],
             uvIndex: []
         }
     }
     if (produceData.rivalItem1Id) {
         sourceIndex['rivalItem1'] = {
             payRate: [],
             tradeIndex: [],
             payByr: [],
             uvIndex: []
         }
     }
     if (produceData.rivalItem2Id) {
         sourceIndex['rivalItem2'] = {
             payRate: [],
             tradeIndex: [],
             payByr: [],
             uvIndex: []
         }
     }
     if (data) {
         data.forEach(function (item) {
             var selfBox = sourceIndex.selfItem
             var item1 = item.selfItemPayRateIndex ? item.selfItemPayRateIndex.value : 0
             var item2 = item.selfItemTradeIndex ? item.selfItemTradeIndex.value : 0
             var item3 = item.selfItemPayByrCntIndex ? item.selfItemPayByrCntIndex.value : 0
             var item4 = item.selfItemUv ? item.selfItemUv.value : 0
             selfBox.payRate.push(item1);
             selfBox.tradeIndex.push(item2);
             selfBox.payByr.push(item3);
             selfBox.uvIndex.push(item4);
             if (produceData.rivalItem1Id) {
                 var rivalBox = sourceIndex.rivalItem1
                 var itemb1 = item.rivalItem1PayRateIndex ? item.rivalItem1PayRateIndex.value : 0
                 var itemb2 = item.rivalItem1TradeIndex ? item.rivalItem1TradeIndex.value : 0
                 var itemb3 = item.rivalItem1PayByrCntIndex ? item.rivalItem1PayByrCntIndex.value : 0
                 var itemb4 = item.rivalItem1Uv ? item.rivalItem1Uv.value : 0
                 rivalBox.payRate.push(itemb1);
                 rivalBox.tradeIndex.push(itemb2);
                 rivalBox.payByr.push(itemb3);
                 rivalBox.uvIndex.push(itemb4);
             }
             if (produceData.rivalItem2Id) {
                 var rival2Box = sourceIndex.rivalItem2
                 var itemc1 = item.rivalItem2PayRateIndex ? item.rivalItem2PayRateIndex.value : 0
                 var itemc2 = item.rivalItem2TradeIndex ? item.rivalItem2TradeIndex.value : 0
                 var itemc3 = item.rivalItem2PayByrCntIndex ? item.rivalItem2PayByrCntIndex.value : 0
                 var itemc4 = item.rivalItem2Uv ? item.rivalItem2Uv.value : 0
                 rival2Box.payRate.push(itemc1);
                 rival2Box.tradeIndex.push(itemc2);
                 rival2Box.payByr.push(itemc3);
                 rival2Box.uvIndex.push(itemc4);
             }

         })
     }
     return sourceIndex
 }
 /**市场-监控看板-我的监控 */
 // 监控店铺过滤
 function filterMarketShop(data) {
     if (data) {
         data.forEach((item) => {
             var va1 = item.payRateIndex ? item.payRateIndex.value : 0;
             var va2 = item.tradeIndex ? item.tradeIndex.value : 0;
             var va3 = item.payByrCntIndex ? item.payByrCntIndex.value : 0;
             var va4 = item.uvIndex ? item.uvIndex.value : 0;
             var va5 = item.seIpvUvHits ? item.seIpvUvHits.value : 0;
             var va6 = item.cartHits ? item.cartHits.value : 0;
             var va7 = item.cltHits ? item.cltHits.value : 0;
             responseData.payRate.push(va1);
             responseData.tradeIndex.push(va2);
             responseData.payByr.push(va3);
             responseData.uvIndex.push(va4);
             responseData.seIpv.push(va5);
             responseData.cartHit.push(va6);
             responseData.cltHit.push(va7);
         });
     }
 }
 // 监控店铺过滤
 function filterMarketHot(data) {
     var obj = {
         tradeIndex: []
     }
     if (data) {
         data.forEach((item) => {
             obj.tradeIndex.push(item.tradeIndex.value)
         });
         return obj
     }
 }
 // 市场排行-高交易
 function filterMarketHotsale(data) {
     var res = {
         tradeIndex: [],
         payRate: []
     }
     if (!data.length) {
         return []
     }
     data.forEach(function (item) {
         res.tradeIndex.push(item.tradeIndex.value)
         res.payRate.push(item.payRateIndex.value)
     })
     return res
 }
 // 市场排行-高流量
 function filterMarketHotsearch(data) {
     var res = {
         seIpv: [],
         uvIndex: [],
         tradeIndex: []
     }
     if (!data.length) {
         return []
     }
     data.forEach(function (item) {
         res.tradeIndex.push(item.tradeIndex.value)
         res.seIpv.push(item.seIpvUvHits.value)
         res.uvIndex.push(item.uvIndex.value)
     })
     return res
 }
 // 市场排行-高意向
 function filterMarketHotpurpose(data) {
     var res = {
         cartHit: [],
         cltHit: [],
         tradeIndex: []
     }
     if (!data.length) {
         return []
     }
     data.forEach(function (item) {
         res.tradeIndex.push(item.tradeIndex.value)
         res.cartHit.push(item.cartHits.value)
         res.cltHit.push(item.cltHits.value)
     })
     return res
 }
 // 竞品解析
 function fliterSingleCompete(data) {
     if (!data) {
         return ''
     }
     var res = {
         payRate: [],
         tradeIndex: [],
         payByr: [],
         // uvIndex: []
     }
     data.forEach(function (item) {
         var itemb1 = item.rivalItem1PayRateIndex ? item.rivalItem1PayRateIndex.value : 0
         var itemb2 = item.rivalItem1TradeIndex ? item.rivalItem1TradeIndex.value : 0
         var itemb3 = item.rivalItem1PayByrCntIndex ? item.rivalItem1PayByrCntIndex.value : 0
         // var itemb4 = item.rivalItem1Uv ? item.rivalItem1Uv.value : 0
         res.payRate.push(itemb1);
         res.tradeIndex.push(itemb2);
         res.payByr.push(itemb3);
         // rivalBox.uvIndex.push(itemb4);
     })
     return res
 }
export function dealIndex(request, sendResponse, dataWrapper) {
        responseData = {
            payRate: [],
            tradeIndex: [],
            payByr: [],
            uvIndex: [],
            seIpv: [],
            cartHit: [],
            cltHit: []
        }
        if (request.type == 'version') {
            getVersion(request.ver, sendResponse)
        } else if (request.type == 'monitShop') {
            var moniShopData = jsonParse(dataWrapper[request.type].data)
            if (!moniShopData) {
                popTip('获取数据失败，请刷新')
                return false;
            }
            filterMinoShop(moniShopData)
            for (var key in responseData) {
                getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'monitShop', moniShopData)
            }
        } else if (request.type == 'monitFood') {
            var saveData1 = localStorage.getItem(request.dataType);
            if (!saveData1) {
                popTip('获取数据失败！')
                return false;
            }
            var pageData = jsonFoodParse(saveData1, request.localCache);
            var markShop = pageData.data.data ? pageData.data.data : pageData.data;
            var sendPageData = pageData.recordCount ? pageData : pageData.data;
            filterMarketShop(markShop)
            for (var key in responseData) {
                getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'marketShop', sendPageData)
            }
        } else if (request.type == 'monitCompareFood') {
            var saveData2 = localStorage.getItem(request.dataType);
            if (!saveData2) {
                popTip('获取数据失败！')
                return false;
            }
            var moniComData = jsonParse(saveData2, request.localCache)
            filterMoinCompare(moniComData)
            for (var key in responseData) {
                getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'monitCompareFood', moniComData)
            }
        } else if (request.type == 'monitResource') {
           var saveData3 = localStorage.getItem(request.dataType);
           if (!saveData3) {
               popTip('获取数据失败！')
               return false;
           }
           var moniResData = jsonParse(saveData3, request.localCache)
            var itemIds = dataWrapper['monitResource'].ids
            var resouceIndex = filterMoinRes(moniResData, itemIds)
            var ajaxNum = Object.keys(resouceIndex).length == 2 ? 6 : 9
            responseData['selfItem'] = {}
            responseData['rivalItem1'] = {}
            responseData['rivalItem2'] = {}
            for (var key in resouceIndex) {
                for (var j in resouceIndex[key]) {
                    if (j != 'uvIndex') {
                        getAjax(resouceIndex[key][j], j, sendResponse, ajaxNum, 'monitResource', moniResData, key)
                    } else {
                        responseData[key][j] = resouceIndex[key][j]
                    }
                }
            }

        } else if (request.type == 'marketShop' || request.type == 'marketFood') {
             var saveData4 = localStorage.getItem(request.dataType);
             if (!saveData4) {
                 popTip('获取数据失败！')
                 return false;
             }
             var pageData1 = jsonFoodParse(saveData4, request.localCache);
            var markShop1 = pageData1.data.data ? pageData1.data.data : pageData1.data;
            var sendPageData1 = pageData1.recordCount ? pageData1 : pageData.data;
            filterMarketShop(markShop1)
            for (var key in responseData) {
                getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'marketShop', sendPageData1)
            }
        } else if (request.type == 'marketHotShop' || request.type == 'marketHotFood') {
           var saveData5 = localStorage.getItem(request.dataType);
           if (!saveData5) {
               popTip('获取数据失败！')
               return false;
           }
           var pageData2 = jsonFoodParse(saveData5, request.localCache)
            var marketHot2 = pageData2.data
            var markHotIndex2 = filterMarketHot(marketHot2)
            for (var key in markHotIndex2) {
                getAjax(markHotIndex2[key], key, sendResponse, Object.keys(markHotIndex2).length, 'marketHotShop', pageData2)
            }
        } else if (request.type == 'marketHotShop' || request.type == 'marketHotFood') {
            var pageData3 = jsonFoodParse(localStorage.getItem(request.dataType), 'page')
            var marketHot3 = pageData3.data
            var markHotIndex3 = filterMarketHot(marketHot3)
            for (var key in markHotIndex3) {
                getAjax(markHotIndex3[key], key, sendResponse, Object.keys(markHotIndex3).length, 'marketHotShop', pageData3)
            }
        } else if (request.type == 'hotsearch' || request.type == 'hotpurpose' || request.type == 'hotsale') {
            var hotsearch = request.type == 'hotsearch' ? filterMarketHotsearch(request.dataType) : request.type == 'hotpurpose' ? filterMarketHotpurpose(request.dataType) : filterMarketHotsale(request.dataType);
            if (!hotsearch) {
                popTip('获取数据失败，请刷新')
                return false;
            }
            for (var key in hotsearch) {
                getAjax(hotsearch[key], key, sendResponse, Object.keys(hotsearch).length, 'hotsearch')
            }
        } else if (request.type == 'dealTrend') {
            var dealTrend = request.dataType;
            if (!dealTrend) {
                popTip('获取数据失败，请刷新')
                return false;
            }
            for (var key in dealTrend) {
                getAjax(dealTrend[key], key, sendResponse, Object.keys(dealTrend).length, 'dealTrend')
            }
        } else if (request.type == 'singleCompete') {
            var singleData = request.dataType;
            var filterSingle = fliterSingleCompete(singleData);
            for (var key in filterSingle) {
                getAjax(filterSingle[key], key, sendResponse, Object.keys(filterSingle).length, 'singleCompete')
            }
        }
        return true;
    }