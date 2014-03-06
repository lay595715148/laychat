$(document).ready(function() {
    var blankh = $(window).height() - $('header').height() - $('.main').height() - $('footer').height();
    $(window).resize(function() {
        blankh = $(window).height() - $('header').height() - $('.main').height() - $('footer').height();
        if(blankh > 0) {
            $('body').css('padding-top', Math.floor(blankh / 2));
        } else {
            $('body').css('padding-top', 0);
        }
    });
    if(blankh > 0) {
        $('body').css('padding-top', Math.floor(blankh / 2));
    } else {
        $('body').css('padding-top', 0);
    }
    $('.main').css({
        'background-color' : 'rgb(249, 221, 200)',
        'background-image' : 'url(http://mimg.127.net/index/163/themes/140127_yixin2_bg2.jpg)',
        'background-position' : '0% 0%',
        'background-repeat' : 'repeat no-repeat'
    });
    $('.main-inner').css({
        'background-image' : 'url(http://mimg.127.net/index/163/themes/140127_yixin2_cnt2.jpg)',
        'background-position' : '50% 0%',
        'background-repeat' : 'no-repeat no-repeat'
    });
    
    $('.login-button').button();
});
