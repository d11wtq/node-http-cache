/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

/* Convenience stuff for testing */

module.exports = {
  httpCache: require('../lib/http-cache'),
  http:      require('http'),
  sinon:     require('sinon'),
  memo:      require('memo-is'),

  /** Create a full stub object based on the given prototype */
  stub: function(obj, target) {
    var self = this;
    var cls = (typeof obj == 'function') ? obj.prototype : obj;
    target = target || {};

    Object.getOwnPropertyNames(cls).filter(function(p){
      return typeof cls[p] == 'function';
    }).forEach(function(p) { target[p] = self.sinon.stub() });

    return cls.__proto__ ? this.stub(cls.__proto__, target) : target;
  },

  createRequest: function createRequest(options){
    var req = new this.http.IncomingMessage();
    options = options || {};

    req.method      = options.method      || 'GET';
    req.url         = options.url         || '/';
    req.headers     = options.headers     || {};
    req.httpVersion = options.httpVersion || '1.1';

    return req;
  },

  createResponse: function createResponse(req){
    return new this.http.ServerResponse(req);
  }
};
