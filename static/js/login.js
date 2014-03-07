$(document).ready(function() {
    /**
     * 用户名和密码输入框获得和失去焦点逻辑
     */
    var uinput = $('.login-form input[name="username"]');
    var pinput = $('.login-form input[name="password"]');
    var rawlabelu = uinput.parent().children('label').html();
    var rawlabelp = pinput.parent().children('label').html();
    uinput.on('focus', function(el) {
        uinput.parent().children('label').html('');
    }).on('blur', function() {
        if(!uinput.val()) {
            uinput.parent().children('label').html(rawlabelu);
        }
    });
    pinput.on('focus', function(el) {
        pinput.parent().children('label').html('');
    }).on('blur', function() {
        if(!pinput.val()) {
            pinput.parent().children('label').html(rawlabelp);
        }
    });
    if(pinput.val()) {
        pinput.parent().children('label').html('');
    }
    if(uinput.val()) {
        uinput.parent().children('label').html('');
        pinput.focus();
    } else {
        uinput.focus();
    }
});
