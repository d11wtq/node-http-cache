<img src="https://raw.github.com/d11wtq/node-http-cache/master/cash.jpg"
  alt="Cash" title="You say cache, I say cache" />

(**WARNING:** This is probably abandonware. I may pick the project back up, but I can't say for certain, or say when).

# A HTTP Caching Proxy Using Node.js

This is a NPM module for Node.js, to add real HTTP caching (as if it were
a standalone cache, like Squid or Varnish) to any Node application.  It
watches incoming requests and outgoing responses and intervenes where needed.

Primarily this is intended to be used in conjunction with something like
[node-http-proxy](https://github.com/nodejitsu/node-http-proxy), which
provides a powerful HTTP proxy without any caching. You may use
node-http-cache to add HTTP caching to any Node.js application, however.

The storage implementation itself is abstract, which means you can add your
own, or use a mix of the built-in ones (file-based and/or memory based).

The API is designed to be simple, yet powerful, so that rather than learning
several hundred obscure configuration options, you can just write filters
that instruct the cache how to behaves under specific scenarios.  The
defaults are RFC 2616 compliant.

## Why?

I work for Flippa.com (born from SitePoint.com). We currently use Varnish
as a caching proxy and a HTTP router, to serve between three different
backends transparently. Varnish is awesome, except when it's not. The more
complex our caching needs become, the more 'dity hacks' we're having to add
to our Varnish configuration. Node.js lends itself to lightweight gateway
services, so I wanted to explore a solution that gives us everything Varnish
does and more. You can already do load-balancing, proxying and SSL unwrapping
in Node.js. Decent caching is the missing piece of the puzzle. I mean HTTP
caching, not a generic cache with get/set methods.

## Work in Progress

This project is not ready for public use. It is still in development and
currently just in the code-spike stage of development. The general sense of
the shape of the API is coming together, however, so I imagine that real work
will begin very soon.  Here's an outside perspective of the way it will feel.

### Used in place of `http.createServer()`

``` javascript
var httpCache = require('http-cache')
  , storage = new httpCache.storage.FileStorage({some: 'options'})
  ;

// the the handler function will only be invoked every 600 seconds, as the
// storage will provide the response for 600 seonds at a time
httpCache.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',
                      'Cache-Control: max-age=600, public'});
  res.write('This response was generated at ' + new Date());
  res.end();
}, storage).listen(8080);
```

### Used to wrap an existing `http.Server`

Anything that responds to a 'request' event with the request and response
objects as callback arguments can be wrapped with the cache. This looks just
like the first example, except that the argument to `httpCache.createServer()`
is another server. You *must* call `listen()` on the http-cache instance, not
on the actual server, however.

``` javascript
var httpCache = require('http-cache')
  , http      = require('http')
  , storage = new httpCache.storage.FileStorage({some: 'options'})
  ;

// the the handler function will only be invoked every 600 seconds, as the
// storage will provide the response for 600 seonds at a time
var server = http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',
                      'Cache-Control: max-age=600, public'});
  res.write('This response was generated at ' + new Date());
  res.end();
});

httpCache.createServer(server, storage).listen(8080);
```

### Used In conjunction with http-proxy

The http-proxy module provides a `http.Server`, so the above example works
if you replace `server` with the proxy.

This will proxy all requests to http://localhost:9000/ *and* cache the responses
from the proxy.

``` javascript
var httpCache = require('http-cache')
  , httpProxy = require('http-proxy')
  , storage = new httpCache.storage.FileStorage({some: 'options'})
  ;

httpCache.createServer(
  httpProxy.createServer(9000, 'localhost'),
  storage
).listen(8080);
```

### Used from inside another server

If you don't want the cache to listen for you, and prefer to integrate it
yourself, this is easily achieved by using `storage.handleRequest()` from
inside any other server. You get a lot of flexibility here, since you can
conditionally use the cache.

``` javascript
var httpCache = require('http-cache')
  , http      = require('http')
  , storage = new httpCache.storage.FileStorage({some: 'options'})
  ;

// the the handler function will only be invoked every 600 seconds, as the
// storage will provide the response for 600 seonds at a time
http.createServer(function(req, res) {
  if (storage.handleRequest(req, res)) {
    return; // cache intercepted the request
  }

  res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',
                      'Cache-Control: max-age=600, public'});
  res.write('This response was generated at ' + new Date());
  res.end();
}).listen(8080);
```

### Fine-grained control using events

Cache storages in http-cache are EventEmitters. Before decisions are made
about whether or not to perform caching, events are emitted allowing you to
change the default behaviour.

Here's an example of a classic problem—ignoring cookies. Ordinarily, a
well-reasoned cache will not cache any response if the request contains a
Cookie header, or if the response contains a Set-Cookie header. In Varnish,
you actually need to modify the request and the response, which can have
undesirable side-effects. With http-cache, the data used to do the decision
making is distinct from the request and response objects themselves. While you
have access to the request and the response—and you are free to modify
them—the actual decision is based on an evaluation context passed in the
emitted events.

In order to store a response in the cache storage, two things must be set true

  1. The request evaluator must be flagged as `storable = true`
  2. Likewise, the response evaluator must be flagged `storable = true`

In order to serve an existing cached response, just one thing must be true

  1. The request evaluator must be flagged as `retrievable = true`

Leaving any of these flags undefined allows the cache to follow its default,
RFC 2616-compliant behaviour. Note that even if a request evaluator is flagged
`retrievable`, the cache may still need to talk to the origin server, if no
data has yet been cached.

Here we get the cache to ignore cookies, but don't screw around with the actual
cookie headers.

``` javascript
/*
 If we remove the cookie headers, the cache won't consider them.
 Note that the request and response sent to/from the browser remain unchanged.
 */

storage.on('request', function(req, res, evaluator) {
  delete evaluator.headers['cookie'];
});

storage.on('response', function(req, res, evaluator) {
  delete evaluator.headers['set-cookie'];
});
```

You may also expressly force or deny caching by setting `evaluator.storable`
to true or false. Unless you are certain, you should not set this manually,
however, since it is final and conclusive—the cache won't make it's own
decision if you decide for it.

Let's say that if you're browsing from a particular IP address the cache
should be completely disabled.

``` javascript
/*
 We create a closure here only for convenience, if we wanted to add other IPs.
 Of course, you could just write the callbacks by hand.
 */

function disableFor(ip) {
  return function(req, res, evaluator) {
    if (req.connection.remoteAddress == ip) {
      evaluator.flagStorable(false);
      evaluator.flagRetrievable(false);
    }
  };
}

storage.on('request', disableFor(officeIp));
```

In the above example, since the cache determines as not-storable result as
soon as the request comes in, the response is not even checked for
cacheability.

This is one of the selling points of a caching proxy written in
Node.js—flexibility. Writing things like this in configuration files with
custom formats gets twisty very quickly.

## License & Copyright

Licensed under the MIT license. Please refer to the LICENSE file for details.
