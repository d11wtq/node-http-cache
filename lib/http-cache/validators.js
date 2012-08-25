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
 * Checks if the request's max-age is zero, rendering it uncacheable.
 *
 * RFC 2616 Section 13.1.6.
 */
Validators.maxAgeZero = function(req, res, evaluator) {
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
Validators.noCache = function(req, res, evaluator) {
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
Validators.noStore = function(req, res, evaluator) {
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
Validators.requestMethodGetOrHead = function(req, res, evaluator) {
  var flag = (evaluator.method == 'GET' || evaluator.method == 'HEAD');
  evaluator.flagStorable(flag);
  evaluator.flagRetrievable(flag);
};

/** All request validators, to be executed in order */
Validators.request = [
  Validators.noCache,
  Validators.noStore,
  Validators.maxAgeZero,
  Validators.requestMethodGetOrHead
];
