import generateAwin from './GenerateAwin.js'
import generateShopee from './GenerateShopee.js'
import getLocation from './GetLocation.js'
import processPelando from './ProcessPelando.js'

export async function processURL(url) {
    url = url.split('?')
    let params = url[1]

    // Remove parâmetros do link
    url = url[0]

    // Redirecionamento https
    url = url.replace('http://', 'https://')

    // Se for links mobile transforma em link padrão
    if (url.startsWith('https://m.')) url = url.replace('//m.', '//www.')

    // Se for um link do beta
    if (url.startsWith('https://beta.')) url = url.replace('//beta.', '//www.')

    if (url.startsWith('https://www.americanas.com.br')) return await generateAwin(url, 22193)
    if (url.startsWith('https://www.shoptime.com.br')) return await generateAwin(url, 22194)
    if (url.startsWith('https://www.submarino.com.br')) return await generateAwin(url, 22195)
    if (url.startsWith('https://www.casasbahia.com.br')) return await generateAwin(url, 17629)
    if (url.startsWith('https://www.pontofrio.com.br')) return await generateAwin(url, 17621)
    if (url.startsWith('https://www.extra.com.br')) return await generateAwin(url, 17874)
    if (url.startsWith('https://shopee.com.br')) return await generateShopee(url)
    if (url.startsWith('https://www.amazon.com.br')) return url + '?tag=' + process.env.AMAZON_TAG
    if (url.startsWith('https://www.pelando.com.br')) return processPelando(url)
    if (url.startsWith('https://shope.ee/') || url.startsWith('https://amzn.to/') || url.startsWith('https://cutt.ly/')
        || url.startsWith('https://bit.ly/') || url.startsWith('https://tidd.ly/') || url.startsWith('https://a.co/')){
        url = await getLocation(url)

        return (url) ? await processURL(url) : url
    }
    if (url.startsWith('https://www.awin1.com/cread.php')) {
        params = params.split('&')

        let paramsObj = {}

        params.map(param => {
            let data = param.split('=')
            paramsObj[data[0]] = data[1]
        })

        return await processURL(paramsObj.ued)
    }

    return false
}

export default processURL