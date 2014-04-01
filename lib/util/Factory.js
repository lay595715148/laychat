function Factory() {

}

module.exports = exports = Factory;

/**
 * @param {String}
 *            space 类实例对象存储域
 * @param {String}
 *            classname
 * @param {String}
 *            prefix 类所在文件夹前缀（包含点号或正反斜杠），如果在类实例化中还有其他参数，请设置此参数或空字符串
 */
Factory.factory = function(space, classname, prefix) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 3);
    prefix = $util.isString(prefix) ? prefix : '';
    if($util.isFunction(classname)) {
        classname = $util.getClass(classname);
    }
    if($util.isString(classname) && classname.indexOf(prefix) === 0) {
        classname = classname.substr(prefix.length);
    }
    if($util.isDefined(space[prefix + classname])) {
        //$logger.warn('Factory.factory', prefix + classname, 'is exists');
        instance = space[prefix + classname];
    } else {
        $logger.warn('Factory.factory', prefix + classname, 'isn\'t exists');
        SubClass = $require(prefix + classname);
        instance = space[prefix + classname] = $util.construct(SubClass, args);
    }
    return instance;
};
/**
 * @param {String}
 *            classname
 * @param {String}
 *            prefix 类所在文件夹前缀（包含点号或正反斜杠），如果在类实例化中还有其他参数，请设置此参数或空字符串
 */
Factory.instance = function(classname, prefix) {
    var SubClass;
    var instance = null;
    var args = Array.prototype.slice.call(arguments, 2);
    prefix = $util.isString(prefix) ? prefix : '';
    if($util.isFunction(classname)) {
        classname = $util.getClass(classname);
    }
    if($util.isString(classname) && classname.indexOf(prefix) === 0) {
        classname = classname.substr(prefix.length);
    }
    SubClass = $require(prefix + classname);
    $logger.warn('Factory.instance', prefix + classname);
    if($util.isFunction(SubClass)) {
        instance = $util.construct(SubClass, args);
    }
    return instance;
};
