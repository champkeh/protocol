const path = require('path')

const root = path.resolve(__dirname, '../..')

function resolve(file) {
    return path.resolve(root, file)
}

module.exports = {
    resolve
}
