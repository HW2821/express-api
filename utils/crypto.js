const CryptoJS = require("crypto-js")

class Crypto {
  constructor() {}

  encrypt(str) {
    return CryptoJS.AES.encrypt(str, process.env.CRYPTO_KEY).toString()
  }

  decrypt(str) {
    return CryptoJS.AES.decrypt(str, process.env.CRYPTO_KEY).toString(CryptoJS.enc.Utf8)
  }
}
const crypto = new Crypto()

module.exports = crypto
