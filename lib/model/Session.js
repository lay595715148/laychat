var Model = $require('core.Model');
var SessionSummary = $require('data.SessionSummary');

/**
 * Session对象
 * @param id {Number}
 * @param data {String}
 */
function Session(id, data) {
    var _id = 0, _data= '';
    if($util.isObject(id) && !$util.isNull(id)) {
        var tmp = id;
        id = tmp.id;
        data = tmp.data;
    }
    
    //一些setter和getter方法
    this.__defineSetter__('id', function(id) {
        if($util.isInteger(id))
            _id = id;
    });
    this.__defineSetter__('data', function(data) {
        if($util.isString(data))
            _data = data;
    });
    this.__defineGetter__('id', function() {
        return _id;
    });
    this.__defineGetter__('data', function() {
        return _data;
    });

    this.id = id;
    this.data = data;
}

$util.inherits(Session, Model);

module.exports = exports = Session;

/**
 * 
 * @param id {Number}
 */
Session.prototype.setId = function(id) {
    this.id = id;
};
/**
 * 
 * @param name {String}
 */
Session.prototype.setData = function(data) {
    this.data = data;
};
/**
 * 
 * @param id {Number}
 */
Session.prototype.getId = function() {
    return this.id;
};
/**
 * 
 * @param name {String}
 */
Session.prototype.getData = function() {
    return this.data;
};
/**
 * 
 * @returns {SessionSummary}
 */
Session.prototype.toSessionSummary = function() {
    return new SessionSummary(this);
};

Session.table = Session.prototype.table = function() {
    return 'lay_session';
};
Session.columns = Session.prototype.columns = function() {
    return {
        'id':'_id',
        'data':'data'
    };
};
Session.primary = Session.prototype.primary = function() {
    return '_id';
};
Session.key = Session.prototype.key = function() {
    return 'id';
}
