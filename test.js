var should = require('shoulda');

var Redwood = require('./redwood');
describe('Redwood (logger)', /*function() {},*/ function () {
  it ('exists', function () {
    should.exist(Redwood);
    Redwood.local.should.be.a('function');
    Redwood.TRACE1.should.equal(8);
  });

  describe ('Redwood#local()', function () {
    var log = Redwood.local('foo.bar');
    it ('is the expected logger object', function () {
      should.exist(log);
      log.should.be.instanceOf(Redwood.Logger);
      log.path.should.eql(['foo', 'bar']);

      // Has the convenience functions according to lvl
      log.err.should.be.a('function');
      log.warning.should.be.a('function');
      log.info.should.be.a('function');
      log.debug.should.be.a('function');
      log.trace1.should.be.a('function');

      // Has the extra convenience function
      log.error.should.be.a('function');
    });

    it ('is registered as expected in Redwood', function () {
      Redwood.loggers.should.eql({ 'foo.bar': log });
      Redwood.routes.should.eql([]);
    });

    it ('is cached properly', function () {
      var log2 = Redwood.local('foo.bar');
      log.should.equal(log2);
    });
  });

  describe('PathLevelRoute#pathLevelMatches_', function() {
    var matchFn = Redwood.PathLevelRoute.pathLevelMatches_;
    function check (shouldMatch, input, mine) {
      var inStr = input ? '"' + input.join('.') + '"' : 'null';
      var myStr = mine ? '"' + mine.join('.') + '"' : 'null';
      var str = inStr + ' should ' + (shouldMatch ? '' : 'not ') +
        'match ' + myStr;
      return it(str, matchFn.bind(this, mine, input));
    }

    check(true, ['one', 'two'], null);
    check(true, ['one', 'two'], []);
    check(true, ['one', 'two'], ['one']);
    check(false, null, ['one', 'two']);
    check(false, ['one'], ['one', 'two']);
    check(false, ['one', 'meh'], ['one', 'two']);
    // TODO(gregp): more
  });

  describe('PathLevelRoute', function () {
    var log, calls;
    beforeEach(function () {
      calls = 0;
      log = Redwood.local('foo.bar');
      Redwood.consoleFn_ = function () {
        throw new Error('Called consoleFn_ before toConsole()');
      };
      log.debug('nowhereToGo');
    });

    afterEach(function () {
      Redwood.clearRoutes();
    });

    it('can reset safely', function () {
      Redwood.consoleFn_ = function (scope, one, two) {
        ++calls;
        scope.should.equal('foo.bar');
        one.should.equal('out');
      }
      var route = Redwood.toConsole();
      log.debug('out');
      calls.should.equal(1, 'Failed to call consoleFn_');

      Redwood.clearRoutes();
      log.debug('out');
      calls.should.equal(1, 'Called consoleFn_ after clearing routes');
    });

    it ('logs, enables, disables', function () {
      Redwood.consoleFn_ = function (scope, one, two) {
        ++calls;
        scope.should.equal('foo.bar');
        one.should.equal('out');
        two.should.eql({magic:true});
      }
      var route = Redwood.toConsole();
      log.debug('out', {magic:true});
      calls.should.equal(1, 'Failed to call consoleFn_');

      route.disable();
      log.debug('moo');
      calls.should.equal(1, 'Called while disabled');

      route.enable();
      log.debug('out', {magic:true});
      calls.should.equal(2, 'Failed to re-enable');
    })
  });

  // TODO(gregp): want
  // var log = require('redwood').set({
  //  path: 'on.blah.blah',
  //  tags: ['foo', 'bar'],
  //  level: DEBUG
  // });
  // log.tag('here', 'there', 'everywhere').debug('foo', bar, baz);
});
