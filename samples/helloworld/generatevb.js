
var ajgenesis = require('../..'),
    path = require('path');

// Model to use

var model = {
	project: require('./project.json')
}

// File transform

ajgenesis.createDirectory('./build');
var templatename = path.join(__dirname, 'HelloWorldJava.tpl');
var filename = path.join(path.join(__dirname, 'build'), 'HelloWorld.vb');
ajgenesis.fileTransform(templatename, filename, model);

