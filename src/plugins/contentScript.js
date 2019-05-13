import {
    BASE_URL
} from '../common/constState';
window.CHAQZ_VERSION = "1.0.7";
// $(function () {
    // 获取线上资源
    function loadCDNCss(cssUrl) {
        chrome.runtime.sendMessage({
            key: 'getData',
                options: {
                    url: cssUrl,
                    type: 'GET'
                }
        }, function (res2) {
            if (res2) {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.rel = 'stylesheet';
                //for Chrome Firefox Opera Safari
                style.appendChild(document.createTextNode(res2));
                //for IE
                //style.styleSheet.cssText = res2;
                var head = document.getElementsByTagName('head')[0];
                head.appendChild(style);
            }
        });
    }

    function loadCDNJs(jsUrl) {
        chrome.runtime.sendMessage({
           key: 'getData',
            options: {
                url: jsUrl,
                type: 'GET'
            }
        }, function (cdnJS) {
            eval(cdnJS);
        })
    }
    // setTimeout(function () {
        chrome.runtime.sendMessage({
            key: 'getData',
            options:{
                url: BASE_URL +'/api/v1/plugin/getConfig',
                type:'GET'
            }
        }, function (res) {
            if (res.code == 200) {
                CHAQZ_VERSION = res.data.version
                var cssurl = res.data.css.main
                var jsurl = res.data.js
                loadCDNCss(cssurl);
                for(var k in jsurl){
                    if(k != 'web_script'){
                        loadCDNJs(jsurl[k])
                    }
                }
            }
        });
    // }, 500);
// })