# 用 Node.js 手写一个 DNS 服务器

https://mp.weixin.qq.com/s/Gl94ISY5N4BYyYmVT9-QFQ

![示意图](diagram.jpg)

域名解析的时候会先查询 hosts 文件，如果没查到就会请求本地 DNS 服务器，这个是 ISP 提供的，一般每个城市都有一个。

本地 DNS 服务器负责去解析域名对应的 IP，它会依次请求根域名服务器、顶级域名服务器、权威域名服务器，来拿到最终的 IP 返回给客户端。
