const express = require('express')
const path = require('path')

const port = 3004
const app = express()

app.use(express.static(path.resolve(__dirname, 'static')))

app.get('/cookie', (req, res, next) => {
    res.cookie('champis.me-uid', '123', {
        httpOnly: true,
        // secure: true,
        domain: 'champis.me',
        path: '/',
        sameSite: 'strict',
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

app.listen(port, () => {
    console.log(`server running at http://localhost:${port}`)
})
