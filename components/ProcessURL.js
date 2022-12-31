import generateAwin from './GenerateAwin.js'
import generateShopee from './GenerateShopee.js'
import getLocation from './GetLocation.js'
import processPelando from './ProcessPelando.js'

export async function processURL(url) {
    // Remove parâmetros do link
    url = url.split('?')[0]

    url = url.replace('http://', 'https://')

    // Se for links mobile transforma em link padrão
    if (url.startsWith('https://m.')) url = url.replace('//m.', '//www.')

    // Se for um link do beta
    if (url.startsWith('https://beta.')) url = url.replace('//beta.', '//www.')

    if (url.startsWith('https://www.americanas.com.br')) return await generateAwin(url, 22193)
    else if (url.startsWith('https://www.shoptime.com.br')) return await generateAwin(url, 22194)
    else if (url.startsWith('https://www.submarino.com.br')) return await generateAwin(url, 22195)
    else if (url.startsWith('https://www.casasbahia.com.br')) return await generateAwin(url, 17629)
    else if (url.startsWith('https://www.pontofrio.com.br')) return await generateAwin(url, 17621)
    else if (url.startsWith('https://www.extra.com.br')) return await generateAwin(url, 17874)
    else if (url.startsWith('https://shopee.com.br')) return await generateShopee(url)
    else if (url.startsWith('https://www.amazon.com.br')) return url + '?tag=' + process.env.AMAZON_TAG
    else if (url.startsWith('https://www.pelando.com.br')) return processPelando(url)
    else if (url.startsWith('https://shope.ee/')) {
        url = await getLocation(url)

        if (!url) return false

        // Remove parâmetros do link
        url = url.split('?')[0]

        return await generateShopee(url)
    }
    return false
}

export default processURL