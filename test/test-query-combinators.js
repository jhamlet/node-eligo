/*globals describe, it, before, beforeEach */
var should = require('should'),
    fmt = require('util').format,
    combinators = require('eligo/query-engine/combinators'),
    Scanner = require('eligo/query-engine/scanner');

describe('Eligo - Query - Comparators', function () {
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
        describe('.parse() ' + spec.name + ' combinators', function () {
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