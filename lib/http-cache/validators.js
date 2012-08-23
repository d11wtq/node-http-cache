/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

/**
 * Namespace to house all built-in validators.
 */
var Validators = module.exports = {};

/**
 * Guard function to ensure default validators don't clobber user filters.
 *
 * This just checks if evaluator.cacheable is already set before executing.
 */
var guard = Validators.guard = function(fn) {
  return function(req, res, evaluator) {
    if (typeof evaluator.cacheable != 'undefined')
      return;

    return fn(req, res, evaluator);
  };
};

/**
 * Checks if the request's max-age is zero, rendering it uncacheable.
 *
 * RFC 2616 Section 13.1.6.
 */
Validators.maxAgeZero = guard(function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/max-age=(0|-[0-9]+)/)) {
    evaluator.cacheable = false;
  }
});

/**
 * Checks if request cache-control states no-cache, rendering it uncacheable.
 *
 * RFC 2616 Section 14.9.
 */
Validators.noCache = guard(function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/no-cache/)) {
    evaluator.cacheable = false;
  }
});

/**
 * Checks if request cache-control states no-cache, rendering it uncacheable.
 *
 * RFC 2616 Section 14.9.
 */
Validators.noStore = guard(function(req, res, evaluator) {
  if ((evaluator.headers['cache-control'] || '').match(/no-store/)) {
    evaluator.cacheable = false;
  }
});

/**
 * Blindly make the request cacheable if the method is GET or HEAD.
 *
 * Anything else is uncacheable. RFC 2616 Section 13.9.
 *
 * This is the final validator in the listener chain.
 */
Validators.requestMethodGetOrHead = guard(function(req, res, evaluator) {
  evaluator.cacheable =
    (evaluator.method == 'GET' || evaluator.method == 'HEAD');
});

/* -- Request validators, in order */
Validators.request = [
  Validators.noCache,
  Validators.noStore,
  Validators.maxAgeZero,
  Validators.requestMethodGetOrHead
];
