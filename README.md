# PROJETOS - Portfólio Full-Stack

Repositório monorepo contendo cinco projetos modernos construídos com React, TypeScript, Python e tecnologias modernas.

## Projetos

| Projeto | Descrição | Demo |
|---------|-----------|------|
| [Admin Dashboard](./admin-dashboard) | Dashboard administrativo com autenticação e CRUD | Em breve |
| [NEONSHOP](./ecommerce-front) | E-commerce futurista com carrinho e checkout | Em breve |
| [Nile Chat](./chat-ui) | Chat em tempo real com tema egípcio | Em breve |
| [Observability Kit](./observability-kit) | Solução de observabilidade para React | Em breve |
| [RAG Assistant](./rag-assistant) | Assistente IA para documentos PDF com RAG | Em breve |

---

## 📊 Admin Dashboard

Dashboard administrativo moderno para gerenciamento de usuários e produtos.

### Features
- **Autenticação** - Login com validação, proteção de rotas, token em LocalStorage
- **Dashboard** - Métricas em tempo real com indicadores de tendência
- **CRUD Usuários** - Listagem paginada, busca, filtros, criação/edição/exclusão
- **CRUD Produtos** - Listagem paginada, busca, filtros, criação/edição/exclusão

### Credenciais Demo
- **Email:** admin@demo.com
- **Senha:** 123456

---

## 🛒 NEONSHOP - E-commerce

E-commerce com design futurista cyberpunk/neon e experiência de usuário fluida.

### Features
- **Catálogo** - Grid responsivo com skeleton loading
- **Busca e Filtros** - Categoria, faixa de preço, ordenação
- **Carrinho** - Adicionar, remover, atualizar quantidades, persistência em LocalStorage
- **Checkout** - Formulário com validação e simulação de pedido
- **Toast Notifications** - Feedback visual para todas as ações

---

## 🏛️ Nile Chat - Messenger

Aplicação de chat em tempo real com tema egípcio elegante (ouro, lápis-lazúli e papiro).

### Features
- **Mensagens em Tempo Real** - WebSocket simulado com indicadores de digitação
- **Optimistic Updates** - Mensagens aparecem instantaneamente antes da confirmação
- **Infinite Scroll** - Carregamento de mensagens antigas de forma fluida
- **Cache Persistente** - Mensagens sobrevivem ao refresh da página
- **Status de Mensagem** - Enviando → Enviada → Entregue → Lida
- **Respostas Automáticas** - Simulação de atividade de outros usuários

---

## 𝒞 Observability Kit

Solução completa de observabilidade para aplicações React com design temático egípcio ("Temple of Insights").

### Features
- **Error Boundary** - Tratamento gracioso de erros com retry
- **Logger Sentry-like** - Sistema de logging com contexto automático
- **Web Vitals** - Monitoramento de Core Web Vitals (LCP, FID, CLS, FCP, TTFB)
- **Páginas de Erro** - 404, 500 e offline com design egípcio
- **Dashboard Admin** - Visualização de logs e métricas de performance
- **Sanitização de Dados** - Redação automática de dados sensíveis
- **Correlação de Sessão** - Todos os eventos vinculados por session ID

---

## 🤖 RAG Assistant

Assistente inteligente para documentos PDF com Retrieval-Augmented Generation (RAG).

### Features
- **Upload de PDFs** - Processamento assíncrono com extração de texto
- **Busca Semântica** - Embeddings vetoriais com pgvector
- **Chat Inteligente** - Respostas baseadas em evidências do documento
- **Citações Precisas** - Referência a documento e página
- **Detecção de Baixa Confiança** - Resposta "não sei" quando apropriado
- **Métricas** - Latência, custo e uso de tokens

### Credenciais Demo
- **Senha Admin:** admin123

---

## 🛠️ Tech Stack Compartilhada

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 19 | UI Library |
| TypeScript | 5.9 | Type Safety |
| Vite | 8 | Build Tool |
| Tailwind CSS | 4 | Estilização |
| React Router | 7 | Navegação SPA |
| React Hook Form | 7 | Formulários |
| Zod | 4 | Validação de Schema |
| Vitest | 4 | Testes Unitários |
| Testing Library | - | Testes de Componentes |

### Adicional (Admin Dashboard)
- **TanStack Query v5** - Gerenciamento de estado do servidor
- **JSON Server** - Mock API

### Adicional (Nile Chat)
- **TanStack Query v5** - Data fetching, cache e persistência
- **Zustand** - Gerenciamento de estado UI
- **FakeSocket** - Simulação de WebSocket (EventEmitter pattern)

### Adicional (Observability Kit)
- **Web Vitals** - Biblioteca oficial para métricas de performance
- **UUID** - Geração de IDs únicos para sessões e eventos

### RAG Assistant (Full-Stack)
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, Alembic
- **Frontend:** Next.js 14, TypeScript
- **Database:** PostgreSQL 16 + pgvector
- **AI:** OpenAI API (GPT-4o-mini, text-embedding-3-small)
- **Infra:** Docker, Docker Compose

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Admin Dashboard

