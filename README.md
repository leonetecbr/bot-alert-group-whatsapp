# Bot de alerta para grupos do Whatsapp

## Introdução

Esse bot surgiu da necessidade de marcar várias pessoas sempre que uma promoção grande acontecia, como não há a opção de
marcar todos no WhatsApp ou função similar, eu criei esse bot para nos ajudar.

## Instalação

Para utilizá-lo basta clonar esse repositório, rodar o comando ```yarn run start``` ou ```npm run start```, escanear o 
QR Code para fazer login com o WhatsApp. Após isso basta adicionar o bot no(s) grupo(s) e configurar os alertas através 
do privado do bot. Os alertas podem ser alterados no arquivo 
[alerts.json](https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/main/resources/alerts.json). Originalmente o 
bot suporta até 10 alertas predefinidos, mas isso pode ser alterado para um número maior com pequenas mudanças no 
[modelo da tabela de usuários](https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/main/models/User.js).