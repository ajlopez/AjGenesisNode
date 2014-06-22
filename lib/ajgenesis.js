
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
    
    if (fs.existsSync(target)) {
        var oldcontent = fs.readFileSync(target).toString();
        if (content == oldcontent)
            return;
        if (oldcontent.indexOf('ajgenesis file preserve') >= 0)
            return;
    }

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
    
    for (var k = 0; k < arguments.length; k++) {
        if (k)
            dirpath = path.join(dirpath, arguments[k]);
        else
            dirpath = arguments[k];
            
        if (!isDirectory(dirpath))
            fs.mkdirSync(dirpath);
    }
}

function copyDirectory(source, target, cb) {
    createDirectory(target);
    
    fs.readdir(source, function (err, filenames) {
        if (err) {
            cb(err);
            return;
        }
        
        processFile();
        
        function processFile() {
            if (!filenames.length) {
                cb();
                return;
            }
            
            var filename = filenames.shift();
            var sourcefilename = path.join(source, filename);
            var targetfilename = path.join(target, filename);
            
            if (isFile(sourcefilename))
                copyFile(sourcefilename, targetfilename, function (err, result) {
                    if (err)
                        cb(err);
                    else
                        processFile();
                });
            else
                copyDirectory(sourcefilename, targetfilename, function (err, result) {
                    if (err)
                        cb(err);
                    else
                        processFile();
                });
        }            
    });
}

// from http://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js

function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    
    rd.on("error", function(err) {
        done(err);
    });
    
    var wr = fs.createWriteStream(target);
    
    wr.on("error", function(err) {
        done(err);
    });
    
    wr.on("close", function(ex) {
        done();
    });
    
    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

function convert(value) {
    for (var k = 0; k < value.length; k++)
        if ("0123456789".indexOf(value[k]) < 0)
            return value;
            
    return parseInt(value);
}

function mergeModels(model, submodel) {
    Object.keys(submodel).forEach(function (name) {        
        if (!model[name] && Array.isArray(submodel[name]))
            model[name] = [];
        
        if (!model[name]) {
            model[name] = submodel[name];
            return;
        }
        
        if (Array.isArray(model[name]) && Array.isArray(submodel[name])) {
            submodel[name].forEach(function (item) {
                model[name].push(item);
            });
        }
    });
}

function loadModelFromDirectory(dirname) {
    var model = { };
    
    fs.readdirSync(dirname).forEach(function (filename) {
        if (isDirectory(filename))
            return;
            
        if (path.extname(filename) != '.json')
            return;
            
        filename = path.join(dirname, filename);
        
        var submodel = loadModel(filename);
        
        mergeModels(model, submodel);
    });
    
    return model;
}

function loadModel(name) {
    if (isPlainName(name))
        return loadModel(path.join('ajgenesis', 'models', name + '.json'));
        
    if (isDirectory(name))
        return loadModelFromDirectory(name);
        
    return require(path.resolve(name));
}

function isPlainName(name) {
    if (name.indexOf('.') >= 0)
        return false;
        
    if (path.sep && name.indexOf(path.sep) >= 0)
        return false;
        
    if (path.delimiter && name.indexOf(path.delimiter) >= 0)
        return false;
    
    return true;
}

function doProcess(model, args, cb) {
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
            var module = arg.substring(0, pos);
            var verb = arg.substring(pos + 1);
            var filename = path.join('ajgenesis', 'modules', module, verb + '.js');
            
            if (fs.existsSync(filename)) {
                var gmodule = require(path.resolve(filename));
                gmodule(model, args, ajgenesis, cb);
                return;
            }

            var filename = path.join('node_modules', 'ajgenesisnode-' + module, verb + '.js');
            
            if (fs.existsSync(filename)) {
                var gmodule = require(path.resolve(filename));
                gmodule(model, args, ajgenesis, cb);
                return;
            }

            var filename = path.join(__dirname, '..', 'node_modules', 'ajgenesisnode-' + module, verb + '.js');
            
            if (fs.existsSync(filename)) {
                var gmodule = require(path.resolve(filename));
                gmodule(model, args, ajgenesis, cb);
                return;
            }

            var filename = path.join(__dirname, '..', '..', 'ajgenesisnode-' + module, verb + '.js');
            
            if (fs.existsSync(filename)) {
                var gmodule = require(path.resolve(filename));
                gmodule(model, args, ajgenesis, cb);
                return;
            }
            
            console.log("Unknown module '" + module + "' or task '" + verb + "'. Try 'npm install ajgenesisnode-" + module + "'");
            
            return;
        }
        
        if (path.extname(arg) === '.json') {
            var newmodel = require(path.resolve(arg));
            
            mergeModels(model, newmodel);
            
            continue;
        }
        
        if (path.extname(arg) === '.js') {
            var gmodule = require(path.resolve(arg));
            
            gmodule(model, args, ajgenesis, cb);
            
            return;
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
        
        if (arg.indexOf(".") < 0 && arg.indexOf(":") < 0) {
            var filename = path.join('ajgenesis', 'tasks', arg + '.js');

            if (fs.existsSync(filename)) {
                var gmodule = require(path.resolve(filename));
                gmodule(model, args, ajgenesis, cb);
                return;
            }
            
            console.log("Unknown task '" + arg + "'");

            return;
        }
    };
}

var ajgenesis = {
    fileTransform: fileTransform,
    transform: transform,
    createDirectory: createDirectory,
    createUuid: function() { return uuid.v4().toUpperCase(); },
    process: doProcess,
    loadModel: loadModel,
    copyFile: copyFile,
    copyDirectory: copyDirectory
};

module.exports = ajgenesis;
