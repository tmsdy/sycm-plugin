  // 对应模块数据存储
  var dataWrapper = {
      'monitShop': {
          urlReg: '\/mc(\/live\/|\/)ci\/shop\/monitor\/listShop\.json',
          data: []
      },
      'monitFood': {
          urlReg: '\/mc(\/live\/|\/)ci\/item\/monitor\/list\.json',
          data: {}
      },
      'monitCompareFood': {
          urlReg: '\/mc\/rivalItem\/analysis\/get(LiveCore|Core)Indexes.json',
          data: []
      },
      'monitResource': {
          urlReg: '\/mc\/rivalItem\/analysis\/get(LiveFlow|Flow)Source.json',
          data: []
      },
      'marketShop': {
          urlReg: '\/mc(\/live\/|\/)ci\/shop\/monitor\/list\.json',
          data: []
      },
      'marketHotShop': {
          urlReg: '\/mc\/mq\/monitor\/cate(.*?)\/showTopShops\.json',
          data: []
      },
      'marketHotFood': {
          urlReg: '\/mc\/mq\/monitor\/cate(.*?)\/showTopItems\.json',
          data: []
      },
      'shopInfo': {
          urlReg: '\/custom\/menu\/getPersonalView\.json',
          data: []
      },
      'compareSelfList': {
          urlReg: '\/mc\/rivalShop\/recommend\/item\.json',
          data: []
      },
      'getMonitoredList': {
          urlReg: '\/mc\/ci\/config\/rival\/item\/getMonitoredList\.json',
          data: []
      },
      'getKeywords': {
          urlReg: '\/mc\/rivalItem\/analysis\/getKeywords\.json',
          data: []
      },
      'hotsale': {
          urlReg: '\/mc\/mq\/mkt\/rank\/(shop|item|brand)\/hotsale\.json',
          data: []
      },
      'hotsearch': {
          urlReg: '\/mc\/mq\/mkt\/rank(.*?)hotsearch\.json',
          data: []
      },
      'hotpurpose': {
          urlReg: '\/mc\/mq\/mkt\/rank\/item\/hotpurpose\.json',
          data: []
      },
      'trendShop': {
          urlReg: '\/mc\/ci\/config\/rival\/(shop|item|brand)\/getSingleMonitoredInfo\.json',
          data: []
      },
      'allTrend': {
          urlReg: '\/mc\/ci\/(shop|item|brand)\/trend\.json',
          data: []
      },
      "currentDate": {
          urlReg: '\/ipoll\/activity\/getCurrentTime\.json'
      },
      "publicInfo": {
          urlReg: '\/mc\/mq\/monitor\/offline\/public\.json'
      }
  }
  window.dataWrapper2 = dataWrapper;
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.extension.getURL('js/interceptRquest.js'));
  document.documentElement.appendChild(script);
  window.addEventListener("pageScript", function (event) {
      receiveResponse(event.detail.url, event.detail.data, event.detail.type)
  });
 function receiveResponse(reqParams, resData, xhrType) {
       if (!xhrType) {
           var repHeader = reqParams ? reqParams[1].headers : "";
           var transId = repHeader ? repHeader['Transit-Id'] : ''
           if (transId) {
               sessionStorage.setItem('transitId', transId)
           }
       }
       var baseUrl = reqParams ? reqParams[0] : "";
       if (baseUrl) {
           for (var k in dataWrapper) {
               if ((new RegExp(dataWrapper[k].urlReg)).test(baseUrl)) {
                   // 根据期限存储数据
                   if (xhrType) {
                       resData = resData ? JSON.parse(resData) : '';
                   }
                   var hasEncryp = resData.data ? resData.data : resData;
                   var finaData = (typeof hasEncryp == 'object') ? resData : Decrypt(hasEncryp);
                   if (k == 'monitShop' || k == 'getMonitoredList') {
                       dataWrapper[k].data = finaData;
                       getParamsItem(baseUrl);
                   } else if (k == 'shopInfo') {
                       dataWrapper[k].data = finaData;
                       localStorage.setItem('chaqz_' + k, JSON.stringify(finaData))
                   } else if (k == 'compareSelfList') {
                       localStorage.setItem('chaqz_' + k, finaData)
                   } else if (k == 'monitCompareFood') {
                       var dataTypes = getParamsItem(baseUrl, 'com')
                       localStorage.setItem(k + dataTypes, finaData)
                   } else if (k == 'getKeywords') {
                       if (baseUrl.indexOf("topType=trade") != -1) {
                           var dataTypes = getParamsItem(baseUrl, 'only')
                           localStorage.setItem(k + dataTypes, finaData)
                       }
                   } else if (k == 'monitResource') {
                       var dataTypes = getParamsItem(baseUrl, 'com')
                       localStorage.setItem(k + dataTypes, finaData)
                       // 获取ids
                       dataWrapper[k].ids = getItemId(baseUrl, 'url')
                   } else if (k == 'hotsale' || k == 'hotsearch' || k == 'hotpurpose') {
                       var dataTypes = getParamsItem(baseUrl, 'passCateid')
                       var rankKey = marketRankType(baseUrl)
                       var saveData = bubbleSort(finaData)
                       localStorage.setItem(rankKey + '/' + k + dataTypes, saveData)
                   } else if (k == 'allTrend') {
                       var rankKey = marketRankType(baseUrl)
                       var dataTypes = getParamsItem(baseUrl, 'trend', rankKey)
                       localStorage.setItem(rankKey + '/' + k + dataTypes, finaData)
                   } else if (k == 'trendShop') {
                       var rankKey = marketRankType(baseUrl)
                       var dataTypes = getParamsItem(baseUrl, 'trendShopInfo', rankKey)
                       localStorage.setItem(rankKey + '/' + k + dataTypes, finaData)
                   } else if (k == 'currentDate') {
                       localStorage.setItem(k, JSON.stringify(finaData.data))
                   } else if (k == 'publicInfo') {
                       var publicFont = JSON.parse(finaData);
                       var localId = publicFont ? publicFont[0] : '';
                       var saveId = localId.cateId.value;
                       localStorage.setItem('shopCateId', saveId)
                   } else {
                       var dataTypes = getParamsItem(baseUrl)
                       localStorage.setItem(k + dataTypes, finaData)
                   }
               }
           }
       }
   }
   function getParamsItem(para, com, trend) {
       var keyObj = {}
       var key = ''
       if (!para) {
           return ''
       }
       var params = para.split("?")[1]
       var paraArr = params.split('&');
       paraArr.forEach(function (item) {
           var itemArr = item.split('=')
           keyObj[itemArr[0]] = itemArr[1]
       })
       if (com != 'passCateid' && com != 'trend') {
           keyObj['cateId'] ? localStorage.setItem('shopCateId', keyObj['cateId']) : '';
       }
       keyObj['dateRange'] = keyObj['dateRange'] ? decodeURIComponent(keyObj['dateRange']) : '';
       if (com == 'com') {
           var item1 = keyObj['rivalItem1Id'] ? ('&rivalItem1Id=' + keyObj['rivalItem1Id']) : '';
           var item2 = keyObj['rivalItem2Id'] ? ('&rivalItem2Id=' + keyObj['rivalItem2Id']) : '';
           var self = keyObj['selfItemId'] ? ('&selfItemId=' + keyObj['selfItemId']) : '';
           key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + item1 + item2 + self
       } else if (com == 'only') {
           key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&itemId=' + keyObj['itemId']
       } else if (com == 'trendShopInfo') {
           var choosId = trend == 'item' ? 'itemId' : trend == 'shop' ? 'userId' : 'brandId'
           key += 'cateId=' + keyObj['firstCateId'] + '&userId=' + keyObj[choosId]
       } else if (com == 'trend') {
           var choosId = trend == 'item' ? 'itemId' : trend == 'shop' ? 'userId' : 'brandId'
           key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&sellerType=' + keyObj['sellerType'] + '&userId=' + keyObj[choosId]
       } else {
           key += 'cateId=' + keyObj['cateId'] + '&dateRange=' + keyObj['dateRange'] + '&dateType=' + keyObj['dateType'] + '&device=' + keyObj['device'] + '&page=' + keyObj['page'] + '&pageSize=' + keyObj['pageSize'] + '&sellerType=' + keyObj['sellerType']
       }
       return key
   }
   /**市场-监控看板-行业监控 */
   function marketRankType(url) {
       var res = ''
       if (url.match('item')) {
           res = 'item'
       } else if (url.match('shop')) {
           res = 'shop'
       } else if (url.match('brand')) {
           res = 'brand'
       }
       return res
   }
   // 数据排序
   function bubbleSort(data) {
       if (!data) {
           return ''
       }
       var arr = JSON.parse(data)
       var len = arr.length;
       for (var i = 0; i < len; i++) {
           for (var j = 0; j < len - 1 - i; j++) {
               if (arr[j].cateRankId.value > arr[j + 1].cateRankId.value) {
                   var temp = arr[j]
                   arr[j] = arr[j + 1]
                   arr[j + 1] = temp
               }
           }
       }
       return JSON.stringify(arr);
   }
   function Decrypt(word) {
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