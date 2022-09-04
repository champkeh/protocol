const express = require('express')
const path = require('path')
const https = require('https')
const fs = require('fs')

const port = 3002
const app = express()

app.use(express.static(path.resolve(__dirname, 'static')))

app.get('/abc/def/cookie', (req, res, next) => {
    // res.cookie('champis.me-uid', '123', {
    //     httpOnly: true,
    //     secure: true,
    //     domain: 'champis.me',
    //     // path: '/',
    //     sameSite: 'strict',
    // })
    res.setHeader('Set-Cookie', 'champis.me-uid=123; Domain=champis.me; HttpOnly; Secure; SameSite=Strict')
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
    key: fs.readFileSync(path.resolve(__dirname, '../cert/champis.me-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert/champis.me.pem')),
}, app).listen(port, () => {
    console.log(`server running at https://champis.me:${port}`)
})
