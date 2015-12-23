
var path = require('path');
var fs = require('fs');

module.exports = function (model, args, ajgenesis, cb) {
    var module = args[0];

    if (!module)
        return cb("A module name is required", null);

    var moduledir = ajgenesis.modules.locateGlobal(module);
    
    if (!moduledir)
        cb("Unknown module '" + module + "'", null);
    
    ajgenesis.modules.install(moduledir, '.', function (err, data) {
        if (err)
            cb(err, null);
        else
            cb(null, model);
    });
}
