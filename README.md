# A HTTP Caching Proxy Using node.js

node-http-cache aims to provide a full-featured RFC2616-compliant HTTP caching
solution driven by node.js.

It is intended to be used in conjunction with
[node-http-proxy](https://github.com/nodejitsu/node-http-proxy), which
provides a powerful HTTP proxy without any caching. You may use
node-http-cache to add HTTP caching to any node application, however.

It looks at the HTTP requests and responses passing through the node app
and performs caching where possible (based on the headers). Multiple config
options will be available. You can think of this as a programmatic replacement
for Squid or Varnish.

I'm building this to sit in front of a high-traffic website. It will replace
our existing Varnish proxy, in the interest of flexibility and relative
complexities in our infrastructure.

## Work in Progress

This project is not ready for public use. It is still in development. It should
look something like these examples.

### Standalone, wrapping a regular node app

This will simply cache the responses from your node application.

``` javascript
var httpCache = require('http-cache');

var storage = new httpCache.FileStorage('/some/path', {some: 'options'})

httpCache.createServer(
  function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8',
                        'Cache-Control: max-age=600, public'});
    res.write('Hello World!');
    res.end();
  },
  storage
).listen(8080);
```

### In conjunction with http-proxy

This will proxy all requests to http://localhost:9000/ and cache the responses
from the proxy.

``` javascript
var httpCache = require('http-cache')
  , httpProxy = require('http-proxy')
  ;

var storage = new httpCache.FileStorage('/some/path', {some: 'options'})

httpCache.createServer(
  httpProxy.createServer(9000, 'localhost'),
  storage
).listen(8080);
```

Note that any `http.Server` instance can be wrapped in this way; http-proxy just
makes good sense for general use.
