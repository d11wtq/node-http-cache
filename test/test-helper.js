/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

/* Convenience stuff for testing */
module.exports = {
  httpCache:     require('../lib/http-cache'),
  http:          require('http'),

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
