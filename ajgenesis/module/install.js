
var path = require('path');
var fs = require('fs');

function install(model, ajgenesis, dirname, cb) {
    try {
        ajgenesis.fs.createDirectory('ajgenesis');
        ajgenesis.createModelDirectory();
        ajgenesis.fs.copyDirectory(path.join(dirname, 'ajgenesis'), 'ajgenesis', function (err, data) {
            if (err)
                return cb(err, null);
            return cb(null, model);
        });
    }
    catch (err) {
        cb(err, null);
    }
}

module.exports = function (model, args, ajgenesis, cb) {
    var oldfoldername = null;
    var foldername = __dirname;
    var module = args[0];
    
    if (!module)
        return cb("A module name is required", null);
    
    while (foldername && foldername != oldfoldername) {
        var filename = path.join(foldername, 'ajgenesisnode-' + module);
        
        if (ajgenesis.fs.exists(filename))
            return install(model, ajgenesis, filename, cb);

        var filename = path.join(foldername, 'ajgenesis-' + module);
        
        if (ajgenesis.fs.exists(filename))
            return install(model, ajgenesis, filename, cb);

        oldfoldername = foldername;                
        foldername = path.resolve(path.join(foldername, '..'));
    }
    
    cb("Unknown module '" + module + "'", null);
}
