/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var helper    = require('../../test-helper')
  , shared    = require('../../support/shared-examples')
  , httpCache = helper.httpCache
  , memo      = helper.memo
  ;

describe('httpCache.storage.MemoryStorage', function(){
  var storage = memo().is(function(){
    return new httpCache.storage.MemoryStorage();
  });

  shared.behavesLikeACacheStorage(storage);
});
