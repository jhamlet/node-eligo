/*globals describe, it, before, beforeEach */
var should = require('should'),
    fmt = require('util').format,
    combinators = require('eligo/query-engine/combinators'),
    Selector = require('eligo/query-engine/selector'),
    Scanner = require('eligo/query-engine/scanner'),
    Jaunt = require('jaunt'),
    Path = Jaunt.Path;

describe('Eligo - QueryEngine - Combinators', function () {
    
    describe('#parse(scanner)', function () {
        var scanner;

        before(function () {
            scanner = new Scanner();
        });

        [
            {
                name: 'child',
                strings: [' > ', '>', ' >', '> ']
            },
            {
                name: 'sibling',
                strings: [' ~ ', '~', ' ~', '~ ']
            },
            {
                name: 'adjacentSibling',
                strings: [' + ', '+', ' +', '+ ']
            },
            {
                name: 'descendent',
                strings: [' ', '   ', '\t']
            }
        ].
        forEach(function (spec) {
            describe(spec.name + ' combinators', function () {
                var desc = spec.strings.
                        map(function (text) {
                            return '\'' + text +'\'';
                        }).
                        join(', ');

                it(desc, function () {
                    spec.strings.
                        forEach(function (text) {
                            scanner.setSource(text);
                            combinators.parse(scanner).
                                should.equal(combinators[spec.name]);
                        });
                });
            });
        });
    });
    
    describe('#test(path, selector)', function () {
        var path, cursor;
        
        before(function () {
            var objTree = {
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
                
            path = new Path(new Jaunt());
            path.push(objTree); // foo
            path.push(path.tail.data.children[0]); // bar
            path.push(path.tail.data.children[0]); // buz
            path.push(path.tail.data.children[0]); // faz
            path.push(path.tail.data.children[0]); // fuz
            path.push(path.tail.data.children[0]); // bez
            cursor = path.getCursor();
        });
        
        beforeEach(function () {
            cursor.ffwd();
        });

        describe('descendent combinator', function () {
            var combinator = combinators.descendent;
            
            it('should return false if parent selector test fails', function () {
                var selector = new Selector('type', '=', 'bez');
                combinator(cursor, selector).should.equal(false);
            });

            it('should return true if parent selector test passes', function () {
                var selector = new Selector('type', '=', 'bar');
                combinator(cursor, selector).should.equal(true);
                cursor.parent.should.equal(path.get(0));
            });
        });
        
        describe('child combinator', function () {
            var combinator = combinators.child;
            
            it('should return true if parent selector test passes', function () {
                var selector = new Selector('type', '=', 'fuz');
                combinator(cursor, selector).should.equal(true);
                cursor.parent.should.equal(path.get(3));
            });
        });
        
        describe('sibling selector', function () {
            var combinator = combinators.sibling;
            
            it('should return true if sibling selector test passes', function () {
                var selector = new Selector('type', '=', 'bez');
                
                path.pop();
                path.push(path.tail.data.children[2]);
                // reset the path cursor
                cursor.ffwd();
                
                combinator(cursor, selector).should.equal(true);
                cursor.parent.should.equal(path.get(3));
            });
        });

        describe('adjacent sibling selector', function () {
            var combinator = combinators.adjacentSibling;
            
            it('should return false if adjacent sibling selector test fails', function () {
                var selector = new Selector('type', '=', 'bez');
                
                combinator(cursor, selector).should.equal(false);
                cursor.parent.should.equal(path.get(3));
            });

            it('should return true if adjacent sibling selector test passes', function () {
                var selector = new Selector('type', '=', 'foo');
                
                combinator(cursor, selector).should.equal(true);
                cursor.parent.should.equal(path.get(3));
            });
        });
    });
});