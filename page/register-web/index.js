$(function () {
    var code = getUrlVal('code') || getUrlVal('code') === 0 ? getUrlVal('code') :'';
    
    var location = {};
    window.addEventListener('message', function(event) {
        // 接收位置信息
        var loc = event.data;
        var osType = checkSystem();
        console.log('location', loc);
        if (loc) {
            location = {
                osType: osType,
                lng: loc.lng,
                lat: loc.lat,
                province: loc.province,
                city: loc.city,
                district: loc.district,
                addr: loc.addr,
            }
        }
        
    }, false);
    
    //保存渠道
    
    httpPostForm( api.channelAccessSave,{
        code:code,
        lat: location.lat ? location.lat : 0,
        lng: location.lng ? location.lng : 0,
    },
        function success(result){
            console.log(result);
        },
        function complete(xhr, status) {
            
        },
        function error(xhr, type){
            
        }
    )
    
    var $codeBtn = $("#btn-get-code");
    $('.phone').on('input', function (e) {
        var regPhone = /1[3-9]\d{9}/g;
        var userInput = e.srcElement.value;
        if (regPhone.test(userInput)) {
            $codeBtn.addClass("active");
        } else {
            $codeBtn.removeClass("active");
        }
    });
   
    $('.getCodeBtn').on('click', function () {
        var userPhone = $('.phone').val().trim();
        var regPhone = /1[3-9]\d{9}/g;
        if (!regPhone.test(userPhone)) {
            $(document).dialog({
                type : 'notice',
                infoText: '请输入正确的手机号码',
                autoClose: 1500,
                position: 'center'  
            });
            $codeBtn.addClass("disabled");
            return false
        } else {
            //是否注册过
            var that = this;
            var toast = null;
            var toastShow = true;
            setTimeout(function(){
                if (toastShow) {
                    toast = $(document).dialog({
                        type : 'toast',
                        infoIcon: '../../public/image/icon/loading.gif',
                        infoText: '正在处理',
                    });
                }
            },500);
            httpGet( api.isRegister,{mobile:userPhone},
                function success(result){
                    console.log(result);
                    if (result.data.isRegister == 0) {
                        sendCaptcha(userPhone,that)
                        $codeBtn.removeClass("disabled");
                    } else {
                        $(document).dialog({
                            type : 'confirm',
                            closeBtnShow: true,
                            content: '此号已注册，你可以马上下载APP体验。',
                            onClickConfirmBtn: function(){
                                download();
                            },
                            onClickCancelBtn : function(){
                            },
                            onClickCloseBtn  : function(){
                            }
                        });
                    }
                    toastShow = false;
                },
                function complete(xhr, status) {
                    if (toast){
                        toast.update({
                            infoIcon: '../../public/image/icon/loading.gif',
                            infoText: '正在处理',
                            autoClose: 1,
                        });
                    }
                },
                function error(xhr, type){
                    toastShow = false;
                    if (toast){
                        toast.update({
                            infoIcon: '../../public/image/icon/loading.gif',
                            infoText: '正在处理',
                            autoClose: 1,
                        });
                    }
                    $(document).dialog({
                        type : 'notice',
                        infoText: xhr.message ? xhr.message : '服务异常',
                        autoClose: 1500,
                        position: 'center'  
                    });
                    
                }
            )
            
            
        }
    });
    
    function sendCaptcha (userPhone,that){//获取验证码
        var thatt = that;
        httpPostForm( api.sendCaptcha,{mobile: userPhone, type: 1},
            function success(result){
                console.log(result);
                $(document).dialog({
                    type : 'notice',
                    infoText: '发送成功',
                    autoClose: 1500,
                    position: 'center'  
                });
                settime(thatt);
            },
            function complete(xhr, status) {
                
            },
            function error(xhr, type){
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '服务异常',
                    autoClose: 1500,
                    position: 'center'  
                });
            }
        )
    }
    $('.confirm-btn').on('click', function () {
        var userPhone = $('.phone').val().trim();
        var usrCode = $('.code').val().trim();
        var usrPsw = $('.psw').val().trim();
        var regPhone = /1[3-9]\d{9}/g;
        var regCode = /\d{6}/g;
        var regPsw = /[a-zA-Z0-9]{6,16}$/g;
        if (!regPhone.test(userPhone)) {
            $(document).dialog({
                type : 'notice',
                infoText: '请输入正确的手机号码',
                autoClose: 1500,
                position: 'center'  
            });
            return false
        }
        if (!regCode.test(usrCode)) {
            $(document).dialog({
                type : 'notice',
                infoText: '请输入正确的验证码',
                autoClose: 1500,
                position: 'center'  
            });
            return false
        }
        if (!regPsw.test(usrPsw)) {
            $(document).dialog({
                type : 'notice',
                infoText: '请设置6~16位登录密码',
                autoClose: 1500,
                position: 'center'  
            });
            return false
        }

        var registerData1 = {
            "mobile": userPhone,
            "password": usrPsw,
            "verificationCode": usrCode,
            "accessType": 1,
            "code": code,
        };
        var registerData = $.extend(registerData1,location);
        console.log('registerData',registerData)
        registerDo(registerData);
    });

    function registerDo (registerData) {//注册
        var toast = null;
        var toastShow = true;
        setTimeout(function(){
            if (toastShow) {
                toast = $(document).dialog({
                    type : 'toast',
                    infoIcon: '../../public/image/icon/loading.gif',
                    infoText: '正在处理',
                });
            }
        },500);
        httpPostForm( api.register,registerData,
            function success(result){
                console.log(result);
                toastShow = false;
                $(document).dialog({
                    type : 'notice',
                    infoText: '注册成功',
                    autoClose: 1500,
                    position: 'center'  
                });
                download();
            },
            function complete(xhr, status) {
                if (toast){
                    toast.update({
                        infoIcon: '../../public/image/icon/loading.gif',
                        infoText: '正在处理',
                        autoClose: 1,
                    });
                }
            },
            function error(xhr, type){
                toastShow = false;
                $(document).dialog({
                    type : 'notice',
                    infoText: xhr.message ? xhr.message : '服务异常',
                    autoClose: 1500,
                    position: 'center'  
                });
            }
        )
    }

   

    function download() {
        var sys = checkSystem().toLowerCase();
        if (sys === 'wx' || sys === 'qq') {
            window.location.href = "../download/index.html";
        } else if (sys === 'ios') {
            //window.location.href = "/credit-user/guide";
            window.location.href = "../guide/index.html";
        } else {
            //window.location.href = 'http://cyj.res.buyem.cn/app/smallqb.apk';
            window.location.href = "https://zttech-cyj-plus-app.oss-cn-beijing.aliyuncs.com/android/cyj_plus.apk";
        }
    }

    function checkSystem() {
        var u = navigator.userAgent;
        var isAndriod = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        var isWx = false;
        var isQq = false;
        if (u.match(/MicroMessenger/i)) {
            isWx = u.match(/MicroMessenger/i).toString() == 'MicroMessenger'
        }
        
        if (u.match(/QQ/i)) {
            isQq = u.match(/QQ/i).toString() == 'QQ';
        }

        if (isWx) {
            return 'wx'
        } else if (isQq) {
            return 'qq'
        } else {
            if (isAndriod) {
                return 'andriod'
            } else if (isIos) {
                return 'ios'
            }
        }
    }


    //定义一个60秒计时器变量
    var countdown = 60;
    //倒计时函数
    function settime(obj) {
        //开始判断倒计时是否为0
        if (countdown == 0) {
            obj.removeAttribute("disabled");
            obj.value = "获取验证码";
            countdown = 60;
            //立即跳出settime函数，不再执行函数后边的步骤
            return;
        } else {
            obj.setAttribute("disabled", true);
            obj.value = "重新发送(" + countdown + ")";
            countdown--;
        }
        //过1秒后执行倒计时函数
        setTimeout(function () {
            settime(obj);
        }, 1000)
    }

    $("input").blur(function() {
        window.scrollTo(0, 0);
    });
})