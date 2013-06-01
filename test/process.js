
var ajgenesis = require('..'),
    path = require('path'),
    fs = require('fs'),
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

// Process simple model with template and file
    
var model = { };

if (!fs.existsSync('build'))
    fs.mkdirSync('build');

var targetname = path.join('build', 'simpletarget.txt');

if (fs.existsSync(targetname))
    fs.unlinkSync(targetname);

ajgenesis.process(model, [
    path.join('test', 'files', 'simplemodel.json'), 
    path.join('test', 'files', 'simpletemplate.tpl'),
    targetname]);   

assert.ok(model);
assert.ok(model.title);
assert.ok(model.author);

assert.ok(fs.existsSync(targetname));