```bash
# Entrar no diretório
cd admin-dashboard

# Instalar dependências
npm install

# Executar API mock + front-end (recomendado)
npm run dev:full

# Ou executar separadamente:
npm run server   # API mock na porta 3001
npm run dev      # Front-end na porta 5173
```

### NEONSHOP (E-commerce)

```bash
# Entrar no diretório
cd ecommerce-front

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### Nile Chat

```bash
# Entrar no diretório
cd chat-ui

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### Observability Kit

```bash
# Entrar no diretório
cd observability-kit

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

### RAG Assistant

```bash
# Entrar no diretório
cd rag-assistant

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env e adicionar OPENAI_API_KEY

# Subir containers (PostgreSQL + Backend + Frontend)
docker compose up -d

# Acessar:
# Chat: http://localhost:3000/chat
# Admin: http://localhost:3000/login
# API Docs: http://localhost:8000/docs
```

---

## 📁 Estrutura dos Projetos

```
PROJETOS/
├── admin-dashboard/
│   ├── src/
│   │   ├── components/     # Componentes UI e Layout
│   │   ├── features/       # Autenticação, rotas protegidas
│   │   ├── lib/            # Schemas, types, utils
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── test/           # Testes
│   └── db.json             # Mock database
│
├── ecommerce-front/
│   ├── src/
│   │   ├── components/     # Componentes UI, Layout, Product
│   │   ├── context/        # Contextos (Cart, Toast)
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   ├── test/           # Testes
│   │   └── types/          # TypeScript types
│   └── ...
│
├── chat-ui/
│   ├── src/
│   │   ├── components/     # Componentes UI (Chat, Message, Thread)
│   │   ├── hooks/          # Custom hooks (useMessages, useThreads)
│   │   ├── lib/            # FakeSocket, queryKeys, utils
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── store/          # Zustand stores
│   │   └── types/          # TypeScript types
│   └── ...
│
├── observability-kit/
│   ├── src/
│   │   ├── components/     # ErrorBoundary, Layout, Admin
│   │   ├── lib/            # Logger, WebVitals, Config
│   │   └── pages/          # Home, Demo, Observability
│   └── ...
│
└── rag-assistant/
    ├── backend/
    │   ├── app/            # FastAPI (api, models, services)
    │   ├── alembic/        # Migrações do banco
    │   └── tests/          # Testes pytest
    ├── frontend/
    │   └── src/            # Next.js (app, lib, types)
    └── docker-compose.yml
```

---

## 🧪 Testes

```bash
# Admin Dashboard
cd admin-dashboard
npm test              # Executar testes
npm run test:ui       # Interface visual
npm run test:coverage # Relatório de cobertura

# E-commerce
cd ecommerce-front
npm test              # Executar testes
npm run test:ui       # Interface visual
npm run coverage      # Relatório de cobertura

# Nile Chat
cd chat-ui
npm test              # Executar testes
npm run test:ui       # Interface visual
npm run test:coverage # Relatório de cobertura

# Observability Kit
cd observability-kit
npm test              # Executar testes
npm run test:run      # Executar testes uma vez
npm run test:coverage # Relatório de cobertura

# RAG Assistant
cd rag-assistant
docker compose exec backend pytest  # Testes do backend
```

---

## 📦 Build para Produção

```bash
# Admin Dashboard
cd admin-dashboard
npm run build
npm run preview  # Visualizar build local

# E-commerce
cd ecommerce-front
npm run build
npm run preview  # Visualizar build local

# Nile Chat
cd chat-ui
npm run build
npm run preview  # Visualizar build local

# Observability Kit
cd observability-kit
npm run build
npm run preview  # Visualizar build local

# RAG Assistant
cd rag-assistant
docker compose up -d --build  # Build e iniciar containers
```

---

## 📝 Scripts Disponíveis

### Admin Dashboard
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run server` | Inicia o JSON Server (API mock) |
| `npm run dev:full` | Inicia API + front-end simultaneamente |
| `npm run build` | Build de produção |
| `npm run test` | Executa testes |
| `npm run lint` | Verifica código com ESLint |
| `npm run format` | Formata código com Prettier |

### E-commerce
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Executa testes |
| `npm run lint` | Verifica código com ESLint |

### Nile Chat
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Executa testes |
| `npm run test:ui` | Interface visual de testes |
| `npm run test:coverage` | Relatório de cobertura |
| `npm run lint` | Verifica código com ESLint |

### Observability Kit
| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run test` | Executa testes em modo watch |
| `npm run test:run` | Executa testes uma vez |
| `npm run test:coverage` | Relatório de cobertura |
| `npm run lint` | Verifica código com ESLint |

### RAG Assistant
| Comando | Descrição |
|---------|-----------|
| `docker compose up -d` | Inicia todos os serviços |
| `docker compose down` | Para todos os serviços |
| `docker compose logs -f` | Ver logs em tempo real |
| `docker compose exec backend pytest` | Executar testes |

---

## 📄 Licença

MIT
