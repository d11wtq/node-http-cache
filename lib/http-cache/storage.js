/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

/**
 * Get an in-memory cache with sensible defaults.
 */
var defaultStorage = exports.defaultStorage = function() {
  return new exports.MemoryStorage({ memLimit: 512 });
};

/**
 * Initialize a new Storage.
 *
 * @param [Object] options
 *   a JSON object providing basic config.
 */
var Storage = exports.Storage = function(options) {
  this.options = options || {};
};

/**
 * Convenience method to be used as a guard in a @link{http.Server} handler.
 *
 * @example
 *   var storage = httpCache.storage.defaultStorage();
 *   http.createServer(function(req, res) {
 *     if (!storage.handleRequest(req, res)) {
 *       // actually handle the request
 *     }
 *   });
 *
 * If no cached resource was served, the response is patched to cache the
 * data as it is served, if needed.
 *
 * @param [http.ServerRequest] req
 *   the request to be handled
 *
 * @param [http.ServerResponse] res
 *   the response to serve
 *
 * @return [Boolean]
 *   true if a cached resource was served
 */
Storage.prototype.handleRequest = function(req, res) {
  if (this.isCacheableRequest(req)) {
    if (this.serveCached(req, res)) {
      return true;
    } else {
      this.prepareWrappers(req, res);
    }
  }

  return false;
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

exports.MemoryStorage = require('./storage/memory');
