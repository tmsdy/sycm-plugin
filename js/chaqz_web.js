var CHAQZ_VERSION = "";
$(function () {
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
    setTimeout(function () {
        chrome.runtime.sendMessage({
            key: 'getData',
            options: {
                url: 'http://116.62.18.166:8090/api/v1/plugin/getConfig',
                type: 'GET'
            }
        }, function (res) {
            if (res.code == 200) {
                CHAQZ_VERSION = res.data.version
                // var cssurl = res.data.css.main
                var jsurl = res.data.js.web_script
                loadCDNJs(jsurl);
                // loadCDNCss(cssurl);
            }
        });
    }, 500);
})