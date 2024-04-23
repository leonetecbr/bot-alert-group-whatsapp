const {curly} = require('node-libcurl')

const ProcessPelando = async url => {
    try {
        const {statusCode, headers, data} = await curly.get(url, {
            SSL_VERIFYHOST: false,
            SSL_VERIFYPEER: false,
        })

        if (statusCode === 301 || statusCode === 302 || statusCode === 307 || statusCode === 308) {
            let url = headers[0].location

            if (url.startsWith('/')) url = 'https://www.pelando.com.br' + url

            return await ProcessPelando(url)
        }

        if (statusCode !== 200) throw new Error(data);

        // Pega a url original
        const matches = [...data.matchAll(/"sourceUrl":"([-\w@:%.\\+~#?&/=,]+)"/g)]
        // Busca por cupons
        const coupon = [...data.matchAll(/"couponCode":"(\w+)"/g)]


        if (matches.length === 0) return false

        // Se tiver cupom, retorna-o com a url original
        return {
            coupon: ((coupon.length > 0) ? String(coupon[0][1]) : null),
            to: matches[0][1],
        }
    } catch (e) {
        console.log(e)
        return false
    }
}

module.exports = ProcessPelando