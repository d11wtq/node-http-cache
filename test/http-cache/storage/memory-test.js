/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var helper    = require('../../test-helper')
  , shared    = require('../../support/shared-examples')
  , httpCache = helper.httpCache
  , assert    = require('assert')
  , memo      = helper.memo
  ;

describe('httpCache.storage.MemoryStorage', function(){
  var storage = memo().is(function(){
    return new httpCache.storage.MemoryStorage();
  });

  shared.behavesLikeACacheStorage(storage);

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

  it('tries to serve cache if cacheable', function(){
    var serveCachedSpy = helper.sinon.spy(storage(), 'serveCached');
    storage().handleRequest(req(), res());
    assert(serveCachedSpy.called);
  });
});
