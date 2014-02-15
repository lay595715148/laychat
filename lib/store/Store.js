function Store(model, config) {
    this.model = undefined;
    this.config = undefined;
    this.link = undefined;
    this.result = undefined;
}

module.exports = exports = Store;

/**
 * @abstract
 */
Store.prototype.connect = function() {};
/**
 * @abstract
 */
Store.prototype.close = function() {};
/**
 * @abstract
 */
Store.prototype.insert = function() {};
/**
 * @abstract
 */
Store.prototype.update = function() {};
/**
 * @abstract
 */
Store.prototype.remove = function() {};
/**
 * @abstract
 */
Store.prototype.select = function() {};
/**
 * @abstract
 */
Store.prototype.count = function() {};
/**
 * @abstract
 */
Store.prototype.choose = function() {};
/**
 * @abstract
 */
Store.prototype.change = function() {};
