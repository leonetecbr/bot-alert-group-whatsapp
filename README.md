# Bot de alerta para grupos do Whatsapp

## Introdução

Esse bot surgiu da necessidade de marcar várias pessoas sempre que uma promoção grande acontecia, como não há a opção de
marcar todos no WhatsApp ou função similar, eu criei esse bot para nos ajudar.

## Instalação

Para utilizá-lo basta clonar esse repositório, rodar o comando ```yarn run start``` ou ```npm run start```, escanear o 
QR Code para fazer login com o WhatsApp. Após isso basta adicionar o bot no(s) grupo(s) e configurar os alertas através 
do privado do bot. Os alertas podem ser alterados no arquivo 
[alerts.json](https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/main/resources/alerts.json). Para 
definir o número do administrador use o arquivo 
[admin.json](https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/resources/admin.json), faça como no exemplo 
abaixo: 
```
[
    "5599999999999@c.us"
]
```

**Observação**: Após criação do banco de dados se faz necessário ajustar o banco de dados caso a quantidade de alertas 
aumente!