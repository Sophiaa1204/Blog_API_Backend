const NodeRSA = require('node-rsa')
// fs, "file system", is a module that enables interaction with the file system in a server-side environment
// it allows you to perform file operations
const fs = require('fs')
// 'path' library provides utilities for working with file and directory paths
const path = require('path')
// const key = new NodeRSA([keyData, [format]], [options]);
const privateKey = new NodeRSA(fs.readFileSync(path.join(
    __dirname,
    '../config/privateKey.txt',
), 'utf-8'))

const publicKey = new NodeRSA(fs.readFileSync(path.join(
    __dirname,
    '../public/publicKey.txt',
),'utf-8'))

module.exports = {
    encryptedByPublicKey: (str) => publicKey.encrypt(str,'base64'),
    isSame: (strA, strB) => privateKey.decrypt(
        strA, 'base64',
    ) === privateKey.decrypt(strB,'base64'),
}