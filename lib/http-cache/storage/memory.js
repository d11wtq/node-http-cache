/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var storage = require('../storage')
  , util    = require('util')
  , Storage = storage.Storage
  ;

var MemoryStorage = module.exports = function(options) {
  Storage.call(this, options);
};

util.inherits(MemoryStorage, Storage);
