$(document).ready(function() {
    var uinput = $('.login-form input[name="username"]');
    var pinput = $('.login-form input[name="password"]');
    if(uinput.val()) {
        uinput.parent().child('label').html('');
    }
    if(pinput.val()) {
        pinput.parent().child('label').html('');
    }
    uinput.on('focus', function(el) {
        uinput.parent().children('label').html('');
    }).on('blur', function() {
        if(!uinput.val()) {
            uinput.parent().children('label').html('用户名');
        }
    });
    pinput.on('focus', function(el) {
        pinput.parent().children('label').html('');
    }).on('blur', function() {
        if(!pinput.val()) {
            pinput.parent().children('label').html('密码');
        }
    });
});
