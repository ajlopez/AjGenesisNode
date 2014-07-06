
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

exports['Transform with not defined region'] = function (test) {
    var result = ajgenesis.transform("// ajgenesis region one\r// ajgenesis region end", { });

    test.ok(result);
    test.equal(result, "// ajgenesis region one\r// ajgenesis region end");
}

exports['Transform with defined region'] = function (test) {
    var result = ajgenesis.transform("// ajgenesis region one\r// ajgenesis region end", { }, "// ajgenesis region one\rMy Code\r// ajgenesis region end");

    test.ok(result);
    test.equal(result, "// ajgenesis region one\rMy Code\r// ajgenesis region end");
}

exports['Transform with defined region and code'] = function (test) {
    var result = ajgenesis.transform("my code\r\n// ajgenesis region one\r// ajgenesis region end\n my other code", { }, "// ajgenesis region one\rMy Code\r// ajgenesis region end\n");

    test.ok(result);
    test.equal(result, "my code\r\n// ajgenesis region one\rMy Code\r// ajgenesis region end\n my other code");
}