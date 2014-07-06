
var ajgenesis = require('../');
var path = require('path');
var fs = require('fs');

exports['Transform hello template to hello file'] = function (test) {  
    var builddir = path.join(__dirname, 'build');
    ajgenesis.createDirectory(builddir);
    
    var source = path.join(__dirname, 'files', 'hello.js.tpl');
    var target = path.join(builddir, 'hello.js');
    var message = "Hello " + Math.random();
    ajgenesis.fileTransform(source, target, { message:  message });
    
    test.ok(fs.existsSync(target));
    var content = fs.readFileSync(target).toString();
    test.ok(content.indexOf(message) >= 0);
}

exports['Transform dummy template to dummy file without overwrite'] = function (test) {  
    var source = path.join(__dirname, 'files', 'dummy.js.tpl');
    var target = path.join(__dirname, 'files', 'dummy.js');
    
    test.ok(fs.existsSync(target));
    var stats1 = fs.statSync(target);

    ajgenesis.fileTransform(source, target, { });
    
    test.ok(fs.existsSync(target));
    var stats2 = fs.statSync(target);
    
    test.equal(stats1.mtime.toString(), stats2.mtime.toString());
}

exports['Preserve file'] = function (test) {  
    var source = path.join(__dirname, 'files', 'dummy.js.tpl');
    var target = path.join(__dirname, 'files', 'preserve.js');
    
    test.ok(fs.existsSync(target));
    var stats1 = fs.statSync(target);

    ajgenesis.fileTransform(source, target, { });
    
    test.ok(fs.existsSync(target));
    var stats2 = fs.statSync(target);
    
    test.equal(stats1.mtime.toString(), stats2.mtime.toString());
    
    var content = fs.readFileSync(target).toString();
    
    test.ok(content.indexOf('ajgenesis file preserve') >= 0);
}

exports['Preserve regions'] = function (test) {  
    var source = path.join(__dirname, 'files', 'regions.js.tpl');
    var target = path.join(__dirname, 'files', 'regions.js');
    
    test.ok(fs.existsSync(target));

    ajgenesis.fileTransform(source, target, { project: 'myproject', func: 'bar' });
    
    test.ok(fs.existsSync(target));
    
    var content = fs.readFileSync(target).toString();
    
    test.ok(content.indexOf('ajgenesis region one') >= 0);
    test.ok(content.indexOf('ajgenesis region two') >= 0);
    test.ok(content.indexOf('console.log("Region one")') >= 0);
    test.ok(content.indexOf('console.log("Region two")') >= 0);
    test.ok(content.indexOf('function bar') >= 0);
    test.ok(content.indexOf('var myproject') >= 0);
    test.ok(content.indexOf('foo: foo') >= 0);
}
