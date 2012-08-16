/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var util = require('util')
  , http = require('http')
  ;

/**
 * Create a new caching server that emits request events to the given callback.
 *
 * @param [Function] handler
 *   a callback receiving req and res params
 *
 * @return [Http.Server]
 */
var createServer = exports.createServer = function(handler) {
  return http.createServer(function(req, res) { handler(req, res); });
};
