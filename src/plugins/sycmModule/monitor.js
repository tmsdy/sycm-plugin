import {dealIndex} from '../../common/dealIndex'
import {
    BASE_URL
} from '../../common/constState'
 import {
     formula,
     computedPayByr,
     getSearchParams,
     delePoint,
     operatcPmpareData,
     getProductInfo,
     getproduceIds
 } from '../../common/commonFuns'
 import {
     LoadingPop,
     popTip,
     popUp,
     isNewVersion,
     LogOut
 } from '../../common/promptClass'
var tableInstance = null; //table实例对象
var echartsInstance = null; //echarts实例对象   
var PLAN_LIST = [];
 //竞争模块table
      function domStruct(data, title) {
          var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
          var wrapper = '<div class="chaqz-wrapper"><div class="content"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span></div></div>'
          $('#app').append(wrapper)
          $('#chaqz-table').DataTable({
              data: data.data,
              columns: data.cols,
              language: {
                  "paginate": {
                      "next": "&gt;",
                      "previous": "&lt;"
                  },
                  "sEmptyTable": '获取数据失败，请刷新界面'
              },
              searching: false,
              ordering: false,
              info: false,
              dom: 'Bfrtip',
              buttons: [{
                      extend: 'csv',
                      title: title,
                      'bom': true,
                  },
                  {
                      extend: 'copy',
                      exportOptions: {
                          modifier: {
                              page: 'current'
                          }
                      }
                  }
              ]
          });
      }
      //市场模块table
      function domStructMark(data, title, type) {
          var curTime = $('.ebase-FaCommonFilter__top .oui-date-picker-current-date').text()
          var isSmall = type == 2 ? 'small' : ''
          var wrapper = '<div class="chaqz-wrapper"><div class="content ' + isSmall + '"><div class="cha-box"><div class="head"><div class="title"><span class="chaqz-table-title">' + title + '</span><span class="time">' + curTime + '</span></div></div><div class="table-box"><table id="chaqz-table" style="width:100%"></table></div></div><span class="chaqz-close">×</span><div class="chaqz-mask"><span class="loader"></span></div></div></div>'
          $('#app').append(wrapper)
          tableInstance = $('#chaqz-table').DataTable({
              data: data.data,
              destroy: true,
              columns: data.cols,
              language: {
                  "paginate": {
                      "next": "&gt;",
                      "previous": "&lt;"
                  },
                  "sEmptyTable": '获取数据失败，请刷新界面'
              },
              pageLength: data.paging.pageSize,
              searching: false,
              ordering: false,
              info: false,
              dom: 'Bfrtip',
              buttons: [{
                      extend: 'csv',
                      title: title,
                      'bom': true,
                      exportOptions: {
                          modifier: {
                              page: 'current'
                          }
                      }
                  },
                  {
                      extend: 'copy',
                      exportOptions: {
                          modifier: {
                              page: 'current'
                          }
                      }
                  }
              ]
          });
          if (data.paging.page) {
              tableInstance.page(Number(data.paging.page) - 1).draw(false)
          };
          tableInstance.on('page.dt', function (e, x, y) {
              var timer = null;
              var hasCount = 0;
              var info = tableInstance.page.info();
              if (type == 1) {
                  $('.chaqz-wrapper .chaqz-mask').show(100)
                  $('.mc-marketMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
                  var titleType = title == '监控店铺' ? 'marketShop' : 'monitFood'
                  var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize)
                  var localCacheKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize, 'local');
                  var hasSave = localStorage.getItem(localKey);
                  var localSave = localStorage.getItem(localCacheKey);
                 if (!(hasSave || localSave)) {
                     timer = setInterval(function () {
                         hasSave = localStorage.getItem(localKey);
                         localSave = localStorage.getItem(localCacheKey);
                         if (hasSave || localSave) {
                             marketMonitorShop();
                             clearInterval(timer);
                             timer = null;
                             hasCount = 0;
                         } else if (hasCount > 10) {
                             clearInterval(timer);
                             timer = null;
                             hasCount = 0;
                             popTip('获取数据失败！');
                             LoadingPop();
                         } else {
                             hasCount++
                         }
                     }, 200);
                 } else {
                     marketMonitorShop()
                 }
              } else if (type == 2) {
                  $('.chaqz-wrapper .chaqz-mask').show(100)
                  $('.op-mc-market-monitor-industryCard .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
                  var titleType = title == '热门店铺' ? 'marketHotShop' : 'marketHotFood'
                  var localKey = getSearchParams(titleType, (info.page + 1), data.paging.pageSize)
                  var hasSave = localStorage.getItem(localKey)
                 if (!(hasSave || localSave)) {
                     timer = setInterval(function () {
                         hasSave = localStorage.getItem(localKey);
                         localSave = localStorage.getItem(localCacheKey);
                         if (hasSave || localSave) {
                             marketMonitorItem();
                             clearInterval(timer);
                             timer = null;
                             hasCount = 0;
                         } else if (hasCount > 10) {
                             clearInterval(timer);
                             timer = null;
                             hasCount = 0;
                             popTip('获取数据失败！');
                             LoadingPop();
                         } else {
                             hasCount++
                         }

                     }, 200);
                 } else {
                     marketMonitorItem()
                 }
              } else if (type == 3) {
                  $('.chaqz-wrapper .chaqz-mask').show(100)
                  $('#mqItemMonitor .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
                  var localKey = getSearchParams('monitFood', (info.page + 1), data.paging.pageSize)
                  var localCacheKey = getSearchParams('monitFood', (info.page + 1), data.paging.pageSize,'local')
                  var hasSave = localStorage.getItem(localKey);
                  var localSave = localStorage.getItem(localCacheKey);
                 if (!(hasSave || localSave)) {
                     timer = setInterval(() => {
                         hasSave = localStorage.getItem(localKey);
                         localSave = localStorage.getItem(localCacheKey);
                         if (hasSave || localSave) {
                             MonitorItem();
                             clearInterval(timer);
                             timer = null;
                             hasCount = 0;
                         } else if (hasCount > 10) {
                             clearInterval(timer);
                             timer = null;
                             hasCount = 0;
                             popTip('获取数据失败！');
                             LoadingPop();
                         } else {
                             hasCount++
                         }
                     }, 200);
                 } else {
                     MonitorItem();
                 }
              } else if (type == 4) {
                  $('.chaqz-wrapper .chaqz-mask').show(100)
                  $('.op-mc-market-rank-container .ant-pagination .ant-pagination-item-' + (info.page + 1)).click()
                  marketRank()
              }
          })
          $('.chaqz-wrapper').fadeIn(100);
      }
         //竞争-监控店铺
         $(document).on('click', '.mc-shopMonitor #search', function () {
             if (!isNewVersion()) {
                 return false
             }
             shopTable()

         });
         //竞争-监控商品
         $(document).on('click', '.mc-ItemMonitor #search', function () {
             if (!isNewVersion()) {
                 return false
             }
             MonitorItem('page')
         });
         //竞争-分析竞品
         $(document).on('click', '#itemAnalysisTrend .oui-card-header #search', function () {
             if (!isNewVersion()) {
                 return false
             }
             compareItem()
         });
         //竞争-分析竞品-入口来源
         $(document).on('click', '#sycm-mc-flow-analysis .oui-card-header #search', function () {
             if (!isNewVersion()) {
                 return false
             }
             compareResource()
         })
         $(document).on('click', '.chaqz-close', function () {
             $('.chaqz-wrapper .content').removeClass('small')
             $('.chaqz-wrapper').remove()
             tableInstance = null;
             echartsInstance = null;
         })
         //竞争-分析竞品一键加权
         $(document).on('click', '#vesting', function () {
             var reg = /https:\/\/sycm\.taobao\.com\/mc\/ci\/item\/analysis/;
             var currentUrl = window.location.href
             var matchUrl = reg.test(currentUrl)
             if (!matchUrl) { // 判断是否为精品分析页面
                 popUp.init('goChoose')
                 return false
             }
             if (!isNewVersion()) {
                 return false
             }
             var prodctv = getProductInfo()
            if (prodctv.rivalItem1.title && prodctv.rivalItem2.title) {
                popUp.init('onlyOne')
                return false
            }
            if (!prodctv.rivalItem1.title && !prodctv.rivalItem2.title) {
                popUp.init('emptyChoose')
                return false
            }
             var saveToke = localStorage.getItem('chaqz_token')
             chrome.runtime.sendMessage({
                 key: 'getData',
                 options: {
                     url: BASE_URL + '/api/v1/plugin/planData',
                     type: "GET",
                     headers: {
                         Authorization: "Bearer " + saveToke
                     }
                 },
             }, function (val) {
                 if (val.code == 200) {
                     popUp.init("selectPlan", val.data)
                     PLAN_LIST = val.data
                 } else if (val.code == 4001) {
                     popUp.init("selectPlan")
                 } else if (val.code == 2030) {
                     LogOut()
                 } else {
                     popTip('获取计划列表失败，请重试')
                 }
             })
         })
         $(document).on('click', '.chaqz-info-wrapper.pop .hides', function () {
             //c创建计划弹窗
             var hidePlan = $('.chaqz-info-wrapper.pop').find('#giveupPlan')
             if (hidePlan.length) {
                 popUp.init("selectPlan", PLAN_LIST)
                 return false
             }
             $('.chaqz-info-wrapper.pop').hide()
         })
         $(document).on('click', '.chaqz-info-wrapper.pop .planBtn', function () { //生成计划
             var planName = $('.chaqz-info-wrapper.pop .editor').val();
             var purpose = $('.chaqz-info-wrapper.pop .selcet').val();
             var hasCreatePlan = PLAN_LIST
             var isExist = vestingFuns.checkRepeat(PLAN_LIST, planName)
             if (!planName || !purpose) {
                 popTip('请填写计划')
                 return false
             }
             if (isExist) {
                 popTip('计划名已存在')
                 return false
             }
             var saveToke = localStorage.getItem('chaqz_token')
             chrome.runtime.sendMessage({
                 key: 'getData',
                 options: {
                     url: BASE_URL + '/api/v1/plugin/planData',
                     type: "POST",
                     headers: {
                         Authorization: "Bearer " + saveToke
                     },
                     contentType: "application/json,charset=utf-8",
                     data: JSON.stringify({
                         "title": planName,
                         "type": 1,
                     })
                 }
             }, function (val) {
                 if (val.code == 200) {
                     hasCreatePlan.unshift(val.data)
                     popUp.init("selectPlan", hasCreatePlan)
                 } else if (val.code == 2030) {
                     LogOut()
                 } else {
                     popTip('计划生成失败！')
                 }
             })
         })
         $(document).on('click', '.chaqz-info-wrapper.pop #vestBtn', function () { //加权计划
             LoadingPop('show')
             var planName = $('.chaqz-info-wrapper.pop .form-list .selcet').val()
             var selectPlan = vestingFuns.chosePlan(PLAN_LIST, planName)
             if (planName == 0) {
                 LoadingPop()
                 popTip('请选择计划', 'top:10%;')
                 return false
             }
             var timer = null;
             var countNum = 0;
             $(".oui-date-picker .oui-canary-btn:contains('7天')").click()
             var prodctVes = getProductInfo()
             var idParams = getproduceIds(prodctVes, dataWrapper2)
             var localCache = false;
             var itemKey = getSearchParams('monitCompareFood').split('&page')[0] + idParams;
             var localKey = getSearchParams('monitCompareFood', 0, 0, 'local') + idParams;
             // 判断本地是否缓存
             if (localStorage.getItem(itemKey)) {
                 getDay(prodctVes, itemKey, selectPlan);
             } else if (localStorage.getItem(localKey)) {
                 localCache = true;
                 getDay(prodctVes, localKey, selectPlan, localCache);
             } else {
                 timer = setInterval(function () {
                     countNum++;
                     if (localStorage.getItem(itemKey)) {
                         clearInterval(timer)
                         timer = null;
                         getDay(prodctVes, itemKey, selectPlan)

                     } else if (countNum > 10) {
                         clearInterval(timer)
                         timer = null;
                         popTip('获取指数数据失败！', 'top:10%;')
                         LoadingPop()
                     }
                 }, 500)
             }
         })
        //  加权计划方法
          function getDay(prodctDay, key, planName,  localCache) {
              var timer = null;
              var countNum = 0;
              dealIndex({
                  type: 'monitCompareFood',
                  dataType: key,
                   localCache:  localCache
              }, function (res) {
                  $(".oui-date-picker .oui-canary-btn:contains('日')").click()
                  // 判断屏幕高度以及是否要滑动
                  var cltHeight = window.innerHeight;
                  var remianHei = 900 - cltHeight;
                  if (remianHei > 0) {
                      $(document).scrollTop(remianHei)
                  }
                  var wordsIds = getproduceIds(prodctDay, dataWrapper2, 'idObj')
                  var keyWrap = $('.op-mc-item-analysis #itemAnalysisKeyword')
                  if (!keyWrap.length) {
                      return false
                  }
                  $("#itemAnalysisKeyword .oui-tab-switch-item:contains('成交关键词')").click()
                  var wordsfontKey = getSearchParams('getKeywords', 1, 20).split('&page')[0];
                  var fontLocalKey = getSearchParams('getKeywords', 1, 20, 'local');
                  var itemWho = wordsIds.item1.itemId ? 'item1' : 'item2';
                  var dayParam = itemWho == 'item1' ? ('&itemId=' + wordsIds.item1.itemId) : ('&itemId=' + wordsIds.item2.itemId);
                  var dayKey = wordsfontKey + dayParam;
                  var localKey = fontLocalKey.replace('itemNum', dayParam)
                  if (localStorage.getItem(dayKey)) {
                      sendResponseData(wordsIds, itemWho, res, localStorage.getItem(dayKey), planName)
                  } else if (localStorage.getItem(localKey)) {
                      var keywordData = filterLocalData(localStorage.getItem(localKey));
                      sendResponseData(wordsIds, itemWho, res, keywordData, planName)
                  } else {
                      timer = setInterval(function () {
                          countNum++;
                          if (localStorage.getItem(dayKey)) {
                              clearInterval(timer)
                              timer = null;
                              sendResponseData(wordsIds, itemWho, res, localStorage.getItem(dayKey), planName)
                          } else if (countNum > 10) {
                              clearInterval(timer)
                              timer = null;
                              popTip('获取关键词失败！', 'top:10%;')
                              LoadingPop()
                          }
                      }, 500)
                  }
              })
          }

          function sendResponseData(wordsIds, itemWho, res, dayKey, planName) {
              var keywordsList = {}
              keywordsList.selfItem = wordsIds.self ? wordsIds.self : {};
              keywordsList.item = wordsIds[itemWho]
              var indexData = vestingFuns.filterData(res)
              if (indexData.count == 1) {
                  for (var k in indexData.item0) {
                      keywordsList.item[k] = indexData.item0[k]
                  }
              } else {
                  for (var k in indexData.item0) {
                      keywordsList.selfItem[k] = indexData.item0[k]
                  }
                  for (var j in indexData.item1) {
                      keywordsList.item[j] = indexData.item1[j]
                  }
              }
              keywordsList.keywords = vestingFuns.filterKeywords(JSON.parse(dayKey))
              keywordsList.plan_id = planName.plan_id
              keywordsList.plan_name = planName.title
              keywordsList.day = 7
              if (!keywordsList.keywords.length) {
                  chrome.storage.local.set({
                      'compareProduceData': keywordsList
                  }, function () {
                      $('.chaqz-info-wrapper.pop').fadeOut(100)
                      window.open(BASE_URL + '/privilgeEscala')
                  })
                  LoadingPop()
                  return false;
              }
              var saveToke = localStorage.getItem('chaqz_token')
              chrome.runtime.sendMessage({
                  key: 'getData',
                  options: {
                      url: BASE_URL + '/api/v1/plugin/planData',
                      type: "PUT",
                      headers: {
                          Authorization: "Bearer " + saveToke
                      },
                      contentType: "application/json,charset=utf-8",
                      data: JSON.stringify(keywordsList)
                  }
              }, function (val) {
                  if (val.code == 200) {
                      chrome.storage.local.set({
                          'compareProduceData': keywordsList
                      }, function () {
                          $('.chaqz-info-wrapper.pop').fadeOut(100)
                          window.open(BASE_URL + '/privilgeEscala')
                      })
                  } else if (val.code == 2030) {
                      LogOut()
                  } else {
                      popTip('上传数据失败请重试')
                  }
                  LoadingPop()
              })
          }
          var vestingFuns = {
              checkRepeat: function (data, name) {
                  //判断是否创建过的计划
                  if (!data) {
                      return false
                  }
                  var isHas = false
                  data.forEach(function (item) {
                      if (item.title == name) {
                          isHas = true
                      }
                  })
                  return isHas
              },
              filterKeywords: function (data) {
                  //关键词筛选
                  if (!data) {
                      return []
                  }
                  var resBox = []
                  data.forEach(function (item) {
                      if (item.tradeIndex.value > 100 && item.tradeIndex.value < 450) {
                          resBox.push(item.keyword.value)
                      }
                  })
                  return resBox
              },
              chosePlan: function (data, aim) {
                  //选择计划项
                  if (!data) {
                      return {}
                  }
                  for (var i = 0; i < data.length; i++) {
                      if (data[i].title == aim) {
                          return data[i]
                      }
                  }

              },
              filterData: function (data) {
                  var result = {
                      item0: {},
                      item1: {}
                  }
                  for (var key in data) {
                      var len = data.payRate.length
                      result.count = len
                      data[key].forEach(function (item, index) {
                          if (key == 'payRate') {
                              item = item ? item / 100 : ''
                          }
                          result['item' + index][key] = item ? item : ''
                      })
                  }
                  return result
              }
          }
 function shopTable(){
      dealIndex({
          type: 'monitShop'
      }, function (resData) {
          var cols = [
              {
                data: 'shop',
                title: '店铺信息',
                class: 'info',
                render: function (data, type, row, meta) {
                    return '<img src=\"' + data.url + '\"><span>' + data.title + '</span>';
                }
              },
              {
                  data: 'cate_cateRankId',
                  title: '行业排名',
              },
              {
                  data: 'tradeIndex',
                  title: '交易金额',
              },
              {
                  data: 'uvIndex',
                  title: '访客人数',
              },
              {
                  data: 'seIpv',
                  title: '搜索人数',
              },
              {
                  data: 'cltHit',
                  title: '收藏人数',
              },
              {
                  data: 'cartHit',
                  title: '加购人数',
              },
              {
                  data: 'payRate',
                  title: '支付转化率',
              },
              {
                  data: 'payByr',
                  title: '支付人数',
              },
              {
                  data: 'kdPrice',
                  title: '客单价',
              },
              {
                  data: 'uvPrice',
                  title: 'UV价值',
              },
              {
                  data: 'searRate',
                  title: '搜索占比',
              },
              {
                  data: 'scRate',
                  title: '收藏率',
              },
              {
                  data: 'jgRate',
                  title: '加购率',
              }
          ];
          domStruct({
              data: resData,
              cols: cols
          }, '监控店铺')
      }, dataWrapper2)
}
  // 监控商品
   function MonitorItem(pageType) {
       var curPage = $('.mc-ItemMonitor .ant-pagination .ant-pagination-item-active').attr('title');
       var curPageSize = $('.mc-ItemMonitor .oui-page-size .ant-select-selection-selected-value').text();
       curPageSize = Number(curPageSize);
       var localCache = false;
       var finalKey = '';
       var itemKey = getSearchParams('monitFood', curPage, curPageSize);
       var localKey = getSearchParams('monitFood', curPage, curPageSize, 'local')

       if (localStorage.getItem(itemKey)) {
           finalKey = itemKey;
       } else {
           finalKey = localKey;
           localCache = true;
       }
       // var itemKey = getLocalKey('monitFood', curPage, curPageSize)
       dealIndex({
                   type: 'monitFood',
                   dataType: finalKey,
                   localCache: localCache
      }, function (val) {
          var res = val.value
          var finaData = val.final.data
          var totalCont = val.final.recordCount
          var resData = []
          var length = res.payRate.length
          for (var i = 0; i < length; i++) {
              var trandeOver = res.tradeIndex[i] != '超出范围,请使用插件最高支持7.8亿' ? Math.round(res.tradeIndex[i]) : '-'
              var computedNum = computedPayByr(res.uvIndex[i], res.payRate[i], trandeOver)
              var obj = {
                  shop: {}
              }
              var cateRnkId = finaData[i].cateRankId
              obj.shop = {
                  title: finaData[i].item.title,
                  url: finaData[i].item.pictUrl
              }
              obj.cate_cateRankId = cateRnkId ? cateRnkId.value ? cateRnkId.value : '-' : '-'
              obj.tradeIndex = trandeOver
              obj.uvIndex = Math.round(res.uvIndex[i])
              obj.seIpv = Math.round(res.seIpv[i])
              obj.cltHit = Math.round(res.cltHit[i])
              obj.cartHit = Math.round(res.cartHit[i])
              obj.payRate = res.payRate[i].toFixed(2) + '%'
              obj.payByr = computedNum.res1
              obj.kdPrice = computedNum.res2
              obj.uvPrice = formula(trandeOver, res.uvIndex[i], 1)
              obj.searRate = formula(res.seIpv[i], res.uvIndex[i], 2)
              obj.scRate = formula(res.cltHit[i], res.uvIndex[i], 2)
              obj.jgRate = formula(res.cartHit[i], res.uvIndex[i], 2)
              resData.push(obj)
          }
          if (pageType) {
              if (totalCont > resData.length) {
                  var visualData = []
                  for (let i = 0; i < totalCont; i++) {
                      visualData.push(resData[0])
                  }
                  var vStart = visualData.slice(0, (curPage - 1) * curPageSize)
                  var vEndIndex = (curPage - 1) * curPageSize + curPageSize
                  var vEnd = vEndIndex < totalCont ? visualData.slice(vEndIndex) : []
                  resData = vStart.concat(resData, vEnd)
              }
              var choseItem = "监控商品"
              var cols = [{
                      data: 'shop',
                      title: '店铺信息',
                      class: 'info',
                      render: function (data, type, row, meta) {
                          return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                      }
                  },
                  {
                      data: 'cate_cateRankId',
                      title: '行业排名',
                  },
                  {
                      data: 'tradeIndex',
                      title: '交易金额',
                  },
                  {
                      data: 'uvIndex',
                      title: '访客人数',
                  },
                  {
                      data: 'seIpv',
                      title: '搜索人数',
                  },
                  {
                      data: 'cltHit',
                      title: '收藏人数',
                  }, {
                      data: 'cartHit',
                      title: '加购人数',
                  }, {
                      data: 'payRate',
                      title: '支付转化率',
                  }, {
                      data: 'payByr',
                      title: '支付人数',
                  }, {
                      data: 'kdPrice',
                      title: '客单价',
                  }, {
                      data: 'uvPrice',
                      title: 'UV价值',
                  }, {
                      data: 'searRate',
                      title: '搜索占比',
                  }, {
                      data: 'scRate',
                      title: '收藏率',
                  }, {
                      data: 'jgRate',
                      title: '加购率',
                  }
              ]
              domStructMark({
                  data: resData,
                  cols: cols,
                  paging: {
                      page: curPage,
                      pageSize: curPageSize
                  }
              }, choseItem, 3)
          } else {
              for (var j = 0; j < curPageSize; j++) {
                  tableInstance.row((curPage - 1) * curPageSize + j).data(resData[j])
              }
              $('.chaqz-wrapper .chaqz-mask').hide(100)
          }
      })
  }
 function compareResource() {
      var prodctRes = getProductInfo();
      if (prodctRes.totalNum < 2) {
          popTip('请选择比较商品');
          return false;
      };
      var idParams = getproduceIds(prodctRes, dataWrapper2);
      var localCache = false;
      var finalKey = '';
      var itemKey = getSearchParams('monitResource').split('&page')[0];
      var localKey = getSearchParams('monitResource', 0, 0, 'local')

      if (localStorage.getItem(itemKey + idParams)) {
          finalKey = itemKey + idParams;
      } else {
          finalKey = localKey + idParams;
          localCache = true;
      }
      dealIndex({
          type: 'monitResource',
          dataType: finalKey,
        localCache: localCache
      }, function (val) {
          var findRes = val.value
          var finaData = val.final
          var productId = dataWrapper2['monitResource'].ids
          var Length = findRes['selfItem']['payRate'].length
          var resData = []
          for (var i = 0; i < Length; i++) {
              var itemAcct = prodctRes.totalNum
              var wItem = itemAcct == 2 ? findRes['rivalItem1'] ? 'rivalItem1' : 'rivalItem2' : ''
              for (var j = 0; j < itemAcct; j++) {
                  var obj = {
                      shop: {}
                  }
                  obj.shop = {
                      url: j == 0 ? prodctRes.selfItem.imgurl : itemAcct == 3 ? prodctRes['rivalItem' + j].imgurl : prodctRes[wItem].imgurl,
                      title: j == 0 ? prodctRes.selfItem.title : itemAcct == 3 ? prodctRes['rivalItem' + j].title : prodctRes[wItem].title
                  }
                  obj.name = {}
                  obj.name = j == 0 ? {
                      name: '本店竞品',
                      class: ''
                  } : itemAcct == 3 ? {
                      name: ('竞品' + j),
                      class: 'red'
                  } : {
                      name: ('竞品' + wItem.slice(-1)),
                      class: 'red'
                  };
                  var selfId = j == 0 ? productId.selfItemId : itemAcct == 3 ? productId['rivalItem' + j + 'Id'] : productId[wItem + 'Id'];
                  obj.cateRank = selfId ? selfId : '-';
                  obj.pageName = finaData[i].pageName ? finaData[i].pageName.value : '-';
                  var tradeIndex = j == 0 ? findRes.selfItem.tradeIndex[i] : itemAcct == 3 ? findRes['rivalItem' + j].tradeIndex[i] : findRes[wItem].tradeIndex[i];
                  var payByr = j == 0 ? findRes.selfItem.payByr[i] : itemAcct == 3 ? findRes['rivalItem' + j].payByr[i] : findRes[wItem].payByr[i];
                  var uv = j == 0 ? findRes.selfItem.uvIndex[i] : itemAcct == 3 ? findRes['rivalItem' + j].uvIndex[i] : findRes[wItem].uvIndex[i];
                  var payRate = j == 0 ? findRes.selfItem.payRate[i] : itemAcct == 3 ? findRes['rivalItem' + j].payRate[i] : findRes[wItem].payRate[i];
                  obj.tradeIndex = Math.round(tradeIndex)
                  obj.uvIndex = uv ? Math.round(uv) : '-'
                  obj.payRate = (payRate*100).toFixed(2) + '%'
                  obj.payByr = Math.round(payByr)
                  obj.kdPrice = formula(delePoint(tradeIndex), delePoint(payByr), 1)
                  obj.uvPrice = formula(delePoint(tradeIndex), delePoint(uv), 1)
                  resData.push(obj)
              }
          }
          var cols = [{
                  data: 'name',
                  title: '类别',
                  render: function (data, type, row, meta) {
                      return '<p class="btn ' + data.class + '">' + data.name + '</p>';
                  }
              },
              {
                  data: 'shop',
                  title: '商品信息',
                  class: 'info',
                  render: function (data, type, row, meta) {
                      return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                  }
              },
              {
                  data: 'cateRank',
                  title: '商品ID',
              }, {
                  data: 'pageName',
                  title: '流量来源',
              }, {
                  data: 'tradeIndex',
                  title: '交易金额',
              },
              {
                  data: 'uvIndex',
                  title: '访客人数',
              },
              {
                  data: 'payRate',
                  title: '支付转化率',
              }, {
                  data: 'payByr',
                  title: '支付人数',
              }, {
                  data: 'kdPrice',
                  title: '客单价',
              }, {
                  data: 'uvPrice',
                  title: 'UV价值',
              },
          ]
          domStruct({
              data: resData,
              cols: cols
          }, '入店来源')

      }, dataWrapper2)
}
 function compareItem(){
      var prodctItem = getProductInfo();
      if (prodctItem.totalNum < 2) {
          popTip('请选择比较商品');
          return false
      };
      var idParams = getproduceIds(prodctItem, dataWrapper2);
       var localCache = false;
       var finalKey = '';
       var itemKey = getSearchParams('monitCompareFood').split('&page')[0];
       var localKey = getSearchParams('monitCompareFood', 0, 0, 'local')

       if (localStorage.getItem(itemKey + idParams)) {
           finalKey = itemKey + idParams;
       } else {
           finalKey = localKey + idParams;
           localCache = true;
       }
      dealIndex({
              type: 'monitCompareFood',
               dataType: finalKey,
                localCache: localCache
          },
          function (res) {
              var resData = []
              var length = prodctItem.totalNum
              for (var i = 0; i < length; i++) {
                  var obj = {
                      shop: {}
                  }
                  obj.shop = {
                      url: i == 0 ? prodctItem.selfItem.imgurl : prodctItem["rivalItem" + (i)].imgurl ? prodctItem["rivalItem" + (i)].imgurl : prodctItem["rivalItem" + (i + 1)].imgurl,
                      title: i == 0 ? prodctItem.selfItem.title : prodctItem["rivalItem" + (i)].title ? prodctItem["rivalItem" + (i)].title : prodctItem["rivalItem" + (i + 1)].title
                  }
                  obj.name = {}
                  obj.name = i == 0 ? {
                          name: '本店竞品',
                          class: ''
                      } :
                      prodctItem["rivalItem" + (i)].title ? {
                          name: ('竞品' + i),
                          class: 'red'
                      } : {
                          name: ('竞品' + (i + 1)),
                          class: 'red'
                      };
                  var rateNum = Number(res.payRate[i]);
                  var isNumber = isNaN(rateNum);
                  obj.tradeIndex = Math.round(res.tradeIndex[i]);
                  obj.uvIndex = Math.round(res.uvIndex[i]);
                  obj.payRate = !isNumber ? ((rateNum*100).toFixed(2) + '%') : "-";
                  obj.payByr = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num1;
                  obj.kdPrice = operatcPmpareData(res.uvIndex[i], res.payRate[i], res.tradeIndex[i]).num2;
                  obj.uvPrice = formula(res.tradeIndex[i], res.uvIndex[i], 1);
                  resData.push(obj)
              }
              if (resData.length > 2) {
                  resData.splice(2, 0, resData[0])
              }

              var cols = [{
                      data: 'name',
                      title: '类别',
                      render: function (data, type, row, meta) {
                          return '<p class="btn ' + data.class + '">' + data.name + '</p>';
                      }
                  },
                  {
                      data: 'shop',
                      title: '店铺信息',
                      class: 'info',
                      render: function (data, type, row, meta) {
                          return '<img src="' + data.url + '"><span>' + data.title + '</span>';
                      }
                  },
                  {
                      data: 'tradeIndex',
                      title: '交易金额',
                  },
                  {
                      data: 'uvIndex',
                      title: '访客人数',
                  },
                  {
                      data: 'payRate',
                      title: '支付转化率',
                  }, {
                      data: 'payByr',
                      title: '支付人数',
                  }, {
                      data: 'kdPrice',
                      title: '客单价',
                  }, {
                      data: 'uvPrice',
                      title: 'UV价值',
                  },
              ]
              domStruct({
                  data: resData,
                  cols: cols
              }, '关键词指标对比')
          })
}