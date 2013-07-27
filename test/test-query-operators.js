/*globals describe, it, before, beforeEach */

var should = require('should'),
    fmt = require('util').format,
    operators = require('eligo/query-engine/operators');
//---------------------------------------------------------------------------
// Utility Test Definer
//---------------------------------------------------------------------------
function test (symbol, name, token, tests) {
    describe(fmt('\'%s\'', symbol), function () {
        var op = operators[symbol];
        
        it('should be a function', function () {
            op.should.be.a('function');
        });
        
        it(fmt('should have a name property of \'%s\'', name), function () {
            op.name.should.equal(name);
        });

        it(fmt('should have a token of \'%s\'', token.source), function () {
            op.token.should.be.an.instanceof(RegExp);
            op.token.source.should.equal(token.source);
        });
        
        tests.
            forEach(function (args) {
                it(args[0], function () {
                    args[1](op);
                });
            });
    });
}
//---------------------------------------------------------------------------
// Suite
//---------------------------------------------------------------------------
describe('Eligo - Query - Operators', function () {
    
    test('=', 'equals', (/=/), [
        ['should return true if arguments are equal', function (op) {
            op('foo', 'foo').should.equal(true);
        }],
        ['should return false if arguments are not equal', function (op) {
            op('foo', 'bar').should.equal(false);
        }]
    ]);

    test('!=', 'notEqual', (/!=/), [
        ['should return true if arguments are not equal', function (op) {
            op('foo', 'bar').should.equal(true);
        }],
        ['should return false if arguments are equal', function (op) {
            op('foo', 'foo').should.equal(false);
        }]
    ]);
    
    test('*=', 'contains', (/\*=/), [
        ['should return true if left contains right', function (op) {
            op('foobarbaz', 'bar').should.equal(true);
        }],
        ['should return false if left does not contain right', function (op) {
            op('barbazbuz', 'foo').should.equal(false);
        }]
    ]);
    
    test('^=', 'begins', (/\^=/), [
        ['should return true if left begins with right', function (op) {
            op('foobarbaz', 'foo').should.equal(true);
        }],
        ['should return false if left does not begin with right', function (op) {
            op('barbazbuz', 'foo').should.equal(false);
        }]
    ]);
    
    test('$=', 'ends', (/\$=/), [
        ['should return true if left ends with right', function (op) {
            op('foobarbaz', 'baz').should.equal(true);
        }],
        ['should return false if left does not end with right', function (op) {
            op('barbazbuz', 'bar').should.equal(false);
        }]
    ]);
    
    test('~=', 'spaceSeparated', (/~=/), [
        ['should return true if left contains right', function (op) {
            op('foo bar baz', 'foo').should.equal(true);
            op('foo bar baz', 'bar').should.equal(true);
            op('foo bar baz', 'baz').should.equal(true);
        }],
        ['should return false if left does not contain right', function (op) {
            op('bar baz buz', 'foo').should.equal(false);
        }]
    ]);
    
    test('|=', 'dashSeparated', (/\|=/), [
        ['should return true if left equals right', function (op) {
            op('en', 'en').should.equal(true);
        }],
        ['should return true if left begins with right + \'-\'', function (op) {
            op('en-US', 'en').should.equal(true);
        }],
        ['should return false if left does not equal right', function (op) {
            op('fr', 'en').should.equal(false);
        }],
        ['should return false if left does not begin with right + \'-\'', function (op) {
            op('fr-CA', 'en').should.equal(false);
        }]
    ]);
});
