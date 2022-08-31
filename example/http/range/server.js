const express = require('express')
const {stat, createReadStream} = require('fs')
const {promisify} = require('util')
const {resolve} = require('path')
const fileInfo = promisify(stat)
const mime = require('mime')

const port = process.env.PORT || 3000
const app = express()

app.use(rangeHandler)

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})

function badRangeRequest(res, size) {
    res.writeHead(416, {
        "Accept-Ranges": "bytes",
        "Content-Range": `bytes */${size}`,
    })
    res.end()
}

/**
 * 处理 Range 请求
 */
async function rangeHandler(req, res, next) {
    if (!req.headers.range) {
        // not range request, skip
        return next()
    }

    const filePath = resolve(__dirname, req.path.slice(1))
    const {size} = await fileInfo(filePath)

    const range = req.headers.range
    console.log(range)
    if (!/^bytes=/.test(range)) {
        return badRangeRequest(res, size)
    }
    const group = range.replace(/bytes=/, "").split(",").map(g => g.trim())
    if (group.some(g => !g.includes('-'))) {
        // range invalid
        return badRangeRequest(res, size)
    }
    const segments = []
    for (let i = 0; i < group.length; i++) {
        let [start, end] = group[i].split('-')
        start = parseInt(start, 10)
        end = parseInt(end, 10)
        if (isNaN(start) && isNaN(end)) {
            // range invalid
            return badRangeRequest(res, size)
        }
        if (isNaN(start)) {
            start = size - end
            end = size - 1
        }
        if (isNaN(end)) {
            end = size - 1
        }
        segments.push({start, end})
    }

    if (segments.some(seg => (seg.start > seg.end || seg.end >= size))) {
        // range invalid
        return badRangeRequest(res, size)
    }

    const contentType = mime.getType(req.path)
    if (segments.length === 1) {
        const segment = segments[0]
        res.writeHead(206, {
            "Content-Range": `bytes ${segment.start}-${segment.end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": segment.end - segment.start + 1,
            "Content-Type": contentType,
        })
        createReadStream(filePath, {start: segment.start, end: segment.end, autoClose: true}).pipe(res)
    } else {
        const separator = "----WebKitFormBoundarymPet0CGjZlVJGIMc"
        res.writeHead(206, {
            "Accept-Ranges": "bytes",
            "Content-Type": `multipart/byteranges; boundary=${separator}`,
        })

        for (const segment of segments) {
            res.write(`--${separator}\r\nContent-Type: ${contentType}\r\nContent-Range: bytes ${segment.start}-${segment.end}/${size}\r\n\r\n`)
            await writeChunk(filePath, segment, res)
            res.write('\r\n')
        }
        res.end(`--${separator}--\r\n`)
    }
}

async function writeChunk(filePath, segment, writer) {
    return new Promise((resolve, reject) => {
        const readable = createReadStream(filePath, {start: segment.start, end: segment.end})
        readable.on('readable', () => {
            readable.read()
        })
        readable.on('data', (data) => {
            writer.write(data)
            resolve()
        })
    })
}
