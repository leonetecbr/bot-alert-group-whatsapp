const {curly} = require('node-libcurl')

module.exports = async url => {
    try {
        const {data} = await curly.get(url, {
            SSL_VERIFYHOST: false,
            SSL_VERIFYPEER: false,
        })

        // Pega a url original
        const matches = [...data.matchAll(/"sourceUrl":"([-\w@:%.\\+~#?&/=,]+)"/g)]
        // Busca por cupons
        const coupon = [...data.matchAll(/"couponCode":"(\w+)"/g)]


        if (matches.length === 0) return false

        // Se tiver cupom, retorna-o com a url original
        return {
            coupon: ((coupon.length > 0) ? coupon[0][1] : null),
            to: matches[0][1]
        }
    } catch (e) {
        console.log(e)
        return false
    }
}