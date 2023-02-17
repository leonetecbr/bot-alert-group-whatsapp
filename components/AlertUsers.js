import User from '../models/User.js'
import Alert from '../models/Alert.js'
import AlertUser from '../models/AlertUser.js'
import generateShopee from './GenerateShopee.js'
import processURL from './ProcessURL.js'
import alertGroup from './AlertGroup.js'
import alertPrivate from './AlertPrivate.js'

export async function AlertUsers(found, client) {
    // Inicia o "digitando ..."
    await client.simulateTyping(found.message.chatId, true)
    await User.sync()

    console.log('_____________________________________________________________________________________________________')
    console.log('Texto da mensagem: ', found.message.textNormal)
    console.log('Alertas encontrados: ', found.alerts)

    let alertsId, alerts, groupUsers = [], privateUsers = [], text = 'Você tem um novo alerta para *', shopee = false
    const message = found.message
    const members = await client.getGroupMembersId(message.chatId)

    // Se tiver encontrado apenas um alerta
    if (found.alerts.length === 1) {
        alertsId = found.alerts[0]
        alerts = await Alert.findByPk(alertsId, {
            include: {
                model: AlertUser,
                as: 'users',
                attributes: ['UserId'],
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['privateAlerts',],
                },
            },
            attributes: ['name'],
        })

        alerts.users.map(user => {
            // Verifica se o usuário quer receber os alertas no privado
            if (user.user.privateAlerts) privateUsers.push(user.UserId)
            // Se não, envia para o grupo
            else groupUsers.push(user.UserId)
        })

        // Se o alerta for do Shopee
        if (alerts.name === 'shopee') shopee = true

        // Insere o nome do alerta no texto
        text += '#' + alerts.name + '*\n\n'
    }
    // Se tiver encontrado mais de um alerta
    else {
        alertsId = found.alerts

        alerts = await Alert.findAll({
            where: {
                id: alertsId
            },
            include: {
                model: AlertUser,
                as: 'users',
                attributes: ['UserId'],
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['privateAlerts',],
                },
            },
            attributes: ['id', 'name'],
        })

        alerts.map(alert => alert.users.map(user => {
            // Verifica se o usuário quer receber os alertas no privado
            if (user.user.privateAlerts) {
                // Evita que usuários sejam inseridos no array mais de uma vez
                if (!privateUsers.includes(user.UserId)) privateUsers.push(user.UserId)
            }
            // Se não, envia para o grupo
            else if (!groupUsers.includes(user.UserId)) groupUsers.push(user.UserId)
        }))

        // Se algum dos alertas for do Shopee
        if (alerts.some(alert => alert.name === 'shopee')) shopee = true

        // Insere o nome dos alertas no texto
        const alertsName = {}

        // Busca o nome dos alertas
        await Promise.all(alerts.map(alert => alertsName[alert.id] = alert.name))

        alertsId.map((id, i) => {
            if (i !== 0 && i + 1 === alertsId.length) text += '* e *'

            text += '#' + alertsName[id]

            if (i + 3 <= alertsId.length) text += '*, *'
        })

        text += '*\n\n'
    }

    // Exclui usuários que não estão no grupo e o autor da(s) mensagem(ns)
    groupUsers = groupUsers.filter(user => (members.includes(user) && !found.ignore.includes(user)))
    privateUsers = privateUsers.filter(user => (members.includes(user) && !found.ignore.includes(user)))

    // Se não existirem usuários com o(s) alerta(s) ativado(s) interrompe a função
    if (groupUsers.length === 0 && privateUsers.length === 0) {
        // Para o "digitando ..."
        await client.simulateTyping(found.message.chatId, false)
        // Marca a mensagem como lida
        await client.sendSeen(found.message.chatId)
        return false
    }

    if (found.message.chatId !== process.env.GROUP_ID_IGNORE) {
        const links = found.message.textNormal.match(/https?:\/\/[-\w@:%.\\+~#?&/=,]+/g)
        if (links) {
            await Promise.all(
                links.map(async link => {
                    const url = await processURL(link)

                    if (url) text += url + '\n\n'
                })
            )
        } else if (shopee) {
            const link = await generateShopee('https://shopee.com.br/cart')
            text += '🛒 Link rápido pro carrinho: ' + link + '\n\n'
        }
    }

    // Se tiver usuários que querem receber os alertas no grupo
    if (groupUsers.length > 0) alertGroup(found, client, groupUsers, text).then(() => console.log('Enviado para o grupo!'))

    // Se tiver usuários que querem receber os alertas no privado
    if (privateUsers.length > 0) alertPrivate().then(() => console.log('Enviado para o privado!'))
}

export default AlertUsers