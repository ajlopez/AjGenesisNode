
var $ = require('../lib/template.js')
  , assert = require('assert');
  
var tmp = $.compileTemplate("Hello ${x}");

var output = {
	content: '',
	write: function(text) { this.content += text; }
};

var = "World";

tmp(output);

assert.equal(output.content, "Hello World");