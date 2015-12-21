
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

