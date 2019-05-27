   window.orginInterceptData = [];
  window.orginStartFuns = function (event) {
      orginInterceptData.push(event.detail);
  }
  // 在页面上插入代码
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.extension.getURL('js/interceptRquest.js'));
  document.documentElement.appendChild(script);