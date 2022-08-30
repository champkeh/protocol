const express = require('express')

const port = 3000
const app = express()

app.get('/', (req, res) => {
    console.log(req.headers)
    res.send('ok')
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
