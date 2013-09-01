
var ajgenesis = require('..'),
    fs = require('fs'),
    path = require('path');

exports['copy file'] = function (test) {
    test.async();
    
    var source = path.join('test', 'files', 'simplemodel.json');
    var target = path.join('test', 'files2', 'simplemodel.txt');
    
    ajgenesis.createDirectory('test', 'files2');
    
    ajgenesis.copyFile(source, target, function (err) {
        test.equal(err, null);
        test.ok(fs.existsSync(target));
        fs.unlinkSync(target);
        fs.rmdirSync(path.join('test', 'files2'));
        test.done();
    });
}