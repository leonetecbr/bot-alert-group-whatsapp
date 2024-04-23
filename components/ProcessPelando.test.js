const ProcessPelando = require('./ProcessPelando')
const {describe, test} = require("@jest/globals");

describe('Processa o link do pelando', () => {
    test('Obtendo a url original', async () => {
        const url = 'https://www.pelando.com.br/d/5c9cfe73-6cd6-4e24-8b39-6a2b46fbd13d/kit-shampoo-+-condicionador-sos-bomba-original-salon-line-200ml-por-menos-de-rdollar15.00';
        const link = 'https://shopee.com.br/product/616222685/14494160625';

        return ProcessPelando(url).then(data => {
            expect(data.to === link).toBe(true)
        })
    })

    test('Obtendo o cupom', async () => {
        const url = 'https://www.pelando.com.br/d/c4254677-b9b9-43ab-92b8-4dadb60b9994/furadeira-de-impacto-bosch-gsb-16-re-850w-127v-em-maleta';
        const coupon = 'AMZAPPDAY100';

        return ProcessPelando(url).then(data => {
            expect(data.coupon === coupon).toBe(true)
        })
    })
})