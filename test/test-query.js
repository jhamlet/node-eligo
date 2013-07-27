/*globals describe, it, before, beforeEach */
var should = require('should'),
    nutil = require('util'),
    fmt = nutil.format,
    QueryEngine = require('eligo/query-engine');

describe('Eligo - QueryEngine', function () {
    var engine = new QueryEngine();
    
    describe('#parse()', function () {
        
        it('should parse', function () {
            var q = engine.parse('* foo bar, * bar foo ');
        });

        it('should throw an error', function () {
            (function () {
                engine.parse('* foo bar, * bar foo, ');
            }).should.throw;
        });
    });
});