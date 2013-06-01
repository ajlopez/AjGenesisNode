
var ajgenesis = require('..'),
    path = require('path'),
    assert = require('assert');

// Process simple model
    
var model = { };

ajgenesis.process(model, [path.join('test', 'files', 'simplemodel.json')]);

assert.ok(model);
assert.ok(model.title);
assert.ok(model.author);

// Process two simple models
    
var model = { };

ajgenesis.process(model, [path.join('test', 'files', 'simplemodel.json'), path.join('test', 'files', 'simpleproject.json')]);

assert.ok(model);
assert.ok(model.title);
assert.ok(model.author);
assert.ok(model.company);
assert.ok(model.year);

