const http2 = require('node:http2')

const session = http2.connect("http://localhost:8443")

const req = session.request({ ':path': '/ping' })
req.end()

req.setTimeout(100, () => {
    console.log('Request timed out')
    req.close()
})

// The 'response' event is emitted when a response is received
req.on('response', (headers, flags) => {
    // The headers object is a regular object
    for (const name in headers) {
        console.log(`${name}: ${headers[name]}`)
    }
})

// To fetch the response body, we set the encoding to utf8
// we want and initialize an empty data string
req.setEncoding('utf8')

let data = ''

// The 'data' event is emitted when a chunk of data is received
req.on('data', (chunk) => {
    data += chunk
})

// The 'end' event is emitted when the response is complete
req.on('end', () => {
    console.log(`\n${data}`)

    session.close()
})

// const req2 = session.request({
//     ':path': '/send-data',
//     ':method': 'POST',
// })
//
// const sampleData = { name: 'John Doe', age: 42 }
//
// req2.write(JSON.stringify(sampleData), 'utf8')
// req2.end()
