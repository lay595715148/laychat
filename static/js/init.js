var socket = io.connect('http://localhost:8132/');
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
});