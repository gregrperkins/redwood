
var util = module.exports = {};

util.inherits = util.inherits;
util.assert = require('assert');
util.EventEmitter = require('events').EventEmitter;

util.normalizePath_ = function (pathString) {
  return pathString.replace('/', '.');
};
util.splitPath_ = function (pathString) {
  return util.normalizePath_(pathString).split('.');
};
