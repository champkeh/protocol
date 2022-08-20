# HTTP/1.1 协议

## 从上至下的课程安排

以 TCP/IP 协议栈为依托，由上至下、从应用层至基础设施介绍协议

- 应用层
  - 第 1 部分：HTTP/1.1
  - 第 2 部分：WebSocket
  - 第 3 部分：HTTP/2.0
- 应用层的安全基础设施
  - 第 4 部分：TLS/SSL
- 传输层
  - 第 5 部分：TCP
- 网络层及数据链路层
  - 第 6 部分：IP 层和以太网

## 对工具的介绍

- 由浅至深，适时插入课程
  - 首先在演示、实验过程中必须用到的场景里简单介绍用法
  - 在需要深度掌握工具时，再次完整地介绍用法
- 涉及主要工具
  - Chrome 浏览器 Network 面板
  - WireShark
  - tcpdump

## HTTP/1 课程安排

- 自顶而下、由业务到逻辑
  - HTTP/1 协议为什么会如此设计？
    - 网络分层原理、REST 架构
  - 协议的通用规则
    - 协议格式、URI、方法与响应码概览
  - 连接与消息的路由
  - 内容协商与传输
  - cookie 的设计与问题
  - 缓存的控制

## HTTP/1 的协议升级

- 支持服务器推送消息的 WebSocket 协议
  - 建立会话
  - 消息传输
  - 心跳
  - 关闭会话
- 全面优化后的 HTTP/2.0 协议
- HTTP/2.0 必须开启的 TLS/SSL 协议

## TCP 与 IP 协议

- 传输层的 TCP 协议
  - 建立连接
  - 传输数据
  - 拥塞控制
  - 关闭连接
- 网络层的 IP 协议
  - IP 报文与路由
  - 网络层其他常用协议：ICMP、ARP、RARP
  - IPv6 的区别

## 浏览器发起 HTTP 请求的典型场景

![img_1.png](img_1.png)

### HTTP 协议定义

a *stateless* application-level *request/response* protocol that uses extensible semantics and
*self-descriptive* message payloads for flexible interaction with network-based *hypertext
information* system.

一种*无状态的*、应用层的、以*请求 / 应答*方式运行的协议，它使用可扩展的语义和*自描述*消息格式，与基于网络的*超
文本信息*系统灵活地互动。

### 推荐书籍

- 《HTTPS 权威指南》
- 《TCP/IP 协议详解》

## 基于 ABNF 语义定义的 HTTP 消息格式

### ABNF (扩充巴科斯-瑙尔范式)操作符

- 空白字符: 用来分隔定义中的各个元素
- 选择 /: 表示多个规则都是可供选择的
  - start-line = request-line / status-line
- 值范围 %c##-##:
  - OCTAL = "0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" 与 OCTAL = %x30-37 等价
- 序列组合 (): 将规则组合起来，视为单个元素
- 不定量重复 m*n:
  - *元素 表示零个或更多元素: *(header-field CRLF)
  - 1*元素 表示一个或更多元素
  - 2*4元素 表示两个至四个元素
- 可选序列 []:
  - [ message-body ]

### ABNF 核心规则

|规则|形式定义|意义|
|---|---|---|
| ALPHA | %x41-5A / %x61-7A | 大写和小写 ASCII 字母 (A-Z, a-z) |
| DIGIT | %x30-39 | 数字 (0-9) |
| HEXDIG | DIGIT / "A" / "B" / "C" / "D" / "E" / "F" | 十六进制数字 (0-9, A-F, a-f) |
| DQUOTE | %x22 | 双引号 |
| SP | %x20 | 空格 |
| HTAB| %x09 | 横向制表符 |
| WSP | SP / HTAB | 空格或横向制表符 |
| LWSP | *(WSP / CRLF WSP) | 直线空白 (晚于换行) |
| VCHAR | %x21-7E | 可见(打印)字符 |
| CHAR | %x01-7F | 任何7位 US-ASCII 字符，不包括 NUL (%x00) |
| OCTET | %x00-FF | 8位数据 |
| CTL | %x00-1F / %x7F | 控制字符 |
| CR | %x0D | 回车 |
| LF | %x0A | 换行 |
| CRLF | CR LF | 互联网标准换行 |
| BIT | "0" / "1" | 二进制数字 |

### 基于 ABNF 描述的 HTTP 协议格式

HTTP-message = start-line *( header-field CRLF ) CRLF [ message-body ]

- start-line = request-line / status-line
  - request-line = method SP request-target SP HTTP-version CRLF
  - status-line = HTTP-version SP status-code SP reason-phrase CRLF
- header-field = field-name ":" OWS field-value OWS
  - OWS = *( SP / HTAB )
  - field-name = token
  - field-value = *( field-content / obs-fold )
- message-body = *OCTET
