var Model = $require('core.Model');

function Group(id, name) {
    var _id = 0, _name = '';

    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        name = tmp.name;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isNumber(id))
            _id = id;
    });
    this.__defineSetter__('name', function(name) {
        if($util.isString(name))
            _name = name;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('name', function() {
        return _name;
    });
    
    this.id = id;
    this.name = name;
}

$util.inherits(Group, Model);

module.exports = exports = Group;

/**
 * 
 * @param id {Number}
 */
Group.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
Group.prototype.setName = function(name) {
    this.name = name;
};

/**
 * 
 */
Group.prototype.getId = function() {
    return this.id;
};
/**
 * 
 */
Group.prototype.getName = function() {
    return this.name;
};

Group.table = Group.prototype.table = function() {
    return 'lay_group';
};
Group.columns = Group.prototype.columns = function() {
    return {
        'id':'_id',
        'name':'name'
    };
};
Group.primary = Group.prototype.primary = function() {
    return '_id';
};
Group.sequence = Group.prototype.sequence = function() {
    return '_id';
};
Group.key = Group.prototype.key = function() {
    return 'id';
}
