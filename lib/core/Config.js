var fs = require('fs');
var path = require('path');

/**
 * @param {String}
 *            nsp 命名空间
 * @param {Object}
 *            context 上下文
 */
function Config(nsp, context) {
    this.nsp = '';
    this.context = {};

    if($util.isObject(nsp)) {
        nsp = nsp.nsp;
        context = nsp.context;
    }

    this.setNamespace(nsp);
    this.setContext(context);
}

module.exports = exports = global.$config = global.$config || Config;

/**
 * 检查键
 * 
 * @api private
 * @param key
 * @returns {Boolean}
 * @api private
 */
Config.prototype.checkKey = function(key) {
    if($util.isArray(key)) {
        for(var i = 0; i < key.length; i++) {
            if(!this.checkKey(key[i])) {
                return false;
            }
        }
        return true;
    } else if($util.isString(key) || $util.isNumber(key)) {
        return true;
    } else {
        return false;
    }
};
/**
 * 检查值
 * 
 * @param value
 * @returns {Boolean}
 * @api private
 */
Config.prototype.checkValue = function(value) {
    if($util.isArray(value)) {
        for(var i = 0; i < value.length; i++) {
            if(!this.checkValue(value[i])) {
                return false;
            }
        }
        return true;
    } else if($util.isObject(value)) {
        for( var p in value) {
            if(!this.checkValue(value[p])) {
                return false;
            }
        }
        return true;
    } else if($util.isBoolean(value) || $util.isString(value) || $util.isNumber(value)
            || $util.isFunction(value)) {
        return true;
    } else {
        return false;
    }
};
/**
 * 检查键值对
 * 
 * @param {String} key
 * @param value
 * @returns {Boolean}
 * @api private
 */
