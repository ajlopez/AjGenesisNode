
// Initial file

var template = require('./template.js');
var fs = require('fs');

function fileTransform(source, target)
{
    var content = fs.readFileSync(source).toString();
    var tpl = template.compileTemplate(content);
    var writer = new OutputWriter();
    tpl(writer);
    fs.writeFileSync(target, writer.content);
}

function OutputWriter() {
    this.content = '';
};

OutputWriter.prototype.write = function(text)
{
    this.content += text;
};

exports.fileTransform = fileTransform;

