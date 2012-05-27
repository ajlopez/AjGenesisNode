
var $ = require('../')
  , assert = require('assert')
  , path = require('path');

  
 var simplemodel = $.loadModel(path.join(__dirname, 'files', 'simplemodel.json'));
 assert.ok(simplemodel);
 assert.equal(simplemodel.title, 'Model example');
 assert.equal(simplemodel.author, 'ajlopez');
 
 