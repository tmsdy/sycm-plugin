$(document).on('click', '#parsing',function(){
  messageSends('parsing')
})
$(document).on('click', '#userBtn', function () {
  messageSends('userBtn')
})
$(document).on('click', '#weightParsing', function () {
  messageSends('weightParsing')
})
$(document).on('click', '#goRootWord', function () {
  messageSends('goRootWord')
})
function messageSends(type){
  // var testReg = 'sycm.taobao.com/custom/login.htm';
  var testLogin = 'sycm.taobao.com';
     chrome.tabs.query({
       active: true,
       currentWindow: true
     }, function (tabs) {
       console.log(tabs)
       var isCould = tabs[0].url.indexOf(testLogin);
        if (isCould != -1) {
          chrome.tabs.sendMessage(tabs[0].id, {type:type}, function (response) {
            // if (callback) callback(response);
          });
        } else {
          window.open('https://sycm.taobao.com/custom/login.htm', 'blank')
        }
      
     });
    // chrome.tabs.sendMessage(rootWordRemId, {
    //   type: type,
    // }, function (res) {

    // })
 
}