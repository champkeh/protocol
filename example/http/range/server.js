const express = require('express')
const {stat, createReadStream, createWriteStream} = require('fs')
const {promisify} = require('util')
const {pipeline} = require('stream')
const {resolve} = require('path')

const port = process.env.PORT || 3000
const app = express()

const sampleVideo = resolve(__dirname, "webpack.mp4")
const fileInfo = promisify(stat)

app.get('/range', async (req, res) => {
    const {size} = await fileInfo(sampleVideo)
    const range = req.headers.range
    if (range) {
        let [start, end] = range.replace(/bytes=/, "").split("-")
        start = parseInt(start, 10)
        end = end ? parseInt(end, 10) : size - 1

        if (!isNaN(start) && isNaN(end)) {
            end = size - 1
        }
        if (isNaN(start) && !isNaN(end)) {
            start = size - end
            end = size - 1
        }
        if (start >= size || end >= size) {
            res.writeHead(416, {
                "Content-Range": `bytes */${size}`
            })
            return res.end()
        }
        res.writeHead(200, {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "video/mp4",
        })
        let readable = createReadStream(sampleVideo, {start, end})
        pipeline(readable, res, err => {
            console.log(err)
        })
    } else {
        res.writeHead(200, {
            "Accept-Ranges": "bytes",
            "Content-Length": size,
            "Content-Type": "video/mp4",
        })
        let readable = createReadStream(sampleVideo)
        pipeline(readable, res, err => {
            console.log(err)
        })
    }
})

// app.get('/range2', rangeHandler)
app.use(rangeHandler)

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})

/**
 * 处理 Range 请求
 * @param req
 * @param res
 * @param next
 */
async function rangeHandler(req, res, next) {
    if (!req.headers.range) {
        // not range request, skip
        return next()
    }

    const filePath = resolve(__dirname, req.path.slice(1))
    const {size} = await fileInfo(filePath)
    const range = req.headers.range
    const group = range.replace(/bytes=/, "").split(",").map(g => g.trim())
    if (group.some(g => !g.includes('-'))) {
        // range invalid
        res.writeHead(416, {
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes */${size}`,
        }).end()
        return
    }
    const segments = []
    for (let i = 0; i < group.length; i++) {
        let [start, end] = group[i].split('-')
        start = parseInt(start, 10)
        end = parseInt(end, 10)
        if (isNaN(start) && isNaN(end)) {
            // range invalid
            res.writeHead(416, {
                "Accept-Ranges": "bytes",
                "Content-Range": `bytes */${size}`,
            }).end()
            return
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
        res.writeHead(416, {
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes */${size}`,
        }).end()
        return
    }

    if (segments.length === 1) {
        const segment = segments[0]
        res.writeHead(206, {
            "Content-Range": `bytes ${segment.start}-${segment.end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": segment.end - segment.start + 1,
            "Content-Type": "text/plain",
        })
        createReadStream(filePath, {start: segment.start, end: segment.end, autoClose: true}).pipe(res)
    } else {
        const separator = "----WebKitFormBoundarymPet0CGjZlVJGIMc"
        res.writeHead(206, {
            "Accept-Ranges": "bytes",
            "Content-Type": `multipart/byteranges; boundary=${separator}`,
        })

        for (const segment of segments) {
            res.write(`--${separator}\r\nContent-Type: text/plain\r\nContent-Range: bytes ${segment.start}-${segment.end}/${size}\r\n\r\n`)
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
