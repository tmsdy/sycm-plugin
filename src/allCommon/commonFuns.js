 // tushi
 export function popTip(text, options) {
   var st = '';
   var tm = 500;
   if (options) {
     st = options ? options.style : '';
     tm = options ? options.time : tm;
   }
   $('body').append('<div class="small-alert" style="' + st + '">' + text + '</div>');
   setTimeout(function () {
     $('body .small-alert').fadeOut(300, function () {
       $('body .small-alert').remove();
     })
   }, tm)
 }
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