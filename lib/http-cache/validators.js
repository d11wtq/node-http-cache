/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

/**
 * Namespace to house all built-in validators.
 */
var Validators = module.exports = {request: {}, response: {}};

/* -- Request validators -- */

/**
 * Checks if the request's max-age is zero, rendering it uncacheable.
 *
 * RFC 2616 Section 13.1.6.
 */
Validators.request.maxAgeZero = function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/max-age=(0|-[0-9]+)/)) {
    evaluator.flagStorable(true);
    evaluator.flagRetrievable(false);
  }
};

/**
 * Checks if request cache-control/pragma states no-cache.
 *
 * RFC 2616 Section 14.9.
 */
Validators.request.noCache = function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/no-cache/)) {
    evaluator.flagStorable(false);
    evaluator.flagRetrievable(false);
  }
  else if ((evaluator.headers['pragma'] || '') == 'no-cache') {
    evaluator.flagStorable(false);
    evaluator.flagRetrievable(false);
  }
};

/**
 * Checks if request cache-control states no-cache, rendering it uncacheable.
 *
 * RFC 2616 Section 14.9.
 */
Validators.request.noStore = function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/no-store/)) {
    evaluator.flagStorable(false);
    evaluator.flagRetrievable(false);
  }
};

/**
 * Blindly make the request cacheable if the method is GET or HEAD.
 *
 * Anything else is uncacheable. RFC 2616 Section 13.9.
 *
 * This is the final validator in the listener chain.
 */
Validators.request.methodGetOrHead = function(req, res, evaluator) {
  var flag = (evaluator.method == 'GET' || evaluator.method == 'HEAD');
  evaluator.flagStorable(flag);
  evaluator.flagRetrievable(flag);
};

/* -- Response validators -- */

/**
 * Checks if response cache-control states private, rendering it uncacheable.
 *
 * RFC 2616 Section 14.9.
 */
Validators.response.onlyPrivate = function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/private/))
    evaluator.flagStorable(false);
};

/**
 * Checks if response cache-control states no-cache, rendering it uncacheable.
 *
 * RFC 2616 Section 14.9.
 */
Validators.response.noStore = function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/no-store(?!=)/))
    evaluator.flagStorable(false);
};

/**
 * Checks if response cache-control states max-age, allowing it to be cached.
 *
 * RFC 2616 Section 14.9.
 */
Validators.response.maxAgeFuture = function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/max-age=[0-9]+/))
    evaluator.flagStorable(true);
};

var cacheableStatusCodes = {
  200: 'OK',
  203: 'Non-Authoritative Information',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  401: 'Unauthorized'
};

Validators.response.statusCodes = function(req, res, evaluator) {
  if (!(evaluator.statusCode in cacheableStatusCodes))
    evaluator.flagStorable(false);
};

/** All request validators, to be executed in order */
Validators.requestValidators = [
  Validators.request.noCache,
  Validators.request.noStore,
  Validators.request.maxAgeZero,
  Validators.request.methodGetOrHead
];

/** All response validators, to be executed in order */
Validators.responseValidators = [
  Validators.response.onlyPrivate,
  Validators.response.noStore,
  Validators.response.maxAgeFuture,
  Validators.response.statusCodes
];
