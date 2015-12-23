
var template = require('simpletpl');
var fs = require('fs');
var	path = require('path');
var simplejson = require('simplejson');
var fsutils = require('./fsutils');

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

function convert(value) {
    for (var k = 0; k < value.length; k++)
        if ("0123456789".indexOf(value[k]) < 0)
            return value;
            
    return parseInt(value);
}

function getModelDirectory(dirname) {
    if (!dirname)
        dirname = '.';
    
    return path.join(dirname, 'ajgenesis', 'models');
}

function createModelDirectory(dirname) {
    if (!dirname)
        dirname = '.';
        
    return fsutils.createDirectory(dirname, 'ajgenesis', 'models');
}

function loadModel(name) {
    if (!name)
        return loadModel(getModelDirectory());

    if (isPlainName(name))
        name = path.join(getModelDirectory(), name + '.json');
        
    try {        
        return simplejson.load(name);
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
    
    if (name.indexOf(':') >= 0)
        return false;
        
    if (path.sep && name.indexOf(path.sep) >= 0)
        return false;
        
    if (path.delimiter && name.indexOf(path.delimiter) >= 0)
        return false;
    
    return true;
}

function setModel(model, arg) {
    var pos = arg.indexOf("=");
    var name = arg.substring(0, pos).trim();
    var value = convert(arg.substring(pos + 1).trim());

    var names = name.split('.');
    
    for (var k = 0; k < names.length - 1; k++) {
        if (model[names[k]] == null)
            model[names[k]] = { };
        
        model = model[names[k]];
    }
    
    model[names[names.length - 1]] = value;
}

function installModule(sourcedir, targetdir, cb) {
    try {
        fsutils.createDirectory(targetdir);
        createModelDirectory(targetdir);
        fsutils.copyDirectory(path.join(sourcedir, 'ajgenesis'), path.join(targetdir, 'ajgenesis'), cb);
    }
    catch (err) {
        cb(err, null);
    }    
}

function locateGlobalModule(module, dirname) {
    var oldfoldername = null;
    var foldername = dirname || __dirname;
    
    while (foldername && foldername != oldfoldername) {
        var filename = path.join(foldername, 'ajgenesisnode-' + module);
        
        if (ajgenesis.fs.exists(filename))
            return filename;

        var filename = path.join(foldername, 'ajgenesis-' + module);
        
        if (ajgenesis.fs.exists(filename))
            return filename;

        var filename = path.join(foldername, 'node-modules', 'ajgenesisnode-' + module);
        
        if (ajgenesis.fs.exists(filename))
            return filename;

        var filename = path.join(foldername, 'node-modules', 'ajgenesis-' + module);
        
        if (ajgenesis.fs.exists(filename))
            return filename;

        oldfoldername = foldername;                
        foldername = path.resolve(path.join(foldername, '..'));
    }

    return null;
}

function tryFilename(filename, model, args, cb) {
    if (fs.existsSync(filename)) {
        var gmodule = require(path.resolve(filename));
        gmodule(model, args, ajgenesis, cb);
        return true;
    }
    
    return false;
}

function tryProcessLocalModuleVerb(model, module, verb, args, cb) {
    var filename = path.join('ajgenesis', 'modules', module, verb + '.js');
    
    if (tryFilename(filename, model, args, cb))
        return true;
    
    var filename = path.join('ajgenesis', 'modules', module, verb, 'index.js');
    
    if (tryFilename(filename, model, args, cb))
        return true;
    
    return false;
}

function tryProcessLocalVerb(model, verb, args, cb) {
    var filename = path.join('ajgenesis', 'module', verb + '.js');
    
    if (tryFilename(filename, model, args, cb))
        return true;
    
    var filename = path.join('ajgenesis', 'module', verb, 'index.js');
    
    if (tryFilename(filename, model, args, cb))
        return true;
    
    return false;
}

function tryProcessGlobalVerb(model, verb, args, cb) {
    var filename = path.join(__dirname, '..', 'ajgenesis', 'module', verb + '.js');
    
    if (tryFilename(filename, model, args, cb))
        return true;
    
    var filename = path.join(__dirname, '..', 'ajgenesis', 'module', verb, 'index.js');
    
    if (tryFilename(filename, model, args, cb))
        return true;
    
    return false;
}

function tryProcessLocalRequireModuleVerb(model, module, verb, args, cb) {
    var oldfoldername = null;
    var foldername = path.resolve('.');
    
    while (foldername && foldername != oldfoldername) {
        var filename = path.join(foldername, 'node_modules', 'ajgenesisnode-' + module, verb + '.js');
        
        if (tryFilename(filename, model, args, cb))
            return true;
        
        var filename = path.join(foldername, 'node_modules', 'ajgenesisnode-' + module, verb, 'index.js');
        
        if (tryFilename(filename, model, args, cb))
            return true;

        var filename = path.join(foldername, 'node_modules', 'ajgenesis-' + module, verb + '.js');
        
        if (tryFilename(filename, model, args, cb))
            return true;
        
        var filename = path.join(foldername, 'node_modules', 'ajgenesis-' + module, verb, 'index.js');
        
        if (tryFilename(filename, model, args, cb))
            return true;

        oldfoldername = foldername;                
        foldername = path.resolve(path.join(foldername, '..'));
    }

    return false
}

function tryProcessRequireModuleVerb(model, module, verb, args, cb) {
    var modulename = 'ajgenesisnode-' + module + '/' + verb;
    
    try {
        var gmodule = require(modulename);
        gmodule(model, args, ajgenesis, cb);
        return true;
    }
    catch (ex) {
    }

    var modulename = 'ajgenesis-' + module + '/' + verb;
    
    try {
        var gmodule = require(modulename);
        gmodule(model, args, ajgenesis, cb);
        return true;
    }
    catch (ex) {
    }

    return false;
}

function tryProcessModuleVerb(model, arg, args, cb) {
    var pos = arg.indexOf(":");
    var module = arg.substring(0, pos);
    var verb = arg.substring(pos + 1);
    
    if (!isPlainName(module) || !isPlainName(verb))
        return false;
    
    if (tryProcessLocalModuleVerb(model, module, verb, args, cb))
        return true;
    if (tryProcessLocalRequireModuleVerb(model, module, verb, args, cb))
        return true;
    if (tryProcessRequireModuleVerb(model, module, verb, args, cb))
        return true;
    
    cb("Unknown module '" + module + "' or verb '" + verb + "'. Try 'npm install ajgenesisnode-" + module + "'", null);
    
    return true;
}

function tryProcessVerb(model, verb, args, cb) {
    if (!isPlainName(verb))
        return false;
    
    if (tryProcessLocalVerb(model, verb, args, cb))
        return true;
    if (tryProcessGlobalVerb(model, verb, args, cb))
        return true;
        
    cb("Unknown verb '" + verb + "'", null);
    
    return true;
}

function doProcess(model, args, cb) {
    var templatename;
    
    while (args.length) {
        var arg = args.shift();
            
        if (arg.indexOf("=") > 0) {
            setModel(model, arg);
            
            continue;
        }
        
        if (arg.indexOf(":") > 1)
            if (tryProcessModuleVerb(model, arg, args, cb))
                return;
        
        if (path.extname(arg) === '.json') {
            simplejson.load(arg, model);
            
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
        
        if (isPlainName(arg))
            if (tryProcessVerb(model, arg, args, cb))
                return;
            
        cb("Unexpected argument '" + arg + "'", null);
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

    fs: fsutils,
    
    modules: {
        locateGlobal: locateGlobalModule,
        install: installModule
    }
};

module.exports = ajgenesis;

