
var $ = require('../lib/model.js')
  , assert = require('assert');

  
 var simplemodel = $.loadModel(__dirname + '/simplemodel.json');
 assert.ok(simplemodel);
 assert.equal(simplemodel.title, 'Model example');
 assert.equal(simplemodel.author, 'ajlopez');
 
 