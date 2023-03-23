<div align="center">
    <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/resources/logo.png" alt="Bot de alerta para grupos do Whatsapp">
    <h1>Bot de alerta para grupos do Whatsapp</h1>
    <img src="https://img.shields.io/github/license/leonetecbr/bot-alert-group-whatsapp.svg" alt="Licença"/>&nbsp;&nbsp;
    <img src="https://img.shields.io/github/issues/leonetecbr/bot-alert-group-whatsapp.svg" alt="Problemas"/>&nbsp;&nbsp;
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>&nbsp;&nbsp;
</div>

## Introdução

Esse bot surgiu da necessidade de avisar vários membros de um grande de grupo de WhatsApp sempre que era encontrada uma
promoção incrível.

**Testado e aprovado em um grupo de compradores compulsivos. ✅**

## Instalação

### Deploy gratuito

Usando a Digital Ocean para realizar seu deixar seu bot no ar, você ganhará U$ 200 em créditos em sua conta, clique no 
botão abaixo para criar sua conta!

<p align="center">
    <a href="https://www.digitalocean.com/?refcode=73ea4bd8a1ba&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge">
        <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/DigitalOcean.png" alt="DigitalOcean" />
    </a>
</p>

Nossa recomensação mínima é o plano de $7/mês (Premium AMD/Intel, 1GB de RAM, 25GB de SSD, 1 CPU, 1TB de transferência).

### Passo a passo

Para utilizá-lo clone esse repositório e instalar o Chrome no seu servidor (caso use Linux como SO) com os seguintes comandos:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
```

Logo após copie o aquivo [.env.example](https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/main/.env.example),
renomei-o para ```.env``` e prencha conforme seu ambiente, rode o comando ```npm install ; npm start``` e por fim
escanei o QR Code para fazer login com o WhatsApp. Após isso basta adicionar o bot no(s) grupo(s) e ativar os alertas
através do privado do bot.

# Tarefas a realizar

Funções sugeridas pelos membros ou nescessidades identificadas por mim:

- [ ] Finalizar a implementação dos alertas no privado
- [ ] Escrever mais testes para garantir a integridade de todo código
- [ ] Atualizar o README com prints atuais
- [ ] Intentificar links de mensagens da mensagem imediatamente anterior ao alerta
- [ ] Adicionar alertas regionais (ex: #sp, #rj, #mg, #bh e etc)

## Usando

### Adicionando ao(s) seu(s) grupo(s)

Primeiramente o bot deve ser adicionado em pelo menos um grupo, defina todos os alertas corretamente, porque eles
estarão na mensagem de boas-vindas que o bot enviará após ser adicionado no grupo. Exemplo da mensagem de boas-vindas:

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Adicionando%20ao%20grupo.jpg" alt="Adicionando o bot ao grupo"/>
</p>

### Conversando com o bot

Os usuários que desejarem serem alertados devem entrar em contato com o bot pelo privado, lá poderão
ativar e desativar os alertas que desejam. Exemplo:

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Conversando%20com%20o%20bot.jpg" alt="Conversando com o bot"/>
</p>

### Ativando e desativando alertas

Para ativar um alerta basta mandá-lo para o bot no privado, para desativar é só mandá-lo seguido de `off`, caso deseje
consultar a lista de alertas disponíveis pode se usar o comando `Meus Alertas`. Exemplo:

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Gerenciando%20os%20alertas.jpg" alt="Gerenciando os alertas"/>
</p>

### Disparando alertas

Para disparar o alerta é bem simples, basta usar o alerta em uma mensagem no grupo, recomendamos que o alerta inicie com
uma hash (#), para evitar o disparo acidental, (pode se incluir vários alertas em uma mesma mensagem). Exemplo:

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Lan%C3%A7ando%20alerta%20no%20grupo.jpg" alt="Disparando os alertas"/>
</p>

### Cancelando alertas

Para cancelar um alerta você pode excluir a mensagem o que o disparou, que o bot irá excluir a resposta a ela.

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Cancelando%20envio%20de%20um%20alerta.jpg" alt="Cancelando envio de um alerta"/>
</p>
