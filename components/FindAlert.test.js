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

    message.text += ' #promoboa'
    message.words.push('#promoboa')

    test('Alertas compostos estão sendo detectados', () => {
        return findAlert(message, alerts).then(({alerts}) => {
            expect(alerts.includes(1) && alerts.includes(2)).toBe(true)
        })
    })

    message.quotedMsgObj = {
        author: '5511900000000@c.us',
        text: 'Teste',
    }

    test('Alertas respostas estão sendo lançados corretamente', () => {
        return findAlert(message, alerts).then(({ignore}) => {
            expect(ignore.includes('5511900000000@c.us') && ignore.includes('5511999999999@c.us'))
                .toBe(true)
        })
    })
})