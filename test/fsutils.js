
var fs = require('fs');
var fsutils = require('../lib/fsutils');
var path = require('path');

exports['is file'] = function (test) {
    test.strictEqual(fsutils.isFile('test'), false);
    test.strictEqual(fsutils.isFile(path.join('test', 'fsutils.js')), true);
}

exports['is directory'] = function (test) {
    test.strictEqual(fsutils.isDirectory('test'), true);
    test.strictEqual(fsutils.isDirectory(path.join('test', 'fsutils.js')), false);
}

exports['copy file'] = function (test) {
    test.async();
    
    var source = path.join('test', 'files', 'simplemodel.json');
    var target = path.join('test', 'files2', 'simplemodel.txt');
    
    fsutils.createDirectory('test', 'files2');
    
    fsutils.copyFile(source, target, function (err) {
        test.equal(err, null);
        test.ok(fs.existsSync(target));
        fs.unlinkSync(target);
        fs.rmdirSync(path.join('test', 'files2'));
        test.done();
    });
}

exports['copy directory'] = function (test) {
    test.async();
    
    var source = path.join('test', 'ajgenesis');
    var target = path.join('test', 'ajgenesis2');
    
    fsutils.copyDirectory(source, target, function (err) {
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

exports['create directory'] = function (test) {
    fsutils.createDirectory('test', 'ajgenesis3', 'models');
    var target = path.join('test', 'ajgenesis3', 'models');
    
    test.ok(fs.existsSync(target));
    removeDirSync(target);
    removeDirSync(path.join('test', 'ajgenesis3'));
}

function removeDirSync(dirname) {
    var filenames = fs.readdirSync(dirname);
    
    filenames.forEach(function (filename) {
        filename = path.join(dirname, filename);
        
        if (fsutils.isDirectory(filename))
            removeDirSync(filename);
        else
            removeFileSync(filename);
    });
    
    fs.rmdirSync(dirname);
}

function removeFileSync(filename) {
    fs.unlinkSync(filename);
}
