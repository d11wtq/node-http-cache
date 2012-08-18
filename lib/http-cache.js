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
  if (!handler ||
      (typeof handler != 'function' && typeof handler.emit != 'function')) {
    throw new Error('Cannot create server without a handler');
  }

  if (!cache) {
    cache = storage.defaultStorage();
  }

  return http.createServer(function(req, res) {
    if (!cache.handleRequest(req, res)) {
      if (handler.emit) { // is another server
        return handler.emit('request', req, res);
      } else {
        return handler(req, res);
      }
    }
  });
};
