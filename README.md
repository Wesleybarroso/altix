# ⚡ ALTIX - Enterprise SaaS Monitoring Platform

> **Slogan:** Monitoramento inteligente. Disponibilidade em tempo real.  
> *Veja antes dos seus clientes quando algo sair do ar.*

---

## 🚀 Sobre o ALTIX

O **ALTIX** é uma plataforma SaaS enterprise de monitoramento distribuído de disponibilidade para sites, APIs, servidores, certificados SSL, registros DNS e infraestruturas em nuvem. Inspirada nas melhores interfaces do mundo (Vercel, Linear, Stripe, Better Stack, Datadog e Grafana Cloud), a aplicação oferece propagação de eventos em tempo real com **latência inferior a 1 segundo** entre a verificação e a atualização dos dashboards via Redis Pub/Sub e WebSockets.

---

## ✨ Funcionalidades Principais

- **Monitoramento Multiprotocolo**:
  - HTTP / HTTPS (REST API & GraphQL com suporte a status code e retornos esperados).
  - Certificados SSL / TLS (Contagem de dias restantes para expiração e cadeia de emissão).
  - DNS & WHOIS (Resolução de nomes A/AAAA/CNAME/MX/TXT).
  - Conectividade TCP Port, UDP e ICMP Ping.
  - Bancos de Dados (PostgreSQL, Redis, MySQL, MongoDB) e Containers (Docker, Kubernetes).
- **Notificações Instantâneas Multicanal**:
  - WhatsApp (Meta Cloud API e Evolution API).
  - Telegram Bot API (Grupos, Canais e Chats).
  - Discord Webhooks (Embeds customizados com cores dinâmicas).
  - Slack, E-mail (Resend, AWS SES, SMTP) e Webhooks customizados.
- **Painéis & Interface Premium**:
  - **Executive Real-Time Dashboard**: Gráficos de latência em tempo real, cartões KPI, barras de histórico de 90 dias estilo Linear.
  - **Modo TV (NOC Wall Display)**: Painel de operações em tela cheia otimizado para monitores de controle.
  - **Command Palette (`Cmd + K`)**: Modal Raycast para navegação ultra-rápida.
  - **Página Pública de Status**: Status Page customizável para clientes verificarem a saúde da infraestrutura.
- **Inteligência Artificial Integrada**:
  - Diagnóstico automático com IA para identificação de causa raiz de incidentes (ex: certificados expirados, falhas de proxy upstream ou propagação DNS).
- **Segurança & Multi-Tenant**:
  - Isolamento de organizações, autenticação JWT com Refresh Tokens, 2FA (TOTP/Authenticator), suporte a OAuth (Google, GitHub, Microsoft) e RBAC (Owner, Admin, Member, Viewer).

---

## 🛠️ Arquitetura do Projeto

```
altix/
├── docker-compose.yml              # Orquestração completa local (PostgreSQL, Redis, Go Engine, Web)
├── package.json                    # Workspace Monorepo
├── apps/
│   ├── web/                        # Frontend Next.js 15 (React 19, Tailwind CSS, Recharts, Framer Motion)
│   ├── backend-go/                 # Engine Distribuída em Go (Golang worker pool, SSL/DNS/HTTP checker, Redis Pub/Sub)
│   └── api/                        # API Gateway Node.js/TypeScript REST & WebSocket Stream
```

---

## ⚡ Como Executar o Projeto

### Opção 1: Via Docker Compose (Recomendado)

```bash
docker-compose up --build
```
- **Web App**: `http://localhost:3000`
- **API Gateway & WebSockets**: `http://localhost:4000`
- **PostgreSQL**: `localhost:5432`
- **Redis**: `localhost:6379`

### Opção 2: Execução em Modo de Desenvolvimento Local

1. Instalar as dependências do monorepo:
   ```bash
   npm install
   ```

2. Iniciar o Frontend Web:
   ```bash
   npm run dev
   ```

3. Iniciar o API Gateway & WebSockets:
   ```bash
   npm run dev:api
   ```

4. Executar o Engine Worker Go:
   ```bash
   cd apps/backend-go
   go run cmd/engine/main.go
   ```

---

## 🎨 Cores da Identidade Visual

- **Verde Principal**: `#00C853`
- **Verde Secundário**: `#00E676`
- **Verde Escuro**: `#008F5A`
- **Offline / Incidentes**: `#FF3B30`
- **Alertas**: `#FFC107`
- **Background (Dark Mode)**: `#0F172A`
- **Cards (Dark Mode)**: `#111827`
