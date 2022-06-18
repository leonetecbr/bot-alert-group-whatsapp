<div align="center">
    <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/resources/logo.png" alt="Bot de alerta para grupos do Whatsapp">
    <h1>Bot de alerta para grupos do Whatsapp</h1>
    <img src="https://img.shields.io/npm/v/@open-wa/wa-automate.svg?color=green" alt="Versão mínima do NPM"/>&nbsp;&nbsp;
    <img src="https://img.shields.io/github/license/leonetecbr/leone-promos.svg" alt="Licença"/>&nbsp;&nbsp;
    <img src="https://img.shields.io/github/issues/leonetecbr/leone-promos.svg" alt="Problemas"/>&nbsp;&nbsp;
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>&nbsp;&nbsp;
</div>

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

## Usando

### Ativando alertas

Primeiramente os usuários que desejarem serem alertados devem entrar em contato com o bot pelo privado, lá poderão 
ativar e desativar os alertas que desejam. Para consultar a lista de alertas disponíveis pode se usar o comando 
`Meus Alertas`. Exemplo:

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Conversando%20com%20o%20bot.jpg" alt="Conversando com o bot"/>
</p>

### Disparando alertas

Para disparar o alerta é bem simples, basta usar o alerta em uma mensagem no grupo, recomendamos que o alerta inicie com
 uma hash (#), para evitar o disparo acidental, (pode se incluir vários alertas em uma mesma mensagem). Exemplo:

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Lan%C3%A7ando%20alerta%20no%20grupo.jpg" alt="Disparando os alertas"/>
</p>

### Recebendo alertas

Quando o alerta for disparado, todos que ativaram o alerta receberam a mensagem correspondente no privado. Exemplo:

<p align="center">
   <img src="https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/main/result/Alerta%20sendo%20recebido%20no%20privado.jpg" alt="Recebendo os alertas"/>
</p>
