
var ajgenesis = require('../')
  , assert = require('assert');
  
var result = ajgenesis.transform("Hello");

assert.ok(result);
assert.equal(result, "Hello");

var result = ajgenesis.transform("Hello ${name}", { name: 'Adam' });

assert.ok(result);
assert.equal(result, "Hello Adam");
  

var result = ajgenesis.transform("<# for (var k = 1; k <= 3; k++) { #>\
${k}\
<# } #>");

assert.ok(result);
assert.equal(result, "123");
