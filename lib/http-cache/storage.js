/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var Storage, MemoryStorage;

/**
 * Get an in-memory cache with sensible defaults.
 */
var defaultStorage = exports.defaultStorage = function() {
  return new MemoryStorage({ memLimit: 512 });
};

/**
 * Initialize a new Storage.
 *
 * @param [Object] options
 *   a JSON object providing basic config.
 */
Storage = exports.Storage = function(options) {
  this.options = options || {};
};

/**
 * Test if the provided request can be cached or not.
 *
 * This takes into account RFC 2616 requirements and any options set.
 *
 * @param [http.ServerRequest] req
 *   the request to check for cacheability
 *
 * @return [Boolean]
 *   true if the request can be cached
 */
Storage.prototype.isCacheableRequest = function(req) {
  var method = req.method.toUpperCase();
  /* FIXME: Actually read RFC 2616. Check the Cache-Control header */
  return (method == 'GET' || method == 'HEAD');
};

/**
 * Serve a cached resource matching this request.
 *
 * Returns true if a resource was served, or false otherwise.
 *
 * @param [http.ServerRequest] req
 *   the request to serve
 *
 * @param [http.ServerResponse] res
 *   the current, unmodified response
 *
 * @return [Boolean]
 *   true if a cached resource was served
 */
Storage.prototype.serveCached = function(req, res) {
  return false;
};

/**
 * Patch the response in order to store data, if cacheable.
 *
 * This method overrides the writeHead(), write() and end() methods.
 *
 * @param [http.ServerRequest] req
 *   the incoming request
 *
 * @param [http.ServerResponse] res
 *   the response that will be served
 */
Storage.prototype.prepareWrappers = function(req, res) {
};

/* -- Component exports -- */

MemoryStorage = exports.MemoryStorage = require('./storage/memory').MemoryStorage;
