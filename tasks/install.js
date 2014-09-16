
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
    var cmd = 'npm install ajgenesisnode-' + modulename;
    runCommand(cmd, cb);
}

module.exports = function (model, args, ajgenesis, cb) {
    var modulename = args[0];
    
    var dirname = path.join('.', 'node-modules', 'ajgenesisnode-' + modulename);
    
    if (!fs.existsSync(dirname))
        installModule(modulename, cb);
    else
        cb(null, null);
}
