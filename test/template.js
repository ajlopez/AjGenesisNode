
var $ = require('../lib/template.js')
  , assert = require('assert');
  
function OutputWriter() {
    this.content = '';
};

OutputWriter.prototype.write = function(text)
{
    this.content += text;
};

assert.equal(doTemplate("Hello, World"), "Hello, World");

global.x = "World";

assert.equal(doTemplate("Hello, ${x}"), "Hello, World");
assert.equal(doTemplate("1 + 2 = ${1+2}"), "1 + 2 = 3");

function doTemplate($text)
{
    var $output = new OutputWriter();
    var $template = $.compileTemplate($text);
    $template($output);
    return $output.content;
}

