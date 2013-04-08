var LEVEL = require('./level');
var Logger = require('./logger');
var DefaultLogger = Logger.DefaultLogger;
var Route = require('./route').Route;
var LevelRoute = require('./route').LevelRoute;
var PathLevelRoute = require('./route').PathLevelRoute;
var util = require('./util');

/**
 * Coordinator, holds on to loggers and routes, allowing routes to
 *  listen to loggers, and providing convenience methods to:
 * 1. create loggers
 * 2. create routes
 * 3. disable routes
 *
 * @constructor
 */
var Redwood = function () {
  this.defaultLogger = new DefaultLogger();

  this.loggers = {};
  this.routes = [];
};

/**
 * Creates or retrieves a module local route.
 * @param {string} localPath
 */
Redwood.prototype.local = function (localPath) {
  if (!localPath) return this.defaultLogger;

  localPath = util.normalizePath_(localPath);
  var logger = this.loggers[localPath];
  if (!logger) {
    logger = this.loggers[localPath] = new Logger(localPath);
    this.handle_(logger);
  }
  return logger;
};

Redwood.prototype.consoleFn_ = console.log.bind(console);

Redwood.prototype.toConsole = function (spec) {
  var route;
  if (!spec) {
    route = new Route(this.consoleFn_);
  } else if (!spec.path) {
    route = new LevelRoute(spec.level, this.consoleFn_);
  }
  this.route_(route);
  return route;
};

/**
 * Attach all the local routes to the given logger.
 * @param {Logger} logger
 */
Redwood.prototype.handle_ = function (logger) {
  this.routes.forEach(function (route) {
    route.handle(logger);
  });
};

/**
 * Attach all the local routes to the given logger.
 * @param {Route} logger
 */
Redwood.prototype.route_ = function (route) {
  Object.keys(this.loggers).forEach(function (loggerKey) {
    route.handle(this.loggers[loggerKey]);
  }.bind(this));
  this.routes.push(route);
};

Redwood.prototype.clearRoutes = function () {
  this.routes.forEach(function (route) {
    route.clear();
  });
};


// TODO(gregp): TagRoute, TagLevelRoute

// Create the export object and assign convenience things to it.
var Redwood_ = new Redwood();
// Copy the level enum onto the return object.
Object.keys(LEVEL).forEach(function (levelName) {
  var level = LEVEL[levelName];
  Redwood_[levelName] = level;
});

Redwood_.Logger = Logger;
Redwood_.LevelRoute = LevelRoute;
Redwood_.PathLevelRoute = PathLevelRoute;
// TODO(gregp): Relies on node module cache.
module.exports = Redwood_;
