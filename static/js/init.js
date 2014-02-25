$(document).ready(function() {
    $.to = {};
    $('#sendbtn').button();
    $('#sendbtn').laychat();
    $('#chatlist').menu();
    $('#userlist').selectable({
        create : function(event, ui) {
            $('#userlist.ui-selectable').addClass('ui-widget-content');
            $('#userlist.ui-selectable').addClass('ui-corner-all');
            $('#userlist.ui-selectable .ui-selectee a').addClass('ui-corner-all');
        }
    });
    $('#userlist').on('selectableselecting', function(event, ui) {
        var a = $('a', $(ui.selecting));
        a.addClass('ui-corner-all ui-state-focus');
    });
    $('#userlist').on('selectableunselecting', function(event, ui) {
        var a = $('a', $(ui.unselecting));
        a.removeClass('ui-corner-all ui-state-focus');
    });
    $('#userlist').on('selectableselected', function(event, ui) {
        var a = $('a', $(ui.selected));
        a.addClass('ui-corner-all ui-state-focus');
        $.to[a.attr('userid')] = a.attr('socket');
        alert(a.attr('userid') + ':' + a.attr('socket'));
    });
    $('#userlist').on('selectableunselected', function(event, ui) {
        var a = $('a', $(ui.unselected));
        a.removeClass('ui-corner-all ui-state-focus');
        delete $.to[a.attr('userid')];
        alert(a.attr('userid'));
    });

    $pnotify.consume_alert();
    $(window).resize(function() {
        $('.left_column .content').height($(window).height() - 141 > 200 ? $(window).height() - 141 : 200);
    });
    $('.left_column .content').height($(window).height() - 141 > 200 ? $(window).height() - 141 : 200);
});

function Utilities() {

}
var $util = Utilities;
Utilities.inherits = inherits = function(ctor, superCtor) {
    // copy from nodejs
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor : {
            value : ctor,
            enumerable : false,
            writable : true,
            configurable : true
        }
    });
};
/**
 * 
 * @param {Function}
 *            constructor
 * @param {Array}
 *            args
 * @returns {Object}
 */
Utilities.construct = construct = function(constructor, args) {
    args = Utilities.isArray(args) ? args : [];
    function fn() {
        return constructor.apply(this, args);
    }
    fn.prototype = constructor.prototype;
    return new fn();
};
/**
 * 
 * @param target
 *            {Object}
 * @returns {Object}
 * @api public
 */
Utilities.extend = extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function(source) {
        if(Utilities.isObject(source) && !Utilities.isEmpty(source)) {
            for( var prop in source) {
                // 增加setter和getter条件
                var g = source.__lookupGetter__(prop), s = source.__lookupSetter__(prop);
                if(g || s) {
                    if(g)
                        target.__defineGetter__(prop, g);
                    if(s)
                        target.__defineSetter__(prop, s);
                } else {
                    target[prop] = source[prop];
                }
            }
        }
    });
    return target;
};
Utilities.clone = clone = function(target) {
    return Utilities.extend({}, target);
};
/**
 * convert to json format
 * 
 * @api public
 */
Utilities.json = json = function(target, hasFun) {
    var obj;
    if(Utilities.isArray(target)) {
        obj = [];
        target.forEach(function(item, index, arr) {
            if(Utilities.isArray(item) || Utilities.isObject(item)) {
                obj[index] = Utilities.json(item, hasFun);
            } else if(Utilities.isFunction(item) && hasFun !== true) {
                // obj[index] = item;
            } else {
                obj[index] = item;
            }
        });
    } else if(Utilities.isObject(target) && !Utilities.isNull(target)) {
        obj = {};
        for( var p in target) {
            var item = target[p];
            if(Utilities.isObject(item) || Utilities.isArray(item)) {
                obj[p] = Utilities.json(item, hasFun);
            } else if(Utilities.isFunction(item) && hasFun !== true) {
                // obj[p] = item;
            } else {
                obj[p] = item;
            }
        }
    } else if(Utilities.isFunction(target) && hasFun !== true) {
        obj = undefined;
    } else {
        obj = target;
    }
    return obj;
};
/**
 * string convert to json
 * 
 * @param {String}
 */
