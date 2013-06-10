
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
    var result = transform(content, model);
    fs.writeFileSync(target, result);
}

function transform(content, model)
{
    var tpl = template.compileTemplate(content);
    return tpl(model);
}

function createDirectory()
{
	var dirpath = arguments[0];
	if (arguments.length > 1)
		dirpath = path.join.apply(null, arguments);
	if (isDirectory(dirpath))
		return;
	fs.mkdirSync(dirpath);
}

function convert(value) {
    for (var k = 0; k < value.length; k++)
        if ("0123456789".indexOf(value[k]) < 0)
            return value;
            
    return parseInt(value);
}

function process(model, args, dirname) {
    var templatename;
    
    while (args.length) {
        var arg = args.shift();
            
        if (arg.indexOf("=") > 0) {
            var pos = arg.indexOf("=");
            var name = arg.substring(0, pos);
            var value = convert(arg.substring(pos + 1));
            model[name] = value;
            
            continue;
        }
        
        if (arg.indexOf(":") > 1) {
            var pos = arg.indexOf(":");
            var module = 'ajgenesisnode-' + arg.substring(0, pos);
            var verb = arg.substring(pos + 1);
            var modulename = path.join(module, verb + '.js');
            
            if (dirname && fs.existsSync(path.join(dirname, 'node_modules', modulename)))
                modulename = path.join(dirname, 'node_modules', modulename);
            else if (dirname && fs.existsSync(path.join('..', dirname, 'node_modules', modulename)))
                modulename = path.join('..', dirname, 'node_modules', modulename);
                
            require(modulename)(model, args, ajgenesis);
            
            break;
        }
        
        if (path.extname(arg) === '.json') {
            var newmodel = require(path.resolve(arg));
            
            Object.keys(newmodel).forEach(function (key) {
                model[key] = newmodel[key];
            });
            
            continue;
        }

        if (path.extname(arg) === '.tpl') {
            templatename = path.resolve(arg);
            
            continue;
        }
        
        if (templatename) {
            var filename = path.resolve(arg);
            fileTransform(templatename, filename, model);
            templatename = null;
            
            continue;
        }
    };
}

var ajgenesis = {
    fileTransform: fileTransform,
    transform: transform,
    createDirectory: createDirectory,
    createUuid: function() { return uuid.v4().toUpperCase(); },
    process: process
};

module.exports = ajgenesis;
