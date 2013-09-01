
var ajgenesis = require('..'),
    fs = require('fs'),
    path = require('path');

exports['copy directory'] = function (test) {
    test.async();
    
    var source = path.join('test', 'ajgenesis');
    var target = path.join('test', 'ajgenesis2');
    
    ajgenesis.copyDirectory(source, target, function (err) {
        test.equal(err, null);
        test.ok(fs.existsSync(target));
        test.ok(fs.existsSync(path.join(target, 'tasks')));
        test.ok(fs.existsSync(path.join(target, 'tasks', 'simple.js')));
        test.ok(fs.existsSync(path.join(target, 'modules')));
        test.ok(fs.existsSync(path.join(target, 'modules', 'module1')));
        test.ok(fs.existsSync(path.join(target, 'modules', 'module1', 'simple.js')));
        removeDirSync(target);
        test.done();
    });
}

function removeDirSync(dirname) {
    var filenames = fs.readdirSync(dirname);
    
    filenames.forEach(function (filename) {
        filename = path.join(dirname, filename);
        
        if (isDirectory(filename))
            removeDirSync(filename);
        else
            removeFileSync(filename);
    });
    
    fs.rmdirSync(dirname);
}

function removeFileSync(filename) {
    fs.unlinkSync(filename);
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