Utilities.toJson = toJson = function(str) {
    var json = {};

    if(!Utilities.isString(str))
        return json;

    try {
        json = JSON.parse(str);
    } catch(err) {
        try {
            json = (new Function("return " + str))();
        } catch(err) {
            //
        }
    }
    return json;
};
/**
 * json convert to xml string
 * 
 * @param {String}
 */
Utilities.toXml = toXml = function(json) {
    var strXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
    var regulStr = function(str) {
        if(str == "")
            return "";
        var s = str;
        var spacial = ["<", ">", "\"", "'", "&"];
        var forma = ["&lt;", "&gt;", "&quot;", "&apos;", "&amp;"];
        for(var i = 0; i < spacial.length; i++) {
            s = s.replace(new RegExp(spacial[i], "g"), forma[i]);
        }
        return s;
    };
    var appendText = function(str, s) {
        s = regulStr(s);
        return s == "" ? str : str + s + "\n";
    };
    var appendFlagBegin = function(str, s) {
        return str + "<" + s + ">\n";
    };
    var appendFlagEnd = function(str, s) {
        return str + "</" + s + ">\n";
    };

    if(arguments.length == 2) {
        strXml = arguments[1];
    }

    if(Utilities.isArray(json)) {
        json.forEach(function(item) {
            strXml = appendFlagBegin(strXml, 'item');
            strXml = Utilities.toXml(item, strXml);
            strXml = appendFlagEnd(strXml, 'item');
        });
    } else if(Utilities.isObject(json)) {
        for( var tag in json) {
            strXml = appendFlagBegin(strXml, tag);
            strXml = Utilities.toXml(json[tag], strXml);
            strXml = appendFlagEnd(strXml, tag);
        }
    } else if(Utilities.isString(json)) {
        strXml = appendText(strXml, json);
    } else {
        strXml = appendText(strXml, Utilities.toString(json));
    }

    return strXml;
};

/**
 * @api public
 */
Utilities.toString = toString = function(json) {
    var str = '';

    if(Utilities.isNull(json) || Utilities.isUndefined(json) || Utilities.isError(json))
        return str;

    try {
        str = JSON.stringify(json);
    } catch(err) {
        //
    }
    return str;
};
/**
 * @api public
 */
Utilities.toArray = toArray = function(enu) {
    var arr = [];

    for(var i = 0, l = enu.length; i < l; i++)
        arr.push(enu[i]);

    return arr;
};
Utilities.unique = unique = function(arr, equal) {
    equal = Utilities.isBoolean(equal) ? equal : true;
    for(var i = 0; i < arr.length;) {
        var a = arr.splice(i, 1);
        if(!Utilities.inArray(a[0], arr, equal)) {
            arr.splice(i, 0, a[0]);
            i++;
        }
    }
    return arr;
};
Utilities.inArray = inArray = function(k, arr, equal) {
    equal = Utilities.isBoolean(equal) ? equal : true;
    return (function check(i) {
        if(i >= arr.length)
            return false;
        if(equal === true && arr[i] === k)
            return true;
        if(equal === false && arr[i] == k)
            return true;
        return check(i + 1);
    }(0));
};
Utilities.nsort = nsort = function(arr, asc) {
    asc = Utilities.isBoolean(asc) ? asc : true;
    arr.sort(function(x, y) {
        return asc?parseFloat(x)-parseFloat(y):parseFloat(y)-parseFloat(x);
    });
    return arr;
};
/**
 * @api public
 */
Utilities.isArray = isArray = function(a) {
    return Object.prototype.toString.call(a) === '[object Array]' && a instanceof Array;
};
/**
 * @api public
 */
Utilities.isRegExp = isRegExp = function(r) {
    return Object.prototype.toString.call(r) === '[object RegExp]' && r instanceof RegExp;
};
/**
 * @api public
 */
