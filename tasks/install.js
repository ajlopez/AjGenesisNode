
var path = require('path');
var fs = require('fs');

// from http://krasimirtsonev.com/blog/article/Nodejs-managing-child-processes-starting-stopping-exec-spawn
function runCommand(cmd, cb) {
    var exec = require('child_process').exec;

    var child = exec(cmd);
    
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    child.on('close', function(code) {
        cb(code, null);
    });
}

function installModule(modulename, cb) {
    var cmd = 'npm install ' + modulename;
    runCommand(cmd, cb);
}

module.exports = function (model, args, ajgenesis, cb) {
    var modulename = 'ajgenesisnode-' + args[0];
    var module;
    
    try {
        module = require(modulename);
        doInstall(null, null);
    }
    catch (ex) {
        installModule(modulename, doInstall);
    }
        
    function doInstall(err, data) {
        if (err) {
            cb(err, null);
            return;
        }
        
        if (!module)
            try {
                module = require(modulename);
            }
            catch (ex) {
                module = require(path.join(process.cwd(), 'node_modules', modulename));
            }

        if (module.install)
            module.install(ajgenesis, cb);
        else
            cb(null, null);
    }
}
