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
   * The result of the evaluation.
   *
   * If set to true, this request can be cached.
   * If set to false, this request cannot be cached.
   * If left undefined, the cache will make an RFC2616 compliant decision.
   */
  this.cacheable = undefined; // deliberate

  for (var i = 0; i < arguments.length; ++i) {
    for (var key in arguments[i]) {
      this.headers[key] = arguments[i][key];
    }
  }
}
exports.EvaluationContext = EvaluationContext;

/**
 * Evaluation context for an incoming request.
 */
function RequestEvaluationContext(req) {
  EvaluationContext.call(this, req.headers);

  /** The HTTP version indicated in the request */
  this.httpVersion = req.httpVersion;

  /** The request method */
  this.method = req.method;

  /** The URL being requested */
  this.url = req.url;
}
util.inherits(RequestEvaluationContext, EvaluationContext);
exports.RequestEvaluationContext = RequestEvaluationContext;

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
