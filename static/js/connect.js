/**
 * socket cnnect file
 */
$(document).ready(function() {
    /*var socket = io.connect('http://localhost:8132/');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    }).on('connect_failed', function(err) {
        console.log('err');
        console.log(err);
    }).on('disconnect', function() {
        console.log('disconnect');
    }).on('reconnecting', function() {
        console.log('reconnecting');
    });*/
    var chat = io.connect('http://localhost:8132/chat'),
        news = io.connect('http://localhost:8132/news');
    $.chat = chat,$.news = news;
  
    chat.on('connect', function () {
        chat.emit('hi!');
    }).on('receive', function(data) {
        if('undefined' != typeof console) 
            console.log(data);
        $.pnotify({
            title: "Fake Load",
            text: data,
            styling: 'jqueryui'
        });
    });
    news.on('news', function () {
        news.emit('woot');
    }).on('item', function(data) {
        alert('news > item');
        alert(data);
    });
});
