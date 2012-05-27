
var template = require('simpletpl'),
	fs = require('fs'),
	path = require('path'),
	uuid = require('node-uuid');

function isFile(filename)
{
    try {
        var stats = fs.lstatSync(filename);
        return stats.isFile();
    }
    catch (err)
    {
        return false;
    }
}

function isDirectory(filename)
{
    try {
        var stats = fs.lstatSync(filename);
        return stats.isDirectory();
    }
    catch (err)
    {
        return false;
    }
}

function fileTransform(source, target, model)
{
    var content = fs.readFileSync(source).toString();
    var tpl = template.compileTemplate(content);
    var result = tpl(model);
    fs.writeFileSync(target, result);
}

function loadModel(filename) {
	var content = fs.readFileSync(filename).toString();
	return JSON.parse(content);
};

function createDirectory()
{
	var dirpath = arguments[0];
	if (arguments.length > 1)
		dirpath = path.join.apply(null, arguments);
	if (isDirectory(dirpath))
		return;
	fs.mkdirSync(dirpath);
}

exports.fileTransform = fileTransform;
exports.loadModel = loadModel;
exports.createDirectory = createDirectory;
exports.createUuid = function() { return uuid.v4().toUpperCase(); };


