
var template = require('simpletpl');
var fs = require('fs');

function fileTransform(source, target, model)
{
    var content = fs.readFileSync(source).toString();
    var tpl = template.compileTemplate(content);
    var result = tpl(model);
    fs.writeFileSync(target, result);
}

exports.fileTransform = fileTransform;

