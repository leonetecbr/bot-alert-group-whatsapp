const {curly} = require('node-libcurl')

module.exports = async url => {
    const {statusCode, headers} = await curly.get(url, {
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
    })

    if (statusCode !== 302 && statusCode !== 301) return false

    // Retorna o link de destino
    return headers[0].Location ?? headers[0].location
}