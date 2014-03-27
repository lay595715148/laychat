var Collector = $.util.Collector;
var Async = $.util.Async;
var JSAction = $.action.JSAction;
var Template = $.core.Template;
var Prefacer = $.core.Prefacer;
var Service = $.core.Service;
var User = $.model.User;
var md5 = $.util.MD5;

/**
 * 
 */
function CodeControl(req, res) {
    var name = $config.get('sign.action.cms.code') || 'cms_code';
    JSAction.call(this, name, req, res);
}

$util.inherits(CodeControl, JSAction);

module.exports = exports = CodeControl;

CodeControl.prototype.launch = function() {
    var me = this;
    var tservice = Service.factory('OAuth2CodeService');
    
    tservice.list(function(ret) {
        me.template.push(Collector.response(true, me.name, ret));
        me.template.json();
    });
};
