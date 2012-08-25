/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var util = require('util');

/**
 * Base constructor for cache decision-making contexts.
 *
 * Evaluation contexts are passed to event listeners on cache storages.
 */
function EvaluationContext(/* headers, ... */) {
  /**
   * A copy of all headers used to make a decision.
   *
   * These can be modified, to change the decision.
   */
  this.headers = {};

  /**
   * The decision as to whether this request/response can be cached.
   *
   * If left undefined, the cache will make an RFC2616 compliant decision.
   */
  this.storable = undefined; // deliberate

  for (var i = 0; i < arguments.length; ++i) {
    for (var key in arguments[i]) {
      this.headers[key.toLowerCase()] = arguments[i][key];
    }
  }
}
exports.EvaluationContext = EvaluationContext;

/**
 * Set the storable flag, only if it's not already set.
 *
 * This is how you should change the storable flag, in order to avoid
 * accidentally clobbering a previous decision. If you deliberately want
 * to override an existing flag, you must set `storable` directly.
 *
 * @param [Boolean] flag
 *   the new value to set the flag to
 *
 * @return [Boolean]
 *   the new flag value, or undefined if the flag was not changed
 */
EvaluationContext.prototype.flagStorable = function(flag) {
  if (typeof this.storable != 'undefined')
    return;

  this.storable = typeof flag == 'undefined' ? true : !!flag;
};

/**
 * Evaluation context for an incoming request.
 */
function RequestEvaluationContext(req) {
  EvaluationContext.call(this, req.headers);

  /** The HTTP version indicated in the request */
  this.httpVersion = req.httpVersion;

  /** The request method */
  this.method = req.method.toUpperCase();

  /** The URL being requested */
  this.url = req.url;

  /**
   * The decision as to whether this request can be looked up in the cache.
   *
   * If left undefined, the cache will make an RFC2616 compliant decision.
   */
  this.retrievable = undefined; // deliberate
}
util.inherits(RequestEvaluationContext, EvaluationContext);
exports.RequestEvaluationContext = RequestEvaluationContext;

/**
 * Set the retrievable flag, only if it's not already set.
 *
 * This is how you should change the retrievable flag, in order to avoid
 * accidentally clobbering a previous decision. If you deliberately want
 * to override an existing flag, you must set `retrievable` directly.
 *
 * @param [Boolean] flag
 *   the new value to set the flag to
 *
 * @return [Boolean]
 *   the new flag value, or undefined if the flag was not changed
 */
RequestEvaluationContext.prototype.flagRetrievable = function(flag) {
  if (typeof this.retrievable != 'undefined')
    return;

  return this.retrievable = typeof flag == 'undefined' ? true : !!flag;
};

/**
 * Evaluation context for outgoing response.
 */
function ResponseEvaluationContext(res, statusCode, headers) {
  EvaluationContext.call(this, res._headers, headers);

  /** The HTTP status code indicated in the response */
  this.statusCode = statusCode;
}
util.inherits(ResponseEvaluationContext, EvaluationContext);
exports.ResponseEvaluationContext = ResponseEvaluationContext;
