
var ajgenesis = require('../../lib/ajgenesis.js');

// Model to use

var model =
{
	project: {
		message: "Hello, World",
		company: "ajlopez.com"
	}
}

// File transform

ajgenesis.fileTransform(__dirname + '/ModuleVb.tpl', __dirname + '/HelloWorld.vb', model);

