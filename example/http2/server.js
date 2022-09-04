const http2 = require('node:http2')
const fs = require('node:fs')
const path = require('node:path')
const router = require('./router')

// Create a secure HTTP/2 server
const server = http2.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert/champis.me-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert/champis.me.pem')),
})

server.on('error', (err) => console.error(err))

// the 'stream' callback is called when a new stream is created. Or in other words,
// every time a new request is received
server.on('stream', router)

server.listen(8443, () => {
    console.log('Server running at http://localhost:8443')
})
