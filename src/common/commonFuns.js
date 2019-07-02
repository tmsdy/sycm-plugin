
var updataTime = getTimeNode();
// 获取更新数据时间节点
export function getTimeNode() {
    var allLocal = localStorage.valueOf();
    var dateBox = '';
    for (var k in allLocal) {
        if (k.indexOf('//sycm.taobao.com/portal/common/commDate.json?targetUrl=http://sycm.taobao.com/mc') != -1) {
            dateBox = allLocal[k];
            break;
        }
    }
    if (!dateBox) {
        return ''
    }
    var res = JSON.parse(dateBox).split("|")[1];
    return JSON.parse(res).value._d;
}

export function setDateRange(data, type) {
    var recentDay = data
    var fontDate = formate('yyyy-MM-dd', new Date(recentDay))
    if (type == 'day') {
        return fontDate + '|' + fontDate
    }
    if (type == 'recent7') {
        var recent7 = recentDay - 518400000;
        var endDate7 = formate('yyyy-MM-dd', new Date(recent7))
        return endDate7 + '|' + fontDate
    }
    var recent30 = recentDay - 2505600000;
    var endDate = formate('yyyy-MM-dd', new Date(recent30))
    return endDate + '|' + fontDate
} 
//数据处理-竞品分析

// 日期格式化
export function formate(fmt, date) {
    if (!date) {
        return ''
    }
    var o = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S": date.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// 计算公式
export function formula(val, val2, type) {
    if (val == "undefined" || val === '' || val == '-' || !val2 || val2 == '-' || val2 == '0') {
        return '-'
    } else {
        val = (val + '').replace(',', '');
        val2 = (val2 + '').replace(',', '')
        if (type == 1) {
            return (Math.round((val / val2) * 100) / 100).toFixed(2)
        } else if (type == 2) {
            return (Math.round((val / val2) * 10000) / 100).toFixed(2) + '%'
        }
    }
}
// 取整/格式化
export function integer(val, type) {
    if (val == 0) {
        return 0
    } else if (!val || val == '-') {
        return '-'
    } else {
        val = (val + '').replace(',', '')
        if (type == 'inter') {
            return Math.round(val)
        } else if (type == 'precent') {
            return (val.indexOf('%') !== -1) ? (val.slice(0, -1) / 100) : val
        } else {
            return val
        }
    }
}
// 返回数据格式修改
export function delePoint(val) {
    val = (val + '').replace(',', '')
    if (val.indexOf('%') !== -1) {
        return val.slice(0, -1) / 100
    } else {
        return val
    }

}
// 竞品解析-验证url
export function testUrl(val) {
    var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
    var numReg = /^\d+$/;
    var isUrl = urlReg.test(val);
    var isNum = numReg.test(val);
    var id = '';
    if (isUrl) {
        var params = val.split('?')[1]
        var searchKey = params.split('&')
        searchKey.forEach(function (item) {
            var text = item.split("=")
            if (text[0] == 'id') {
                id = text[1]
            }
        })
        return id
    }
    if (isNum) {
        return val
    }
    return false
}
export function operatcPmpareData(v1, v2, v3) {
    v1 = (v1 + '').replace(',', '')
    v2 = (v2 + '').replace(',', '')
    v3 = (v3 + '').replace(',', '')
    var result = {
        num1: 0,
        num2: 0
    }
    if (!v1 || !v2 || v1 == '-' || v2 == '-' || v2 == '0') {
        result.num1 = '-';
        result.num2 = '-';
    } else if (!v3 || v3 == '-') {
        result.num1 = Math.round(v1 * v2 )
        result.num2 = '-';
    } else {
        result.num1 = Math.round(v1 * v2 )
        result.num2 = result.num1 ? (v3 / result.num1).toFixed(2) : '-';
    }
    return result
}
//计算支付人数
export function computedPayByr(v1, v2, v3) {
    var result = {
        res1: 0,
        res2: 0,
    }
    if (!v1 || v1 == '-' || !v2 || v2 == '-') {
        result.res1 = '-'
        result.res2 = '-'
    } else {
        v1 = (v1 + '').replace(',', '');
        v2 = (v2 + '').replace(',', '').slice(0, -1);
        v3 = (v3 + '').replace(',', '');
        var del = v1 * v2
        result.res1 = Math.round(del)
        if (v3 == '-') {
            result.res2 = '-'
        } else {
            result.res2 = del ? (v3 / del).toFixed(2) : '-'
        }
    }
    return result
}
// 获取存储时间
export function getCurrentTime(dayType) {
    var upTime = updataTime.updateNDay;
    var up1Time = updataTime.update1Day;
    var sureDate = dayType == 'moreDay' ? upTime : up1Time;
    var saveTime = sureDate ? (new Date(sureDate).getTime()) : localStorage.getItem('currentDate') ? JSON.parse(localStorage.getItem('currentDate')).data.timestamp : '';
    if (!saveTime) {
        return new Date().getTime()
    }
    return saveTime
}
// 获取店铺信息的firstCateId
export function getFirstCateId() {
     var deaultId = localStorage.getItem('shopCateId');
    //  var cateIdF = JSON.parse(localStorage.getItem('tree_history_op-mc._cate_picker'));
     var cateIdF = dataWrapper2['getShopCate'].data.cateId;
     if (!cateIdF) {
         return deaultId;
     }
    //  var cateIdS = cateIdF.split("|")[1];
    //  var cateIdT = cateIdS ? JSON.parse(cateIdS).value : '';
    //  if (!cateIdT) {
    //      return deaultId;
    //  }
    //  var resData = cateIdT[0].treeId;
     return cateIdF;
}
// 竞品解析
export function getDateRange(data, fm) {
    var resArr = []
    var fmt = fm ? fm : 'yyyy-MM-dd';
    for (var i = 0; i < 30; i++) {
        resArr.unshift(formate(fmt, new Date(data - 86400000 * i)));
    }
    return resArr
}
// 获取查询项信息
export function getSearchParams(key, page, pagesize, dealType, extra) {
    // 获取时间范围
    var dayIndex = $('.oui-date-picker .ant-btn-primary').text()
    var dateType = dayIndex == '实 时' ? 'today' : dayIndex == '7天' ? 'recent7' : dayIndex == '30天' ? 'recent30' : dayIndex == '日' ? 'day' : dayIndex == '周' ? 'week' : dayIndex == '月' ? 'month' : 'today';
    var endpointTyep = key == 'monitCompareFood' ? $('#itemAnalysisTrend .ant-select-selection-selected-value').attr('title') : key == 'monitResource' ? $('#sycm-mc-flow-analysis .ant-select-selection-selected-value').attr('title') : key == 'getKeywords' ? $('#itemAnalysisKeyword .ant-select-selection-selected-value').attr('title') : $('.ebase-FaCommonFilter__root .fa-common-filter-device-select .oui-select-container-value').html(); //终端类型
    var shopType = $('.ebase-FaCommonFilter__root .sellerType-select .ant-select-selection-selected-value').attr('title'); //店铺  天猫淘宝
    var timeRnage = $('.ebase-FaCommonFilter__root .oui-date-picker .oui-date-picker-current-date').text(); //时间区间
    var device = endpointTyep == '所有终端' ? '0' : endpointTyep == 'PC端' ? '1' : endpointTyep == '无线端' ? '2' : '';
    var sellType = shopType == '全部' ? '-1' : shopType == '天猫' ? '1' : shopType == '淘宝' ? '0' : '';
    var spliteTime = timeRnage.split(' ');
    var splitLen = spliteTime.length;
    var finalTime = '';
    if (splitLen == 3 || splitLen == 2) {
        finalTime = spliteTime[1] + '|' + spliteTime[1]
    } else if (splitLen == 4) {
        finalTime = key == 'allTrend' ? (spliteTime[3] + '|' + spliteTime[3]) : (spliteTime[1] + '|' + spliteTime[3])
    }
    page = page ? page : 1;
    pagesize = pagesize ? pagesize : 10;
    var localCateId =  getFirstCateId();
    if (key == 'hotsearch' || key == 'hotpurpose' || key == 'hotsale') {
        localCateId = localStorage.getItem('shopCateId');
    }
    if (key == 'allTrend' && !dealType) {
        localCateId = localStorage.getItem('shopCateId');
        finalTime = setDateRange(getCurrentTime(), 'day');
        return key += 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=day' + '&device=' + device + '&sellerType=' + sellType;
    }
    if ((key == 'relatedHotWord' || key == 'relatedWord') && !dealType) { //相关热词
        return key += 'dateRange=' + finalTime + '&dateType=day' + '&device=' + device + '&keyword=' + extra.keyword;
    }
    if (key == 'popularity' && !dealType) { //搜索人群
        return key += 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&seKeyword=' + extra.keyword + '&attrType=' + extra.attrType;
    }
    if (!dealType) {
        return key += 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&page=' + page + '&pageSize=' + pagesize + '&sellerType=' + sellType
    }
    if (key == "monitFood") {
        var isMonitLive = dateType == 'today' ? 'live/' : '';
        var isMonitAll = dateType == 'today' ? '' : '&type=all';
        return '/mc/' + isMonitLive + 'ci/item/monitor/list.json?cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=cateRankId,tradeIndex&order=desc&orderBy=tradeIndex&page=' + page + '&pageSize=' + pagesize + '&sellerType=' + sellType + isMonitAll
    }
    if (key == "monitCompareFood") {
        var isMonitLive = dateType == 'today' ? 'Live' : '';
        return '/mc/rivalItem/analysis/get' + isMonitLive + 'CoreIndexes.json?cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device
    }
    if (key == "monitResource") {
        var isMonitLive = dateType == 'today' ? 'Live' : '';
        return '/mc/rivalItem/analysis/get' + isMonitLive + 'FlowSource.json?cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=uv&order=desc&orderBy=uv'
    }
    if (key == "marketFood" || key == 'marketShop') {
        var isMonitLive = dateType == 'today' ? 'live/' : '';
        var itemShop = key == 'marketFood' ? 'item' : 'shop';
        return '/mc/' + isMonitLive + 'ci/' + itemShop + '/monitor/list.json?cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=cateRankId,tradeIndex,uvIndex&order=desc&orderBy=tradeIndex&page=' + page + '&pageSize=' + pagesize + '&sellerType=-1'
    }
    if (key == "marketHotFood" || key == 'marketHotShop') {
        var isMonitLive = dateType == 'today' ? 'live' : 'offline';
        var itemShop = key == 'marketHotShop' ? 'showTopShops' : 'showTopItems';
        var endIndex = dateType == 'today' ? '' : ',tradeGrowthRange';
        return '/mc/mq/monitor/cate/' + isMonitLive + '/' + itemShop + '.json?cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=tradeIndex' + endIndex + '&order=desc&orderBy=tradeIndex&page=' + page + '&pageSize=' + pagesize + '&sellerType=-1';
    }
    if (key == "allTrend") {
        localCateId = localStorage.getItem('shopCateId');
        return 'cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=day&device=' + device + '&indexCode=uvIndex,payRateIndex,tradeIndex,payByrCntIndex'
    }
    if (key == "getKeywords") {
        return '/mc/rivalItem/analysis/getKeywords.json?cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=tradeIndex&itemId=itemNum&page=' + page + '&pageSize=' + pagesize + '&sellerType=0&topType=trade'
    }
    if (key == 'relatedHotWord' || key == 'relatedBrand' || key == 'relatedProperty') { //相关热词
        return '/mc/searchword/' + key + '.json?dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=seIpvUvHits,relSeWordCnt,avgWordClickRate,clickHits,avgWordPayRate&keyword=' + extra.keyword + '&order=desc&orderBy=seIpvUvHits&page=' + page + '&pageSize=' + pagesize;
    }
    if (key == 'relatedWord') { //相关搜索词
        return '/mc/searchword/relatedWord.json?dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=seIpvUvHits,sePvIndex,clickRate,clickHits,clickHot&keyword=' + extra.keyword + '&order=desc&orderBy=seIpvUvHits&page=' + page + '&pageSize=' + pagesize;
    }
    if (key == 'popularity') { //搜索人群
        return '/mc/mkt/searchPortrait/popularity.json?attrType=' + extra.attrType + '&cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=clickPopularity&seKeyword=' + extra.keyword;
    }
    if (key == 'industryTrend') { //市场大盘-all
        localCateId = findcategory();
        return '/mc/mq/supply/mkt/overview.json?cateId=' + localCateId.id + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&sellerType=' + sellType;
    }
    if (key == 'bigMarket') { //市场大盘-trend
        localCateId = extra.localCateId;
        return '/mc/mq/supply/mkt/trend/' + extra.compareType + '.json?cateId=' + localCateId + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + extra.diffCate + '&indexCode=' + extra.selectIndex + '&sellerType=' + sellType;
    }
    if (key == 'SearchRanking') { //搜索排行
        localCateId = findcategory();
        var selType = extra.selType == 1 ? 'tailWord' : extra.selType == 2 ? 'brandWord' : extra.selType == 3 ? 'coreWord' : extra.selType == 4 ? 'attrWord' : 'searchWord';
        var indCode = '';
         var orderBy
        if (extra.selType == 0 || extra.selType == 1) {
            indCode = !extra.rank ? 'hotSearchRank,seIpvUvHits,clickHits,clickRate,payRate' : 'soarRank,seRiseRate,seIpvUvHits,clickHits,clickRate,payRate';
            orderBy = !extra.rank ? 'seIpvUvHits' : 'seRiseRate';
        }else{
            indCode = !extra.rank ? 'hotSearchRank,relSeWordCnt,avgWordSeIpvUvHits,avgWordClickHits,avgWordClickRate,avgWordPayRate' : 'soarRank,avgWordSeRiseRate,relSeWordCnt,avgWordSeIpvUvHits,avgWordClickHits,avgWordPayRate';
            orderBy = !extra.rank ? 'avgWordSeIpvUvHits' : 'avgWordSeRiseRate';
        }
        return '/mc/industry/' + selType + '.json?cateId=' + localCateId.id + '&dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode='+indCode+'&order=desc&orderBy='+orderBy+'&page=1&pageSize=10';
    }
     if (key == 'searchOverview') { //搜索分析-overview
         return '/mc/searchword/overview.json?dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&keyword=' + extra.keyword;
     }
     if (key == 'analySearchTrend') { //搜索分析-alltrend
         return '/mc/searchword/propertyTrend.json?dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&diffKeyword=&indexCode=&keyword=' + extra.keyword;
     }
     if (key == 'structSearchAll') { //搜索分析-struct
         return '/mc/searchword/getCategory.json?dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&keyword='+extra.keyword;
     }
     if (key == 'structSearchItem') { //搜索分析-struct
        return '/mc/searchword/getCategory.json?dateRange=' + finalTime + '&dateType=' + dateType + '&device=' + device + '&indexCode=clickHits,clickHitsRatio,clickHot,clickCntRatio,clickRate&keyword=' + extra.keyword + '&level1Id='+extra.cateId+'&order=desc&orderBy=clickHits&page='+page+'&pageSize='+pagesize;
     }
     if (key == 'searchPerson') { //搜索人群
        return '/mc/mkt/searchPortrait/popularity.json?attrType='+extra.attrType+'&cateId='+localCateId+'&dateRange='+finalTime+'&dateType='+dateType+'&device='+device+'&indexCode='+extra.indexCode+'&seKeyword='+extra.keyword;
     }
}
// 市场cateid
export function findcategory() {
    var text = '';
    text = $('.ebase-FaCommonFilter__top .ebase-FaCommonFilter__left .common-picker-header').attr('title');
    var isRoot = text.indexOf('>');
    if (isRoot == -1) {
        return {
            id: dataWrapper2['getShopCate'].data.cateId,
            name: text
        };
    }
    var deText = text.split('>');
    var fianlText = deText[deText.length - 1].trim();
    var allCate = dataWrapper2['getShopCate'].data.allInfo;
    var len = allCate ? allCate.length : 0;
    var res = '';
    for (let i = 0; i < len; i++) {
        const element = allCate[i];
        if (element[2] == fianlText) {
            if (deText.length < 3) {
                if (element[0] == element[6]){
                    res = element[1];
                    break;
                }
            }else{
                res = element[1];
                break;
            }
        }
    }
    return {
        id: res,
        name: fianlText
    };
}
 // 获取商品信息
export function getProductInfo() {
    var items = $('#itemAnalysisSelect .sycm-common-select-wrapper .alife-dt-card-sycm-common-select')
    var info = {
        selfItem: {
            imgurl: '',
            title: ''
        },
        rivalItem1: {
            imgurl: '',
            title: ''
        },
        rivalItem2: {
            imgurl: '',
            title: ''
        },
        totalNum: 0
    }
    for (var i = 0; i < 3; i++) {
        var $title = $(items[i]).find('.sycm-common-select-selected-title')
        var $img = $(items[i]).find('.sycm-common-select-selected-image-wrapper img')
        if ($title.length) {
            var productTitle = $title ? $title.attr('title') : ''
            var productImg = $img ? $img.attr('src') : ''
            info.totalNum += 1
            if (i == 0) {
                info.selfItem.imgurl = productImg
                info.selfItem.title = productTitle
            } else if (i == 1) {
                info.rivalItem1.imgurl = productImg
                info.rivalItem1.title = productTitle
            } else if (i == 2) {
                info.rivalItem2.imgurl = productImg
                info.rivalItem2.title = productTitle
            }


        }
    }
    return info
}
 // 获取竞争分析商品id
 export function getproduceIds(product, dataWrapper, type) {

     var selfListJson = localStorage.getItem('chaqz_compareSelfList') || getLocalSelfList();
     var mointListJson = dataWrapper.getMonitoredList.data;
     if (!selfListJson || !mointListJson.length) {
         popTip('获取竞品数据失败，请刷新重试！');
         LoadingPop()
         return false;
     }
     var selfList = JSON.parse(selfListJson)
     var mointList = JSON.parse(mointListJson);
     var ids = {
         item1: '',
         item2: '',
         self: ''
     }
     var item1 = ''
     var item2 = ''
     var self = ''
     for (var i = 0; i < selfList.length; i++) {
         if (selfList[i].title == product.selfItem.title) {
             self = '&selfItemId=' + selfList[i].itemId
             ids.self = selfList[i]
         }
     }
     for (var j = 0; j < mointList.length; j++) {
         if (mointList[j].name == product.rivalItem1.title) {
             ids.item1 = mointList[j]
             item1 = '&rivalItem1Id=' + mointList[j].itemId
         } else if (mointList[j].name == product.rivalItem2.title) {
             ids.item2 = mointList[j]
             item2 = '&rivalItem2Id=' + mointList[j].itemId
         }
     }
     if (type == 'idObj') {
         return ids
     } else {
         return item1 + item2 + self
     }
 }

 function getLocalSelfList() {
     var localSelf = JSON.parse(localStorage.getItem('/mc/rivalShop/recommend/item.json'))
     var getLocal = localSelf ? JSON.parse(localSelf.split("|")[1]).value._d : '';
     return Decrypt(getLocal)
 }
 /**获取本地数据方法处理 */
export function filterLocalData(val) {
    if(!val){return ''}
    var localData = JSON.parse(val).split("|")[1];
    var middleData = JSON.parse(localData).value._d;
    var cryptoData = Decrypt(middleData);
    return cryptoData;
}
 export function Decrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("w28Cz694s63kBYk4");
    var iv = CryptoJS.enc.Utf8.parse('4kYBk36s496zC82w');
     let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
     let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
     let decrypt = CryptoJS.AES.decrypt(srcs, key, {
         iv: iv,
         mode: CryptoJS.mode.CBC,
         padding: CryptoJS.pad.Pkcs7
     });
     let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
     return decryptedStr.toString();
 }