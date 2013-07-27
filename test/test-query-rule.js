/*globals describe, it, before, beforeEach */
var should = require('should'),
    nutil = require('util'),
    fmt = nutil.format,
    Rule = require('eligo/query-engine/rule'),
    Scanner = require('eligo/query-engine/scanner');

describe('Eligo - Query - Rule', function () {
    var scanner = new Scanner(),
        rule;
    
    describe('.parse()', function () {
        it('simple selector', function () {
            scanner.setSource('foo');
            rule = Rule.parse(scanner);
            rule.length.should.equal(1);
        });
        
        it('should throw an error if given nothing to parse', function () {
            scanner.setSource('');
            (function () {
                Rule.parse(scanner);
            }).should.throw;
        });
        
        it('descendent rule', function () {
            scanner.setSource('foo bar');
            rule = Rule.parse(scanner);
            rule.length.should.equal(3);
            rule.get(0).attribute.should.equal('type');
            rule.get(0).operator.name.should.equal('equals');
            rule.get(0).value.should.equal('foo');
            rule.get(1).should.be.a('function');
            rule.get(1).name.should.equal('descendent');
            rule.get(2).attribute.should.equal('type');
            rule.get(2).operator.name.should.equal('equals');
            rule.get(2).value.should.equal('bar');
        });

        it('child rule', function () {
            scanner.setSource('foo > bar');
            rule = Rule.parse(scanner);
            rule.length.should.equal(3);
            rule.get(0).attribute.should.equal('type');
            rule.get(0).operator.name.should.equal('equals');
            rule.get(0).value.should.equal('foo');
            rule.get(1).should.be.a('function');
            rule.get(1).name.should.equal('child');
            rule.get(2).attribute.should.equal('type');
            rule.get(2).operator.name.should.equal('equals');
            rule.get(2).value.should.equal('bar');
        });

        it('sibling rule', function () {
            scanner.setSource('foo ~ bar');
            rule = Rule.parse(scanner);
            rule.length.should.equal(3);
            rule.get(0).attribute.should.equal('type');
            rule.get(0).operator.name.should.equal('equals');
            rule.get(0).value.should.equal('foo');
            rule.get(1).should.be.a('function');
            rule.get(1).name.should.equal('sibling');
            rule.get(2).attribute.should.equal('type');
            rule.get(2).operator.name.should.equal('equals');
            rule.get(2).value.should.equal('bar');
        });

        it('adjacent sibling rule', function () {
            scanner.setSource('foo + bar');
            rule = Rule.parse(scanner);
            rule.length.should.equal(3);
            rule.get(0).attribute.should.equal('type');
            rule.get(0).operator.name.should.equal('equals');
            rule.get(0).value.should.equal('foo');
            rule.get(1).should.be.a('function');
            rule.get(1).name.should.equal('adjacentSibling');
            rule.get(2).attribute.should.equal('type');
            rule.get(2).operator.name.should.equal('equals');
            rule.get(2).value.should.equal('bar');
        });
        
        it('should more complicated', function () {
            var sels;
            
            scanner.setSource('* foo.bar > baz[foo=foo] + baz[foo=bar] ~ buz');
            rule = Rule.parse(scanner);
            
            sels = rule.toArray();
            sels.length.should.equal(12);
            
            sels[0].attribute.should.equal('*');
            sels[1].should.be.a('function');
            sels[1].name.should.equal('descendent');
            sels[2].attribute.should.equal('type');
            sels[2].value.should.equal('foo');
            sels[3].attribute.should.equal('bar');
            sels[3].value.should.equal('*');
            sels[4].should.be.a('function');
            sels[4].name.should.equal('child');
            sels[5].attribute.should.equal('type');
            sels[5].value.should.equal('baz');
            sels[6].attribute.should.equal('foo');
            sels[6].value.should.equal('foo');
            sels[7].should.be.a('function');
            sels[7].name.should.equal('adjacentSibling');
            sels[8].attribute.should.equal('type');
            sels[8].value.should.equal('baz');
            sels[9].attribute.should.equal('foo');
            sels[9].value.should.equal('bar');
            sels[10].should.be.a('function');
            sels[10].name.should.equal('sibling');
            sels[11].attribute.should.equal('type');
            sels[11].value.should.equal('buz');
        });
    });
    
});
