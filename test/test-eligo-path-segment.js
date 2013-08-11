/*globals describe, it, before, beforeEach */
var should = require('should'),
    utils = require('protean'),
    nutil = require('util'),
    fmt = nutil.format,
    Segment = require('eligo/path/segment');

describe('Eligo - Path - Segment', function () {
    
    describe('#push()', function () {
        var segment;
        
        beforeEach(function () {
            segment = new Segment();
        });
        
        it('should add keys', function () {
            segment.keys.push('foo');
            segment.keys.length.should.equal(1);
            segment.keys[0].should.equal('foo');
            segment.keys.pending.should.equal(true);
        });
    });

    describe('#get()', function () {
        
        it('should return an object with provided keys', function () {
            var segment = new Segment(['foo', 'bar']),
                result = segment.get({
                    foo: 'foo',
                    bar: 'bar',
                    buz: 'buz'
                });
            
            result.should.have.property('foo', 'foo');
            result.should.have.property('bar', 'bar');
            result.should.not.have.property('buz');
        });

        it('should return an object with provided keys', function () {
            var segment = new Segment({from: 2, to: 4}),
                result = segment.get(utils.range(0, 9));
                
            result.should.not.have.property(0);
            result.should.not.have.property(1);
            result.should.have.property(2, 2);
            result.should.have.property(3, 3);
            result.should.have.property(4, 4);
            result.should.not.have.property(5);
            result.should.not.have.property(6);
            result.should.not.have.property(7);
            result.should.not.have.property(8);
            result.should.not.have.property(9);
        });
    });
});