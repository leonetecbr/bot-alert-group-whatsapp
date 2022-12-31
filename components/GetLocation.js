import {curly} from 'node-libcurl'

export async function getLocation(url) {
    const {statusCode, headers} = await curly.get(url, {
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
    })

    // Resposta da Awin
    if (statusCode === 302) return headers[0].Location
    // Resposta da Shopee
    else if (statusCode === 301) return headers[0].location
    // Algum erro aconteceu
    else return false
}

export default getLocation