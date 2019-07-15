 import {
     formula,
     integer, filterLocalData
 } from './commonFuns';
 import {
    //  LogOut,
     popTip
 } from './promptClass'
 var requestNum = 0;
//  指数obj
 var responseData = {
     payRate: [],
     tradeIndex: [],
     payByr: [],
     uvIndex: [],
     seIpv: [],
     cartHit: [],
     cltHit: [],
     sePvIndex:[],
     clickHits: [],
     clickHots: [],
     lostIndex: [],
     lostHits: [],
     prePayAmtIndex: [],
     cartByrCntIndex: []
 };

//  指数转化请求
 export function getAjax(data, type, sendResponse, num, fType, lastData, compareItem) {
     var filterType = (type == 'payRate' || type == 'payRateIndex') ? 1 : type == 'tradeIndex' ? 2 : (type == 'payByr' || type == 'payByrCntIndex') ?
         3: type == 'uvIndex' ? 4 : (type == 'seIpv' || type == 'seIpvUvHits') ? 5 : (type == 'cartHit' || type == 'cartHits') ? 6 : (type == 'cltHit' || type == 'cltHits') ? 7 : type == 'sePvIndex' ? 8 : '';
       var val = getAllIndex(filterType,data)
             requestNum++
                 if (!compareItem) {
                     responseData[type] = val
                 } else {
                     responseData[compareItem][type] = val
                 }
             if (requestNum > num - 1) {
                 var resData = fType == 'monitShop' ? moinShopTable(lastData) : fType == 'monitFood' ? moinFoodTable(lastData) : fType == 'monitCompareFood' ? responseData : fType == 'monitResource' ? {
                     value: responseData,
                     final: lastData
                 } : fType == 'marketShop' ? {
                     value: responseData,
                     final: lastData
                 } : fType == 'marketHot' ? {
                     value: responseData,
                     final: lastData
                 }: fType == 'inclueOrgin' ? {
                    value: responseData,
                    final: lastData
                } : {
                value: responseData
                 };
                 requestNum = 0
                 sendResponse(resData)
             }
 }
 function getAllIndex(type,data){
     if(!data){
         return []
     }
     var length = data.length;
     var res = [];
     var methodSel = type == 1 ? 'findRateType' : 'findType';
     for(var i=0;i<length;i++){
        var cover = indexTrans[methodSel](data[i]);
        if(typeof cover =='number'){
            if (type == 1){
                cover = cover < 0 ? 0 : Number(cover.toFixed(4));
            }else{
                cover = cover < 0 ? 0 : Math.round(cover);
            }
            
        }
        res.push(cover)
     }
     return res;
 }
 //  index transfrom rules
 var indexTrans = {
     findType:function(num){
          if (num == undefined) {
              return 0
          }
        if (num >= 0 && num < 3000) {
            return indexTrans.rang1(num)
        } else if (num >= 3000 && num < 20000) {
            return indexTrans.rang2(num)
        } else if (num >= 20000 && num < 50000) {
            return indexTrans.rang3(num)
        } else if (num >= 50000 && num < 100000) {
            return indexTrans.rang4(num)
        } else if (num >= 100000 && num < 200000) {
            return indexTrans.rang5(num)
        } else if (num >= 200000 && num < 300000) {
            return indexTrans.rang6(num)
        }  else if (num >= 300000 && num < 500000) {
            return indexTrans.rang7(num)
        } else if (num >= 500000 && num < 800000) {
            return indexTrans.rang8(num)
        } else if (num >= 800000 && num < 1000000) {
            return indexTrans.rang9(num)
        } else if (num >= 1000000 && num < 2000000) {
            return indexTrans.rang10(num)
        } else if (num >= 2000000 && num < 5000000) {
            return indexTrans.rang11(num)
        } else if (num >= 5000000 && num < 8000000) {
            return indexTrans.rang12(num)
        } else if (num >= 8000000 && num < 12000000) {
            return indexTrans.rang13(num)
        } else if (num >= 12000000 && num < 17000000) {
            return indexTrans.rang14(num)
        } else {
            return '超出范围'
        }
     },
     findRateType:function(num){
         if(num==undefined){
             return 0
         }
         if (num >= 0 && num < 23) {
             return indexTrans.rangRate1(num)
         } else if (num >= 23 && num < 70) {
             return indexTrans.rangRate2(num)
         } else if (num >= 70 && num < 100) {
             return indexTrans.rangRate3(num)
         } else if (num >= 100 && num <= 3693.5) {
             return indexTrans.rangRate4(num)
         } else {
             return '超出范围'
         }
     },
     rang1: function (x) {
         return 2.85032440023E-19 * Math.pow(x, 6) - 3.26733299167131E-15 * Math.pow(x, 5) + 1.56488163015261E-11 * Math.pow(x, 4) - 4.33751859674971E-08 * Math.pow(x, 3) + 0.000143677524953538 * Math.pow(x, 2) + 0.0426669903534544 * x - 1.17347128162112;
     },
     rang2: function (x) {
         return 2.6361693E-23 * Math.pow(x, 6) - 2.305291293498E-18 * Math.pow(x, 5) + 8.76700064327854E-14 * Math.pow(x, 4) - 2.05828554084245E-09 * Math.pow(x, 3) + 0.0000727213988444307 * Math.pow(x, 2) + 0.126991314453936 * x - 56.4039982262882;
     },
     rang3: function (x) {
         return 1.10199E-25 * Math.pow(x, 6) - 3.2284892498E-20 * Math.pow(x, 5) + 4.2439923457579E-15 * Math.pow(x, 4) - 3.58616335129325E-10 * Math.pow(x, 3) + 0.0000518530019341748 * Math.pow(x, 2) + 0.277193063913089 * x - 555.674398971899;
     },
     rang4: function (x) {
         return 8.454E-27 * Math.pow(x, 6) - 4.636470035E-21 * Math.pow(x, 5) + 1.12750813204514E-15 * Math.pow(x, 4) - 1.73450632416443E-10 * Math.pow(x, 3) + 0.0000458199713387622 * Math.pow(x, 2) + 0.376508286240507 * x - 1157.16452820911;
     },
     rang5: function (x) {
         return -6.1343545E-23 * Math.pow(x, 5) + 6.8771145208903E-17 * Math.pow(x, 4) - 3.78097694140952E-11 * Math.pow(x, 3) + 0.000035566490066202 * Math.pow(x, 2) + 0.812733493327658 * x - 9309.08526054004;
     },
     rang6: function (x) {
         return -9.921835E-24 * Math.pow(x, 5) + 1.937505297447E-17 * Math.pow(x, 4) - 1.86442674482995E-11 * Math.pow(x, 3) + 0.0000318094595744882 * Math.pow(x, 2) + 1.1849180217423 * x - 24209.7551876062;
     },
     rang7: function (x) {
         return -3.449782E-24 * Math.pow(x, 5) + 9.307994247519E-18 * Math.pow(x, 4) - 1.23946227430043E-11 * Math.pow(x, 3) + 0.0000298760415237449 * Math.pow(x, 2) + 1.48275058356596 * x - 42476.8535347282;
     },
     rang8: function (x) {
         return -3.34135E-25 * Math.pow(x, 5) + 1.857997381456E-18 * Math.pow(x, 4) - 5.09063423342014E-12 * Math.pow(x, 3) + 0.0000261974390300692 * Math.pow(x, 2) + 2.43509528826424 * x - 143734.812525108;
     },
     rang9: function (x) {
         return -3.34135E-25 * Math.pow(x, 5) + 1.857997381456E-18 * Math.pow(x, 4) - 5.09063423342014E-12 * Math.pow(x, 3) + 0.0000261974390300692 * Math.pow(x, 2) + 2.43509528826424 * x - 143734.812525108;
     },
     rang10: function (x) {
         return -3.4957E-26 * Math.pow(x, 5) + 3.90026460982E-19 * Math.pow(x, 4) - 2.15062266440996E-12 * Math.pow(x, 3) + 0.0000231851131049988 * Math.pow(x, 2) + 4.01611672970563 * x - 483648.680995591;
     },
     rang11: function (x) {
         return -3.223E-27 * Math.pow(x, 5) + 7.6032423132E-20 * Math.pow(x, 4) - 8.80678160840188E-13 * Math.pow(x, 3) + 0.0000205555297155039 * Math.pow(x, 2) + 6.8042707843411 * x - 1692703.6365919;
     },
     rang12: function (x) {
         return 4.745220879E-21 * Math.pow(x, 4) - 2.2534536331068E-13 * Math.pow(x, 3) + 0.0000174075334242049 * Math.pow(x, 2) + 14.7202956322245 * x - 10003418.7550595;
     },
     rang13: function (x) {
         return 1.88173071E-21 * Math.pow(x, 4) - 1.35986059338809E-13 * Math.pow(x, 3) + 0.0000163532517979465 * Math.pow(x, 2) + 20.2954054532331 * x - 21153280.4884378;

     },
     rang14: function (x) {
         return 7.96482453E-22 * Math.pow(x, 4) - 8.51492731921746E-14 * Math.pow(x, 3) + 0.0000154538934795292 * Math.pow(x, 2) + 27.4181492568135 * x - 42460659.1147964;

     },
     rangRate1: function (x) {
         return 0

     },
     rangRate2: function (x) {
         return 0.0779253447760533 - 0.0131900303435961 * x + 0.00093015655979144 * Math.pow(x, 2) -
             3.54157386665521E-05 * Math.pow(x, 3) + 7.87448131414697E-07 * Math.pow(x, 4) - 1.02361136114077E-08 * Math.pow(x,
                 5) + 7.2128868872547E-11 * Math.pow(x, 6) - 2.12844187739757E-13 * Math.pow(x, 7);

     },
     rangRate3: function (x) {
         return 1.15159043287822 - 0.0877250643847525 * x + 0.00281297037078605 * Math.pow(x, 2) -
             4.92030942670029E-05 * Math.pow(x, 3) + 5.0709236128221E-07 * Math.pow(x, 4) - 3.07976848571464E-09 * Math.pow(x,
                 5) + 1.0209885402886E-11 * Math.pow(x, 6) - 1.42597929843806E-14 * Math.pow(x, 7);

     },
     rangRate4: function (x) {
         return -1.17509656E-22 * Math.pow(x, 6) + 1.244978219333E-18 * Math.pow(x, 5) - 3.41752276522394E-15 * Math.pow(x, 4) - 1.08611167104575E-11 * Math.pow(x, 3) + 1.19973853575719E-07 * Math.pow(x, 2) - 3.04110364623966E-06 * x + 0.000344332464464969;

     },
 }
 // 存储本地数据转对象
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
/* 展示数据获取 */
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
 /**data filter */
  //竞争-监控店铺  
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
 // 竞品来源入口
 function filterMoinRes(data, produceData) {
     var sourceIndex = {
             payRate: [],
             tradeIndex: [],
             payByr: [],
             uvIndex: []
     }
     var topLen = data.length;
     var Len = produceData.length;
     for (let i = 0; i < topLen; i++) {
         for (let j = 0; j < Len; j++) {
             var item = data[i];
             var item1 = item[produceData[j]+'PayRateIndex'];
             var item2 = item[produceData[j] + 'TradeIndex'] ;
             var item3 = item[produceData[j] + 'PayByrCntIndex'] ;
             var item4 = item[produceData[j] + 'Uv'] ;
             sourceIndex.payRate.push(item1 ? item1.value : 0);
             sourceIndex.tradeIndex.push(item2 ? item2.value : 0);
             sourceIndex.payByr.push(item3 ? item3.value : 0);
             sourceIndex.uvIndex.push(item4 ? item4.value : 0);
         }
     }
     return sourceIndex
 }
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
     }
     data.forEach(function (item) {
         var itemb1 = item.selfItemPayRateIndex ? item.selfItemPayRateIndex.value : 0
         var itemb2 = item.selfItemTradeIndex ? item.selfItemTradeIndex.value : 0
         var itemb3 = item.selfItemPayByrCntIndex ? item.selfItemPayByrCntIndex.value : 0
         res.payRate.push(itemb1);
         res.tradeIndex.push(itemb2);
         res.payByr.push(itemb3);
     })
     return res
 }
