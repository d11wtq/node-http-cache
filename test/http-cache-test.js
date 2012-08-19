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
    var handlerSpy = memo().is(function(){ return sinon.spy(); })
      , storageSpy = memo().is(function(){ return { handleRequest: sinon.stub() }; })
      , handler    = memo().is(function(){ return handlerSpy(); })
      , server     = memo().is(function(){ return httpCache.createServer(handler(), storageSpy()); })
      , req        = memo().is(function(){ return helper.createRequest(); })
      , res        = memo().is(function(){ return helper.createResponse(req()); })
      ;

    it('returns a http.Server', function(){
      assert(server() instanceof http.Server);
    });

    describe('on "request" event', function(){
      beforeEach(function(){
        server().emit('request', req(), res());
      });

      describe('with a callback handler', function(){
        context('when the storage handles the event', function(){
          before(function() { storageSpy().handleRequest.returns(true); });

          it('does not invoke the callback', function(){
            assert(!handlerSpy().calledWith(req(), res()));
          });
        });

        context('when the storage does not handle the event', function(){
          before(function() { storageSpy().handleRequest.returns(false); });

          it('invokes the callback', function(){
            assert(handlerSpy().calledWith(req(), res()));
          });
        });
      });

      describe('with a delegate server', function(){
        handler.is(function(){ return http.createServer(handlerSpy()); });

        context('when the storage handles the event', function(){
          before(function() { storageSpy().handleRequest.returns(true); });

          it('does not invoke the server callback', function(){
            assert(!handlerSpy().calledWith(req(), res()));
          });
        });

        context('when the storage does not handle the event', function(){
          before(function() { storageSpy().handleRequest.returns(false); });

          it('invokes the server callback', function(){
            assert(handlerSpy().calledWith(req(), res()));
          });
        });
      });
    });
  });
});
