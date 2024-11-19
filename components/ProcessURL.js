const generateAwin = require('./GenerateAwin')
const generateShopee = require('./GenerateShopee')
const getLocation = require('./GetLocation')
const processPelando = require('./ProcessPelando')

module.exports = async function processURL(url){
    try {
        const decodeURL = url => url.replace('%3F', '?').replace('%3A', ':').replace('%2F', '/')

        url = url.split('?')
        let params = url[1]

        // Remove parâmetros do link
        url = url[0]

        // Redirecionamento https
        url = url.replace('http://', 'https://')

        // Se for links mobile transforma em link padrão
        if (url.startsWith('https://m.pt.')) url = url.replace('//m.', '//')
        else if (url.startsWith('https://m.')) url = url.replace('//m.', '//www.')

        let domain = !url.endsWith('/') ? url + '/' : url

        // Busca qual o domínio do link
        domain = [...domain.matchAll(/https:\/\/([\w.\-]+)\//g)]

        // Se não encontrar o domínio
        if (domain.length === 0) return false

        domain = domain[0][1]

        switch (domain) {
            case 'pt.aliexpress.com':
            case 'www.aliexpress.com':
                return await generateAwin(url, 18879)

            case 'www.nike.com.br':
                return await generateAwin(url, 17652)

            case 'www.cea.com.br':
                return await generateAwin(url, 17648)

            case 'shopee.com.br':
            case 'live.shopee.com.br':
                return await generateShopee(url)

            case 'www.amazon.com.br':
                return url + '?tag=' + process.env.AMAZON_TAG

            case 'www.pelando.com.br':
                const {coupon, to} = await processPelando(url)

                url = await processURL(to)

                return url ? coupon ? coupon + '\n\n' + url : url : false

            // Links encurtados
            case 'shope.ee':
            case 'amzn.to':
            case 'cutt.ly':
            case 'bit.ly':
            case 'tidd.ly':
            case 'a.co':
            case 'tinyurl.com':
            case 'a.aliexpress.com':
                url = await getLocation(url)

                return (url) ? await processURL(url) : url

            case 'www.awin1.com':
            case 'redirect.viglink.com':
                params = params.split('&')

                let paramsObj = {}

                for (const param of params) {
                    const data = param.split('=')
                    paramsObj[data[0]] = data[1]
                }

                const link = (url.startsWith('https://www.awin1.com/cread.php')) ? paramsObj.ued : paramsObj.u

                return await processURL(decodeURL(link))

            default:
                return false
        }
    } catch (e) {
        console.log(e)
        return false
    }
}