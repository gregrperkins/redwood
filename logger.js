var util = require('./util');
var LEVEL = require('./level');

util.inherits = require('util').inherits;

// TODO(gregp): remove node dependency
var assert = require('assert');
var EventEmitter = require('events').EventEmitter;

/**
 * A logger, creates log events from data (or formatted strings, maybe.)
 * Loggers that are not the DefaultLogger should have scoped paths.
 *
 * @param {!string} pathString - Such as orcah.IdentifierType, perhaps.
 * @constructor
 * @extends {EventEmitter}
 */
var Logger = function (pathString) {
  assert(pathString, 'Local loggers must be created with a path.');
  this.path = util.splitPath_(pathString);
};
util.inherits(Logger, EventEmitter);

/**
 * @return {Object}
 */
Logger.prototype.createEvent_ = function () {
  return {
    path: this.path,
  };
};

/**
 * @param {LEVEL} level
 * @param {...[*]} var_args - Data to be logged.
 */
Logger.prototype.logLevelData = function (level, var_args) {
  var ev = this.createEvent_();
  ev.level = level;
  ev.data = [].slice.call(arguments, 1);
  this.emit('data', ev);
};

/**
 * @param {LEVEL} level
 * @return {function(this: Logger, ...[*])} - A function that logs the given
 *    data, which should be bound to the Logger object.
 */
Logger.logLevelAtDataFn_ = function (level) {
  return function (var_args) {
    // Inner arguments, var_args, data
    var args = [].slice.call(arguments);
    // Prepend the level, as that is the first argument to Logger#logLevelData
    args.unshift(level);
    // Here, `this` refers to an instance of Logger.
    return Logger.prototype.logLevelData.apply(this, args);
  };
};

// TODO(gregp): Logger.logDataWithTags_ = function () {
// TODO(gregp): Logger.prototype.logString = function (level, format, data) {


/**
 * The default logger, creates events without a path.
 * @constructor
 * @extends {Logger}
 */
var DefaultLogger = function () {};
util.inherits(DefaultLogger, Logger);

/** @inheritDoc */
DefaultLogger.prototype.createEvent_ = function () {
  return {};
};


// Create convenience methods on Loggers for each of the levels.
Object.keys(LEVEL).forEach(function (levelName) {
  var level = LEVEL[levelName];
  var lowercaseName = levelName.toLowerCase();
  Logger.prototype[lowercaseName] = Logger.logLevelAtDataFn_(level);
});

Logger.DefaultLogger = DefaultLogger;
module.exports = Logger;
