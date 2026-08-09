# Deploy — impulsoleadcrm.com.br

VPS: `82.112.245.51` (DNS já propagado para `impulsoleadcrm.com.br`).

**Importante: esta VPS já está em produção.** Docker, nginx e certbot já estão
instalados e já servem outros domínios (`crm.impulsoslz.com.br`,
`api-crm.impulsoslz.com.br`) com containers do CRM já rodando (frontend, backend,
Postgres etc.). Este deploy é **puramente aditivo**: não instale Docker/nginx/certbot
de novo, não mexa no firewall, não edite os vhosts ou containers já existentes.

## 1. Verificar o que já está em uso

Antes de escolher qualquer porta, olhe o que já está ocupado:

```bash
docker ps
ss -tlnp
```

Escolha uma porta livre em `127.0.0.1` para o container da landing (ex.: se
`8080`, `3001`, `3002` já estiverem em uso, use a próxima livre, ex. `8090`).

## 2. Clonar o repositório

Use o mesmo padrão de diretório onde os outros serviços já estão organizados
na VPS (confira antes de criar um novo, ex. `/srv/apps/` ou `/opt/`):

```bash
git clone <url-do-repositorio> impulsolead-landing
cd impulsolead-landing
```

## 3. Definir a porta do container

Crie um `.env` local (não versionado) com a porta escolhida no passo 1:

```bash
echo "HOST_PORT=8090" > .env
```

## 4. Build e subida do container

```bash
docker compose build
docker compose up -d
```

Confirme que subiu isolado, só em localhost:

```bash
curl http://127.0.0.1:8090
docker ps --filter name=impulsolead-landing
```

## 5. Confirmar DNS

```bash
dig +short impulsoleadcrm.com.br
dig +short www.impulsoleadcrm.com.br
```

Se `www` não resolver, não inclua `-d www.impulsoleadcrm.com.br` no certbot
no passo 7.

## 6. Adicionar o vhost novo (sem tocar nos existentes)

Copie o modelo de `deploy/nginx-host/impulsoleadcrm.com.br.conf` deste repo
para a VPS, substituindo `<HOST_PORT>` pela porta escolhida no passo 1:

```bash
sudo cp deploy/nginx-host/impulsoleadcrm.com.br.conf /etc/nginx/sites-available/impulsoleadcrm.com.br
sudo sed -i 's/<HOST_PORT>/8090/' /etc/nginx/sites-available/impulsoleadcrm.com.br
sudo ln -s /etc/nginx/sites-available/impulsoleadcrm.com.br /etc/nginx/sites-enabled/impulsoleadcrm.com.br
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` valida a sintaxe de todos os vhosts (inclusive os já existentes) —
se der erro, revise o arquivo novo antes de recarregar; não mexa nos outros.

## 7. Validar HTTP antes do certificado

```bash
curl -I http://impulsoleadcrm.com.br
```

Deve responder 200 e servir o HTML da landing.

## 8. Emitir certificado SSL (só para o domínio novo)

```bash
sudo certbot --nginx -d impulsoleadcrm.com.br -d www.impulsoleadcrm.com.br \
  --redirect --agree-tos -m romilsonrdrgs@gmail.com
```

(Omita `-d www...` se o passo 5 mostrou que o `www` não resolve.)

O certbot já em uso pelos outros domínios da VPS passa a gerenciar mais um
certificado — a renovação automática já configurada no host cobre o novo
domínio automaticamente, sem setup adicional.

## 9. Validar HTTPS

```bash
curl -I https://impulsoleadcrm.com.br
```

Verificar também no navegador (desktop e mobile) e, opcionalmente, rodar o
Lighthouse.

## Redeploys futuros

```bash
git pull
docker compose build
docker compose up -d
```

Não mexe no nginx do host nem nos demais containers.

## Logs

```bash
docker logs impulsolead-landing
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
```
