/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var helper = require('../test-helper')
  , http   = require('http')
  , assert = require('assert')
  , sinon  = helper.sinon
  , memo   = helper.memo
  ;

/**
 * Shared behaviour specs for all Storage implementations.
 */
exports.behavesLikeACacheStorage = function(storage) {
  describe('#isCacheableRequest()', function(){
    var req = memo().is(function(){ return helper.createRequest(); });

    context('without any filters added', function(){
      it('returns false', function(){
        assert(!storage().isCacheableRequest(req()));
      });
    });
  });
};