Utilities.isDate = isDate = function(d) {
    return Object.prototype.toString.call(d) === '[object Date]' && d instanceof Date;
};
/**
 * @api public
 */
Utilities.isError = isError = function(e) {
    return Object.prototype.toString.call(e) === '[object Error]' && e instanceof Error;
};
/**
 * @api public
 */
Utilities.isString = isString = function(str) {
    return 'string' === typeof str ? true : false;
};
/**
 * @api public
 */
Utilities.isNumber = isNumber = function(num) {
    return 'number' === typeof num ? true : false;
};
/**
 * @api public
 */
Utilities.isBoolean = isBoolean = function(bool) {
    return 'boolean' === typeof bool ? true : false;
};
/**
 * @api public
 */
Utilities.isObject = isObject = function(obj) {
    return 'object' === typeof obj ? true : false;
};
/**
 * @api public
 */
Utilities.isPureObject = isPureObject = function(o) {
    return o !== undefined && o !== null && !Utilities.isFunction(o) && !Utilities.isString(o)
            && !Utilities.isNumber(o) && !Utilities.isBoolean(o) && !Utilities.isArray(o) && !Utilities.isDate(o)
            && !Utilities.isRegExp(o) && !Utilities.isError(o);
};
/**
 * @api public
 */
Utilities.isA = isA = function(o, O) {
    return Utilities.isFunction(O) && o instanceof O ? true : false;
};
/**
 * @api public
 */
Utilities.isDefined = isDefined = function(o) {
    return 'undefined' !== typeof o ? true : false;
};
/**
 * @api public
 */
Utilities.isUndefined = isUndefined = function(o) {
    return 'undefined' === typeof o ? true : false;
};
/**
 * @api public
 */
Utilities.isInteger = isInteger = function(n) {
    return 'number' === typeof n && n % 1 === 0 ? true : false;
};
/**
 * @api public
 */
Utilities.isFloat = isFloat = function(n) {
    return 'number' === typeof n && n !== parseInt(n, 10) && !isNaN(n) ? true : false;
};
/**
 * @api public
 */
Utilities.isBinary = isBinary = function(bin) {

};
/**
 * @api public
 */
Utilities.isFunction = isFunction = function(f) {
    return 'function' === typeof f ? true : false;
};
/**
 * @api public
 */
Utilities.isNull = isNull = function(n) {
    return n === null ? true : false;
};
/**
 * @api public
 */
Utilities.isEmpty = isEmpty = function(o) {
    if(o === undefined || o === null)
        return true;
    if(Utilities.isArray(o) && o.length === 0)
        return true;
    if(Utilities.isString(o) && o.length === 0)
        return true;
    if(Utilities.isPureObject(o) && Object.keys(o).length === 0)
        return true;
    return false;
};

function Pnotify() {

}
var $pnotify = Pnotify;
/**
 * @api private
 */
Pnotify._alert = undefined;
/**
 * @api public
 */
Pnotify.consume_alert = function() {
    if(!$util.isEmpty(Pnotify._alert))
        return;
    Pnotify._alert = window.alert;
    window.alert = function(message) {
        $.pnotify({
            title : 'Alert',
            styling : 'jqueryui',
            text : message
        });
    };
};
/**
 * @api public
 */
Pnotify.release_alert = function() {
    if($util.isEmpty(Pnotify._alert))
        return;
    window.alert = Pnotify._alert;
    Pnotify._alert = undefined;
};

function Data() {
}
/**
 * 后续还需要根据rfc2822进行修改
 */
