# ImpulsoLead — Landing Page

Landing page de conversão para o ImpulsoLead (CRM para imobiliárias),
servida como página estática em nginx via Docker. Domínio:
`impulsoleadcrm.com.br`. Projeto separado do repositório do CRM/backend.

## Stack

HTML + CSS + JavaScript vanilla, com [Vite](https://vitejs.dev) apenas como
ferramenta de build/dev (minificação, hash de cache, dev server). Sem
framework de runtime — a página não tem estado complexo, rotas ou
componentização que justifiquem o custo de um framework como React.

Animações (hero, distribuição de leads, scroll reveal) são feitas só com
CSS (`@keyframes`/`transition`) e um `IntersectionObserver` reaproveitado,
sem bibliotecas de animação. Todas respeitam `prefers-reduced-motion`.

## Desenvolvimento

```bash
npm install
npm run dev
```

```bash
npm run build      # gera dist/
npm run preview    # serve o build de produção localmente
```

## Configuração

O formulário de contato envia os dados para uma URL configurável via
variável de ambiente (`.env.production` já traz o valor padrão de
produção; crie um `.env.local` para sobrescrever em desenvolvimento):

```
VITE_CONTACT_API_URL=https://api-crm.impulsoslz.com.br/api/landing/contato
```

**O backend desse endpoint não existe neste repositório** — é construído
separadamente no repositório do CRM.

### CORS (pendência do backend, não deste repo)

O endpoint de contato fica em `api-crm.impulsoslz.com.br`, domínio
diferente do da landing (`impulsoleadcrm.com.br`) — a requisição do
formulário é cross-origin. Quando o backend existir, ele precisa liberar
`Access-Control-Allow-Origin` para `https://impulsoleadcrm.com.br` (senão
o navegador bloqueia a resposta). Até lá, o formulário tem estado de erro
tratado para isso (timeout/erro de rede não trava a UI).

## Docker

```bash
docker build -t impulsolead-landing -f docker/Dockerfile .
docker run --rm -p 8080:80 impulsolead-landing
```

Build multi-stage: `node:22-alpine` builda com Vite, `nginx:1.27-alpine`
serve o resultado estático. Ver `docker/nginx/default.conf` para a config
do nginx dentro do container (gzip, cache de assets, security headers).

## Deploy

A VPS de produção já roda outros serviços (CRM). O passo a passo completo
— aditivo, sem tocar em nada que já existe — está em
[`deploy/DEPLOY.md`](deploy/DEPLOY.md).
