var util = require('./util');
util.inherits = require('util').inherits;

/** @interface */
var Route = function (callback) {
  this.callback = callback;
  this.loggers = [];
  this.enabled = true;

  // Bound so that we can unlisten easily
  this.onDataBoundFn = this.onData_.bind(this);
};

Route.prototype.onData_ = function (ev) {
  if (this.matches_(ev)) {
    this.callback.apply(this, [ev.path.join('.')].concat(ev.data));
  }
};

Route.prototype.handle = function (logger) {
  // TODO(gregp): check if it exists already
  this.loggers.push(logger);

  if (this.enabled) {
    // Handle logged data events
    logger.on('data', this.onDataBoundFn);
    // TODO(gregp): logger.on('string', function (ev) {
  }
};

Route.prototype.disable = function () {
  if (!this.enabled) return;
  this.loggers.forEach(function (logger) {
    logger.removeListener('data', this.onDataBoundFn);
  }.bind(this));
  this.enabled = false;
};

Route.prototype.clear = function () {
  this.disable();
  this.loggers = [];
};

Route.prototype.enable = function () {
  if (this.enabled) return;
  this.loggers.forEach(function (logger) {
    logger.on('data', this.onDataBoundFn);
  }.bind(this));
  this.enabled = true;
};

Route.prototype.matches_ = function (ev) {
  return true;
};

/**
 * Listens to a set of loggers, determines whether to pass things through,
 *  then takes the given action.
 */
var LevelRoute = function (level, callback) {
  this.level = level;
  LevelRoute.super_.call(this, callback);
};
util.inherits(LevelRoute, Route);

LevelRoute.prototype.matches_ = function (ev) {
  if (!LevelRoute.super_.prototype.matches_.call(ev)) return false;
  // If logged with no level, match it
  if (!ev.level) return true;
  // If logged closer to 0 (EMERG) than this level, match it
  return ev.level < this.level;
};

var PathLevelRoute = function (pathString, level, callback) {
  this.path = util.splitPath_(pathString);
  PathLevelRoute.super_.prototype.call(this, level, callback);
};

PathLevelRoute.pathLevelMatches_ = function (mine, seen) {
  if (!seen) return true;
  if (!mine) return false;
  do {
    if (!seen.length) {
      return true;
    }
    if (seen.shift() != mine.shift()) {
      return false;
    }
  } while (mine.length);
  return false;
};

PathLevelRoute.prototype.matches_ = function (ev) {
  if (!PathLevelRoute.super_.prototype.matches_.call(ev)) return false;
  return PathLevelRoute.pathLevelMatches_(this.path, ev.path);
};

module.exports.Route = Route;
module.exports.LevelRoute = LevelRoute;
module.exports.PathLevelRoute = PathLevelRoute;
