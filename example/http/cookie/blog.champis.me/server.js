const express = require('express')
const path = require('path')
const https = require('https')
const fs = require('fs')

const port = 3003
const app = express()

app.use(express.static(path.resolve(__dirname, 'static')))

app.get('/cookie', (req, res, next) => {
    res.cookie('champis.me-uid', '123', {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'none',
    })
    res.send('<a href="/">回首页</a>')
    res.end()
})

app.get('/prefix-secure', (req, res, next) => {
    res.cookie('__Secure-uid', '123', {
        secure: true,
        // domain: 'champis.me',
    })
    res.send('<a href="/">回首页</a>')
    res.end()
})
app.get('/prefix-host', (req, res, next) => {
    res.cookie('__Host-uid', '123', {
        secure: true,
        // domain: 'champis.me',
        // path: '/'
    })
    res.send('<a href="/">回首页</a>')
    res.end()
})

https.createServer({
    key: fs.readFileSync(path.resolve(__dirname, '../cert/blog.champis.me-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert/blog.champis.me.pem')),
}, app).listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})
