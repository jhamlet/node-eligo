/*globals describe, it, before, beforeEach */
var should = require('should'),
    nutil = require('util'),
    fmt = nutil.format,
    Rule = require('eligo/query/rule'),
    ObjectTraverse = require('objt'),
    Path = ObjectTraverse.Path;

describe('Eligo - Query - Rule', function () {
    var rule;
    
    describe('.parse(scanner)', function () {
        it('simple selector', function () {
            rule = Rule.parse('foo');
            rule.length.should.equal(1);
        });
        
        it('should throw an error if given nothing to parse', function () {
            (function () {
                Rule.parse('');
            }).should.throw;
        });
        
        it('descendent rule', function () {
            rule = Rule.parse('foo bar');
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
            rule = Rule.parse('foo > bar');
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
            rule = Rule.parse('foo ~ bar');
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
            rule = Rule.parse('foo + bar');
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
        
        it('should handle more complicated rule', function () {
            var sels;
            
            rule = Rule.parse('* foo.bar > baz[foo=foo] + baz[foo=bar] ~ buz');
            
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
    
    describe('#test(path)', function () {
        var path, cursor,
            tree = {
                type: 'foo',
                children: [
                    {
                        type: 'bar',
                        children: [
                            {
                                type: 'buz',
                                children: [
                                    {
                                        type: 'faz',
                                        children: [
                                            {
                                                type: 'fuz',
                                                children:[
                                                    { type: 'bez' },
                                                    { type: 'foo' },
                                                    { type: 'bar' }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };
            
        beforeEach(function () {
            path = new Path(new ObjectTraverse());
        });
        
        describe('descendent rule', function () {
            var rule;
            
            beforeEach(function () {
                rule = Rule.parse('foo bar');
                
                path.push(tree);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
            });
            
            it('should not pass if descendent does not match', function () {
                cursor = path.getCursor();
                rule.test(cursor).should.equal(false);
                cursor.value.should.equal(path.get(2));
            });
            
            it('should pass if descendent matches and ancestor matches', function () {
                path.pop();
                cursor = path.getCursor();
                rule.test(cursor).should.equal(true);
                cursor.value.should.equal(path.get(0));
            });

            it('should pass if descendent matches and any ancestor matches', function () {
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[2]);
                cursor = path.getCursor();
                rule.test(cursor).should.equal(true);
                cursor.value.should.equal(path.get(0));
            });
        });

        describe('child rule', function () {
            var rule;
            
            beforeEach(function () {
                path.push(tree);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
            });
            
            it('should not pass if child does not match', function () {
                rule = Rule.parse('foo > bar');

                cursor = path.getCursor();
                rule.test(cursor).should.equal(false);
                cursor.value.should.equal(path.get(2));
            });
            
            it('should pass if child matches and parent matches', function () {
                rule = Rule.parse('bar > buz');

                cursor = path.getCursor();
                rule.test(cursor).should.equal(true);
                cursor.value.should.equal(path.get(1));
            });
        });

        describe('sibling rule', function () {
            var rule;
            
            beforeEach(function () {
                path.push(tree);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[2]);
            });
            
            it('should not pass if child does not match', function () {
                rule = Rule.parse('foo ~ bez');

                cursor = path.getCursor();
                rule.test(cursor).should.equal(false);
            });
            
            it('should pass if sibling matches and other sibling matches', function () {
                rule = Rule.parse('bez ~ bar');
                
                cursor = path.getCursor();
                rule.test(cursor).should.equal(true);
            });
        });

        describe('adjacent sibling rule', function () {
            var rule;
            
            beforeEach(function () {
                path.push(tree);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[0]);
                path.push(path.tail.data.children[2]);
            });
            
            it('should not pass if child does not match', function () {
                rule = Rule.parse('foo + bez');
                
                cursor = path.getCursor();
                rule.test(cursor).should.equal(false);
            });
            
            it('should not pass if sibling matches and previous sibling does not match', function () {
                rule = Rule.parse('bez + bar');
                
                cursor = path.getCursor();
                rule.test(cursor).should.equal(false);
            });
            
            it('should pass if sibling matches and previous sibling matches', function () {
                rule = Rule.parse('foo + bar');
                
                cursor = path.getCursor();
                rule.test(cursor).should.equal(true);
            });
        });
    });
});
