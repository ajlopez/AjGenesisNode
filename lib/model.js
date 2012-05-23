
var fs = require('fs');

function loadModel(filename) {
	var content = fs.readFileSync(filename).toString();
	return JSON.parse(content);
};

exports.loadModel = loadModel;



