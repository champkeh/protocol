# 如何确定请求的`Content-Type`?

`express`是采用的[mime](https://www.npmjs.com/package/mime)包，算法如下：
```js
const mime = require('mime')

function setContentType(res, path) {
    if (res.getHeader('Content-Type')) return

    const type = mime.lookup(path)

    if (!type) {
        debug('no content-type')
        return
    }

    const charset = mime.charsets.lookup(type)

    debug('content-type %s', type)
    res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''))
}
```

`mime.lookup`方法如下：
```js
/**
 * Lookup a mime type based on extension
 */
Mime.prototype.lookup = function(path, fallback) {
  const ext = path.replace(/^.*[\.\/\\]/, '').toLowerCase();

  return this.types[ext] || fallback || this.default_type;
};
```

`mime.charsets.lookup`方法如下：
```js
mime.charsets = {
  lookup: function(mimeType, fallback) {
    // Assume text types are utf8
    return (/^text\/|^application\/(javascript|json)/).test(mimeType) ? 'UTF-8' : fallback;
  }
};
```

从上面的代码可以知道，`express`的`static`方法设置`Content-Type`是通过文件扩展名实现的。
