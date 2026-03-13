# Admin Dashboard

Dashboard administrativo moderno construído com React, TypeScript e Tailwind CSS.

## Demo

- **Deploy**: [Em breve]
- **Usuário demo**: admin@demo.com
- **Senha demo**: 123456

## Sobre

Projeto front-end construído com React + TypeScript para simular um cenário real de dashboard administrativo, com foco em formulários, consumo de API e boas práticas de desenvolvimento.

## Stack

- **React 19** + **Vite** + **TypeScript**
- **Tailwind CSS v4** - Estilização utility-first
- **React Router v7** - Navegação SPA
- **TanStack Query v5** - Gerenciamento de estado do servidor
- **React Hook Form** + **Zod** - Formulários com validação
- **Vitest** + **Testing Library** - Testes automatizados
- **Lucide React** - Ícones

## Funcionalidades

### Autenticação
- Login com validação de formulário (React Hook Form + Zod)
- Proteção de rotas (redirect automático para login)
- Token salvo no LocalStorage
- Logout com limpeza de sessão

### Dashboard
- Métricas em tempo real (usuários, produtos, receita)
- Cards com indicadores de tendência
- Ações rápidas para navegação

### CRUD de Usuários
- Listagem com tabela paginada
- Busca por nome/email
- Filtros por cargo e status
- Criar/editar via modal com validação
- Exclusão com confirmação

### CRUD de Produtos
- Listagem com tabela paginada
- Busca por nome
- Filtros por categoria e status
- Criar/editar via modal com validação
- Exclusão com confirmação
- Indicadores de estoque (baixo/zerado)

### Qualidade & UX
- Estados de loading, erro e vazio
- Acessibilidade: labels, foco em modais, navegação por teclado
- Design responsivo
- Feedback visual para ações

## Como rodar

```bash
# Instalar dependências
npm install

# Rodar mock API (json-server)
npm run server

# Em outro terminal, rodar o app
npm run dev

# Ou rodar ambos juntos (requer concurrently)
npm run dev:full
```

Acesse http://localhost:5173

## Testes

```bash
# Rodar testes
npm test

# Rodar testes com UI
npm run test:ui

# Rodar testes com coverage
npm run test:coverage
```

## Estrutura de Pastas

```
src/
├── components/
│   ├── layout/          # AppLayout, Sidebar, Header
│   └── ui/              # Button, Input, Modal, Table, etc.
├── features/
│   └── auth/            # AuthContext, ProtectedRoute
├── lib/
│   ├── types.ts         # Tipos TypeScript
│   ├── schemas.ts       # Schemas Zod
│   └── utils.ts         # Utilitários
├── pages/
│   ├── login/           # Página de login
│   └── app/
│       ├── dashboard/   # Dashboard com métricas
│       ├── users/       # CRUD de usuários
│       └── products/    # CRUD de produtos
├── services/
│   └── api.ts           # Cliente API
├── test/
│   ├── setup.ts         # Configuração Vitest
│   ├── auth.test.tsx    # Testes de autenticação
│   └── users.test.tsx   # Testes do CRUD de usuários
├── App.tsx              # Rotas
├── main.tsx             # Entry point com providers
└── index.css            # Estilos globais + Tailwind
```

## Decisões Técnicas

- **Vite** escolhido por ser mais rápido que CRA e ter melhor DX
- **Tailwind v4** para estilização rápida e consistente com CSS-in-JS
- **TanStack Query** para cache inteligente e sincronização com servidor
- **React Hook Form + Zod** para formulários performáticos com validação type-safe
- **json-server** como mock API para desenvolvimento sem backend
- **Arquitetura por features** para melhor organização e escalabilidade
- **Componentes UI abstraídos** para reutilização e consistência visual

## Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Executa ESLint |
| `npm run format` | Formata código com Prettier |
| `npm run test` | Executa testes |
| `npm run server` | Inicia json-server (mock API) |

## Deploy

Para deploy na Vercel:

1. Conecte o repositório à Vercel
2. Configure build command: `npm run build`
3. Configure output directory: `dist`
4. Deploy!

## Licença

MIT
