
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
