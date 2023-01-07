import {curly} from 'node-libcurl'
import processURL from './ProcessURL.js'

export async function processPelando(url) {
    const {data} = await curly.get(url, {
        SSL_VERIFYHOST: false,
        SSL_VERIFYPEER: false,
    })
    // Pega a url original
    const matches = [...data.matchAll(/"sourceUrl":"([-\w@:%.\\+~#?&/=]+)"/g)]
    // Busca por cupons
    const coupon = [...data.matchAll(/"couponCode":"(\w+)"/g)]

    if (matches.length === 0) return false

    const link = await processURL(matches[0][1])

    // Se tiver cupom, retorna-o com a url original
    return (coupon.length > 0 && link) ? coupon[0][1] + '\n\n' + link : link
}

export default processPelando