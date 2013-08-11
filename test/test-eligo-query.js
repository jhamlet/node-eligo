/*globals describe, it, before, beforeEach */
var should = require('should'),
    nutil = require('util'),
    tutil = require('./utils'),
    fmt = nutil.format,
    Query = require('eligo/query');

describe('Eligo - Query', function () {
    
    describe('#parse(src)', function () {
        
        it('should parse multiple rules', function () {
            var q = Query.parse('* foo bar, * bar foo ');
        });

        it('should throw an error if it encounters a bad rule', function () {
            (function () {
                Query.parse('* foo bar, * bar foo, ');
            }).should.throw;
        });
    });
    
    describe('#test()', function () {
        
    });
});