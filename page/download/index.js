$(function(){
    isShowTip();
    function download() {
        var sys = checkSystem().toLowerCase();
        if (sys.indexOf('ios') !== -1) {
            //window.location.href = "/credit-user/guide";
            window.location.href = "../guide/index.html";
        } else {
            //window.location.href = 'http://cyj.res.buyem.cn/app/smallqb.apk';
            window.location.href = "https://zttech-cyj-plus-app.oss-cn-beijing.aliyuncs.com/android/cyj_plus.apk";
        }
    }

    function checkSystem() {
        var u = window.navigator.userAgent;
        var ua = navigator.userAgent.toLowerCase();
        var isAndriod = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isWx = false;
        var isQq = false;
        var isAndriodQq = false;
        if (u.match(/MicroMessenger/i)) {
            isWx = u.match(/MicroMessenger/i).toString() == 'MicroMessenger'
        }
        if (u.match(/QQ/i)) {
            isQq = u.match(/QQ/i).toString() == 'QQ';
        }
        
        if (/MQQBrowser/i.test(navigator.userAgent) && /\sQQ/i.test((navigator.userAgent).split('MQQBrowser'))) {
            isAndriodQq = true;
        }
       
        if (isWx || isQq) {
            if (isAndriod) {
                if ((isQq && isAndriodQq) || isWx) {
                    return 'wxandriod'
                } else {
                    return 'andriod'
                }
            } else if (isIos) {
                return 'wxios'
            }
        } else {
            if (isAndriod) {
                return 'andriod'
            } else if (isIos) {
                return 'ios'
            }
        }
    }

    $('.download-btn').on('click',function(){
        download();
    })

    function isShowTip() {
        var sys = checkSystem().toLowerCase();
        if (sys === 'wxandriod') {
            $('.download-tip').css('display', 'block');
            $('.tip-img').attr('src', "./image/android.png")
        } else if (sys === 'wxios') {
            $('.download-tip').css('display', 'block');
            $('.tip-img').attr('src', "./image/ios.png")
        }
    }
})