/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var util    = require('util')
  , http    = require('http')
  , storage = exports.storage = require('./http-cache/storage')
  ;

/**
 * Create a new caching server that emits request events to the given callback.
 *
 * @param [Function] handler
 *   a callback receiving req and res params
 *
 * @param [Storage] storage
 *   a cache storage to use
 *
 * @return [http.Server]
 */
var createServer = exports.createServer = function(handler, cache) {
  if (!cache) {
    cache = storage.defaultStorage();
  }

  return http.createServer(function(req, res) {
    if (!cache.handleRequest(req, res)) {
      return handler(req, res);
    }
  });
};
