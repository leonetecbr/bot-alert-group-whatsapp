const crypto = require('crypto')
const {curly} = require('node-libcurl')
const getLocation = require('./GetLocation')

module.exports = async url => {
    try {
        const sha256 = toSHA256 => crypto.createHash('sha256').update(toSHA256).digest('hex')
        const timestamp = parseInt(String(Date.now() / 1000))
        const payload = '{"query":"mutation{\\n    generateShortLink(input:{originUrl:\\"' + url + '\\"}){\\n        shortLink\\n    }\\n}"}'
        const credential = String(process.env.APP_ID_SHOPEE)
        const signature = sha256(credential + timestamp + payload + process.env.APP_SECRET_SHOPEE)

        const {data} = await curly.post('https://open-api.affiliate.shopee.com.br/graphql', {
            postFields: payload,
            httpHeader: [
                `Authorization: SHA256 Credential=${credential}, Timestamp=${timestamp}, Signature=${signature}`,
                'Content-Type: application/json',
            ],
            SSL_VERIFYHOST: false,
            SSL_VERIFYPEER: false,
        })

        if (typeof data.data.generateShortLink === 'undefined') return false

        return (typeof data.errors === 'undefined') ? await getLocation(data.data.generateShortLink.shortLink) : false
    } catch (e) {
        console.log(e)
        return false
    }
}
