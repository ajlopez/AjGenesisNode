
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
    test.equal(model.name, "project");
    test.equal(model.description, "project description");
    test.ok(model.entities);
    test.ok(Array.isArray(model.entities));
    test.equal(model.entities.length, 2);
    test.equal(model.entities[0].name, 'customer');
    test.equal(model.entities[0].description, 'Customer');
    test.equal(model.entities[1].name, 'supplier');
    test.equal(model.entities[1].description, 'Supplier');
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
