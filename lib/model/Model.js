function Model() {
}

module.exports = exports = Model;

Model.instance = function(classname) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('model.');
    args.unshift(classname);
    return Factory.instance.apply(null, args);
};

/**
 * @abstract
 */
Model.table = Model.prototype.table = function() {};
/**
 * @abstract
 */
Model.columns = Model.prototype.columns = function() {};
/**
 * 主键字段名
 * @abstract
 */
Model.primary = Model.prototype.primary = function() {};
/**
 * 返回一个字段名与model名的映射对象
 * @abstract
 * @returns
 */
Model.relations = Model.prototype.relations = function() {};
/**
 * 在与数据库操作时会根据这个rules来进行检查
 * @abstract
 * @returns
 */
Model.rules = Model.prototype.rules = function() {};
/**
 * 自增涨字段，一般为主键字段名，mongodb数据库中有专表记录
 * @abstract
 */
Model.sequence = Model.prototype.sequence = function() {};
