# HTTP/1.1 协议

## 内容综述

### 从上至下的课程安排

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

### 对工具的介绍

- 由浅至深，适时插入课程
  - 首先在演示、实验过程中必须用到的场景里简单介绍用法
  - 在需要深度掌握工具时，再次完整地介绍用法
- 涉及主要工具
  - Chrome 浏览器 Network 面板
  - WireShark
  - tcpdump

### HTTP/1 课程安排

- 自顶而下、由业务到逻辑
  - HTTP/1 协议为什么会如此设计？
    - 网络分层原理、REST 架构
  - 协议的通用规则
    - 协议格式、URI、方法与响应码概览
  - 连接与消息的路由
  - 内容协商与传输
  - cookie 的设计与问题
  - 缓存的控制

### HTTP/1 的协议升级

- 支持服务器推送消息的 WebSocket 协议
  - 建立会话
  - 消息传输
  - 心跳
  - 关闭会话
- 全面优化后的 HTTP/2.0 协议
- HTTP/2.0 必须开启的 TLS/SSL 协议

### TCP 与 IP 协议

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

### ABNF 官方文档

https://www.ietf.org/rfc/rfc5234.txt

巴科斯范式的英文缩写为 BNF，它是以美国人巴科斯(Backus)和丹麦人诺尔(Naur)的名字命名的一种形式化的语法表示方式，
用来描述语法的一种形式体系，是一种典型的元语言。又称巴科斯-诺尔形式(Backus-Naur form)。它不仅能严格地表示语法
规则，而且所描述的语法是与上下文无关的。它具有语法简单、表示明确、便于语法分析和编译的特点。


## 网络为什么要分层: OSI 模型与 TCP/IP 模型


### OSI 概念模型
![img.png](img.png)

### OSI 模型与 TCP/IP 模型对照
![img_2.png](img_2.png)

分层的优点:

- 更好的封装，上层协议不需要关心底层协议的实现

分层的缺点:

- 每一层都需要处理，性能下降


网络分层在网络报文中的体现：

![img_3.png](img_3.png)


## HTTP 解决了什么问题？

### REST架构的著名论文：
[Architectural Style and the Design of Network-based Software Architectures](https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)


### Http 协议为什么是现在这个样子？

![img_4.png](img_4.png)

Form Follows Function(形式一定是为了功能服务的)


> Web's major goal was to be a shared information space through which people and machines
> could communicate.
> 
> --Tim Berners Lee

解决 WWW 信息交互必须面对的需求:
- 低门槛
- 可扩展性：巨大的用户群体，超长的寿命
- 分布式系统下的 Hypermedia：大粒度数据的网络传输
- Internet 规模
  - 无法控制的 scalability
    - 不可预测的负载、非法格式的数据、恶意消息
    - 客户端不能保持所有服务器信息，服务器不能保持多个请求间的状态信息
  - 独立的组件部署：新老组件并存
- 向前兼容：自 1993 年起 HTTP0.9/1.0 已经被广泛使用


## 评估 Web 架构的七大关键属性

HTTP 协议应当在以下属性中取得可接受的均衡：

1. 性能 Performance: 影响高可用的关键因素
2. 可伸缩性 Scalability: 支持部署可以互相交互的大量组件
3. 简单性 Simplicity: 易理解、易实现、易验证
4. 可见性 Visibility: 对两个组件间的交互进行监视或者仲裁的能力。如缓存、分层设计等
5. 可移植性 Portability: 在不同的环境下运行的能力
6. 可靠性 Reliability: 出现部分故障时，对整体影响的程度
7. 可修改性 Modifiability: 对系统做出修改的难易程度，由可进化性、可定制性、可扩展性、可配置性、可重用性构成

### 架构属性：性能

- 网络性能 Network Performance
  - Throughput 吞吐量：小于等于带宽 bandwidth
  - Overhead 开销：首次开销、每次开销
- 用户感知到的性能 User-perceived Performance
  - Latency 延迟：发起请求到接收到响应的时间
  - Completion 完成时间：完成一个应用动作所花费的时间
- 网络效率 Network Efficiency
  - 重用缓存、减少交互次数、数据传输距离更近、COD

### 架构属性：可修改性

- 可进化性 Evolvability: 一个组件独立升级而不影响其他组件
- 可扩展性 Extensibility: 向系统添加功能，而不会影响到系统的其他部分
- 可定制性 Customizability: 临时性、定制性地更改某一要素来提供服务，不对常规客户产生影响
- 可配置性 Configurability: 应用部署后可通过修改配置提供新的功能
- 可重用性 Reusability: 组件可以不做修改在其他应用中使用

