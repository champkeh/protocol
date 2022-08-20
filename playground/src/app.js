const express = require('express')
const fs = require('fs')
const http = require('http')
const https = require('https')
const {resolve} = require('./utils')


const sslOptions = {
    key: fs.readFileSync(resolve('cert/champis.me-key.pem')),
    cert: fs.readFileSync(resolve('cert/champis.me-cert.pem')),
}

const app = express()

app.use('/static', express.static(resolve('src/public')))

app.get('/', (req, res) => {
    res.set({
        "Strict-Transport-Security": 'max-age=30'
    })
    res.send('Hello World!')
})

http.createServer(app).listen(80)
https.createServer(sslOptions, app).listen(443)
