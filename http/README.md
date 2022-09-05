# http

研究 HTTP 协议的一些特性。

## 1. HSTS (HTTP Strict-Transport-Security)

用来限制网站只能通过 https 进行访问，http 请求会在浏览器端自动切换成 https，这样就避免了网络中出现 http 流量造成的中间人攻击。

### 文档

https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
