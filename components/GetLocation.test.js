const GetLocation = require('./GetLocation')
const {describe, expect, test} = require("@jest/globals");

describe('Segue redirecionamento', () => {
    test('Obtendo a url a ser redirecionada', async () => {
        const url = 'https://deeplog.pelando.com.br/visit?url=https%3A%2F%2Fwww.adidas.com.br%2Fchinelo-adilette-aqua%2FGZ5234.html&dpt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyYW5kb21TdHJpbmciOiIwYmY1Yzg4MjllOGIyZjRmODZhNTg0OTc1ZTRlYWFiMzY2NmI3NTllZjc3M2Q5OGIzYWI0NGVlY2I4ODcxMmU0IiwiaWF0IjoxNzMxODA5NzY1LCJleHAiOjE3MzE4MDk3OTV9.YjqhGYn_b5w5bUbtamaWNDLxs5S56obEpD35VShbKkE&referrer=https%3A%2F%2Fwww.pelando.com.br%2Fd%2F9a5a3568-b41a-435f-af92-bc2e3ddd2cef%2Fchinelo-adidas-adilette-aqua-(tam-34-ao-45)&cid=e78137d1-a2c8-4247-862a-e62213100916';
        const redirector = 'https://deeplog.pelando.com.br/visit';
        const link = 'https://www.adidas.com.br/chinelo-adilette-aqua/GZ5234.html';

        return GetLocation(url).then(redirect => {
            GetLocation(redirect).then(data => {
                expect(redirect.startsWith(redirector) && data.startsWith(link)).toBe(true)
            })
        })
    })
})