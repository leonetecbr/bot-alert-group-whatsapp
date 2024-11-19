const {User} = require('../models')
const {Op} = require('sequelize')
const alertPrivate = require('./AlertPrivate')
const alertGroup = require('./AlertGroup')

module.exports = async (client, chat, found) => {
    // Inicia o "digitando ..."
    chat.sendStateTyping().catch(e => console.log(e))

    console.log('_____________________________________________________________________________________________________')
    console.log('Texto da mensagem: ', found.message.text)
    console.log('Alertas encontrados: ', found.alerts)

    const message = found.message
    let groupUsers = [], privateUsers = [], members = [], users

    for (const member of chat.participants) members.push(member.id._serialized)

    // Busca os usuários com algum dos alertas ativados
    users = await User.findAll({
        where: {
            '$alerts.id$': {
                [Op.or]: found.alerts
            }
        },
        include: 'alerts',
        attributes: ['id', 'privateAlerts'],
    })

    // Separa cada usuário por sua preferência de alerta
    for (const user of users) {
        // Verifica se o usuário quer receber os alertas no privado
        if (user.privateAlerts) {
            // Evita que usuários sejam inseridos no array mais de uma vez
            if (!privateUsers.includes(user.id)) privateUsers.push(user.id)
        }
        // Se não, envia para o grupo
        else if (!groupUsers.includes(user.id)) groupUsers.push(user.id)
    }

    // Exclui usuários que não estão no grupo e o autor da(s) mensagem(ns)
    groupUsers = groupUsers.filter(user => (members.includes(user) && !found.ignore.includes(user)))
    privateUsers = privateUsers.filter(user => (members.includes(user) && !found.ignore.includes(user)))

    // Se não existirem usuários com o(s) alerta(s) ativado(s) interrompe a função
    if (groupUsers.length === 0 && privateUsers.length === 0) {
        // Para o "digitando ..."
        message.chat.clearState().catch(e => console.log(e))
        // Marca a mensagem como lida
        message.chat.sendSeen().catch(e => console.log(e))
        // Interrompe o fluxo
        return false
    }

    // Se tiver usuários que querem receber os alertas no grupo
    if (groupUsers.length > 0) alertGroup(client, found, groupUsers).then(() => console.log('Enviado para o grupo!'))

    // Se tiver usuários que querem receber os alerta no privado
    if (privateUsers.length > 0) alertPrivate().then(() => console.log('Enviado para o privado!'))
}