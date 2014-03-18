var Model = require('../model/Model');

function Team(id, name) {
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

$util.inherits(Team, Model);

module.exports = exports = Team;

/**
 * 
 * @param id {Number}
 */
Team.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
Team.prototype.setName = function(name) {
    this.name = name;
};

/**
 * 
 */
Team.prototype.getId = function() {
    return this.id;
};
/**
 * 
 */
Team.prototype.getName = function() {
    return this.name;
};

Team.table = Team.prototype.table = function() {
    return 'lay_team';
};
Team.columns = Team.prototype.columns = function() {
    return {
        'id':'_id',
        'name':'name'
    };
};
Team.primary = Team.prototype.primary = function() {
    return '_id';
};
Team.sequence = Team.prototype.sequence = function() {
    return '_id';
};
