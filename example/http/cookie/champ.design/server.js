const express = require('express')
const path = require('path')
const https = require('https')
const fs = require('fs')

const port = 3001
const app = express()

// 设置 cors 头
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://champis.me:3002')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
})

app.use(express.static(path.resolve(__dirname, 'static')))

app.get('/cookie', (req, res, next) => {
    res.cookie('champ.design-uid', '123', {
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
    key: fs.readFileSync(path.resolve(__dirname, '../cert/champ.design-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../cert/champ.design.pem')),
}, app).listen(port, () => {
    console.log(`server running at https://champ.design:${port}`)
})
