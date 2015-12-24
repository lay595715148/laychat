laychat
=======

B/S chat by nodejs,OAuth2 SSO included

Plugins
=======

- https://github.com/lay595715148/layutil

Dependences
=======

- express
- body-parser
- cookie-parser
- cookie-session
- method-override
- socket.io
- mongodb
- memcache
- jade
- redis
- lru-cache
- node-uuid
- useragent
- mime
- underscore

Install
=======

### import mongodb data

```
mongo
mongoimport -d laysoft --directoryperdb ./data/mongodump/laysoft
```

### start server

```
node ./server.js
```
