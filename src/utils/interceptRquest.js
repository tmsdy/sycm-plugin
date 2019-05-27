var ajax_interceptor_qoweifjqon = {
    originalXHR: window.XMLHttpRequest,
    myXHR: function () {
        var xhr = new ajax_interceptor_qoweifjqon.originalXHR;
        for (let attr in xhr) {
            if (attr === 'onreadystatechange') {
                xhr.onreadystatechange = (...args) => {
                    if (this.readyState == 4) {
                        // 请求成功
                        // if (args.currentTarget && args.currentTarget.responseURL.match(/this_url/)) {
                            // console.log('onreadystatechange', args)
                            // console.log('onreadystatechange-responseText-response', xhr)
                        // }
                    }
                    this.onreadystatechange && this.onreadystatechange.apply(this, args);
                }
                continue;
            } else if (attr === 'onload') {
                xhr.onload = (...args) => {
                    window.dispatchEvent(new CustomEvent("pageScript", {
                        detail: {
                            url: [xhr.responseURL],
                            data: xhr.response,
                            type: 'xhr'
                        }
                    }));
                }
                continue;
            }
            if (typeof xhr[attr] === 'function') {
                this[attr] = xhr[attr].bind(xhr);
            } else {
                // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
                if (attr === 'responseText' || attr === 'response') {
                    Object.defineProperty(this, attr, {
                        get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
                        set: (val) => this[`_${attr}`] = val,
                        enumerable: true
                    });
                } else {
                    Object.defineProperty(this, attr, {
                        get: () => xhr[attr],
                        set: (val) => xhr[attr] = val,
                        enumerable: true
                    });
                }
            }
        }
    },

    originalFetch: window.fetch.bind(window),
    myFetch: function (...args) {
        var myajax = ajax_interceptor_qoweifjqon.originalFetch(...args)
            .then(function (response) {
                new Promise((resolve,reject)=>{
                    resolve(response.clone().json())
                }).then((data)=>{
                    window.dispatchEvent(new CustomEvent("pageScript", {
                        detail: {
                            url: args,
                            data: data
                        }
                    }));
                })
                return response;
            })
        return myajax
    },
}
window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR;
window.fetch = ajax_interceptor_qoweifjqon.myFetch;