function Message(content, headers) {
    var _content = '', _headers = {};

    if($util.isObject(content) && !$util.isNull(content)) {
        var tmp = content;
        content = tmp.content;
        headers = tmp.headers;
    }

    // 一些setter和getter方法
    this.__defineSetter__('content', function(content) {
        if($util.isString(content))
            _content = content;
    });
    this.__defineSetter__('headers', function(headers) {
        if($util.isObject(headers) && !$util.isNull(headers))
            _headers = headers;
    });
    this.__defineGetter__('content', function() {
        return _content;
    });
    this.__defineGetter__('headers', function() {
        return _headers;
    });

    this.headers = headers;
    this.content = content;
}
$util.inherits(Message, Data);
Message.prototype.setHeaders = function(headers) {
    this.headers = headers;
};
Message.prototype.setContent = function(content) {
    this.content = content;
};
Message.prototype.getHeaders = function() {
    return this.headers;
};
Message.prototype.getContent = function() {
    return this.content;
};
/**
 * 后续还需要根据rfc2822进行修改
 */
function MessageField(key, value) {
    var _key = '', _value = '';
    var keys = ['Resent-From', 'Resent-To', 'Resent-Date', 'Resent-From', 'Resent-Message-ID', 'Reply-To',
            'In-Reply-To', 'References', 'Received', 'From', 'Sender', 'To', 'Cc', 'Bcc', 'Subject', 'Comments', 'Keywords',
            'Date', 'Message-ID'];

    if($util.isObject(key) && !$util.isNull(key)) {
        var tmp = key;
        key = tmp.key;
        value = tmp.value;
    }

    // 一些setter和getter方法
    this.__defineSetter__('key', function(key) {
        if($util.isString(key) && $util.inArray(key, keys))
            _key = key;
    });
    this.__defineSetter__('value', function(value) {
        if($util.isString(value))
            _value = value;
    });
    this.__defineGetter__('key', function() {
        return _key;
    });
    this.__defineGetter__('value', function() {
        return _value;
    });

    this.key = key;
    this.value = value;
}
$util.inherits(MessageField, Data);
MessageField.prototype.setKey = function(key) {
    this.key = key;
};
MessageField.prototype.setValue = function(value) {
    this.value = value;
};
MessageField.prototype.getKey = function() {
    return this.key;
};
MessageField.prototype.getValue = function() {
    return this.value;
};

var permanotice, tooltip, _alert;
$(function() {
    // This is how to change the default settings for the entire page.
    // $.pnotify.defaults.width = "400px";
    // If you don't want new lines ("\n") automatically converted to breaks
    // ("<br />")
    // $.pnotify.defaults.insert_brs = false;

    /*
     * $.pnotify({ title: "Pines Notify", text: "Welcome. Try hovering over me.
     * You can click things behind me, because I'm non-blocking.", nonblock:
     * true, styling: 'jqueryui', before_close: function(pnotify){ // You can
     * access the notice's options with this. It is read only.
     * //pnotify.opts.text; // You can change the notice's options after the
     * timer like this: pnotify.pnotify({ title: pnotify.opts.title+" - Enjoy
     * your Stay", before_close: null }); pnotify.pnotify_queue_remove(); return
     * false; } });
     */
});

function show_rich() {
    $
            .pnotify({
                styling : 'jqueryui',
                title : '<span style="color: green;">Rich Content Notice</span>',
                text : '<span style="color: blue;">Look at my beautiful <strong>strong</strong>, <em>emphasized</em>, and <span style="font-size: 1.5em;">large</span> text.</span>'
            });
}

function consume_alert() {
    if(_alert)
        return;
    _alert = window.alert;
    window.alert = function(message) {
        $.pnotify({
            title : 'Alert',
            styling : 'jqueryui',
            text : message
        });
    };
}

function release_alert() {
    if(!_alert)
        return;
    window.alert = _alert;
    _alert = null;
}

function fake_load() {
    var cur_value = 1, progress;

    // Make a loader.
    var loader = $.pnotify({
        title : "Fake Load",
        text : "<div class=\"progress_bar\" />",
        icon : 'picon picon-throbber',
        styling : 'jqueryui',
        hide : false,
        closer : false,
        sticker : false,
        history : false,
        before_open : function(pnotify) {
            progress = pnotify.find("div.progress_bar");
            progress.progressbar({
                value : cur_value
            });
            // Pretend to do something.
            var timer = setInterval(function() {
                if(cur_value >= 100) {
                    // Remove the interval.
                    window.clearInterval(timer);
                    loader.pnotify_remove();
                    return;
                }
                // cur_value += Math.ceil(3 * ((100 - cur_value) / 100));
                cur_value += .3;
                progress.progressbar('option', 'value', cur_value);
            }, 200);
        }
    });
}

