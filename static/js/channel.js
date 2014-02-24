/**
 * socket cnnect file
 */
$(document).ready(function() {
    var uid = [2014,2015,2016,2017,2018][Math.floor(Math.random()*100)%5];
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
            chat.emit('request', {'session':'XXXXXX','action':'login','content':{'token':uid}});
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
                        chat.updateUser(data.content);
                        break;
                }
                if(typeof console !== 'undefined') console.log(data);
            }
        }).on('disconnect', function() {
            if(typeof console !== 'undefined') console.log('connectChannel disconnect');
        }).on('reconnecting', function() {
            if(typeof console !== 'undefined') console.log('connectChannel reconnecting');
            chat.emit('request', {'session':'XXXXXX','action':'login','content':{'token':uid}});
            //chat.disconnect();
        });
        
        chat.request = function(action, content) {
            chat.emit('request', {'session':'XXXX', 'action':action, 'content':content});
            $.pnotify({
                title: action,
                text: content,
                styling: 'jqueryui'
            });
        };
        chat.sendMessage = function(saying) {
            chat.emit('request', {'session':'XXXXXXXXX', action:'send', 'content':{headers:{from:'', to:''}, content:saying}});
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
            var user;
            for(var i = 0; i< users.length; i++) {
                user = users[i];
                usershtml += '<li userid="' + user.id + '">' + 
                '<a userid="' + user.id + '" socket="' + user.socket + '">' + user.name + '(' + user.nick + ')</a>' + 
                '</li>';
            }
            $( "#userlist" ).html(usershtml);
            //$( "#userlist" ).menu();
            $( "#userlist" ).selectable('refresh');
        };
        chat.updateUser = function(user) {
            var exists = $( "#userlist li[userid=" + user.id + "]" );
            if(exists.length > 0) {
                if(user.status == 'leave' || user.status == 'disconnect') {
                    $( "#userlist li[userid=" + user.id + "]" ).remove();
                    //$( "#userlist" ).menu('refresh');
                    $( "#userlist" ).selectable('refresh');
                }
            } else {
                if(user.status == 'join') {
                    var userhtml = '<li userid="' + user.id + '">' + 
                            '<a userid="' + user.id + '" socket="' + user.socket + '">' + user.name + '('+user.nick+')</a>' + 
                            '</li>';
                    $( "#userlist" ).append(userhtml);
                    //$( "#userlist" ).menu('refresh');
                    $( "#userlist" ).selectable('refresh');
                }
            }
        };
        
        $.chat = chat;
    };
    $.connectChannel = connectChannel;
    $.connectChannel(10000);
});
