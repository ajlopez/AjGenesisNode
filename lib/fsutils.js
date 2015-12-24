
var fs = require('fs');
var path = require('path');

function isFile(filename)
{
    try {
        var stats = fs.lstatSync(filename);
        return stats.isFile();
    }
    catch (err)
    {
        return false;
    }
}

function isDirectory(filename)
{
    try {
        var stats = fs.lstatSync(filename);
        return stats.isDirectory();
    }
    catch (err)
    {
        return false;
    }
}

function createDirectory()
{
	var dirpath;
    
    for (var k = 0; k < arguments.length; k++) {
        if (k)
            dirpath = path.join(dirpath, arguments[k]);
        else
            dirpath = arguments[k];
            
        if (!isDirectory(dirpath))
            fs.mkdirSync(dirpath);
    }
}

function copyDirectory(source, target, options, cb) {
    if (!cb && typeof options === 'function') {
        cb = options;
        options = null;
    }
    
    options = options || {};

    createDirectory(target);
    
    fs.readdir(source, function (err, filenames) {
        if (err) {
            cb(err);
            return;
        }
        
        processFile();
        
        function processFile() {
            if (!filenames.length) {
                cb();
                return;
            }
            
            var filename = filenames.shift();
            var sourcefilename = path.join(source, filename);
            var targetfilename = path.join(target, filename);
            
            if (isFile(sourcefilename))
                copyFile(sourcefilename, targetfilename, options, function (err, result) {
                    if (err)
                        cb(err);
                    else
                        processFile();
                });
            else
                copyDirectory(sourcefilename, targetfilename, options, function (err, result) {
                    if (err)
                        cb(err);
                    else
                        processFile();
                });
        }            
    });
}

// from http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js

function copyFile(source, target, options, cb) {
    if (!cb && typeof options === 'function') {
        cb = options;
        options = null;
    }
    
    options = options || {};
    
    if (options.noreplace && exists(target))
        return cb(null, null);
    
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    
    rd.on("error", function(err) {
        done(err);
    });
    
    var wr = fs.createWriteStream(target);
    
    wr.on("error", function(err) {
        done(err);
    });
    
    wr.on("close", function(ex) {
        done();
    });
    
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

module.exports = {
    isFile: isFile,
    isDirectory: isDirectory,
    createDirectory: createDirectory,
    copyDirectory: copyDirectory,
    copyFile: copyFile,
    exists: function (target) { return fs.existsSync(target); }
};

