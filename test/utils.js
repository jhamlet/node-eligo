
var utils = require('protean');

function repeat (i, fn) {
    while (i--) {
        fn();
    }
}

function benchmark (iterations, fn) {
    var then = Date.now();
    
    repeat(iterations, fn);
    
    return Date.now() - then;
}

function testName () {
    
}

utils.extend(exports, {
    repeat: repeat,
    benchmark: benchmark,
    testName: testName
});