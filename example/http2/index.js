const spdy = require('spdy');
const express = require('express');
const fs = require('node:fs');
const {promisify} = require('util');

const readFile = promisify(fs.readFile);

const app = express();

app.use(express.static('public'));

app.get("/push", async (req, res) => {
    try {
        if (req.push) {
            [
                "/app.js",
                "/styles.css",
                "/images/image.png",
            ].forEach(async (file) => {
                res.push(file, {}).end(await readFile(`public${file}`));
            })
        }
        res.writeHead(200)
        res.end(await readFile("index.html"))
    } catch (e) {
        res.status(500).send(e.toString());
    }
})

spdy.createServer({
    key: fs.readFileSync('cert/champis.me-key.pem'),
    cert: fs.readFileSync("cert/champis.me.pem"),
}, app).listen(8000, (error) => {
    if (error) {
        throw new Error(error)
    }
    console.log("Listening on port 8000")
})
