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

### Passo a passo

Clone o projeto e instale as dependências:

```bash
git clone https://github.com/leonetecbr/bot-alert-group-whatsapp/
cd bot-alert-group-whatsapp
npm install
```

Instale o Chrome, caso não tenha na sua máquina:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install ./google-chrome-stable_current_amd64.deb
```

Instale o ffmpeg;

```bash
sudo apt install ffmpeg
```

Caso deseje trocar os alertas disponíveis altere o [seed de alertas](https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/main/seeders/20230805152033-alerts.js). 

Logo após copie o aquivo [.env.example](https://github.com/leonetecbr/bot-alert-group-whatsapp/blob/main/.env.example),
renomei-o para ```.env``` e preencha conforme seu ambiente, rode os comandos:

```bash
npm install
npm run migrate:all
npm run seed:all
npm start
```

Por fim escanei o QR Code para fazer login com o WhatsApp. Após isso basta adicionar o bot no(s) grupo(s) e ativar os alertas
através do privado do bot.

## Rodando em segundo plano

Após rodar o `npm start` é necessário que o terminal permaneça aberto para que o código continue rodando, para evitar
que isso ocorra vamos usar o supervisor.

Faça a instalação do Supervisor:

```bash
sudo apt install supervisor
```

Faça os ajustes necessários no arquivo `/etc/supervisor/supervisord.conf`:

```
; supervisor config file

[unix_http_server]
file=/var/run/supervisor.sock   ; (the path to the socket file)
chmod=0770                       ; sockef file mode (default 0700)
chown=ubuntu

[supervisord]
logfile=/var/log/supervisor/supervisord.log ; (main log file;default $CWD/supervisord.log)
pidfile=/var/run/supervisord.pid ; (supervisord pidfile;default supervisord.pid)
childlogdir=/var/log/supervisor            ; ('AUTO' child log dir, default $TEMP)

; the below section must remain in the config file for RPC
; (supervisorctl/web interface) to work, additional interfaces may be
; added by defining them in separate rpcinterface: sections
[rpcinterface:supervisor]
supervisor.rpcinterface_factory = supervisor.rpcinterface:make_main_rpcinterface

[supervisorctl]
serverurl=unix:///var/run/supervisor.sock ; use a unix:// URL  for a unix socket

; The [include] section can just contain the "files" setting.  This
; setting can list multiple files (separated by whitespace or
; newlines).  It can also contain wildcards.  The filenames are
; interpreted as relative to this file.  Included files *cannot*
; include files themselves.

[include]
files = /etc/supervisor/conf.d/*.conf
```

Configure o Supervisor criando o arquivo bot.conf no diretório /etc/supervisor/conf.d:

```bash
[program:whatsapp]
process_name=bot_de_alerta
command=/home/ubuntu/.nvm/versions/node/v20.17.0/bin/node /home/ubuntu/bot/index.js
autostart=true
autorestart=true
user=ubuntu
redirect_stderr=true
stdout_logfile=/home/ubuntu/bot/supervisor.log
```

Inicie o Supervisor:

```bash
sudo supervisorctl reread
 
sudo supervisorctl update
 
sudo supervisorctl start "whatsapp:*"
```

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
uma hash (#), para evitar o disparo acidental, (pode se incluir vários alerta em uma mesma mensagem). Exemplo:

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Lan%C3%A7ando%20alerta%20no%20grupo.jpg" alt="Disparando os alertas"/>
</p>

### Cancelando alertas

Para cancelar um alerta você pode excluir a mensagem o que o disparou, que o bot irá excluir a resposta a ela.

<p align="center">
   <img src="https://raw.githubusercontent.com/leonetecbr/bot-alert-group-whatsapp/main/result/Cancelando%20envio%20de%20um%20alerta.jpg" alt="Cancelando envio de um alerta"/>
</p>
