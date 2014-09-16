
var template = require('simpletpl'),
	fs = require('fs'),
	path = require('path');

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

function getRegions(content) {
    var result = { };
    var start = 0;
    var p = content.indexOf('ajgenesis region ', start);
    
    while (p >= 0) {
        var reg = getRegionAt(content, p);
        
        if (reg == null) {
            start = p + 1;
            p = content.indexOf('ajgenesis region ', start);
            continue;
        }
        
        result[reg.name] = reg;
        start = reg.end;
        p = content.indexOf('ajgenesis region ', start);
    }
    
    return result;
}

function getRegion(content, name) {
    var p = content.indexOf('ajgenesis region ' + name);
    
    if (p < 0)
        return null;
        
    return getRegionAt(content, p);
}

function getRegionAt(content, p) {
    var name = getName(content, p + 'ajgenesis region '.length);
    
    if (!name || name == 'end')
        return null;

    var pstart = getLine(content, p);

    var p2 = content.indexOf('ajgenesis region end', p);
    
    if (p2 < 0)
        return null;
    
    var pend = getNextLine(content, p2);
    
    return { start: pstart, end: pend, name: name, content: content.substring(pstart, pend) };
    
    function getName(content, p) {
        while (!isLetter(content[p]) && !isEoL(content[p]))
            if (!content[p] || isEoL(content[p]))
                return null;
            else
                p++;

        var name = '';
        
        while (content[p] && (isLetter(content[p]) || isDigit(content[p])))
            name += content[p++];
            
        return name;
    }
    
    function isLetter(ch) {
        return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z';
    }
    
    function isDigit(ch) {
        return ch >= '0' && ch <= '9';
    }
    
    function isEoL(ch) {
        return ch == '\r' || ch == '\n';
    }
    
    function getLine(content, p) {
        var r = p;
        
        while (r && content[r] != '\r' && content[r] != '\n')
            r--;
            
        if (content[r] == '\r' || content[r] == '\n')
            r++;
            
        return r;
    }
    
    function getNextLine(content, p) {
        var r = p;
        
        while (r && content[r] && content[r] != '\r' && content[r] != '\n')
            r++;
            
        if (content[r] == '\r')
            r++;
            
        if (content[r] == '\n')
            r++;
        
        return r;
    }
}
    
function replaceRegion(name, content, region) {
    var reg = getRegion(content, name);
    
    if (!reg)
        return content;
        
    return content.substring(0, reg.start) + region + content.substring(reg.end);
}

function preserveRegions(content, oldcontent)
{
    var regions = getRegions(oldcontent);
    
    for (var n in regions)
        content = replaceRegion(n, content, regions[n].content);
        
    return content;
}

function fileTransform(source, target, model)
{
    var content = fs.readFileSync(source).toString();
    var oldcontent = null;
    
    if (fs.existsSync(target)) {
        oldcontent = fs.readFileSync(target).toString();
        if (oldcontent.indexOf('ajgenesis file preserve') >= 0)
            return;
    }
    
    var result = transform(content, model, oldcontent);

    if (result == oldcontent)
        return;
    
    console.log('Generating', target);

    fs.writeFileSync(target, result);
}

function transform(content, model, oldresult)
{
    var tpl = template.compileTemplate(content);
    var result = tpl(model);

    if (oldresult)
        result = preserveRegions(result, oldresult);
    
    return result;
}

function createDirectory()
{
	var dirpath;
    
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

function getModelDirectory(dirname) {
    if (!dirname)
        dirname = '.';
    
    return path.join(dirname, 'ajgenesis', 'models');
}

function createModelDirectory(dirname) {
    if (!dirname)
        dirname = '.';
        
    return createDirectory(dirname, 'ajgenesis', 'models');
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
    if (!name)
        return loadModel(getModelDirectory());
        
    if (isPlainName(name))
        return loadModel(path.join(getModelDirectory(), name + '.json'));
        
    if (isDirectory(name)) {
        var newname = getModelDirectory(name);
        if (isDirectory(newname))
            return loadModelFromDirectory(newname);
            
        return loadModelFromDirectory(name);
    }

    try {
        return require(path.resolve(name));
    }
    catch (ex) {
        return { }
    }
}

function saveModel(name, model) {
    if (isPlainName(name))
        return saveModel(path.join(getModelDirectory(), name + '.json'), model);
        
    var content = JSON.stringify(model, null, 4);
    fs.writeFileSync(name, content);
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
            
            var oldfoldername = null;
            var foldername = path.resolve('.');
            
            while (foldername && foldername != oldfoldername) {
                var filename = path.join(foldername, 'node_modules', 'ajgenesisnode-' + module, verb + '.js');
                
                if (fs.existsSync(filename)) {
                    var gmodule = require(path.resolve(filename));
                    gmodule(model, args, ajgenesis, cb);
                    return;
                }
                
                oldfoldername = foldername;                
                foldername = path.resolve(path.join(foldername, '..'));
            }
            
            var modulename = 'ajgenesisnode-' + module + '/' + verb;
            
            try {
                var gmodule = require(modulename);
                gmodule(model, args, ajgenesis, cb);
                return;
            }
            catch (ex) {
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
            
            var filename = path.join(__dirname, '..', 'tasks', arg + '.js');

            if (fs.existsSync(filename)) {
                var gmodule = require(path.resolve(filename));
                gmodule(model, args, ajgenesis, cb);
                return;
            }
            
            cb("Unknown task '" + arg + "'", null);

            return;
        }
    };
}

var ajgenesis = {
    fileTransform: fileTransform,
    transform: transform,
    
    process: doProcess,

    loadModel: loadModel,
    saveModel: saveModel,
    
    getModelDirectory: getModelDirectory,
    createModelDirectory: createModelDirectory,

    createDirectory: createDirectory,
    copyFile: copyFile,
    copyDirectory: copyDirectory
};

module.exports = ajgenesis;
