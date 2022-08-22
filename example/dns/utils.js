const dgram = require('dgram')

function parseHost(msg) {
    let num = msg.readUInt8(0)
    let offset = 1
    let host = ""

    while (num !== 0) {
        host += msg.subarray(offset, offset + num).toString()
        offset += num

        num = msg.readUInt8(offset)
        offset += 1

        if (num !== 0) {
            host += "."
        }
    }
    return host
}

/**
 * 转发到本地 DNS 服务器
 * @param msg
 * @param rinfo
 * @param server
 */
function forward(msg, rinfo, server) {
    const client = dgram.createSocket('udp4')

    client.on('error', (err) => {
        console.log(`client error:\n${err.stack}`)
        client.close()
    })

    client.on('message', (fbMsg, fbRinfo) => {
        server.send(fbMsg, rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.log(err)
            }
        })
        client.close()
    })

    client.send(msg, 53, '192.168.2.1', (err) => {
        if (err) {
            console.log(err)
            client.close()
        }
    })
}

function resolve(msg, rinfo) {

}

module.exports = {
    parseHost,
    forward,
    resolve,
}
