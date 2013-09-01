
var ajgenesis = require('../');

exports['Transform hello'] = function (test) {  
    var result = ajgenesis.transform("Hello");

    test.ok(result);
    test.equal(result, "Hello");
}

exports['Transform hello with name'] = function (test) {
    var result = ajgenesis.transform("Hello ${name}", { name: 'Adam' });

    test.ok(result);
    test.equal(result, "Hello Adam");
}

exports['Transform with for'] = function (test) { 
    var result = ajgenesis.transform("<# for (var k = 1; k <= 3; k++) { #>\
${k}\
<# } #>");

    test.ok(result);
    test.equal(result, "123");
}
