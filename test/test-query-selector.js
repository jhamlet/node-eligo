/*globals describe, it, before, beforeEach */
var should = require('should'),
    fmt = require('util').format,
    Selector = require('eligo/query-engine/selector'),
    Scanner = require('eligo/query-engine/scanner'),
    operators = require('eligo/query-engine/operators');

describe('Eligo - Query - Selector', function () {
    var scanner,
        selector;
    
    before(function () {
        scanner = new Scanner();
    });
    
    describe('TYPE selector', function () {
        it('should match the correct attribute', function () {
            selector = new Selector('type', operators.equals, 'foo');
            selector.test({ type: 'foo' }).should.equal(true);
        });
    });
    
    describe('ID selector', function () {
        it('should match the correct attribute', function () {
            selector = new Selector('id', operators.equals, 'foo');
            selector.test({ id: 'foo' }).should.equal(true);
        });
    });
    
    describe('MEMBER selector', function () {
        it('should match the correct attribute', function () {
            selector = new Selector('foo', operators.equals, '*');
            selector.test({ foo: 'foo' }).should.equal(true);
        });
    });
    
    describe('ATTRIBUTE selector', function () {
        it('should match the correct attribute', function () {
            selector = new Selector('foo', operators.equals, 'foo');
            selector.test({ foo: 'foo' }).should.equal(true);
            selector.test(null).should.equal(false);
            selector.test().should.equal(false);
        });
    });
    
    describe('UNIVERSAL selector', function () {
        it('should match the correct attribute', function () {
            selector = new Selector('*');
            selector.test({ foo: 'foo' }).should.equal(true);
        });
    });
    
    describe('.parse()', function () {
        
        it('should parse \'type\' selector', function () {
            scanner.setSource('foo');
            selector = Selector.parse(scanner);
            selector.attribute.should.equal('type');
            selector.value.should.equal('foo');
        });
        
        it('should parse \'#id\' selector', function () {
            scanner.setSource('#foo');
            selector = Selector.parse(scanner);
            selector.attribute.should.equal('id');
            selector.value.should.equal('foo');
        });
        
        it('should parse \'.member\' selector', function () {
            scanner.setSource('.foo');
            selector = Selector.parse(scanner);
            selector.attribute.should.equal('foo');
            selector.value.should.equal('*');
        });
        
        it('should parse \'[attribute]\' selector', function () {
            scanner.setSource('[foo]');
            selector = Selector.parse(scanner);
            selector.attribute.should.equal('foo');
            selector.value.should.equal('*');
        });

        it('should parse \'[attribute=\'foo\']\' selector', function () {
            scanner.setSource('[foo=\'foo\']');
            selector = Selector.parse(scanner);
            selector.attribute.should.equal('foo');
            selector.value.should.equal('foo');
        });

        it('should parse \'[attribute=foo]\' selector', function () {
            scanner.setSource('[foo=\'foo\']');
            selector = Selector.parse(scanner);
            selector.attribute.should.equal('foo');
            selector.value.should.equal('foo');
        });
    });
});