
var ajgenesis = require('../../lib/ajgenesis.js');

// Model to use

var model = {
	project: require('./project.json')
}

// File transform

ajgenesis.fileTransform(__dirname + '/HelloWorldJava.tpl', __dirname + '/HelloWorld.java', model);

