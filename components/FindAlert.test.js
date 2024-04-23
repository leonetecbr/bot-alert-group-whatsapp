const {expect, describe, test} = require('@jest/globals')
const findAlert = require('./FindAlert')
const {Alert} = require('../models')

let message = {
    author: '5511999999999@c.us',
    quotedMsgObj: null,
    body: '#bug',
    words: ['#bug'],
}
let alerts, bug, promoboa

describe('Os alertas estão sendo detectados', () => {
    test('Alertas simples estão sendo detectados', async () => {
        alerts = await Alert.findAll()

        bug = await Alert.findOne({
            where: {
                name: 'bug'
            },
            raw: true
        })

        return findAlert(message, alerts).then(({alerts}) => {
            expect(alerts.includes(bug.id)).toBe(true)
        })
    })

    test('Alertas para mensagens anteriores funcionando', () => {
        message.lastMessage = {
            body: 'Teste de mensagem anterior',
            author: '5511999999999@c.us'
        }

        return findAlert(message, alerts).then(({message}) => {
            expect(message.body).toBe('Teste de mensagem anterior')
        })
    })

    test('Alertas compostos estão sendo detectados', async () => {
        message.body += ' #promoboa'
        message.words.push('#promoboa')
        message.lastMessage = null

        promoboa = await Alert.findOne({
            where: {
                name: 'promoboa'
            },
            raw: true
        })

        return findAlert(message, alerts).then(({alerts}) => {
            expect(alerts.includes(bug.id) && alerts.includes(promoboa.id)).toBe(true)
        })
    })

    test('Alertas respostas estão sendo lançados corretamente', () => {
        message.hasQuotedMsg = true
        message.getQuotedMessage = () => ({
            author: '5511900000000@c.us',
            body: 'Teste',
        })

        return findAlert(message, alerts).then(({ignore, message}) => {
            expect(
                ignore.includes('5511900000000@c.us') &&
                ignore.includes('5511999999999@c.us') &&
                message.body === 'teste'
            ).toBe(true)
        })
    })
})