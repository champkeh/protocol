function helloWorldHandler(stream, headers) {
    console.log(headers)
    stream.respond({
        ':status': 200,
    })

    stream.end('Hello World')
}

function pingHandler(stream, headers) {
    setTimeout(() => {
        if (stream.closed) {
            return
        }

        console.log(headers)
        stream.respond({
            ':status': 200,
        })

        stream.end('pong')
    }, 750)
}

function notFoundHandler(stream, headers) {
    console.log(headers)
    stream.respond({
        ':status': 404,
    })

    stream.end('Not Found')
}

function router(stream, headers) {
    const path = headers[':path']
    const method = headers[':method']

    let handler = notFoundHandler
    if (path === '/hello-world' && method === 'GET') {
        handler = helloWorldHandler
    } else if (path === '/ping' && method === 'GET') {
        handler = pingHandler
    }

    handler(stream, headers)
}

module.exports = router
