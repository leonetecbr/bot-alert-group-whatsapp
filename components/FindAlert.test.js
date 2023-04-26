import {expect, describe, test} from '@jest/globals'
import findAlert from './FindAlert'

let message = {
    author: '5511999999999@c.us',
    quotedMsgObj: null,
    text: '#bug',
    words: ['#bug'],
}

const alerts = [
    {
        id: 1,
        name: 'bug',
    },
    {
        id: 2,
        name: 'promoboa',
    }
]

describe('Os alertas estão sendo detectados', () => {
    test('Alertas simples estão sendo detectados', () => {
        return findAlert(message, alerts).then(({alerts}) => {
            expect(alerts.includes(1)).toBe(true)
        })
    })

    test('Alertas para mensagens anteriores funcionando', () => {
        message.lastMessage = {
            text: 'Teste de mensagem anterior',
            author: '5511999999999@c.us'
        }

        return findAlert(message, alerts).then(({message}) => {
            expect(message.text).toBe('Teste de mensagem anterior')
        })
    })

    test('Alertas compostos estão sendo detectados', () => {
        message.text += ' #promoboa'
        message.words.push('#promoboa')
        message.lastMessage = null

        return findAlert(message, alerts).then(({alerts}) => {
            expect(alerts.includes(1) && alerts.includes(2)).toBe(true)
        })
    })

    test('Alertas respostas estão sendo lançados corretamente', () => {
        message.quotedMsgObj = {
            author: '5511900000000@c.us',
            text: 'Teste',
        }

        return findAlert(message, alerts).then(({ignore}) => {
            expect(ignore.includes('5511900000000@c.us') && ignore.includes('5511999999999@c.us'))
                .toBe(true)
        })
    })
})