### REST 架构下的 Web

![img_5.png](img_5.png)


## 从五种架构风格推导出 HTTP 的 REST 架构

- 数据流风格 Data-flow Style
  - 优点：简单性、可进化性、可扩展性、可配置性、可重用性
- 复制风格 Replication Style
  - 优点：用户可察觉的性能、可伸缩性，网络效率、可靠性也可以得到提升
- 分层风格 Hierarchical Style
  - 优点：简单性、可进化性、可伸缩性
- 移动代码风格 Mobile Code Style
  - 优点：可移植性、可扩展性、网络效率
- 点对点风格 Peer-to-Peer Style
  - 优点：可进化性、可重用性、可扩展性、可配置性

### 数据流风格 Data-flow Style

#### 1. 管道与过滤器 Pipe and Filter, PF

每个 Filter 都有输入端和输出端，只能从输入端读取数据，处理后再从输出端产生数据
![img_6.png](img_6.png)

#### 2. 统一接口的管道与过滤器 Uniform Pipe and Filter, UPF
在 PF 上增加了统一接口的约束，所有 Filter 过滤器必须具备同样的接口

![img_7.png](img_7.png)

### 复制风格 Replication Style

#### 1. 复制仓库 Replicated Repository, RR
多个进程提供相同的服务，通过反向代理对外提供集中服务

#### 2. 缓存 $
RR 的变体，通过复制请求的结果，为后续请求复用

![img_8.png](img_8.png)

![img_9.png](img_9.png)

### 分层风格 Hierarchical Style

- 客户端服务器 Client-Server, CS
  - 由 Client 触发请求，Server 监听到请求后产生响应，Client 一直等待收到响应后，会话结束
  - 分离关注点隐藏细节，良好的简单性、可伸缩性、可进化性
- 分层系统 Layered System, LS
  - 每一层为其之上的层服务，并使用在其之下的层所提供的服务，例如 TCP/IP
- 分层客户端服务器 Layered Client-Server, LCS
  - LS + CS，例如正向代理和反向代理，从空间上分为外部层与内部层
- 无状态、客户端服务器 Client-Stateless-Server, CSS
  - 基于CS，服务器上不允许有 session state 会话状态
  - 提升了可见性、可伸缩性、可靠性，但重复数据导致降低网络性能
- 缓存、无状态、客户端服务器 Client-Cache-Stateless-Server, C$SS
  - 提升性能
- 分层、缓存、无状态、客户端服务器 Layered-Client-Cache-Stateless-Server, LC$SS
- 远程会话 Remote Session, RS
  - CS 变体，服务器保存 Application state 应用状态
  - 可伸缩性、可见性差
- 远程数据访问 Remote Data Access, RDA
  - CS 变体，Application state 应用状态同时分布在客户端与服务器
  - 巨大的数据集有可能通过迭代而减少
  - 简单性、可伸缩性差

![img_10.png](img_10.png)

### 移动代码风格 Mobile Code Style

- 虚拟机 Virtual Machine, VM
  - 分离指令与实现
- 远程求值 Remote Evaluation, REV
  - 基于 CS 的 VM, 将代码发送至服务器执行
- 按需代码 Code on Demand, COD
  - 服务器在响应中发回处理代码，在客户端执行
  - 优秀的可扩展性和可配置性，提升用户可察觉性能和网络效率
- 分层、按需代码、缓存、无状态、客户端服务器 Layered-Code-on-Demand-Client-Cache-Stateless-Server, LCODC$SS
  - LC$SS+COD
- 移动代理 Mobile Agent, MA
  - 相当于 REV+COD

### 点对点风格 Peer-to-Peer Style

- Event-based Integration, EBI
  - 基于事件集成系统，如由类似 Kafka 这样的消息系统 + 分发订阅来消除耦合
  - 优秀的可重用性、可扩展性、可进化性
  - 缺乏可理解性
  - 由于消息广播等因素造成的消息风暴，可伸缩性差
- Chiron-2, C2
  - 相当于 EBI + LCS, 控制了消息的方向, 论文 [A Component- and Message-Based Architectural Style for GUI Software](https://users.soe.ucsc.edu/~ejw/papers/c2-icse17.pdf)
- Distributed Objects, DO
  - 组件结对交互
- Brokered Distributed Objects, BDO
  - 引入名字解析组件来简化 DO, 例如 CORBA

### 风格演化

![img_11.png](img_11.png)
