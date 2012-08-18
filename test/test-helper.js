/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

/* Convenience stuff for testing */

/**
 * Used to provide RSpec-style let(), with override support.
 */
var Memoizer = function() {
  var value
    , stack    = []
    , invoked  = false
    , reset    = function() { invoked = false; value = undefined; }
    , popStack = function() { stack.pop(); }
    ;

  this.let = function(callback) {
    var memoizer = function() {
      if (!invoked) {
        invoked = true;
        value   = callback();
      }
      return value;
    };
    memoizer.let = this.let;

    stack.push(memoizer);

    afterEach(reset);
    after(popStack);

    return memoizer;
  };
};

Memoizer.let = function(callback) {
  return new Memoizer().let(callback);
};

module.exports = {
  httpCache:     require('../lib/http-cache'),
  http:          require('http'),
  sinon:         require('sinon'),

  let: Memoizer.let,

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
