/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var helper    = require('../test-helper')
  , httpCache = helper.httpCache
  , http      = require('http')
  , assert    = require('assert')
  , sinon     = helper.sinon
  , memo      = helper.memo
  ;

/**
 * Shared behaviour specs for all Storage implementations.
 */
exports.behavesLikeACacheStorage = function(storage) {
  describe('on "request" event', function(){
    var method  = memo().is(function(){ return 'GET' });
    var headers = memo().is(function(){ return {} });

    var req = memo().is(function(){
      return helper.createRequest({
        method:  method(),
        headers: headers()
      });
    });

    var res = memo().is(function(){
      return helper.createResponse(req());
    });

    var evaluator = memo().is(function(){
      return new httpCache.RequestEvaluationContext(req());
    });

    beforeEach(function(){
      storage().emit('request', req(), res(), evaluator());
    });

    context('without user-defined listeners', function(){
      /* RFC 2616 Section 13.9 */
      context('given a GET request', function(){
        method.is(function(){ return 'GET' });

        it('evaluates as cacheable', function(){
          assert(evaluator().cacheable);
        });
      });

      /* RFC 2616 Section 13.9 */
      context('given a HEAD request', function(){
        method.is(function(){ return 'HEAD' });

        it('evaluates as cacheable', function(){
          assert(evaluator().cacheable);
        });
      });

      /* RFC 2616 Section 13.1.6 */
      context('with cache-control: max-age=0', function(){
        headers.is(function(){ return {'cache-control': 'max-age=0'} });

        it('evaluates as uncacheable', function(){
          assert(!evaluator().cacheable);
        });
      });
    });
  });
};
