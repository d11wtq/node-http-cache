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
    var spy     = let(function(){ return sinon.spy(); })
      , handler = let(function(){ return spy(); })
      , server  = let(function(){ return httpCache.createServer(handler()); })
      , req     = let(function(){ return helper.createRequest(); })
      , res     = let(function(){ return helper.createResponse(req()); })
      ;

    describe('with a callback', function(){
      it('returns a http.Server', function(){
        assert.ok(server() instanceof http.Server);
      });

      describe('when executed', function(){
        beforeEach(function(){
          server().emit('request', req(), res());
        });

        it('invokes the callback', function(){
          assert(spy().calledWith(req(), res()));
        });
      });
    });

    describe('with another http server', function(){
      handler.let(function(){ return http.createServer(spy()); });

      describe('when executed', function(){
        beforeEach(function(){
          server().emit('request', req(), res());
        });

        it('invokes its callback', function(){
          assert(spy().calledWith(req(), res()));
        });
      });
    });
  });
});
