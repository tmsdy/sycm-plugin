console.log("taobao 交易管理");
$(function () {
    var haset = true;
    $('#page').on('DOMNodeInserted', function (e) {
        console.log(e.target.id, ',', e.target.className)
        if (e.target.className == 'ww-inline ww-online') {
            if (haset) {
                $('.item-mod__trade-order___2LnGB .buyer-mod__buyer___3NRwJ').parent().append('<button>11</button>');
                haset = false
            }

        }
    })
    $(document).on('click', '#sold_container .pagination li', function () {
        haset = true;
    })
})