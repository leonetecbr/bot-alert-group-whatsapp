export async function processURL(text) {
    let link = text.match(/(https?:\/\/\S+)/g)

    // Se a mensagem não for um link, retorna false
    if (link === null) return false
    link = link[0]

    if (link.startsWith('https://www.americanas.com.br')) {
        // TODO - Processar link da Americanas
    } else if (link.startsWith('https://www.submarino.com.br')) {
        // TODO - Processar link da Submarino
    } else if (link.startsWith('https://www.shoptime.com.br')) {
        // TODO - Processar link da Shoptime
    } else if (link.startsWith('https://www.casasbahia.com.br') || link.startsWith('https://m.casasbahia.com.br')) {
        // TODO - Processar link da Casas Bahia
    } else if (link.startsWith('https://www.pontofrio.com.br') || link.startsWith('https://m.pontofrio.com.br')) {
        // TODO - Processar link da Ponto Frio
    } else if (link.startsWith('https://www.extra.com.br') || link.startsWith('https://m.extra.com.br')) {
        // TODO - Processar link da Extra
    } else if (link.startsWith('https://www.amazon.com.br/')) {
        // TODO - Processar link da Amazon
    } else {
        return false
    }
}

export default processURL