function dyn_notice() {
    var percent = 0;
    var notice = $.pnotify({
        title : "Please Wait",
        type : 'info',
        icon : 'picon picon-throbber',
        styling : 'jqueryui',
        hide : false,
        closer : false,
        sticker : false,
        opacity : .75,
        shadow : false,
        width : "150px"
    });

    setTimeout(function() {
        notice.pnotify({
            title : false
        });
        var interval = setInterval(function() {
            percent += 2;
            var options = {
                text : percent + "% complete."
            };
            if(percent == 80)
                options.title = "Almost There";
            if(percent >= 100) {
                window.clearInterval(interval);
                options.title = "Done!";
                options.type = "success";
                options.hide = true;
                options.closer = true;
                options.sticker = true;
                options.icon = 'picon picon-task-complete';
                options.opacity = 1;
                options.shadow = true;
                options.width = $.pnotify.defaults.width;
                // options.min_height = "300px";
            }
            notice.pnotify(options);
        }, 120);
    }, 2000);
}

function timed_notices(n) {
    var start_time = new Date().getTime(), end_time;
    var options = {
        title : "Notice Benchmark",
        text : "Testing notice speed.",
        styling : 'jqueryui',
        animation : 'none',
        delay : 0,
        history : false
    };
    for(var i = 0; i < n; i++) {
        if(i + 1 == n) {
            options.after_close = function(pnotify) {
                // Remove this callback.
                pnotify.pnotify({
                    after_close : null
                });
                end_time = new Date().getTime();
                alert("Testing complete:\n\nTotal Notices: " + n + "\nTotal Time: " + (end_time - start_time) + "ms ("
                        + ((end_time - start_time) / 1000) + "s)" + "\nAverage Time: " + ((end_time - start_time) / n)
                        + "ms (" + ((end_time - start_time) / n / 1000) + "s)")
            };
        }
        $.pnotify(options);
    }
}

/*******************************************************************************
 * Custom Stacks ********* A stack is an object which Pines Notify uses to
 * determine where to position notices. A stack has two mandatory variables,
 * dir1 and dir2. dir1 is the first direction in which the notices are stacked.
 * When the notices run out of room in the window, they will move over in the
 * direction specified by dir2. The directions can be "up", "down", "right", or
 * "left". Stacks are independent of each other, so a stack doesn't know and
 * doesn't care if it overlaps (and blocks) another stack. The default stack,
 * which can be changed like any other default, goes down, then left. Stack
 * objects are used and manipulated by Pines Notify, and therefore, should be a
 * variable when passed. So, calling something like
 * 
 * $.pnotify({stack: {"dir1": "down", "dir2": "left"}});
 * 
 * will NOT work. It will create a notice, but that notice will be in its own
 * stack and may overlap other notices.
 */
var stack_topleft = {
    "dir1" : "down",
    "dir2" : "right",
    "push" : "top"
};
var stack_bottomleft = {
    "dir1" : "right",
    "dir2" : "up",
    "push" : "top"
};
var stack_custom = {
    "dir1" : "right",
    "dir2" : "down"
};
var stack_custom2 = {
    "dir1" : "left",
    "dir2" : "up",
    "push" : "top"
};
var stack_bar_top = {
    "dir1" : "down",
    "dir2" : "right",
    "push" : "top",
    "spacing1" : 0,
    "spacing2" : 0
};
var stack_bar_bottom = {
    "dir1" : "up",
    "dir2" : "right",
    "spacing1" : 0,
    "spacing2" : 0
};
/*******************************************************************************
 * Positioned Stack ********* This stack is initially positioned through code
 * instead of CSS. This is done through two extra variables. firstpos1 and
 * firstpos2 are pixel values, relative to a viewport edge. dir1 and dir2,
 * respectively, determine which edge. It is calculated as follows: - dir = "up" -
 * firstpos is relative to the bottom of viewport. - dir = "down" - firstpos is
 * relative to the top of viewport. - dir = "right" - firstpos is relative to
 * the left of viewport. - dir = "left" - firstpos is relative to the right of
 * viewport.
 */
