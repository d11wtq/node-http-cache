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
      /* RFC 2616 Section 13.9 & 13.10 */
      context('given a GET request', function(){
        method.is(function(){ return 'GET' });

        it('evaluates as storable', function(){
          assert(evaluator().storable);
        });

        it('evaluates as retrievable', function(){
          assert(evaluator().retrievable);
        });
      });

      /* RFC 2616 Section 13.9 & 13.10 */
      context('given a HEAD request', function(){
        method.is(function(){ return 'HEAD' });

        it('evaluates as storable', function(){
          assert(evaluator().storable);
        });

        it('evaluates as retrievable', function(){
          assert(evaluator().retrievable);
        });
      });

      /* RFC 2616 Section 13.1.6 */
      context('with cache-control: max-age=0', function(){
        headers.is(function(){ return {'cache-control': 'max-age=0'} });

        it('evaluates as storable', function(){
          assert(evaluator().storable);
        });

        it('evaluates as not retrievable', function(){
          assert(!evaluator().retrievable);
        });
      });

      /* RFC 2616 Section 13.1.6 (logical, but not stated) */
      context('with cache-control: max-age < 0', function(){
        headers.is(function(){ return {'cache-control': 'max-age=-9999'} });

        it('evaluates as storable', function(){
          assert(evaluator().storable);
        });

        it('evaluates as not retrievable', function(){
          assert(!evaluator().retrievable);
        });
      });

      /* RFC 2616 Section 14.9 */
      context('with cache-control: no-cache', function(){
        headers.is(function(){ return {'cache-control': 'no-cache'} });

        it('evaluates as not storable', function(){
          assert(!evaluator().storable);
        });

        it('evaluates as not retrievable', function(){
          assert(!evaluator().retrievable);
        });
      });

      /* RFC 2616 Section 14.9 */
      context('with cache-control: no-store', function(){
        headers.is(function(){ return {'cache-control': 'no-store'} });

        it('evaluates as not storable', function(){
          assert(!evaluator().storable);
        });

        it('evaluates as not retrievable', function(){
          assert(!evaluator().retrievable);
        });
      });

      /* RFC 2616 Section 14.9 */
      context('with pragma: no-cache', function(){
        headers.is(function(){ return {'pragma': 'no-cache'} });

        it('evaluates as not storable', function(){
          assert(!evaluator().storable);
        });

        it('evaluates as not retrievable', function(){
          assert(!evaluator().retrievable);
        });
      });
    });
  });
};
