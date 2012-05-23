
var ajgenesis = require('../../lib/ajgenesis.js');

// Hard coded model

global.project = {
    message: "Hello, World",
    company: "ajlopez.com"
};

// File transform

ajgenesis.fileTransform(__dirname + '/ModuleVb.tpl', __dirname + '/HelloWorld.vb');

