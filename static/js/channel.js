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
    var checkResponse = function(data) {
        if('object' !== typeof data) {
            return false;
        }
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
        if($.chat) { $.chat = null; }
        var chat = io.connect('http://localhost:8133/' + channelid);
        chat.on('connect', function() {
            alert('connect channel connect');
            if(typeof console !== 'undefined') console.log('connect channel connect');
            //chat.emit('login', {'token':'2014'});
            chat.emit('request', {'session':'XXXXXX','action':'login','content':{'token':'2014'}});
        }).on('response', function(data) {
            if(checkResponse(data)) {
                switch(data.action) {
                    case 'login':
                        //if(typeof console !== 'undefined') console.log(data);
                        break;
                    case 'send':
                        chat.receiveMessage(data.content.content);
                        break;
                    case 'list':
                        chat.listUser(data.content);
                        break;
                    case 'update':
                        break;
                }
                if(typeof console !== 'undefined') console.log(data);
            }
        }).on('disconnect', function() {
            if(typeof console !== 'undefined') console.log('connectChannel disconnect');
        }).on('reconnecting', function() {
            if(typeof console !== 'undefined') console.log('connectChannel reconnecting');
            chat.emit('request', {'session':'XXXXXX','action':'login','content':{'token':'2014'}});
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
        chat.listUser = function(list) {
            var users = list.list;
            var usershtml = '';
            users.forEach(function(item, index, arr) {
                usershtml += '<li><a userid="' + item.id + '" socket="' + item.socket + '">' + item.name + '</a>';
            });
            $( "#userlist" ).html(usershtml);
            $( "#userlist" ).menu();
        };
        
        $.chat = chat;
    };
    $.connectChannel = connectChannel;
    $.connectChannel(10000);
});
