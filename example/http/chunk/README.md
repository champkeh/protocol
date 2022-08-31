# Chunk传输方式

> Chunk 传输方式在 HTTP/2 中已废弃，因为 HTTP/2 提供了更高效的流传输方式。

对于不定长包体的传输，可以分多个`chunk`进行传输，涉及到3个header

- Transfer-Encoding
- Trailer
- TE

注意`Transfer-Encoding`与`Content-Encoding`的区别：
`Content-Encoding`是针对整个连接的，不管中间有多少层代理，传输的数据都是相同的`Content-Encoding`编码的，中间的代理不能修改；而`Transfer-Encoding`是针对两个节点之间的，也被称为(hop-by-hop)，每一段都可以使用不同的编码方式。
