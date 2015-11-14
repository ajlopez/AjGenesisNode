
var ajgenesis = require('..'),
    path = require('path'),
    fs = require('fs');

exports['load model from file'] = function (test) {
    var model = ajgenesis.loadModel(path.join(__dirname, 'files', 'simplemodel.json'));
    test.ok(model);
    test.equal(model.title, "Model example");
    test.equal(model.author, "ajlopez");
}

exports['load model from directory'] = function (test) {
    var model = ajgenesis.loadModel(path.join(__dirname, 'model'));
    
    test.ok(model);
    test.equal(model.project.name, "project");
    test.equal(model.project.description, "project description");
    test.ok(model.entities);
    test.ok(model.entities.customer);
    test.ok(model.entities.supplier);
    test.equal(model.entities.customer.name, 'customer');
    test.equal(model.entities.customer.description, 'Customer');
    test.equal(model.entities.supplier.name, 'supplier');
    test.equal(model.entities.supplier.description, 'Supplier');
}

exports['load fulll model from default folder'] = function (test) {
    var cwd = process.cwd();
    process.chdir(__dirname);
    
    try {
        var model = ajgenesis.loadModel();
        
        test.ok(model);
        test.ok(model.customer);
        test.equal(model.customer.name, 'customer');
        test.equal(model.customer.title, 'Customer');
    }
    finally {    
        process.chdir(cwd);
    }
}

exports['load model from current default folder'] = function (test) {
    var cwd = process.cwd();
    process.chdir(__dirname);
    
    try {
        var model = ajgenesis.loadModel('customer');
        
        test.ok(model);
        test.equal(model.name, 'customer');
        test.equal(model.title, 'Customer');
    }
    finally {    
        process.chdir(cwd);
    }
}

exports['save model to current default folder'] = function (test) {
    var cwd = process.cwd();
    process.chdir(__dirname);
    
    try {
        var target = path.join('ajgenesis', 'models', 'mycustomer.json');
        test.ok(!fs.existsSync(target));
        
        ajgenesis.saveModel('mycustomer', { name: 'customer', title: 'Customer' });
        
        var model = ajgenesis.loadModel('mycustomer');
        test.ok(model);
        test.equal(model.name, 'customer');
        test.equal(model.title, 'Customer');
        
        test.ok(fs.existsSync(target));
        fs.unlinkSync(target);
    }
    finally {    
        process.chdir(cwd);
    }
}

exports['get model directory from current directory'] = function (test) {
    var modeldir = ajgenesis.getModelDirectory();
    var dir = path.join('ajgenesis', 'models');
    
    test.equal(path.resolve(modeldir), path.resolve(dir));
}

exports['get model directory from test directory'] = function (test) {
    var modeldir = ajgenesis.getModelDirectory('test');
    var dir = path.join('test', 'ajgenesis', 'models');
    
    test.equal(path.resolve(modeldir), path.resolve(dir));
}

exports['create model directory'] = function (test) {
    ajgenesis.createDirectory('test', 'ajgenesis4');
    var dir = path.join('test', 'ajgenesis4');
    
    ajgenesis.createModelDirectory(dir);
    test.ok(fs.existsSync(path.join('test', 'ajgenesis4', 'ajgenesis', 'models')));
    removeDirSync(path.join('test', 'ajgenesis4'));
}

function removeDirSync(dirname) {
    var filenames = fs.readdirSync(dirname);
    
    filenames.forEach(function (filename) {
        filename = path.join(dirname, filename);
        
        if (isDirectory(filename))
            removeDirSync(filename);
        else
            removeFileSync(filename);
    });
    
    fs.rmdirSync(dirname);
}

function removeFileSync(filename) {
    fs.unlinkSync(filename);
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
