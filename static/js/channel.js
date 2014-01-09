/**
 * socket cnnect file
 */
$(document).ready(function() {
    var checkReceiveData = function(data) {
        if('undefined' == typeof data.from) {
            return false;
        }
        if('undefined' == typeof data.to) {
            return false;
        }
        if('undefined' == typeof data.content) {
            return false;
        }
        return true;
    };
    var checkResponseData = function(data) {
        if('undefined' == typeof data.success) {
            return false;
        }
        if('undefined' == typeof data.action) {
            return false;
        }
        if('undefined' == typeof data.content) {
            return false;
        }
        return true;
    };
    var connectChannel = function(channelid) {
        if($.chat) {
            $.chat = null;
            if(typeof console !== 'undefined') console.log('do connectChannel', channelid, $.chat);
        }
        var chat = io.connect('http://localhost:8133/' + channelid);
        chat.on('connect', function() {
            alert('connect channel connect');
            if(typeof console !== 'undefined') console.log('connect channel connect');
            //chat.emit('login', {'token':'2014'});
            chat.emit('request', {'session':'XXXXXX','action':'login','content':{'token':'2014'}});
        }).on('list', function(data) {
            if(typeof console !== 'undefined') console.log('list');
            if(typeof console !== 'undefined') console.log(data);
        }).on('update', function(data) {
            if(typeof console !== 'undefined') console.log('update');
            if(typeof console !== 'undefined') console.log(data);
        }).on('receive', function(data) {
            if(checkReceiveData(data)) {
                chat.receiveMessage(data.content);
            }
        }).on('response', function(data) {
            if(checkResponseData(data)) {
                switch(data.action) {
                    case 'login':
                        if(typeof console !== 'undefined') console.log(data.content);
                        break;
                    case 'send':
                        chat.receiveMessage(data.content.content);
                        break;
                    case 'list':
                    case 'update':
                        break;
                }
                if(typeof console !== 'undefined') console.log(data);
            }
        }).on('disconnect', function() {
            if(typeof console !== 'undefined') console.log('connectChannel disconnect');
        }).on('reconnecting', function() {
            if(typeof console !== 'undefined') console.log('connectChannel reconnecting');
            chat.emit('login', {'token':'2014'});
            //chat.disconnect();
        });
        
        chat.request = function(action, content) {
            chat.emit('request', {'session':'XXXX', 'action':action, 'content':content});
            $.pnotify({
                title: "Send",
                text: content,
                styling: 'jqueryui'
            });
        };
        chat.sendMessage = function(saying) {
            chat.emit('request', {'session':'XXXXXXXXX', action:'send', 'content':{from:'',to:'',content:saying}});
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
            chat.emit('request', {'session':'XXXX', 'action':'enter', 'content':{'token':'2014'}});
            if(typeof console !== 'undefined') console.log('before channel connect');
        }).on('response', function(data) {
            if(typeof console !== 'undefined') console.log('response', data);
            if(data.success) {
                setTimeout(function() {connectChannel(data.content.id);}, 10);
            }
        }).on('disconnect', function() {
            //$.chat.disconnect('unauthorized');
            if(typeof console !== 'undefined') console.log('beforeChannel disconnect');
        }).on('reconnecting', function() {
            //$.chat.disconnect('unauthorized');
            if(typeof console !== 'undefined') console.log('beforeChannel reconnecting');
        });
        //$.chat = chat;
    };
  
    beforeChannel();
});
