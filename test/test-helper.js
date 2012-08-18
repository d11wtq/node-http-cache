/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

/* Convenience stuff for testing */

/**
 * Used to provide RSpec-like memoizers with let() semantics.
 *
 * @example
 *   // set the initial memo value
 *   var arr = memo().is(function(){ return []; });
 *
 *   // override the memo value
 *   arr.is(function(){ return ['a', 'b', 'c']; });
 *
 * The value can be obtained by calling arr() from inside any BDD example.
 */
var Memoizer = function() {
  var value
    , stack = []
    , invoked = false
    ;

  var memoizer = function() {
    if (!invoked) {
      value   = stack[stack.length - 1]();
      invoked = true;
    }
    return value;
  };

  var reset = function() {
    stack.pop();
    invoked = false;
    value   = undefined;
  };

  this.is = function(callback) {
    beforeEach(function() { stack.push(callback); });

    afterEach(reset);

    return memoizer;
  };

  memoizer.is = this.is;
};

/** Return a new Memoizer object */
Memoizer.memo = function() {
  return new Memoizer();
};

module.exports = {
  httpCache:     require('../lib/http-cache'),
  http:          require('http'),
  sinon:         require('sinon'),

  memo: Memoizer.memo,

  createRequest: function createRequest(method, url, headers){
    var req = new this.http.IncomingMessage();

    req.method      = method  || 'GET';
    req.url         = url     || '/';
    req.headers     = headers || {};
    req.httpVersion = '1.1';

    return req;
  },

  createResponse: function createResponse(req){
    return new this.http.ServerResponse(req);
  }
};
