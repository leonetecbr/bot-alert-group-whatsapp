import generateAwin from './GenerateAwin.js'

export function processURL(text) {
    let link = text.match(/(https?:\/\/\S+)/g)

    // Se a mensagem não for um link, retorna false
    if (link === null) return false
    // Pega o primeiro link da mensagem
    link = link[0]
    // Remove parâmetros do link
    link = link.split('?')[0]

    link = link.replace('http://', 'https://')

    // Se for links mobile transforma em link padrão
    if (link.startsWith('https://m.casasbahia.com.br') || link.startsWith('https://m.pontofrio.com.br') || link.startsWith('https://m.extra.com.br')) {
        link = link.replace('//m.', '//www.')
    }

    if (link.startsWith('https://www.americanas.com.br')) return generateAwin(link, 22193)
    else if (link.startsWith('https://www.shoptime.com.br')) return generateAwin(link, 22194)
    else if (link.startsWith('https://www.submarino.com.br')) return generateAwin(link, 22195)
    else if (link.startsWith('https://www.casasbahia.com.br')) return generateAwin(link, 17629)
    else if (link.startsWith('https://www.pontofrio.com.br')) return generateAwin(link, 17621)
    else if (link.startsWith('https://www.extra.com.br')) return generateAwin(link, 17874)
    else if (link.startsWith('https://www.amazon.com.br/')) return link + '?tag=' + process.env.AMAZON_TAG
    return false
}

export default processURL