# PROJETOS - Portfólio Front-end

Repositório monorepo contendo três projetos front-end modernos construídos com React, TypeScript e Tailwind CSS.

## Projetos

| Projeto | Descrição | Demo |
|---------|-----------|------|
| [Admin Dashboard](./admin-dashboard) | Dashboard administrativo com autenticação e CRUD | Em breve |
| [NEONSHOP](./ecommerce-front) | E-commerce futurista com carrinho e checkout | Em breve |
| [Nile Chat](./chat-ui) | Chat em tempo real com tema egípcio | Em breve |

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
└── chat-ui/
    ├── src/
    │   ├── components/     # Componentes UI (Chat, Message, Thread)
    │   ├── hooks/          # Custom hooks (useMessages, useThreads)
    │   ├── lib/            # FakeSocket, queryKeys, utils
    │   ├── pages/          # Páginas da aplicação
    │   ├── store/          # Zustand stores
    │   └── types/          # TypeScript types
    └── ...
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

---

## 📄 Licença

MIT
