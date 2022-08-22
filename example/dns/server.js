const dgram = require('dgram')
const {parseHost, forward, resolve} = require('./utils')

const server = dgram.createSocket('udp4')

server.on('message', (msg, rinfo) => {
    // 处理 DNS 协议的消息
    const host = parseHost(msg.subarray(12))
    console.log(`query: ${host}`)

    if (/champis.me/.test(host)) {
        resolve(msg, rinfo)
    } else {
        forward(msg, rinfo, server)
    }
})

server.on('error', (err) => {
    // 处理错误
    console.log(`server error:\n${err.stack}`)
    server.close()
})

server.on('listening', () => {
    const address = server.address()
    console.log(`server listening ${address.address}:${address.port}`)
})

server.bind(53)
