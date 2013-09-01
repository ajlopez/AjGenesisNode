
var ajgenesis = require('..'),
    path = require('path'),
    fs = require('fs');

exports['Process simple model'] = function (test) {
    var model = { };

    ajgenesis.process(model, [path.join('test', 'files', 'simplemodel.json')]);

    test.ok(model);
    test.ok(model.title);
    test.ok(model.author);
}

exports['Process two simple models'] = function (test) {   
    var model = { };

    ajgenesis.process(model, [path.join('test', 'files', 'simplemodel.json'), path.join('test', 'files', 'simpleproject.json')]);

    test.ok(model);
    test.ok(model.title);
    test.ok(model.author);
    test.ok(model.company);
    test.ok(model.year);
}

exports['Process simple model with template and file'] = function (test) {
    var model = { };

    if (!fs.existsSync('build'))
        fs.mkdirSync('build');

    var targetname = path.join('build', 'simpletarget.txt');

    if (fs.existsSync(targetname))
        fs.unlinkSync(targetname);

    ajgenesis.process(model, [
        path.join('test', 'files', 'simplemodel.json'), 
        path.join('test', 'files', 'simpletemplate.tpl'),
        targetname]);   

    test.ok(model);
    test.ok(model.title);
    test.ok(model.author);

    test.ok(fs.existsSync(targetname));
}

exports['Process simple model with name=value'] = function (test) { 
    var model = { };

    ajgenesis.process(model, ['name=Adam', 'age=800']);

    test.ok(model);
    test.ok(model.name);
    test.equal(model.name, 'Adam');
    test.ok(model.age);
    test.strictEqual(model.age, 800);
}

exports['Process task with arguments'] = function (test) { 
    test.async();
    
    var model = { };

    ajgenesis.process(model, ['name=Adam', 'age=800', path.join('test', 'tasks', 'simple.js'), 1, 2], function (err, model) {
        test.ok(model);
        test.ok(model.name);
        test.equal(model.name, 'Adam');
        test.ok(model.age);
        test.strictEqual(model.age, 800);
        test.ok(model.args);
        test.ok(Array.isArray(model.args));
        test.equal(model.args.length, 2);
        test.equal(model.args[0], 1);
        test.equal(model.args[1], 2);
        test.done();
    });
}


