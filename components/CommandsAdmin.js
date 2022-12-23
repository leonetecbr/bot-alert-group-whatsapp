import User from '../models/User.js'
import Alert from '../models/Alert.js'

export async function commandsAdmin(client, message) {
    const param = message.words[1]
    const command = message.words[0].replace('/', '')

    // Deletar usuário ou alerta
    if (command === 'del') {
        // Deletar o usuário
        if (param.endsWith('@c.us')) {
            await User.sync()

            const user = await User.findByPk(param)

            if (user) {
                await user.destroy()
                await client.react(message.id, '✅')
            } else await client.react(message.id, '❌')
        }
        // Deletar alerta
        else {
            await Alert.sync()

            const alert = await Alert.findOne({
                where: {
                    name: param
                }
            })

            if (alert) {
                await alert.destroy()
                await client.react(message.id, '✅')
            } else await client.react(message.id, '❌')
        }
    }
    // Criar alerta
    else if (command === 'add') {
        await Alert.create({
            name: param,
        })

        await client.react(message.id, '✅')
    }
    // Comando inválido
    else await client.reply(message.from, 'Comando inválido', message.id, true)
}

export default commandsAdmin