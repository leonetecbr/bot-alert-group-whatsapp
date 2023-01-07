import {curly} from 'node-libcurl'

export async function getLocation(url) {
    const {statusCode, headers} = await curly.get(url, {
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
    })

    if (statusCode !== 302 && statusCode !== 301) return false
    // Retorna o link de destino
    if (typeof headers[0].Location !== 'undefined') return headers[0].Location
    return headers[0].location
}

export default getLocation