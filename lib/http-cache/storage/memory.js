/*
 * node-http-cache.
 * Copyright © 2012 Chris Corbyn.
 *
 * See LICENSE file for details.
 */

var storage = require('../storage')
  , Storage = storage.Storage
  , util    = require('util')
  ;

var MemoryStorage = exports.MemoryStorage = function(options) {
  Storage.call(this, options);
};

util.inherits(MemoryStorage, storage.Storage);
