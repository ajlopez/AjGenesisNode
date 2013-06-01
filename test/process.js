
var ajgenesis = require('..'),
    path = require('path'),
    assert = require('assert');
    
var model = { };

ajgenesis.process(model, [path.join('test', 'files', 'simplemodel.json')]);

assert.ok(model);
assert.ok(model.title);
assert.ok(model.author);