var stack_bottomright = {
    "dir1" : "up",
    "dir2" : "left",
    "firstpos1" : 25,
    "firstpos2" : 25
};

function show_stack_topleft(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-topleft",
        styling : 'jqueryui',
        stack : stack_topleft
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bottomleft(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bottomleft",
        styling : 'jqueryui',
        stack : stack_bottomleft
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bottomright(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bottomright",
        styling : 'jqueryui',
        stack : stack_bottomright
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_custom(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-custom",
        styling : 'jqueryui',
        stack : stack_custom
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_custom2(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-custom2",
        styling : 'jqueryui',
        stack : stack_custom2
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bar_top(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bar-top",
        styling : 'jqueryui',
        cornerclass : "",
        width : "100%",
        stack : stack_bar_top
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_bar_bottom(type) {
    var opts = {
        title : "Over Here",
        text : "Check me out. I'm in a different stack.",
        addclass : "stack-bar-bottom",
        styling : 'jqueryui',
        cornerclass : "",
        width : "70%",
        stack : stack_bar_bottom
    };
    switch(type) {
        case 'error':
            opts.title = "Oh No";
            opts.text = "Watch out for that water tower!";
            opts.type = "error";
            break;
        case 'info':
            opts.title = "Breaking News";
            opts.text = "Have you met Ted?";
            opts.type = "info";
            break;
        case 'success':
            opts.title = "Good News Everyone";
            opts.text = "I've invented a device that bites shiny metal asses.";
            opts.type = "success";
            break;
    }
    $.pnotify(opts);
};
function show_stack_info() {
    var modal_overlay;
    if(typeof info_box != "undefined") {
        info_box.pnotify_display();
        return;
    }
    info_box = $
            .pnotify({
                title : "Pines Notify Stacks",
                text : "Stacks are used to position notices and determine where new notices will go when they're created. Each notice that's placed into a stack will be positioned related to the other notices in that stack. There is no limit to the number of stacks, and no limit to the number of notices in each stack.",
                type : "info",
                styling : 'jqueryui',
                icon : "picon picon-object-order-raise",
                delay : 20000,
                history : false,
                stack : false,
                before_open : function(pnotify) {
                    // Position this notice in the center of the screen.
                    pnotify.css({
                        "top" : ($(window).height() / 2) - (pnotify.height() / 2),
                        "left" : ($(window).width() / 2) - (pnotify.width() / 2)
                    });
                    // Make a modal screen overlay.
                    if(modal_overlay)
                        modal_overlay.fadeIn("fast");
                    else
                        modal_overlay = $("<div />", {
                            "class" : "ui-widget-overlay",
                            "css" : {
                                "display" : "none",
                                "position" : "fixed",
                                "top" : "0",
                                "bottom" : "0",
                                "right" : "0",
                                "left" : "0"
                            }
                        }).appendTo("body").fadeIn("fast");
                },
                before_close : function() {
                    modal_overlay.fadeOut("fast");
                }
            });
};

(function($) {
    $.fn.laychat = function(options) {
        var defaults = {
            id : 'sendbtn',
            input : 'sendmsg',
            output : 'content'
        };

        var option = $.extend(defaults, options);

        $(this).click(function(e) {
            var saying = $("#" + option.input).val();
            if(saying) {
                $.chat.sendMessage(saying);
            } else {
                $.pnotify({
                    title : "Warning",
                    text : "发送内容不可为空",
                    type : "notice",
                    styling : 'jqueryui'
                });
            }
        });
    };
})(jQuery);
jQuery.fn.extend({
    insertSaying : function(id, saying) {
        var textObj = $(this).get(0);
    }
});