Config.prototype.checkKeyValue = function(key, value) {
    if($util.isArray(key)) {
        if($util.isArray(value)) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
};

/**
 * 设置值
 * 
 * @param {String} key 键
 * @param value 值
 * @api public
 */
Config.prototype.set = function(key, value) {
    if(this.checkKey(key) && this.checkValue(value) && this.checkKeyValue(key, value)) {
        var me = this, node = this.context;
        if($util.isArray(key)) {
            key.forEach(function(k) {
                me.set(k, value[k]);
            });
        } else if($util.isString(key)) {
            var keys = key.split('.');
            var count = keys.length;
            keys.forEach(function(k, index) {
                if($util.isDefined(node[k]) && index === count - 1) {
                    node[k] = value;
                } else if($util.isDefined(node[k])) {
                    node = node[k];
                } else if(index === count - 1) {
                    node[k] = value;
                } else {
                    node[k] = {};
                    node = node[k];
                }
            });
        } else {
            node[key] = value;
        }
    } else {

    }
};
/**
 * 获取值
 * 
 * @param {String} key 键
 * @param def
 *            不存在时的默认值
 * @api public
 */
Config.prototype.get = function(key, def) {
    var me = this, node = '';
    if(this.checkKey(key)) {
        if($util.isArray(key) && !$util.isEmpty(key)) {
            node = [];
            key.forEach(function(k, i) {
                node[i] = me.get(k);
            });
        } else if($util.isString(key)) {
            var keys = key.split('.');
            node = $util.clone(this.context);
            for(var i in keys) {
                if($util.isDefined(node) && $util.isDefined(node[keys[i]])) {
                    node = node[keys[i]];
                } else {
                    node = def;
                    break;
                }
            }
        } else {
            node = $util.clone(this.context);
            if($util.isDefined(node[key])) {
                node = node[key];
            } else {
                node = def;
            }
        }
    } else {
        node = $util.clone(this.context);
    }
    return node;
};

/**
 * 设置命名空间
 * 
 * @param {String}
 *            nsp 命名空间
 * @api private
 */
Config.prototype.setNamespace = function(nsp) {
    if($util.isString(nsp) || $util.isNumber(nsp))
        this.nsp = nsp;
};
/**
 * 设置上下文
 * 
 * @param {Object}
 *            context 上下文
 * @api private
 */
Config.prototype.setContext = function(context) {
    if($util.isObject(context))
        this.context = $util.extend(this.context, context);
};

/**
 * 全局数据实例池，
 * 
 * @api private
 */
Config.instances = {};
/**
 * 默认设置值，命名空间为是''
 * 
 * @param {String}
 *            key
 * @param value
 * @api public
 */
Config.set = function(key, val) {
    Config.of('').set(key, val);
};
/**
 * 默认获取值，命名空间为是''
 * 
 * @param {String}
 *            key 键
 * @param def 如果是undefined时使用此值
 * @api public
 */
Config.get = function(key, def) {
    return Config.of('').get(key, def);
};
/**
 * 
 * @param {String}
 *            nsp 命名空间，默认''
 * @returns {Config}
 * @api public
 */
Config.of = function(nsp) {
    if(!$util.isString(nsp) && !$util.isNumber(nsp))
        nsp = '';
    if(!Config.instances[nsp])
        Config.instances[nsp] = new Config(nsp);

    return Config.instances[nsp];
};
/**
 * 配置
 * 
 * @param {Object}
 *            opts 选项，可选。文件名或文件夹是绝对路径
 * @param {Function}
 *            callback 回调函数，可选
 * @api public
 */
Config.configure = function(opts, callback) {
    // 默认项
    var defaults = {
        'file' : undefined,
        'dir' : undefined,
        'nsp' : '',
        'append' : true
    };

    // opts为可选项
    if($util.isFunction(opts)) {
        callback = opts;
        opts = defaults;
    } else {
        opts = $util.extend(defaults, opts);
    }

    // 加载配置目录，不包括子目录
    if(!$util.isEmpty(opts.dir)) {
        if($util.isArray(opts.dir)) {
            //多文件夹时
            opts.dir.forEach(function(d) {
                Config.configure($util.extend(opts,{
                    'dir' : d,
                    'file' : undefined
                }));
            });
        } else if($util.isString(opts.dir)) {
            if(fs.existsSync(opts.dir)) {
                var files = fs.readdirSync(opts.dir);
                var dir = fs.realpathSync(opts.dir);
                files.forEach(function(f) {
                    Config.configure($util.extend(opts, {
                        'dir' : undefined,
                        'file' : dir + '/' + f
                    }));
                });
            }
        }
    }
    // 加载配置文件
    if(!$util.isEmpty(opts.file)) {
        // 多个文件
        if($util.isArray(opts.file)) {
            opts.file.forEach(function(f) {
                Config.configure($util.extend(opts, {
                    'dir' : undefined,
                    'file' : f
                }));
            });
        } else if($util.isString(opts.file)) {
            // 检查是不是json文件
            var _ext = path.extname(opts.file);
            var exts = require.extensions;
            if(fs.existsSync(opts.file) && $util.inArray(_ext, Object.keys(exts))) {
                var str = fs.readFileSync(opts.file, {
                    'flag' : 'r',
                    'encoding' : 'utf-8'
                });
                var json = !$util.isError(str) && str ? $util.toJson(str) : false;
                //var json = require(opts.file);

                if($util.isPureObject(json)) {
                    // 是否设置了命名空间，默认是''
                    var context = json;
                    var nsp = opts.nsp;
                    var append = opts.append;
                    if($util.isPureObject(context)) {
                        for( var key in context) {
                            if(append !== false) {
                                Config.iteration(key, context[key], nsp);
                            } else {
                                Config.of(nsp).set(key, context[key]);
                            }
                        }
                    } else {
                        // 不是object不执行
                    }
                }
            }
        }
    }
    // 回调函数
    if($util.isFunction(callback)) {
        callback(Config, opts);
    }
};

/**
 * 迭代配置赋值
 * 
 * @api private
 * @param {String} key 键名
 * @param {Object} context 内容
 * @param {String} nsp 命名空间
 */
Config.iteration = function(key, context, nsp) {
    if(!$util.isString(nsp) && !$util.isNumber(nsp))
        nsp = '';

    var exists = Config.of(nsp).get(key);
    if($util.isUndefined(exists) || (!$util.isArray(exists) && !$util.isObject(exists))) {
        Config.of(nsp).set(key, context);
    } else if($util.isArray(exists) && $util.isArray(context)) {
        var len = exists.length;
        context.forEach(function(item, index) {
            Config.iteration(key + '.' + len++, item, nsp);
        });
    } else if($util.isObject(exists) && $util.isObject(context)) {
        for( var p in context) {
            Config.iteration(key + '.' + p, context[p], nsp);
        }
    } else {
        Config.of(nsp).set(key, context);
    }
};
