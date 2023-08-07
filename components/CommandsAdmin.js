const {User, Alert} = require('../models')

module.exports = async (message) => {
    const param = message.words[1]
    const command = message.words[0].replace('/', '')

    // Deletar usuário ou alerta
    if (command === 'del') {
        // Deletar o usuário
        if (param.endsWith('@c.us')) {
            const user = await User.findByPk(param, {
                attributes: ['id'],
            })

            if (user) {
                user.destroy()
                    .then(() => {
                        message.chat.sendSeen().catch(e => console.log(e))
                        message.react('✅').catch(e => console.log(e))
                    })
                    .catch(e => console.log(e))
            } else message.react('❌').catch(e => console.log(e))
        }
        // Deletar alerta
        else {
            const alert = await Alert.findOne({
                where: {
                    name: param
                },
                attributes: ['id']
            })

            if (alert) {
                alert.destroy()
                    .then(() => {
                        message.chat.sendSeen().catch(e => console.log(e))
                        message.react('✅').then(e => console.log(e))
                    })
                    .catch(e => console.log(e))
            } else message.react('❌').catch(e => console.log(e))
        }
    }
    // Criar alerta
    else if (command === 'add') {
        Alert.create({
            name: param,
        })
            .then(() => {
                message.chat.sendSeen().catch(e => console.log(e))
                message.react('✅').catch(e => console.log(e))
            })
            .catch(e => {
                console.log(e)
                message.react('❌').catch(e => console.log(e))
            })
    }
    // Comando inválido
    else message.reply('Comando inválido!').catch(e => console.log(e))
}