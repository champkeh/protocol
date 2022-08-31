const express = require('express')

const app = express()

app.use((req, res, next) => {
    console.log(req.url)
    next()
})
app.use(express.static('static'))

app.listen(3000, () => {
    console.log(`server running at http://localhost:3000`)
})
