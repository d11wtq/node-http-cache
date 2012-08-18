/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var helper    = require('./test-helper')
  , httpCache = helper.httpCache
  , http      = require('http')
  , assert    = require('assert')
  , sinon     = helper.sinon
  , let       = helper.let
  ;

describe('http-cache', function(){
  describe('#createServer()', function(){
    describe('with a callback', function(){
      var handler = let(function(){ return sinon.spy(); });
      var server  = let(function(){
        return httpCache.createServer(handler());
      });

      it('returns a http.Server', function(){
        assert.ok(server() instanceof http.Server);
      });

      describe('when executed', function(){
        var req = let(function(){ return helper.createRequest(); })
          , res = let(function(){ return helper.createResponse(req); })
          ;

        beforeEach(function(){
          server().emit('request', req(), res());
        });

        it('invokes the callback', function(){
          assert(handler().calledWith(req(), res()));
        });
      });
    });
  });
});
