/**
 * socket cnnect file
 */
$(document).ready(function() {
    var checkReceiveData = function(data) {
        if('undefined' == typeof data.from) {
            return false;
        } else {
            
        }
        if('undefined' == typeof data.to) {
            return false;
        }
        if('undefined' == typeof data.content) {
            return false;
        }
        return true;
    };
    var connectChannel = function(id) {
        if($.chat) {
            $.chat = null;
            console.log('do connectChannel', id, $.chat);
        }
        var chat = io.connect('http://localhost:8133/channel_' + id, {'reconnect':false,'force new connection':true});
        chat.on('connect', function() {
            alert('connect channel connect');
            console.log('connect channel connect');
        }).on('list', function(data) {
            console.log('list');
            console.log(data);
        }).on('update', function(data) {
            console.log('update');
            console.log(data);
        }).on('receive', function(data) {
            if(checkReceiveData(data)) {
                chat.receiveMessage(data.saying);
            }
        }).on('disconnect', function() {
            console.log('connectChannel disconnect');
        }).on('reconnecting', function() {
            console.log('connectChannel reconnecting');
            //chat.disconnect();
        });
        
        chat.sendMessage = function(saying) {
            chat.emit('send', {from:'',to:'',content:saying});
            $.pnotify({
                title: "Send",
                text: saying,
                styling: 'jqueryui'
            });
        };
        chat.receiveMessage = function(saying) {
            $.pnotify({
                title: "Receive",
                text: saying,
                styling: 'jqueryui'
            });
        };
        
        $.chat = chat;
    };
    var beforeChannel = function() {
        var chat = io.connect('http://localhost:8133/channel');
        chat.on('connect', function (data) {
            alert('before channel connect');
            chat.emit('enter',{'channel':10001,'token':'2014'});
            console.log('before channel connect');
        }).on('entered', function(data) {
            console.log('entered',data);
            setTimeout(function() {connectChannel(data.channel);}, 1000);
        }).on('disconnect', function() {
            //$.chat.disconnect('unauthorized');
            console.log('beforeChannel disconnect');
        }).on('reconnecting', function() {
            //$.chat.disconnect('unauthorized');
            console.log('beforeChannel reconnecting');
        });
        //$.chat = chat;
    };
  
    beforeChannel();
});
