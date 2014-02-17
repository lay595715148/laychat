function Model() {
}

module.exports = exports = Model;

/**
 * @abstract
 */
Model.table = Model.prototype.table = function() {};
/**
 * @abstract
 */
Model.columns = Model.prototype.columns = function() {};
