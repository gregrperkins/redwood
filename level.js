
/**
 * @enum
 * Based on the Log levels available in Apache HTTP Server.
 * https://github.com/pquerna/node-logmagic/blob/master/lib/logmagic.js#L25-41
 */
var LEVEL = {
  EMERG   : 0,  /* system is unusable */
  ALERT   : 1,  /* action must be taken immediately */
  CRIT    : 2,  /* critical conditions */
  ERR     : 3,  /* error conditions */
  WARNING : 4,  /* warning conditions */
  NOTICE  : 5,  /* normal but significant condition */
  INFO    : 6,  /* informational */
  DEBUG   : 7,  /* debug-level messages */
  TRACE1  : 8,  /* trace-level 1 messages */
  TRACE2  : 9,  /* trace-level 2 messages */
  TRACE3  : 10, /* trace-level 3 messages */
  TRACE4  : 11, /* trace-level 4 messages */
  TRACE5  : 12, /* trace-level 5 messages */
  TRACE6  : 13, /* trace-level 6 messages */
  TRACE7  : 14, /* trace-level 7 messages */
  TRACE8  : 15, /* trace-level 8 messages */
};

// Ugh, LEVEL.ERR is pretty meh.
LEVEL.ERROR = LEVEL.ERR;

module.exports = LEVEL;
