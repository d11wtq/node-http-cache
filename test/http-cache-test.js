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
  , memo      = helper.memo
  ;

describe('http-cache', function(){
  describe('#createServer()', function(){
    var spy     = memo().is(function(){ return sinon.spy(); })
      , handler = memo().is(function(){ return spy(); })
      , server  = memo().is(function(){ return httpCache.createServer(handler()); })
      , req     = memo().is(function(){ return helper.createRequest(); })
      , res     = memo().is(function(){ return helper.createResponse(req()); })
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
      handler.is(function(){ return http.createServer(spy()); });

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