//   市场大盘
function filterMarkterBidpan(data){
    if (!data) {
        return ''
    }
    responseData.tradeIndex.push(data.tradeIndex.value)
    responseData.payByr.push(data.payByrCntIndex.value)
    responseData.seIpv.push(data.seIpvUvHits.value)
    responseData.sePvIndex.push(data.sePvIndex.value)

}
//  哪几项有数据
 function objLength(obj) {
     if (!obj || (typeof obj != 'object')) {
         return 0
     }
     var resObj = {};
     var total = 0;
     for (var k in obj) {
         if (obj[k].length){
            resObj[k] = obj[k];
            total++
         }
     }
     return {
         total: total,
         data: resObj
     };
 }

export function dealIndex(request, sendResponse, dataWrapper) {
          responseData = {
            payRate: [],
            tradeIndex: [],
            payByr: [],
            uvIndex: [],
            seIpv: [],
            cartHit: [],
            cltHit: [],
            sePvIndex: [],
            clickHits:[],
            clickHot:[],
            lostIndex: [],
            lostHits: [],
            prePayAmtIndex: [],
            cartByrCntIndex: []
         };
       if (request.type == 'monitShop') {
            var moniShopData = jsonParse(dataWrapper[request.type].data)
            if (!moniShopData) {
                popTip('获取数据失败，请刷新')
                return false;
            }
            filterMinoShop(moniShopData)
            for (var key in responseData) {
                getAjax(responseData[key], key, sendResponse, Object.keys(responseData).length, 'monitShop', moniShopData)
            }
        } else if (request.type == 'monititem') {
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
            var resouceIndex = filterMoinRes(moniResData, request.datakey);
            var ajaxNum = Object.keys(resouceIndex).length == 2 ? 6 : 9;
            for (var key in resouceIndex) {
                responseData['uvIndex'] = resouceIndex['uvIndex']
                if (key != 'uvIndex') {
                    getAjax(resouceIndex[key], key, sendResponse, Object.keys(resouceIndex).length - 1, 'monitResource', moniResData)
                }
            }

        } else if (request.type == 'monitshop' || request.type == 'monititem' || request.type == 'monitbrand') {
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
        } else if (request.type == 'marketHot') {
           var saveData5 = localStorage.getItem(request.dataType);
           if (!saveData5) {
               popTip('获取数据失败！')
               return false;
           }
           var pageData2 = jsonFoodParse(saveData5, request.localCache)
            var marketHot2 = pageData2.data
            var markHotIndex2 = filterMarketHot(marketHot2)
            for (var key in markHotIndex2) {
                getAjax(markHotIndex2[key], key, sendResponse, Object.keys(markHotIndex2).length, 'marketHot', pageData2)
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
        } else if (request.type == 'industryTrend') {
            var singleData = localStorage.getItem(request.dataType);
            if (!singleData) {
                popTip('获取数据失败！')
                return false;
            }
            var localData = jsonParse(singleData, 'local');
            if (!localData.tradeIndex) {
                sendResponse(localData);
                return;
            }
            filterMarkterBidpan(localData)
            var keyNum = objLength(responseData);
            for (var key in keyNum.data) {
                getAjax(responseData[key], key, sendResponse, keyNum.total, 'inclueOrgin', localData)
            }
        } else if (request.type == 'industryTrendChart') {
            getAjax(request.sendData, request.dataType, sendResponse, 1)
        } else if (request.type == 'analySearch') {
            for (var key in request.sendData) {
                 getAjax(request.sendData[key], key, sendResponse, 3)
            }
           
        } else if (request.type == 'driectIndex'){
             var dealTrend = request.sendData;
             if (!dealTrend) {
                 popTip('获取数据失败，请刷新')
                 return false;
             }
             for (var key in dealTrend) {
                 getAjax(dealTrend[key], key, sendResponse, Object.keys(dealTrend).length, 'dealTrend')
             }
             return responseData;
        }
        return true;
    }